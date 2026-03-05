import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import {
  Building2, Plus, Edit, Trash2, ToggleLeft, ToggleRight,
  AlertTriangle, Search, Filter
} from 'lucide-react';

function TableSkeleton() {
  return (
    <div className="table-container">
      <div className="p-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-10 skeleton flex-1" />
            <div className="h-10 skeleton w-20" />
            <div className="h-10 skeleton w-24" />
            <div className="h-10 skeleton w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SociosAdminPage() {
  const [socios, setSocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadSocios = () => {
    setLoading(true);
    api.get('/socios')
      .then((res) => setSocios(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(loadSocios, []);

  const toggleHabilitado = async (id) => {
    await api.patch(`/socios/${id}/toggle-habilitado`);
    loadSocios();
  };

  const cambiarEstado = async (id, estado) => {
    await api.patch(`/socios/${id}/estado-financiero?estado=${estado}`);
    loadSocios();
  };

  const eliminar = async (id) => {
    if (!confirm('¿Está seguro de eliminar este socio?')) return;
    await api.delete(`/socios/${id}`);
    loadSocios();
  };

  const filtered = socios.filter((s) =>
    s.nombreEmpresa.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* ── Header ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="section-title flex items-center gap-2.5">
            <Building2 size={26} className="text-casatic-600" />
            Gestión de Socios
          </h1>
          <p className="section-subtitle text-sm">{socios.length} socios registrados</p>
        </div>
        <Link to="/admin/socios/nuevo" className="btn-primary">
          <Plus size={18} /> Nuevo Socio
        </Link>
      </div>

      {/* ── Search ────────────────────────────────────── */}
      <div className="card-base p-3 mb-5 flex items-center gap-3">
        <Search size={18} className="text-surface-400 ml-1" />
        <input
          type="text"
          placeholder="Buscar socio por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm text-surface-800 placeholder-surface-400 outline-none"
        />
        <div className="flex items-center gap-1.5 text-xs text-surface-400">
          <Filter size={14} />
          {filtered.length} resultados
        </div>
      </div>

      {/* ── Table ─────────────────────────────────────── */}
      {loading ? (
        <TableSkeleton />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-14 h-14 bg-surface-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Building2 size={24} className="text-surface-400" />
          </div>
          <h3 className="font-semibold text-surface-700 mb-1">Sin resultados</h3>
          <p className="text-sm text-surface-500">No se encontraron socios con ese criterio.</p>
        </div>
      ) : (
        <div className="table-container overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-50/80 border-b border-surface-200">
              <tr>
                <th className="table-th">Empresa</th>
                <th className="table-th">Slug</th>
                <th className="table-th">Estado Financiero</th>
                <th className="table-th text-center">Habilitado</th>
                <th className="table-th text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((socio) => (
                <tr key={socio.id} className="table-row">
                  <td className="table-td font-medium text-surface-900">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-casatic-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-casatic-600">
                          {socio.nombreEmpresa?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      {socio.nombreEmpresa}
                    </div>
                  </td>
                  <td className="table-td text-surface-500 font-mono text-xs">{socio.slug}</td>
                  <td className="table-td">
                    <div className="flex items-center gap-2">
                      {socio.estadoFinanciero === 'AlDia' ? (
                        <span className="badge-success">Al Día</span>
                      ) : (
                        <span className="badge-danger">
                          <AlertTriangle size={11} /> En Mora
                        </span>
                      )}
                      <button
                        onClick={() => cambiarEstado(socio.id,
                          socio.estadoFinanciero === 'AlDia' ? 'EnMora' : 'AlDia')}
                        className="text-[10px] text-casatic-600 hover:text-casatic-800 hover:underline font-medium"
                      >
                        cambiar
                      </button>
                    </div>
                  </td>
                  <td className="table-td text-center">
                    <button
                      onClick={() => toggleHabilitado(socio.id)}
                      title="Toggle habilitado"
                      className="transition-transform hover:scale-110"
                    >
                      {socio.habilitado ? (
                        <ToggleRight size={28} className="text-emerald-500 mx-auto" />
                      ) : (
                        <ToggleLeft size={28} className="text-surface-300 mx-auto" />
                      )}
                    </button>
                  </td>
                  <td className="table-td text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Link
                        to={`/admin/socios/${socio.id}`}
                        className="btn-icon text-casatic-600 hover:bg-casatic-50"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => eliminar(socio.id)}
                        className="btn-icon text-red-500 hover:bg-red-50"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
