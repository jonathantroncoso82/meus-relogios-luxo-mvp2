import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { BrandForm as BrandFormType } from '../types';

interface Props {
  defaultValues?: Partial<BrandFormType>;
  onSubmit: (data: BrandFormType) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const BrandForm: React.FC<Props> = ({ defaultValues, onSubmit, onCancel, isLoading }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<BrandFormType>({
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Marca *</label>
        <input
          {...register('nome', { required: 'Nome é obrigatório' })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          placeholder="Ex: Rolex"
        />
        {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">País de Origem</label>
        <input
          {...register('paisOrigem')}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          placeholder="Ex: Suíça"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">URL do Logo</label>
        <input
          {...register('logoUrl')}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
        <textarea
          {...register('descricao')}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          placeholder="Breve descrição da marca..."
        />
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

export default BrandForm;
