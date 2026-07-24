'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import {
  Fuel,
  Droplets,
  Wind,
  BarChart3,
  ArrowRight,
  Star,
  ShieldCheck,
  Clock,
  Users,
  MapPin,
  Phone,
  Mail,
  Timer,
  Building2,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';

interface TelemetriaBomba {
  id: number;
  tipo: string;
  precio: string;
  nivel: string;
  status: string;
  color: string;
}

interface TelemetriaSucursal {
  id: string;
  nombre: string;
  ciudad: string;
  bombas: TelemetriaBomba[];
}

const DEFAULT_SUCURSALES_TELEMETRIA: TelemetriaSucursal[] = [
  {
    id: 'suc-001',
    nombre: 'Estación Central Dally',
    ciudad: 'Santa Cruz — Parque Industrial',
    bombas: [
      { id: 1, tipo: 'Gasolina Especial', precio: 'Bs. 3.74/L', nivel: '8,500 / 15,000 L', status: 'normal', color: 'accent' },
      { id: 2, tipo: 'Diésel B5', precio: 'Bs. 3.72/L', nivel: '12,000 / 20,000 L', status: 'normal', color: 'info' },
      { id: 3, tipo: 'GNV Comprimido', precio: 'Bs. 1.66/m³', nivel: '200 BAR (3,200 L)', status: 'warning', color: 'success' },
      { id: 4, tipo: 'Premium 95', precio: 'Bs. 4.79/L', nivel: '6,800 / 10,000 L', status: 'normal', color: 'warning' },
    ],
  },
  {
    id: 'suc-002',
    nombre: 'Estación Norte Dally',
    ciudad: 'Santa Cruz — Av. Banzer km 8',
    bombas: [
      { id: 1, tipo: 'Gasolina Especial', precio: 'Bs. 3.74/L', nivel: '11,200 / 15,000 L', status: 'normal', color: 'accent' },
      { id: 2, tipo: 'Diésel B5', precio: 'Bs. 3.72/L', nivel: '15,800 / 20,000 L', status: 'normal', color: 'info' },
      { id: 3, tipo: 'GNV Comprimido', precio: 'Bs. 1.66/m³', nivel: '210 BAR (5,400 L)', status: 'normal', color: 'success' },
      { id: 4, tipo: 'Premium 95', precio: 'Bs. 4.79/L', nivel: '8,100 / 10,000 L', status: 'normal', color: 'warning' },
    ],
  },
  {
    id: 'suc-003',
    nombre: 'Estación Equipetrol Dally',
    ciudad: 'Santa Cruz — Av. San Martín',
    bombas: [
      { id: 1, tipo: 'Gasolina Especial', precio: 'Bs. 3.74/L', nivel: '9,400 / 15,000 L', status: 'normal', color: 'accent' },
      { id: 2, tipo: 'Diésel B5', precio: 'Bs. 3.72/L', nivel: '14,000 / 20,000 L', status: 'normal', color: 'info' },
      { id: 3, tipo: 'GNV Comprimido', precio: 'Bs. 1.66/m³', nivel: '195 BAR (2,800 L)', status: 'warning', color: 'success' },
      { id: 4, tipo: 'Premium 95', precio: 'Bs. 4.79/L', nivel: '7,500 / 10,000 L', status: 'normal', color: 'warning' },
    ],
  },
];

