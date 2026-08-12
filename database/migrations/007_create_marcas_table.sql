-- Migration 007: Criar tabela de marcas
CREATE TABLE IF NOT EXISTS marcas (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome          VARCHAR(150) NOT NULL UNIQUE,
    pais_origem   VARCHAR(100),
    descricao     TEXT,
    logo_url      VARCHAR(500),
    usuario_id    UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    criado_em     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_marcas_usuario ON marcas(usuario_id);
