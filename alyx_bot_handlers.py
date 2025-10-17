# -*- coding: utf-8 -*-
"""
Обработчики callback'ов и система заказов
"""

from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes
import json

# Данные о услугах
SERVICES_DATA = {
    'order_twin': {
        'name': '🤖 Цифровой двойник',
        'price': 'От 15,000₽',
        'time': '2-3 недели',
        'description': 'Создание реалистичной AI-модели по вашим фотографиям'
    },
    'order_photo': {
        'name': '📸 AI-фотосессия',
        'price': 'От 5,000₽', 
        'time': '3-5 дней',
        'description': 'Пакет AI-фотографий в любой стилистике'
    },
    'order_video': {
        'name': '🎬 AI-сниппет',
        'price': 'От 3,000₽',
        'time': '2-3 дня', 
        'description': 'Короткий кинематографичный ролик 9-15 секунд'
    },
    'order_cover': {
        'name': '🎨 Обложка релиза',
        'price': 'От 2,000₽',
        'time': '1-2 дня',
        'description': 'Дизайн обложки для музыкального релиза'
    },
    'order_commercial': {
        'name': '💼 Коммерческая съемка',
        'price': 'От 8,000₽',
        'time': '5-7 дней',
        'description': 'Рекламные визуалы для продукта или услуги'
    }
}

# Состояния заказа
ORDER_STATES = {}

async def callback_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработчик всех callback запросов"""
    query = update.callback_query
    await query.answer()
    
    user_id = query.from_user.id
    data = query.data
    
    # Импортируем из основного файла
    from alyx_bot import db, MESSAGES, get_main_keyboard, get_services_keyboard, get_portfolio_keyboard, WEBSITE_URL, OWNER_ID
    
    # Обновляем время последнего визита
    db.update_last_seen(user_id)
    
    # Основная навигация
    if data == "back_to_main":
        await query.edit_message_text(
            MESSAGES['start'],
            parse_mode='HTML',
            reply_markup=get_main_keyboard()
        )
    
    elif data == "portfolio":
        await query.edit_message_text(
            MESSAGES['portfolio'],
            parse_mode='HTML',
            reply_markup=get_portfolio_keyboard()
        )
    
    elif data == "services":
        await query.edit_message_text(
            MESSAGES['services'],
            parse_mode='HTML',
            reply_markup=get_services_keyboard()
        )
    
    elif data == "contact":
        keyboard = [
            [InlineKeyboardButton("💬 Написать @alyx_babysitter", url="https://t.me/alyx_babysitter")],
            [InlineKeyboardButton("📋 Оформить заказ", callback_data="start_order")],
            [InlineKeyboardButton("🌐 Открыть сайт", web_app={"url": WEBSITE_URL})],
            [InlineKeyboardButton("🔙 Назад", callback_data="back_to_main")]
        ]
        
        await query.edit_message_text(
            MESSAGES['contact'],
            parse_mode='HTML',
            reply_markup=InlineKeyboardMarkup(keyboard)
        )
    
    elif data == "about":
        keyboard = [
            [InlineKeyboardButton("📱 Написать в Telegram", url="https://t.me/alyx_babysitter")],
            [InlineKeyboardButton("🌐 Посмотреть портфолио", web_app={"url": WEBSITE_URL})],
            [InlineKeyboardButton("🔙 Назад", callback_data="back_to_main")]
        ]
        
        await query.edit_message_text(
            MESSAGES['about'],
            parse_mode='HTML',
            reply_markup=InlineKeyboardMarkup(keyboard)
        )
    
    # Подписка на новости
    elif data == "subscribe":
        db.subscribe_user(user_id)
        
        keyboard = [
            [InlineKeyboardButton("🔕 Отписаться", callback_data="unsubscribe")],
            [InlineKeyboardButton("🔙 Назад", callback_data="back_to_main")]
        ]
        
        await query.edit_message_text(
            "🔔 <b>Подписка активирована!</b>\n\nТеперь вы будете получать уведомления о новых работах и специальных предложениях.\n\n<i>Обычно отправляю 1-2 сообщения в неделю.</i>",
            parse_mode='HTML',
            reply_markup=InlineKeyboardMarkup(keyboard)
        )
    
    elif data == "unsubscribe":
        db.unsubscribe_user(user_id)
        
        await query.edit_message_text(
            "🔕 <b>Подписка отключена</b>\n\nВы больше не будете получать уведомления.\n\nЕсли передумаете, всегда можете подписаться снова!",
            parse_mode='HTML',
            reply_markup=get_main_keyboard()
        )
    
    # Система заказов
    elif data.startswith("order_"):
        service = SERVICES_DATA.get(data)
        if service:
            keyboard = [
                [InlineKeyboardButton("📋 Оформить заказ", callback_data=f"create_{data}")],
                [InlineKeyboardButton("💬 Обсудить детали", url="https://t.me/alyx_babysitter")],
                [InlineKeyboardButton("🔙 К услугам", callback_data="services")]
            ]
            
            message = f"""<b>{service['name']}</b>

