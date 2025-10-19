# ESPHome YAML Constructor - Консолидированная Документация

## 📋 Содержание

1. [Обзор проекта](#обзор-проекта)
2. [Архитектура системы](#архитектура-системы)
3. [API Документация](#api-документация)
4. [Правила разработки](#правила-разработки)
5. [Структура проекта](#структура-проекта)
6. [Быстрый старт](#быстрый-старт)
7. [Развертывание](#развертывание)
8. [Устранение неполадок](#устранение-неполадок)

---

## 🚀 Обзор проекта

### ESPHome YAML Constructor v2.0.2

Веб-приложение для компиляции конфигураций ESPHome с интеграцией Docker, кэшированием и **XML-архитектурой стейт-машины**.

### 📊 Статус документации

**Выявленные проблемы документации:**
- 🚨 **Критические**: несоответствие версий API (v1.6.0 vs v2.0.2), противоречивые URL endpoints
- ⚠️ **Серьезные**: дублирование информации, устаревшие данные
- 📝 **Структурные**: непоследовательная структура, отсутствие содержания
- 🔧 **Технические**: отсутствие примеров кода, неполная API документация

**Принятые меры**: Консолидация документации, удаление дублирующихся файлов, унификация версий.

---

## 📁 Структура проекта

### FILELIST.xml - Полная структура проекта

**`FILELIST.xml`** - это XML-файл в корневой директории проекта, содержащий полную структуру всех файлов и директорий проекта ESPHome YAML Constructor.

**Назначение:**
- 📋 **Полная инвентаризация** - содержит все файлы проекта с описаниями
- 🔗 **Связи и зависимости** - показывает связи между компонентами
- 📊 **Структурный анализ** - помогает понять архитектуру проекта
- 🎯 **Навигация** - служит справочником для разработчиков

**Использование:**
- Для понимания структуры проекта
- Для поиска конкретных файлов и компонентов
- Для анализа зависимостей между модулями
- Для планирования изменений в архитектуре

**Расположение:** `docs/FILELIST.xml` (директория документации)

### ✅ **Статус реализации (v2.0.2)**

**ПОЛНОСТЬЮ РЕАЛИЗОВАНО И ПРОТЕСТИРОВАНО:**
- ✅ XML State Machine Architecture (7 независимых машин)
- ✅ ESPHome Configuration Validation
- ✅ ESPHome Configuration Compilation  
- ✅ Binary File Download (Factory & OTA)
- ✅ Default Configuration Contract
- ✅ State Machine Transitions & Status API
- ✅ Docker Integration & Caching

### 🔄 Рефакторинг XML State Machine

**Выполненная работа:**
- ✅ Полный переход с JSON на XML архитектуру
- ✅ Создание XSD схемы для валидации
- ✅ Рефакторинг фронтенда для соответствия XML архитектуре
- ✅ Обновление всех компонентов для работы с XML
- ✅ Создание XML registry для управления файлами

### 📋 Контракты системы

**Основные контракты:**
- **Default Config Contract**: Дефолтная конфигурация с состоянием COMPILED
- **State Management Contracts**: Управление состояниями через XML стейт-машину
- **API Contracts**: REST API endpoints для всех операций
- **Frontend Contracts**: Соглашения между фронтендом и бэкендом
- ✅ QEMU Emulation Framework
- ✅ Template Management System
- ✅ Social Features (Comments, Ratings, Likes)
- ✅ Favorites Management
- ✅ Configuration Sharing
- ✅ Analytics & Metrics Collection
- ✅ MQTT Integration
- ✅ WebSocket Support
- ✅ Multi-level Caching System

### ⚠️ **НЕ РЕАЛИЗОВАНО (ТРЕБУЕТ ДОРАБОТКИ):**

#### **1. Frontend UI Components**
- ❌ **Responsive YamlEditor** - основной редактор не адаптивный
- ❌ **Real-time State Updates** - нет автоматического обновления состояний
- ❌ **Progress Indicators** - нет индикаторов прогресса компиляции
- ❌ **Error Display** - нет красивого отображения ошибок валидации
- ❌ **File Upload Interface** - нет drag&drop загрузки файлов
- ❌ **Configuration History** - нет истории изменений конфигураций

#### **2. Device Management**
- ❌ **USB Device Detection** - нет автоматического обнаружения устройств
- ❌ **Device Flashing** - генерация прошивки и инструкции по прошиванию (без прошивания на сервере)
- ❌ **Device Status Monitoring** - нет мониторинга состояния устройств
- ❌ **OTA Update Management** - нет управления OTA обновлениями

#### **3. Advanced Features**
- ❌ **Configuration Versioning** - нет системы версионирования
- ❌ **Configuration Diff** - нет сравнения версий конфигураций
- ❌ **Bulk Operations** - нет массовых операций
- ❌ **Configuration Backup/Restore** - нет резервного копирования
- ❌ **Configuration Migration** - нет миграции между версиями ESPHome

#### **4. User Management**
- ❌ **User Authentication** - нет системы аутентификации
- ❌ **User Profiles** - нет профилей пользователей
- ❌ **Permission System** - нет системы разрешений
- ❌ **Multi-tenant Support** - нет поддержки множественных пользователей

#### **5. Advanced Analytics**
- ❌ **Usage Statistics Dashboard** - нет дашборда статистики
- ❌ **Performance Metrics** - нет метрик производительности
- ❌ **Error Tracking** - нет отслеживания ошибок
- ❌ **User Behavior Analytics** - нет аналитики поведения пользователей

#### **6. Integration Features**
- ❌ **Git Integration** - нет интеграции с Git
- ❌ **CI/CD Pipeline** - нет пайплайнов автоматизации
- ❌ **Webhook Support** - нет поддержки webhooks
- ❌ **API Rate Limiting** - нет ограничения скорости API
- ❌ **API Authentication** - нет аутентификации API

#### **7. Mobile Support**
- ❌ **Mobile Responsive Design** - нет мобильной адаптации
- ❌ **PWA Support** - нет поддержки Progressive Web App
- ❌ **Mobile App** - нет мобильного приложения

#### **8. Advanced QEMU Features**
- ❌ **QEMU Session Persistence** - нет сохранения сессий QEMU
- ❌ **QEMU Network Simulation** - нет сетевой симуляции
- ❌ **QEMU Hardware Simulation** - нет симуляции периферии
- ❌ **QEMU Performance Profiling** - нет профилирования производительности

### 🚀 **ПРИОРИТЕТЫ РАЗРАБОТКИ (v2.1.0)**

#### **Высокий приоритет (Критично для MVP):**
1. **Responsive YamlEditor** - адаптивный редактор конфигураций
2. **Real-time State Updates** - автоматическое обновление состояний
3. **Progress Indicators** - индикаторы прогресса компиляции
4. **Error Display** - красивое отображение ошибок валидации
5. **USB Device Detection** - автоматическое обнаружение устройств

#### **Средний приоритет (Важно для UX):**
1. **Configuration Versioning** - система версионирования
2. **Configuration History** - история изменений
3. **File Upload Interface** - drag&drop загрузка файлов
4. **Device Flashing** - генерация прошивки и инструкции по прошиванию
5. **Mobile Responsive Design** - мобильная адаптация

#### **Низкий приоритет (Дополнительные функции):**
1. **User Authentication** - система аутентификации
2. **Git Integration** - интеграция с Git
3. **Advanced Analytics Dashboard** - дашборд аналитики
4. **CI/CD Pipeline** - пайплайны автоматизации
5. **PWA Support** - поддержка Progressive Web App

### 🔧 **ТЕХНИЧЕСКИЕ ДОЛГИ (ТРЕБУЕТ РЕФАКТОРИНГА):**

#### **1. Frontend Architecture**
- ❌ **Component State Management** - нет централизованного управления состоянием
- ❌ **Error Boundaries** - нет глобальной обработки ошибок
- ❌ **Loading States** - нет унифицированных состояний загрузки
- ❌ **TypeScript Strict Mode** - не включен строгий режим TypeScript
- ❌ **Component Testing** - недостаточно тестов компонентов

#### **2. Backend Architecture**
- ❌ **Database Migrations** - не все миграции применены
- ❌ **API Rate Limiting** - нет ограничения скорости запросов
- ❌ **Input Validation** - недостаточная валидация входных данных
- ❌ **Error Handling** - нет унифицированной обработки ошибок
- ❌ **Logging Strategy** - нет структурированного логирования

#### **3. Security Issues**
- ❌ **CORS Configuration** - неправильная настройка CORS
- ❌ **Input Sanitization** - нет санитизации пользовательского ввода
- ❌ **SQL Injection Protection** - недостаточная защита от SQL инъекций
- ❌ **XSS Protection** - нет защиты от XSS атак
- ❌ **CSRF Protection** - нет защиты от CSRF атак

#### **4. Performance Issues**
- ❌ **Database Indexing** - недостаточная индексация БД
- ❌ **Query Optimization** - неоптимизированные запросы
- ❌ **Caching Strategy** - неэффективная стратегия кэширования
- ❌ **Memory Leaks** - возможные утечки памяти
- ❌ **Resource Cleanup** - нет очистки ресурсов

#### **5. Code Quality**
- ❌ **Code Duplication** - дублирование кода
- ❌ **Magic Numbers** - магические числа в коде
- ❌ **Hardcoded Values** - хардкод значений
- ❌ **Documentation** - недостаточная документация кода
- ❌ **Code Reviews** - нет процесса code review

### 🎯 Основные возможности

#### Основной функционал
- **Компиляция конфигураций ESPHome**: Docker-based компиляция с логами в реальном времени
- **Валидация YAML**: Валидация в реальном времени с детальным отчетом об ошибках
- **Управление бинарными файлами**: Скачивание скомпилированных бинарных файлов и OTA обновлений
- **Прошивка устройств**: Прямая прошивка устройств через USB
- **QEMU Эмуляция**: Эмуляция ESP32 для тестирования конфигураций

#### Архитектура стейт-машины
- **7 независимых стейт-машин**: Main, QEMU, Template, Social, Favorite, Share, System
- **Типизированные состояния**: Initial, Process, Active, Success, Error, Idle, Warning
- **Типизированные переходы**: Action, Result, System, Error
- **Глобальные переходы**: Системное управление состояниями
- **Взаимодействие машин**: Скоординированные рабочие процессы между машинами

### 🏗️ Технологический стек

#### Frontend
- **React 18**: Современный UI фреймворк с хуками и функциональными компонентами
- **Chakra UI**: Библиотека компонентов для консистентной дизайн-системы
- **Vite**: Быстрый инструмент сборки и dev-сервер
- **React Router**: Клиентская маршрутизация с UUID-based навигацией
- **YAML.js**: Парсинг и валидация YAML
- **Playwright**: Фреймворк для end-to-end тестирования

#### Backend
- **FastAPI**: Современный Python веб-фреймворк с автоматической API документацией
- **SQLAlchemy**: ORM с async поддержкой для операций с базой данных
- **Alembic**: Управление миграциями базы данных
- **Pydantic**: Валидация данных и сериализация
- **Docker**: Контейнеризация для компиляции ESPHome с доступом к host Docker
- **ESPHome**: ESPHome 2025.5.2 для компиляции прошивки с кэшированием
- **QEMU**: Эмуляция оборудования для ESP32/ESP8266 устройств

#### База данных
- **PostgreSQL**: Основная база данных для продакшена
- **SQLite**: База данных для разработки и тестирования
- **Redis**: Кэширование и хранение сессий (опционально)

#### Инфраструктура
- **Docker Compose**: Оркестрация мульти-контейнеров
- **Nginx**: Обратный прокси и сервинг статических файлов
- **Systemd**: Управление сервисами для продакшен развертывания

---

## 🏗️ Архитектура системы

### Архитектура компиляции ESPHome

#### Docker интеграция
Приложение использует сложную Docker интеграцию для компиляции ESPHome:

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

#### Volume Mounts
- **Config Files**: `./uploaded_files/` → `/config` (ESPHome container)
- **Build Output**: `./compile/` → `/build` (ESPHome container)  
- **Cache**: `./cache/esphome_cache/` → `/cache` (ESPHome container)

#### Процесс компиляции
1. **Загрузка конфигурации**: YAML конфиг сохраняется в `uploaded_files/user-id/config-name/`
2. **Выполнение Docker**: ESPHome контейнер запускается с смонтированными volumes
3. **Компиляция**: ESPHome компилирует прошивку с кэшированием
4. **Вывод**: Скомпилированная прошивка сохраняется в `compile/device-name/`
5. **Кэш**: Артефакты сборки кэшируются в `compile/device-name/.pioenvs/`

### Архитектурные паттерны

#### 1. Слоистая архитектура

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

#### 2. Паттерн стейт-машины

Приложение реализует комплексную стейт-машину с множественными параллельными потоками:

- **Main Flow**: Редактирование конфигурации, валидация, компиляция, скачивание
- **QEMU Flow**: Эмуляция устройств и тестирование
- **Template Flow**: Просмотр и выбор шаблонов
- **Social Flow**: Обмен конфигурациями и коллаборация
- **Analytics Flow**: Отслеживание использования и статистика

#### 3. Сервисно-ориентированная архитектура

Каждая основная функциональность инкапсулирована в выделенных сервисах:

- **ESPHomeService**: Компиляция и валидация конфигураций
- **StorageService**: Операции файловой системы и очистка
- **CacheService**: Многоуровневая стратегия кэширования
- **QEMUEmulatorService**: Управление эмуляцией устройств
- **TemplateService**: Управление и поиск шаблонов
- **SocialService**: Функции обмена и коллаборации
- **AnalyticsService**: Отслеживание использования и метрики

### Архитектура стейт-машины (v2.0.1)

Стейт-машина использует XML-based конфигурацию с улучшенной совместимостью парсеров:

#### Компоненты парсера
- **StateMachineXMLParser**: Frontend XML парсер с методом `get_machine_info`
- **StateMachineParser**: Backend парсер для операций стейт-машины
- **StateMachineXMLAsyncLoader**: Асинхронный загрузчик XML данных

#### Ключевые улучшения
- **Совместимость парсеров**: Унифицированный интерфейс между frontend и backend парсерами
- **Улучшенный XML парсинг**: Правильное извлечение атрибутов `name`, `description` и `type`
- **Структурированные данные состояний**: Состояния содержат свойства `value` и `type`
- **Автоматическое обнаружение начального состояния**: Находит начальное состояние из XML конфигурации

---

## 🔌 API Документация

### Базовый URL

```
http://localhost:8042
```

### Управление версиями ESPHome

Приложение использует фиксированную версию ESPHome (2025.5.2) для обеспечения консистентного поведения во всех операциях:

- **Версия по умолчанию**: 2025.5.2
- **Docker Image**: `esphome/esphome:2025.5.2`
- **Поддерживаемые версии**: 2025.5.2, 2025.5.1, 2025.4.0, latest

### Основные endpoints

#### Health Check
- **GET /health** - Проверка здоровья API и получение session cookie

#### Дефолтная конфигурация
- **GET /config/default** - Получение дефолтной конфигурации с состоянием COMPILED
- **GET /config/default** - Получение дефолтной конфигурации с состоянием EDITING

#### Валидация конфигурации
- **POST /validate** - Валидация ESPHome YAML конфигурации

#### Компиляция конфигурации
- **POST /compile/{file_id}** - Компиляция ESPHome конфигурации в бинарный файл

#### Скачивание бинарных файлов
- **POST /download/{file_id}** - Скачивание скомпилированного factory бинарного файла
- **POST /download-ota/{file_id}** - Скачивание скомпилированного OTA бинарного файла

#### Статус компиляции
- **GET /status/{file_id}** - Получение статуса компиляции и информации о бинарных файлах

#### Получение конфигурации
- **GET /config/{file_name}** - Получение конфигурации по имени файла

#### QEMU эмуляция
- **POST /qemu/start/{file_id}** - Запуск QEMU эмуляции для скомпилированной конфигурации
- **POST /qemu/stop/{session_id}** - Остановка QEMU эмуляции
- **GET /qemu/sessions** - Список активных QEMU сессий

#### Управление шаблонами
- **GET /templates** - Просмотр доступных шаблонов устройств
- **GET /templates/{template_id}** - Получение деталей шаблона и YAML контента

#### Обмен конфигурациями
- **POST /share** - Обмен конфигурацией с публичной ссылкой
- **GET /share/{share_id}** - Получение общей конфигурации

### Дефолтная конфигурация (v2.0.2)

#### Флаг дефолтного конфига
Приложение поддерживает специальный режим для дефолтной конфигурации:

- **GET /config/default** - Возвращает дефолтную конфигурацию с состоянием COMPILED
- **GET /config/default** - Возвращает дефолтную конфигурацию с состоянием EDITING

#### HTTP заголовки для дефолтного конфига
```
X-Current-State: COMPILED (при default=true) или EDITING (по умолчанию)
X-File-Name: my-device
X-Compilation-Status: success (при default=true) или pending (по умолчанию)
X-Is-Default-Config: true (при default=true) или false (по умолчанию)
```

#### Логика работы
1. **Frontend запрашивает** `/default-config.yaml?default=true`
2. **Backend проверяет** флаг `default=true` в query параметрах
3. **Backend возвращает** конфигурацию с состоянием COMPILED
4. **Frontend получает** заголовки и устанавливает fileName
5. **Кнопки активируются** автоматически (Download BIN, Download OTA, Flash)

### Стейт-машина Reference

#### Основные состояния Main Flow

| Состояние | Описание | CSS Class | Button Class |
|-----------|----------|-----------|--------------|
| `initial` | Запуск приложения | `state-initial` | - |
| `editing` | Редактирование конфигурации | `state-editing` | - |
| `validating` | Валидация конфигурации | `state-validating` | `button-state-validating` |
| `valid` | Конфигурация валидна | `state-valid` | `button-state-valid` |
| `invalid` | Конфигурация содержит ошибки | `state-invalid` | `button-state-invalid` |
| `compiling` | Компиляция в процессе | `state-compiling` | `button-state-compiling` |
| `compiled` | Компиляция завершена | `state-compiled` | `button-state-compiled` |
| `downloading` | Скачивание бинарного файла | `state-downloading` | `button-state-downloading` |
| `downloaded` | Скачивание завершено | `state-downloaded` | `button-state-downloaded` |

#### Состояния QEMU Flow

| Состояние | Описание | CSS Class | Button Class |
|-----------|----------|-----------|--------------|
| `qemu_starting` | Запуск эмуляции | `state-qemu-starting` | `button-state-qemu-starting` |
| `qemu_running` | Эмуляция активна | `state-qemu-running` | `button-state-qemu-running` |
| `qemu_stopping` | Остановка эмуляции | `state-qemu-stopping` | `button-state-qemu-stopping` |
| `qemu_stopped` | Эмуляция остановлена | `state-qemu-stopped` | `button-state-qemu-stopped` |
| `qemu_failed` | Эмуляция не удалась | `state-qemu-failed` | `button-state-qemu-failed` |

---

## 📋 Правила разработки

### 1. CHECK FILELIST FIRST RULE
- ВСЕГДА проверять FILELIST перед созданием директорий
- ВСЕГДА использовать пути из FILELIST вместо угадывания
- НИКОГДА не создавать директории без проверки FILELIST

### 2. CONCRETE PROPOSALS RULE
- ВСЕГДА предлагать конкретные решения перед запросом разрешения
- ВСЕГДА давать точные команды которые можно выполнить
- НИКОГДА не спрашивать "что делать" без предоставления опций

### 3. CRITICAL APPLICATION STATE RULE
- НИКОГДА не принимать ЛЮБЫЕ ошибки как нормальные
- ВСЕГДА лечить 500/404/405 ошибки как критические проблемы
- ВСЕГДА перезапускать сервисы для применения исправлений

### 4. DIAGNOSIS VS SOLUTIONS RULE
- НИКОГДА не предлагать диагностические команды как решения
- ВСЕГДА выполнять диагностику самому и предоставлять готовые решения

### 5. DO EXACTLY WHAT WAS ASKED RULE
- ВСЕГДА делать именно то что просили - не больше, не меньше
- НИКОГДА не пытаться делать что-то другое вместо запрошенного

### 6. ESPHome YAML Constructor Rules
- ВСЕГДА читать ./FILELIST перед каждой задачей
- ВСЕГДА спрашивать разрешение на создание файлов
- API Endpoints: https://api.kolkhoz.io (БЕЗ /api префикса)

### 7. File Creation Permission Rules
- ВСЕГДА спрашивать разрешение на создание файлов
- НИКОГДА не создавать файлы без явного разрешения пользователя

### 8. FIX OBVIOUS ERRORS RULE
- ВСЕГДА исправлять очевидные ошибки когда видишь их
- ВСЕГДА действовать немедленно на четкие сообщения об ошибках

### 9. LOCALHOST IS PRODUCTION RULE
- localhost:8000 и api.kolkhoz.io - это один и тот же сервер

### 10. NO CODE DUPLICATION RULE
- ЗАПРЕЩЕНО дублировать код во всем проекте
- ВСЕГДА создавать вспомогательные функции для общей логики

### 11. NO TEMPORARY FIXES RULE
- НЕ упрощать / НЕ делать временные отключения / НЕ комментировать код
- ВСЕГДА чинить исходную проблему
- НИКОГДА не комментировать код как "временное решение"
- ВСЕГДА анализировать проблему и рефакторить/дописывать/исправлять код

### 12. PYTHON IMPORTS RULE
- ВСЕГДА использовать абсолютные импорты от корня проекта
- НИКОГДА не использовать относительные импорты (from ..module)

### 13. Script Execution Rules
- НИКОГДА не запускать скрипты напрямую
- Только использовать механизмы таймаута, планировщики задач

### 14. STATE MACHINE USAGE RULE
- ВСЕГДА использовать константы стейт-машины для всех проверок состояний
- НИКОГДА не хардкодить строки состояний типа "valid", "invalid"

### 15. SYSTEM CONFIGURATION PROTECTION RULE
- НИКОГДА не трогать системную конфигурацию без явного разрешения
- НИКОГДА не изменять файлы nginx в /etc/nginx/

### 16. USELESS TESTS RULE
- НИКОГДА не писать тесты которые принимают любой статус как "валидный"

### 17. SINGLE XML SOURCE RULE - КЛЮЧЕВОЕ ПРАВИЛО
- СТРОГО ИСПОЛЬЗОВАТЬ ТОЛЬКО СУЩЕСТВУЮЩИЙ XML ФАЙЛ shared/stateMachineSimplified.xml
- ЗАПРЕЩЕНО КОПИРОВАТЬ XML в JavaScript файлы или другие места
- ЗАПРЕЩЕНО ДУБЛИРОВАТЬ определения состояний и переходов
- ВСЕГДА ЧИТАТЬ XML из единственного источника истины
- НИКОГДА НЕ ХАРДКОДИТЬ состояния типа 'ERROR', 'SUCCESS', 'RUNNING' в коде
- ВСЕГДА ПАРСИТЬ все состояния и переходы из XML файла
- ЕДИНЫЙ ИСТОЧНИК ИСТИНЫ - только XML файл в shared/

### 18. GIT COMMANDS PROTECTION RULE
- ЗАПРЕЩЕНО ВЫЗЫВАТЬ КОМАНДЫ ИЗ ГИТА КОТОРЫЕ ПОТЕНЦИАЛЬНО МОГУТ ИЗМЕНИТЬ СОСТОЯНИЕ РАБОЧЕЙ ДИРЕКТОРИИ
- НИКОГДА не запускать git команды которые могут изменить состояние рабочей директории
- НИКОГДА не использовать git команды которые могут изменить состояние файлов или рабочего дерева
- НИКОГДА не выполнять git команды которые могут повлиять на состояние репозитория
- ВСЕГДА использовать безопасные git команды только для чтения информации

### 19. NO LOCAL FILES VIA HTTP RULE - КРИТИЧЕСКОЕ ПРАВИЛО
- СТРОГО ЗАПРЕЩЕНО загружать локальные файлы через HTTP
- НИКОГДА не использовать fallback на локальные файлы в коде
- НИКОГДА не загружать файлы из public/ или build/ директорий через HTTP
- ВСЕГДА получать данные только через API endpoints
- ВСЕГДА использовать backend для всех данных и состояний
- НИКОГДА не хардкодить локальные пути к файлам в frontend коде
- ВСЕГДА получать состояния через HTTP headers от backend
- НИКОГДА не создавать локальные копии конфигураций в frontend

#### Запрещенные действия:
- Загрузка файлов из `public/default-config.yaml`
- Загрузка файлов из `build/default-config.yaml`
- Загрузка файлов из `data/build/default-config.yaml`
- Использование `fetch('/default-config.yaml')` для локальных файлов
- Fallback на локальные файлы при ошибках API
- Хардкодинг путей к локальным файлам
- Создание локальных копий конфигураций

#### Разрешенные действия:
- Получение данных только через API endpoints
- Использование backend для всех состояний
- Получение состояний через HTTP headers
- Использование API для всех конфигураций

#### Примеры ЗАПРЕЩЕННЫХ действий:
```javascript
// НЕПРАВИЛЬНО - загрузка локальных файлов
fetch('/default-config.yaml')  // локальный файл
fetch('/public/config.yaml')   // локальный файл
fetch('/build/config.yaml')    // локальный файл

// НЕПРАВИЛЬНО - fallback на локальные файлы
try {
  const response = await fetch('/api/config');
} catch (error) {
  // НЕПРАВИЛЬНО - fallback на локальный файл
  const localConfig = await fetch('/default-config.yaml');
}
```

#### Примеры РАЗРЕШЕННЫХ действий:
```javascript
// ПРАВИЛЬНО - только API endpoints
const response = await fetch('/api/default-config');
const config = await response.text();

// ПРАВИЛЬНО - получение состояния через headers
const state = response.headers.get('X-Current-State');
const fileName = response.headers.get('X-File-Name');
```

#### Исключение:
- Использовать локальные файлы только для статических ресурсов (CSS, JS, изображения)
- Фронтенд общается с бекендом через API
- Файлы в файловой системе читаются НАПРЯМУЮ с файловой системы БЕЗ API
- Никогда не использовать локальные файлы для данных или конфигураций
- Всегда получать данные через API

---

## 🚀 Быстрый старт

### Предварительные требования
- Docker и Docker Compose
- Python 3.11+
- Node.js 18+

### Установка

1. **Клонировать репозиторий**
```bash
git clone <repository-url>
cd esphome-yaml-constructor
```

2. **Запустить миграцию (если обновляетесь с v1.x)**
```bash
cd backend
python migrations/migrate_to_xml_state_machine.py
```

3. **Запустить с Docker Compose**
```bash
docker-compose up -d
```

4. **Доступ к приложению**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- State Machine API: http://localhost:8000/api/state-machine/

### Разработка

#### Запуск тестов
```bash
# Backend тесты
cd backend
python -m pytest tests/ -v

# State machine тесты
python -m pytest tests/unit/test_state_machine.py -v

# Валидация XML конфигурации
python -c "from shared.state_machine_simplified import validate_state_machine; print(validate_state_machine())"
```

#### Разработка стейт-машины

1. **Редактирование XML конфигурации**
```bash
# Редактирование основной конфигурации
vim backend/shared/stateMachineSimplified.xml

# Валидация изменений
python -c "from shared.state_machine_xml import StateMachineXMLParser; StateMachineXMLParser(Path('backend/shared/stateMachineSimplified.xml')).parse()"
```

2. **Добавление новых состояний**
```xml
<state name="NEW_STATE" value="new_state" type="process"/>
```

3. **Добавление новых переходов**
```xml
<transition name="NEW_ACTION" value="new_action" type="action"/>
```

4. **Обновление переходов состояний**
```xml
<fromState name="CURRENT_STATE">
  <toTransition>NEW_ACTION</toTransition>
</fromState>
```

---

## 🚀 Развертывание

### Продакшен развертывание

#### Структура продакшена
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

#### Команды развертывания
```bash
# Сборка frontend
cd frontend
npm run build

# Копирование в продакшен директорию
cp -r build/* /home/app/data/build/

# Перезапуск сервисов
sudo systemctl restart esphome-backend.service
sudo systemctl restart nginx
```

---

## 🐛 Устранение неполадок

### Частые проблемы

1. **Ошибки валидации XML**
```bash
# Проверка синтаксиса XML
xmllint --noout backend/shared/stateMachineSimplified.xml

# Валидация против схемы
xmllint --schema backend/shared/stateMachineSchema.xsd backend/shared/stateMachineSimplified.xml
```

2. **Ошибки стейт-машины**
```bash
# Проверка статуса стейт-машины
curl http://localhost:8000/api/state-machine/status

# Валидация конфигурации
curl http://localhost:8000/api/state-machine/validate
```

3. **Проблемы миграции**
```bash
# Проверка отчета миграции
ls backend/migrations/backups/
cat backend/migrations/migration_report_*.json
```

4. **Проблемы сборки frontend**
```bash
# Проверка TypeScript ошибок
cd frontend
npm run type-check

# Пересборка
npm run build
```

### Мониторинг

#### Мониторинг стейт-машины
- **Статус в реальном времени**: `/api/state-machine/status`
- **Здоровье машин**: `/api/state-machine/machine/{type}`
- **Валидация конфигурации**: `/api/state-machine/validate`

#### Метрики производительности
- **Время инициализации**: ~50ms (XML парсинг)
- **Время валидации**: ~5ms (XSD валидация)
- **Использование памяти**: +10% (структурированные данные)

---

## 📊 Мониторинг и наблюдаемость

### 1. Логирование
- **Структурированное логирование**: JSON-форматированные записи логов
- **Уровни логов**: DEBUG, INFO, WARNING, ERROR, CRITICAL
- **Агрегация логов**: Централизованный сбор логов
- **Ротация логов**: Автоматическое управление файлами логов

### 2. Метрики
- **Метрики приложения**: Частота запросов, время ответа, частота ошибок
- **Бизнес метрики**: Успешность компиляции, активность пользователей
- **Метрики инфраструктуры**: CPU, память, использование диска
- **Пользовательские метрики**: Статистика компиляции ESPHome

### 3. Проверки здоровья
- **Здоровье API**: Мониторинг endpoint `/health`
- **Здоровье базы данных**: Производительность соединения и запросов
- **Здоровье сервисов**: Статус отдельных сервисов
- **Здоровье зависимостей**: Доступность внешних сервисов

---

## 🤝 Вклад в проект

### Вклад в стейт-машину
1. **Следовать XML схеме**: Всегда валидировать против XSD
2. **Тестировать переходы**: Убедиться что все переходы протестированы
3. **Обновлять документацию**: Поддерживать XML правила в актуальном состоянии
4. **Обратная совместимость**: Поддерживать совместимость API

### Стиль кода
- **Python**: Следовать PEP 8
- **XML**: Использовать отступы в 2 пробела
- **Документация**: Обновлять FILELIST для новых файлов

---

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

---

**Версия**: 2.0.2  
**Последнее обновление**: 2025-09-23  
**Архитектура**: XML-based State Machine с REST API  
**Статус**: MVP готов, требуется доработка UI и дополнительных функций

---

*Эта консолидированная документация объединяет всю информацию о проекте ESPHome YAML Constructor в одном месте для удобства разработчиков и пользователей.*