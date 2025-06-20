-- Script de inicialização do banco de dados de TESTE

-- Limpa o banco de dados antes de cada execução de teste
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

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

-- Inserir dados de teste
INSERT INTO columns (title, position) VALUES
    ('Coluna Teste 1', 1),
    ('Coluna Teste 2', 2);

INSERT INTO cards (title, description, position, column_id) VALUES
    ('Card Teste 1', 'Descrição do Card 1', 1, 1),
    ('Card Teste 2', 'Descrição do Card 2', 2, 1),
    ('Card Teste 3', 'Descrição do Card 3', 1, 2); 