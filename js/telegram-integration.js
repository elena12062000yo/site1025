// Telegram Web App Integration
class TelegramIntegration {
    constructor() {
        this.tg = window.Telegram?.WebApp;
        this.init();
    }

    init() {
        // Проверяем, запущено ли приложение в Telegram
        if (this.tg) {
            console.log('🚀 Telegram Web App initialized');
            
            // Настройка темы
            this.setupTheme();
            
            // Настройка главной кнопки
            this.setupMainButton();
            
            // Настройка обратной кнопки
            this.setupBackButton();
            
            // Расширяем приложение на весь экран
            this.tg.expand();
            
            // Включаем вертикальные свайпы
            this.tg.enableVerticalSwipes();
            
            // Готово к показу
            this.tg.ready();
            
            // Отправляем событие готовности
            this.sendReadyEvent();
            
        } else {
            console.log('📱 Running outside Telegram');
        }
    }

    setupTheme() {
        if (!this.tg) return;
        
        // Применяем темную тему
        document.documentElement.style.setProperty('--tg-theme-bg-color', this.tg.themeParams.bg_color || '#000000');
        document.documentElement.style.setProperty('--tg-theme-text-color', this.tg.themeParams.text_color || '#ffffff');
        document.documentElement.style.setProperty('--tg-theme-hint-color', this.tg.themeParams.hint_color || '#708499');
        document.documentElement.style.setProperty('--tg-theme-link-color', this.tg.themeParams.link_color || '#6ab7ff');
        document.documentElement.style.setProperty('--tg-theme-button-color', this.tg.themeParams.button_color || '#5288c1');
        document.documentElement.style.setProperty('--tg-theme-button-text-color', this.tg.themeParams.button_text_color || '#ffffff');
        
        // Применяем цвет хедера
        this.tg.setHeaderColor('#000000');
        
        console.log('🎨 Telegram theme applied');
    }

    setupMainButton() {
        if (!this.tg) return;
        
        // Настраиваем главную кнопку для контактов
        this.tg.MainButton.setText('Связаться со мной');
        this.tg.MainButton.color = '#9ca3af';
        this.tg.MainButton.textColor = '#ffffff';
        
        // Обработчик нажатия на главную кнопку
        this.tg.MainButton.onClick(() => {
            this.openContactForm();
        });
        
        // Показываем кнопку на странице контактов
        this.updateMainButtonVisibility();
    }

    setupBackButton() {
        if (!this.tg) return;
        
        // Обработчик кнопки "Назад"
        this.tg.BackButton.onClick(() => {
            // Если мы в модальном окне, закрываем его
            const modal = document.querySelector('[data-modal-backdrop]');
            if (modal) {
                modal.click();
                return;
            }
            
            // Если не на главной странице, возвращаемся на главную
            if (window.currentPage !== 'home') {
                window.showPage('home');
            }
        });
    }

    updateMainButtonVisibility() {
        if (!this.tg) return;
        
        // Показываем главную кнопку только на странице контактов
        const currentPage = window.currentPage || 'home';
        
        if (currentPage === 'contact') {
            this.tg.MainButton.show();
        } else {
            this.tg.MainButton.hide();
        }
        
        // Показываем кнопку "Назад" везде кроме главной
        if (currentPage !== 'home') {
            this.tg.BackButton.show();
        } else {
            this.tg.BackButton.hide();
        }
    }

    openContactForm() {
        // Переключаемся на страницу контактов
        window.showPage('contact');
        
        // Прокручиваем к форме
        setTimeout(() => {
            const contactForm = document.querySelector('#contact-form');
            if (contactForm) {
                contactForm.scrollIntoView({ behavior: 'smooth' });
            }
        }, 300);
        
        // Отправляем хаптик фидбек
        this.tg.HapticFeedback?.impactOccurred('medium');
    }

    sendReadyEvent() {
        if (!this.tg) return;
        
        // Отправляем данные пользователя боту (если нужно)
        const userData = {
            user: this.tg.initDataUnsafe?.user,
            start_param: this.tg.initDataUnsafe?.start_param,
            theme: this.tg.colorScheme,
            viewport: {
                width: this.tg.viewportWidth,
                height: this.tg.viewportHeight
            }
        };
        
        console.log('👤 Telegram user data:', userData);
        
        // Можно отправить данные на ваш сервер для аналитики
        // fetch('/api/telegram-analytics', { method: 'POST', body: JSON.stringify(userData) });
    }

    // Методы для взаимодействия с Telegram
    showAlert(message) {
        if (this.tg) {
            this.tg.showAlert(message);
        } else {
            alert(message);
        }
    }

    showConfirm(message, callback) {
        if (this.tg) {
            this.tg.showConfirm(message, callback);
        } else {
            const result = confirm(message);
            callback(result);
        }
    }

    hapticFeedback(type = 'medium') {
        if (this.tg?.HapticFeedback) {
            this.tg.HapticFeedback.impactOccurred(type);
        }
    }

    shareToStory(mediaUrl, text = '') {
        if (this.tg) {
            this.tg.shareToStory(mediaUrl, {
                text: text,
                widget_link: {
                    url: window.location.href,
                    name: 'Alyx Portfolio'
                }
            });
        }
    }

    openTelegramLink(username) {
        if (this.tg) {
            this.tg.openTelegramLink(`https://t.me/${username}`);
        } else {
            window.open(`https://t.me/${username}`, '_blank');
        }
    }

    openLink(url) {
        if (this.tg) {
            this.tg.openLink(url);
        } else {
            window.open(url, '_blank');
        }
    }

    close() {
        if (this.tg) {
            this.tg.close();
        }
    }
}

// Глобальная переменная для Telegram интеграции
let telegramApp = null;

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    telegramApp = new TelegramIntegration();
    
    // Добавляем класс для Telegram стилей
    if (window.Telegram?.WebApp) {
        document.body.classList.add('telegram-web-app');
    }
});

// Обновляем видимость кнопок при смене страниц
document.addEventListener('page-changed', (event) => {
    if (telegramApp) {
        telegramApp.updateMainButtonVisibility();
    }
});

// Экспортируем для использования в других скриптах
window.telegramApp = telegramApp;