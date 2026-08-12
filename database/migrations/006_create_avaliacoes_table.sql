CREATE TABLE avaliacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  relogio_id UUID NOT NULL REFERENCES relogios(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  avaliador VARCHAR(255) NOT NULL,
  data_avaliacao DATE NOT NULL,
  valor_avaliado DECIMAL(12, 2) NOT NULL,
  condicao_geral VARCHAR(50),
  funcionalidade VARCHAR(50),
  autenticidade VARCHAR(50),
  raridade VARCHAR(50),
  demanda_mercado VARCHAR(50),
  relatorio TEXT,
  certificado_numero VARCHAR(100),
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ativo BOOLEAN DEFAULT true
);

CREATE INDEX idx_avaliacoes_relogio_id ON avaliacoes(relogio_id);
CREATE INDEX idx_avaliacoes_usuario_id ON avaliacoes(usuario_id);
CREATE INDEX idx_avaliacoes_ativo ON avaliacoes(ativo);
