import { useState, useEffect } from 'react';
import api from '../../api/client';
import {
  Building2, Save, Phone, MapPin, Tag, Briefcase,
  Image, Share2, AlertCircle, CheckCircle, Loader2, ExternalLink
} from 'lucide-react';

export default function MiEmpresaPage() {
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [form, setForm] = useState({
    descripcion: '',
    especialidades: '',
    servicios: '',
    redesSociales: '{}',
    telefono: '',
    direccion: '',
    logoUrl: '',
    marcasRepresenta: '',
  });

  useEffect(() => {
    api.get('/miempresa')
      .then((res) => {
        const s = res.data;
        setEmpresa(s);
        setForm({
          descripcion: s.descripcion || '',
          especialidades: (s.especialidades || []).join(', '),
          servicios: (s.servicios || []).join(', '),
          redesSociales: s.redesSociales || '{}',
          telefono: s.telefono || '',
          direccion: s.direccion || '',
          logoUrl: s.logoUrl || '',
          marcasRepresenta: s.marcasRepresenta || '',
        });
      })
      .catch(() => setError('No se pudo cargar la información de tu empresa.'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    const payload = {
      ...form,
      especialidades: form.especialidades.split(',').map((s) => s.trim()).filter(Boolean),
      servicios: form.servicios.split(',').map((s) => s.trim()).filter(Boolean),
    };

    try {
      const { data } = await api.put('/miempresa', payload);
      setEmpresa(data);
      setSuccess('Empresa actualizada correctamente.');
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar los cambios.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="h-8 skeleton w-48" />
        <div className="card-base p-8 space-y-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 skeleton w-24" />
              <div className="h-10 skeleton w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && !empresa) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={28} className="text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-surface-700 mb-2">Error</h3>
        <p className="text-surface-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* ── Title ─────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 bg-gradient-to-br from-casatic-500 to-casatic-700 rounded-xl flex items-center justify-center shadow-lg shadow-casatic-500/20">
          <Building2 size={22} className="text-white" />
        </div>
        <div>
          <h1 className="section-title">Mi Empresa</h1>
          <p className="text-sm text-surface-500">
            {empresa?.nombreEmpresa} — Actualiza la información visible en el directorio
          </p>
        </div>
      </div>

      {/* ── Alerts ────────────────────────────────────── */}
      {success && (
        <div className="alert-success mb-5 animate-fade-in-down">
          <CheckCircle size={16} className="flex-shrink-0" />
          {success}
        </div>
      )}
      {error && empresa && (
        <div className="alert-error mb-5 animate-fade-in-down">
          <AlertCircle size={16} className="flex-shrink-0" />
          {error}
        </div>
      )}

      {/* ── Form ──────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Description */}
        <div className="card-base p-6 space-y-5">
          <h3 className="font-semibold text-surface-800 flex items-center gap-2 text-sm uppercase tracking-wide">
            <Tag size={15} className="text-casatic-500" /> Información General
          </h3>
          <div>
            <label className="input-label">Descripción</label>
            <textarea
              rows={4} value={form.descripcion}
              onChange={handleChange('descripcion')}
              className="input-field resize-none"
              placeholder="Describe tu empresa y sus actividades principales"
            />
          </div>
        </div>

        {/* Services */}
        <div className="card-base p-6 space-y-5">
          <h3 className="font-semibold text-surface-800 flex items-center gap-2 text-sm uppercase tracking-wide">
            <Briefcase size={15} className="text-casatic-500" /> Especialidades y Servicios
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="input-label">
                Especialidades <span className="text-surface-400 text-xs font-normal">(separadas por coma)</span>
              </label>
              <input
                type="text" value={form.especialidades}
                onChange={handleChange('especialidades')}
                className="input-field"
                placeholder="Cloud, DevOps, IA"
              />
            </div>
            <div>
              <label className="input-label">
                Servicios <span className="text-surface-400 text-xs font-normal">(separados por coma)</span>
              </label>
              <input
                type="text" value={form.servicios}
                onChange={handleChange('servicios')}
                className="input-field"
                placeholder="Consultoría, Desarrollo"
              />
            </div>
          </div>
          <div>
            <label className="input-label flex items-center gap-1.5">
              <ExternalLink size={13} className="text-surface-400" /> Marcas que Representa
            </label>
            <input
              type="text" value={form.marcasRepresenta}
              onChange={handleChange('marcasRepresenta')}
              className="input-field"
              placeholder="Microsoft, AWS, Google Cloud"
            />
          </div>
        </div>

        {/* Contact */}
        <div className="card-base p-6 space-y-5">
          <h3 className="font-semibold text-surface-800 flex items-center gap-2 text-sm uppercase tracking-wide">
            <Phone size={15} className="text-casatic-500" /> Contacto
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="input-label flex items-center gap-1.5">
                <Phone size={13} className="text-surface-400" /> Teléfono
              </label>
              <input type="text" value={form.telefono} onChange={handleChange('telefono')}
                className="input-field" placeholder="+504 9999-9999" />
            </div>
            <div>
              <label className="input-label flex items-center gap-1.5">
                <MapPin size={13} className="text-surface-400" /> Dirección
              </label>
              <input type="text" value={form.direccion} onChange={handleChange('direccion')}
                className="input-field" placeholder="Ciudad, País" />
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="card-base p-6 space-y-5">
          <h3 className="font-semibold text-surface-800 flex items-center gap-2 text-sm uppercase tracking-wide">
            <Image size={15} className="text-casatic-500" /> Media y Redes
          </h3>
          <div>
            <label className="input-label flex items-center gap-1.5">
              <Image size={13} className="text-surface-400" /> URL Logo
            </label>
            <input type="text" value={form.logoUrl} onChange={handleChange('logoUrl')}
              className="input-field" placeholder="https://ejemplo.com/logo.png" />
          </div>
          <div>
            <label className="input-label flex items-center gap-1.5">
              <Share2 size={13} className="text-surface-400" /> Redes Sociales
              <span className="text-surface-400 text-xs font-normal">(JSON)</span>
            </label>
            <textarea
              rows={2} value={form.redesSociales}
              onChange={handleChange('redesSociales')}
              className="input-field font-mono text-sm resize-none"
              placeholder='{"facebook":"url","linkedin":"url","website":"url"}'
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit" disabled={saving}
            className="btn-primary"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}
