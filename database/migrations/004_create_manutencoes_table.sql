CREATE TABLE manutencoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  relogio_id UUID NOT NULL REFERENCES relogios(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo_servico VARCHAR(100) NOT NULL,
  descricao TEXT,
  data_servico DATE NOT NULL,
  data_conclusao DATE,
  custo DECIMAL(10, 2),
  prestador_servico VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pendente',
  notas TEXT,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ativo BOOLEAN DEFAULT true
);

CREATE INDEX idx_manutencoes_relogio_id ON manutencoes(relogio_id);
CREATE INDEX idx_manutencoes_usuario_id ON manutencoes(usuario_id);
CREATE INDEX idx_manutencoes_status ON manutencoes(status);
CREATE INDEX idx_manutencoes_ativo ON manutencoes(ativo);
