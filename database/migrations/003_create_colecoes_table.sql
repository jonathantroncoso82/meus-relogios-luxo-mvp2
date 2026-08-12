CREATE TABLE colecoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  tema VARCHAR(100),
  quantidade_relogios INTEGER DEFAULT 0,
  valor_total DECIMAL(12, 2) DEFAULT 0,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ativo BOOLEAN DEFAULT true
);

CREATE INDEX idx_colecoes_usuario_id ON colecoes(usuario_id);
CREATE INDEX idx_colecoes_ativo ON colecoes(ativo);
