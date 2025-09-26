import { Router } from 'express';
import { AssignmentController } from './AssignmentController.js';

export function assignmentRoutes(controller: AssignmentController): Router {
  const router = Router();

  // Rutas de prueba y estado
  router.get('/test', controller.test.bind(controller));
  router.get('/status', controller.getStatus.bind(controller));
  
  // Rutas de reportes
  router.get('/reports', controller.getReports.bind(controller));
  router.get('/reports/assignment-summary', controller.generateAssignmentSummaryReport.bind(controller));
  router.get('/reports/current-assignments', controller.generateCurrentAssignmentsReport.bind(controller));
  router.get('/reports/assignment-history', controller.generateAssignmentHistoryReport.bind(controller));
  
  // Rutas CRUD para asignaciones por vehículo
  router.get('/vehicle/:vehicleId/assignments', controller.getAssignmentsByVehicle.bind(controller));
  router.post('/vehicle/:vehicleId/assignments', controller.createAssignment.bind(controller));
  router.patch('/vehicle/:vehicleId/assignments/:assignmentId/close', controller.closeAssignment.bind(controller));

  return router;
}

// Exportar información de rutas para documentación
export const assignmentEndpoints = [
  {
    method: 'GET',
    path: '/test',
    description: 'Prueba de funcionamiento del módulo'
  },
  {
    method: 'GET', 
    path: '/status',
    description: 'Estado del módulo de asignaciones'
  },
  {
    method: 'GET',
    path: '/reports',
    description: 'Lista de reportes disponibles'
  },
  {
    method: 'GET',
    path: '/reports/assignment-summary',
    description: 'Reporte de resumen de asignaciones'
  },
  {
    method: 'GET',
    path: '/reports/current-assignments',
    description: 'Reporte de asignaciones actuales'
  },
  {
    method: 'GET',
    path: '/reports/assignment-history',
    description: 'Reporte de historial de asignaciones'
  },
  {
    method: 'GET',
    path: '/vehicle/:vehicleId/assignments',
    description: 'Obtener asignaciones de un vehículo'
  },
  {
    method: 'POST',
    path: '/vehicle/:vehicleId/assignments',
    description: 'Crear nueva asignación para un vehículo'
  },
  {
    method: 'PATCH',
    path: '/vehicle/:vehicleId/assignments/:assignmentId/close',
    description: 'Cerrar una asignación específica'
  }
];