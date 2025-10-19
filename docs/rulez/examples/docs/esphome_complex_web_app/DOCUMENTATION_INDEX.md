# 📚 Индекс Документации ESPHome YAML Constructor v2.0.2

## 🎯 Реорганизованная структура документации

Документация проекта реорганизована для лучшей структуризации: основная документация в `docs/`, техническая документация в глубоких папках.

---

## 📁 **docs/ - Основная документация**

### **Главные файлы:**
- **`docs/README.md`** - Основное описание проекта и быстрый старт
- **`docs/CONSOLIDATED_DOCUMENTATION.md`** - Консолидированная документация (основной источник)
- **`docs/IMPLEMENTATION_PLAN.md`** - План реализации и развития
- **`docs/ROADMAP.md`** - Дорожная карта проекта
- **`docs/WORKSPACE_RULES.md`** - Правила разработки (обновлены с XML state machine правилами)
- **`docs/DOCUMENTATION_INDEX.md`** - Этот файл (индекс документации)

### **Структура проекта:**
- **`docs/FILELIST.xml`** - Полная структура проекта в XML формате

### **Контракты и соглашения:**
- **`docs/frontend-contract.md`** - Контракт фронтенда
- **`docs/STATE_MACHINE_ASYNC_CONTRACT.md`** - Контракт асинхронной стейт-машины

### **Отчеты о проблемах:**
- **`docs/QEMU_FIX_INSTRUCTIONS.md`** - Инструкции по исправлению QEMU
- **`docs/QEMU_RESTORATION_REPORT.md`** - Отчет о восстановлении QEMU

---

## 📁 **docs/technical/ - Техническая документация**

### **Архитектура:**
- **`docs/technical/architecture/ARCHITECTURE_OVERVIEW.md`** - Обзор архитектуры системы
- **`docs/technical/architecture/ARCHITECTURE_XML_STATE_MACHINE.md`** - XML стейт-машина архитектура

### **API документация:**
- **`docs/technical/api/API_DOCUMENTATION.md`** - Полная документация API
- **`docs/technical/api/API_ENDPOINTS_DOCUMENTATION.md`** - Документация endpoints

### **Устранение неполадок:**
- **`docs/technical/troubleshooting/TROUBLESHOOTING.md`** - Руководство по устранению неполадок

---

## 📁 **docs/archive/ - Архивные документы**

- **`docs/archive/DEPLOY.md`** - Архивный деплоймент
- **`docs/archive/DEPLOYMENT_COMPLETE.md`** - Завершенный деплоймент
- **`docs/archive/DEPLOYMENT_INSTRUCTIONS.md`** - Инструкции по деплойменту
- **`docs/archive/DEPLOYMENT_STATUS.md`** - Статус деплоймента
- **`docs/archive/DEPLOYMENT_SUMMARY.md`** - Резюме деплоймента
- **`docs/archive/DEPLOYMENT_UK_GW.md`** - Деплоймент UK Gateway
- **`docs/archive/DEPLOYMENT_UK_GW_STATUS.md`** - Статус UK Gateway
- **`docs/archive/FIX_API_URL_INSTRUCTIONS.md`** - Инструкции по исправлению API URL
- **`docs/archive/MANUAL_DEPLOYMENT.md`** - Ручной деплоймент
- **`docs/archive/POST_DEPLOY.md`** - Пост-деплоймент
- **`docs/archive/REFACTORING_SUMMARY.md`** - Резюме рефакторинга
- **`docs/archive/SSH_SETUP.md`** - Настройка SSH
- **`docs/archive/SYSTEMD_DEPLOYMENT_MEMO.md`** - Мемо деплоймента systemd

---

## 📁 **frontend/ - Документация фронтенда**

- **`frontend/DEBUGGING_RULES.md`** - Правила отладки фронтенда
- **`frontend/PROBLEM_CONFIRMATION_REPORT.md`** - Отчет о подтверждении проблем
- **`frontend/src/hooks/README.md`** - README хуков
- **`frontend/src/components/__tests__/FavoritesDropdown.md`** - Тесты компонента
- **`frontend/__tests__/README.md`** - README тестов

---

## 📁 **backend/ - Документация бэкенда**

- **`backend/tests/README.md`** - README тестов бэкенда
- **`backend/FastSession/README.md`** - README FastSession
- **`backend/FastSession/README_ja.md`** - README FastSession (японский)

---

## 📁 **deployment/ - Документация деплоймента**

- **`deployment/README.md`** - Основной README деплоймента
- **`deployment/ansible/README.md`** - README Ansible
- **`deployment/ansible/README_DEPLOY.md`** - README деплоймента Ansible

---

## 🗑️ **Удаленные файлы (консолидированы)**

### **Отчеты (перенесены в docs/CONSOLIDATED_DOCUMENTATION.md):**
- ~~`docs/PROJECT_ANALYSIS_SUMMARY.md`~~ - Итоговый анализ проекта
- ~~`docs/DOCUMENTATION_ANALYSIS_REPORT.md`~~ - Анализ документации
- ~~`docs/COMPLETE_WORK_SUMMARY.md`~~ - Полное резюме работы
- ~~`docs/FINAL_STATUS_REPORT.md`~~ - Финальный отчет о статусе
- ~~`docs/CLEANUP_REPORT.md`~~ - Отчет об очистке

