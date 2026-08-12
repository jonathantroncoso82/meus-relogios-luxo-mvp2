import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ServiceRecordForm as ServiceRecordFormType, Relogio } from '../types';

interface Props {
  defaultValues?: Partial<ServiceRecordFormType>;
  relogios: Relogio[];
  onSubmit: (data: ServiceRecordFormType) => void;
  onCancel: () => void;
  isLoading?: boolean;
  fixedRelogioId?: string;
}

const TIPOS = ['Revisão Geral', 'Limpeza', 'Troca de Bateria', 'Regulagem', 'Polimento', 'Troca de Pulseira', 'Reparação', 'Outro'];

const ServiceRecordForm: React.FC<Props> = ({ defaultValues, relogios, onSubmit, onCancel, isLoading, fixedRelogioId }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ServiceRecordFormType>({
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
          <select
            {...register('tipo', { required: 'Tipo é obrigatório' })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="">Selecionar tipo...</option>
            {TIPOS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {errors.tipo && <p className="text-red-500 text-xs mt-1">{errors.tipo.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data do Serviço *</label>
          <input
            type="date"
            {...register('dataServico', { required: 'Data é obrigatória' })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          {errors.dataServico && <p className="text-red-500 text-xs mt-1">{errors.dataServico.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Custo (€)</label>
          <input
            type="number"
            step="0.01"
            {...register('custo', { min: 0 })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prestador</label>
          <input
            {...register('prestador')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Ex: Centro de Serviço Oficial"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Próximo Serviço</label>
          <input
            type="date"
            {...register('proximoServico')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <textarea
            {...register('descricao')}
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
          <textarea
            {...register('notas')}
            rows={2}
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

export default ServiceRecordForm;
