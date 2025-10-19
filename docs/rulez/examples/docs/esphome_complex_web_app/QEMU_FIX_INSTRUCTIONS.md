# Инструкция по восстановлению QEMU функциональности

## 🔥 Что было потеряно при git fetch/pull

При выполнении `git fetch origin` и `git pull --rebase` удаленный репозиторий перезаписал всю локальную историю, потеряв следующие ключевые изменения:

### Потерянные файлы:
- `py/services/qemu_emulator_service.py` - основной QEMU сервис
- `backend/qemu.py` - QEMU API роутер
- `backend/services/` - все сервисы (docker_manager, storage_service, analytics_service)
- `backend/routers/` - все роутеры
- `py/routers/` - роутеры
- `py/models/` - модели БД
- `py/schemas/` - Pydantic схемы
- `py/middleware/` - middleware
- `py/utils/` - утилиты
- `py/db/` - работа с БД
- `py/lib/` - библиотеки
- `py/monitoring/` - мониторинг
- `py/config/` - конфигурация
- `py/cache/` - кэш сервисы

## 🎯 Ключевые изменения QEMU которые нужно восстановить

### 1. Docker образ
**Проблема:** Стандартные образы `esphome/esphome:2025.5.2` и `intel/esp-qemu` не содержат `qemu-system-xtensa`

**Решение:** Использовать `blaizard/xtensa_qemu`
```python
self.qemu_image = "blaizard/xtensa_qemu"  # Вместо "esphome/esphome:2025.5.2"
```

### 2. QEMU команда
**Проблема:** Неправильные параметры запуска

**Решение:** Правильная команда QEMU
```bash
timeout 120 qemu-system-xtensa \
    -machine esp32 \
    -global driver=timer.esp32.timg,property=wdt_disable,value=true \
    -serial stdio \
    -d guest_errors,unimp \
    -D /workspace/qemu.log
```

### 3. Таймаут
**Проблема:** 30 секунд недостаточно для загрузки ESP32
**Решение:** Увеличить до 120 секунд

### 4. Serial console
**Проблема:** `-nographic` не показывал логи
**Решение:** `-serial stdio` для вывода в stdout

### 5. Конфликт устройств
**Проблема:** `-serial stdio` и `-monitor stdio` конфликтовали
**Решение:** Убрать `-monitor stdio`

### 6. Логирование
**Проблема:** Нет диагностики QEMU
**Решение:** Добавить `-d guest_errors,unimp -D /workspace/qemu.log`

## 📋 План восстановления

### Шаг 1: Создать QEMU Emulator Service
Создать файл `py/services/qemu_emulator_service.py`:

```python
import asyncio
import uuid
from pathlib import Path
from typing import Dict, Any
from py.services.docker_manager import DockerManager

class QEMUEmulatorService:
    def __init__(self):
        self.docker_manager = DockerManager()
        self.qemu_image = "blaizard/xtensa_qemu"  # КЛЮЧЕВОЕ ИЗМЕНЕНИЕ!
        self.active_sessions: Dict[str, Dict[str, Any]] = {}
        self.sessions_dir = Path("/home/app/project/compile_files")
    
    async def start_qemu_session(self, session_id: str, firmware_path: str):
        """Запуск QEMU сессии с правильными параметрами"""
        
        # Создаем директорию для сессии
        session_dir = self.sessions_dir / f"qemu-{session_id}"
        session_dir.mkdir(exist_ok=True)
        
        # QEMU команда с исправленными параметрами
        qemu_cmd = f'''
        echo "Checking QEMU availability..."
        which qemu-system-xtensa || echo "qemu-system-xtensa not found"
        qemu-system-xtensa --version || echo "qemu-system-xtensa version check failed"
        
        echo "Starting QEMU emulation..."
        timeout 120 qemu-system-xtensa \\
            -machine esp32 \\
            -global driver=timer.esp32.timg,property=wdt_disable,value=true \\
            -serial stdio \\
            -d guest_errors,unimp \\
            -D /workspace/qemu.log
        
        echo "QEMU session completed after 120 seconds timeout"
        echo "QEMU log contents:"
        cat /workspace/qemu.log 2>/dev/null || echo "No QEMU log file found"
        '''
        
        # Запуск в Docker контейнере
        result = await self.docker_manager.run_command(
            image=self.qemu_image,
            command=qemu_cmd,
            working_dir="/workspace",
            volumes={
                str(session_dir): "/workspace"
            }
        )
        
        # Сохраняем сессию
        self.active_sessions[session_id] = {
            "status": "completed",
            "result": result,
            "session_dir": str(session_dir)
        }
        
        return result
```

