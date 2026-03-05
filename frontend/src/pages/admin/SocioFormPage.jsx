import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/client';
import {
  Save, ArrowLeft, Building2, Globe, Phone, MapPin,
  Tag, Briefcase, Image, Share2, AlertCircle, Loader2
} from 'lucide-react';

export default function SocioFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    nombreEmpresa: '',
    slug: '',
    descripcion: '',
    especialidades: '',
    servicios: '',
    telefono: '',
    direccion: '',
    logoUrl: '',
    redesSociales: '{}',
  });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      api.get(`/socios/${id}`).then((res) => {
        const s = res.data;
        setForm({
          nombreEmpresa: s.nombreEmpresa,
          slug: s.slug,
          descripcion: s.descripcion,
          especialidades: (s.especialidades || []).join(', '),
          servicios: (s.servicios || []).join(', '),
          telefono: s.telefono || '',
          direccion: s.direccion || '',
          logoUrl: s.logoUrl || '',
          redesSociales: s.redesSociales || '{}',
        });
      }).finally(() => setLoadingData(false));
    }
  }, [id]);

  const handleChange = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const autoSlug = () => {
    const slug = form.nombreEmpresa
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setForm({ ...form, slug });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload = {
      ...form,
      especialidades: form.especialidades.split(',').map((s) => s.trim()).filter(Boolean),
      servicios: form.servicios.split(',').map((s) => s.trim()).filter(Boolean),
    };

    try {
      if (isEdit) {
        await api.put(`/socios/${id}`, payload);
      } else {
        await api.post('/socios', payload);
      }
      navigate('/admin/socios');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  if (loadingData) {
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

  return (
    <div className="max-w-3xl mx-auto">
      {/* ── Back ──────────────────────────────────────── */}
      <button
        onClick={() => navigate(-1)}
        className="btn-ghost text-sm mb-5 -ml-2"
      >
        <ArrowLeft size={16} /> Volver a socios
      </button>

      {/* ── Title ─────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 bg-gradient-to-br from-casatic-500 to-casatic-700 rounded-xl flex items-center justify-center shadow-lg shadow-casatic-500/20">
          <Building2 size={22} className="text-white" />
        </div>
        <div>
          <h1 className="section-title">{isEdit ? 'Editar Socio' : 'Nuevo Socio'}</h1>
          <p className="text-sm text-surface-500">
            {isEdit ? 'Modifique los datos del socio' : 'Complete los datos para registrar un nuevo socio'}
          </p>
        </div>
      </div>

      {/* ── Form ──────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Info */}
        <div className="card-base p-6 space-y-5">
          <h3 className="font-semibold text-surface-800 flex items-center gap-2 text-sm uppercase tracking-wide">
            <Tag size={15} className="text-casatic-500" /> Información General
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Nombre Empresa *</label>
              <input
                type="text" required value={form.nombreEmpresa}
                onChange={handleChange('nombreEmpresa')}
                onBlur={!isEdit ? autoSlug : undefined}
                className="input-field"
                placeholder="Nombre de la empresa"
              />
            </div>
            <div>
              <label className="input-label flex items-center gap-1.5">
                <Globe size={13} className="text-surface-400" /> Slug (URL)
              </label>
              <input
                type="text" value={form.slug}
                onChange={handleChange('slug')}
                className="input-field font-mono text-sm"
                placeholder="nombre-empresa"
              />
            </div>
          </div>
          <div>
            <label className="input-label">Descripción</label>
            <textarea
              rows={3} value={form.descripcion}
              onChange={handleChange('descripcion')}
              className="input-field resize-none"
              placeholder="Descripción de la empresa y sus actividades"
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

        {/* Error + Submit */}
        {error && (
          <div className="alert-error">
            <AlertCircle size={16} className="flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit" disabled={saving}
            className="btn-primary"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Guardando...' : 'Guardar Socio'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/socios')}
            className="btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
