# 🔗 API Integration - Frontend + Backend

## 📋 Visão Geral

Esta branch implementa a integração completa entre o frontend Angular e o backend NestJS, configurando comunicação HTTP, CORS, proxy e serviços de integração.

## 🏗️ Arquitetura de Integração

### Fluxo de Comunicação
```
Frontend (Angular) ←→ API Gateway ←→ Backend (NestJS)
     ↓                    ↓              ↓
   Port 4200         Port 80/443      Port 3000
```

### Estrutura de Integração
```
├── Frontend Services
│   ├── cards.service.ts      # Comunicação com /api/cards
│   ├── columns.service.ts    # Comunicação com /api/columns
│   └── kanban.service.ts     # Serviço principal
├── Backend Controllers
│   ├── cards.controller.ts   # Endpoints /api/cards
│   └── columns.controller.ts # Endpoints /api/columns
└── Docker Network
    ├── frontend-container    # Angular + Nginx
    ├── backend-container     # NestJS + Node.js
    └── nginx-proxy          # Reverse proxy
```

## 🔧 Configurações Implementadas

### 1. **CORS (Cross-Origin Resource Sharing)**
```typescript
// Backend: main.ts
app.enableCors({
  origin: ['http://localhost:4200', 'http://localhost:80'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
});
```

### 2. **Proxy Configuration (Frontend)**
```json
// angular.json
{
  "serve": {
    "options": {
      "proxyConfig": "src/proxy.conf.json"
    }
  }
}
```

### 3. **Environment Configuration**
```typescript
// Frontend: environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};

// Frontend: environment.prod.ts
export const environment = {
  production: true,
  apiUrl: '/api'  // Relative path for production
};
```

## 🐳 Docker Integration

### Docker Compose Configuration
```yaml
# docker-compose.dev.yml
version: '3.8'
services:
  frontend:
    build:
      context: .
      dockerfile: frontend/Dockerfile.dev
    ports:
      - "4200:4200"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    depends_on:
      - backend

  backend:
    build:
      context: .
      dockerfile: backend/Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - ./backend:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:pass@db:5432/kanban
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: kanban
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./docker/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

### Network Configuration
```yaml
# Docker network para comunicação entre containers
networks:
  default:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

## 📡 API Endpoints

### Cards API
```typescript
// GET /api/cards
interface Card {
  id: number;
  title: string;
  description: string;
  columnId: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// POST /api/cards
interface CreateCardDto {
  title: string;
  description: string;
  columnId: number;
}

// PUT /api/cards/:id
interface UpdateCardDto {
  title?: string;
  description?: string;
  columnId?: number;
  order?: number;
}
```

### Columns API
```typescript
// GET /api/columns
interface Column {
  id: number;
  name: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// POST /api/columns
interface CreateColumnDto {
  name: string;
}

// PUT /api/columns/:id
interface UpdateColumnDto {
  name?: string;
  order?: number;
}
```

## 🔄 Services Implementation

