import { useState, useEffect } from 'react';
import api from '../../api/client';
import {
  Users, Plus, ToggleLeft, ToggleRight, Trash2, UserPlus,
  AlertCircle, X, ChevronDown
} from 'lucide-react';

function TableSkeleton() {
  return (
    <div className="table-container">
      <div className="p-4 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-10 skeleton flex-1" />
            <div className="h-10 skeleton w-16" />
            <div className="h-10 skeleton w-24" />
            <div className="h-10 skeleton w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function UsuariosAdminPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [socios, setSocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ email: '', rol: 'Socio', socioId: '' });
  const [error, setError] = useState(null);

  const loadData = () => {
    setLoading(true);
    Promise.all([api.get('/usuarios'), api.get('/socios')])
      .then(([uRes, sRes]) => {
        setUsuarios(uRes.data);
        setSocios(sRes.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(loadData, []);

  const toggleActivo = async (id) => {
    await api.patch(`/usuarios/${id}/toggle-activo`);
    loadData();
  };

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar este usuario?')) return;
    await api.delete(`/usuarios/${id}`);
    loadData();
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/usuarios', {
        email: form.email,
        rol: form.rol,
        socioId: form.socioId || null,
      });
      setShowForm(false);
      setForm({ email: '', rol: 'Socio', socioId: '' });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear usuario');
    }
  };

  return (
    <div>
      {/* ── Header ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="section-title flex items-center gap-2.5">
            <Users size={26} className="text-casatic-600" />
            Gestión de Usuarios
          </h1>
          <p className="section-subtitle text-sm">{usuarios.length} usuarios registrados</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'Cancelar' : 'Nuevo Usuario'}
        </button>
      </div>

      {/* ── Create Form ───────────────────────────────── */}
      {showForm && (
        <div className="card-base p-6 mb-6 animate-fade-in-down">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 bg-casatic-50 rounded-xl flex items-center justify-center">
              <UserPlus size={20} className="text-casatic-600" />
            </div>
            <div>
              <h3 className="font-semibold text-surface-900">Crear Usuario</h3>
              <p className="text-xs text-surface-500">
                Contraseña por defecto: <code className="bg-surface-100 px-1.5 py-0.5 rounded text-[10px] font-mono">Socio123!</code>
              </p>
            </div>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="input-label">Email</label>
                <input
                  type="email" required placeholder="usuario@empresa.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="input-label">Rol</label>
                <div className="relative">
                  <select
                    value={form.rol}
                    onChange={(e) => setForm({ ...form, rol: e.target.value })}
                    className="input-field appearance-none pr-10"
                  >
                    <option value="Socio">Socio</option>
                    <option value="Admin">Admin</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="input-label">Empresa asociada</label>
                <div className="relative">
                  <select
                    value={form.socioId}
                    onChange={(e) => setForm({ ...form, socioId: e.target.value })}
                    className="input-field appearance-none pr-10"
                  >
                    <option value="">Sin socio asociado</option>
                    {socios.map((s) => (
                      <option key={s.id} value={s.id}>{s.nombreEmpresa}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {error && (
              <div className="alert-error">
                <AlertCircle size={16} className="flex-shrink-0" />
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500">
              <UserPlus size={16} /> Crear Usuario
            </button>
          </form>
        </div>
      )}

      {/* ── Table ─────────────────────────────────────── */}
      {loading ? (
        <TableSkeleton />
      ) : (
        <div className="table-container overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-50/80 border-b border-surface-200">
              <tr>
                <th className="table-th">Email</th>
                <th className="table-th">Rol</th>
                <th className="table-th">Empresa</th>
                <th className="table-th text-center">Password</th>
                <th className="table-th text-center">Activo</th>
                <th className="table-th text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} className="table-row">
                  <td className="table-td">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-casatic-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-casatic-600">
                          {u.email?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-surface-900 font-medium">{u.email}</span>
                    </div>
                  </td>
                  <td className="table-td">
                    {u.rol === 'Admin' ? (
                      <span className="badge bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200">Admin</span>
                    ) : (
                      <span className="badge-primary">Socio</span>
                    )}
                  </td>
                  <td className="table-td text-surface-500">{u.nombreEmpresa || <span className="text-surface-300">-</span>}</td>
                  <td className="table-td text-center">
                    {u.primerLogin ? (
                      <span className="badge-warning">Pendiente</span>
                    ) : (
                      <span className="badge-success">Cambiada</span>
                    )}
                  </td>
                  <td className="table-td text-center">
                    <button
                      onClick={() => toggleActivo(u.id)}
                      title="Toggle activo"
                      className="transition-transform hover:scale-110"
                    >
                      {u.activo ? (
                        <ToggleRight size={28} className="text-emerald-500 mx-auto" />
                      ) : (
                        <ToggleLeft size={28} className="text-surface-300 mx-auto" />
                      )}
                    </button>
                  </td>
                  <td className="table-td text-center">
                    <button
                      onClick={() => eliminar(u.id)}
                      className="btn-icon text-red-500 hover:bg-red-50"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
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
