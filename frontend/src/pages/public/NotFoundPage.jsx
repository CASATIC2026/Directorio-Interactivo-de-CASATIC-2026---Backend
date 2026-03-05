import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-casatic-600/15 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-grid opacity-[0.03]" />
      </div>

      <div className="relative z-10 text-center px-4 animate-fade-in-up">
        <div className="text-8xl font-bold text-white/10 mb-4 tracking-tighter">404</div>
        <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Página no encontrada</h1>
        <p className="text-surface-400 mb-8 max-w-sm mx-auto">
          La ruta solicitada no existe o fue movida. Verifica la URL e intenta de nuevo.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/" className="btn-primary">
            <Home size={18} /> Ir al inicio
          </Link>
          <Link to="/directorio" className="btn-secondary border-surface-700 text-surface-300 hover:bg-surface-800 hover:text-white">
            <Search size={18} /> Directorio
          </Link>
        </div>
      </div>
    </div>
  );
}
