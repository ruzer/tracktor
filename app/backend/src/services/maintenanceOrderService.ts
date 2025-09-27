import { db } from "@db/index.js";
import {
  maintenanceOrderHistoryTable,
  maintenanceOrderTable,
  vehicleTable,
  workshopTable,
} from "@db/schema/index.js";
import { MaintenanceOrderError } from "@exceptions/MaintenanceOrderError.js";
import { Status } from "@exceptions/ServiceError.js";
import { eq, inArray, desc, and } from "drizzle-orm";

export type MaintenanceOrderStatus =
  | "pending_review"
  | "quotation"
  | "authorized"
  | "rejected"
  | "in_workshop"
  | "in_repair"
  | "repaired_pending_payment"
  | "closed";

export type MaintenancePaymentStatus = "pending" | "partial" | "paid";

const ORDER_STATUSES: MaintenanceOrderStatus[] = [
  "pending_review",
  "quotation",
  "authorized",
  "rejected",
  "in_workshop",
  "in_repair",
  "repaired_pending_payment",
  "closed",
];

const PAYMENT_STATUSES: MaintenancePaymentStatus[] = [
  "pending",
  "partial",
  "paid",
];

type WorkshopPayload = {
  name: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  notes?: string;
};

const ensureValidStatus = (status: MaintenanceOrderStatus | undefined) => {
  if (!status) return;
  if (!ORDER_STATUSES.includes(status)) {
    throw new MaintenanceOrderError(
      `Invalid maintenance order status: ${status}`,
      Status.BAD_REQUEST,
    );
  }
};

const ensureValidPaymentStatus = (
  paymentStatus: MaintenancePaymentStatus | undefined,
) => {
  if (!paymentStatus) return;
  if (!PAYMENT_STATUSES.includes(paymentStatus)) {
    throw new MaintenanceOrderError(
      `Invalid payment status: ${paymentStatus}`,
      Status.BAD_REQUEST,
    );
  }
};

const upsertWorkshop = async (
  payload?: WorkshopPayload | null,
  workshopId?: string | null,
) => {
  if (workshopId) {
    return workshopId;
  }

  if (!payload?.name) {
    return undefined;
  }

  const [workshop] = await db
    .insert(workshopTable)
    .values({
      name: payload.name,
      contactName: payload.contactName,
      contactPhone: payload.contactPhone,
      contactEmail: payload.contactEmail,
      address: payload.address,
      notes: payload.notes,
    })
    .returning({ id: workshopTable.id });

  return workshop?.id;
};

const getVehicleOrThrow = async (vehicleId: string) => {
  const vehicle = await db.query.vehicleTable.findFirst({
    where: (vehicles, { eq }) => eq(vehicles.id, vehicleId),
  });
  if (!vehicle) {
    throw new MaintenanceOrderError(
      `Vehicle ${vehicleId} not found`,
      Status.NOT_FOUND,
    );
  }
};

const mapOrderRow = (row: {
  order: typeof maintenanceOrderTable.$inferSelect;
  workshop: typeof workshopTable.$inferSelect | null;
  vehicle?: typeof vehicleTable.$inferSelect | null;
  history?: Array<typeof maintenanceOrderHistoryTable.$inferSelect>;
}) => {
  const { order, workshop, vehicle, history = [] } = row;
  return {
    ...order,
    workshop,
    vehicle,
    history: history
      .map((entry) => ({
        ...entry,
      }))
      .sort((a, b) => (a.created_at > b.created_at ? -1 : 1)),
  };
};

const attachHistoryToOrders = async (
  orders: Array<{
    order: typeof maintenanceOrderTable.$inferSelect;
    workshop: typeof workshopTable.$inferSelect | null;
    vehicle?: typeof vehicleTable.$inferSelect | null;
  }>,
) => {
  if (orders.length === 0) return [];

  const orderIds = orders.map(({ order }) => order.id);
  const historyRecords = await db
    .select()
    .from(maintenanceOrderHistoryTable)
    .where(inArray(maintenanceOrderHistoryTable.orderId, orderIds));

  const historyMap = new Map<string, typeof historyRecords>();
  for (const history of historyRecords) {
    const bucket = historyMap.get(history.orderId) ?? [];
    bucket.push(history);
    historyMap.set(history.orderId, bucket);
  }

  return orders.map((row) =>
    mapOrderRow({
      ...row,
      history: historyMap.get(row.order.id) ?? [],
    }),
  );
};

