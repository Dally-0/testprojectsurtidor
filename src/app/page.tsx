'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
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

const SUCURSALES_TELEMETRIA = [
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
  const [selectedSucursalIdx, setSelectedSucursalIdx] = useState(0);
  const currentSucursal = SUCURSALES_TELEMETRIA[selectedSucursalIdx];

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
                  SISTEMA DE GESTIÓN EN TIEMPO REAL
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="heading-figma text-4xl sm:text-6xl md:text-7xl lg:text-7xl mb-6 leading-none animate-fade-in-up stagger-1 opacity-0">
                COMBUSTIBLE<br />
                <span className="text-accent">QUE MUEVE</span><br />
                AL PAÍS
              </h1>

              {/* Subtitle */}
              <p className="text-text-secondary text-base sm:text-lg md:text-xl max-w-2xl mb-10 leading-relaxed animate-fade-in-up stagger-2 opacity-0">
                Servicio de abastecimiento confiable, telemetría automatizada y
                gestión operativa inteligente para estaciones de servicio y flotas.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 animate-fade-in-up stagger-3 opacity-0">
                <a
                  href="#servicios"
                  id="hero-cta-services"
                  className="group inline-flex items-center gap-2.5 bg-accent hover:bg-accent-hover text-background font-bold tracking-figma px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-accent/20 hover:shadow-accent/30"
                >
                  VER SERVICIOS
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#contacto"
                  id="hero-cta-contact"
                  className="inline-flex items-center gap-2 border border-border hover:border-text-secondary text-text-primary font-semibold tracking-figma px-8 py-3.5 rounded-xl transition-all hover:bg-surface"
                >
                  CONTACTAR
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
                  {/* Top Canopy Bar */}
                  <div className="bg-gradient-to-r from-surface-alt via-accent/20 to-surface-alt px-5 py-3.5 border-b border-border flex items-center justify-between">
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
                      EN LÍNEA
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
                      BOMBAS 1 - 4
                    </div>
                  </div>

                  {/* Sucursal Selector Tabs / Buttons */}
                  <div className="px-4 pt-3 pb-2 border-b border-border bg-surface-alt/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] tracking-figma-wide text-text-muted font-bold flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-accent" /> SELECCIONAR SUCURSAL
                      </span>
                      <span className="text-[10px] text-accent font-mono">
                        {selectedSucursalIdx + 1} de {SUCURSALES_TELEMETRIA.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {SUCURSALES_TELEMETRIA.map((suc, idx) => (
                        <button
                          key={suc.id}
                          type="button"
                          onClick={() => setSelectedSucursalIdx(idx)}
                          className={`text-[10px] font-bold py-1.5 px-2 rounded-lg border transition-all text-center truncate ${
                            selectedSucursalIdx === idx
                              ? 'border-accent bg-accent/20 text-accent shadow-sm'
                              : 'border-border bg-surface/80 text-text-muted hover:text-text-primary hover:border-text-muted'
                          }`}
                        >
                          {suc.nombre.replace('Estación ', '')}
                        </button>
                      ))}
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
                            <span className="text-[10px] text-text-muted block">TANQUE</span>
                            <span className="text-xs font-bold text-text-primary">{bomba.nivel}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Terminal Footer */}
                  <div className="px-4 py-2.5 bg-surface border-t border-border flex items-center justify-between">
                    <span className="text-[10px] text-text-muted font-mono">TELEMETRÍA EN TIEMPO REAL</span>
                    <span className="text-[10px] text-accent font-mono font-semibold">SUPABASE CONNECTED</span>
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
              { value: '120,000', label: 'Litros/día despachados', icon: Droplets },
              { value: '12', label: 'Estaciones operativas', icon: MapPin },
              { value: '28', label: 'Años de experiencia', icon: Timer },
              { value: '360+', label: 'Clientes corporativos', icon: Users },
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
              — 01 / SERVICIOS
            </span>
            <h2 className="heading-figma text-4xl md:text-5xl mt-4 text-text-primary">
              LO QUE OFRECEMOS
            </h2>
          </div>

          {/* Service Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Card 1: Gasolina */}
            <div className="bg-surface border border-border rounded-xl p-8 card-hover group" id="service-gasolina">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <Fuel className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold tracking-figma mb-3">GASOLINA 91 Y 95</h3>
              <p className="text-text-secondary leading-relaxed">
                Combustible certificado con control de calidad permanente.
                Disponibilidad 24/7 en todos los surtidores.
              </p>
            </div>

            {/* Card 2: Diesel */}
            <div className="bg-surface border border-border rounded-xl p-8 card-hover group" id="service-diesel">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <Droplets className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold tracking-figma mb-3">DIESEL B5 Y B20</h3>
              <p className="text-text-secondary leading-relaxed">
                Para flotas y transporte pesado. Mezcla biodiésel disponible.
                Facturación electrónica integrada.
              </p>
            </div>

            {/* Card 3: GNV */}
            <div className="bg-surface border border-border rounded-xl p-8 card-hover group" id="service-gnv">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <Wind className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold tracking-figma mb-3">GNV COMPRIMIDO</h3>
              <p className="text-text-secondary leading-relaxed">
                Gas natural vehicular de alta pureza. Estaciones equipadas
                con compresores de última generación.
              </p>
            </div>

            {/* Card 4: Gestión de Flotas */}
            <div className="bg-surface border border-border rounded-xl p-8 card-hover group" id="service-flotas">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <BarChart3 className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold tracking-figma mb-3">GESTIÓN DE FLOTAS</h3>
              <p className="text-text-secondary leading-relaxed">
                Sistema de control de consumo por vehículo. Reportes
                personalizados y crédito empresarial.
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
              — 02 / NOSOTROS
            </span>
          </div>

          <div className="max-w-4xl">
            <h2 className="heading-figma text-4xl md:text-6xl text-text-primary mb-2">
              28 AÑOS
            </h2>
            <h2 className="heading-figma text-4xl md:text-6xl text-accent mb-10">
              EN MOVIMIENTO
            </h2>

            <p className="text-text-secondary text-lg leading-relaxed mb-6">
              Dally Srl nació en 1996 como un surtidor familiar en el sur del país.
              Hoy operamos 12 estaciones de servicio con tecnología de telemetría
              en tiempo real, atendiendo a más de 340 clientes corporativos y
              miles de conductores particulares.
            </p>
            <p className="text-text-secondary text-lg leading-relaxed mb-12">
              Nuestro compromiso es ofrecer combustible de calidad certificada,
              precios transparentes y un sistema de gestión que garantiza
              trazabilidad completa en cada transacción.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-8">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-accent" />
                <span className="text-sm tracking-figma text-text-secondary">
                  Certificación ISO 9001
                </span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-success" />
                <span className="text-sm tracking-figma text-text-secondary">
                  Calidad garantizada
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-info" />
                <span className="text-sm tracking-figma text-text-secondary">
                  Operación 24/7
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
                  Av. Petrolera 1450, Parque Industrial Sur, Santa Cruz de la Sierra
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
                  +591 3 344-7800 / +591 70-123-456
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

          {/* Contact Form */}
          <form
            id="contact-form"
            className="max-w-4xl"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-xs tracking-figma-wide text-text-muted block mb-2">
                  NOMBRE
                </label>
                <input
                  type="text"
                  id="contact-nombre"
                  placeholder="Juan Pérez"
                  className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs tracking-figma-wide text-text-muted block mb-2">
                  EMPRESA
                </label>
                <input
                  type="text"
                  id="contact-empresa"
                  placeholder="Transportes S.A."
                  className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="text-xs tracking-figma-wide text-text-muted block mb-2">
                CORREO ELECTRÓNICO
              </label>
              <input
                type="email"
                id="contact-email"
                placeholder="correo@empresa.com"
                className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none transition-colors"
              />
            </div>

            <div className="mb-8">
              <label className="text-xs tracking-figma-wide text-text-muted block mb-2">
                MENSAJE
              </label>
              <textarea
                id="contact-mensaje"
                rows={5}
                placeholder="¿En qué podemos ayudarle?"
                className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              id="contact-submit"
              className="w-full bg-accent hover:bg-accent-hover text-background font-bold tracking-figma py-4 rounded-lg transition-all hover:shadow-lg hover:shadow-accent/20"
            >
              ENVIAR MENSAJE
            </button>
          </form>
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
