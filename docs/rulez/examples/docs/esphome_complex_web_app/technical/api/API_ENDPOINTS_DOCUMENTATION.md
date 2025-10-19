# API Endpoints Documentation

## Бэкенд сервер
**URL:** `https://api.kolkhoz.io` (БЕЗ `/api` префикса!)

## Основные endpoints

### 1. Валидация конфигурации
```
POST /validate
```
- **Описание:** Валидация YAML конфигурации ESPHome
- **Параметры:** `file_name` (UUID), `yaml_text` (конфигурация)
- **Пример:** `POST https://api.kolkhoz.io/validate`

### 2. Компиляция конфигурации
```
POST /compile/
POST /compile/{file_name}
```
- **Описание:** Компиляция ESPHome конфигурации
- **Параметры:** `file_name` (UUID), `yaml_text` (конфигурация)
- **Пример:** `POST https://api.kolkhoz.io/compile/abc123-def456-ghi789`

### 3. Статус компиляции
```
GET /status/{file_name}
```
- **Описание:** Проверка статуса компиляции
- **Параметры:** `file_name` (UUID)
- **Пример:** `GET https://api.kolkhoz.io/status/abc123-def456-ghi789`

### 4. Скачивание бинарного файла
```
POST /download/{file_name}
```
- **Описание:** Скачивание скомпилированного .bin файла
- **Параметры:** `file_name` (UUID)
- **Пример:** `POST https://api.kolkhoz.io/download/abc123-def456-ghi789`

### 5. Скачивание OTA файла
```
POST /download-ota/{file_name}
```
- **Описание:** Скачивание OTA файла для обновления по воздуху
- **Параметры:** `file_name` (UUID)
- **Пример:** `POST https://api.kolkhoz.io/download-ota/abc123-def456-ghi789`

### 6. Health Check
```
GET /health
```
- **Описание:** Проверка состояния сервера
- **Пример:** `GET https://api.kolkhoz.io/health`

## Исправление в api.js

Нужно исправить `baseURL` в файле `/home/app/src/src/services/api.js`:

```javascript
// БЫЛО (неправильно):
this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8042';

// ДОЛЖНО БЫТЬ:
this.baseURL = process.env.REACT_APP_API_URL || 'https://api.kolkhoz.io';
```

И убрать `/api` префикс из всех endpoints:

```javascript
// БЫЛО (неправильно):
async validateConfig(fileId, yamlContent, headers = {}) {
  return this.post(`/api/validate/${fileId}`, { yaml: yamlContent }, { headers });
}

// ДОЛЖНО БЫТЬ:
async validateConfig(fileId, yamlContent, headers = {}) {
  return this.post(`/validate`, { yaml: yamlContent }, { headers });
}
```

## Важно!
- ❌ НЕ используйте `/api` префикс
- ✅ Используйте прямые endpoints: `/validate`, `/compile`, `/status`, `/download`
- ✅ Бэкенд: `https://api.kolkhoz.io`