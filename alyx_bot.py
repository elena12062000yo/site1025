#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Telegram бот для AI-дизайнера Alyx Babysitter
Автоответчик + Система заказов + Уведомления
"""

import logging
import asyncio
from datetime import datetime, timedelta
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebApp
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, MessageHandler, filters, ContextTypes
import json
import os
from typing import Dict, List

# Настройка логирования
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Конфигурация бота
BOT_TOKEN = "8307209669:AAFl5JKEBUPkJ8akr01RfXKwvLTNEoQPLqQ"
OWNER_ID = 1014948227
WEBSITE_URL = "https://www.alyxbabysitter.ru"

# База данных в памяти (в продакшене используйте SQLite/PostgreSQL)
class Database:
    def __init__(self):
        self.users: Dict[int, dict] = {}
        self.orders: List[dict] = []
        self.subscribers: List[int] = []
    
    def add_user(self, user_id: int, user_data: dict):
        """Добавить пользователя"""
        self.users[user_id] = {
            'id': user_id,
            'first_name': user_data.get('first_name', ''),
            'username': user_data.get('username', ''),
            'joined_at': datetime.now(),
            'last_seen': datetime.now()
        }
    
    def update_last_seen(self, user_id: int):
        """Обновить время последнего визита"""
        if user_id in self.users:
            self.users[user_id]['last_seen'] = datetime.now()
    
    def add_order(self, order_data: dict):
        """Добавить заказ"""
        order_data['id'] = len(self.orders) + 1
        order_data['created_at'] = datetime.now()
        order_data['status'] = 'new'
        self.orders.append(order_data)
        return order_data['id']
    
    def subscribe_user(self, user_id: int):
        """Подписать на уведомления"""
        if user_id not in self.subscribers:
            self.subscribers.append(user_id)
    
    def unsubscribe_user(self, user_id: int):
        """Отписать от уведомлений"""
        if user_id in self.subscribers:
            self.subscribers.remove(user_id)

# Инициализация базы данных
db = Database()

# Тексты сообщений
MESSAGES = {
    'start': """🎨 <b>Добро пожаловать в мир AI-дизайна!</b>

Я Alyx Babysitter — AI-дизайнер, создаю:
• 🤖 Цифровые двойники
• 📸 AI-фотосессии  
• 🎬 Видео-сниппеты
• 🎨 Обложки и дизайн
• 💼 Коммерческие съемки

<i>Быстро, чисто и системно.</i>

🔥 <b>Нажмите Menu внизу, чтобы открыть портфолио!</b>""",

    'portfolio': """🎨 <b>Мое портфолио</b>

Посмотрите мои работы на сайте или выберите категорию:

• AI-портреты в стиле Y2K/трэп
• Реалистичные цифровые двойники артистов
• AI-фотосессии для брендов
• Кинематографичные видео-сниппеты
• Обложки релизов и дизайн

🌐 Полное портфолио: www.alyxbabysitter.ru""",

    'services': """💎 <b>Услуги и цены</b>

🤖 <b>Цифровой двойник</b>
От 15,000₽ | 2-3 недели
Создание AI-модели по вашим фото

📸 <b>AI-фотосессия</b>  
От 5,000₽ | 3-5 дней
Пакет от 10 фотографий

🎬 <b>AI-сниппет</b>
От 3,000₽ | 2-3 дня
Короткий ролик 9-15 секунд

🎨 <b>Дизайн обложки</b>
От 2,000₽ | 1-2 дня
Обложка для релиза/проекта

💼 <b>Коммерческая съемка</b>
От 8,000₽ | 5-7 дней
Рекламные визуалы для бизнеса

📞 Для заказа нажмите "Оформить заказ" ниже""",

    'about': """ℹ️ <b>О дизайнере</b>

👨‍🎨 <b>Alyx Babysitter</b>
AI-дизайнер и визуальный артист

🎯 <b>Специализация:</b>
• Создание цифровых двойников
• AI-генерация изображений
• Обучение нейросетей
• Визуальный дизайн

💼 <b>Опыт работы:</b>
• 100+ проектов выполнено
• Работа с артистами и лейблами
• Коммерческие проекты для брендов

🏆 <b>Подход к работе:</b>
Быстро, чисто и системно. Каждый проект — это уникальное техническое решение с фокусом на детали и качество.

📱 Telegram: @alyx_babysitter""",

    'help': """❓ <b>Помощь</b>

🚀 <b>Как сделать заказ:</b>
1. Выберите услугу в разделе "Услуги"
2. Нажмите "Оформить заказ"
3. Заполните бриф
4. Ожидайте связи в течение часа

💬 <b>Команды бота:</b>
/start - Главная страница
/portfolio - Портфолио
/services - Услуги и цены  
/contact - Контакты
/about - О дизайнере

🌐 <b>Полное портфолио:</b>
www.alyxbabysitter.ru

📞 <b>Прямая связь:</b>
@alyx_babysitter в Telegram

⚡ Обычно отвечаю в течение 30 минут!""",

    'contact': """📞 <b>Контакты</b>

🎯 <b>Готовы начать проект?</b>

📱 <b>Telegram:</b> @alyx_babysitter
🌐 <b>Сайт:</b> www.alyxbabysitter.ru
⏰ <b>Время работы:</b> 10:00 - 22:00 MSK

