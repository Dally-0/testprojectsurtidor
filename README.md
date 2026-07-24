<div align="center">

# ⛽ Dally SRL — Sistema de Gestión de Combustible

### Panel operativo en tiempo real para estaciones de servicio

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-testprojectsurtidor.vercel.app-F5C518?style=for-the-badge&logo=vercel&logoColor=black)](https://testprojectsurtidor.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js%2016-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS%20v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 🌐 Demo en Vivo

**→ [https://testprojectsurtidor.vercel.app](https://testprojectsurtidor.vercel.app)**

Accede al dashboard operativo directamente desde el navegador sin configuración local.

### 🔑 Credenciales de Acceso (Demo)

| Campo | Valor |
|-------|-------|
| **Usuario** | `davidwcz05@gmail.com` |
| **Contraseña** | `1234lol` |

> Estas credenciales son de demostración con acceso completo como **Superadmin**.

---

## 📋 Descripción del Proyecto

**Dally SRL** es un sistema fullstack de gestión operativa para estaciones de servicio de combustible. Permite a los administradores monitorear ventas en tiempo real, registrar despachos, analizar métricas por tipo de combustible y gestionar alertas de nivel crítico, todo desde un único panel web.

El proyecto fue desarrollado con enfoque académico y profesional, aplicando **patrones de diseño clásicos GoF** (Factory, Adapter, Observer), **aritmética binaria** para la codificación de metadata de ventas, y una arquitectura limpia orientada a componentes serverless.

---

## 🖥️ Capturas de Pantalla

| Landing Page | Dashboard Operativo | Nueva Venta |
|:---:|:---:|:---:|
| Presentación institucional de la empresa con métricas y servicios | Panel KPIs en tiempo real, gráficos de área y dona, tabla de transacciones | Formulario de despacho con selector de surtidores, precios y flags binarios |

---

## ✨ Funcionalidades

| Módulo | Descripción |
|--------|-------------|
| 🏠 **Landing Page** | Página corporativa con métricas, servicios y CTA al dashboard |
| 📊 **Dashboard KPIs** | Ventas del día, litros despachados, transacciones y alertas en tiempo real |
| 📈 **Gráficos** | Gráfico de área semanal (Gasolina vs Diésel) + dona de mix de combustibles |
| ⛽ **Nueva Venta** | Registro de despachos como admin con selector visual de surtidores y nivel de tanque |
| 🔔 **Notificaciones** | Panel desplegable con historial de ventas del día (tipo, monto, litros, hora) |
| 👤 **Perfil** | Vista de cuenta del administrador en modo solo lectura |
| 📋 **Reportes** | Decodificación visual del campo `metadata_binaria` (flags de bits por venta) |
| 👥 **Operadores** | Tabla de operadores activos con conteo de ventas del turno |
| 🔴 **Alertas** | Sistema automático de nivel crítico vía Observer pattern |

---

## 🛠️ Stack Tecnológico

### Frontend
| Tecnología | Uso |
|-----------|-----|
| **Next.js 16** (App Router) | Framework fullstack con SSR y Server Components |
| **TypeScript** | Tipado estático estricto en todo el proyecto |
| **Tailwind CSS v4** | Sistema de diseño con tokens personalizados (colores, tipografía, animaciones) |
| **Recharts** | Gráficos de área y dona responsive |
| **Lucide React** | Librería de iconos modernos |

### Backend & Base de Datos
| Tecnología | Uso |
|-----------|-----|
| **Supabase** (PostgreSQL) | Base de datos relacional en la nube con cliente JS |
| **Next.js API Routes** | Endpoints serverless para CRUD de ventas, surtidores y alertas |
| **Supabase Auth** *(conceptual)* | Integración de autenticación con `auth.users` |

### Infraestructura
| Tecnología | Uso |
|-----------|-----|
| **Vercel** | Deploy automático desde Git, CDN global |
| **Turbopack** | Compilador ultrarrápido de Next.js |

---

## 🧩 Patrones de Diseño (GoF)

### 🏭 1. Factory Pattern — `PumpFactory`
> `src/core/factories/PumpFactory.ts`

Centraliza la creación y validación de surtidores por tipo de combustible. Cada bomba (`GasolinaEspecialPump`, `DieselPump`, `GNVPump`, `PremiumPump`) hereda de una clase base con capacidades máximas y umbrales de seguridad predefinidos. El API de surtidores nunca crea una bomba sin pasar primero por la Factory.

### 🔌 2. Adapter Pattern — `DatabaseAdapter`
> `src/core/adapters/DatabaseAdapter.ts`

Define la interfaz `IDatabaseAdapter` que abstrae completamente la capa de persistencia. El `SupabaseDatabaseAdapter` implementa esa interfaz contra la API de Supabase. Si en el futuro se cambia de proveedor, solo se reemplaza el adaptador sin tocar la lógica de negocio.

### 👁️ 3. Observer Pattern — `AlertObserver`
> `src/core/observers/AlertObserver.ts`

`PumpMonitor` actúa como sujeto que observa los niveles de combustible tras cada venta. Cuando el nivel cae por debajo del umbral seguro (definido en la Factory), notifica a los observadores registrados, que generan alertas automáticas en la base de datos.

---

## ⚙️ Aritmética Binaria — `metadata_binaria`

Cada venta almacena sus características en **un solo campo entero** usando operaciones de bits, optimizando el almacenamiento y habilitando filtros de alta velocidad.

```
metadata_binaria = 0b 0000 FFSS PPII
                          │ │  │  └── Bit 0 (0x01): Facturada
                          │ │  └───── Bit 1 (0x02): Pago Digital
                          │ └──────── Bit 2 (0x04): Subsidio Estatal
                          └────────── Bit 3 (0x08): Cliente Flota
```

| Operación | Código | Descripción |
|-----------|--------|-------------|
| Codificar | `flags \| 0x01` | Activar bit de "Facturada" |
| Verificar | `flags & 0x02` | Comprobar si fue "Pago Digital" |
| Decodificar | `.toString(2).padStart(4, '0')` | Representación binaria visual |

La pestaña **"REPORTES"** del dashboard incluye un decodificador visual en tiempo real de todas las transacciones del día.

---

## 🎨 Diseño y Estética

El sistema aplica un estilo **dark mode industrial** inspirado en interfaces de control operativo:

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-background` | `#0D0D0D` | Fondo principal (negro profundo) |
| `--color-surface` | `#1A1A1A` | Superficies y tarjetas |
| `--color-accent` | `#F5C518` | Amarillo señalización — CTA y métricas |
| `--color-success` | `#22C55E` | Estados positivos y niveles altos |
| `--color-danger` | `#EF4444` | Alertas y errores |
| `--color-info` | `#3B82F6` | Diésel y elementos informativos |

**Tipografía:** [Inter](https://fonts.google.com/specimen/Inter) — moderna y de alta legibilidad técnica.

**Animaciones:** `fadeIn`, `fadeInUp`, `slideInRight`, `pulse-glow`, `float` — micro-animaciones CSS nativas para una experiencia premium.

**Glassmorphism:** Aplicado en overlays y dropdowns del header con `backdrop-filter: blur`.

---

## 🗄️ Estructura del Proyecto

```
src/
├── app/
│   ├── (auth)/login/        # Autenticación
│   ├── api/                 # Endpoints serverless
│   │   ├── alertas/         # CRUD alertas
│   │   ├── dashboard/       # Datos centralizados del panel
│   │   ├── surtidores/      # CRUD bombas
│   │   └── ventas/          # Registro de transacciones
│   ├── dashboard/           # Panel principal (4 pestañas)
│   ├── globals.css          # Tokens de diseño y animaciones
│   └── page.tsx             # Landing Page corporativa
├── components/dashboard/    # KPICard, SalesChart, FuelMixChart, TransactionsTable
├── core/
│   ├── adapters/            # Patrón Adapter (DatabaseAdapter)
│   ├── factories/           # Patrón Factory (PumpFactory)
│   ├── observers/           # Patrón Observer (AlertObserver)
│   └── utils/               # Aritmética binaria (binaryMetadata)
├── lib/
│   └── supabase.ts          # Cliente Supabase
├── types/
│   └── index.ts             # Interfaces y enums globales
└── prisma/
    ├── schema.sql           # Definición de tablas en Supabase
    └── seed.sql             # Datos de demostración
```

---

## 🗃️ Base de Datos

El esquema está definido en `prisma/schema.sql` para ejecutar en el SQL Editor de Supabase.

```
sucursales ──< surtidores ──< ventas
           └─< usuarios   ──< ventas
               surtidores ──< alertas
```

**Tablas:** `sucursales` · `usuarios` · `surtidores` · `ventas` · `alertas`

---

<div align="center">

Desarrollado con ❤️ por el equipo **Dally SRL**

[![Deploy con Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://testprojectsurtidor.vercel.app)

</div>
