import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { watchesApi } from '../api/watches';
import { brandsApi } from '../api/brands';
import { collectionsApi } from '../api/collections';
import { Relogio, Marca, Colecao, WatchForm } from '../types';
import WatchCard from '../components/WatchCard';
import WatchForm as WatchFormComponent from '../components/WatchForm';

const WatchesPage: React.FC = () => {
  const [relogios, setRelogios] = useState<Relogio[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [colecoes, setColecoes] = useState<Colecao[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Relogio | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [filterMarca, setFilterMarca] = useState('');
  const [filterColecao, setFilterColecao] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [rRes, mRes, cRes] = await Promise.all([
        watchesApi.list({ search: search || undefined, marcaId: filterMarca || undefined, colecaoId: filterColecao || undefined }),
        brandsApi.list(),
        collectionsApi.list(),
      ]);
      setRelogios(rRes.data ?? []);
      setMarcas(mRes.data ?? []);
      setColecoes(cRes.data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, filterMarca, filterColecao]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (data: WatchForm) => {
    setIsSubmitting(true);
    try {
      if (editing) {
        await watchesApi.update(editing.id, data);
      } else {
        await watchesApi.create(data);
      }
      setShowForm(false);
      setEditing(null);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem a certeza que deseja remover este relógio?')) return;
    try {
      await watchesApi.delete(id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (r: Relogio) => {
    setEditing(r);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relógios</h1>
          <p className="text-gray-500 text-sm mt-1">{relogios.length} relógio(s) na colecção</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Adicionar
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar relógios..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <select
          value={filterMarca}
          onChange={(e) => setFilterMarca(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <option value="">Todas as marcas</option>
          {marcas.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}
        </select>
        <select
          value={filterColecao}
          onChange={(e) => setFilterColecao(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <option value="">Todas as coleções</option>
          {colecoes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
        {(search || filterMarca || filterColecao) && (
          <button onClick={() => { setSearch(''); setFilterMarca(''); setFilterColecao(''); }} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
            <X className="w-4 h-4" /> Limpar
          </button>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editing ? 'Editar Relógio' : 'Adicionar Relógio'}
            </h2>
            <WatchFormComponent
              defaultValues={editing ? {
                modelo: editing.modelo,
                marcaId: editing.marcaId,
                colecaoId: editing.colecaoId,
                referencia: editing.referencia,
                numeroSerie: editing.numeroSerie,
                anoFabricacao: editing.anoFabricacao,
                movimento: editing.movimento,
                caixaMaterial: editing.caixaMaterial,
                caixaDiametroMm: editing.caixaDiametroMm,
                pulseiraMaterial: editing.pulseiraMaterial,
                corMostrador: editing.corMostrador,
                condicao: editing.condicao,
                precoCompra: editing.precoCompra,
                dataCompra: editing.dataCompra?.split('T')[0],
                localCompra: editing.localCompra,
                notas: editing.notas,
                imagemUrl: editing.imagemUrl,
              } : undefined}
              marcas={marcas}
              colecoes={colecoes}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isSubmitting}
            />
          </div>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
        </div>
      ) : relogios.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg font-medium">Nenhum relógio encontrado</p>
          <p className="text-sm mt-1">Adicione o seu primeiro relógio à colecção.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {relogios.map((r) => (
            <div key={r.id} className="relative group">
              <WatchCard relogio={r} onDelete={handleDelete} />
              <button
                onClick={() => handleEdit(r)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-700 text-xs px-2 py-1 rounded-lg shadow border border-gray-200 hover:bg-gray-50"
              >
                Editar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchesPage;
