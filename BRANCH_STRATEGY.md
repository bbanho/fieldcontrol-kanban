# 🚀 Estratégia de Branches e Workflow

## 📋 Visão Geral

Este documento define a estratégia de branches e workflow de desenvolvimento para o projeto Valinor, seguindo as melhores práticas de CI/CD e DevOps.

## 🌿 Estrutura de Branches

```
master (ou main) - Branch principal estável
├── original - Backup da branch principal original
├── setup - Configuração inicial e documentação
└── desafio - Branch base para desenvolvimento
    ├── feature/backend-setup - Configuração do NestJS
    ├── feature/frontend-setup - Configuração do Angular
    ├── feature/docker-infrastructure - Containerização
    ├── feature/api-integration - Integração frontend-backend
    ├── feature/testing - Implementação de testes
    ├── feature/responsive-design - Design responsivo
    └── feature/deployment - Configuração de deploy
```

## 🔄 Fluxo de Trabalho

### 1. **Branch Original**
- **Propósito:** Backup da versão inicial do repositório
- **Criação:** `git checkout -b original`
- **Uso:** Preservar estado inicial para referência

### 2. **Branch Setup**
- **Propósito:** Configuração inicial, documentação e infraestrutura
- **Criação:** `git checkout master && git checkout -b setup`
- **Conteúdo:** Docker, Makefile, scripts, documentação

### 3. **Branch Desafio**
- **Propósito:** Base para desenvolvimento de features
- **Criação:** `git checkout setup && git checkout -b desafio`
- **Uso:** Branch principal para desenvolvimento iterativo

### 4. **Branches de Feature**
- **Padrão:** `feature/nome-da-feature`
- **Criação:** `git checkout desafio && git checkout -b feature/nome-da-feature`
- **Uso:** Desenvolvimento isolado de funcionalidades

## 📝 Convenções de Commits

### Commits Semânticos
Seguindo o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Tipos de Commit
- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação de código
- `refactor:` - Refatoração
- `test:` - Testes
- `chore:` - Configurações e dependências

### Exemplos
```bash
feat: implementa backend NestJS com CRUD de cards
fix: corrige bug na validação de formulários
docs: atualiza README com instruções de instalação
test: adiciona testes unitários para CardsService
```

## 🔀 Pull Requests

### Estrutura do PR
- **Título:** Claro e conciso, seguindo padrão de commits
- **Descrição:** Detalhada, incluindo contexto e mudanças
- **Template:** Seguir template estabelecido no repositório

### Processo de Review
1. **Criação:** Branch de feature → PR para `desafio`
2. **Review:** Análise de código e testes
3. **Aprovação:** Merge após aprovação
4. **Deploy:** Testes automatizados antes do merge

## 🐳 Infraestrutura Docker

### Containers
- **Frontend:** Angular com Nginx
- **Backend:** NestJS com Node.js
- **Database:** PostgreSQL
- **Cache:** Redis
- **Proxy:** Nginx (reverse proxy)

### Comandos Principais
```bash
# Desenvolvimento
make dev-up
make dev-down

# Produção
make prod-up
make prod-down

# Logs
make logs
```

## 🧪 Testes

### Estratégia de Testes
- **Unitários:** Jest para backend, Jasmine para frontend
- **Integração:** Testes de API com Supertest
- **E2E:** Cypress para frontend
- **Coverage:** Mínimo 80% de cobertura

### Execução
```bash
# Backend
npm run test
npm run test:e2e

# Frontend
ng test
ng e2e
```

## 📚 Documentação

### Arquivos Obrigatórios
- `README.md` - Visão geral e instruções
- `CHANGELOG.md` - Histórico de mudanças
- `CONTRIBUTING.md` - Guia de contribuição
- `DOCKER.md` - Instruções Docker
- `BRANCH_STRATEGY.md` - Este documento

### Padrões
- **Idioma:** Português (primário), Inglês (secundário)
- **Formato:** Markdown
- **Estrutura:** Hierárquica e navegável

## 🔧 Ferramentas e Configurações

### Validação Pré-commit
- **Husky:** Hooks de git
- **Lint-staged:** Linting apenas arquivos modificados
- **Commitizen:** Commits semânticos padronizados

### CI/CD
- **GitHub Actions:** Automação de testes e deploy
- **Docker:** Containerização para produção
- **Nginx:** Servidor web e proxy reverso

## 🚀 Deploy

### Ambientes
- **Desenvolvimento:** Local com Docker
- **Staging:** Servidor de testes
- **Produção:** Servidor de produção

### Processo
1. **Build:** Docker images
2. **Test:** Execução de testes automatizados
3. **Deploy:** Deploy automatizado após aprovação
4. **Monitor:** Monitoramento de performance e logs

## 📋 Checklist de Qualidade

### Antes do Merge
- [ ] Código lintado e formatado
- [ ] Testes passando
- [ ] Documentação atualizada
- [ ] Commits semânticos
- [ ] Review aprovado
- [ ] Deploy testado

### Antes do Release
- [ ] Todas as features testadas
- [ ] Performance validada
- [ ] Segurança verificada
- [ ] Changelog atualizado
- [ ] Tag de versão criada

---

*Este documento deve ser atualizado conforme a evolução do projeto e feedback da equipe.* 