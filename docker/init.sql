-- Script de inicialização do banco de dados Kanban

-- Criar tabela de colunas
CREATE TABLE IF NOT EXISTS columns (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    position INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de cards
CREATE TABLE IF NOT EXISTS cards (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    position INTEGER NOT NULL,
    column_id INTEGER NOT NULL REFERENCES columns(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_cards_column_id ON cards(column_id);
CREATE INDEX IF NOT EXISTS idx_cards_position ON cards(position);
CREATE INDEX IF NOT EXISTS idx_columns_position ON columns(position);

-- Inserir dados iniciais
INSERT INTO columns (title, position) VALUES 
    ('A Fazer', 1),
    ('Em Andamento', 2),
    ('Concluído', 3)
ON CONFLICT DO NOTHING;

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at automaticamente
CREATE TRIGGER update_columns_updated_at BEFORE UPDATE ON columns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON cards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 