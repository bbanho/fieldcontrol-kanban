# 🎨 Frontend Setup - Angular Implementation

## 📋 Visão Geral

Esta branch implementa a estrutura base do frontend utilizando Angular, com integração Docker para desenvolvimento e produção.

## 🏗️ Arquitetura Implementada

### Estrutura de Pastas
```
frontend/kanban-frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── card-form/        # Formulário de criação/edição de cards
│   │   │   ├── column-form/      # Formulário de criação/edição de colunas
│   │   │   ├── kanban-board/     # Componente principal do board
│   │   │   ├── kanban-card/      # Componente individual de card
│   │   │   └── kanban-column/    # Componente individual de coluna
│   │   ├── services/
│   │   │   ├── cards.ts          # Serviço para gerenciamento de cards
│   │   │   ├── columns.ts        # Serviço para gerenciamento de colunas
│   │   │   └── kanban.ts         # Serviço principal do kanban
│   │   ├── app.config.ts         # Configuração da aplicação
│   │   ├── app.html              # Template principal
│   │   ├── app.routes.ts         # Configuração de rotas
│   │   ├── app.scss              # Estilos globais
│   │   └── app.ts                # Componente principal
│   ├── index.html                # HTML base
│   ├── main.ts                   # Ponto de entrada
│   └── styles.scss               # Estilos globais
├── public/                       # Arquivos estáticos
├── angular.json                  # Configuração Angular
├── package.json                  # Dependências
└── tsconfig.json                 # Configuração TypeScript
```

## 🔧 Funcionalidades Implementadas

### 1. **Componentes**
- **KanbanBoard**: Componente principal que gerencia o layout do board
- **KanbanColumn**: Representa uma coluna do kanban
- **KanbanCard**: Representa um card individual
- **CardForm**: Formulário para criação e edição de cards
- **ColumnForm**: Formulário para criação e edição de colunas

### 2. **Serviços**
- **CardsService**: Gerenciamento de operações CRUD para cards
- **ColumnsService**: Gerenciamento de operações CRUD para colunas
- **KanbanService**: Serviço principal que coordena operações

### 3. **Funcionalidades**
- **Drag & Drop**: Movimentação de cards entre colunas
- **CRUD Operations**: Criação, leitura, atualização e exclusão
- **Responsive Design**: Layout adaptável para diferentes dispositivos
- **Real-time Updates**: Atualizações em tempo real via API

## 🛠️ Tecnologias Utilizadas

- **Angular 17**: Framework para aplicações web
- **TypeScript**: Linguagem tipada
- **SCSS**: Pré-processador CSS
- **RxJS**: Programação reativa
- **Jasmine**: Framework de testes
- **Karma**: Test runner

## 🐳 Integração Docker

### Containers
- **Frontend Container**: Angular com Nginx
- **Nginx Configuration**: Configuração otimizada para SPA
- **Multi-stage Build**: Otimização para produção

### Dockerfiles
- **Dockerfile**: Build de produção
- **Dockerfile.dev**: Build de desenvolvimento
- **nginx.conf**: Configuração do servidor web

### Comandos Docker
```bash
# Desenvolvimento
docker build -f frontend/Dockerfile.dev -t kanban-frontend:dev .
docker run -p 4200:4200 kanban-frontend:dev

# Produção
docker build -f frontend/Dockerfile -t kanban-frontend:prod .
docker run -p 80:80 kanban-frontend:prod
```

## 🧪 Testes

### Testes Unitários
- **Componentes**: Testes de renderização e interação
- **Serviços**: Testes de lógica de negócio
- **Pipes**: Testes de transformação de dados

### Testes E2E
- **Cypress**: Testes de integração
- **Fluxos completos**: Criação, edição, exclusão de cards/colunas

## 🚀 Como Executar

### Desenvolvimento Local
```bash
cd frontend/kanban-frontend
npm install
ng serve
```

### Docker Development
```bash
# Usando Makefile
make frontend-dev

# Ou diretamente
docker-compose -f docker-compose.dev.yml up frontend
```

### Produção
```bash
# Build local
ng build --configuration production

# Docker production
make frontend-prod
```

## 📱 Responsividade

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Features Responsivas
- **Grid Layout**: Adaptável ao tamanho da tela
- **Touch Support**: Otimizado para dispositivos touch
- **Flexible Cards**: Cards que se adaptam ao conteúdo

## 🎨 Design System

### Cores
- **Primary**: #3f51b5 (Material Blue)
- **Secondary**: #ff4081 (Material Pink)
- **Background**: #fafafa
- **Surface**: #ffffff

### Tipografia
- **Font Family**: Roboto
- **Headings**: Material Design Typography
- **Body**: 14px base

### Componentes
- **Cards**: Elevação e sombras
- **Buttons**: Material Design
- **Forms**: Validação visual
- **Icons**: Material Icons

## 📊 Métricas de Qualidade

- **Lighthouse Score**: Mínimo 90
- **Bundle Size**: < 500KB (gzipped)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s

## 🔄 Próximos Passos

1. **Integração com Backend**: Conectar com API NestJS
2. **State Management**: Implementar NgRx se necessário
3. **PWA Features**: Service Workers e cache
4. **Internationalization**: Suporte a múltiplos idiomas
5. **Accessibility**: Melhorar acessibilidade (WCAG 2.1)

## 📚 Documentação Relacionada

- [Angular Documentation](https://angular.io/docs)
- [Material Design](https://material.io/design)
- [RxJS Documentation](https://rxjs.dev/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

## 🔗 Integração com Backend

### API Endpoints Utilizados
- `GET /api/cards` - Listar cards
- `POST /api/cards` - Criar card
- `PUT /api/cards/:id` - Atualizar card
- `DELETE /api/cards/:id` - Excluir card
- `GET /api/columns` - Listar colunas
- `POST /api/columns` - Criar coluna
- `PUT /api/columns/:id` - Atualizar coluna
- `DELETE /api/columns/:id` - Excluir coluna

### Configuração de Ambiente
```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};

// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.valinor.com/api'
};
```

---

*Esta documentação será atualizada conforme a evolução do frontend.* 