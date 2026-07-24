'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  Fuel, Bell, Settings, LogOut, RefreshCw, Loader2,
  ShoppingCart, CheckCircle, AlertTriangle, Droplets,
  CreditCard, Banknote, FileText, Users,
  X, Mail, Shield, Building2,
} from 'lucide-react';
import KPICard from '@/components/dashboard/KPICard';
import SalesChart from '@/components/dashboard/SalesChart';
import FuelMixChart from '@/components/dashboard/FuelMixChart';
import TransactionsTable from '@/components/dashboard/TransactionsTable';

type TabKey = 'ventas' | 'nueva-venta' | 'reportes' | 'operadores';

interface SurtidorInfo {
  id: string;
  numero_bomba: number;
  combustible: string;
  capacidad_maxima: number;
  nivel_actual: number;
  sucursal_id: string;
}

interface DashboardData {
  kpis: {
    ventasHoy: number;
    litrosHoy: number;
    transacciones: number;
    alertasActivas: number;
    ventasChange: string;
    litrosChange: string;
    transaccionesDiff: number;
  };
  transactions: {
    id: string;
    hora: string;
    tipo: string;
    litros: number;
    monto: number;
    operador: string;
    estado: 'OK' | 'Revisar';
    metadata_binaria: number;
  }[];
  salesChartData: { day: string; gasolina: number; diesel: number }[];
  fuelMixData: { name: string; value: number; color: string }[];
  operadores: { nombre: string; email: string; rol: string; ventas: number; estado: boolean }[];
  reportesData: { id: string; meta: number }[];
  surtidores: SurtidorInfo[];
}

// Precio por defecto según tipo de combustible (Bs.)
const PRECIOS_DEFAULT: Record<string, number> = {
  'Gasolina Especial': 3.74,
  'Diésel': 3.72,
  'GNV': 6.00,
  'Premium': 8.80,
};

const FUEL_COLORS: Record<string, string> = {
  'Gasolina Especial': '#F5C518',
  'Diésel': '#3B82F6',
  'GNV': '#22C55E',
  'Premium': '#F97316',
};

const FUEL_ICONS: Record<string, string> = {
  'Gasolina Especial': '⛽',
  'Diésel': '🛢️',
  'GNV': '💨',
  'Premium': '🔥',
};

// ID del admin del sistema (del seed.sql - usuario superadmin)
const ADMIN_USER_ID = '11111111-1111-1111-1111-111111111111';