### Frontend Services
```typescript
// cards.service.ts
@Injectable({
  providedIn: 'root'
})
export class CardsService {
  private apiUrl = environment.apiUrl + '/cards';

  constructor(private http: HttpClient) {}

  getCards(): Observable<Card[]> {
    return this.http.get<Card[]>(this.apiUrl);
  }

  createCard(card: CreateCardDto): Observable<Card> {
    return this.http.post<Card>(this.apiUrl, card);
  }

  updateCard(id: number, card: UpdateCardDto): Observable<Card> {
    return this.http.put<Card>(`${this.apiUrl}/${id}`, card);
  }

  deleteCard(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

### Backend Controllers
```typescript
// cards.controller.ts
@Controller('api/cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get()
  findAll(): Promise<Card[]> {
    return this.cardsService.findAll();
  }

  @Post()
  create(@Body() createCardDto: CreateCardDto): Promise<Card> {
    return this.cardsService.create(createCardDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto): Promise<Card> {
    return this.cardsService.update(+id, updateCardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.cardsService.remove(+id);
  }
}
```

## 🧪 Testing Integration

### Frontend Tests
```typescript
// cards.service.spec.ts
describe('CardsService', () => {
  let service: CardsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CardsService]
    });
    service = TestBed.inject(CardsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create a card', () => {
    const card: CreateCardDto = { title: 'Test', description: 'Test', columnId: 1 };
    
    service.createCard(card).subscribe(response => {
      expect(response.title).toBe('Test');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/cards`);
    expect(req.request.method).toBe('POST');
    req.flush({ id: 1, ...card });
  });
});
```

### Backend Tests
```typescript
// cards.controller.spec.ts
describe('CardsController', () => {
  let controller: CardsController;
  let service: CardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardsController],
      providers: [CardsService],
    }).compile();

    controller = module.get<CardsController>(CardsController);
    service = module.get<CardsService>(CardsService);
  });

  it('should create a card', async () => {
    const createCardDto = { title: 'Test', description: 'Test', columnId: 1 };
    const expectedResult = { id: 1, ...createCardDto };
    
    jest.spyOn(service, 'create').mockResolvedValue(expectedResult);
    
    expect(await controller.create(createCardDto)).toBe(expectedResult);
  });
});
```

## 🚀 Como Executar

### Desenvolvimento Local
```bash
# Terminal 1: Backend
cd backend/kanban-backend
npm install
npm run start:dev

# Terminal 2: Frontend
cd frontend/kanban-frontend
npm install
ng serve
```

### Docker Development
```bash
# Iniciar todos os serviços
make dev-up

# Ou individualmente
docker-compose -f docker-compose.dev.yml up backend
docker-compose -f docker-compose.dev.yml up frontend
```

### Produção
```bash
# Build e deploy completo
make prod-up

# Verificar logs
make logs
```

## 📊 Monitoramento

### Health Checks
```typescript
// Backend health endpoint
@Get('health')
getHealth(): { status: string; timestamp: string } {
  return {
    status: 'ok',
    timestamp: new Date().toISOString()
  };
}
```

### Logging
```typescript
// Frontend logging
console.log('API Request:', { url, method, data });
console.log('API Response:', response);

// Backend logging
@UseInterceptors(LoggingInterceptor)
export class CardsController {
  // Logs automáticos de requests/responses
}
```

## 🔒 Segurança

### CORS Configuration
- **Origins permitidas**: Apenas domínios específicos
- **Métodos**: GET, POST, PUT, DELETE
- **Headers**: Content-Type, Authorization
- **Credentials**: Habilitado para sessões

### Rate Limiting
```typescript
// Backend rate limiting
@UseGuards(ThrottlerGuard)
@Throttle(10, 60) // 10 requests por minuto
export class CardsController {
  // Endpoints protegidos
}
```

## 📈 Performance

### Caching
```typescript
// Frontend caching
@Injectable()
export class CacheService {
  private cache = new Map<string, any>();

  get<T>(key: string): T | null {
    return this.cache.get(key);
  }

  set<T>(key: string, value: T): void {
    this.cache.set(key, value);
  }
}
```

### Compression
```typescript
// Backend compression
app.use(compression()); // Gzip compression
```

## 🔄 Próximos Passos

1. **Error Handling**: Implementar tratamento de erros robusto
2. **Loading States**: Estados de carregamento no frontend
3. **Optimistic Updates**: Atualizações otimistas
4. **WebSocket**: Comunicação em tempo real
5. **Authentication**: Sistema de autenticação
6. **Authorization**: Controle de acesso baseado em roles

## 📚 Documentação Relacionada

- [Angular HTTP Client](https://angular.io/guide/http)
- [NestJS Controllers](https://docs.nestjs.com/controllers)
- [Docker Networking](https://docs.docker.com/network/)
- [CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

*Esta documentação será atualizada conforme a evolução da integração.* 