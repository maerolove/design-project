# ESPHome YAML Constructor - API Documentation

## Overview

The ESPHome YAML Constructor provides a RESTful API for ESPHome configuration management, compilation, and device emulation. All endpoints return the current application state in the `X-Current-State` header.

## Base URL

```
http://localhost:8042
```

## ESPHome Version Management

The application uses a fixed ESPHome version (2025.5.2) to ensure consistent behavior across all operations. This version is defined in `py/constants.py` and used throughout the application:

- **Default Version**: 2025.5.2
- **Docker Image**: `esphome/esphome:2025.5.2`
- **Supported Versions**: 2025.5.2, 2025.5.1, 2025.4.0, latest

You can override the ESPHome version using the `X-ESPHome-Version` header in API requests, but the default version ensures deterministic test results and consistent compilation behavior.

## ESPHome Compilation

### Docker Integration
The compilation system uses host Docker access (not nested Docker) for optimal performance:

- **Backend Container**: Accesses host Docker daemon via `/var/run/docker.sock`
- **ESPHome Container**: Runs `esphome/esphome:2025.5.2` with mounted volumes
- **Volume Mounts**: 
  - Config files: `./uploaded_files/` → `/config`
  - Build output: `./compile/` → `/build`
  - Cache: `./cache/esphome_cache/` → `/cache`

### Compilation Process
1. **Config Upload**: YAML configuration saved to user directory
2. **Docker Execution**: ESPHome container runs with proper volume mounts
3. **Compilation**: ESPHome compiles firmware with caching enabled
4. **Output**: Compiled firmware saved to `compile/device-name/`
5. **Cache**: Build artifacts cached in `compile/device-name/.pioenvs/`

### Performance Features
- **Caching**: ESPHome creates persistent cache for faster subsequent compilations
- **Timeouts**: Reasonable timeouts (120s for ESPHome, 180s for tests)
- **Logging**: Comprehensive logging of ESPHome compilation output
- **Path Resolution**: Automatic conversion of container paths to host paths

## Authentication

The API uses session-based authentication. All requests require a valid session cookie obtained from the `/health` endpoint.

## State Machine

The application uses a comprehensive XML-based state machine with the following main flows:

- **MAIN**: Configuration editing, validation, compilation, and download
- **QEMU**: Device emulation and testing
- **TEMPLATE**: Template browsing and selection
- **SOCIAL**: Configuration sharing and collaboration
- **FAVORITE**: Favorite configurations management
- **SHARE**: Configuration sharing functionality
- **SYSTEM**: System operations and error handling

### State Machine Architecture (v2.0.1)

The state machine uses XML-based configuration with improved parser compatibility:

#### Parser Components
- **StateMachineXMLParser**: Frontend XML parser with `get_machine_info` method
- **StateMachineParser**: Backend parser for state machine operations
- **StateMachineXMLAsyncLoader**: Asynchronous XML data loader

#### Key Improvements
- **Parser Compatibility**: Unified interface between frontend and backend parsers
- **Enhanced XML Parsing**: Proper extraction of `name`, `description`, and `type` attributes
- **Structured State Data**: States contain both `value` and `type` properties
- **Automatic Initial State Detection**: Finds initial state from XML configuration

## Endpoints

### Health Check

#### GET /health

Check API health and obtain session cookie.

