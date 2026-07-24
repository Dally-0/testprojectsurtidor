# Base de Datos — Sistema de Gestión de Combustible Dally SRL

## Schema SQL (Supabase)

```sql
-- Habilitar la extensión para UUIDs si no está activa
create extension if not exists "uuid-ossp";

-- 1. TABLA: SUCURSALES
create table sucursales (
    id uuid default gen_random_uuid() primary key,
    nombre varchar(100) not null,
    direccion varchar(255) not null,
    ciudad varchar(100) not null,
    creado_en timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. TABLA: USUARIOS (Admins, Operadores)
-- Nota: Se vincula conceptualmente o mediante triggers con auth.users de Supabase
create table usuarios (
    id uuid primary key, -- Debe coincidir con auth.users.id de Supabase
    email varchar(150) unique not null,
    nombre varchar(100) not null,
    rol varchar(50) check (rol in ('superadmin', 'admin_sucursal', 'operador')) not null,
    sucursal_id uuid references sucursales(id) on delete set null,
    activo boolean default true not null,
    creado_en timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. TABLA: SURTIDORES (Múltiples bombas por sucursal y tipo de combustible)
create table surtidores (
    id uuid default gen_random_uuid() primary key,
    numero_bomba integer not null,
    combustible varchar(50) check (combustible in ('Gasolina Especial', 'Diésel', 'GNV', 'Premium')) not null,
    capacidad_maxima numeric(10, 2) not null, -- En litros
    nivel_actual numeric(10, 2) not null, -- En litros
    sucursal_id uuid references sucursales(id) on delete cascade not null,
    creado_en timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint unique_bomba_sucursal unique (sucursal_id, numero_bomba)
);

-- 4. TABLA: VENTAS (Registro transaccional de combustible)
create table ventas (
    id uuid default gen_random_uuid() primary key,
    fecha timestamp with time zone default timezone('utc'::text, now()) not null,
    combustible varchar(50) not null,
    litros numeric(10, 2) not null,
    precio_por_litro numeric(10, 2) not null,
    total numeric(12, 2) not null,
    surtidor_id uuid references surtidores(id) on delete restrict not null,
    usuario_id uuid references usuarios(id) on delete restrict not null, -- Operador que realizó la venta
    metadata_binaria integer default 0 not null -- Campo para lógica de aritmética binaria / flags del sistema
);

-- 5. TABLA: ALERTAS (Historial de incidentes o desabastecimiento)
create table alertas (
    id uuid default gen_random_uuid() primary key,
    surtidor_id uuid references surtidores(id) on delete cascade not null,
    tipo varchar(50) check (tipo in ('Nivel Crítico Bajo', 'Falla de Conexión', 'Sobrecarga', 'Mantenimiento')) not null,
    estado varchar(30) check (estado in ('Pendiente', 'En Revisión', 'Resuelta')) default 'Pendiente' not null,
    fecha timestamp with time zone default timezone('utc'::text, now()) not null,
    resuelto_en timestamp with time zone
);
```

## Relaciones

```
sucursales (1) ─── (N) surtidores
sucursales (1) ─── (N) usuarios
surtidores (1) ─── (N) ventas
surtidores (1) ─── (N) alertas
usuarios   (1) ─── (N) ventas
```

## IDs de Seed (seed.sql)

| Entidad   | ID                                     | Descripción            |
|-----------|----------------------------------------|------------------------|
| Sucursal  | `a1b2c3d4-e5f6-7890-abcd-ef1234567890` | Estación Central Dally |
| Admin     | `11111111-1111-1111-1111-111111111111` | Carlos Dally (superadmin) |
| Operador  | `22222222-2222-2222-2222-222222222222` | R. Méndez              |
| Operador  | `33333333-3333-3333-3333-333333333333` | C. López               |
| Operador  | `44444444-4444-4444-4444-444444444444` | M. Torres              |
| Surtidor  | `aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa` | Bomba 1 - Gasolina Especial |
| Surtidor  | `bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb` | Bomba 2 - Diésel       |
| Surtidor  | `cccc3333-cccc-cccc-cccc-cccccccccccc` | Bomba 3 - GNV          |
| Surtidor  | `dddd4444-dddd-dddd-dddd-dddddddddddd` | Bomba 4 - Premium      |

## Flags de metadata_binaria (Aritmética Binaria)

| Bit  | Hex   | Significado               |
|------|-------|---------------------------|
| Bit 0 | 0x01 | Venta Facturada           |
| Bit 1 | 0x02 | Pago Digital (vs Efectivo)|
| Bit 2 | 0x04 | Subsidio Estatal Aplicado |
| Bit 3 | 0x08 | Cliente Flota/Institucional|