💰 <b>Стоимость:</b> {service['price']}
⏰ <b>Сроки:</b> {service['time']}

📝 <b>Что включено:</b>
{service['description']}

<b>Процесс работы:</b>
1. Обсуждаем техническое задание
2. Заключаем договор, 50% предоплата
3. Выполняю работу с промежуточными показами
4. Финальная приемка и доплата

💬 <i>Можем обсудить детали и скорректировать под ваш бюджет!</i>"""
            
            await query.edit_message_text(
                message,
                parse_mode='HTML',
                reply_markup=InlineKeyboardMarkup(keyboard)
            )
    
    elif data.startswith("create_order_"):
        service_type = data.replace("create_", "")
        service = SERVICES_DATA.get(service_type)
        
        if service:
            # Инициализируем заказ
            ORDER_STATES[user_id] = {
                'service_type': service_type,
                'service_name': service['name'],
                'step': 'name'
            }
            
            keyboard = [[InlineKeyboardButton("❌ Отменить", callback_data="cancel_order")]]
            
            await query.edit_message_text(
                f"""📋 <b>Оформление заказа: {service['name']}</b>

<b>Шаг 1 из 4:</b> Как к вам обращаться?

Напишите ваше имя или никнейм следующим сообщением.""",
                parse_mode='HTML',
                reply_markup=InlineKeyboardMarkup(keyboard)
            )
    
    elif data == "cancel_order":
        if user_id in ORDER_STATES:
            del ORDER_STATES[user_id]
        
        await query.edit_message_text(
            "❌ <b>Заказ отменен</b>\n\nВы можете оформить заказ в любое время!",
            parse_mode='HTML',
            reply_markup=get_main_keyboard()
        )
    
    # Портфолио категории
    elif data.startswith("portfolio_"):
        category_messages = {
            'portfolio_twins': "🤖 <b>Цифровые двойники</b>\n\nРеалистичные AI-модели артистов для использования в контенте, клипах и рекламных кампаниях.",
            'portfolio_photos': "📸 <b>AI-фотосессии</b>\n\nПолностью сгенерированные фотосессии для брендов одежды и коммерческих проектов.",
            'portfolio_videos': "🎬 <b>Видео-сниппеты</b>\n\nКинематографичные короткие ролики для TikTok/Reels и музыкальных релизов.",
            'portfolio_covers': "🎨 <b>Обложки релизов</b>\n\nДизайн обложек для музыкальных релизов с использованием AI."
        }
        
        message = category_messages.get(data, "Категория не найдена")
        
        keyboard = [
            [InlineKeyboardButton("🌐 Смотреть на сайте", web_app={"url": WEBSITE_URL})],
            [InlineKeyboardButton("📋 Заказать похожее", callback_data="start_order")],
            [InlineKeyboardButton("🔙 К портфолио", callback_data="portfolio")]
        ]
        
        await query.edit_message_text(
            message,
            parse_mode='HTML',
            reply_markup=InlineKeyboardMarkup(keyboard)
        )
    
    elif data == "start_order":
        await query.edit_message_text(
            "💎 <b>Выберите услугу для заказа:</b>",
            parse_mode='HTML',
            reply_markup=get_services_keyboard()
        )

async def handle_order_text(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработка текстовых сообщений для заказов"""
    user_id = update.effective_user.id
    
    if user_id not in ORDER_STATES:
        return  # Пользователь не в процессе заказа
    
    from alyx_bot import db, OWNER_ID
    
    order_state = ORDER_STATES[user_id]
    text = update.message.text
    
    if order_state['step'] == 'name':
        order_state['name'] = text
        order_state['step'] = 'contact'
        
        keyboard = [[InlineKeyboardButton("❌ Отменить", callback_data="cancel_order")]]
        
        await update.message.reply_text(
            f"""📋 <b>Оформление заказа: {order_state['service_name']}</b>

<b>Шаг 2 из 4:</b> Контакты

Как с вами связаться? Напишите:
• Telegram: @username
• Телефон: +7 (xxx) xxx-xx-xx  
• Email: example@mail.com

Или любой удобный способ связи.""",
            parse_mode='HTML',
            reply_markup=InlineKeyboardMarkup(keyboard)
        )
    
    elif order_state['step'] == 'contact':
        order_state['contact'] = text
        order_state['step'] = 'budget'
        
        keyboard = [[InlineKeyboardButton("❌ Отменить", callback_data="cancel_order")]]
        
        await update.message.reply_text(
            f"""📋 <b>Оформление заказа: {order_state['service_name']}</b>

<b>Шаг 3 из 4:</b> Бюджет

Какой у вас бюджет на проект?

Можете написать:
• Конкретную сумму
• Диапазон (например: 5,000-10,000₽)
• "Обсудим" - если хотите узнать стоимость""",
            parse_mode='HTML',
            reply_markup=InlineKeyboardMarkup(keyboard)
        )
    
    elif order_state['step'] == 'budget':
        order_state['budget'] = text
        order_state['step'] = 'description'
        
        keyboard = [[InlineKeyboardButton("❌ Отменить", callback_data="cancel_order")]]
        
        await update.message.reply_text(
            f"""📋 <b>Оформление заказа: {order_state['service_name']}</b>

<b>Шаг 4 из 4:</b> Описание проекта

Расскажите подробнее о вашем проекте:
• Что именно нужно создать?
• Какая стилистика?
• Есть ли референсы?
• Особые пожелания?

Чем больше деталей, тем точнее смогу оценить проект!""",
            parse_mode='HTML',
            reply_markup=InlineKeyboardMarkup(keyboard)
        )
    
    elif order_state['step'] == 'description':
        order_state['description'] = text
        
        # Сохраняем заказ
        order_data = {
            'user_id': user_id,
            'username': update.effective_user.username or 'Не указан',
            'first_name': update.effective_user.first_name or 'Не указано',
            'service_type': order_state['service_type'],
            'service_name': order_state['service_name'],
            'name': order_state['name'],
            'contact': order_state['contact'],
            'budget': order_state['budget'],
            'description': order_state['description']
        }
        
        order_id = db.add_order(order_data)
        
        # Удаляем состояние заказа
        del ORDER_STATES[user_id]
        
        # Отправляем подтверждение клиенту
        await update.message.reply_text(
            f"""✅ <b>Заказ #{order_id} оформлен!</b>

<b>Что дальше:</b>
• Свяжусь с вами в течение часа
• Обсудим все детали проекта  
• При необходимости скорректируем бюджет
• Заключим договор и приступим к работе

<b>Ваши данные:</b>
📋 Услуга: {order_state['service_name']}
👤 Имя: {order_state['name']}
📞 Контакт: {order_state['contact']}
💰 Бюджет: {order_state['budget']}

📱 Также можете написать напрямую: @alyx_babysitter

<i>Спасибо за доверие! 🙏</i>""",
            parse_mode='HTML'
        )
        
        # Отправляем уведомление владельцу
        owner_message = f"""🔔 <b>Новый заказ #{order_id}</b>

<b>Клиент:</b>
👤 {order_data['first_name']} (@{order_data['username']})
🆔 ID: {user_id}

<b>Заказ:</b>
📋 {order_data['service_name']}
💰 Бюджет: {order_data['budget']}
📞 Контакт: {order_data['contact']}

<b>Описание проекта:</b>
{order_data['description']}

<i>Время заказа: {order_data.get('created_at', 'Не указано')}</i>"""
        
        try:
            await context.bot.send_message(
                chat_id=OWNER_ID,
                text=owner_message,
                parse_mode='HTML'
            )
        except Exception as e:
            print(f"Ошибка отправки уведомления владельцу: {e}")