export const listMaintenanceOrders = async () => {
  const orders = await db
    .select({
      order: maintenanceOrderTable,
      workshop: workshopTable,
      vehicle: vehicleTable,
    })
    .from(maintenanceOrderTable)
    .leftJoin(
      workshopTable,
      eq(workshopTable.id, maintenanceOrderTable.workshopId),
    )
    .leftJoin(vehicleTable, eq(vehicleTable.id, maintenanceOrderTable.vehicleId))
    .orderBy(desc(maintenanceOrderTable.created_at));

  return attachHistoryToOrders(orders);
};

export const createMaintenanceOrder = async (
  vehicleId: string,
  payload: {
    reportedIssue: string;
    createdBy: string;
    status?: MaintenanceOrderStatus;
    workshopId?: string;
    workshop?: WorkshopPayload;
    notes?: string;
  },
) => {
  if (!payload.reportedIssue) {
    throw new MaintenanceOrderError(
      "reportedIssue is required",
      Status.BAD_REQUEST,
    );
  }
  if (!payload.createdBy) {
    throw new MaintenanceOrderError(
      "createdBy is required",
      Status.BAD_REQUEST,
    );
  }

  await getVehicleOrThrow(vehicleId);
  ensureValidStatus(payload.status);

  const workshopId = await upsertWorkshop(payload.workshop, payload.workshopId);

  const [order] = await db
    .insert(maintenanceOrderTable)
    .values({
      vehicleId,
      reportedIssue: payload.reportedIssue,
      createdBy: payload.createdBy,
      status: payload.status ?? "pending_review",
      workshopId,
    })
    .returning();

  if (!order) {
    throw new MaintenanceOrderError(
      "Maintenance order could not be created",
      Status.INTERNAL_SERVER_ERROR,
    );
  }

  await db.insert(maintenanceOrderHistoryTable).values({
    orderId: order.id,
    status: order.status,
    notes: payload.notes,
    userId: payload.createdBy,
  });

  return getMaintenanceOrderById(order.id);
};

export const getMaintenanceOrdersByVehicle = async (vehicleId: string) => {
  await getVehicleOrThrow(vehicleId);

  const orders = await db
    .select({
      order: maintenanceOrderTable,
      workshop: workshopTable,
      vehicle: vehicleTable,
    })
    .from(maintenanceOrderTable)
    .leftJoin(
      workshopTable,
      eq(workshopTable.id, maintenanceOrderTable.workshopId),
    )
    .leftJoin(vehicleTable, eq(vehicleTable.id, maintenanceOrderTable.vehicleId))
    .where(eq(maintenanceOrderTable.vehicleId, vehicleId))
    .orderBy(desc(maintenanceOrderTable.created_at));

  return attachHistoryToOrders(orders);
};

export const getMaintenanceOrderById = async (orderId: string) => {
  const [row] = await db
    .select({
      order: maintenanceOrderTable,
      workshop: workshopTable,
      vehicle: vehicleTable,
    })
    .from(maintenanceOrderTable)
    .leftJoin(
      workshopTable,
      eq(workshopTable.id, maintenanceOrderTable.workshopId),
    )
    .leftJoin(vehicleTable, eq(vehicleTable.id, maintenanceOrderTable.vehicleId))
    .where(eq(maintenanceOrderTable.id, orderId));

  if (!row) {
    throw new MaintenanceOrderError(
      `Maintenance order ${orderId} not found`,
      Status.NOT_FOUND,
    );
  }

  const history = await db
    .select()
    .from(maintenanceOrderHistoryTable)
    .where(eq(maintenanceOrderHistoryTable.orderId, orderId))
    .orderBy(desc(maintenanceOrderHistoryTable.created_at));

  return mapOrderRow({ ...row, history });
};

