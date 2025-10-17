#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Telegram бот @alyx_design_bot с улучшенным admin функционалом
"""

import logging
import json
from datetime import datetime
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, MessageHandler, filters, ContextTypes
from typing import Dict, List

# Настройка логирования
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO,
    handlers=[
        logging.FileHandler('bot.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Конфигурация бота
BOT_TOKEN = "8307209669:AAFl5JKEBUPkJ8akr01RfXKwvLTNEoQPLqQ"
OWNER_ID = 1014948227
WEBSITE_URL = "https://www.alyxbabysitter.ru"

# База данных в памяти
class Database:
    def __init__(self):
        self.users: Dict[int, dict] = {}
        self.orders: List[dict] = []
        self.first_time_users: List[int] = []  # Для отслеживания новых пользователей
    
    def add_user(self, user_id: int, user_data: dict):
        """Добавить пользователя"""
        is_new_user = user_id not in self.users
        
        self.users[user_id] = {
            'id': user_id,
            'first_name': user_data.get('first_name', ''),
            'username': user_data.get('username', ''),
            'joined_at': datetime.now(),
            'last_seen': datetime.now(),
            'is_new': is_new_user
        }
        
        if is_new_user:
            self.first_time_users.append(user_id)
        
        return is_new_user
    
    def update_last_seen(self, user_id: int):
        """Обновить время последнего визита"""
        if user_id in self.users:
            self.users[user_id]['last_seen'] = datetime.now()
    
    def get_stats(self):
        """Получить статистику"""
        total_users = len(self.users)
        new_users_today = len([u for u in self.users.values() 
                              if u['joined_at'].date() == datetime.now().date()])
        return {
            'total_users': total_users,
            'new_users_today': new_users_today,
            'orders': len(self.orders)
        }

# Инициализация базы данных
db = Database()

# Сообщения бота
MESSAGES = {
    'welcome_new_user': """🚀 <b>Welcome to the Digital Future</b>

Вы попали к <b>Alyx Babysitter</b> - Digital Human Creator

🧬 <b>Neural Tech Specialist:</b>
• Photo-realistic Digital Humans 
• AI-powered Visual Creation
• Custom Neural Network Training
• Next-gen Digital Transformation

⚡ <b>Technology:</b> Advanced AI + 1000h R&D
🎯 <b>Result:</b> Неотличимо от реальности

Нажмите <b>"🚀 Enter the Matrix"</b> чтобы начать!""",

    'start': """🚀 <b>Alyx Babysitter - Digital Human Creator</b>

Превращаю людей в цифровых персонажей будущего

🧬 <b>AI-Powered Services:</b>
• Digital Human Creation (реалистичные цифровые двойники)
• Neural Photo Generation (AI-фотосессии)
• Cinematic AI Videos (кинематографичные сниппеты)
• Future-Ready Visual Design (дизайн будущего)

⚡ <b>Core Technology:</b> Custom Neural Networks + 1000h Research & Development
🎯 <b>Target:</b> Artists, Brands, Visionaries

Выберите раздел для погружения в будущее 👇""",

    'portfolio': """🚀 <b>Neural Gallery - Портфолио Будущего</b>

Ознакомьтесь с результатами AI-технологий:

🧬 <b>Digital Humans v2.0</b>
Фотореалистичные цифровые личности нового поколения
⚡ 99.9% accuracy to real photos

📷 <b>Neural Photoshoots</b>
Портреты в Cyberpunk, Y2K, Trap эстетике
🎯 Professional-grade AI generations

🎬 <b>Cinematic AI</b>
Короткие ролики с Hollywood-level post-production
🎆 Кинематографическое качество

🎨 <b>Future Design</b>
Обложки и визуалы для артистов и брендов
🚀 Next-gen visual concepts

🔥 <b>Tech Core:</b> Custom neural networks обученные на 1000+ часов R&D

🌐 <b>Full Neural Gallery:</b> www.alyxbabysitter.ru""",

    'services': """🚀 <b>Neural Services - Технологии Будущего</b>

🧬 <b>Digital Human Creation</b>
От 15,000₽ | 2-3 недели
🔬 Custom Neural Network Training по вашим фото
⚡ Результат: Photo-realistic Digital Twin
🎯 Perfect accuracy, endless possibilities

📷 <b>Neural Photo Generation</b>  
От 5,000₽ | 3-5 дней
🚀 AI-powered photoshoots в любой эстетике
🎆 Pack of 10+ high-quality generations
🎭 Cyberpunk, Y2K, Trap, Commercial styles

🎬 <b>Cinematic AI Videos</b>
От 3,000₽ | 2-3 дня
🍿 Hollywood-level короткие ролики (9-15 сек)
⚡ Advanced motion synthesis + professional post-production

🎨 <b>Future Visual Design</b>
От 2,000₽ | 1-2 дня
🚀 Next-gen обложки для релизов
🎆 Trending aesthetics + unique AI concepts

