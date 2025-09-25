# Sistema de Autorización - Seguros

## 🔐 Arquitectura de Seguridad

### Capas de Seguridad Implementadas

1. **Autenticación por PIN** (`authenticatePin`)
2. **Autorización por Roles** (`requireInsuranceViewer`, `requireInsuranceAdmin`)
3. **Validaciones de Negocio** (en servicios)

## 👥 Roles y Permisos

### VIEWER (Visualizador)
**Permisos:**
- ✅ Listar pólizas de seguro (`GET /insurance-policies`)
- ✅ Ver detalles de póliza específica (`GET /insurance-policies/:id`)
- ✅ Listar asignaciones de vehículos (`GET /insurance-policies/:id/vehicle-assignments`)

**Restricciones:**
- ❌ No puede crear pólizas
- ❌ No puede modificar pólizas
- ❌ No puede eliminar pólizas
- ❌ No puede renovar pólizas
- ❌ No puede asignar vehículos

### ADMIN (Administrador)
**Permisos:**
- ✅ **Todos los permisos de VIEWER**
- ✅ Crear pólizas (`POST /insurance-policies`)
- ✅ Actualizar pólizas (`PUT /insurance-policies/:id`)
- ✅ Eliminar pólizas (`DELETE /insurance-policies/:id`)
- ✅ Renovar pólizas (`POST /insurance-policies/:id/renew`)
- ✅ Asignar vehículos (`POST /insurance-policies/:id/assign-vehicles`)
- ✅ Eliminar asignaciones (`DELETE /insurance-policies/:policyId/vehicle-assignments/:assignmentId`)

## 🛡️ Middleware de Seguridad

### 1. Autenticación PIN (`authenticatePin`)

**Ubicación:** `src/middleware/auth.ts`

**Función:**
- Valida el PIN enviado en el header `x-pin`
- Compara con `process.env.PIN`
- Bloquea acceso si PIN es incorrecto

**Uso:**
```typescript
// Aplicado a TODAS las rutas de seguros
router.use(authenticatePin);
```

**Headers Requeridos:**
```http
x-pin: your_secret_pin_here
```

**Respuesta de Error:**
```json
{
  "error": {
    "message": "Invalid PIN",
    "status": 401
  }
}
```

### 2. Autorización Viewer (`requireInsuranceViewer`)

**Ubicación:** `src/middleware/auth.ts`

**Función:**
- Valida que el usuario tenga rol `VIEWER` o `ADMIN`
- Permite acceso a operaciones de lectura

**Uso:**
```typescript
// Aplicado a rutas GET
router.get('/insurance-policies', requireInsuranceViewer, controller.getAll);
router.get('/insurance-policies/:id', requireInsuranceViewer, controller.getById);
```

**Headers Requeridos:**
```http
x-pin: your_secret_pin_here
x-user-roles: VIEWER
# o
x-user-roles: ADMIN
```

**Respuesta de Error:**
```json
{
  "error": {
    "message": "Insufficient permissions. Insurance viewer role required.",
    "status": 403
  }
}
```

### 3. Autorización Admin (`requireInsuranceAdmin`)

**Ubicación:** `src/middleware/auth.ts`

**Función:**
- Valida que el usuario tenga rol `ADMIN`
- Permite acceso a operaciones de escritura

**Uso:**
```typescript
// Aplicado a rutas POST, PUT, DELETE
router.post('/insurance-policies', requireInsuranceAdmin, controller.create);
router.put('/insurance-policies/:id', requireInsuranceAdmin, controller.update);
router.delete('/insurance-policies/:id', requireInsuranceAdmin, controller.delete);
```

**Headers Requeridos:**
```http
x-pin: your_secret_pin_here
x-user-roles: ADMIN
```

**Respuesta de Error:**
```json
{
  "error": {
    "message": "Insufficient permissions. Insurance admin role required.",
    "status": 403
  }
}
```

## 🔧 Configuración

### Variables de Entorno

```bash
# .env
PIN=your_secure_pin_here
```

### Implementación en Rutas

**Archivo:** `src/routes/insurancePolicyRoutes.ts`

```typescript
import { authenticatePin, requireInsuranceViewer, requireInsuranceAdmin } from '../middleware/auth';

// Autenticación aplicada a todas las rutas
router.use(authenticatePin);

// Rutas de lectura - requieren VIEWER o ADMIN
router.get('/insurance-policies', requireInsuranceViewer, controller.getAll);
router.get('/insurance-policies/:id', requireInsuranceViewer, controller.getById);
router.get('/insurance-policies/:id/vehicle-assignments', requireInsuranceViewer, controller.getVehicleAssignments);

// Rutas de escritura - requieren ADMIN
router.post('/insurance-policies', requireInsuranceAdmin, controller.create);
router.put('/insurance-policies/:id', requireInsuranceAdmin, controller.update);
router.delete('/insurance-policies/:id', requireInsuranceAdmin, controller.delete);
router.post('/insurance-policies/:id/renew', requireInsuranceAdmin, controller.renew);
router.post('/insurance-policies/:id/assign-vehicles', requireInsuranceAdmin, controller.assignVehicles);
router.delete('/insurance-policies/:policyId/vehicle-assignments/:assignmentId', requireInsuranceAdmin, controller.removeVehicleAssignment);
```

## 🧪 Testing de Autorización

### Casos de Prueba

#### 1. Sin PIN
```bash
curl -X GET http://localhost:3000/api/insurance-policies
# ❌ 401 Unauthorized - "Invalid PIN"
```

#### 2. PIN Incorrecto
```bash
curl -X GET http://localhost:3000/api/insurance-policies \
  -H "x-pin: wrong_pin"
# ❌ 401 Unauthorized - "Invalid PIN"
```

