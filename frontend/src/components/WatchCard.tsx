import React from 'react';
import { Link } from 'react-router-dom';
import { Watch, Tag, FolderOpen, Calendar } from 'lucide-react';
import { Relogio } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Props {
  relogio: Relogio;
  onDelete?: (id: string) => void;
}

const condicaoBadge: Record<string, string> = {
  'Novo': 'bg-green-100 text-green-800',
  'Excelente': 'bg-blue-100 text-blue-800',
  'Muito Bom': 'bg-cyan-100 text-cyan-800',
  'Bom': 'bg-yellow-100 text-yellow-800',
  'Regular': 'bg-orange-100 text-orange-800',
  'Para Restauro': 'bg-red-100 text-red-800',
};

const WatchCard: React.FC<Props> = ({ relogio, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
        {relogio.imagemUrl ? (
          <img
            src={relogio.imagemUrl}
            alt={relogio.modelo}
            className="w-full h-full object-cover"
          />
        ) : (
          <Watch className="w-16 h-16 text-gray-400" />
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
            {relogio.modelo}
          </h3>
          <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${condicaoBadge[relogio.condicao] || 'bg-gray-100 text-gray-700'}`}>
            {relogio.condicao}
          </span>
        </div>

        {relogio.referencia && (
          <p className="text-xs text-gray-500 mb-2">Ref: {relogio.referencia}</p>
        )}

        <div className="space-y-1 mb-3">
          {relogio.marca && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <Tag className="w-3.5 h-3.5" />
              <span>{relogio.marca.nome}</span>
            </div>
          )}
          {relogio.colecao && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <FolderOpen className="w-3.5 h-3.5" />
              <span>{relogio.colecao.nome}</span>
            </div>
          )}
          {relogio.dataCompra && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <Calendar className="w-3.5 h-3.5" />
              <span>{format(new Date(relogio.dataCompra), 'dd/MM/yyyy', { locale: ptBR })}</span>
            </div>
          )}
        </div>

        {relogio.precoCompra && (
          <p className="text-sm font-semibold text-amber-600 mb-3">
            {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(Number(relogio.precoCompra))}
          </p>
        )}

        <div className="flex gap-2">
          <Link
            to={`/watches/${relogio.id}`}
            className="flex-1 text-center text-xs font-medium px-3 py-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            Ver Detalhes
          </Link>
          {onDelete && (
            <button
              onClick={() => onDelete(relogio.id)}
              className="text-xs font-medium px-3 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              Remover
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WatchCard;
