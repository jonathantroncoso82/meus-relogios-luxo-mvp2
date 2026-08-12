CREATE TABLE seguros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  relogio_id UUID NOT NULL REFERENCES relogios(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  numero_apolice VARCHAR(100) UNIQUE NOT NULL,
  seguradora VARCHAR(255) NOT NULL,
  valor_cobertura DECIMAL(12, 2) NOT NULL,
  premio_anual DECIMAL(10, 2),
  data_inicio DATE NOT NULL,
  data_vencimento DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'ativo',
  tipo_cobertura VARCHAR(100),
  franquia DECIMAL(10, 2),
  notas TEXT,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ativo BOOLEAN DEFAULT true
);

CREATE INDEX idx_seguros_relogio_id ON seguros(relogio_id);
CREATE INDEX idx_seguros_usuario_id ON seguros(usuario_id);
CREATE INDEX idx_seguros_numero_apolice ON seguros(numero_apolice);
CREATE INDEX idx_seguros_status ON seguros(status);
CREATE INDEX idx_seguros_ativo ON seguros(ativo);