💬 <b>Способы связи:</b>
• Написать в личные сообщения
• Оформить заказ через бота
• Открыть портфолио через Menu

🚀 <b>Как происходит работа:</b>
1. Обсуждаем задачу и бюджет
2. Заключаем договор, 50% предоплата  
3. Выполняю работу с промежуточными показами
4. Финальная приемка и доплата

⚡ <i>Обычно отвечаю в течение 30 минут!</i>"""
}

# Клавиатуры
def get_main_keyboard():
    """Главная клавиатура"""
    keyboard = [
        [
            InlineKeyboardButton("🎨 Портфолио", callback_data="portfolio"),
            InlineKeyboardButton("💎 Услуги", callback_data="services")
        ],
        [
            InlineKeyboardButton("📞 Контакты", callback_data="contact"),
            InlineKeyboardButton("ℹ️ О дизайнере", callback_data="about")
        ],
        [
            InlineKeyboardButton("🌐 Открыть сайт", web_app=WebApp(url=WEBSITE_URL))
        ],
        [
            InlineKeyboardButton("🔔 Подписаться на новости", callback_data="subscribe")
        ]
    ]
    return InlineKeyboardMarkup(keyboard)

def get_services_keyboard():
    """Клавиатура услуг"""
    keyboard = [
        [
            InlineKeyboardButton("🤖 Цифровой двойник", callback_data="order_twin"),
            InlineKeyboardButton("📸 AI-фотосессия", callback_data="order_photo")
        ],
        [
            InlineKeyboardButton("🎬 AI-сниппет", callback_data="order_video"),
            InlineKeyboardButton("🎨 Обложка", callback_data="order_cover")
        ],
        [
            InlineKeyboardButton("💼 Коммерческая съемка", callback_data="order_commercial")
        ],
        [
            InlineKeyboardButton("🔙 Назад", callback_data="back_to_main")
        ]
    ]
    return InlineKeyboardMarkup(keyboard)

def get_portfolio_keyboard():
    """Клавиатура портфолио"""
    keyboard = [
        [
            InlineKeyboardButton("🌐 Полное портфолио", web_app=WebApp(url=WEBSITE_URL))
        ],
        [
            InlineKeyboardButton("🤖 Цифровые двойники", callback_data="portfolio_twins"),
            InlineKeyboardButton("📸 AI-фотосессии", callback_data="portfolio_photos")
        ],
        [
            InlineKeyboardButton("🎬 Видео-сниппеты", callback_data="portfolio_videos"),
            InlineKeyboardButton("🎨 Обложки", callback_data="portfolio_covers")
        ],
        [
            InlineKeyboardButton("🔙 Назад", callback_data="back_to_main")
        ]
    ]
    return InlineKeyboardMarkup(keyboard)

# Обработчики команд
async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработка команды /start"""
    user = update.effective_user
    db.add_user(user.id, user.to_dict())
    
    await update.message.reply_text(
        MESSAGES['start'],
        parse_mode='HTML',
        reply_markup=get_main_keyboard()
    )

async def portfolio_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработка команды /portfolio"""
    user_id = update.effective_user.id
    db.update_last_seen(user_id)
    
    await update.message.reply_text(
        MESSAGES['portfolio'],
        parse_mode='HTML',
        reply_markup=get_portfolio_keyboard()
    )

async def services_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработка команды /services"""
    user_id = update.effective_user.id
    db.update_last_seen(user_id)
    
    await update.message.reply_text(
        MESSAGES['services'],
        parse_mode='HTML',
        reply_markup=get_services_keyboard()
    )

async def contact_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработка команды /contact"""
    user_id = update.effective_user.id
    db.update_last_seen(user_id)
    
    keyboard = [
        [InlineKeyboardButton("💬 Написать @alyx_babysitter", url="https://t.me/alyx_babysitter")],
        [InlineKeyboardButton("📋 Оформить заказ", callback_data="start_order")],
        [InlineKeyboardButton("🌐 Открыть сайт", web_app=WebApp(url=WEBSITE_URL))],
        [InlineKeyboardButton("🔙 Назад", callback_data="back_to_main")]
    ]
    
    await update.message.reply_text(
        MESSAGES['contact'],
        parse_mode='HTML',
        reply_markup=InlineKeyboardMarkup(keyboard)
    )

async def about_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработка команды /about"""
    user_id = update.effective_user.id
    db.update_last_seen(user_id)
    
    keyboard = [
        [InlineKeyboardButton("📱 Написать в Telegram", url="https://t.me/alyx_babysitter")],
        [InlineKeyboardButton("🌐 Посмотреть портфолио", web_app=WebApp(url=WEBSITE_URL))],
        [InlineKeyboardButton("🔙 Назад", callback_data="back_to_main")]
    ]
    
    await update.message.reply_text(
        MESSAGES['about'],
        parse_mode='HTML',
        reply_markup=InlineKeyboardMarkup(keyboard)
    )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработка команды /help"""
    user_id = update.effective_user.id
    db.update_last_seen(user_id)
    
    await update.message.reply_text(
        MESSAGES['help'],
        parse_mode='HTML',
        reply_markup=get_main_keyboard()
    )

# Продолжение в следующем файле...