// Datos del admin del sistema
const ADMIN_PROFILE = {
  nombre: 'Carlos Dally',
  email: 'admin@dallysrl.bo',
  rol: 'Superadmin',
  sucursal: 'Todas las sucursales',
  id: '11111111-1111-1111-1111-111111111111',
  initials: 'CD',
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('ventas');
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // 'bell' | 'profile' | null
  const [openPanel, setOpenPanel] = useState<'bell' | 'profile' | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const today = new Date().toLocaleDateString('es-BO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const tabs: { key: TabKey; label: string; icon?: React.ReactNode }[] = [
    { key: 'ventas', label: 'VERIFICACIÓN DE VENTAS' },
    { key: 'nueva-venta', label: 'NUEVA VENTA', icon: <ShoppingCart className="w-3.5 h-3.5" /> },
    { key: 'reportes', label: 'REPORTES' },
    { key: 'operadores', label: 'OPERADORES' },
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/dashboard');
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        setError(json.error || 'Error al cargar datos');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cerrar panel al hacer click fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenPanel(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const togglePanel = (panel: 'bell' | 'profile') => {
    setOpenPanel(prev => prev === panel ? null : panel);
  };

  return (
    <main className="min-h-screen bg-background">
      {/* ===== Dashboard Header ===== */}
      <header
        className="bg-surface border-b border-border sticky top-0 z-40"
        id="dashboard-header"
        ref={headerRef}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-accent/15 rounded-lg flex items-center justify-center">
                  <Fuel className="w-4 h-4 text-accent" />
                </div>
                <span className="text-sm font-bold tracking-figma text-text-primary">
                  DALLY SRL
                </span>
              </Link>
              <div className="hidden sm:block w-px h-6 bg-border" />
              <span className="hidden sm:block text-xs tracking-figma-wide text-text-muted">
                DASHBOARD OPERACIONAL
              </span>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Status */}
              <div className="hidden md:flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${error ? 'bg-danger' : 'bg-success animate-pulse'}`} />
                <span className="text-xs text-text-muted">{error ? 'Error' : 'En línea'}</span>
                <span className="text-xs text-text-muted ml-2">· {today}</span>
              </div>

              {/* Refresh */}
              <button
                onClick={fetchData}
                disabled={loading}
                className="p-2 text-text-muted hover:text-text-primary transition-colors disabled:opacity-50"
                id="dashboard-refresh"
                aria-label="Refresh data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>

              {/* ===== NOTIFICATION BELL ===== */}
              <div className="relative">
                <button
                  onClick={() => togglePanel('bell')}
                  className={`relative p-2 transition-colors rounded-lg ${
                    openPanel === 'bell'
                      ? 'text-accent bg-accent/10'
                      : 'text-text-muted hover:text-text-primary hover:bg-surface-alt'
                  }`}
                  id="dashboard-notifications"
                  aria-label="Notificaciones de ventas"
                >
                  <Bell className="w-5 h-5" />
                  {data && data.transactions.length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
                  )}
                </button>

                {/* Bell Dropdown */}
                {openPanel === 'bell' && (
                  <div
                    className="absolute right-0 top-full mt-2 w-80 bg-surface border border-border rounded-xl shadow-2xl shadow-black/50 overflow-hidden animate-fade-in z-50"
                    id="panel-notificaciones"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-accent" />
                        <span className="text-xs font-bold tracking-figma text-text-primary">VENTAS RECIENTES</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {data && (
                          <span className="text-xs bg-accent/15 text-accent px-2 py-0.5 rounded-full font-mono">
                            {data.transactions.length}
                          </span>
                        )}
                        <button
                          onClick={() => setOpenPanel(null)}
                          className="p-1 text-text-muted hover:text-text-primary transition-colors"
                          aria-label="Cerrar"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Notification list */}
                    <div className="max-h-80 overflow-y-auto">
                      {!data || data.transactions.length === 0 ? (
                        <div className="py-10 text-center">
                          <Bell className="w-8 h-8 text-text-muted mx-auto mb-2 opacity-30" />
                          <p className="text-xs text-text-muted">Sin ventas registradas hoy</p>
                        </div>
                      ) : (
                        data.transactions.slice().reverse().map((tx, i) => {
                          const color = {
                            'Gasolina Especial': '#F5C518',
                            'Diésel': '#3B82F6',
                            'GNV': '#22C55E',
                            'Premium': '#F97316',
                          }[tx.tipo] || '#8B5CF6';
                          const icon = {
                            'Gasolina Especial': '⛽',
                            'Diésel': '🛢️',
                            'GNV': '💨',
                            'Premium': '🔥',
                          }[tx.tipo] || '⛽';
                          return (
                            <div
                              key={i}
                              className="flex items-center gap-3 px-4 py-3 border-b border-border/40 hover:bg-surface-hover transition-colors"
                            >
                              {/* Icon */}
                              <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
                                style={{ background: `${color}18` }}
                              >
                                {icon}
                              </div>
                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-semibold text-text-primary truncate">{tx.tipo}</span>
                                  <span className="text-xs font-bold text-accent font-mono ml-2 shrink-0">
                                    Bs. {tx.monto.toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-xs text-text-muted">{tx.litros.toFixed(1)} L</span>
                                  <span className="text-text-muted">·</span>
                                  <span className="text-xs text-text-muted">{tx.hora}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Footer */}
                    {data && data.transactions.length > 0 && (
                      <div className="px-4 py-2 border-t border-border bg-surface-alt">
                        <p className="text-xs text-text-muted text-center">
                          Total hoy: <span className="text-accent font-bold">
                            Bs. {data.transactions.reduce((s, t) => s + t.monto, 0).toFixed(2)}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ===== PROFILE / SETTINGS ===== */}
              <div className="relative">
                <button
                  onClick={() => togglePanel('profile')}
                  className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                    openPanel === 'profile'
                      ? 'text-accent bg-accent/10'
                      : 'text-text-muted hover:text-text-primary hover:bg-surface-alt'
                  }`}
                  id="dashboard-settings"
                  aria-label="Mi cuenta"
                >
                  <Settings className="w-5 h-5" />
                </button>

                {/* Profile Dropdown */}
                {openPanel === 'profile' && (
                  <div
                    className="absolute right-0 top-full mt-2 w-72 bg-surface border border-border rounded-xl shadow-2xl shadow-black/50 overflow-hidden animate-fade-in z-50"
                    id="panel-perfil"
                  >
                    {/* Avatar Header */}
                    <div className="px-5 py-5 border-b border-border bg-gradient-to-br from-surface to-surface-alt">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center shrink-0">
                          <span className="text-accent font-black text-sm tracking-widest">
                            {ADMIN_PROFILE.initials}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text-primary">{ADMIN_PROFILE.nombre}</p>
                          <span className="inline-block text-xs tracking-figma bg-accent/10 text-accent px-2 py-0.5 rounded-full mt-0.5">
                            {ADMIN_PROFILE.rol}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Profile fields — read only */}
                    <div className="px-5 py-4 space-y-3">
                      <p className="text-xs tracking-figma-wide text-text-muted mb-2">DATOS DE CUENTA</p>

                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-text-muted shrink-0" />
                        <div>
                          <p className="text-xs text-text-muted">Correo</p>
                          <p className="text-sm text-text-primary font-mono">{ADMIN_PROFILE.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Shield className="w-4 h-4 text-text-muted shrink-0" />
                        <div>
                          <p className="text-xs text-text-muted">Rol</p>
                          <p className="text-sm text-text-primary">{ADMIN_PROFILE.rol}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Building2 className="w-4 h-4 text-text-muted shrink-0" />
                        <div>
                          <p className="text-xs text-text-muted">Acceso</p>
                          <p className="text-sm text-text-primary">{ADMIN_PROFILE.sucursal}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 shrink-0 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-success" />
                        </div>
                        <div>
                          <p className="text-xs text-text-muted">Estado</p>
                          <p className="text-sm text-success font-semibold">Activo</p>
                        </div>
                      </div>

                      <div className="pt-1 border-t border-border">
                        <p className="text-xs text-text-muted font-mono break-all select-all">
                          ID: {ADMIN_PROFILE.id}
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="px-5 pb-4">
                      <p className="text-xs text-text-muted text-center italic">Solo lectura — contacta al sistema para cambios</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Logout */}
              <Link
                href="/login"
                className="flex items-center gap-2 text-xs tracking-figma border border-border rounded-lg px-4 py-2 text-text-secondary hover:text-text-primary hover:border-text-muted transition-colors"
                id="dashboard-logout"
              >
                <LogOut className="w-4 h-4" />
                Salir
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ===== Tabs ===== */}
      <div className="bg-surface/50 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex gap-0 overflow-x-auto" id="dashboard-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 text-xs tracking-figma-wide py-4 px-6 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? tab.key === 'nueva-venta'
                      ? 'border-accent text-accent bg-accent/5'
                      : 'border-accent text-accent'
                    : tab.key === 'nueva-venta'
                    ? 'border-transparent text-accent/60 hover:text-accent/80 hover:bg-accent/5'
                    : 'border-transparent text-text-muted hover:text-text-secondary'
                }`}
                id={`tab-${tab.key}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Dashboard Content ===== */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && !data && (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto mb-4" />
              <p className="text-sm text-text-muted tracking-figma">CARGANDO DATOS DE SUPABASE...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !data && (
          <div className="flex items-center justify-center py-32">
            <div className="text-center max-w-md">
              <div className="w-12 h-12 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-danger text-xl">!</span>
              </div>
              <p className="text-sm text-danger mb-2 font-semibold">Error al cargar datos</p>
              <p className="text-xs text-text-muted mb-4">{error}</p>
              <button
                onClick={fetchData}
                className="bg-accent hover:bg-accent-hover text-background text-xs tracking-figma px-6 py-2 rounded-lg transition-colors"
              >
                REINTENTAR
              </button>
            </div>
          </div>
        )}

        {/* Data loaded */}
        {data && (
          <>
            {activeTab === 'ventas' && (
              <div className="animate-fade-in">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <KPICard
                    label="VENTAS HOY"
                    value={`Bs. ${data.kpis.ventasHoy.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`}
                    change={`${Number(data.kpis.ventasChange) >= 0 ? '+' : ''}${data.kpis.ventasChange}%`}
                    changeType={Number(data.kpis.ventasChange) >= 0 ? 'positive' : 'negative'}
                    icon="money"
                  />
                  <KPICard
                    label="LITROS DESPACHADOS"
                    value={`${data.kpis.litrosHoy.toLocaleString('es-BO', { minimumFractionDigits: 1 })} L`}
                    change={`${Number(data.kpis.litrosChange) >= 0 ? '+' : ''}${data.kpis.litrosChange}%`}
                    changeType={Number(data.kpis.litrosChange) >= 0 ? 'positive' : 'negative'}
                    icon="fuel"
                  />
                  <KPICard
                    label="TRANSACCIONES"
                    value={data.kpis.transacciones.toString()}
                    change={`${data.kpis.transaccionesDiff >= 0 ? '+' : ''}${data.kpis.transaccionesDiff} vs ayer`}
                    changeType={data.kpis.transaccionesDiff >= 0 ? 'positive' : 'negative'}
                    icon="chart"
                  />
                  <KPICard
                    label="ALERTAS ACTIVAS"
                    value={data.kpis.alertasActivas.toString()}
                    change={data.kpis.alertasActivas > 0 ? 'Requiere atención' : 'Sin alertas'}
                    changeType={data.kpis.alertasActivas > 0 ? 'negative' : 'positive'}
                    icon="alert"
                  />
                </div>

                {/* Charts Row */}
                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                  <div className="lg:col-span-2">
                    <SalesChart data={data.salesChartData} />
                  </div>
                  <div>
                    <FuelMixChart data={data.fuelMixData} />
                  </div>
                </div>

                {/* Transactions Table */}
                <TransactionsTable data={data.transactions} />
              </div>
            )}

            {activeTab === 'nueva-venta' && (
              <div className="animate-fade-in">
                <NuevaVentaTab
                  surtidores={data.surtidores}
                  onVentaRegistrada={fetchData}
                />
              </div>
            )}

            {activeTab === 'reportes' && (
              <div className="animate-fade-in">
                <ReportesTab data={data.reportesData} />
              </div>
            )}

            {activeTab === 'operadores' && (
              <div className="animate-fade-in">
                <OperadoresTab operadores={data.operadores} />
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

// ===== Nueva Venta Tab =====

interface NuevaVentaTabProps {
  surtidores: SurtidorInfo[];
  onVentaRegistrada: () => void;
}

function NuevaVentaTab({ surtidores, onVentaRegistrada }: NuevaVentaTabProps) {
  const [selectedSurtidor, setSelectedSurtidor] = useState<SurtidorInfo | null>(null);
  const [litros, setLitros] = useState<string>('');
  const [precioPorLitro, setPrecioPorLitro] = useState<string>('');
  const [facturada, setFacturada] = useState(false);
  const [pagoDigital, setPagoDigital] = useState(false);
  const [subsidioAplicado, setSubsidioAplicado] = useState(false);
  const [clienteFlota, setClienteFlota] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const totalCalculado = parseFloat(litros || '0') * parseFloat(precioPorLitro || '0');
  const litrosNum = parseFloat(litros || '0');
  const nivelDisponible = selectedSurtidor?.nivel_actual ?? 0;
  const litrosInsuficientes = litrosNum > nivelDisponible && litrosNum > 0;

  const handleSelectSurtidor = (s: SurtidorInfo) => {
    setSelectedSurtidor(s);
    const precio = PRECIOS_DEFAULT[s.combustible] ?? 5.0;
    setPrecioPorLitro(precio.toFixed(2));
    setLitros('');
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSurtidor) return;
    if (litrosInsuficientes) {
      setErrorMsg('Los litros solicitados superan el nivel actual del surtidor.');
      return;
    }

    setSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          combustible: selectedSurtidor.combustible,
          litros: litrosNum,
          precio_por_litro: parseFloat(precioPorLitro),
          surtidor_id: selectedSurtidor.id,
          usuario_id: ADMIN_USER_ID,
          facturada,
          pagoDigital,
          subsidioAplicado,
          clienteFlota,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSuccessMsg(
          `✓ Venta registrada — ${litrosNum.toFixed(2)} L de ${selectedSurtidor.combustible} · Bs. ${totalCalculado.toFixed(2)}`
        );
        setLitros('');
        setFacturada(false);
        setPagoDigital(false);
        setSubsidioAplicado(false);
        setClienteFlota(false);
        setSelectedSurtidor(null);
        // Refrescar datos del dashboard
        onVentaRegistrada();
      } else {
        setErrorMsg(json.error || 'Error al registrar la venta');
      }
    } catch {
      setErrorMsg('Error de conexión al registrar la venta');
    } finally {
      setSubmitting(false);
    }
  };

  const levelPercent = selectedSurtidor
    ? Math.min(100, (selectedSurtidor.nivel_actual / selectedSurtidor.capacidad_maxima) * 100)
    : 0;

  const levelColor =
    levelPercent > 50 ? '#22C55E' : levelPercent > 25 ? '#F97316' : '#EF4444';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-accent/15 rounded-xl flex items-center justify-center">
          <ShoppingCart className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-figma text-text-primary">NUEVA VENTA DE COMBUSTIBLE</h2>
          <p className="text-xs text-text-muted mt-0.5">Registrar despacho como administrador del sistema</p>
        </div>
      </div>

      {/* Success / Error messages */}
      {successMsg && (
        <div className="flex items-center gap-3 bg-success/10 border border-success/30 rounded-xl px-5 py-4 animate-fade-in">
          <CheckCircle className="w-5 h-5 text-success shrink-0" />
          <p className="text-sm text-success font-medium">{successMsg}</p>
        </div>
      )}
      {errorMsg && (
        <div className="flex items-center gap-3 bg-danger/10 border border-danger/30 rounded-xl px-5 py-4 animate-fade-in">
          <AlertTriangle className="w-5 h-5 text-danger shrink-0" />
          <p className="text-sm text-danger font-medium">{errorMsg}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-8">
        {/* ===== Left: Surtidor Selection ===== */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs tracking-figma-wide text-text-muted">SELECCIONAR SURTIDOR</h3>
          <div className="grid gap-3">
            {surtidores.length === 0 ? (
              <div className="bg-surface border border-border rounded-xl p-6 text-center text-text-muted text-sm">
                No hay surtidores disponibles
              </div>
            ) : (
              surtidores.map((s) => {
                const pct = Math.min(100, (s.nivel_actual / s.capacidad_maxima) * 100);
                const isSelected = selectedSurtidor?.id === s.id;
                const color = FUEL_COLORS[s.combustible] || '#8B5CF6';
                const lvlColor = pct > 50 ? '#22C55E' : pct > 25 ? '#F97316' : '#EF4444';

                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelectSurtidor(s)}
                    id={`surtidor-btn-${s.numero_bomba}`}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                      isSelected
                        ? 'border-accent bg-accent/8 shadow-lg shadow-accent/10'
                        : 'border-border bg-surface hover:border-border-light hover:bg-surface-hover'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{FUEL_ICONS[s.combustible] || '⛽'}</span>
                        <div>
                          <p className="text-sm font-bold text-text-primary">{s.combustible}</p>
                          <p className="text-xs text-text-muted">Bomba #{s.numero_bomba}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                          <span className="text-background text-xs font-bold">✓</span>
                        </div>
                      )}
                    </div>

                    {/* Level bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-text-muted">Nivel actual</span>
                        <span className="text-xs font-semibold" style={{ color: lvlColor }}>
                          {s.nivel_actual.toLocaleString('es-BO')} / {s.capacidad_maxima.toLocaleString('es-BO')} L
                        </span>
                      </div>
                      <div className="h-1.5 bg-surface-alt rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: lvlColor }}
                        />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-text-muted">{pct.toFixed(0)}% disponible</span>
                        <span
                          className="text-xs font-mono px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${color}20`, color }}
                        >
                          Bs. {(PRECIOS_DEFAULT[s.combustible] ?? 5).toFixed(2)}/L
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ===== Right: Sale Form ===== */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selected pump summary */}
            {selectedSurtidor ? (
              <div
                className="rounded-xl p-5 border"
                style={{
                  borderColor: `${FUEL_COLORS[selectedSurtidor.combustible] || '#F5C518'}40`,
                  background: `${FUEL_COLORS[selectedSurtidor.combustible] || '#F5C518'}08`,
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Droplets className="w-4 h-4" style={{ color: FUEL_COLORS[selectedSurtidor.combustible] || '#F5C518' }} />
                  <span className="text-sm font-bold text-text-primary">
                    {selectedSurtidor.combustible} — Bomba #{selectedSurtidor.numero_bomba}
                  </span>
                </div>
                {/* Fuel level visual */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-1">
                    <div className="h-2 bg-surface-alt rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${levelPercent}%`, backgroundColor: levelColor }}
                      />
                    </div>
                    <p className="text-xs text-text-muted">
                      {selectedSurtidor.nivel_actual.toLocaleString('es-BO')} L disponibles de {selectedSurtidor.capacidad_maxima.toLocaleString('es-BO')} L
                    </p>
                  </div>
                  <span className="text-lg font-black" style={{ color: levelColor }}>
                    {levelPercent.toFixed(0)}%
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-xl p-5 border border-border bg-surface flex items-center gap-3">
                <Fuel className="w-5 h-5 text-text-muted" />
                <p className="text-sm text-text-muted">← Selecciona un surtidor para continuar</p>
              </div>
            )}

            {/* Litros & Precio */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="litros-input" className="text-xs tracking-figma-wide text-text-muted block">
                  LITROS A DESPACHAR
                </label>
                <input
                  id="litros-input"
                  type="number"
                  min="0.01"
                  max={selectedSurtidor?.nivel_actual ?? 99999}
                  step="0.01"
                  value={litros}
                  onChange={(e) => setLitros(e.target.value)}
                  placeholder="0.00"
                  required
                  disabled={!selectedSurtidor}
                  className={`w-full bg-surface border rounded-xl px-4 py-3 text-text-primary text-sm font-mono placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors disabled:opacity-40 ${
                    litrosInsuficientes ? 'border-danger focus:border-danger' : 'border-border'
                  }`}
                />
                {litrosInsuficientes && (
                  <p className="text-xs text-danger flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Supera el nivel actual del surtidor
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="precio-input" className="text-xs tracking-figma-wide text-text-muted block">
                  PRECIO POR LITRO (Bs.)
                </label>
                <input
                  id="precio-input"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={precioPorLitro}
                  onChange={(e) => setPrecioPorLitro(e.target.value)}
                  placeholder="0.00"
                  required
                  disabled={!selectedSurtidor}
                  className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text-primary text-sm font-mono placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors disabled:opacity-40"
                />
              </div>
            </div>

            {/* Total Preview */}
            <div className="bg-surface-alt border border-border rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs tracking-figma-wide text-text-muted mb-1">TOTAL CALCULADO</p>
                  <p className="text-3xl font-black text-accent font-mono">
                    Bs. {totalCalculado > 0 ? totalCalculado.toFixed(2) : '0.00'}
                  </p>
                  {litrosNum > 0 && parseFloat(precioPorLitro) > 0 && (
                    <p className="text-xs text-text-muted mt-1">
                      {litrosNum.toFixed(2)} L × Bs. {parseFloat(precioPorLitro).toFixed(2)}/L
                    </p>
                  )}
                </div>
                {selectedSurtidor && (
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                    style={{ background: `${FUEL_COLORS[selectedSurtidor.combustible] || '#F5C518'}15` }}
                  >
                    {FUEL_ICONS[selectedSurtidor.combustible] || '⛽'}
                  </div>
                )}
              </div>
            </div>

            {/* Metadata Binary Flags */}
            <div className="space-y-3">
              <h4 className="text-xs tracking-figma-wide text-text-muted">FLAGS DE METADATA BINARIA</h4>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  {
                    key: 'facturada',
                    label: 'Venta Facturada',
                    desc: 'Bit 0 (0x01)',
                    icon: <FileText className="w-4 h-4" />,
                    value: facturada,
                    onChange: setFacturada,
                    id: 'flag-facturada',
                  },
                  {
                    key: 'pagoDigital',
                    label: 'Pago Digital',
                    desc: 'Bit 1 (0x02) — Tarjeta/Digital vs Efectivo',
                    icon: <CreditCard className="w-4 h-4" />,
                    value: pagoDigital,
                    onChange: setPagoDigital,
                    id: 'flag-pago-digital',
                  },
                  {
                    key: 'subsidioAplicado',
                    label: 'Subsidio Estatal',
                    desc: 'Bit 2 (0x04)',
                    icon: <Banknote className="w-4 h-4" />,
                    value: subsidioAplicado,
                    onChange: setSubsidioAplicado,
                    id: 'flag-subsidio',
                  },
                  {
                    key: 'clienteFlota',
                    label: 'Cliente Flota',
                    desc: 'Bit 3 (0x08) — Institucional',
                    icon: <Users className="w-4 h-4" />,
                    value: clienteFlota,
                    onChange: setClienteFlota,
                    id: 'flag-flota',
                  },
                ].map((flag) => (
                  <button
                    key={flag.key}
                    type="button"
                    id={flag.id}
                    onClick={() => flag.onChange(!flag.value)}
                    className={`flex items-start gap-3 p-4 rounded-xl border transition-all duration-200 text-left ${
                      flag.value
                        ? 'border-accent/60 bg-accent/8 text-accent'
                        : 'border-border bg-surface text-text-muted hover:border-border-light hover:bg-surface-hover'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                        flag.value ? 'border-accent bg-accent' : 'border-border'
                      }`}
                    >
                      {flag.value && <span className="text-background text-xs font-bold">✓</span>}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={flag.value ? 'text-accent' : 'text-text-secondary'}>{flag.icon}</span>
                        <span className={`text-sm font-semibold ${flag.value ? 'text-accent' : 'text-text-primary'}`}>
                          {flag.label}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted font-mono">{flag.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Binary preview */}
              <div className="bg-surface border border-border rounded-lg px-4 py-3 flex items-center justify-between">
                <span className="text-xs text-text-muted tracking-figma">METADATA_BINARIA</span>
                <div className="flex items-center gap-3">
                  <code className="text-xs font-mono text-accent bg-surface-alt px-3 py-1 rounded">
                    {(
                      (facturada ? 0x01 : 0) |
                      (pagoDigital ? 0x02 : 0) |
                      (subsidioAplicado ? 0x04 : 0) |
                      (clienteFlota ? 0x08 : 0)
                    )
                      .toString(2)
                      .padStart(4, '0')}{' '}
                    ={' '}
                    {(
                      (facturada ? 0x01 : 0) |
                      (pagoDigital ? 0x02 : 0) |
                      (subsidioAplicado ? 0x04 : 0) |
                      (clienteFlota ? 0x08 : 0)
                    )}
                  </code>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="btn-registrar-venta"
              disabled={
                submitting ||
                !selectedSurtidor ||
                !litros ||
                !precioPorLitro ||
                litrosInsuficientes ||
                parseFloat(litros) <= 0
              }
              className="w-full bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-background font-bold tracking-figma text-sm py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg shadow-accent/20 hover:shadow-accent/30 disabled:shadow-none"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  REGISTRANDO VENTA...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  REGISTRAR VENTA
                  {totalCalculado > 0 && ` — Bs. ${totalCalculado.toFixed(2)}`}
                </>
              )}
            </button>

            <p className="text-xs text-center text-text-muted">
              La venta se registrará como{' '}
              <span className="text-accent font-semibold">Admin del Sistema (Carlos Dally)</span>{' '}
              y actualizará el nivel del surtidor automáticamente.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

// ===== Reportes Tab =====

function ReportesTab({ data }: { data: { id: string; meta: number }[] }) {
  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border rounded-xl p-8">
        <h3 className="text-lg font-bold tracking-figma text-text-primary mb-4">
          REPORTES Y DECODIFICACIÓN BINARIA
        </h3>
        <p className="text-text-secondary text-sm mb-6">
          Filtros avanzados utilizando aritmética binaria sobre el campo{' '}
          <code className="bg-surface-alt px-2 py-0.5 rounded text-accent font-mono text-xs">
            metadata_binaria
          </code>{' '}
          de cada venta. Datos en tiempo real desde Supabase.
        </p>

        {/* Binary Flags Legend */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { bit: '0x01', label: 'Facturada', desc: 'Bit 0' },
            { bit: '0x02', label: 'Pago Digital', desc: 'Bit 1' },
            { bit: '0x04', label: 'Subsidio Estatal', desc: 'Bit 2' },
            { bit: '0x08', label: 'Cliente Flota', desc: 'Bit 3' },
          ].map((flag, i) => (
            <div
              key={i}
              className="bg-surface-alt border border-border rounded-lg p-4"
            >
              <code className="text-accent font-mono text-sm">{flag.bit}</code>
              <div className="text-sm font-semibold text-text-primary mt-1">
                {flag.label}
              </div>
              <div className="text-xs text-text-muted">{flag.desc}</div>
            </div>
          ))}
        </div>

        {/* Decoded Transactions Table */}
        <div className="overflow-x-auto">
          {data.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs tracking-figma-wide text-text-muted py-3 pr-4">ID</th>
                  <th className="text-center text-xs tracking-figma-wide text-text-muted py-3 pr-4">BINARIO</th>
                  <th className="text-center text-xs tracking-figma-wide text-text-muted py-3 pr-4">FACTURADA</th>
                  <th className="text-center text-xs tracking-figma-wide text-text-muted py-3 pr-4">PAGO</th>
                  <th className="text-center text-xs tracking-figma-wide text-text-muted py-3 pr-4">SUBSIDIO</th>
                  <th className="text-center text-xs tracking-figma-wide text-text-muted py-3">FLOTA</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-border/50 hover:bg-surface-hover transition-colors"
                  >
                    <td className="py-3 pr-4">
                      <span className="text-sm font-semibold text-accent">{row.id}</span>
                    </td>
                    <td className="py-3 pr-4 text-center">
                      <code className="text-xs font-mono text-text-secondary bg-surface-alt px-2 py-1 rounded">
                        {row.meta.toString(2).padStart(4, '0')}
                      </code>
                    </td>
                    <td className="py-3 pr-4 text-center">
                      {(row.meta & 0x01) !== 0 ? (
                        <span className="text-success text-sm">✓</span>
                      ) : (
                        <span className="text-text-muted text-sm">✗</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-center">
                      <span className="text-xs text-text-secondary">
                        {(row.meta & 0x02) !== 0 ? 'Digital' : 'Efectivo'}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-center">
                      {(row.meta & 0x04) !== 0 ? (
                        <span className="text-success text-sm">✓</span>
                      ) : (
                        <span className="text-text-muted text-sm">✗</span>
                      )}
                    </td>
                    <td className="py-3 text-center">
                      {(row.meta & 0x08) !== 0 ? (
                        <span className="text-success text-sm">✓</span>
                      ) : (
                        <span className="text-text-muted text-sm">✗</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-text-muted text-sm">
              No hay ventas registradas hoy para decodificar
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== Operadores Tab =====

function OperadoresTab({ operadores }: { operadores: { nombre: string; email: string; rol: string; ventas: number; estado: boolean }[] }) {
  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border rounded-xl p-8">
        <h3 className="text-lg font-bold tracking-figma text-text-primary mb-6">
          OPERADORES ACTIVOS
        </h3>
        <div className="overflow-x-auto">
          {operadores.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs tracking-figma-wide text-text-muted py-3 pr-4">NOMBRE</th>
                  <th className="text-left text-xs tracking-figma-wide text-text-muted py-3 pr-4">CORREO</th>
                  <th className="text-left text-xs tracking-figma-wide text-text-muted py-3 pr-4">ROL</th>
                  <th className="text-center text-xs tracking-figma-wide text-text-muted py-3 pr-4">VENTAS HOY</th>
                  <th className="text-center text-xs tracking-figma-wide text-text-muted py-3">ESTADO</th>
                </tr>
              </thead>
              <tbody>
                {operadores.map((op, i) => (
                  <tr
                    key={i}
                    className="border-b border-border/50 hover:bg-surface-hover transition-colors"
                  >
                    <td className="py-4 pr-4">
                      <span className="text-sm font-semibold text-text-primary">{op.nombre}</span>
                    </td>
                    <td className="py-4 pr-4">
                      <span className="text-sm text-text-secondary font-mono">{op.email}</span>
                    </td>
                    <td className="py-4 pr-4">
                      <span className="text-xs tracking-figma bg-accent/10 text-accent px-3 py-1 rounded-full">
                        {op.rol}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-center">
                      <span className="text-sm font-bold text-text-primary">{op.ventas}</span>
                    </td>
                    <td className="py-4 text-center">
                      <span className="inline-flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${op.estado ? 'bg-success' : 'bg-danger'}`} />
                        <span className={`text-xs ${op.estado ? 'text-success' : 'text-danger'}`}>
                          {op.estado ? 'Activo' : 'Inactivo'}
                        </span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-text-muted text-sm">
              No hay operadores registrados
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
