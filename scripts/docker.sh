#!/bin/bash

# Script para gerenciar containers Docker do projeto Kanban
# Uso: ./scripts/docker.sh [comando]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Função para mostrar ajuda
show_help() {
    print_header "Script de Gerenciamento Docker - Kanban"
    echo ""
    echo "Uso: $0 [comando]"
    echo ""
    echo "Comandos disponíveis:"
    echo "  dev         - Iniciar ambiente de desenvolvimento"
    echo "  prod        - Iniciar ambiente de produção"
    echo "  stop        - Parar todos os containers"
    echo "  restart     - Reiniciar todos os containers"
    echo "  logs        - Mostrar logs dos containers"
    echo "  clean       - Limpar containers, volumes e imagens"
    echo "  build       - Fazer build das imagens"
    echo "  status      - Mostrar status dos containers"
    echo "  shell       - Acessar shell do container (frontend|backend|postgres)"
    echo "  help        - Mostrar esta ajuda"
    echo ""
}

# Função para verificar se Docker está rodando
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker não está rodando. Por favor, inicie o Docker e tente novamente."
        exit 1
    fi
}

# Função para iniciar ambiente de desenvolvimento
start_dev() {
    print_header "Iniciando Ambiente de Desenvolvimento"
    check_docker
    
    print_message "Construindo e iniciando containers de desenvolvimento..."
    docker-compose -f docker-compose.dev.yml up --build -d
    
    print_message "Aguardando serviços ficarem prontos..."
    sleep 10
    
    print_message "Verificando status dos containers..."
    docker-compose -f docker-compose.dev.yml ps
    
    print_message "Ambiente de desenvolvimento iniciado!"
    print_message "Frontend: http://localhost:4200"
    print_message "Backend: http://localhost:3000"
    print_message "PostgreSQL: localhost:5432"
    print_message "Redis: localhost:6379"
}

# Função para iniciar ambiente de produção
start_prod() {
    print_header "Iniciando Ambiente de Produção"
    check_docker
    
    print_message "Construindo e iniciando containers de produção..."
    docker-compose up --build -d
    
    print_message "Aguardando serviços ficarem prontos..."
    sleep 15
    
    print_message "Verificando status dos containers..."
    docker-compose ps
    
    print_message "Ambiente de produção iniciado!"
    print_message "Frontend: http://localhost"
    print_message "Backend: http://localhost:3000"
    print_message "PostgreSQL: localhost:5432"
    print_message "Redis: localhost:6379"
}

# Função para parar containers
stop_containers() {
    print_header "Parando Containers"
    check_docker
    
    print_message "Parando containers de desenvolvimento..."
    docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
    
    print_message "Parando containers de produção..."
    docker-compose down 2>/dev/null || true
    
    print_message "Containers parados com sucesso!"
}

# Função para reiniciar containers
restart_containers() {
    print_header "Reiniciando Containers"
    stop_containers
    sleep 2
    start_dev
}

# Função para mostrar logs
show_logs() {
    print_header "Logs dos Containers"
    check_docker
    
    echo "Escolha o serviço para ver os logs:"
    echo "1) Frontend"
    echo "2) Backend"
    echo "3) PostgreSQL"
    echo "4) Redis"
    echo "5) Todos"
    read -p "Digite sua escolha (1-5): " choice
    
    case $choice in
        1)
            docker-compose -f docker-compose.dev.yml logs -f frontend
            ;;
        2)
            docker-compose -f docker-compose.dev.yml logs -f backend
            ;;
        3)
            docker-compose -f docker-compose.dev.yml logs -f postgres
            ;;
        4)
            docker-compose -f docker-compose.dev.yml logs -f redis
            ;;
        5)
            docker-compose -f docker-compose.dev.yml logs -f
            ;;
        *)
            print_error "Opção inválida!"
            exit 1
            ;;
    esac
}

# Função para limpar containers
clean_containers() {
    print_header "Limpando Containers e Volumes"
    check_docker
    
    print_warning "Esta ação irá remover todos os containers, volumes e imagens do projeto!"
    read -p "Tem certeza? (y/N): " confirm
    
    if [[ $confirm =~ ^[Yy]$ ]]; then
        print_message "Parando e removendo containers..."
        docker-compose -f docker-compose.dev.yml down -v 2>/dev/null || true
        docker-compose down -v 2>/dev/null || true
        
        print_message "Removendo imagens..."
        docker rmi kanban-frontend kanban-backend 2>/dev/null || true
        
        print_message "Removendo volumes não utilizados..."
        docker volume prune -f
        
        print_message "Limpeza concluída!"
    else
        print_message "Operação cancelada."
    fi
}

# Função para fazer build
build_images() {
    print_header "Fazendo Build das Imagens"
    check_docker
    
    print_message "Construindo imagens de desenvolvimento..."
    docker-compose -f docker-compose.dev.yml build
    
    print_message "Construindo imagens de produção..."
    docker-compose build
    
    print_message "Build concluído!"
}

# Função para mostrar status
show_status() {
    print_header "Status dos Containers"
    check_docker
    
    print_message "Containers de desenvolvimento:"
    docker-compose -f docker-compose.dev.yml ps
    
    echo ""
    print_message "Containers de produção:"
    docker-compose ps
    
    echo ""
    print_message "Uso de recursos:"
    docker stats --no-stream
}

# Função para acessar shell
access_shell() {
    if [ -z "$1" ]; then
        print_error "Especifique o container (frontend|backend|postgres)"
        exit 1
    fi
    
    print_header "Acessando Shell do Container: $1"
    check_docker
    
    case $1 in
        frontend)
            docker-compose -f docker-compose.dev.yml exec frontend sh
            ;;
        backend)
            docker-compose -f docker-compose.dev.yml exec backend sh
            ;;
        postgres)
            docker-compose -f docker-compose.dev.yml exec postgres psql -U kanban_user -d kanban_db
            ;;
        *)
            print_error "Container inválido! Use: frontend, backend ou postgres"
            exit 1
            ;;
    esac
}

# Main script
case "${1:-help}" in
    dev)
        start_dev
        ;;
    prod)
        start_prod
        ;;
    stop)
        stop_containers
        ;;
    restart)
        restart_containers
        ;;
    logs)
        show_logs
        ;;
    clean)
        clean_containers
        ;;
    build)
        build_images
        ;;
    status)
        show_status
        ;;
    shell)
        access_shell $2
        ;;
    help|*)
        show_help
        ;;
esac 