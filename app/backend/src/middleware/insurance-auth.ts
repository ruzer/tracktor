import { Request, Response, NextFunction } from "express";
import { InsuranceError } from "@exceptions/InsuranceError.js";
import { Status } from "@exceptions/ServiceError.js";

// Insurance roles
export enum InsuranceRole {
  ADMIN = "ROLE_INSURANCE_ADMIN",
  VIEWER = "ROLE_INSURANCE_VIEWER"
}

// Extended request interface to include user roles
export interface AuthenticatedRequest extends Request {
  userRoles?: InsuranceRole[];
}

/**
 * Middleware to check if user has required insurance roles
 * For now, this is a simplified implementation that grants admin access by default
 * In a real implementation, this would check against a user database or JWT token
 */
export const requireInsuranceRole = (requiredRoles: InsuranceRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // Get user roles from headers (simplified implementation)
      const userRolesHeader = req.headers["x-user-roles"] as string;
      let userRoles: InsuranceRole[] = [];
      
      if (userRolesHeader) {
        // Parse roles from header
        const roles = userRolesHeader.split(",").map(role => role.trim());
        userRoles = roles.filter(role => 
          Object.values(InsuranceRole).includes(role as InsuranceRole)
        ) as InsuranceRole[];
      } else {
        // Default behavior: grant admin access if no roles specified
        // This maintains backward compatibility with existing PIN-based auth
        userRoles = [InsuranceRole.ADMIN];
      }
      
      // Attach roles to request for use in controllers
      req.userRoles = userRoles;
      
      // Check if user has any of the required roles
      const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
      
      if (!hasRequiredRole) {
        throw new InsuranceError(
          `Access denied. Required roles: ${requiredRoles.join(", ")}`,
          Status.UNAUTHORIZED
        );
      }
      
      next();
    } catch (error: unknown) {
      if (error instanceof InsuranceError) {
        return res.status(error.status).json({
          type: "AuthorizationError",
          errors: [{ message: error.message }]
        });
      }
      
      return res.status(Status.INTERNAL_SERVER_ERROR).json({
        type: "AuthorizationError", 
        errors: [{ message: "Authorization check failed" }]
      });
    }
  };
};

/**
 * Middleware for insurance admin operations (create, update, delete)
 */
export const requireInsuranceAdmin = requireInsuranceRole([InsuranceRole.ADMIN]);

/**
 * Middleware for insurance read operations (view, list)
 */
export const requireInsuranceViewer = requireInsuranceRole([
  InsuranceRole.ADMIN, 
  InsuranceRole.VIEWER
]);

/**
 * Helper function to check if user has admin role
 */
export const hasInsuranceAdminRole = (req: AuthenticatedRequest): boolean => {
  return req.userRoles?.includes(InsuranceRole.ADMIN) ?? false;
};

/**
 * Helper function to check if user has viewer role (or admin)
 */
export const hasInsuranceViewerRole = (req: AuthenticatedRequest): boolean => {
  return req.userRoles?.some(role => 
    [InsuranceRole.ADMIN, InsuranceRole.VIEWER].includes(role)
  ) ?? false;
};