export const updateMaintenanceOrder = async (
  orderId: string,
  payload: {
    status?: MaintenanceOrderStatus;
    notes?: string;
    userId?: string;
    workshopId?: string;
    workshop?: WorkshopPayload;
    quoteFile?: string;
    invoiceFile?: string;
    authorizedBy?: string;
    authorizedAt?: string;
    totalEstimated?: number;
    totalFinal?: number;
    paymentStatus?: MaintenancePaymentStatus;
  },
) => {
  const existing = await getMaintenanceOrderById(orderId);

  ensureValidStatus(payload.status);
  ensureValidPaymentStatus(payload.paymentStatus);

  const workshopId = await upsertWorkshop(payload.workshop, payload.workshopId);

  await db
    .update(maintenanceOrderTable)
    .set({
      status: payload.status ?? existing.status,
      workshopId: workshopId ?? existing.workshopId ?? undefined,
      quoteFile: payload.quoteFile ?? existing.quoteFile ?? undefined,
      invoiceFile: payload.invoiceFile ?? existing.invoiceFile ?? undefined,
      authorizedBy: payload.authorizedBy ?? existing.authorizedBy ?? undefined,
      authorizedAt: payload.authorizedAt ?? existing.authorizedAt ?? undefined,
      totalEstimated:
        payload.totalEstimated !== undefined
          ? payload.totalEstimated
          : existing.totalEstimated ?? undefined,
      totalFinal:
        payload.totalFinal !== undefined
          ? payload.totalFinal
          : existing.totalFinal ?? undefined,
      paymentStatus: payload.paymentStatus ?? existing.paymentStatus,
    })
    .where(eq(maintenanceOrderTable.id, orderId));

  if (payload.status && payload.status !== existing.status) {
    await db.insert(maintenanceOrderHistoryTable).values({
      orderId,
      status: payload.status,
      notes: payload.notes,
      userId: payload.userId,
    });
  } else if (payload.notes) {
    await db.insert(maintenanceOrderHistoryTable).values({
      orderId,
      status: existing.status,
      notes: payload.notes,
      userId: payload.userId,
    });
  }

  return getMaintenanceOrderById(orderId);
};

export const addMaintenanceOrderHistory = async (
  orderId: string,
  payload: {
    status: MaintenanceOrderStatus;
    notes?: string;
    userId?: string;
  },
) => {
  ensureValidStatus(payload.status);

  const order = await db
    .select()
    .from(maintenanceOrderTable)
    .where(eq(maintenanceOrderTable.id, orderId));

  if (order.length === 0) {
    throw new MaintenanceOrderError(
      `Maintenance order ${orderId} not found`,
      Status.NOT_FOUND,
    );
  }

  await db.insert(maintenanceOrderHistoryTable).values({
    orderId,
    status: payload.status,
    notes: payload.notes,
    userId: payload.userId,
  });

  await db
    .update(maintenanceOrderTable)
    .set({ status: payload.status })
    .where(eq(maintenanceOrderTable.id, orderId));

  return getMaintenanceOrderById(orderId);
};

export const deleteMaintenanceOrder = async (orderId: string, vehicleId: string) => {
  const result = await db
    .delete(maintenanceOrderTable)
    .where(
      and(
        eq(maintenanceOrderTable.id, orderId),
        eq(maintenanceOrderTable.vehicleId, vehicleId),
      ),
    )
    .returning({ id: maintenanceOrderTable.id });

  if (result.length === 0) {
    throw new MaintenanceOrderError(
      `Maintenance order ${orderId} not found for vehicle ${vehicleId}`,
      Status.NOT_FOUND,
    );
  }

  return { id: orderId, message: "Maintenance order deleted successfully." };
};

export const deleteMaintenanceOrderById = async (orderId: string) => {
  const existing = await db
    .select({ vehicleId: maintenanceOrderTable.vehicleId })
    .from(maintenanceOrderTable)
    .where(eq(maintenanceOrderTable.id, orderId));

  if (existing.length === 0) {
    throw new MaintenanceOrderError(
      `Maintenance order ${orderId} not found`,
      Status.NOT_FOUND,
    );
  }

  const vehicleId = existing[0]?.vehicleId;
  if (!vehicleId) {
    throw new MaintenanceOrderError(
      `Maintenance order ${orderId} is missing vehicle reference`,
      Status.INTERNAL_SERVER_ERROR,
    );
  }

  return deleteMaintenanceOrder(orderId, vehicleId);
};
