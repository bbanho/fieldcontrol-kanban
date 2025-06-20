# Makefile para o projeto Kanban - Field Control
.PHONY: help dev prod stop restart logs clean build status shell frontend backend postgres

# Variáveis
DOCKER_SCRIPT = ./scripts/docker.sh
COMPOSE_DEV = docker-compose -f docker-compose.dev.yml
COMPOSE_PROD = docker-compose

# Comando padrão
help: ## Mostra esta ajuda
	@echo "Comandos disponíveis:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Comandos de desenvolvimento
dev: ## Inicia ambiente de desenvolvimento
	$(DOCKER_SCRIPT) dev

prod: ## Inicia ambiente de produção
	$(DOCKER_SCRIPT) prod

stop: ## Para todos os containers
	$(DOCKER_SCRIPT) stop

restart: ## Reinicia todos os containers
	$(DOCKER_SCRIPT) restart

logs: ## Mostra logs dos containers
	$(DOCKER_SCRIPT) logs

clean: ## Limpa containers, volumes e imagens
	$(DOCKER_SCRIPT) clean

build: ## Faz build das imagens
	$(DOCKER_SCRIPT) build

status: ## Mostra status dos containers
	$(DOCKER_SCRIPT) status

# Comandos de shell
shell: ## Acessa shell de um container (uso: make shell CONTAINER=frontend)
	$(DOCKER_SCRIPT) shell $(CONTAINER)

frontend: ## Acessa shell do frontend
	$(DOCKER_SCRIPT) shell frontend

backend: ## Acessa shell do backend
	$(DOCKER_SCRIPT) shell backend

postgres: ## Acessa shell do postgres
	$(DOCKER_SCRIPT) shell postgres

# Comandos de teste
test-frontend: ## Executa testes do frontend
	$(COMPOSE_DEV) exec frontend npm test

test-backend: ## Executa testes do backend
	$(COMPOSE_DEV) exec backend npm test

test-e2e: ## Executa testes e2e
	$(COMPOSE_DEV) exec frontend npm run e2e

test: test-frontend test-backend ## Executa todos os testes

# Comandos de lint
lint-frontend: ## Executa lint do frontend
	$(COMPOSE_DEV) exec frontend npm run lint

lint-backend: ## Executa lint do backend
	$(COMPOSE_DEV) exec backend npm run lint

lint: lint-frontend lint-backend ## Executa lint de todos os projetos

# Comandos de build
build-frontend: ## Faz build do frontend
	$(COMPOSE_DEV) exec frontend npm run build

build-backend: ## Faz build do backend
	$(COMPOSE_DEV) exec backend npm run build

# Comandos de instalação
install-frontend: ## Instala dependências do frontend
	$(COMPOSE_DEV) exec frontend npm install

install-backend: ## Instala dependências do backend
	$(COMPOSE_DEV) exec backend npm install

install: install-frontend install-backend ## Instala dependências de todos os projetos

# Comandos de banco de dados
db-migrate: ## Executa migrações do banco
	$(COMPOSE_DEV) exec backend npm run migration:run

db-seed: ## Executa seeds do banco
	$(COMPOSE_DEV) exec backend npm run seed

db-reset: ## Reseta o banco de dados
	$(COMPOSE_DEV) exec postgres psql -U kanban_user -d kanban_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Comandos de monitoramento
monitor: ## Monitora recursos dos containers
	$(COMPOSE_DEV) exec backend npm run start:dev & \
	$(COMPOSE_DEV) exec frontend npm start & \
	watch -n 1 'docker stats --no-stream'

# Comandos de backup
backup-db: ## Faz backup do banco de dados
	$(COMPOSE_DEV) exec postgres pg_dump -U kanban_user kanban_db > backup_$(shell date +%Y%m%d_%H%M%S).sql

restore-db: ## Restaura backup do banco de dados (uso: make restore-db FILE=backup.sql)
	$(COMPOSE_DEV) exec -T postgres psql -U kanban_user kanban_db < $(FILE)

# Comandos de deploy
deploy-staging: ## Deploy para staging
	@echo "Deploy para staging..."
	$(COMPOSE_PROD) -f docker-compose.staging.yml up -d

deploy-production: ## Deploy para produção
	@echo "Deploy para produção..."
	$(COMPOSE_PROD) up -d

# Comandos de segurança
security-scan: ## Executa scan de segurança
	docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
		-v $(PWD):/app \
		owasp/zap2docker-stable zap-baseline.py -t http://localhost:4200

# Comandos de documentação
docs-generate: ## Gera documentação da API
	$(COMPOSE_DEV) exec backend npm run docs:generate

docs-serve: ## Serve documentação da API
	$(COMPOSE_DEV) exec backend npm run docs:serve

# Comandos de limpeza
clean-all: clean ## Limpeza completa (inclui node_modules)
	rm -rf frontend/node_modules backend/node_modules
	rm -rf frontend/dist backend/dist
	rm -rf .angular

# Comandos de verificação
check-deps: ## Verifica dependências desatualizadas
	$(COMPOSE_DEV) exec frontend npm outdated
	$(COMPOSE_DEV) exec backend npm outdated

update-deps: ## Atualiza dependências
	$(COMPOSE_DEV) exec frontend npm update
	$(COMPOSE_DEV) exec backend npm update

# Comandos de desenvolvimento rápido
dev-setup: ## Setup completo do ambiente de desenvolvimento
	@echo "Configurando ambiente de desenvolvimento..."
	make dev
	@echo "Aguardando serviços ficarem prontos..."
	sleep 15
	make db-migrate
	make db-seed
	@echo "Ambiente configurado! Acesse http://localhost:4200"

quick-start: ## Início rápido (apenas frontend e backend)
	$(COMPOSE_DEV) up -d frontend backend

# Comandos de troubleshooting
logs-frontend: ## Logs apenas do frontend
	$(COMPOSE_DEV) logs -f frontend

logs-backend: ## Logs apenas do backend
	$(COMPOSE_DEV) logs -f backend

logs-postgres: ## Logs apenas do postgres
	$(COMPOSE_DEV) logs -f postgres

health-check: ## Verifica saúde dos serviços
	@echo "Verificando saúde dos serviços..."
	@curl -f http://localhost:4200 || echo "Frontend não está respondendo"
	@curl -f http://localhost:3000/health || echo "Backend não está respondendo"
	@$(COMPOSE_DEV) exec postgres pg_isready -U kanban_user -d kanban_db || echo "PostgreSQL não está respondendo" 