# 🚀 Инструкция по развертыванию бота @alyx_design_bot

## 📋 **Готовые файлы:**

✅ **alyx_bot.py** - основная логика и команды  
✅ **alyx_bot_handlers.py** - обработчики callback'ов и заказов  
✅ **main_bot.py** - запускающий файл  
✅ **requirements.txt** - зависимости Python  
✅ **bot-config.json** - конфигурация бота  

## 🛠️ **Способы развертывания:**

### **🖥️ Вариант 1: Локальный сервер/VPS**

#### **Требования:**
- Python 3.8+
- Стабильное интернет-соединение
- Linux/Windows/macOS

#### **Установка:**
```bash
# 1. Скачайте все файлы в папку
mkdir alyx_bot && cd alyx_bot

# 2. Установите зависимости
pip install -r requirements.txt

# 3. Запустите бота
python main_bot.py
```

#### **Автозапуск (Linux):**
```bash
# Создайте systemd service
sudo nano /etc/systemd/system/alyx-bot.service

# Содержимое файла:
[Unit]
Description=Alyx Design Bot
After=network.target

[Service]
Type=simple
User=YOUR_USER
WorkingDirectory=/path/to/alyx_bot
ExecStart=/usr/bin/python3 main_bot.py
Restart=always

[Install]
WantedBy=multi-user.target

# Запустите сервис
sudo systemctl enable alyx-bot.service
sudo systemctl start alyx-bot.service
```

### **☁️ Вариант 2: Heroku (бесплатно)**

#### **Подготовка:**
```bash
# 1. Установите Heroku CLI
# 2. Создайте файл Procfile
echo "web: python main_bot.py" > Procfile

# 3. Создайте runtime.txt
echo "python-3.11.0" > runtime.txt
```

#### **Развертывание:**
```bash
# 1. Инициализируйте Git
git init
git add .
git commit -m "Initial commit"

# 2. Создайте приложение Heroku
heroku create alyx-design-bot

# 3. Деплой
git push heroku main

# 4. Запустите процесс
heroku ps:scale web=1
```

### **🐳 Вариант 3: Docker**

#### **Dockerfile:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["python", "main_bot.py"]
```

#### **Запуск:**
```bash
# Создайте образ
docker build -t alyx-bot .

# Запустите контейнер
docker run -d --name alyx-bot --restart unless-stopped alyx-bot
```

### **⚡ Вариант 4: Railway (рекомендуется)**

1. Зайдите на **railway.app**
2. Подключите GitHub репозиторий
3. Railway автоматически развернет бота
4. Добавьте переменные окружения (если нужно)

## 🔧 **Настройка после развертывания:**

### **1. Проверьте работу бота:**
```bash
# Найдите @alyx_design_bot в Telegram
# Отправьте /start
# Проверьте все команды и кнопки
```

### **2. Проверьте логи:**
```bash
# Файл bot.log будет создан автоматически
tail -f bot.log
```

### **3. Команды для владельца:**
```
/stats - статистика бота
/broadcast Текст сообщения - рассылка подписчикам
```

## 📊 **Возможности бота:**

### **✅ Автоответчик:**
- Ответы на все команды (/start, /portfolio, /services, и т.д.)
- Подробная информация о дизайнере
- Интеграция с Mini App

### **✅ Система заказов:**
- Пошаговое оформление заказа (4 шага)
- 5 типов услуг с ценами
- Автоматические уведомления владельцу
- Сохранение заказов в базе данных

### **✅ Уведомления:**
- Подписка/отписка от новостей
- Команда рассылки `/broadcast`
- Уведомления о новых заказах

### **✅ Аналитика:**
- База данных пользователей
- Статистика заказов
- Команда `/stats` для владельца

## 🛡️ **Безопасность:**

### **Настройки владельца:**
```python
OWNER_ID = 1014948227  # Ваш ID
```

### **Команды только для владельца:**
- `/broadcast` - рассылка
- `/stats` - статистика

## 🔄 **Обновления:**

### **Добавление новых функций:**
1. Редактируйте файлы бота
2. Перезапустите сервис
3. Тестируйте новый функционал

### **Изменение цен/услуг:**
Редактируйте `SERVICES_DATA` в файле `alyx_bot_handlers.py`

### **Изменение текстов:**
Редактируйте `MESSAGES` в файле `alyx_bot.py`

## 📱 **Интеграция с Mini App:**

Бот полностью совместим с настроенным Mini App:
- Кнопка Menu работает
- Web App интеграция активна
- Переходы между ботом и сайтом плавные

## 🆘 **Troubleshooting:**

### **Бот не отвечает:**
```bash
# Проверьте токен
# Проверьте интернет-соединение
# Посмотрите логи: tail -f bot.log
```

### **Ошибки в логах:**
```bash
# Обновите зависимости
pip install --upgrade -r requirements.txt

# Перезапустите бота
```

### **Заказы не приходят:**
```bash
# Проверьте OWNER_ID в коде
# Убедитесь, что бот может отправлять сообщения
```

## 🎯 **Готово к использованию!**

После развертывания ваш бот будет:
- ✅ Отвечать на все команды
- ✅ Принимать заказы
- ✅ Отправлять уведомления
- ✅ Собирать статистику
- ✅ Работать с Mini App

**📞 Поддержка:** При возникновении проблем проверьте логи или обратитесь к разработчику.