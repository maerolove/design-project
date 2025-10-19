# ESPHome YAML Constructor - Architecture Overview

## System Architecture

The ESPHome YAML Constructor is a modern web application built with a microservices architecture, providing ESPHome configuration management, compilation, and device emulation capabilities.

## Technology Stack

### Frontend
- **React 18**: Modern UI framework with hooks and functional components
- **Chakra UI**: Component library for consistent design system
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing with UUID-based navigation
- **YAML.js**: YAML parsing and validation
- **Playwright**: End-to-end testing framework

### Backend
- **FastAPI**: Modern Python web framework with automatic API documentation
- **SQLAlchemy**: ORM with async support for database operations
- **Alembic**: Database migration management
- **Pydantic**: Data validation and serialization
- **Docker**: Containerization for ESPHome compilation with host Docker access
- **ESPHome**: ESPHome 2025.5.2 for firmware compilation with caching
- **QEMU**: Hardware emulation for ESP32/ESP8266 devices

### Database
- **PostgreSQL**: Primary database for production
- **SQLite**: Development and testing database
- **Redis**: Caching and session storage (optional)

### Infrastructure
- **Docker Compose**: Multi-container orchestration
- **Nginx**: Reverse proxy and static file serving
- **Systemd**: Service management for production deployment

## ESPHome Compilation Architecture

### Docker Integration
The application uses a sophisticated Docker integration for ESPHome compilation:

```
┌─────────────────────────────────────┐
│           Backend Container         │
│  (FastAPI + Python Services)        │
├─────────────────────────────────────┤
│           Host Docker Daemon        │
│  (Access via /var/run/docker.sock)  │
├─────────────────────────────────────┤
│           ESPHome Container         │
│  (esphome/esphome:2025.5.2)         │
└─────────────────────────────────────┘
```

### Volume Mounts
- **Config Files**: `./uploaded_files/` → `/config` (ESPHome container)
- **Build Output**: `./compile/` → `/build` (ESPHome container)  
- **Cache**: `./cache/esphome_cache/` → `/cache` (ESPHome container)

### Compilation Flow
1. **Config Upload**: YAML config saved to `uploaded_files/user-id/config-name/`
2. **Docker Execution**: ESPHome container runs with mounted volumes
3. **Compilation**: ESPHome compiles firmware with caching
4. **Output**: Compiled firmware saved to `compile/device-name/`
5. **Cache**: Build artifacts cached in `compile/device-name/.pioenvs/`

### Key Features
- **Host Docker Access**: Backend accesses host Docker daemon (no nested Docker)
- **Path Resolution**: Automatic conversion of container paths to host paths
- **Caching**: ESPHome creates persistent cache for faster subsequent compilations
- **Timeouts**: Reasonable timeouts (120s for ESPHome, 180s for tests)
- **Logging**: Comprehensive logging of ESPHome compilation output

## Architecture Patterns

### 1. Layered Architecture

```
┌─────────────────────────────────────┐
│           Presentation Layer        │
│  (React Components, Chakra UI)     │
├─────────────────────────────────────┤
│           Service Layer             │
│  (API Services, State Management)  │
├─────────────────────────────────────┤
│           Business Layer            │
│  (ESPHome Service, Storage Service)│
├─────────────────────────────────────┤
│           Data Layer                │
│  (Database, File System, Cache)    │
└─────────────────────────────────────┘
```

### 2. State Machine Pattern

The application implements a comprehensive state machine with multiple parallel flows:

- **Main Flow**: Configuration editing, validation, compilation, download
- **QEMU Flow**: Device emulation and testing
- **Template Flow**: Template browsing and selection
- **Social Flow**: Configuration sharing and collaboration
- **Analytics Flow**: Usage tracking and statistics

### 3. Service-Oriented Architecture

Each major functionality is encapsulated in dedicated services:

- **ESPHomeService**: Configuration compilation and validation
- **StorageService**: File system operations and cleanup
- **CacheService**: Multi-level caching strategy
- **QEMUEmulatorService**: Device emulation management
- **TemplateService**: Template management and search
- **SocialService**: Sharing and collaboration features
- **AnalyticsService**: Usage tracking and metrics

### 4. Repository Pattern

Data access is abstracted through repository interfaces:

```python
class BaseService(Generic[T]):
    async def create(self, obj: CreateModel) -> T
    async def get(self, id: str) -> Optional[T]
    async def update(self, id: str, obj: UpdateModel) -> T
    async def delete(self, id: str) -> bool
    async def list(self, filters: Dict) -> List[T]
```

## Component Architecture

### Frontend Components

#### Core Components
- **App**: Main application container with routing and state management
- **LeftPanel**: YAML editor and control buttons
- **RightPanel**: Logs, favorites, and revision history
- **TemplateCatalog**: Template browsing and selection
- **StateIndicators**: Real-time state visualization
- **ErrorBoundary**: Error handling and recovery

#### Hooks
- **useButtonStates**: Button state management
- **useConfigStorage**: Configuration persistence
- **useFavorites**: Favorite configurations management
- **useRevisionHistory**: Version control for configurations
- **useRetry**: API retry logic with exponential backoff

#### Services
- **ApiService**: HTTP client with retry logic and error handling
- **StateMachine**: Shared state definitions and utilities

### Backend Services

