import { Request, Response } from "express";
import {
  addMaintenanceOrderHistory,
  createMaintenanceOrder,
  deleteMaintenanceOrder,
  getMaintenanceOrderById,
  getMaintenanceOrdersByVehicle,
  updateMaintenanceOrder,
} from "@services/maintenanceOrderService.js";
import { MaintenanceOrderError } from "@exceptions/MaintenanceOrderError.js";
import { Status } from "@exceptions/ServiceError.js";

export const createOrder = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  const { reportedIssue, createdBy, status, workshopId, workshop, notes } = req.body;

  if (!vehicleId) {
    throw new MaintenanceOrderError("Vehicle ID is required.", Status.BAD_REQUEST);
  }

  const order = await createMaintenanceOrder(vehicleId, {
    reportedIssue,
    createdBy,
    status,
    workshopId,
    workshop,
    notes,
  });

  res.status(201).json(order);
};

export const listOrders = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  if (!vehicleId) {
    throw new MaintenanceOrderError("Vehicle ID is required.", Status.BAD_REQUEST);
  }

  const orders = await getMaintenanceOrdersByVehicle(vehicleId);
  res.status(200).json(orders);
};

export const getOrder = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  if (!orderId) {
    throw new MaintenanceOrderError("Order ID is required.", Status.BAD_REQUEST);
  }

  const order = await getMaintenanceOrderById(orderId);
  res.status(200).json(order);
};

export const patchOrder = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  if (!orderId) {
    throw new MaintenanceOrderError("Order ID is required.", Status.BAD_REQUEST);
  }

  const order = await updateMaintenanceOrder(orderId, req.body ?? {});
  res.status(200).json(order);
};

export const appendHistory = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  if (!orderId) {
    throw new MaintenanceOrderError("Order ID is required.", Status.BAD_REQUEST);
  }

  const { status, notes, userId } = req.body ?? {};
  if (!status) {
    throw new MaintenanceOrderError(
      "status is required to add history entry.",
      Status.BAD_REQUEST,
    );
  }

  const order = await addMaintenanceOrderHistory(orderId, { status, notes, userId });
  res.status(201).json(order);
};

export const removeOrder = async (req: Request, res: Response) => {
  const { vehicleId, orderId } = req.params;
  if (!vehicleId || !orderId) {
    throw new MaintenanceOrderError(
      "Vehicle ID and Order ID are required.",
      Status.BAD_REQUEST,
    );
  }

  const result = await deleteMaintenanceOrder(orderId, vehicleId);
  res.status(200).json(result);
};
