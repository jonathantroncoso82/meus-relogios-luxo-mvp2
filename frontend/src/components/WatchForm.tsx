import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { WatchForm as WatchFormType, Marca, Colecao } from '../types';

interface Props {
  defaultValues?: Partial<WatchFormType>;
  marcas: Marca[];
  colecoes: Colecao[];
  onSubmit: (data: WatchFormType) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const CONDICOES = ['Novo', 'Excelente', 'Muito Bom', 'Bom', 'Regular', 'Para Restauro'];

const WatchForm: React.FC<Props> = ({ defaultValues, marcas, colecoes, onSubmit, onCancel, isLoading }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<WatchFormType>({
    defaultValues: { condicao: 'Excelente', ...defaultValues },
  });

  useEffect(() => {
    if (defaultValues) reset({ condicao: 'Excelente', ...defaultValues });
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Modelo */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Modelo *</label>
          <input
            {...register('modelo', { required: 'Modelo é obrigatório' })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Ex: Submariner Date"
          />
          {errors.modelo && <p className="text-red-500 text-xs mt-1">{errors.modelo.message}</p>}
        </div>

        {/* Marca */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
          <select
            {...register('marcaId')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="">Selecionar marca...</option>
            {marcas.map((m) => (
              <option key={m.id} value={m.id}>{m.nome}</option>
            ))}
          </select>
        </div>

        {/* Coleção */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Coleção</label>
          <select
            {...register('colecaoId')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="">Selecionar coleção...</option>
            {colecoes.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>

        {/* Referência */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Referência</label>
          <input
            {...register('referencia')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Ex: 126610LN"
          />
        </div>

        {/* Número de Série */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Número de Série</label>
          <input
            {...register('numeroSerie')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {/* Ano de Fabricação */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ano de Fabricação</label>
          <input
            type="number"
            {...register('anoFabricacao', { min: 1800, max: new Date().getFullYear() })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Ex: 2022"
          />
        </div>

        {/* Condição */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Condição *</label>
          <select
            {...register('condicao', { required: true })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            {CONDICOES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Movimento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Movimento</label>
          <input
            {...register('movimento')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Ex: Automático, Quartzo"
          />
        </div>

        {/* Material da Caixa */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Material da Caixa</label>
          <input
            {...register('caixaMaterial')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Ex: Aço inoxidável, Ouro"
          />
        </div>

        {/* Diâmetro da Caixa */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Diâmetro (mm)</label>
          <input
            type="number"
            step="0.1"
            {...register('caixaDiametroMm', { min: 0 })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Ex: 40"
          />
        </div>

        {/* Material da Pulseira */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Material da Pulseira</label>
          <input
            {...register('pulseiraMaterial')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Ex: Aço, Couro, Borracha"
          />
        </div>

        {/* Cor do Mostrador */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cor do Mostrador</label>
          <input
            {...register('corMostrador')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Ex: Preto, Branco, Azul"
          />
        </div>

        {/* Preço de Compra */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Preço de Compra (€)</label>
          <input
            type="number"
            step="0.01"
            {...register('precoCompra', { min: 0 })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {/* Data de Compra */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data de Compra</label>
          <input
            type="date"
            {...register('dataCompra')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {/* Local de Compra */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Local de Compra</label>
          <input
            {...register('localCompra')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Ex: Boutique Rolex Lisboa"
          />
        </div>

        {/* URL da Imagem */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
          <input
            {...register('imagemUrl')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="https://..."
          />
        </div>

        {/* Notas */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
          <textarea
            {...register('notas')}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Observações adicionais..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'A guardar...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
};

export default WatchForm;
