import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Watch, Tag, FolderOpen, Wrench, TrendingUp, Shield, ArrowRight } from 'lucide-react';
import apiClient from '../api/client';
import { DashboardData, ApiResponse } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const StatCard: React.FC<{ label: string; value: number | string; icon: React.ReactNode; color: string }> = ({ label, value, icon, color }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<ApiResponse<DashboardData>>('/usuarios/dashboard')
      .then((res) => setData(res.data.data ?? null))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500" />
      </div>
    );
  }

  const fmt = (v: number) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(v);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Visão geral da sua colecção</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard label="Relógios" value={data?.resumo.totalRelogios ?? 0} icon={<Watch className="w-6 h-6 text-amber-600" />} color="bg-amber-50" />
        <StatCard label="Marcas" value={data?.resumo.totalMarcas ?? 0} icon={<Tag className="w-6 h-6 text-blue-600" />} color="bg-blue-50" />
        <StatCard label="Coleções" value={data?.resumo.totalColecoes ?? 0} icon={<FolderOpen className="w-6 h-6 text-purple-600" />} color="bg-purple-50" />
        <StatCard label="Manutenções" value={data?.resumo.totalManutencoes ?? 0} icon={<Wrench className="w-6 h-6 text-green-600" />} color="bg-green-50" />
        <StatCard label="Avaliações" value={data?.resumo.totalAvaliacoes ?? 0} icon={<TrendingUp className="w-6 h-6 text-rose-600" />} color="bg-rose-50" />
        <StatCard label="Seguros" value={data?.resumo.totalSeguros ?? 0} icon={<Shield className="w-6 h-6 text-indigo-600" />} color="bg-indigo-50" />
        <div className="sm:col-span-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{fmt(data?.resumo.valorTotalColecao ?? 0)}</p>
            <p className="text-amber-100 text-sm">Valor Total da Colecção</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Relógios Recentes */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Relógios Recentes</h2>
            <Link to="/watches" className="text-sm text-amber-600 hover:underline flex items-center gap-1">
              Ver todos <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {data?.relogiosRecentes.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">Nenhum relógio adicionado ainda.</p>
          ) : (
            <div className="space-y-3">
              {data?.relogiosRecentes.map((r) => (
                <Link key={r.id} to={`/watches/${r.id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    {r.imagemUrl ? (
                      <img src={r.imagemUrl} alt={r.modelo} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Watch className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{r.modelo}</p>
                    <p className="text-xs text-gray-500">{r.marca?.nome || 'Sem marca'}</p>
                  </div>
                  <span className="text-xs text-gray-400">{r.condicao}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Últimas Avaliações */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Últimas Avaliações</h2>
            <Link to="/valuations" className="text-sm text-amber-600 hover:underline flex items-center gap-1">
              Ver todas <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {data?.ultimasAvaliacoes.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">Nenhuma avaliação registada ainda.</p>
          ) : (
            <div className="space-y-3">
              {data?.ultimasAvaliacoes.map((a) => (
                <div key={a.id} className="flex items-center gap-3 p-2 rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{a.relogio?.modelo}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(a.dataAvaliacao), 'dd/MM/yyyy', { locale: ptBR })}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-amber-600">
                    {fmt(Number(a.valorAvaliado))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
