import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import {
  Eye, Search, FileText, Users, Building2, AlertTriangle,
  TrendingUp, BarChart3, Activity, RefreshCw
} from 'lucide-react';

function StatSkeleton() {
  return (
    <div className="card-base p-5 flex items-center gap-4">
      <div className="w-12 h-12 skeleton rounded-xl" />
      <div className="space-y-2 flex-1">
        <div className="h-6 skeleton w-16" />
        <div className="h-3 skeleton w-24" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboard = () => {
    setLoading(true);
    setError(null);
    api.obtenerDashboard()
      .then((res) => setData(res))
      .catch((err) => setError(err.message || 'No se pudieron obtener las métricas.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadDashboard(); }, []);

  if (loading) return (
    <div>
      <div className="mb-8">
        <div className="h-8 skeleton w-48 mb-2" />
        <div className="h-4 skeleton w-64" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 7 }).map((_, i) => <StatSkeleton key={i} />)}
      </div>
    </div>
  );

  if (!data) return (
    <div className="text-center py-20">
      <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <AlertTriangle size={28} className="text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-surface-700 mb-2">Error al cargar</h3>
      <p className="text-surface-500 text-sm mb-4">{error || 'No se pudieron obtener las métricas del dashboard.'}</p>
      <button
        onClick={loadDashboard}
        className="inline-flex items-center gap-2 px-4 py-2 bg-casatic-600 text-white rounded-xl text-sm hover:bg-casatic-700 transition-colors"
      >
        <RefreshCw size={14} /> Reintentar
      </button>
    </div>
  );

  const cards = [
    { label: 'Visitas Semana', value: data.visitasSemana ?? 0, icon: Eye, gradient: 'from-blue-500 to-blue-600' },
    { label: 'Visitas Mes', value: data.visitasMes ?? 0, icon: TrendingUp, gradient: 'from-indigo-500 to-indigo-600' },
    { label: 'Búsquedas Mes', value: data.busquedasMes ?? 0, icon: Search, gradient: 'from-violet-500 to-violet-600' },
    { label: 'Formularios Mes', value: data.formulariosMes ?? 0, icon: FileText, gradient: 'from-emerald-500 to-emerald-600' },
    { label: 'Total Socios', value: data.totalSocios ?? 0, icon: Building2, gradient: 'from-cyan-500 to-cyan-600' },
    { label: 'Socios Activos', value: data.sociosActivos ?? 0, icon: Users, gradient: 'from-teal-500 to-teal-600' },
    { label: 'Socios en Mora', value: data.sociosEnMora ?? 0, icon: AlertTriangle, gradient: 'from-red-500 to-red-600' },
  ];

  const visitasDiarias = data.visitasDiarias ?? [];
  const loginsPorUsuario = data.loginsPorUsuario ?? {};
  const maxVisit = Math.max(...visitasDiarias.map((v) => v.cantidad ?? v.Cantidad ?? 0), 1);

  return (
    <div>
      {/* ── Header ────────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="section-title flex items-center gap-2.5">
          <BarChart3 size={26} className="text-casatic-600" />
          Dashboard
        </h1>
        <p className="section-subtitle text-sm">Métricas generales del directorio CASATIC</p>
      </div>

      {/* ── Stat Cards ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
        {cards.map((card) => (
          <div key={card.label} className="card-base p-5 flex items-center gap-4 group hover:shadow-card-hover">
            <div className={`stat-icon bg-gradient-to-br ${card.gradient} text-white shadow-lg`}>
              <card.icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900 tracking-tight">{card.value}</p>
              <p className="text-xs font-medium text-surface-500">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts Row ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* Visitas Chart */}
        <div className="lg:col-span-2 card-base p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-surface-900">Visitas Diarias</h2>
              <p className="text-xs text-surface-500 mt-0.5">Últimos 30 días</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-surface-400">
              <Activity size={14} className="text-casatic-500" />
              <span>Tendencia</span>
            </div>
          </div>
          {visitasDiarias.length > 0 ? (
            <div className="flex items-end gap-[3px] h-44 overflow-x-auto pb-6">
              {visitasDiarias.map((d, i) => {
                const cantidad = d.cantidad ?? d.Cantidad ?? 0;
                const fecha = d.fecha ?? d.Fecha ?? '';
                const height = (cantidad / maxVisit) * 100;
                return (
                  <div key={fecha} className="flex flex-col items-center flex-shrink-0 group/bar" style={{ width: '22px' }}>
                    <span className="text-[9px] text-surface-400 mb-1 opacity-0 group-hover/bar:opacity-100 transition-opacity">
                      {cantidad}
                    </span>
                    <div
                      className="bg-gradient-to-t from-casatic-600 to-casatic-400 rounded-t-sm w-full transition-all duration-300 hover:from-casatic-500 hover:to-casatic-300 cursor-pointer"
                      style={{ height: `${Math.max(height, 3)}%` }}
                      title={`${fecha}: ${cantidad} visitas`}
                    />
                    <span className={`text-[8px] text-surface-400 mt-1.5 ${i % 3 === 0 ? 'block' : 'hidden'}`}>
                      {fecha.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-44 flex items-center justify-center text-surface-400 text-sm">
              Sin datos de visitas
            </div>
          )}
        </div>

        {/* Logins */}
        <div className="card-base p-6">
          <h2 className="font-semibold text-surface-900 mb-1">Actividad de Usuarios</h2>
          <p className="text-xs text-surface-500 mb-4">Logins del último mes</p>
          {Object.keys(loginsPorUsuario).length > 0 ? (
            <div className="space-y-2.5 max-h-52 overflow-y-auto">
              {Object.entries(loginsPorUsuario).map(([email, count]) => (
                <div key={email} className="flex items-center justify-between bg-surface-50 px-3.5 py-2.5 rounded-xl">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 bg-casatic-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-casatic-700">{email.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="text-xs text-surface-700 truncate">{email}</span>
                  </div>
                  <span className="badge-primary text-[10px] ml-2 flex-shrink-0">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-44 flex items-center justify-center text-surface-400 text-sm">
              Sin logins registrados
            </div>
          )}
        </div>
      </div>
    </div>
  );
}