# ПРАВИЛО: ЕДИНАЯ ЦЕПОЧКА ТЕСТОВ

## ВСЕ ТЕСТЫ ДОЛЖНЫ ИСПОЛЬЗОВАТЬ ОДНУ И ТУ ЖЕ СВЯЗЬ/КОНФИГ
- **NEVER create separate configs** for each test
- **ALWAYS use shared test state** across all tests
- **ALWAYS follow the chain**: validate → compile → download
- **NEVER duplicate configuration** across test files

## Required Test Chain:
1. **test_validate** - validates configuration
2. **test_compile** - compiles validated configuration  
3. **test_download** - downloads compiled binary

## Shared State Requirements:
- **Single config** used by all tests
- **Single file_id** used by all tests
- **Session-scoped fixtures** to maintain state
- **Chain dependencies** - each test depends on previous

## Forbidden Actions:
- Creating separate configs for each test
- Duplicating configuration code
- Using different file_ids across tests
- Not following the validate→compile→download chain

## Required Implementation:
- Global test state dictionary
- Session-scoped fixtures
- Chain dependencies between tests
- Shared configuration functions
- Single source of truth for test data

## Exception:
- Only create separate configs for different platforms (ESP32 vs ESP8266)
- Always use shared state within same platform tests