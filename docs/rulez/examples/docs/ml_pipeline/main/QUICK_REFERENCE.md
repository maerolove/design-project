# 🚀 microWakeWord - Быстрый справочник

## 📋 Основные команды

### Установка и настройка:
```bash
# Создание виртуального окружения
python -m venv .venv
source .venv/bin/activate

# Установка зависимостей
pip install -r requirements.txt
pip install psutil
pip install protobuf==4.25.5  # КРИТИЧНО!
```

### Управление задачами:
```bash
# Запуск полного пайплайна
./manage_tasks.sh start

# Запуск конкретной задачи
./manage_tasks.sh start train_model
./manage_tasks.sh start generate_data

# Мониторинг
./manage_tasks.sh status
./manage_tasks.sh logs train_model

# Управление
./manage_tasks.sh stop train_model
./manage_tasks.sh stop-all
./manage_tasks.sh cleanup
```

### Доступные задачи:
- `generate_data` - Генерация TTS данных
- `augmentations` - Аудио аугментации
- `balance_dataset` - Балансировка датасета
- `train_model` - Обучение стандартной модели (50KB)
- `train_larger` - Обучение большой модели (141KB)

---

## 🚨 Критические правила

### ❌ НЕ ДЕЛАЙТЕ ТАК:
```bash
❌ python use_original_library_correctly.py  # НЕ ДЕЛАЙТЕ ТАК!
❌ pip install package_name  # НЕ ДЕЛАЙТЕ ТАК!
```

### ✅ ДЕЛАЙТЕ ТАК:
```bash
✅ ./manage_tasks.sh start train_model  # ПРАВИЛЬНО!
✅ source .venv/bin/activate && pip install package_name  # ПРАВИЛЬНО!
```

---

## 📊 Данные проекта

### Расположение:
- **Данные**: `/home/microWakeWord_data/`
- **Позитивные**: `positives_final/` - 3,200 файлов
- **Негативные**: `negatives_real_sampled/` - 319,032 файла
- **Ambient**: `background_data_sampled/` - 521,594 файла

### Соотношение:
- **Негативы:Позитивы**: 99.7:1 (норма для wake word!)

---

## 🧠 Обученные модели

### Основная модель:
- **Файл**: `original_library_model.tflite` (50KB)
- **Манифест**: `original_library_model.json`
- **Wake word**: "милый дом / любимый дом"
- **Совместимость**: ESP32S3, ESP32

### ESPHome конфигурация:
```yaml
micro_wake_word:
  models:
    - model: original_library_model.json
      probability_cutoff: 0.95
      sliding_window_size: 5
      tensor_arena_size: 1000000
```

---

## 🔍 Устранение неполадок

### Частые проблемы:

1. **Ошибка `[micro_wake_word] is an invalid option`**:
   - Проверьте формат манифеста: `version: 2`, `type: "micro"`
   - Путь к модели должен быть **ОТНОСИТЕЛЬНЫМ**!

2. **Ошибка Protobuf**:
   - Установите: `pip install protobuf==4.25.5`

3. **Задачи не запускаются**:
   - Проверьте активацию venv
   - Убедитесь что psutil установлен

### Команды отладки:
```bash
./manage_tasks.sh status
./manage_tasks.sh logs <task_name>
./manage_tasks.sh stop-all
./manage_tasks.sh cleanup
```

---

## 📈 Ожидаемые результаты

- **Время выполнения**: ~5 минут
- **Размер модели**: 50KB
- **Wake word**: "милый дом / любимый дом"
- **Совместимость**: ESP32S3, ESP32

---

## 🎯 Wake Word специфика

- **Дисбаланс 100:1** - это норма!
- **100% точность на TTS** - НЕ НОРМАЛЬНО!
- **FRR (False Reject Rate)** - должно быть низким
- **FA/h (False Accepts per Hour)** - главная метрика

---

**Дата обновления**: 2025-01-22  
**Статус**: ✅ **ГОТОВО К ПРОИЗВОДСТВУ**