#### 3. Sin Rol
```bash
curl -X GET http://localhost:3000/api/insurance-policies \
  -H "x-pin: correct_pin"
# ❌ 403 Forbidden - "Insufficient permissions"
```

#### 4. Rol Insuficiente (VIEWER intentando crear)
```bash
curl -X POST http://localhost:3000/api/insurance-policies \
  -H "x-pin: correct_pin" \
  -H "x-user-roles: VIEWER" \
  -H "Content-Type: application/json" \
  -d '{"provider": "Test"}'
# ❌ 403 Forbidden - "Insurance admin role required"
```

#### 5. Acceso Exitoso VIEWER
```bash
curl -X GET http://localhost:3000/api/insurance-policies \
  -H "x-pin: correct_pin" \
  -H "x-user-roles: VIEWER"
# ✅ 200 OK - Lista de pólizas
```

#### 6. Acceso Exitoso ADMIN
```bash
curl -X POST http://localhost:3000/api/insurance-policies \
  -H "x-pin: correct_pin" \
  -H "x-user-roles: ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "Test Insurance",
    "policyNumber": "TEST-001",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "premiumAmount": 50000
  }'
# ✅ 201 Created - Póliza creada
```

## 🔍 Matriz de Permisos

| Endpoint | Método | VIEWER | ADMIN | Descripción |
|----------|--------|--------|-------|-------------|
| `/insurance-policies` | GET | ✅ | ✅ | Listar pólizas |
| `/insurance-policies/:id` | GET | ✅ | ✅ | Ver póliza específica |
| `/insurance-policies/:id/vehicle-assignments` | GET | ✅ | ✅ | Ver asignaciones |
| `/insurance-policies` | POST | ❌ | ✅ | Crear póliza |
| `/insurance-policies/:id` | PUT | ❌ | ✅ | Actualizar póliza |
| `/insurance-policies/:id` | DELETE | ❌ | ✅ | Eliminar póliza |
| `/insurance-policies/:id/renew` | POST | ❌ | ✅ | Renovar póliza |
| `/insurance-policies/:id/assign-vehicles` | POST | ❌ | ✅ | Asignar vehículos |
| `/insurance-policies/:policyId/vehicle-assignments/:assignmentId` | DELETE | ❌ | ✅ | Eliminar asignación |

## 🚨 Manejo de Errores

### Tipos de Errores de Autorización

#### 401 Unauthorized
- **Causa:** PIN faltante o incorrecto
- **Mensaje:** "Invalid PIN"
- **Solución:** Verificar header `x-pin`

#### 403 Forbidden - Viewer Required
- **Causa:** Falta rol VIEWER o ADMIN
- **Mensaje:** "Insufficient permissions. Insurance viewer role required."
- **Solución:** Agregar header `x-user-roles: VIEWER` o `x-user-roles: ADMIN`

#### 403 Forbidden - Admin Required
- **Causa:** Falta rol ADMIN para operación de escritura
- **Mensaje:** "Insufficient permissions. Insurance admin role required."
- **Solución:** Cambiar header a `x-user-roles: ADMIN`

### Estructura de Respuesta de Error

```json
{
  "error": {
    "message": "Insufficient permissions. Insurance admin role required.",
    "status": 403,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## 🔧 Extensibilidad

### Agregar Nuevos Roles

1. **Definir nuevo rol en enum:**
```typescript
// src/types/auth.ts
export enum UserRole {
  VIEWER = 'VIEWER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN' // Nuevo rol
}
```

2. **Crear middleware específico:**
```typescript
// src/middleware/auth.ts
export const requireSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  const userRoles = req.headers['x-user-roles'] as string;
  
  if (!userRoles?.includes('SUPER_ADMIN')) {
    return res.status(403).json({
      error: {
        message: 'Insufficient permissions. Super admin role required.',
        status: 403
      }
    });
  }
  
  next();
};
```

3. **Aplicar a rutas específicas:**
```typescript
router.delete('/insurance-policies/bulk', requireSuperAdmin, controller.bulkDelete);
```

### Agregar Nuevos Módulos

Para extender el sistema a otros módulos (ej: vehículos, usuarios):

1. **Crear middlewares específicos:**
```typescript
export const requireVehicleViewer = createRoleMiddleware(['VEHICLE_VIEWER', 'VEHICLE_ADMIN']);
export const requireVehicleAdmin = createRoleMiddleware(['VEHICLE_ADMIN']);
```

2. **Aplicar a rutas del módulo:**
```typescript
// vehicleRoutes.ts
router.use(authenticatePin); // PIN siempre requerido
router.get('/vehicles', requireVehicleViewer, controller.getAll);
router.post('/vehicles', requireVehicleAdmin, controller.create);
```

## 📋 Checklist de Seguridad

### ✅ Implementación Básica
- [x] PIN de autenticación configurado
- [x] Roles VIEWER y ADMIN implementados
- [x] Middleware aplicado a todas las rutas
- [x] Separación clara entre operaciones de lectura y escritura

### ✅ Testing
- [x] Tests de autenticación con PIN
- [x] Tests de autorización por roles
- [x] Tests de acceso denegado
- [x] Tests de acceso permitido

### ✅ Documentación
- [x] Matriz de permisos documentada
- [x] Ejemplos de uso con cURL
- [x] Manejo de errores documentado
- [x] Guía de extensibilidad

### 🔄 Mejoras Futuras (Opcionales)
- [ ] Autenticación JWT en lugar de PIN
- [ ] Roles granulares por recurso
- [ ] Auditoría de accesos
- [ ] Rate limiting por usuario
- [ ] Sesiones con expiración

---

*Sistema de autorización implementado: Enero 2024*