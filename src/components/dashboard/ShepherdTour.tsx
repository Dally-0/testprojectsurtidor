'use client';

import { useEffect, useState } from 'react';
import Shepherd from 'shepherd.js';
import { Tour } from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';
import { HelpCircle } from 'lucide-react';

const TOUR_SEEN_KEY = 'dally_dashboard_tour_seen';

export default function ShepherdTour() {
  const [tourInstance, setTourInstance] = useState<Tour | null>(null);

  useEffect(() => {
    // Inject custom styles for the Shepherd tour to match Dally's dark theme
    const styleId = 'shepherd-dally-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        /* ===== Shepherd.js – Dally SRL Custom Theme ===== */
        .shepherd-element {
          z-index: 99999 !important;
          max-width: 380px;
          filter: drop-shadow(0 20px 40px rgba(0,0,0,0.5));
        }

        .shepherd-content {
          background: #1A1D23 !important;
          border: 1px solid rgba(245,197,24,0.25) !important;
          border-radius: 16px !important;
          overflow: hidden;
        }

        .shepherd-header {
          background: linear-gradient(135deg, rgba(245,197,24,0.12) 0%, rgba(245,197,24,0.04) 100%) !important;
          border-bottom: 1px solid rgba(245,197,24,0.15) !important;
          padding: 16px 20px 12px !important;
        }

        .shepherd-title {
          color: #F5C518 !important;
          font-weight: 700 !important;
          font-size: 14px !important;
          letter-spacing: 0.06em !important;
          text-transform: uppercase !important;
          font-family: inherit !important;
        }

        .shepherd-cancel-icon {
          color: rgba(255,255,255,0.4) !important;
          font-size: 22px !important;
          transition: color 0.2s !important;
        }
        .shepherd-cancel-icon:hover {
          color: #F5C518 !important;
        }

        .shepherd-text {
          color: rgba(255,255,255,0.8) !important;
          padding: 16px 20px !important;
          font-size: 13.5px !important;
          line-height: 1.65 !important;
          font-family: inherit !important;
        }
        .shepherd-text p {
          margin: 0 !important;
        }

        .shepherd-footer {
          background: transparent !important;
          border-top: 1px solid rgba(255,255,255,0.06) !important;
          padding: 12px 20px 16px !important;
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }

        .shepherd-button {
          border-radius: 8px !important;
          font-size: 11px !important;
          font-weight: 700 !important;
          letter-spacing: 0.08em !important;
          text-transform: uppercase !important;
          padding: 8px 18px !important;
          transition: all 0.2s ease !important;
          cursor: pointer !important;
          font-family: inherit !important;
          border: none !important;
        }

        .shepherd-button-primary {
          background: #F5C518 !important;
          color: #0D0F13 !important;
        }
        .shepherd-button-primary:hover {
          background: #E0B400 !important;
          box-shadow: 0 4px 16px rgba(245,197,24,0.3) !important;
        }

        .shepherd-button-secondary {
          background: rgba(255,255,255,0.06) !important;
          color: rgba(255,255,255,0.6) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
        }
        .shepherd-button-secondary:hover {
          background: rgba(255,255,255,0.1) !important;
          color: rgba(255,255,255,0.85) !important;
        }

        .shepherd-arrow::before {
          background: #1A1D23 !important;
          border: 1px solid rgba(245,197,24,0.25) !important;
        }

        .shepherd-modal-overlay-container {
          z-index: 99998 !important;
        }

        .shepherd-target-highlight {
          box-shadow: 0 0 0 4px rgba(245,197,24,0.25), 0 0 24px rgba(245,197,24,0.15) !important;
          border-radius: 10px;
        }

        /* Step counter badge */
        .shepherd-step-counter {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(245,197,24,0.15);
          color: #F5C518;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          padding: 3px 10px;
          border-radius: 100px;
          margin-bottom: 8px;
        }
      `;
      document.head.appendChild(style);
    }

    const tour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        cancelIcon: { enabled: true },
        scrollTo: { behavior: 'smooth', block: 'center' },
        modalOverlayOpeningPadding: 8,
        modalOverlayOpeningRadius: 12,
      },
    });

    // — Step 1: Nueva Venta —
    tour.addStep({
      id: 'step-nueva-venta',
      title: '⛽ Nueva Venta',
      text: `
        <div class="shepherd-step-counter">PASO 1 DE 3</div>
        <p>Aquí puede <strong>registrar una nueva venta</strong> de combustible. Seleccione la sucursal, el surtidor, ingrese los litros y el sistema calculará el total automáticamente.</p>
      `,
      attachTo: { element: '#tab-nueva-venta', on: 'bottom' },
      buttons: [
        {
          text: 'Omitir tour',
          action: tour.cancel,
          classes: 'shepherd-button-secondary',
        },
        {
          text: 'Siguiente →',
          action: tour.next,
          classes: 'shepherd-button-primary',
        },
      ],
    });

    // — Step 2: Dashboard / Verificación de Ventas —
    tour.addStep({
      id: 'step-dashboard',
      title: '📊 Dashboard',
      text: `
        <div class="shepherd-step-counter">PASO 2 DE 3</div>
        <p>En esta pestaña encontrará el <strong>panel principal</strong> con KPIs en tiempo real, gráficos de ventas diarias, distribución de combustibles y la tabla de transacciones recientes.</p>
      `,
      attachTo: { element: '#tab-ventas', on: 'bottom' },
      buttons: [
        {
          text: '← Anterior',
          action: tour.back,
          classes: 'shepherd-button-secondary',
        },
        {
          text: 'Siguiente →',
          action: tour.next,
          classes: 'shepherd-button-primary',
        },
      ],
    });

    // — Step 3: Notificaciones —
    tour.addStep({
      id: 'step-notificaciones',
      title: '🔔 Notificaciones',
      text: `
        <div class="shepherd-step-counter">PASO 3 DE 3</div>
        <p>La campana de <strong>notificaciones</strong> le muestra las últimas ventas registradas en el sistema. El indicador se ilumina cuando hay actividad reciente.</p>
      `,
      attachTo: { element: '#dashboard-notifications', on: 'bottom' },
      buttons: [
        {
          text: '← Anterior',
          action: tour.back,
          classes: 'shepherd-button-secondary',
        },
        {
          text: '¡Entendido! ✓',
          action: tour.complete,
          classes: 'shepherd-button-primary',
        },
      ],
    });

    tour.on('complete', () => {
      localStorage.setItem(TOUR_SEEN_KEY, 'true');
    });
    tour.on('cancel', () => {
      localStorage.setItem(TOUR_SEEN_KEY, 'true');
    });

    setTourInstance(tour);

    // Auto-start tour on first visit after a brief delay to let the DOM mount
    const alreadySeen = localStorage.getItem(TOUR_SEEN_KEY);
    if (!alreadySeen) {
      const timer = setTimeout(() => {
        tour.start();
      }, 1200);
      return () => clearTimeout(timer);
    }

    return () => {
      tour.cancel();
    };
  }, []);

  const handleStartTour = () => {
    if (tourInstance) {
      tourInstance.start();
    }
  };

  return (
    <button
      onClick={handleStartTour}
      id="btn-start-tour"
      title="Iniciar tour guiado del Dashboard"
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tracking-wider uppercase rounded-lg
                 bg-accent/10 border border-accent/30 text-accent
                 hover:bg-accent/20 hover:border-accent/50
                 transition-all duration-200 cursor-pointer"
    >
      <HelpCircle className="w-3.5 h-3.5" />
      Tour
    </button>
  );
}
