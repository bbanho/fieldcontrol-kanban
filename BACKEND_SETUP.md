# 🚀 Backend Setup - NestJS Implementation

## 📋 Visão Geral

Esta branch implementa a estrutura base do backend utilizando NestJS, seguindo as melhores práticas de arquitetura e desenvolvimento.

## 🏗️ Arquitetura Implementada

### Estrutura de Pastas
```
backend/kanban-backend/
├── src/
│   ├── common/
│   │   ├── dto/           # Data Transfer Objects
│   │   └── entities/      # Entidades do banco de dados
│   │   
│   ├── modules/
│   │   ├── cards/         # Módulo de gerenciamento de cards
│   │   └── columns/       # Módulo de gerenciamento de colunas
│   │   
│   ├── app.controller.ts  # Controller principal
│   ├── app.module.ts      # Módulo principal
│   ├── app.service.ts     # Serviço principal
│   └── main.ts           # Ponto de entrada
├── test/                 # Testes e2e
├── package.json          # Dependências
└── tsconfig.json         # Configuração TypeScript
```

## 🔧 Funcionalidades Implementadas

### 1. **Entidades (Entities)**
- **Card Entity**: Representa um card do kanban
  - Propriedades: id, title, description, columnId, order, createdAt, updatedAt
- **Column Entity**: Representa uma coluna do kanban
  - Propriedades: id, name, order, createdAt, updatedAt

### 2. **DTOs (Data Transfer Objects)**
- **CreateCardDto**: Validação para criação de cards
- **UpdateCardDto**: Validação para atualização de cards
- **CreateColumnDto**: Validação para criação de colunas
- **UpdateColumnDto**: Validação para atualização de colunas

### 3. **Módulos**
- **CardsModule**: Gerenciamento completo de cards
  - CardsController: Endpoints REST
  - CardsService: Lógica de negócio
  - Testes unitários e e2e
- **ColumnsModule**: Gerenciamento completo de colunas
  - ColumnsController: Endpoints REST
  - ColumnsService: Lógica de negócio
  - Testes unitários e e2e

## 🛠️ Tecnologias Utilizadas

- **NestJS**: Framework para aplicações Node.js escaláveis
- **TypeScript**: Linguagem tipada para melhor desenvolvimento
- **Jest**: Framework de testes
- **ESLint**: Linting de código
- **Prettier**: Formatação de código

## 📝 Endpoints da API

### Cards
- `GET /cards` - Listar todos os cards
- `GET /cards/:id` - Buscar card por ID
- `POST /cards` - Criar novo card
- `PUT /cards/:id` - Atualizar card
- `DELETE /cards/:id` - Deletar card

### Columns
- `GET /columns` - Listar todas as colunas
- `GET /columns/:id` - Buscar coluna por ID
- `POST /columns` - Criar nova coluna
- `PUT /columns/:id` - Atualizar coluna
- `DELETE /columns/:id` - Deletar coluna

## 🧪 Testes

### Testes Unitários
- **CardsService**: Testes de lógica de negócio
- **ColumnsService**: Testes de lógica de negócio
- **DTOs**: Validação de entrada de dados

### Testes E2E
- **AppController**: Testes de endpoints
- **Integração**: Testes de fluxo completo

## 🚀 Como Executar

### Instalação
```bash
cd backend/kanban-backend
npm install
```

### Desenvolvimento
```bash
npm run start:dev
```

### Testes
```bash
npm run test          # Testes unitários
npm run test:e2e      # Testes e2e
npm run test:cov      # Testes com cobertura
```

### Build
```bash
npm run build
```

## 📊 Métricas de Qualidade

- **Cobertura de Testes**: Mínimo 80%
- **Linting**: ESLint configurado
- **Formatação**: Prettier configurado
- **TypeScript**: Strict mode habilitado

## 🔄 Próximos Passos

1. **Integração com Banco de Dados**: PostgreSQL + TypeORM
2. **Validação Avançada**: Class-validator + class-transformer
3. **Autenticação**: JWT + Passport
4. **Documentação da API**: Swagger/OpenAPI
5. **Logs e Monitoramento**: Winston + Sentry

## 📚 Documentação Relacionada

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)

---

*Esta documentação será atualizada conforme a evolução do backend.* 