💼 <b>Commercial AI Visuals</b>
От 8,000₽ | 5-7 дней
🎯 Профессиональные визуалы для enterprise-клиентов
📊 Strategy + concept development included

🔥 <b>Core Technology:</b> Custom neural networks trained on 1000+ hours of R&D
🧬 <b>Quality guarantee:</b> Photo-realistic results or money back

📞 Ready to go digital? Кнопка ниже 👇""",

    'contact': """🚀 <b>Neural Connection - Связь с Будущим</b>

🧬 Ready to become digital?
🔥 Want to create something unprecedented?
⚡ Need cutting-edge AI visuals?

🎯 <b>Direct Communication Channels:</b>

💬 <b>Primary:</b> @alyx_babysitter
🌐 <b>Neural Gallery:</b> www.alyxbabysitter.ru
📧 <b>Business inquiries:</b> по запросу

⚡ <b>Response time:</b> 2-3 hours (AI optimization in progress)
🚀 <b>Working hours:</b> 24/7 digital availability

🔥 <b>Why choose Neural Tech:</b>
• Custom-trained neural networks
• 1000+ hours R&D investment  
• Photo-realistic guarantee
• Future-ready results
• For artists, brands, visionaries

🧬 <b>Next step:</b> Опишите вашу идею - let's make it digital reality""",

    'about': """🧬 <b>Neural Profile - О Digital Human Creator</b>

🚀 <b>Alyx Babysitter</b>
Digital Human Creator | Neural Technology Specialist
Превращаю людей в цифровых личностей будущего

🔬 <b>Core Technologies:</b>
• Custom Neural Network Architecture (1000+ hours R&D)
• Advanced Diffusion Models Training
• Photo-realistic Human Synthesis  
• Cinematic AI Video Generation
• Future-ready Visual Concepts

⚡ <b>Competitive Advantage:</b>
Мои neural networks обучены по собственной методике, что даёт results недоступные стандартным AI-сервисам.

🎯 <b>Track Record:</b>
• 100+ successful digital transformations
• Artists & Music Labels partnerships
• Enterprise-level commercial projects  
• Continuous AI research & development
• Future-focused visual innovation

🚀 <b>Vision:</b> Building bridge between human creativity and artificial intelligence

🔥 <b>For:</b> Artists, Brands, Visionaries who think ahead"""
}

# Клавиатуры
def get_welcome_keyboard():
    """Клавиатура для нового пользователя"""
    keyboard = [
        [InlineKeyboardButton("🚀 Enter the Matrix", callback_data="start_bot")]
    ]
    return InlineKeyboardMarkup(keyboard)

def get_main_keyboard():
    """Основная клавиатура"""
    keyboard = [
        [InlineKeyboardButton("🎨 Портфолио", callback_data="portfolio"),
         InlineKeyboardButton("💎 Услуги", callback_data="services")],
        [InlineKeyboardButton("📞 Контакты", callback_data="contact"),
         InlineKeyboardButton("ℹ️ О дизайнере", callback_data="about")],
        [InlineKeyboardButton("📋 Оформить заказ", url="https://t.me/alyx_babysitter")],
        [InlineKeyboardButton("🌐 Открыть сайт", url=WEBSITE_URL)]
    ]
    return InlineKeyboardMarkup(keyboard)

def get_back_keyboard():
    """Клавиатура с кнопкой назад"""
    keyboard = [
        [InlineKeyboardButton("🔙 Назад в меню", callback_data="back_to_main")]
    ]
    return InlineKeyboardMarkup(keyboard)

# Обработчики команд
async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработка команды /start"""
    user = update.effective_user
    is_new_user = db.add_user(user.id, user.to_dict())
    
    if is_new_user:
        # Приветствие для нового пользователя
        await update.message.reply_text(
            MESSAGES['welcome_new_user'],
            parse_mode='HTML',
            reply_markup=get_welcome_keyboard()
        )
    else:
        # Обычное меню для существующих пользователей
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
        reply_markup=get_back_keyboard()
    )

async def services_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработка команды /services"""
    user_id = update.effective_user.id
    db.update_last_seen(user_id)
    
    await update.message.reply_text(
        MESSAGES['services'],
        parse_mode='HTML',
        reply_markup=get_back_keyboard()
    )

async def contact_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработка команды /contact"""
    user_id = update.effective_user.id
    db.update_last_seen(user_id)
    
    await update.message.reply_text(
        MESSAGES['contact'],
        parse_mode='HTML',
        reply_markup=get_back_keyboard()
    )

async def about_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработка команды /about"""
    user_id = update.effective_user.id
    db.update_last_seen(user_id)
    
    await update.message.reply_text(
        MESSAGES['about'],
        parse_mode='HTML',
        reply_markup=get_back_keyboard()
    )

async def stats_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Команда статистики (только для владельца)"""
    user_id = update.effective_user.id
    
    if user_id != OWNER_ID:
        await update.message.reply_text("❌ У вас нет доступа к этой команде")
        return
    
    stats = db.get_stats()
    stats_text = f"""📊 <b>Статистика бота</b>