**Response:**
```json
{
  "status": "healthy",
  "version": "1.6.0",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**Headers:**
- `X-Current-State`: Current application state

---

### Configuration Validation

#### POST /validate

Validate ESPHome YAML configuration.

**Request Body:**
```json
{
  "yaml_text": "esphome:\n  name: test-device\n  platform: ESP32"
}
```

**Headers:**
- `Content-Type`: application/json
- `X-ESPHome-Version`: (optional) ESPHome version (default: 2025.5.2)
- `X-Debug-Mode`: (optional) Enable debug mode

**Response:**
```json
{
  "valid": true,
  "errors": [],
  "warnings": []
}
```

**Headers:**
- `X-Current-State`: `valid` or `invalid`

**Error Responses:**
- `400 Bad Request`: Invalid YAML syntax
- `422 Unprocessable Entity`: Invalid request format
- `500 Internal Server Error`: Validation failed

---

### Configuration Compilation

#### POST /compile/{file_id}

Compile ESPHome configuration to binary.

**Request Body:**
```json
{
  "yaml_text": "esphome:\n  name: test-device\n  platform: ESP32"
}
```

**Headers:**
- `Content-Type`: application/json
- `X-ESPHome-Version`: (optional) ESPHome version (default: 2025.5.2)
- `X-Debug-Mode`: (optional) Enable debug mode

**Response:**
- **Content-Type**: `text/plain`
- **Body**: Streaming compilation logs

**Headers:**
- `X-File-Uuid`: Generated file UUID
- `X-Current-State`: `compiling`

**Error Responses:**
- `400 Bad Request`: Invalid configuration
- `422 Unprocessable Entity`: Invalid request format
- `500 Internal Server Error`: Compilation failed

---

### Binary Download

#### POST /download/{file_id}

Download compiled factory binary.

**Response:**
- **Content-Type**: `application/octet-stream`
- **Body**: Binary file data

**Headers:**
- `Content-Disposition`: `attachment; filename="device-name.bin"`
- `X-Current-State`: `downloading`

**Error Responses:**
- `404 Not Found`: Configuration not found or not compiled
- `500 Internal Server Error`: Download failed

---

### OTA Binary Download

#### POST /download-ota/{file_id}

Download compiled OTA binary.

**Response:**
- **Content-Type**: `application/octet-stream`
- **Body**: OTA binary file data

**Headers:**
- `Content-Disposition`: `attachment; filename="device-name.ota.bin"`
- `X-Current-State`: `downloading_ota`

**Error Responses:**
- `404 Not Found`: Configuration not found or not compiled
- `500 Internal Server Error`: Download failed

---

### Compilation Status

#### GET /status/{file_id}

Get compilation status and binary information.

**Response:**
```json
{
  "status": "completed",
  "binary_exists": true,
  "ota_binary_exists": true,
  "binary_path": "/path/to/firmware.bin",
  "ota_binary_path": "/path/to/firmware.ota.bin",
  "name": "device-name",
  "platform": "ESP32"
}
```

**Headers:**
- `X-Current-State`: Current compilation state

---

### QEMU Emulation

#### POST /qemu/start/{file_id}

Start QEMU emulation for compiled configuration.

**Request Body:**
```json
{
  "config_id": "file-uuid",
  "emulation_options": {
    "memory": "4M",
    "cpu": "esp32"
  }
}
```

**Response:**
```json
{
  "session_id": "emulation-session-uuid",
  "status": "starting",
  "serial_port": "/dev/ttyUSB0",
  "web_interface": "http://localhost:8080"
}
```

**Headers:**
- `X-Current-State`: `qemu_starting`

#### POST /qemu/stop/{session_id}

Stop QEMU emulation session.

**Response:**
```json
{
  "session_id": "emulation-session-uuid",
  "status": "stopped"
}
```

**Headers:**
- `X-Current-State`: `qemu_stopping`

#### GET /qemu/sessions

List active QEMU sessions.

**Response:**
```json
{
  "sessions": [
    {
      "session_id": "session-uuid",
      "config_id": "file-uuid",
      "status": "running",
      "started_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Headers:**
- `X-Current-State`: `qemu_sessions_loaded`

---

### Template Management

#### GET /templates

Browse available device templates.

**Query Parameters:**
- `category`: Filter by category
- `platform`: Filter by platform (ESP32, ESP8266)
- `search`: Search term
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

**Response:**
```json
{
  "templates": [
    {
      "id": "template-uuid",
      "name": "Smart Switch",
      "description": "WiFi smart switch with relay",
      "category": "switches",
      "platform": "ESP32",
      "rating": 4.5,
      "downloads": 1234
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

**Headers:**
- `X-Current-State`: `template_browsing`

#### GET /templates/{template_id}

Get template details and YAML content.

**Response:**
```json
{
  "id": "template-uuid",
  "name": "Smart Switch",
  "description": "WiFi smart switch with relay",
  "yaml_content": "esphome:\n  name: smart-switch\n  platform: ESP32",
  "category": "switches",
  "platform": "ESP32",
  "rating": 4.5,
  "downloads": 1234,
  "author": "user123",
  "created_at": "2024-01-01T00:00:00Z"
}
```

**Headers:**
- `X-Current-State`: `template_selected`

---

### Configuration Sharing

#### POST /share

Share configuration with public link.

**Request Body:**
```json
{
  "config_id": "file-uuid",
  "title": "My Smart Device",
  "description": "Custom ESP32 configuration",
  "is_public": true
}
```

**Response:**
```json
{
  "share_id": "share-uuid",
  "public_url": "https://esphome-constructor.com/share/share-uuid",
  "expires_at": "2024-12-31T23:59:59Z"
}
```

**Headers:**
- `X-Current-State`: `sharing`

#### GET /share/{share_id}

Get shared configuration.

**Response:**
```json
{
  "share_id": "share-uuid",
  "title": "My Smart Device",
  "description": "Custom ESP32 configuration",
  "yaml_content": "esphome:\n  name: smart-device",
  "author": "user123",
  "created_at": "2024-01-01T00:00:00Z",
  "downloads": 42
}
```

**Headers:**
- `X-Current-State`: `shared`

---

## State Machine Reference

### Main Flow States

| State | Description | CSS Class | Button Class |
|-------|-------------|-----------|--------------|
| `initial` | Application startup | `state-initial` | - |
| `editing` | Configuration editing | `state-editing` | - |
| `validating` | Configuration validation | `state-validating` | `button-state-validating` |
| `valid` | Configuration is valid | `state-valid` | `button-state-valid` |
| `invalid` | Configuration has errors | `state-invalid` | `button-state-invalid` |
| `compiling` | Compilation in progress | `state-compiling` | `button-state-compiling` |
| `compiled` | Compilation completed | `state-compiled` | `button-state-compiled` |
| `downloading` | Binary download | `state-downloading` | `button-state-downloading` |
| `downloaded` | Download completed | `state-downloaded` | `button-state-downloaded` |

### QEMU Flow States

| State | Description | CSS Class | Button Class |
|-------|-------------|-----------|--------------|
| `qemu_starting` | Starting emulation | `state-qemu-starting` | `button-state-qemu-starting` |
| `qemu_running` | Emulation active | `state-qemu-running` | `button-state-qemu-running` |
| `qemu_stopping` | Stopping emulation | `state-qemu-stopping` | `button-state-qemu-stopping` |
| `qemu_stopped` | Emulation stopped | `state-qemu-stopped` | `button-state-qemu-stopped` |
| `qemu_failed` | Emulation failed | `state-qemu-failed` | `button-state-qemu-failed` |

### System States

| State | Description | CSS Class | Button Class |
|-------|-------------|-----------|--------------|
| `auto_saving` | Auto-saving configuration | `auto-saving` | `button-state-auto-saving` |
| `session_timeout` | Session expired | `session-timeout` | `button-state-session-timeout` |
| `error` | General error | `state-error` | `button-state-error` |
| `recovery_options` | Recovery mode | `state-recovery-options` | `button-state-recovery-options` |
| `idle` | Application idle | `state-idle` | `button-state-idle` |

## Error Handling

### Retry Logic

The API implements automatic retry logic with exponential backoff:

- **Max Retries**: 3 attempts
- **Base Delay**: 1 second
- **Max Delay**: 10 seconds
- **Retryable Errors**: 5xx server errors, 408 timeout, 429 rate limit
- **Non-retryable Errors**: 4xx client errors (except 408, 429)

### Error Response Format

```json
{
  "error": "Error message",
  "details": "Detailed error information",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Rate Limiting

- **Compilation**: 5 requests per minute per user
- **Download**: 10 requests per minute per user
- **Validation**: 20 requests per minute per user
- **QEMU**: 2 sessions per user

## WebSocket Support

Real-time updates are available via WebSocket connections:

```
ws://localhost:8042/ws/{file_id}
```

**Message Types:**
- `compilation_progress`: Compilation status updates
- `validation_result`: Validation results
- `qemu_status`: QEMU emulation status
- `error`: Error notifications

## Caching

The API implements multi-level caching:

- **Configuration Cache**: YAML content hashing
- **Binary Cache**: Compiled firmware caching
- **Template Cache**: Template metadata caching
- **Session Cache**: User session data

Cache TTL:
- **Configurations**: 1 hour
- **Binaries**: 24 hours
- **Templates**: 1 hour
- **Sessions**: 30 minutes

## State Machine Parser API (v2.0.1)

### Frontend Parser Methods

#### `get_machine_info(type: string)`
Get machine information including states, transitions, and metadata.

**Parameters:**
- `type`: Machine type (e.g., "main", "qemu", "template")

**Returns:**
```typescript
{
  type: string,
  name: string,
  description: string,
  initialState: string,
  states: Record<string, { value: string, type: string }>,
  transitions: Record<string, TransitionInfo>,
  stateTransitions: Record<string, string[]>,
  data: any
}
```

**Example:**
```typescript
const parser = new StateMachineXMLParser(xmlData);
const machineInfo = parser.get_machine_info('main');
console.log(machineInfo.initialState); // "INITIAL"
console.log(machineInfo.states.INITIAL.type); // "initial"
```

#### `getStateValue(machineType: string, stateName: string)`
Get the value of a specific state.

**Parameters:**
- `machineType`: Type of machine
- `stateName`: Name of the state

**Returns:** `string | null`

#### `getTransitionValue(machineType: string, transitionName: string)`
Get the value of a specific transition.

**Parameters:**
- `machineType`: Type of machine
- `transitionName`: Name of the transition

**Returns:** `TransitionInfo | null`

### Parser Compatibility

The frontend `StateMachineXMLParser` now provides full compatibility with the backend `StateMachineParser`:

- **Unified Interface**: Both parsers implement the same methods
- **Consistent Data Structure**: Same data format across frontend and backend
- **Error Handling**: Consistent error handling and logging
- **Type Safety**: Full TypeScript support for all parser methods

### XML Structure Requirements

For proper parsing, XML must follow this structure:

```xml
<machine type="main" name="Main Configuration Flow" description="Core configuration flow">
  <states>
    <state name="INITIAL" value="initial" type="initial"/>
    <state name="EDITING" value="editing" type="process"/>
    <state name="VALIDATING" value="validating" type="active"/>
    <state name="VALID" value="valid" type="success"/>
    <state name="INVALID" value="invalid" type="error"/>
  </states>
  <transitions>
    <transition name="EDIT_YAML" value="edit_yaml" type="action"/>
    <transition name="VALIDATE" value="validate" type="action"/>
  </transitions>
</machine>
```

## Security

- **Session-based Authentication**: Secure session cookies
- **CORS**: Configured for frontend domain
- **Rate Limiting**: Per-user request limits
- **Input Validation**: YAML syntax and content validation
- **File Access Control**: UUID-based file isolation
- **XML Validation**: XSD schema validation for state machine configuration
