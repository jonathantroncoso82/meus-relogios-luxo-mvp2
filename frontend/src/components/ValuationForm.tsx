import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ValuationForm as ValuationFormType, Relogio } from '../types';

interface Props {
  defaultValues?: Partial<ValuationFormType>;
  relogios: Relogio[];
  onSubmit: (data: ValuationFormType) => void;
  onCancel: () => void;
  isLoading?: boolean;
  fixedRelogioId?: string;
}

const METODOS = ['Mercado', 'Leilão', 'Perito', 'Seguradora', 'Online', 'Outro'];

const ValuationForm: React.FC<Props> = ({ defaultValues, relogios, onSubmit, onCancel, isLoading, fixedRelogioId }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ValuationFormType>({
    defaultValues: { relogioId: fixedRelogioId, ...defaultValues },
  });

  useEffect(() => {
    reset({ relogioId: fixedRelogioId, ...defaultValues });
  }, [defaultValues, fixedRelogioId, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {!fixedRelogioId && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Relógio *</label>
          <select
            {...register('relogioId', { required: 'Selecione um relógio' })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="">Selecionar relógio...</option>
            {relogios.map((r) => (
              <option key={r.id} value={r.id}>{r.modelo} {r.referencia ? `(${r.referencia})` : ''}</option>
            ))}
          </select>
          {errors.relogioId && <p className="text-red-500 text-xs mt-1">{errors.relogioId.message}</p>}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Valor Avaliado (€) *</label>
          <input
            type="number"
            step="0.01"
            {...register('valorAvaliado', { required: 'Valor é obrigatório', min: { value: 0, message: 'Valor deve ser positivo' } })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          {errors.valorAvaliado && <p className="text-red-500 text-xs mt-1">{errors.valorAvaliado.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data da Avaliação *</label>
          <input
            type="date"
            {...register('dataAvaliacao', { required: 'Data é obrigatória' })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          {errors.dataAvaliacao && <p className="text-red-500 text-xs mt-1">{errors.dataAvaliacao.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Avaliador</label>
          <input
            {...register('avaliador')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Nome do avaliador ou empresa"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Método</label>
          <select
            {...register('metodo')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="">Selecionar método...</option>
            {METODOS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
          <textarea
            {...register('notas')}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          Cancelar
        </button>
        <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 disabled:opacity-50 transition-colors">
          {isLoading ? 'A guardar...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
};

export default ValuationForm;
