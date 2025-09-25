# Guía de Testing - Sistema de Seguros

## 🚀 Inicio Rápido

### Prerrequisitos
```bash
cd app/backend
npm install
```

### Ejecutar Tests
```bash
# Tests básicos
npm test

# Tests con watch mode (recomendado para desarrollo)
npm run test:watch

# Tests con cobertura
npm run test:coverage
```

## 🧪 Casos de Prueba Detallados

### 1. Testing de Validaciones de Fechas

#### ✅ Caso Exitoso: Rango de Fechas Válido
```javascript
// Test automático incluido
const today = new Date();
const nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
validateDateRange(today.toISOString(), nextYear.toISOString());
// ✅ No debe lanzar error
```

#### ❌ Caso de Error: Fecha Inicio > Fecha Fin
```javascript
// Test automático incluido
const today = new Date();
const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
validateDateRange(today.toISOString(), yesterday.toISOString());
// ❌ Error: "Start date must be before end date"
```

#### ❌ Caso de Error: Duración > 10 Años
```javascript
// Test automático incluido
const today = new Date();
const elevenYearsLater = new Date(today.getFullYear() + 11, today.getMonth(), today.getDate());
validateDateRange(today.toISOString(), elevenYearsLater.toISOString());
// ❌ Error: "Policy duration cannot exceed 10 years"
```

#### ❌ Caso de Error: Fecha Muy Antigua
```javascript
// Test automático incluido
const today = new Date();
const sixYearsAgo = new Date(today.getFullYear() - 6, today.getMonth(), today.getDate());
const fiveYearsAgo = new Date(today.getFullYear() - 4, today.getMonth(), today.getDate());
validateDateRange(sixYearsAgo.toISOString(), fiveYearsAgo.toISOString());
// ❌ Error: "Start date cannot be more than 5 years in the past"
```

### 2. Testing de Validaciones de Montos

#### ✅ Casos Exitosos: Montos Válidos
```javascript
// Tests automáticos incluidos
validatePremiumAmount(100);     // ✅ OK
validatePremiumAmount(50000);   // ✅ OK
validatePremiumAmount(999999);  // ✅ OK
validatePremiumAmount(1000000); // ✅ OK (límite máximo)
validatePremiumAmount(0);       // ✅ OK (límite mínimo)
```

#### ❌ Casos de Error: Montos Inválidos
```javascript
// Tests automáticos incluidos
validatePremiumAmount(-1);      // ❌ Error: "Premium amount cannot be negative"
validatePremiumAmount(-100);    // ❌ Error: "Premium amount cannot be negative"
validatePremiumAmount(1000001); // ❌ Error: "Premium amount cannot exceed 1,000,000"
validatePremiumAmount(2000000); // ❌ Error: "Premium amount cannot exceed 1,000,000"
```

### 3. Testing de Validaciones de Números de Póliza

#### ✅ Casos Exitosos: Números Válidos
```javascript
// Tests automáticos incluidos
validatePolicyNumber('POL123');              // ✅ OK
validatePolicyNumber('INSURANCE-2024-001');  // ✅ OK
validatePolicyNumber('ABC123XYZ');           // ✅ OK
validatePolicyNumber('ABC');                 // ✅ OK (3 caracteres - mínimo)
validatePolicyNumber('A'.repeat(50));        // ✅ OK (50 caracteres - máximo)
```

#### ❌ Casos de Error: Números Inválidos
```javascript
// Tests automáticos incluidos
validatePolicyNumber('');           // ❌ Error: "Policy number is required"
validatePolicyNumber('   ');        // ❌ Error: "Policy number is required"
validatePolicyNumber('AB');         // ❌ Error: "Policy number must be at least 3 characters long"
validatePolicyNumber('X');          // ❌ Error: "Policy number must be at least 3 characters long"
validatePolicyNumber('A'.repeat(51)); // ❌ Error: "Policy number cannot exceed 50 characters"
```

## 🌐 Testing de API con cURL

### Configuración Inicial

Asegúrate de que el servidor esté ejecutándose:
```bash
cd app/backend
npm run dev
```

