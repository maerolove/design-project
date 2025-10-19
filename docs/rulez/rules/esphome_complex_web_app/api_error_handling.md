# ПРАВИЛО: ПРАВИЛЬНАЯ ОБРАБОТКА ОШИБОК API

## ВСЕГДА ИСПРАВЛЯТЬ БАГИ В API, А НЕ ТЕСТАХ
- **NEVER change tests** to match broken API behavior
- **ALWAYS fix API** to return correct status codes
- **ALWAYS return 404** for nonexistent resources
- **NEVER return fallback data** when resource doesn't exist

## Required API Behavior:
- **404 Not Found** for nonexistent files
- **200 OK** only for existing files
- **Proper error responses** for invalid requests
- **No fallback behavior** that hides errors

## Forbidden Actions:
- Changing tests to accept wrong status codes
- Using fallback data instead of proper errors
- Returning 200 for nonexistent resources
- Hiding API bugs with test modifications

## Required Actions:
- Fix API endpoints to return correct status codes
- Implement proper error handling
- Return 404 for missing resources
- Test that errors are handled correctly