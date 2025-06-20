# Histórico de Correções e Decisões Técnicas

## 20/06/2025

### 1. Integração Docker e Contexto de Build
- Corrigido o contexto de build dos Dockerfiles do backend e frontend para garantir que os arquivos `package.json` e código-fonte estejam acessíveis durante o build.
- Movidos os Dockerfiles para os diretórios corretos (`backend/kanban-backend/` e `frontend/kanban-frontend/`).
- Atualizada a imagem base do Node.js no frontend para `node:20-alpine` devido à exigência do Angular CLI >= v20.19.

### 2. Dependências entre Módulos NestJS
- Adicionado `TypeOrmModule.forRoot` no `AppModule` para garantir o contexto global do TypeORM e o DataSource.
- Adicionados `TypeOrmModule.forFeature([Card])` e `TypeOrmModule.forFeature([Column])` nos módulos correspondentes para injeção dos repositórios.
- Importado e exportado explicitamente o `ColumnsService` no `ColumnsModule` para permitir injeção no `CardsService`.
- Importado o `ColumnsModule` no `CardsModule` para resolver dependência cruzada.

### 3. Docker Compose
- Ajustado o `docker-compose.dev.yml` para refletir os novos caminhos dos Dockerfiles e volumes.
- Validado que arquivos temporários, de build e logs estão corretamente ignorados pelo `.gitignore`.

### 4. Boas Práticas e Aprendizados
- Sempre garantir que todos os serviços e repositórios usados em um módulo estejam devidamente importados e exportados.
- Validar contexto de build dos Dockerfiles para evitar erros de ENOENT.
- Manter documentação de decisões e correções para facilitar troubleshooting futuro.

---

Este documento deve ser atualizado a cada nova decisão ou correção relevante no projeto. 