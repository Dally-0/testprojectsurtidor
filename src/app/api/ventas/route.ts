// ============================================================
// API Route: Ventas — GET / POST
// ============================================================
// Incluye decodificación de metadata binaria (aritmética de bits)
// y validaciones estrictas de backend según OWASP.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getAdapter } from '@/core/adapters/DatabaseAdapter';
import { decodeFlags, encodeFlags } from '@/core/utils/binaryMetadata';
import { PumpMonitor } from '@/core/observers/AlertObserver';
import { PumpFactory } from '@/core/factories/PumpFactory';
import { FuelType } from '@/types';

/**
 * GET /api/ventas
 * Lista ventas con metadata binaria decodificada.
 * Soporta filtros por combustible, fecha, surtidor.
 */
export async function GET(request: NextRequest) {
  try {
    const adapter = getAdapter();
    const { searchParams } = new URL(request.url);

    const surtidorId = searchParams.get('surtidor_id') || undefined;
    const combustible = searchParams.get('combustible') || undefined;
    const fechaDesde = searchParams.get('fecha_desde') || undefined;
    const fechaHasta = searchParams.get('fecha_hasta') || undefined;

    // Sanitización básica de parámetros
    if (surtidorId && !/^[a-zA-Z0-9-]+$/.test(surtidorId)) {
      return NextResponse.json({ success: false, error: 'Parámetro surtidor_id inválido' }, { status: 400 });
    }

    const ventas = await adapter.getVentas({
      surtidorId,
      combustible,
      fechaDesde,
      fechaHasta,
    });

    const ventasConMetadata = ventas.map(venta => ({
      ...venta,
      metadata_decoded: decodeFlags(venta.metadata_binaria),
    }));

    return NextResponse.json({
      success: true,
      data: ventasConMetadata,
      count: ventasConMetadata.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ventas
 * Registra una nueva venta con validación estricta de esquema y seguridad.
 */
export async function POST(request: NextRequest) {
  try {
    const adapter = getAdapter();
    const body = await request.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'El cuerpo de la petición debe ser un objeto JSON válido' },
        { status: 400 }
      );
    }

    const {
      combustible,
      litros,
      precio_por_litro,
      surtidor_id,
      usuario_id,
      facturada = false,
      pagoDigital = false,
      subsidioAplicado = false,
      clienteFlota = false,
    } = body;

    const validationErrors: string[] = [];

    // Validaciones de esquema y tipo
    if (!combustible || typeof combustible !== 'string' || !combustible.trim()) {
      validationErrors.push('El campo combustible es obligatorio.');
    }

    const litrosNum = Number(litros);
    if (isNaN(litrosNum) || litrosNum <= 0 || litrosNum > 5000) {
      validationErrors.push('El número de litros debe ser mayor a 0 y no exceder 5,000 L.');
    }

    const precioNum = Number(precio_por_litro);
    if (isNaN(precioNum) || precioNum <= 0 || precioNum > 100) {
      validationErrors.push('El precio por litro debe ser un valor positivo entre 0.01 y 100 Bs.');
    }

    if (!surtidor_id || typeof surtidor_id !== 'string' || !/^[a-zA-Z0-9-]+$/.test(surtidor_id)) {
      validationErrors.push('El identificador surtidor_id no es válido.');
    }

    if (!usuario_id || typeof usuario_id !== 'string' || !/^[a-zA-Z0-9-]+$/.test(usuario_id)) {
      validationErrors.push('El identificador usuario_id no es válido.');
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { success: false, errors: validationErrors, error: validationErrors.join(' ') },
        { status: 400 }
      );
    }

    // Verificar nivel disponible del surtidor
    const surtidor = await adapter.getSurtidorById(surtidor_id);
    if (!surtidor) {
      return NextResponse.json(
        { success: false, error: 'El surtidor especificado no existe.' },
        { status: 404 }
      );
    }

    if (litrosNum > surtidor.nivel_actual) {
      return NextResponse.json(
        { success: false, error: `Los litros solicitados (${litrosNum} L) superan el nivel actual del surtidor (${surtidor.nivel_actual} L).` },
        { status: 400 }
      );
    }

    // Codificar flags de metadata binaria
    const metadata_binaria = encodeFlags({
      facturada: Boolean(facturada),
      pagoDigital: Boolean(pagoDigital),
      subsidioAplicado: Boolean(subsidioAplicado),
      clienteFlota: Boolean(clienteFlota),
    });

    const total = litrosNum * precioNum;

    const venta = await adapter.createVenta({
      combustible: combustible.trim(),
      litros: litrosNum,
      precio_por_litro: precioNum,
      total,
      surtidor_id,
      usuario_id,
      metadata_binaria,
    });

    // Actualizar nivel del surtidor y notificar al Observer
    const nuevoNivel = Math.max(0, surtidor.nivel_actual - litrosNum);
    await adapter.updateSurtidor(surtidor_id, { nivel_actual: nuevoNivel });

    const monitor = PumpMonitor.getInstance();
    const updatedSurtidor = { ...surtidor, nivel_actual: nuevoNivel };
    const threshold = PumpFactory.getSafetyThresholds()[surtidor.combustible as FuelType] || 500;
    monitor.checkPumpStatus(updatedSurtidor, threshold);

    return NextResponse.json({
      success: true,
      data: {
        ...venta,
        metadata_decoded: decodeFlags(metadata_binaria),
      },
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