export default function LandingPage() {
  const [sucursalesList, setSucursalesList] = useState<TelemetriaSucursal[]>(DEFAULT_SUCURSALES_TELEMETRIA);
  const [selectedSucursalIdx, setSelectedSucursalIdx] = useState(0);

  useEffect(() => {
    async function fetchRealSucursales() {
      try {
        const [sucRes, surtRes] = await Promise.all([
          supabase.from('sucursales').select('*').order('nombre', { ascending: true }),
          supabase.from('surtidores').select('*').order('numero_bomba', { ascending: true }),
        ]);

        if (sucRes.data && sucRes.data.length > 0) {
          const PRECIOS: Record<string, string> = {
            'Gasolina Especial': 'Bs. 3.74/L',
            'Diésel': 'Bs. 3.72/L',
            'GNV': 'Bs. 1.66/m³',
            'Premium': 'Bs. 4.79/L',
          };

          const COLORES: Record<string, string> = {
            'Gasolina Especial': 'accent',
            'Diésel': 'info',
            'GNV': 'success',
            'Premium': 'warning',
          };

          const dynamicSucursales: TelemetriaSucursal[] = sucRes.data.map((suc) => {
            const bombasParaSuc = surtRes.data
              ? surtRes.data.filter((s) => s.sucursal_id === suc.id)
              : [];

            return {
              id: suc.id,
              nombre: suc.nombre,
              ciudad: `${suc.ciudad} — ${suc.direccion}`,
              bombas:
                bombasParaSuc.length > 0
                  ? bombasParaSuc.map((b) => ({
                      id: b.numero_bomba,
                      tipo: b.combustible,
                      precio: PRECIOS[b.combustible] || 'Bs. 4.00/L',
                      nivel: `${Number(b.nivel_actual).toLocaleString('es-BO')} / ${Number(b.capacidad_maxima).toLocaleString('es-BO')} L`,
                      status: 'normal',
                      color: COLORES[b.combustible] || 'accent',
                    }))
                  : [
                      { id: 1, tipo: 'Gasolina Especial', precio: 'Bs. 3.74/L', nivel: '10,500 / 15,000 L', status: 'normal', color: 'accent' },
                      { id: 2, tipo: 'Diésel', precio: 'Bs. 3.72/L', nivel: '14,200 / 20,000 L', status: 'normal', color: 'info' },
                      { id: 3, tipo: 'GNV', precio: 'Bs. 1.66/m³', nivel: '4,500 / 8,000 L', status: 'normal', color: 'success' },
                      { id: 4, tipo: 'Premium', precio: 'Bs. 4.79/L', nivel: '7,100 / 10,000 L', status: 'normal', color: 'warning' },
                    ],
            };
          });

          setSucursalesList(dynamicSucursales);
        }
      } catch (e) {
        console.error('Error cargando sucursales para telemetría:', e);
      }
    }

    fetchRealSucursales();
  }, []);

  const safeIdx = selectedSucursalIdx < sucursalesList.length ? selectedSucursalIdx : 0;
  const currentSucursal = sucursalesList[safeIdx] || sucursalesList[0];

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section
        id="inicio"
        className="relative min-h-screen flex items-center justify-center overflow-hidden py-24"
      >
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 w-full pt-12">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column — Text */}
            <div className="lg:col-span-7">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-8 animate-fade-in-up">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                <span className="text-xs tracking-figma-wide text-accent font-medium">
                  IMPORTACIÓN DIRECTA Y GARANTÍA DE ABASTECIMIENTO EN BOLIVIA
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="heading-figma text-4xl sm:text-6xl md:text-7xl lg:text-7xl mb-6 leading-none animate-fade-in-up stagger-1 opacity-0">
                COMBUSTIBLE<br />
                <span className="text-accent">DE CALIDAD Y</span><br />
                DESPACHO ÁGIL
              </h1>

              {/* Subtitle */}
              <p className="text-text-secondary text-base sm:text-lg md:text-xl max-w-2xl mb-10 leading-relaxed animate-fade-in-up stagger-2 opacity-0">
                Frente a los desafíos de abastecimiento y la escasez nacional, Dally SRL lidera la importación directa y distribución continua de combustibles en Bolivia para que el transporte y la industria jamás se detengan.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 animate-fade-in-up stagger-3 opacity-0">
                <a
                  href="#servicios"
                  id="hero-cta-services"
                  className="group inline-flex items-center gap-2.5 bg-accent hover:bg-accent-hover text-background font-bold tracking-figma px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-accent/20 hover:shadow-accent/30"
                >
                  SOLUCIONES DE ABASTECIMIENTO
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#contacto"
                  id="hero-cta-contact"
                  className="inline-flex items-center gap-2 border border-border hover:border-text-secondary text-text-primary font-semibold tracking-figma px-8 py-3.5 rounded-xl transition-all hover:bg-surface"
                >
                  RESERVA PARA FLOTAS
                </a>
              </div>
            </div>

            {/* Right Column — Hero Visual Showcase: Realistic Bolivian Fuel Pumps Display */}
            <div className="lg:col-span-5 relative animate-fade-in-up stagger-4 opacity-0">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                {/* Glow Ring Behind Terminal */}
                <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-accent/60 via-accent/25 to-yellow-500/20 blur-2xl opacity-80 animate-pulse-glow" />

                {/* Surtidor Box Terminal */}
                <div className="relative rounded-2xl bg-surface/95 border-2 border-accent/40 overflow-hidden shadow-2xl shadow-black/95">
                  
                  {/* ===== TOP PROMINENT BANNER LABEL ===== */}
                  <div className="bg-gradient-to-r from-accent via-accent-hover to-accent text-background px-4 py-2.5 flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-2">
                      <Fuel className="w-4 h-4 text-background shrink-0" />
                      <span className="text-xs font-black tracking-wide uppercase">
                        Verifica la cantidad de gasolina en nuestros surtidores
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-background/20 px-2 py-0.5 rounded text-background">
                      EN VIVO
                    </span>
                  </div>

                  {/* ===== SUCURSAL SELECTOR BUTTONS AT THE TOP ===== */}
                  <div className="px-4 pt-3.5 pb-3 border-b border-border bg-surface-alt/70">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] tracking-figma-wide text-text-muted font-bold flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-accent" /> ELEGIR SUCURSAL:
                      </span>
                      <span className="text-[10px] text-accent font-mono font-bold">
                        {currentSucursal.nombre}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                      {sucursalesList.map((suc, idx) => (
                        <button
                          key={suc.id}
                          type="button"
                          onClick={() => setSelectedSucursalIdx(idx)}
                          className={`flex-1 min-w-[100px] text-[10px] font-bold py-1.5 px-2 rounded-xl border transition-all text-center truncate ${
                            safeIdx === idx
                              ? 'border-accent bg-accent/25 text-accent shadow-md shadow-accent/10 font-black scale-[1.02]'
                              : 'border-border bg-surface/90 text-text-muted hover:text-text-primary hover:border-text-muted'
                          }`}
                        >
                          {suc.nombre.replace('Estación ', '')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Top Station Header Bar */}
                  <div className="bg-gradient-to-r from-surface-alt via-accent/15 to-surface-alt px-5 py-3 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center">
                        <Fuel className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-xs font-black tracking-figma text-text-primary">{currentSucursal.nombre}</p>
                        <p className="text-[10px] font-mono text-text-muted">{currentSucursal.ciudad.toUpperCase()}</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-success bg-success/15 border border-success/30 px-2.5 py-0.5 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      RESERVA ACTIVA
                    </span>
                  </div>

                  {/* Hero Graphic Image Frame */}
                  <div className="relative aspect-[16/9] w-full border-b border-border/80 overflow-hidden">
                    <Image
                      src="/fuel_station_hero.png"
                      alt="Surtidor de Combustible Dally SRL"
                      fill
                      priority
                      className="object-cover object-center transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
                    <div className="absolute top-3 right-3 bg-background/80 backdrop-blur border border-border rounded-lg px-2.5 py-1 text-[10px] font-mono text-accent">
                      IMPORTACIÓN DIRECTA
                    </div>
                  </div>

                  {/* Realistic Fuel Dispensers Grid (Bolivia Style) */}
                  <div className="p-4 space-y-3 bg-surface/60">
                    <div className="grid grid-cols-2 gap-2.5">
                      {currentSucursal.bombas.map((bomba) => (
                        <div
                          key={bomba.id}
                          className={`bg-surface-alt/90 border rounded-xl p-3 transition-colors ${
                            bomba.color === 'accent'
                              ? 'border-accent/30 hover:border-accent'
                              : bomba.color === 'info'
                              ? 'border-info/30 hover:border-info'
                              : bomba.color === 'success'
                              ? 'border-success/30 hover:border-success'
                              : 'border-warning/30 hover:border-warning'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className={`text-[11px] font-bold font-mono text-${bomba.color}`}>
                              BOMBA #{bomba.id}
                            </span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded bg-${bomba.color}/20 text-${bomba.color}`}>
                              {bomba.precio}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-text-primary mb-1 truncate">{bomba.tipo}</p>
                          <div className="bg-background/90 rounded border border-border p-1.5 font-mono text-center">
                            <span className="text-[10px] text-text-muted block">TANQUE ESTRATÉGICO</span>
                            <span className="text-xs font-bold text-text-primary">{bomba.nivel}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Terminal Footer */}
                  <div className="px-4 py-2.5 bg-surface border-t border-border flex items-center justify-between">
                    <span className="text-[10px] text-text-muted font-mono">DISTRIBUCIÓN CONTINUA GARANTIZADA</span>
                    <span className="text-[10px] text-accent font-mono font-semibold">SUPABASE REALTIME</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="border-t border-b border-border bg-surface/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '150,000 L', label: 'Importación diaria continua', icon: Droplets },
              { value: '100%', label: 'Garantía de reserva en tanques', icon: ShieldCheck },
              { value: '2026', label: 'Inicio de importación directa', icon: Timer },
              { value: '360+', label: 'Flotas con suministro seguro', icon: Users },
            ].map((stat, i) => (
              <div
                key={i}
                className={`text-center animate-fade-in-up stagger-${i + 1} opacity-0`}
              >
                <stat.icon className="w-5 h-5 text-accent mx-auto mb-3" />
                <div className="text-3xl md:text-4xl font-black text-accent mb-1">
                  {stat.value}
                </div>
                <div className="text-xs tracking-figma text-text-muted">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICIOS ===== */}
      <section id="servicios" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-16">
            <span className="text-sm tracking-figma-wide text-text-muted">
              — 01 / ESTRATEGIA Y SERVICIOS
            </span>
            <h2 className="heading-figma text-4xl md:text-5xl mt-4 text-text-primary">
              RESPUESTA AL DESABASTECIMIENTO
            </h2>
          </div>

          {/* Service Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Card 1: Gasolina Importada */}
            <div className="bg-surface border border-border rounded-xl p-8 card-hover group" id="service-gasolina">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <Fuel className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold tracking-figma mb-3">GASOLINA 91 Y 95 DE IMPORTACIÓN</h3>
              <p className="text-text-secondary leading-relaxed">
                Combustible de alta pureza e importación certificada. Abastecimiento garantizado sin filas ni suspensiones en nuestras estaciones principales.
              </p>
            </div>

            {/* Card 2: Diesel para Industria */}
            <div className="bg-surface border border-border rounded-xl p-8 card-hover group" id="service-diesel">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <Droplets className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold tracking-figma mb-3">DIÉSEL PRIVADO PARA EL TRANSPORTE Y LA AGROINDUSTRIA</h3>
              <p className="text-text-secondary leading-relaxed">
                Logística dedicada para cadenas productivas y maquinaria pesada. Mantenemos el flujo continuo en la siembra y el transporte de carga nacional.
              </p>
            </div>

            {/* Card 3: GNV Matriz Limpia */}
            <div className="bg-surface border border-border rounded-xl p-8 card-hover group" id="service-gnv">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <Wind className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold tracking-figma mb-3">GNV & ALTERNATIVA ENERGÉTICA NACIONAL</h3>
              <p className="text-text-secondary leading-relaxed">
                Compresores de alta presión para vehículos convertidos. Mitigación inmediata del impacto económico del combustible líquido tradicional.
              </p>
            </div>

            {/* Card 4: Reserva Estratégica de Flotas */}
            <div className="bg-surface border border-border rounded-xl p-8 card-hover group" id="service-flotas">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <BarChart3 className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold tracking-figma mb-3">RESERVA ESTRATÉGICA CORPORATIVA</h3>
              <p className="text-text-secondary leading-relaxed">
                Cupos prioritarios y cisternas reservadas para flotas empresariales. Evite la paralización de sus operaciones en escenarios críticos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NOSOTROS ===== */}
      <section id="nosotros" className="py-24 bg-surface/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-12">
            <span className="text-sm tracking-figma-wide text-text-muted">
              — 02 / COMPROMISO NACIONAL
            </span>
          </div>

          <div className="max-w-4xl">
            <h2 className="heading-figma text-4xl md:text-6xl text-text-primary mb-2">
              IMPORTACIÓN DIRECTA Y RESILIENCIA
            </h2>
            <h2 className="heading-figma text-4xl md:text-6xl text-accent mb-10">
              PARA BOLIVIA
            </h2>

            <p className="text-text-secondary text-lg leading-relaxed mb-6">
              Con la apertura regulatoria del sector de hidrocarburos en este 2026 para la libre importación por parte del sector privado en Bolivia, Dally SRL se consolida como empresa pionera al iniciar la importación directa y el almacenamiento estratégico a gran escala.
            </p>
            <p className="text-text-secondary text-lg leading-relaxed mb-12">
              Ante la actual coyuntura de escasez nacional, nuestra misión en este 2026 es actuar como una solución energética inmediata para Bolivia, garantizando que el transporte, las familias y las industrias dispongan de combustible confiable, continuo y medido con absoluta precisión.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-8">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-accent" />
                <span className="text-sm tracking-figma text-text-secondary">
                  Importación Certificada
                </span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-success" />
                <span className="text-sm tracking-figma text-text-secondary">
                  Protección ante Escasez
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-info" />
                <span className="text-sm tracking-figma text-text-secondary">
                  Telemetría 24/7 sin Interrupción
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTACTO ===== */}
      <section id="contacto" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-12">
            <span className="text-sm tracking-figma-wide text-text-muted">
              — 03 / CONTACTO
            </span>
            <h2 className="heading-figma text-4xl md:text-5xl mt-4 text-text-primary">
              HABLEMOS
            </h2>
          </div>

          {/* Contact Info */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-accent" />
              </div>
              <div>
                <span className="text-xs tracking-figma-wide text-text-muted block mb-1">
                  DIRECCIÓN
                </span>
                <span className="text-sm text-text-secondary">
                  Av. Blanco Galindo km 10, Zona Industrial Quillacollo, Cochabamba
                </span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-accent" />
              </div>
              <div>
                <span className="text-xs tracking-figma-wide text-text-muted block mb-1">
                  TELÉFONO
                </span>
                <span className="text-sm text-text-secondary">
                  +591 4 458-9200 / +591 70-123-456
                </span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-accent" />
              </div>
              <div>
                <span className="text-xs tracking-figma-wide text-text-muted block mb-1">
                  CORREO
                </span>
                <span className="text-sm text-text-secondary">
                  operaciones@dallysrl.bo / flotas@dallysrl.bo
                </span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-accent" />
              </div>
              <div>
                <span className="text-xs tracking-figma-wide text-text-muted block mb-1">
                  HORARIO
                </span>
                <span className="text-sm text-text-secondary">
                  Abierto 24 horas — 365 días del año
                </span>
              </div>
            </div>
          </div>

          {/* Embedded Google Maps (Dark Mode Styled) */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold tracking-figma text-text-primary">RED DE ESTACIONES EN MAPA</h3>
                <p className="text-xs text-text-muted mt-0.5">Ubicaciones de abastecimiento estratégico en Cochabamba y Bolivia</p>
              </div>
              <span className="text-xs font-mono font-bold text-accent bg-accent/15 px-3 py-1 rounded-full border border-accent/20">
                5 ESTACIONES ACTIVAS EN BOLIVIA
              </span>
            </div>

            {/* Interactive Location Cards Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { nombre: 'Estación Quillacollo Dally', ciudad: 'Cochabamba', dir: 'Av. Blanco Galindo km 10 (Quillacollo)', estado: '24/7 Abierto' },
                { nombre: 'Estación Sacaba Dally', ciudad: 'Cochabamba', dir: 'Av. Villazón km 4 (Sacaba)', estado: '24/7 Abierto' },
                { nombre: 'Estación Central Dally', ciudad: 'Santa Cruz', dir: 'Av. Petrolera 1450 (Parque Industrial)', estado: '24/7 Abierto' },
                { nombre: 'Estación Norte Dally', ciudad: 'Santa Cruz', dir: 'Av. Banzer km 8 (Zona Norte)', estado: '24/7 Abierto' },
                { nombre: 'Estación Equipetrol Dally', ciudad: 'Santa Cruz', dir: 'Av. San Martín (Zona Equipetrol)', estado: '24/7 Abierto' },
              ].map((loc, i) => (
                <div key={i} className="bg-surface border border-border hover:border-accent/50 rounded-xl p-4 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-accent shrink-0" />
                      <span className="text-xs font-bold text-text-primary">{loc.nombre}</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded">
                      {loc.ciudad}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted font-mono mb-2">{loc.dir}</p>
                  <span className="inline-block text-[10px] font-bold text-success bg-success/15 px-2 py-0.5 rounded-full">
                    {loc.estado}
                  </span>
                </div>
              ))}
            </div>

            {/* Dark Mode Google Maps Embed (Cochabamba) */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-accent/30 shadow-2xl shadow-black/90">
              <iframe
                title="Mapa de Estaciones Dally SRL Cochabamba Bolivia"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.4123456789!2d-66.1568!3d-17.3895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x93e373d123456789%3A0x123456789abcdef!2sCochabamba%2C+Bolivia!5e0!3m2!1ses!2sbo!4v1700000000000!5m2!1ses!2sbo"
                width="100%"
                height="420"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(1.2)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Fuel className="w-4 h-4 text-accent" />
              <span className="text-sm tracking-figma text-text-muted">
                DALLY SRL
              </span>
            </div>
            <p className="text-xs text-text-muted">
              © {new Date().getFullYear()} Dally SRL. Todos los derechos reservados.
            </p>
            <Link
              href="/login"
              className="text-xs tracking-figma text-accent hover:text-accent-hover transition-colors"
            >
              ACCESO AL SISTEMA →
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
