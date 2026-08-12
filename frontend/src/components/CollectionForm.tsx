import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CollectionForm as CollectionFormType } from '../types';

interface Props {
  defaultValues?: Partial<CollectionFormType>;
  onSubmit: (data: CollectionFormType) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const CollectionForm: React.FC<Props> = ({ defaultValues, onSubmit, onCancel, isLoading }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CollectionFormType>({
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Coleção *</label>
        <input
          {...register('nome', { required: 'Nome é obrigatório' })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          placeholder="Ex: Desportivos, Clássicos..."
        />
        {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
        <textarea
          {...register('descricao')}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          placeholder="Descrição da coleção..."
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

export default CollectionForm;
