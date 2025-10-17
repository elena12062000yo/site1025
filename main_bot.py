#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Главный файл для запуска Telegram бота @alyx_design_bot
"""

import logging
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, MessageHandler, filters
from alyx_bot import (
    start_command, portfolio_command, services_command, 
    contact_command, about_command, help_command, BOT_TOKEN
)
from alyx_bot_handlers import (
    callback_handler, handle_order_text, broadcast_command, stats_command
)

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
    application.add_handler(CommandHandler("help", help_command))
    
    # Команды для владельца
    application.add_handler(CommandHandler("broadcast", broadcast_command))
    application.add_handler(CommandHandler("stats", stats_command))
    
    # Обработчик callback кнопок
    application.add_handler(CallbackQueryHandler(callback_handler))
    
    # Обработчик текстовых сообщений (для заказов)
    application.add_handler(MessageHandler(
        filters.TEXT & ~filters.COMMAND, 
        handle_order_text
    ))
    
    # Запускаем бота
    logger.info("🚀 Запуск бота @alyx_design_bot...")
    application.run_polling(allowed_updates=["message", "callback_query"])

if __name__ == "__main__":
    main()