# Функция для отправки уведомлений подписчикам
async def broadcast_message(context: ContextTypes.DEFAULT_TYPE, message: str, parse_mode='HTML'):
    """Отправка сообщения всем подписчикам"""
    from alyx_bot import db
    
    sent_count = 0
    failed_count = 0
    
    for subscriber_id in db.subscribers:
        try:
            await context.bot.send_message(
                chat_id=subscriber_id,
                text=message,
                parse_mode=parse_mode
            )
            sent_count += 1
        except Exception as e:
            failed_count += 1
            print(f"Не удалось отправить сообщение пользователю {subscriber_id}: {e}")
    
    # Отправляем статистику владельцу
    stats_message = f"""📊 <b>Статистика рассылки:</b>

✅ Отправлено: {sent_count}
❌ Не доставлено: {failed_count}
👥 Всего подписчиков: {len(db.subscribers)}"""
    
    try:
        from alyx_bot import OWNER_ID
        await context.bot.send_message(
            chat_id=OWNER_ID,
            text=stats_message,
            parse_mode='HTML'
        )
    except Exception as e:
        print(f"Ошибка отправки статистики: {e}")

# Команда для отправки рассылки (только для владельца)
async def broadcast_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Команда рассылки (только для владельца)"""
    from alyx_bot import OWNER_ID
    
    if update.effective_user.id != OWNER_ID:
        await update.message.reply_text("❌ У вас нет прав для использования этой команды.")
        return
    
    if not context.args:
        await update.message.reply_text(
            """📢 <b>Команда рассылки</b>