### **Семантические якоря (удалены как бесполезные):**
- ~~`docs/SEMANTIC_ANCHORS_SYSTEM.md`~~ - Система семантических якорей
- ~~`docs/SEMANTIC_ANCHORS_README.md`~~ - README семантических якорей

### **Рефакторинг (перенесены в docs/CONSOLIDATED_DOCUMENTATION.md):**
- ~~`docs/XML_STATE_MACHINE_REFACTORING_REPORT.md`~~ - Отчет о рефакторинге XML стейт-машины
- ~~`docs/FRONTEND_XML_STATE_MACHINE_COMPLIANCE_REPORT.md`~~ - Отчет о соответствии фронтенда

### **Правила (перенесены в docs/WORKSPACE_RULES.md):**
- ~~`docs/PROJECT_RULES_UPDATED.md`~~ - Обновленные правила проекта
- ~~`docs/BUILD_ASSERTIONS_SYSTEM.md`~~ - Система ассертов сборки
- ~~`docs/STATE_MACHINE_LOGIC_RULE.md`~~ - Логические правила стейт-машины
- ~~`docs/STATE_MACHINE_ARCHITECTURE_RULES.md`~~ - Правила архитектуры стейт-машины
- ~~`docs/XML_STATE_MACHINE_RULES.md`~~ - Правила XML стейт-машины

### **Контракты (перенесены в docs/CONSOLIDATED_DOCUMENTATION.md):**
- ~~`docs/STATE_MANAGEMENT_CONTRACTS.md`~~ - Контракты управления состояниями
- ~~`docs/CONTRACTS_DOCUMENTATION.md`~~ - Документация контрактов
- ~~`docs/DEFAULT_CONFIG_CONTRACT.md`~~ - Контракт дефолтной конфигурации

### **Фронтенд (перенесены в основные документы):**
- ~~`docs/FRONTEND_BUILD_RULES.md`~~ - Правила сборки фронтенда
- ~~`docs/BUTTON_STATE_FIX.md`~~ - Исправление состояний кнопок

### **Производительность и безопасность (перенесены в docs/CONSOLIDATED_DOCUMENTATION.md):**
- ~~`docs/PERFORMANCE_OPTIMIZATION.md`~~ - Оптимизация производительности
- ~~`docs/SECURITY_CONFIG.md`~~ - Конфигурация безопасности

### **Компоненты (перенесены в docs/CONSOLIDATED_DOCUMENTATION.md):**
- ~~`docs/COMPONENT_DOCUMENTATION.md`~~ - Документация компонентов
- ~~`docs/REFACTORING_REPORT.md`~~ - Отчет о рефакторинге

### **Деплоймент (перенесены в основные документы):**
- ~~`docs/deployment/DEPLOYMENT.md`~~ - Деплоймент
- ~~`docs/deployment/SERVER_BUILD_GUIDE.md`~~ - Руководство по сборке сервера

### **Тестирование (перенесены в основные документы):**
- ~~`docs/development/TESTING_PRINCIPLES.md`~~ - Принципы тестирования
- ~~`docs/BACKEND_README.md`~~ - README бэкенда

### **Архитектура (перенесены в docs/CONSOLIDATED_DOCUMENTATION.md):**
- ~~`docs/ARCHITECTURE_IMPROVEMENTS_COMPLETE.md`~~ - Завершенные улучшения архитектуры

---

## 📊 **Статистика реорганизации**

### **Новая структура:**
- **docs/**: 8 основных файлов
- **docs/technical/**: 5 технических файлов в подпапках
- **docs/archive/**: 12 архивных файлов
- **Специализированные**: 15 файлов в других папках

### **Преимущества реорганизации:**
- **Четкое разделение** - основная и техническая документация разделены
- **Глубокая структура** - техническая документация в подпапках
- **Лучшая навигация** - логическая группировка файлов
- **Сохранение архива** - исторические документы отдельно

---

## 🎯 **Рекомендуемый порядок изучения**

1. **`docs/README.md`** - Начало изучения проекта
2. **`docs/CONSOLIDATED_DOCUMENTATION.md`** - Полная картина проекта
3. **`docs/WORKSPACE_RULES.md`** - Правила разработки
4. **`docs/technical/architecture/ARCHITECTURE_OVERVIEW.md`** - Архитектура системы
5. **`docs/technical/api/API_DOCUMENTATION.md`** - API документация
6. **`docs/IMPLEMENTATION_PLAN.md`** - План развития
7. **`docs/ROADMAP.md`** - Дорожная карта

---

## ✅ **Преимущества реорганизации**

- **Структурированность** - четкое разделение типов документации
- **Глубокая организация** - техническая документация в подпапках
- **Упрощенная навигация** - логическая группировка файлов
- **Сохранение контекста** - архивные документы отдельно
- **Масштабируемость** - легко добавлять новые категории