👥 Всего пользователей: {stats['total_users']}
🆕 Новых за сегодня: {stats['new_users_today']}
📋 Всего заказов: {stats['orders']}

📅 Последнее обновление: {datetime.now().strftime('%d.%m.%Y %H:%M')}"""
    
    await update.message.reply_text(stats_text, parse_mode='HTML')

async def broadcast_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Команда рассылки (только для владельца)"""
    user_id = update.effective_user.id
    
    if user_id != OWNER_ID:
        await update.message.reply_text("❌ У вас нет доступа к этой команде")
        return
    
    # Получаем текст сообщения
    message_text = ' '.join(context.args)
    
    if not message_text:
        await update.message.reply_text(
            """📢 <b>Система рассылки</b>

Использование: /broadcast [сообщение]

Пример:
/broadcast Привет! У меня новые работы на сайте!

Сообщение будет отправлено всем пользователям бота.""",
            parse_mode='HTML'
        )
        return
    
    # Отправляем рассылку
    sent_count = 0
    failed_count = 0
    
    for user_id in db.users:
        try:
            await context.bot.send_message(
                chat_id=user_id,
                text=f"📢 <b>Сообщение от Alyx:</b>\n\n{message_text}",
                parse_mode='HTML'
            )
            sent_count += 1
        except Exception as e:
            failed_count += 1
            logger.error(f"Не удалось отправить сообщение пользователю {user_id}: {e}")
    
    # Отчет о рассылке
    await update.message.reply_text(
        f"""✅ <b>Рассылка завершена</b>

📨 Отправлено: {sent_count}
❌ Ошибок: {failed_count}
👥 Всего пользователей: {len(db.users)}""",
        parse_mode='HTML'
    )

async def admin_help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Справка по admin командам"""
    user_id = update.effective_user.id
    
    if user_id != OWNER_ID:
        await update.message.reply_text("❌ У вас нет доступа к этой команде")
        return
    
    help_text = """👑 <b>Admin команды</b>

📊 /stats - Статистика пользователей
📢 /broadcast [текст] - Рассылка сообщения всем пользователям
❓ /admin_help - Эта справка

<b>Примеры использования:</b>

<code>/broadcast Привет! Новые работы на сайте!</code>
<code>/stats</code>

<b>Автоматические функции:</b>
• Новые пользователи получают приветственное сообщение
• Статистика обновляется автоматически
• Логирование всех действий в bot.log"""
    
    await update.message.reply_text(help_text, parse_mode='HTML')

# Обработчик callback кнопок
async def callback_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработка нажатий на кнопки"""
    query = update.callback_query
    user_id = query.from_user.id
    
    await query.answer()
    db.update_last_seen(user_id)
    
    if query.data == "start_bot":
        # Переход от приветствия к основному меню
        await query.edit_message_text(
            MESSAGES['start'],
            parse_mode='HTML',
            reply_markup=get_main_keyboard()
        )
    
    elif query.data == "portfolio":
        await query.edit_message_text(
            MESSAGES['portfolio'],
            parse_mode='HTML',
            reply_markup=get_back_keyboard()
        )
    
    elif query.data == "services":
        await query.edit_message_text(
            MESSAGES['services'],
            parse_mode='HTML',
            reply_markup=get_back_keyboard()
        )
    
    elif query.data == "contact":
        await query.edit_message_text(
            MESSAGES['contact'],
            parse_mode='HTML',
            reply_markup=get_back_keyboard()
        )
    
    elif query.data == "about":
        await query.edit_message_text(
            MESSAGES['about'],
            parse_mode='HTML',
            reply_markup=get_back_keyboard()
        )
    
    elif query.data == "back_to_main":
        await query.edit_message_text(
            MESSAGES['start'],
            parse_mode='HTML',
            reply_markup=get_main_keyboard()
        )

def main():
    """Основная функция запуска бота"""
    
    # Создаем приложение
    application = Application.builder().token(BOT_TOKEN).build()
    
    # Добавляем обработчики команд
    application.add_handler(CommandHandler("start", start_command))
    application.add_handler(CommandHandler("portfolio", portfolio_command))
    application.add_handler(CommandHandler("services", services_command))
    application.add_handler(CommandHandler("contact", contact_command))
    application.add_handler(CommandHandler("about", about_command))
    
    # Admin команды
    application.add_handler(CommandHandler("stats", stats_command))
    application.add_handler(CommandHandler("broadcast", broadcast_command))
    application.add_handler(CommandHandler("admin_help", admin_help_command))
    
    # Обработчик callback кнопок
    application.add_handler(CallbackQueryHandler(callback_handler))
    
    # Запускаем бота
    logger.info("🚀 Запуск бота @alyx_design_bot с admin функциями...")
    application.run_polling(drop_pending_updates=True)

if __name__ == "__main__":
    main()