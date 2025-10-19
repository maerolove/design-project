# 🔧 Troubleshooting Guide - ESPHome YAML Constructor v2.0.1

## 🚨 Критические ошибки и их решения

### 1. State Machine Runtime Errors

#### `TypeError: Cannot read properties of undefined (reading 'tss')`

**Описание**: Ошибка возникает при инициализации стейт-машины в фронтенде.

**Симптомы**:
- Фронтенд не загружается
- Ошибка в консоли браузера
- Стейт-машина не инициализируется

**Причина**: Несоответствие между `StateMachineXMLParser` (фронтенд) и `StateMachineParser` (бэкенд) - отсутствовал метод `get_machine_info` в XML парсере.

**Решение**:
```typescript
// Добавить метод get_machine_info в StateMachineXMLParser.ts
get_machine_info(type: any) {
  const machineData = this.getMachineData(type);
  if (!machineData) {
    console.warn(`Machine type '${type}' not found`);
    return null;
  }

  // Находим начальное состояние (с type="initial")
  let initialState = 'INITIAL';
  if (machineData.states) {
    for (const [stateName, stateData] of Object.entries(machineData.states)) {
      if ((stateData as any).type === 'initial') {
        initialState = stateName;
        break;
      }
    }
  }

  return {
    type,
    name: machineData.name || type,
    description: machineData.description || '',
    initialState: initialState,
    states: machineData.states || {},
    transitions: machineData.transitions || {},
    stateTransitions: machineData.stateTransitions || {},
    data: machineData.data || {}
  };
}
```

**Проверка исправления**:
1. Пересобрать фронтенд: `npm run build`
2. Проверить консоль браузера на отсутствие ошибок
3. Убедиться что стейт-машина инициализируется

---

### 2. XML Parsing Issues

#### Неправильная структура данных состояний

**Описание**: Состояния парсятся только как значения, без типов.

**Симптомы**:
- Состояния не имеют типов (`initial`, `active`, `success`, `error`)
- Неправильное определение начального состояния
- Ошибки в логике стейт-машины

**Решение**:
```typescript
// Исправить парсинг состояний в parseMachine
const states = machineElement.querySelectorAll('states state');
states.forEach((state: any) => {
  const name = state.getAttribute('name');
  const value = state.getAttribute('value');
  const type = state.getAttribute('type');
  machineData.states[name] = {
    value: value,
    type: type  // Добавить тип состояния
  };
});
```

---

### 3. Frontend Build Issues

#### `BUILD_PATH` не применяется

**Описание**: Фронтенд собирается в неправильную директорию.

**Симптомы**:
- Файлы создаются в `/home/app/frontend/build/` вместо `/home/app/data/build/`
- Nginx возвращает 403 ошибку
- Фронтенд не загружается

**Решение**:
```bash
# Установить BUILD_PATH в package.json
"scripts": {
  "build": "BUILD_PATH='/home/app/data/build' react-scripts build"
}

# Пересобрать фронтенд
npm run build

# Исправить права доступа
sudo chown -R app:app /home/app/data/build/
```

---

### 4. Nginx Configuration Issues

#### 403 Forbidden ошибки

**Описание**: Nginx не может обслуживать статические файлы.

**Симптомы**:
- `directory index of "/home/app/data/build/" is forbidden`
- `No such file or directory` для статических ресурсов
- Фронтенд не загружается

**Решение**:
```bash
# Проверить что файлы существуют
ls -la /home/app/data/build/

# Проверить права доступа
ls -la /home/app/data/build/static/

# Исправить права если нужно
sudo chown -R app:app /home/app/data/build/

# Проверить конфигурацию Nginx
sudo nginx -t

# Перезапустить Nginx
sudo systemctl restart nginx
```

---

## 🔍 Диагностика проблем

### 1. Проверка логов

#### Backend логи
```bash
# Логи сервиса
sudo journalctl -u esphome-backend.service --lines=50

# Логи Nginx
sudo journalctl -u nginx --lines=20

# Логи системы
sudo journalctl --lines=100
```

#### Frontend логи
```bash
# Открыть Developer Tools в браузере
# Проверить Console на ошибки
# Проверить Network на неудачные запросы
```

### 2. Проверка статуса сервисов

```bash
# Статус всех сервисов
sudo systemctl status esphome-backend.service
sudo systemctl status nginx

# Проверка портов
sudo netstat -tlnp | grep :8000
sudo netstat -tlnp | grep :80
```

### 3. Проверка файловой системы

```bash
# Проверка структуры проекта
ls -la /home/app/
ls -la /home/app/data/build/
ls -la /home/app/frontend/

# Проверка прав доступа
find /home/app/data/build/ -type f -exec ls -la {} \;
```

---

## 🛠️ Общие решения

### 1. Полная пересборка

```bash
# Остановить сервисы
sudo systemctl stop esphome-backend.service
sudo systemctl stop nginx

# Очистить кеш
rm -rf /home/app/frontend/build/
rm -rf /home/app/data/build/

# Пересобрать фронтенд
cd /home/app/frontend
npm run build

# Исправить права
sudo chown -R app:app /home/app/data/build/

# Запустить сервисы
sudo systemctl start nginx
sudo systemctl start esphome-backend.service
```

### 2. Проверка конфигурации

```bash
# Проверить переменные окружения
cat /home/app/.env

# Проверить конфигурацию Nginx
sudo nginx -t

# Проверить конфигурацию systemd
sudo systemctl cat esphome-backend.service
```

### 3. Тестирование API

```bash
# Проверить API endpoints
curl -X GET https://api.kolkhoz.io/status
curl -X GET https://api.kolkhoz.io/health

# Проверить фронтенд
curl -I https://app.kolkhoz.io
```

---

## 📚 Полезные команды

### Системные команды
```bash
# Перезапуск сервисов
sudo systemctl restart esphome-backend.service
sudo systemctl restart nginx

# Проверка статуса
sudo systemctl status esphome-backend.service
sudo systemctl status nginx

# Просмотр логов
sudo journalctl -u esphome-backend.service -f
sudo journalctl -u nginx -f
```

### Проектные команды
```bash
# Сборка фронтенда
cd /home/app/frontend && npm run build

# Запуск тестов
cd /home/app && ./run_tests.sh

# Проверка структуры
ls -la /home/app/data/build/
```

### Отладка
```bash
# Проверка процессов
ps aux | grep python
ps aux | grep nginx

# Проверка портов
sudo netstat -tlnp | grep :8000
sudo netstat -tlnp | grep :80

# Проверка дискового пространства
df -h
```

---

## 🆘 Экстренные решения

### Если ничего не работает

1. **Проверить системные ресурсы**:
   ```bash
   df -h  # Дисковое пространство
   free -h  # Память
   top  # CPU нагрузка
   ```

2. **Перезапустить все сервисы**:
   ```bash
   sudo systemctl restart esphome-backend.service
   sudo systemctl restart nginx
   ```

3. **Проверить логи на критические ошибки**:
   ```bash
   sudo journalctl -u esphome-backend.service --lines=100 | grep -i error
   sudo journalctl -u nginx --lines=50 | grep -i error
   ```

4. **Восстановить из резервной копии** (если доступна):
   ```bash
   # Восстановить конфигурацию
   # Восстановить данные
   # Перезапустить сервисы
   ```

---

**Версия**: 2.0.1  
**Последнее обновление**: 2025-01-27  
**Статус**: Актуально