// ============================================================
// Entidades do domínio
// ============================================================

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  criadoEm: string;
}

export interface Marca {
  id: string;
  nome: string;
  paisOrigem?: string;
  descricao?: string;
  logoUrl?: string;
  usuarioId: string;
  criadoEm: string;
  atualizadoEm: string;
  _count?: { relogios: number };
}

export interface Colecao {
  id: string;
  nome: string;
  descricao?: string;
  usuarioId: string;
  criadoEm: string;
  atualizadoEm: string;
  _count?: { relogios: number };
}

export interface Relogio {
  id: string;
  usuarioId: string;
  marcaId?: string;
  colecaoId?: string;
  modelo: string;
  referencia?: string;
  numeroSerie?: string;
  anoFabricacao?: number;
  movimento?: string;
  caixaMaterial?: string;
  caixaDiametroMm?: number;
  pulseiraMaterial?: string;
  corMostrador?: string;
  condicao: string;
  precoCompra?: number;
  dataCompra?: string;
  localCompra?: string;
  notas?: string;
  imagemUrl?: string;
  criadoEm: string;
  atualizadoEm: string;
  marca?: Pick<Marca, 'id' | 'nome'>;
  colecao?: Pick<Colecao, 'id' | 'nome'>;
  manutencoes?: Manutencao[];
  seguros?: Seguro[];
  avaliacoes?: Avaliacao[];
}

export interface Manutencao {
  id: string;
  relogioId: string;
  usuarioId: string;
  tipo: string;
  descricao?: string;
  dataServico: string;
  custo?: number;
  prestador?: string;
  proximoServico?: string;
  notas?: string;
  criadoEm: string;
  atualizadoEm: string;
  relogio?: Pick<Relogio, 'id' | 'modelo'>;
}

export interface Seguro {
  id: string;
  relogioId: string;
  usuarioId: string;
  seguradora: string;
  numeroApolice?: string;
  valorSegurado: number;
  premioAnual?: number;
  dataInicio: string;
  dataVencimento: string;
  cobertura?: string;
  notas?: string;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
  relogio?: Pick<Relogio, 'id' | 'modelo'>;
}

export interface Avaliacao {
  id: string;
  relogioId: string;
  usuarioId: string;
  valorAvaliado: number;
  dataAvaliacao: string;
  avaliador?: string;
  metodo?: string;
  notas?: string;
  criadoEm: string;
  atualizadoEm: string;
  relogio?: Pick<Relogio, 'id' | 'modelo'>;
}

// ============================================================
// API Response
// ============================================================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: unknown[];
}

// ============================================================
// Auth
// ============================================================
export interface AuthState {
  token: string | null;
  usuario: Usuario | null;
  isAuthenticated: boolean;
  login: (token: string, usuario: Usuario) => void;
  logout: () => void;
}

// ============================================================
// Forms
// ============================================================
export interface LoginForm {
  email: string;
  senha: string;
}

export interface RegisterForm {
  nome: string;
  email: string;
  senha: string;
}

export interface WatchForm {
  modelo: string;
  marcaId?: string;
  colecaoId?: string;
  referencia?: string;
  numeroSerie?: string;
  anoFabricacao?: number;
  movimento?: string;
  caixaMaterial?: string;
  caixaDiametroMm?: number;
  pulseiraMaterial?: string;
  corMostrador?: string;
  condicao: string;
  precoCompra?: number;
  dataCompra?: string;
  localCompra?: string;
  notas?: string;
  imagemUrl?: string;
}

export interface BrandForm {
  nome: string;
  paisOrigem?: string;
  descricao?: string;
  logoUrl?: string;
}

export interface CollectionForm {
  nome: string;
  descricao?: string;
}

export interface ServiceRecordForm {
  relogioId: string;
  tipo: string;
  descricao?: string;
  dataServico: string;
  custo?: number;
  prestador?: string;
  proximoServico?: string;
  notas?: string;
}

export interface ValuationForm {
  relogioId: string;
  valorAvaliado: number;
  dataAvaliacao: string;
  avaliador?: string;
  metodo?: string;
  notas?: string;
}

// ============================================================
// Dashboard
// ============================================================
export interface DashboardData {
  resumo: {
    totalRelogios: number;
    totalMarcas: number;
    totalColecoes: number;
    totalManutencoes: number;
    totalSeguros: number;
    totalAvaliacoes: number;
    valorTotalColecao: number;
  };
  relogiosRecentes: Relogio[];
  ultimasAvaliacoes: Avaliacao[];
}