#### Core Services
- **ESPHomeService**: ESPHome compilation and validation
- **StorageService**: File system operations and cleanup
- **CacheService**: Multi-level caching strategy
- **QEMUEmulatorService**: Device emulation management

#### Business Services
- **TemplateService**: Template management and search
- **SocialService**: Sharing and collaboration
- **AnalyticsService**: Usage tracking and metrics
- **ConfigService**: Configuration management

#### Infrastructure Services
- **DockerManager**: Container orchestration
- **DatabaseManager**: Database connection management
- **SessionManager**: User session handling

## Data Flow

### 1. Configuration Compilation Flow

```
User Input → Validation → Storage → Compilation → Binary Generation → Download
     ↓           ↓          ↓          ↓              ↓              ↓
  YAML Text → ESPHome → File System → Docker → Binary Files → User Download
```

### 2. State Management Flow

```
User Action → State Transition → UI Update → API Call → Backend Processing
     ↓              ↓              ↓           ↓              ↓
  Button Click → State Machine → Component → HTTP Request → Service Layer
```

### 3. Caching Strategy

```
Request → Cache Check → Cache Hit/Miss → Service Processing → Cache Update
    ↓          ↓            ↓                ↓                  ↓
  API Call → Redis/File → Return/Process → Business Logic → Store Result
```

## Security Architecture

### 1. Authentication & Authorization
- **Session-based Authentication**: Secure session cookies
- **UUID-based Access Control**: File isolation through unique identifiers
- **Rate Limiting**: Per-user request limits
- **CORS Configuration**: Cross-origin request security

### 2. Data Protection
- **Input Validation**: YAML syntax and content validation
- **File Access Control**: UUID-based file isolation
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Content sanitization

### 3. Infrastructure Security
- **Container Isolation**: Docker-based service isolation
- **Network Security**: Internal service communication
- **File System Security**: Restricted file access
- **Logging & Monitoring**: Security event tracking

## Performance Optimization

### 1. Frontend Optimization
- **Code Splitting**: Lazy loading of components
- **Memoization**: React.memo and useMemo for expensive operations
- **Virtual Scrolling**: Large list performance
- **Bundle Optimization**: Tree shaking and minification

### 2. Backend Optimization
- **Database Indexing**: Optimized query performance
- **Connection Pooling**: Efficient database connections
- **Async Processing**: Non-blocking I/O operations
- **Caching Strategy**: Multi-level caching implementation

### 3. Infrastructure Optimization
- **Container Optimization**: Minimal base images
- **Resource Limits**: CPU and memory constraints
- **Load Balancing**: Horizontal scaling capability
- **CDN Integration**: Static asset delivery

## Deployment Architecture

### Development Environment
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Vite Dev)    │◄──►│   (FastAPI)     │◄──►│   (SQLite)      │
│   Port: 3000    │    │   Port: 8042    │    │   File-based    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Production Environment
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx         │    │   FastAPI       │    │   PostgreSQL    │
│   (Reverse      │◄──►│   (Backend)     │◄──►│   (Database)    │
│    Proxy)       │    │   (Docker)      │    │   (Docker)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Static Files  │    │   ESPHome       │    │   Redis         │
│   (Build)       │    │   (Compiler)    │    │   (Cache)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Monitoring & Observability

### 1. Logging
- **Structured Logging**: JSON-formatted log entries
- **Log Levels**: DEBUG, INFO, WARNING, ERROR, CRITICAL
- **Log Aggregation**: Centralized log collection
- **Log Rotation**: Automatic log file management

### 2. Metrics
- **Application Metrics**: Request rates, response times, error rates
- **Business Metrics**: Compilation success rates, user activity
- **Infrastructure Metrics**: CPU, memory, disk usage
- **Custom Metrics**: ESPHome compilation statistics

### 3. Health Checks
- **API Health**: `/health` endpoint monitoring
- **Database Health**: Connection and query performance
- **Service Health**: Individual service status
- **Dependency Health**: External service availability

## Scalability Considerations

### 1. Horizontal Scaling
- **Stateless Services**: No server-side session storage
- **Load Balancing**: Multiple backend instances
- **Database Scaling**: Read replicas and connection pooling
- **Cache Scaling**: Redis cluster support

### 2. Vertical Scaling
- **Resource Optimization**: Efficient memory and CPU usage
- **Async Processing**: Non-blocking I/O operations
- **Connection Pooling**: Database connection management
- **Caching Strategy**: Reduced database load

### 3. Performance Monitoring
- **Response Time Tracking**: API endpoint performance
- **Throughput Monitoring**: Requests per second
- **Error Rate Tracking**: Failure rate monitoring
- **Resource Utilization**: CPU, memory, disk usage

## Future Architecture Considerations

### 1. Microservices Evolution
- **Service Decomposition**: Further service separation
- **API Gateway**: Centralized API management
- **Service Mesh**: Inter-service communication
- **Event-Driven Architecture**: Asynchronous communication

### 2. Cloud-Native Features
- **Kubernetes Deployment**: Container orchestration
- **Service Discovery**: Dynamic service location
- **Config Management**: External configuration
- **Secrets Management**: Secure credential storage

### 3. Advanced Caching
- **Distributed Caching**: Multi-node cache clusters
- **Cache Invalidation**: Smart cache management
- **CDN Integration**: Global content delivery
- **Edge Computing**: Reduced latency

This architecture provides a solid foundation for the ESPHome YAML Constructor while maintaining flexibility for future enhancements and scalability requirements.
