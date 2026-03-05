import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Building2, LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState(null);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await login(email, password);
      if (data.primerLogin) {
        navigate('/admin/cambiar-password');
      } else if (data.rol === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/admin/mi-empresa');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-casatic-600/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent-500/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-grid opacity-[0.03]" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4 animate-fade-in-up">
        {/* Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-elevated p-8 border border-white/20">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-casatic-500 to-casatic-700 rounded-2xl mb-4 shadow-lg shadow-casatic-500/25">
              <Building2 size={30} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-surface-900 tracking-tight">CASATIC Admin</h1>
            <p className="text-surface-500 text-sm mt-1">Directorio Tecnológico de El Salvador</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="input-label">Email</label>
              <input
                type="email" required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="admin@casatic.org"
              />
            </div>
            <div>
              <label className="input-label">Contraseña</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'} required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="alert-error">
                <AlertCircle size={16} className="flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="btn-primary w-full py-3 text-base"
            >
              <LogIn size={20} />
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-surface-100">
            <p className="text-center text-xs text-surface-400">
              Directorio tecnológico de El Salvador </p>
              
          </div>
        </div>
      </div>
    </div>
  );
}