<b>Использование:</b>
/broadcast <текст сообщения>

<b>Пример:</b>
/broadcast 🎉 Новая работа в портфолио! Посмотрите AI-портреты в стиле Y2K.""",
            parse_mode='HTML'
        )
        return
    
    message = ' '.join(context.args)
    await broadcast_message(context, f"🔔 <b>Новости от Alyx Babysitter</b>\n\n{message}")
    await update.message.reply_text("✅ Рассылка запущена!")

# Команда для получения статистики (только для владельца)
async def stats_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Статистика бота (только для владельца)"""
    from alyx_bot import db, OWNER_ID
    
    if update.effective_user.id != OWNER_ID:
        await update.message.reply_text("❌ У вас нет прав для использования этой команды.")
        return
    
    total_users = len(db.users)
    total_orders = len(db.orders)
    total_subscribers = len(db.subscribers)
    
    # Считаем новых пользователей за последнюю неделю
    from datetime import datetime, timedelta
    week_ago = datetime.now() - timedelta(days=7)
    new_users_week = sum(1 for user in db.users.values() if user['joined_at'] > week_ago)
    
    stats_message = f"""📊 <b>Статистика бота</b>

👥 <b>Пользователи:</b>
• Всего: {total_users}
• Новых за неделю: {new_users_week}
• Подписчиков: {total_subscribers}

📋 <b>Заказы:</b>
• Всего заказов: {total_orders}

🎯 <b>Популярные команды:</b>
• /start, /portfolio, /services

⏰ <b>Обновлено:</b> {datetime.now().strftime('%d.%m.%Y %H:%M')}"""
    
    await update.message.reply_text(stats_message, parse_mode='HTML')