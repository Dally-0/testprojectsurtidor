// ============================================================
// API Route: Surtidores — GET / POST
// ============================================================
// Usa el DatabaseAdapter (Patrón Adapter) y PumpFactory (Patrón Factory)
// para gestionar surtidores de forma desacoplada y segura.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getAdapter } from '@/core/adapters/DatabaseAdapter';
import { PumpFactory } from '@/core/factories/PumpFactory';
import { FuelType } from '@/types';

/**
 * GET /api/surtidores
 * Lista todos los surtidores. Opcionalmente filtra por sucursal.
 */
export async function GET(request: NextRequest) {
  try {
    const adapter = getAdapter();
    const { searchParams } = new URL(request.url);
    const sucursalId = searchParams.get('sucursal_id') || undefined;

    if (sucursalId && !/^[a-zA-Z0-9-]+$/.test(sucursalId)) {
      return NextResponse.json(
        { success: false, error: 'Identificador de sucursal no válido' },
        { status: 400 }
      );
    }

    const surtidores = await adapter.getSurtidores(sucursalId);

    return NextResponse.json({
      success: true,
      data: surtidores,
      count: surtidores.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/surtidores
 * Crea un nuevo surtidor usando PumpFactory para validar e instanciar.
 */
export async function POST(request: NextRequest) {
  try {
    const adapter = getAdapter();
    const body = await request.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Cuerpo de petición inválido' },
        { status: 400 }
      );
    }

    const { combustible, numero_bomba, capacidad_maxima, nivel_actual, sucursal_id } = body;

    const validationErrors: string[] = [];

    // Validar tipo de combustible
    if (!combustible || !Object.values(FuelType).includes(combustible)) {
      validationErrors.push(`Tipo de combustible inválido o no reconocido: ${combustible}`);
    }

    if (!numero_bomba || isNaN(Number(numero_bomba)) || Number(numero_bomba) <= 0) {
      validationErrors.push('El número de bomba debe ser un entero positivo mayor a 0.');
    }

    if (!capacidad_maxima || isNaN(Number(capacidad_maxima)) || Number(capacidad_maxima) <= 0) {
      validationErrors.push('La capacidad máxima debe ser un número positivo.');
    }

    if (nivel_actual === undefined || isNaN(Number(nivel_actual)) || Number(nivel_actual) < 0) {
      validationErrors.push('El nivel actual debe ser mayor o igual a 0.');
    } else if (Number(nivel_actual) > Number(capacidad_maxima)) {
      validationErrors.push('El nivel actual no puede superar la capacidad máxima.');
    }

    if (!sucursal_id || typeof sucursal_id !== 'string' || !/^[a-zA-Z0-9-]+$/.test(sucursal_id)) {
      validationErrors.push('El identificador de sucursal es obligatorio y debe ser válido.');
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { success: false, errors: validationErrors, error: validationErrors.join(' ') },
        { status: 400 }
      );
    }

    // Usar PumpFactory para validar reglas de negocio
    const validation = PumpFactory.validate(combustible as FuelType, {
      numero_bomba: Number(numero_bomba),
      capacidad_maxima: Number(capacidad_maxima),
      nivel_actual: Number(nivel_actual),
      sucursal_id,
    });

    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, errors: validation.errors, error: validation.errors.join(' ') },
        { status: 400 }
      );
    }

    // Crear vía Factory y persistir vía Adapter
    const pump = PumpFactory.create(combustible as FuelType, {
      numero_bomba: Number(numero_bomba),
      capacidad_maxima: Number(capacidad_maxima),
      nivel_actual: Number(nivel_actual),
      sucursal_id,
    });

    const entity = pump.toEntity();
    const created = await adapter.createSurtidor({
      numero_bomba: entity.numero_bomba,
      combustible: entity.combustible,
      capacidad_maxima: entity.capacidad_maxima,
      nivel_actual: entity.nivel_actual,
      sucursal_id: entity.sucursal_id,
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
