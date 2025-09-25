# Sistema de Seguros - Documentación

## 📋 Índice
1. [Validaciones de Negocio](#validaciones-de-negocio)
2. [Sistema de Autorización](#sistema-de-autorización)
3. [API Endpoints](#api-endpoints)
4. [Ejemplos de Uso](#ejemplos-de-uso)
5. [Testing](#testing)

## 🔍 Validaciones de Negocio

### Validaciones Implementadas

#### 1. `validateDateRange(startDate, endDate)`
Valida que los rangos de fechas de las pólizas sean correctos.

**Reglas:**
- La fecha de inicio debe ser anterior a la fecha de fin
- La duración de la póliza no puede exceder 10 años
- La fecha de inicio no puede ser más de 5 años en el pasado

**Errores posibles:**
- `Start date must be before end date`
- `Policy duration cannot exceed 10 years`
- `Start date cannot be more than 5 years in the past`

#### 2. `validatePolicyNumberUniqueness(provider, policyNumber, excludePolicyId?)`
Verifica que el número de póliza sea único para cada proveedor.

**Reglas:**
- El número de póliza debe ser único por proveedor
- Al actualizar, se excluye la póliza actual de la validación

**Errores posibles:**
- `Policy number {policyNumber} already exists for provider {provider}`

#### 3. `validateVehicleInsuranceOverlap(vehicleIds, startDate, endDate, excludePolicyId?)`
Previene solapamiento de períodos de seguro para vehículos.

**Reglas:**
- Un vehículo no puede tener múltiples seguros activos en el mismo período
- Al actualizar, se excluye la póliza actual de la validación

**Errores posibles:**
- `Vehicle {vehicleId} already has active insurance during this period`

#### 4. `validatePremiumAmount(amount)`
Valida que los montos de prima estén dentro de rangos aceptables.

**Reglas:**
- El monto no puede ser negativo
- El monto no puede exceder 1,000,000

**Errores posibles:**
- `Premium amount cannot be negative`
- `Premium amount cannot exceed 1,000,000`

## 🔐 Sistema de Autorización

### Roles Disponibles

#### ADMIN
- **Permisos:** Crear, leer, actualizar y eliminar pólizas de seguro
- **Rutas:** Todas las rutas de seguros

#### VIEWER
- **Permisos:** Solo lectura de pólizas de seguro
- **Rutas:** Solo endpoints GET

### Configuración de Headers

Para usar el sistema de autorización, incluye el header:
```
x-user-roles: ADMIN
```
o
```
x-user-roles: VIEWER
```

Si no se especifica el header, se asume rol ADMIN por defecto.

## 🌐 API Endpoints

### Seguros Básicos (`/api/insurance`)

| Método | Endpoint | Rol Requerido | Descripción |
|--------|----------|---------------|-------------|
| GET    | `/`      | VIEWER        | Listar seguros |
| POST   | `/`      | ADMIN         | Crear seguro |
| PUT    | `/:id`   | ADMIN         | Actualizar seguro |
| DELETE | `/:id`   | ADMIN         | Eliminar seguro |

### Pólizas de Seguro (`/api/insurance-policies`)

| Método | Endpoint | Rol Requerido | Descripción |
|--------|----------|---------------|-------------|
| GET    | `/`      | VIEWER        | Listar pólizas |
| GET    | `/:id`   | VIEWER        | Obtener póliza |
| POST   | `/`      | ADMIN         | Crear póliza |
| PUT    | `/:id`   | ADMIN         | Actualizar póliza |
| DELETE | `/:id`   | ADMIN         | Eliminar póliza |
| POST   | `/:id/renew` | ADMIN     | Renovar póliza |
| POST   | `/:id/assign-vehicles` | ADMIN | Asignar vehículos |
| DELETE | `/:id/vehicles/:vehicleId` | ADMIN | Remover vehículo |

## 📝 Ejemplos de Uso

### Crear una Póliza de Seguro

```bash
curl -X POST http://localhost:3000/api/insurance-policies \
  -H "Content-Type: application/json" \
  -H "x-pin: YOUR_PIN" \
  -H "x-user-roles: ADMIN" \
  -d '{
    "provider": "Seguros ABC",
    "policyNumber": "POL-2024-001",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "premiumAmount": 50000,
    "coverageType": "COMPREHENSIVE"
  }'
```

### Renovar una Póliza

```bash
curl -X POST http://localhost:3000/api/insurance-policies/123/renew \
  -H "Content-Type: application/json" \
  -H "x-pin: YOUR_PIN" \
  -H "x-user-roles: ADMIN" \
  -d '{
    "newStartDate": "2025-01-01",
    "newEndDate": "2025-12-31",
    "newPremiumAmount": 55000,
    "extendToVehicles": true
  }'
```

### Asignar Vehículos a una Póliza

```bash
curl -X POST http://localhost:3000/api/insurance-policies/123/assign-vehicles \
  -H "Content-Type: application/json" \
  -H "x-pin: YOUR_PIN" \
  -H "x-user-roles: ADMIN" \
  -d '{
    "assignments": [
      {
        "vehicleId": "vehicle-1",
        "premiumAmount": 25000
      },
      {
        "vehicleId": "vehicle-2", 
        "premiumAmount": 30000
      }
    ]
  }'
```

### Consultar Pólizas (Solo Lectura)

```bash
curl -X GET http://localhost:3000/api/insurance-policies \
  -H "x-pin: YOUR_PIN" \
  -H "x-user-roles: VIEWER"
```

## 🧪 Testing

### Ejecutar Tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con cobertura
npm run test:coverage
```

### Tests Implementados

Los tests cubren las siguientes validaciones:

#### Validación de Fechas (4 tests)
- ✅ Rango de fechas válido
- ✅ Error cuando fecha inicio > fecha fin
- ✅ Error cuando duración > 10 años
- ✅ Error cuando fecha inicio > 5 años en el pasado

#### Validación de Montos (5 tests)
- ✅ Montos válidos (100, 50000, 999999)
- ✅ Error para montos negativos
- ✅ Error para montos > 1,000,000
- ✅ Monto en límite máximo (1,000,000)
- ✅ Monto en límite mínimo (0)

#### Validación de Números de Póliza (5 tests)
- ✅ Números de póliza válidos
- ✅ Error para números vacíos
- ✅ Error para números muy cortos (< 3 caracteres)
- ✅ Error para números muy largos (> 50 caracteres)
- ✅ Números en límites de longitud

### Resultados de Tests

```
✓ 14 tests pasando
✓ 0 tests fallando
✓ Cobertura de código disponible
```

## 🚨 Manejo de Errores

### Códigos de Error Comunes

| Código | Descripción | Causa |
|--------|-------------|-------|
| 400    | Bad Request | Validación de negocio fallida |
| 401    | Unauthorized | PIN incorrecto |
| 403    | Forbidden | Rol insuficiente para la operación |
| 404    | Not Found | Póliza o recurso no encontrado |
| 500    | Internal Server Error | Error del servidor |

### Estructura de Respuesta de Error

```json
{
  "error": {
    "message": "Start date must be before end date",
    "status": 400,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## 🔧 Configuración del Entorno

### Variables de Entorno Requeridas

```env
# Base de datos
DATABASE_URL=your_database_url

# Autenticación
PIN_HASH=your_pin_hash

# Puerto del servidor
PORT=3000
```

### Instalación y Configuración

1. **Instalar dependencias:**
   ```bash
   cd app/backend
   npm install
   ```

2. **Configurar base de datos:**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

3. **Ejecutar en desarrollo:**
   ```bash
   npm run dev
   ```

4. **Ejecutar tests:**
   ```bash
   npm test
   ```

## 📊 Monitoreo y Logs

### Logs de Validación

Las validaciones de negocio generan logs detallados:

```
[INFO] Validating date range: 2024-01-01 to 2024-12-31
[ERROR] Validation failed: Start date must be before end date
[INFO] Policy POL-2024-001 created successfully
```

### Métricas de Autorización

```
[INFO] User with ADMIN role accessed POST /api/insurance-policies
[WARN] User with VIEWER role attempted POST /api/insurance-policies - Forbidden
```

## 🔄 Flujo de Trabajo Recomendado

1. **Autenticación:** Incluir header `x-pin` con PIN válido
2. **Autorización:** Incluir header `x-user-roles` con rol apropiado
3. **Validación:** Los datos se validan automáticamente antes de procesarse
4. **Respuesta:** Recibir confirmación o error detallado

## 📞 Soporte

Para reportar problemas o solicitar nuevas funcionalidades:
- Revisar logs del servidor para errores detallados
- Verificar que los headers de autorización sean correctos
- Confirmar que los datos cumplan las reglas de validación
- Ejecutar tests para verificar funcionalidad

---

*Documentación actualizada: Enero 2024*