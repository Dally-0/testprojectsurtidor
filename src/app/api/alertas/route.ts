// ============================================================
// API Route: Alertas — GET / POST / PATCH
// ============================================================
// Gestión del historial de alertas e incidentes.
// Integrado con el patrón Observer (PumpMonitor) y validación OWASP.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getAdapter } from '@/core/adapters/DatabaseAdapter';
import { AlertStatus, AlertType } from '@/types';

/**
 * GET /api/alertas
 * Lista alertas con filtros opcionales.
 */
export async function GET(request: NextRequest) {
  try {
    const adapter = getAdapter();
    const { searchParams } = new URL(request.url);

    const surtidorId = searchParams.get('surtidor_id') || undefined;
    const estado = searchParams.get('estado') as AlertStatus || undefined;
    const tipo = searchParams.get('tipo') || undefined;

    if (surtidorId && !/^[a-zA-Z0-9-]+$/.test(surtidorId)) {
      return NextResponse.json({ success: false, error: 'Identificador surtidor_id no válido' }, { status: 400 });
    }

    if (estado && !Object.values(AlertStatus).includes(estado)) {
      return NextResponse.json({ success: false, error: `Estado de alerta no válido: ${estado}` }, { status: 400 });
    }

    const alertas = await adapter.getAlertas({
      surtidorId,
      estado,
      tipo,
    });

    return NextResponse.json({
      success: true,
      data: alertas,
      count: alertas.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/alertas
 * Crea una nueva alerta manualmente.
 */
export async function POST(request: NextRequest) {
  try {
    const adapter = getAdapter();
    const body = await request.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'Cuerpo de petición inválido' }, { status: 400 });
    }

    const { surtidor_id, tipo, estado } = body;

    if (!surtidor_id || typeof surtidor_id !== 'string' || !/^[a-zA-Z0-9-]+$/.test(surtidor_id)) {
      return NextResponse.json({ success: false, error: 'Se requiere un surtidor_id válido' }, { status: 400 });
    }

    if (!tipo || typeof tipo !== 'string' || !tipo.trim()) {
      return NextResponse.json({ success: false, error: 'El campo tipo es obligatorio' }, { status: 400 });
    }

    const estadoFinal = estado || AlertStatus.PENDIENTE;
    if (!Object.values(AlertStatus).includes(estadoFinal)) {
      return NextResponse.json({ success: false, error: `Estado inválido: ${estadoFinal}` }, { status: 400 });
    }

    const alerta = await adapter.createAlerta({
      surtidor_id,
      tipo: tipo.trim() as AlertType,
      estado: estadoFinal,
    });

    return NextResponse.json({ success: true, data: alerta }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/alertas
 * Actualiza el estado de una alerta existente.
 */
export async function PATCH(request: NextRequest) {
  try {
    const adapter = getAdapter();
    const body = await request.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'Cuerpo de petición inválido' }, { status: 400 });
    }

    const { id, estado } = body;

    if (!id || typeof id !== 'string' || !/^[a-zA-Z0-9-]+$/.test(id)) {
      return NextResponse.json(
        { success: false, error: 'Se requiere un identificador id válido' },
        { status: 400 }
      );
    }

    if (!estado || !Object.values(AlertStatus).includes(estado)) {
      return NextResponse.json(
        { success: false, error: `Estado inválido o ausente: ${estado}` },
        { status: 400 }
      );
    }

    const alerta = await adapter.updateAlertaEstado(id, estado);

    return NextResponse.json({ success: true, data: alerta });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