### Шаг 2: Создать QEMU Router
Создать файл `backend/qemu.py`:

```python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from py.services.qemu_emulator_service import QEMUEmulatorService
import uuid

router = APIRouter()
qemu_service = QEMUEmulatorService()

class QEMUSessionRequest(BaseModel):
    firmware_path: str

@router.get("/api/qemu/status")
async def qemu_status():
    """Проверка доступности QEMU"""
    return {
        "status": "available", 
        "image": "blaizard/xtensa_qemu",
        "active_sessions": len(qemu_service.active_sessions)
    }

@router.post("/api/qemu/session")
async def create_qemu_session(request: QEMUSessionRequest):
    """Создание новой QEMU сессии"""
    session_id = str(uuid.uuid4())
    
    try:
        result = await qemu_service.start_qemu_session(
            session_id, 
            request.firmware_path
        )
        
        return {
            "session_id": session_id, 
            "status": "started",
            "result": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/qemu/session/{session_id}")
async def get_qemu_session(session_id: str):
    """Получение информации о QEMU сессии"""
    if session_id not in qemu_service.active_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return qemu_service.active_sessions[session_id]
```

### Шаг 3: Обновить main.py
В файле `backend/main.py` добавить импорт QEMU роутера:

```python
# Добавить после строки 260
try:
    from backend.qemu import router as qemu_router
    app.include_router(qemu_router, tags=["QEMU Emulation"])
    logger.info("QEMU emulation endpoints enabled")
except ImportError as e:
    logger.warning(f"QEMU emulation router not available: {e}")
```

### Шаг 4: Создать недостающие сервисы
Нужно восстановить все сервисы из папки `py/services/`:
- `docker_manager.py` - управление Docker
- `storage_service.py` - работа с файлами
- `analytics_service.py` - аналитика
- И другие сервисы

### Шаг 5: Создать недостающие роутеры
Нужно восстановить все роутеры из папки `py/routers/`:
- `websocket_router.py` - WebSocket соединения
- `templates.py` - шаблоны
- И другие роутеры

### Шаг 6: Создать недостающие модели и схемы
Нужно восстановить:
- `py/models/` - модели базы данных
- `py/schemas/` - Pydantic схемы
- `py/middleware/` - middleware
- `py/utils/` - утилиты
- `py/db/` - работа с БД

## 🧪 Тестирование

### Playwright тесты уже восстановлены:
- `qemu_test.spec.cjs` - E2E тесты QEMU
- `TESTING_RULES.md` - правила тестирования

### Команды для тестирования:
```bash
# Запуск Playwright тестов
npx playwright test qemu_test.spec.cjs

# Проверка QEMU API
curl -X GET https://api.kolkhoz.io/api/qemu/status

# Создание QEMU сессии
curl -X POST https://api.kolkhoz.io/api/qemu/session \
  -H "Content-Type: application/json" \
  -d '{"firmware_path": "/workspace/firmware.bin"}'
```

## ⚠️ Критически важно

1. **Docker образ:** Обязательно использовать `blaizard/xtensa_qemu`
2. **Таймаут:** 120 секунд для полной загрузки ESP32
3. **Serial console:** `-serial stdio` для вывода логов
4. **Без monitor:** Не использовать `-monitor stdio` одновременно с `-serial stdio`
5. **Логирование:** Добавить `-d guest_errors,unimp -D /workspace/qemu.log`

## 📊 Ожидаемый результат

После восстановления:
- QEMU запускается с правильным Docker образом
- Показывает логи загрузки ESP32 через serial console
- Playwright тесты проходят успешно
- WebSocket соединения работают для real-time логов
- Таймаут 120 сек позволяет увидеть полный процесс загрузки

**Основная проблема была в Docker образе - нужен `blaizard/xtensa_qemu` вместо стандартных ESPHome образов.**