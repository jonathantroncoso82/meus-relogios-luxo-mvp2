CREATE TABLE relogios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  marca VARCHAR(100) NOT NULL,
  modelo VARCHAR(255) NOT NULL,
  referencia VARCHAR(100),
  ano_producao INTEGER,
  tipo VARCHAR(50),
  material VARCHAR(100),
  tamanho_caixa VARCHAR(20),
  movimento VARCHAR(100),
  condicao VARCHAR(50),
  preco_estimado DECIMAL(12, 2),
  descricao TEXT,
  imagem_url VARCHAR(500),
  data_aquisicao DATE,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ativo BOOLEAN DEFAULT true
);

CREATE INDEX idx_relogios_usuario_id ON relogios(usuario_id);
CREATE INDEX idx_relogios_marca ON relogios(marca);
CREATE INDEX idx_relogios_ativo ON relogios(ativo);
