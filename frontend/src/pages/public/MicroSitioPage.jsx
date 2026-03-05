import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';
import {
  Building2, MapPin, Phone, Globe, Facebook, Linkedin, Twitter,
  Send, ArrowLeft, CheckCircle, ExternalLink, Mail, Tag, Briefcase
} from 'lucide-react';

function PageSkeleton() {
  return (
    <div className="bg-mesh min-h-screen">
      <div className="bg-gradient-to-br from-casatic-700 to-surface-900 h-48" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 pb-16">
        <div className="card-base p-8 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 skeleton rounded-2xl flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-7 skeleton w-1/3" />
              <div className="h-4 skeleton w-full" />
              <div className="h-4 skeleton w-2/3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MicroSitioPage() {
  const { slug } = useParams();
  const [socio, setSocio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ nombre: '', correo: '', mensaje: '' });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get(`/directorio/socio/${slug}`)
      .then((res) => setSocio(res.data))
      .catch(() => setError('Socio no encontrado o deshabilitado'))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setFormError(null);
    try {
      await api.post(`/formulariocontacto/${socio.id}`, form);
      setEnviado(true);
      setForm({ nombre: '', correo: '', mensaje: '' });
    } catch {
      setFormError('Error al enviar el formulario. Intente de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  const parseRedes = (json) => { try { return JSON.parse(json); } catch { return {}; } };

  if (loading) return <PageSkeleton />;

  if (error) return (
    <div className="bg-mesh min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Building2 size={28} className="text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-surface-900 mb-2">No encontrado</h2>
        <p className="text-surface-500 mb-6">{error}</p>
        <Link to="/directorio" className="btn-primary">
          <ArrowLeft size={16} /> Volver al directorio
        </Link>
      </div>
    </div>
  );

  const redes = parseRedes(socio.redesSociales);
  const socialLinks = [
    { key: 'website', icon: Globe, label: 'Sitio Web', color: 'text-casatic-600 hover:text-casatic-800 bg-casatic-50' },
    { key: 'facebook', icon: Facebook, label: 'Facebook', color: 'text-blue-600 hover:text-blue-800 bg-blue-50' },
    { key: 'linkedin', icon: Linkedin, label: 'LinkedIn', color: 'text-blue-700 hover:text-blue-900 bg-blue-50' },
    { key: 'twitter', icon: Twitter, label: 'Twitter', color: 'text-sky-500 hover:text-sky-700 bg-sky-50' },
  ].filter((s) => redes[s.key]);

  return (
    <div className="bg-mesh min-h-screen">
      {/* ── Hero Banner ──────────────────────────────────── */}
      <div className="bg-gradient-to-br from-casatic-700 via-casatic-800 to-surface-900 h-56 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-casatic-500/15 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-28 relative z-10 pb-16">
        {/* ── Back Link ──────────────────────────────────── */}
        <Link to="/directorio" className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft size={14} /> Volver al directorio
        </Link>

        {/* ── Company Header ─────────────────────────────── */}
        <div className="card-base p-8 mb-6 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-casatic-100 to-casatic-50 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-card">
              {socio.logoUrl ? (
                <img src={socio.logoUrl} alt={socio.nombreEmpresa} className="w-14 h-14 object-contain rounded-xl" />
              ) : (
                <Building2 size={32} className="text-casatic-600" />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 tracking-tight">{socio.nombreEmpresa}</h1>
              <p className="text-surface-500 mt-2 leading-relaxed">{socio.descripcion}</p>

              <div className="mt-4 flex flex-wrap gap-3">
                {socio.telefono && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-surface-600 bg-surface-50 px-3 py-1.5 rounded-lg">
                    <Phone size={14} className="text-surface-400" /> {socio.telefono}
                  </span>
                )}
                {socio.direccion && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-surface-600 bg-surface-50 px-3 py-1.5 rounded-lg">
                    <MapPin size={14} className="text-surface-400" /> {socio.direccion}
                  </span>
                )}
              </div>

              {socialLinks.length > 0 && (
                <div className="mt-4 flex gap-2">
                  {socialLinks.map((s) => (
                    <a key={s.key} href={redes[s.key]} target="_blank" rel="noopener noreferrer"
                      className={`p-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 ${s.color}`}
                      title={s.label}
                    >
                      <s.icon size={18} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Especialidades y Servicios ──────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div className="card-base p-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="font-semibold text-surface-900 mb-4 flex items-center gap-2">
              <Tag size={18} className="text-casatic-600" />
              Especialidades
            </h2>
            <div className="flex flex-wrap gap-2">
              {socio.especialidades?.length > 0 ? (
                socio.especialidades.map((esp) => (
                  <span key={esp} className="badge-primary">{esp}</span>
                ))
              ) : (
                <p className="text-sm text-surface-400">Sin especialidades registradas</p>
              )}
            </div>
          </div>

          <div className="card-base p-6 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <h2 className="font-semibold text-surface-900 mb-4 flex items-center gap-2">
              <Briefcase size={18} className="text-casatic-600" />
              Servicios
            </h2>
            {socio.servicios?.length > 0 ? (
              <ul className="space-y-2">
                {socio.servicios.map((srv) => (
                  <li key={srv} className="flex items-center gap-2.5 text-sm text-surface-600">
                    <CheckCircle size={15} className="text-accent-500 flex-shrink-0" />
                    {srv}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-surface-400">Sin servicios registrados</p>
            )}
          </div>
        </div>

        {/* ── Marcas ─────────────────────────────────────── */}
        {socio.marcasRepresenta && (
          <div className="card-base p-6 mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="font-semibold text-surface-900 mb-3 flex items-center gap-2">
              <ExternalLink size={18} className="text-casatic-600" />
              Marcas que Representa
            </h2>
            <p className="text-sm text-surface-600">{socio.marcasRepresenta}</p>
          </div>
        )}

        {/* ── Contact Form ───────────────────────────────── */}
        <div className="card-base p-8 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
          <h2 className="font-semibold text-lg text-surface-900 mb-1 flex items-center gap-2">
            <Mail size={20} className="text-casatic-600" />
            Contactar a {socio.nombreEmpresa}
          </h2>
          <p className="text-sm text-surface-500 mb-6">Completa el formulario y el socio recibirá tu mensaje.</p>

          {enviado ? (
            <div className="alert-success py-6">
              <div className="flex flex-col items-center gap-3 w-full text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <CheckCircle size={24} className="text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-emerald-800">Mensaje enviado con éxito</p>
                  <p className="text-emerald-600 text-sm mt-1">El socio se pondrá en contacto contigo pronto.</p>
                </div>
                <button onClick={() => setEnviado(false)} className="btn-secondary btn-sm mt-2">
                  Enviar otro mensaje
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Nombre</label>
                  <input type="text" required value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    className="input-field" placeholder="Tu nombre completo" />
                </div>
                <div>
                  <label className="input-label">Correo electrónico</label>
                  <input type="email" required value={form.correo}
                    onChange={(e) => setForm({ ...form, correo: e.target.value })}
                    className="input-field" placeholder="tu@email.com" />
                </div>
              </div>
              <div>
                <label className="input-label">Mensaje</label>
                <textarea required rows={4} value={form.mensaje}
                  onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                  className="input-field resize-none" placeholder="Describe tu consulta o necesidad..." />
              </div>
              {formError && <div className="alert-error"><span>{formError}</span></div>}
              <button type="submit" disabled={enviando} className="btn-primary">
                <Send size={16} />
                {enviando ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
