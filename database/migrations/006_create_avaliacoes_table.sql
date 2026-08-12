-- Migration 006: Criar tabela de avaliações
CREATE TABLE IF NOT EXISTS avaliacoes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    relogio_id      UUID NOT NULL REFERENCES relogios(id) ON DELETE CASCADE,
    usuario_id      UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    valor_avaliado  NUMERIC(15,2) NOT NULL,
    data_avaliacao  DATE NOT NULL,
    avaliador       VARCHAR(200),
    metodo          VARCHAR(100),
    notas           TEXT,
    criado_em       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_avaliacoes_relogio ON avaliacoes(relogio_id);