### Variables de Entorno para Testing
```bash
# Configurar variables para facilitar testing
export API_URL="http://localhost:3000/api"
export PIN="your_pin_here"
export ADMIN_HEADERS="-H 'x-pin: $PIN' -H 'x-user-roles: ADMIN' -H 'Content-Type: application/json'"
export VIEWER_HEADERS="-H 'x-pin: $PIN' -H 'x-user-roles: VIEWER'"
```

### 1. Testing de Autorización

#### ✅ Acceso ADMIN a Operaciones de Escritura
```bash
# Crear póliza (requiere ADMIN)
curl -X POST $API_URL/insurance-policies \
  $ADMIN_HEADERS \
  -d '{
    "provider": "Test Insurance Co",
    "policyNumber": "TEST-001",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "premiumAmount": 50000,
    "coverageType": "COMPREHENSIVE"
  }'
# ✅ Esperado: 201 Created
```

#### ✅ Acceso VIEWER a Operaciones de Lectura
```bash
# Listar pólizas (permitido para VIEWER)
curl -X GET $API_URL/insurance-policies $VIEWER_HEADERS
# ✅ Esperado: 200 OK con lista de pólizas
```

#### ❌ Acceso VIEWER a Operaciones de Escritura
```bash
# Intentar crear póliza con rol VIEWER
curl -X POST $API_URL/insurance-policies \
  -H "x-pin: $PIN" \
  -H "x-user-roles: VIEWER" \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "Test Insurance Co",
    "policyNumber": "TEST-002",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "premiumAmount": 50000
  }'
# ❌ Esperado: 403 Forbidden
```

### 2. Testing de Validaciones de Negocio

#### ❌ Validación de Fechas: Fecha Inicio > Fecha Fin
```bash
curl -X POST $API_URL/insurance-policies \
  $ADMIN_HEADERS \
  -d '{
    "provider": "Test Insurance Co",
    "policyNumber": "TEST-003",
    "startDate": "2024-12-31",
    "endDate": "2024-01-01",
    "premiumAmount": 50000
  }'
# ❌ Esperado: 400 Bad Request - "Start date must be before end date"
```

#### ❌ Validación de Montos: Monto Negativo
```bash
curl -X POST $API_URL/insurance-policies \
  $ADMIN_HEADERS \
  -d '{
    "provider": "Test Insurance Co",
    "policyNumber": "TEST-004",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "premiumAmount": -1000
  }'
# ❌ Esperado: 400 Bad Request - "Premium amount cannot be negative"
```

#### ❌ Validación de Números de Póliza: Duplicado
```bash
# Primero crear una póliza
curl -X POST $API_URL/insurance-policies \
  $ADMIN_HEADERS \
  -d '{
    "provider": "Test Insurance Co",
    "policyNumber": "DUPLICATE-001",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "premiumAmount": 50000
  }'

# Luego intentar crear otra con el mismo número y proveedor
curl -X POST $API_URL/insurance-policies \
  $ADMIN_HEADERS \
  -d '{
    "provider": "Test Insurance Co",
    "policyNumber": "DUPLICATE-001",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "premiumAmount": 60000
  }'
# ❌ Esperado: 400 Bad Request - "Policy number DUPLICATE-001 already exists for provider Test Insurance Co"
```

### 3. Testing de Operaciones Complejas

#### ✅ Renovación de Póliza
```bash
# Primero obtener ID de una póliza existente
POLICY_ID=$(curl -s -X GET $API_URL/insurance-policies $VIEWER_HEADERS | jq -r '.[0].id')

# Renovar la póliza
curl -X POST $API_URL/insurance-policies/$POLICY_ID/renew \
  $ADMIN_HEADERS \
  -d '{
    "newStartDate": "2025-01-01",
    "newEndDate": "2025-12-31",
    "newPremiumAmount": 55000,
    "extendToVehicles": true
  }'
# ✅ Esperado: 200 OK con póliza renovada
```

