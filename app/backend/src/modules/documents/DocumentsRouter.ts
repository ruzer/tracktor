import { Router } from "express";
import { DocumentsController } from "./DocumentsController.js";

/**
 * Crea y configura el router para el módulo de documentos
 */
export function createDocumentsRouter(controller: DocumentsController): Router {
  const router = Router();

  // Obtener el router del controlador que ya tiene todas las rutas configuradas
  const controllerRouter = controller.getRouter();
  
  // Montar todas las rutas del controlador
  router.use("/", controllerRouter);

  return router;
}

/**
 * Configuración de rutas del DocumentsModule
 */
export const documentsRoutes = {
  // Rutas de test y estado
  test: "GET /test",
  status: "GET /status",
  reportTypes: "GET /reports",

  // Rutas PUCC
  createPUCC: "POST /pucc",
  getPUCCById: "GET /pucc/:id",
  getPUCCByVehicle: "GET /vehicle/:vehicleId/pucc",
  updatePUCC: "PUT /pucc/:id",
  deletePUCC: "DELETE /pucc/:id",

  // Rutas de impuestos
  createTax: "POST /taxes",
  getTaxById: "GET /taxes/:id",
  getTaxesByVehicle: "GET /vehicle/:vehicleId/taxes",
  updateTax: "PUT /taxes/:id",
  markTaxAsPaid: "PATCH /taxes/:id/pay",
  deleteTax: "DELETE /taxes/:id",

  // Rutas de documentos
  createDocument: "POST /documents",
  getDocumentById: "GET /documents/:id",
  getDocumentsByVehicle: "GET /vehicle/:vehicleId/documents",
  updateDocument: "PUT /documents/:id",
  deleteDocument: "DELETE /documents/:id",

  // Rutas de reportes
  generateReport: "GET /reports/:type"
};

/**
 * Descripción de endpoints disponibles
 */
export const documentsEndpoints = {
  description: "DocumentsModule - Gestión de documentos vehiculares",
  baseUrl: "/api/modules-routes/documents",
  endpoints: [
    {
      method: "GET",
      path: "/test",
      description: "Endpoint de prueba del módulo"
    },
    {
      method: "GET", 
      path: "/status",
      description: "Estado del módulo"
    },
    {
      method: "GET",
      path: "/reports",
      description: "Tipos de reportes disponibles"
    },
    {
      method: "POST",
      path: "/pucc",
      description: "Crear certificado PUCC",
      body: {
        vehicleId: "string",
        certificateNumber: "string",
        issueDate: "string (ISO)",
        expiryDate: "string (ISO)",
        testingCenter: "string",
        notes: "string (opcional)"
      }
    },
    {
      method: "GET",
      path: "/pucc/:id",
      description: "Obtener certificado PUCC por ID"
    },
    {
      method: "GET",
      path: "/vehicle/:vehicleId/pucc",
      description: "Obtener certificados PUCC de un vehículo"
    },
    {
      method: "PUT",
      path: "/pucc/:id",
      description: "Actualizar certificado PUCC"
    },
    {
      method: "DELETE",
      path: "/pucc/:id",
      description: "Eliminar certificado PUCC"
    },
    {
      method: "POST",
      path: "/taxes",
      description: "Crear impuesto",
      body: {
        vehicleId: "string",
        type: "string",
        year: "number",
        amount: "number",
        paid: "boolean (opcional)",
        paidDate: "string (ISO, opcional)",
        receiptFolio: "string (opcional)",
        notes: "string (opcional)"
      }
    },
    {
      method: "GET",
      path: "/taxes/:id",
      description: "Obtener impuesto por ID"
    },
    {
      method: "GET",
      path: "/vehicle/:vehicleId/taxes",
      description: "Obtener impuestos de un vehículo"
    },
    {
      method: "PUT",
      path: "/taxes/:id",
      description: "Actualizar impuesto"
    },
    {
      method: "PATCH",
      path: "/taxes/:id/pay",
      description: "Marcar impuesto como pagado",
      body: {
        paidDate: "string (ISO, opcional)"
      }
    },
    {
      method: "DELETE",
      path: "/taxes/:id",
      description: "Eliminar impuesto"
    },
    {
      method: "POST",
      path: "/documents",
      description: "Crear documento",
      body: {
        vehicleId: "string",
        docType: "string",
        issueDate: "string (ISO, opcional)",
        expiryDate: "string (ISO, opcional)",
        filePath: "string (opcional)",
        notes: "string (opcional)"
      }
    },
    {
      method: "GET",
      path: "/documents/:id",
      description: "Obtener documento por ID"
    },
    {
      method: "GET",
      path: "/vehicle/:vehicleId/documents",
      description: "Obtener documentos de un vehículo"
    },
    {
      method: "PUT",
      path: "/documents/:id",
      description: "Actualizar documento"
    },
    {
      method: "DELETE",
      path: "/documents/:id",
      description: "Eliminar documento"
    },
    {
      method: "GET",
      path: "/reports/:type",
      description: "Generar reporte",
      params: {
        type: "pucc-summary | tax-summary | document-summary"
      },
      query: {
        vehicleId: "string (opcional)",
        startDate: "string (ISO, opcional)",
        endDate: "string (ISO, opcional)"
      }
    }
  ]
};