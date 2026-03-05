import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { api } from '../lib/api';

export default function EstadisticasPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [empresasPeriodo, setEmpresasPeriodo] = useState([]);
  const [loadingPeriodo, setLoadingPeriodo] = useState(true);
  const [errorPeriodo, setErrorPeriodo] = useState(null);

  useEffect(() => {
    api.obtenerEstadisticas()
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });

    api.obtenerEstadisticasPeriodo()
      .then(data => {
        setEmpresasPeriodo(data);
        setLoadingPeriodo(false);
      })
      .catch(err => {
        setErrorPeriodo(err.message);
        setLoadingPeriodo(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center">Cargando estadísticas...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  // Datos para gráficas
  const barData = [
    { name: 'Empresas', value: stats.totalEmpresas },
    { name: 'Usuarios', value: stats.totalUsuarios },
    { name: 'Nuevas', value: stats.empresasNuevas },
    { name: 'Formularios', value: stats.formulariosRecibidos },
  ];
  const pieData = [
    { name: 'Empresas', value: stats.totalEmpresas },
    { name: 'Usuarios', value: stats.totalUsuarios },
    { name: 'Formularios', value: stats.formulariosRecibidos },
  ];
  const pieColors = ['#2563eb', '#059669', '#f59e42'];

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-8">Panel de Estadísticas</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <StatCard label="Empresas registradas" value={stats.totalEmpresas} />
        <StatCard label="Usuarios registrados" value={stats.totalUsuarios} />
        <StatCard label="Empresas nuevas (último mes)" value={stats.empresasNuevas} />
        <StatCard label="Formularios recibidos" value={stats.formulariosRecibidos} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Resumen en barras</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#2563eb" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Distribución en pastel</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {pieData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={pieColors[idx % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow p-6 mt-8">
        <h2 className="text-lg font-semibold mb-4">Empresas nuevas por mes (último año)</h2>
        {loadingPeriodo ? (
          <div className="text-center">Cargando gráfica por periodo...</div>
        ) : errorPeriodo ? (
          <div className="text-center text-red-600">{errorPeriodo}</div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={empresasPeriodo}>
              <XAxis dataKey="Periodo" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Total" fill="#059669" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
      <span className="text-3xl font-bold text-casatic-600 mb-2">{value}</span>
      <span className="text-sm text-surface-600 text-center">{label}</span>
    </div>
  );
}