#### ✅ Asignación de Vehículos
```bash
# Asignar vehículos a una póliza
curl -X POST $API_URL/insurance-policies/$POLICY_ID/assign-vehicles \
  $ADMIN_HEADERS \
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
# ✅ Esperado: 200 OK con asignaciones creadas
```

## 📊 Interpretación de Resultados

### Códigos de Respuesta Esperados

| Código | Significado | Cuándo Ocurre |
|--------|-------------|---------------|
| 200    | OK          | Operación exitosa |
| 201    | Created     | Recurso creado exitosamente |
| 400    | Bad Request | Validación de negocio fallida |
| 401    | Unauthorized| PIN incorrecto o faltante |
| 403    | Forbidden   | Rol insuficiente |
| 404    | Not Found   | Recurso no encontrado |
| 500    | Server Error| Error interno del servidor |

### Estructura de Respuestas de Error

```json
{
  "error": {
    "message": "Start date must be before end date",
    "status": 400,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### Estructura de Respuestas Exitosas

```json
{
  "id": "policy-123",
  "provider": "Test Insurance Co",
  "policyNumber": "TEST-001",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "premiumAmount": 50000,
  "coverageType": "COMPREHENSIVE",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

## 🔍 Debugging y Troubleshooting

### Logs del Servidor

Monitorea los logs del servidor para ver las validaciones en tiempo real:
```bash
# En otra terminal, observa los logs
tail -f app/backend/logs/app.log
```

### Verificar Estado de la Base de Datos

```bash
# Verificar que las tablas existan
npm run db:studio

# O ejecutar migraciones si es necesario
npm run db:migrate
```

### Problemas Comunes

#### Error 401: Unauthorized
- **Causa:** PIN incorrecto o faltante
- **Solución:** Verificar header `x-pin`

#### Error 403: Forbidden
- **Causa:** Rol insuficiente para la operación
- **Solución:** Usar rol ADMIN para operaciones de escritura

#### Error 400: Validation Failed
- **Causa:** Datos no cumplen reglas de negocio
- **Solución:** Revisar mensaje de error específico y ajustar datos

## 📝 Checklist de Testing

### ✅ Tests Unitarios
- [ ] Ejecutar `npm test` sin errores
- [ ] Verificar cobertura > 80% con `npm run test:coverage`
- [ ] Todos los tests de validación pasando

### ✅ Tests de API
- [ ] Autenticación con PIN funciona
- [ ] Autorización ADMIN/VIEWER funciona
- [ ] Validaciones de fechas funcionan
- [ ] Validaciones de montos funcionan
- [ ] Validaciones de números de póliza funcionan
- [ ] Operaciones CRUD básicas funcionan
- [ ] Renovación de pólizas funciona
- [ ] Asignación de vehículos funciona

### ✅ Tests de Integración
- [ ] Servidor inicia sin errores
- [ ] Base de datos conecta correctamente
- [ ] Migraciones aplicadas
- [ ] Endpoints responden correctamente

## 🎯 Casos de Uso Reales

### Escenario 1: Crear Póliza Completa
```bash
# 1. Crear póliza base
POLICY_ID=$(curl -s -X POST $API_URL/insurance-policies \
  $ADMIN_HEADERS \
  -d '{
    "provider": "Seguros Reales SA",
    "policyNumber": "SR-2024-001",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "premiumAmount": 75000,
    "coverageType": "COMPREHENSIVE"
  }' | jq -r '.id')

# 2. Asignar vehículos
curl -X POST $API_URL/insurance-policies/$POLICY_ID/assign-vehicles \
  $ADMIN_HEADERS \
  -d '{
    "assignments": [
      {"vehicleId": "vehicle-1", "premiumAmount": 35000},
      {"vehicleId": "vehicle-2", "premiumAmount": 40000}
    ]
  }'

# 3. Verificar resultado
curl -X GET $API_URL/insurance-policies/$POLICY_ID $VIEWER_HEADERS
```

### Escenario 2: Ciclo de Vida de Póliza
```bash
# 1. Crear → 2. Actualizar → 3. Renovar → 4. Eliminar
# (Ver ejemplos detallados en la documentación principal)
```

---

*Guía actualizada: Enero 2024*