// Internationalization system
const translations = {
    ru: {
        // Navigation
        home: 'Главная',
        services: 'Услуги',
        course: 'Курс',
        about: 'Обо мне',
        
        // Common
        allCategories: 'Все',
        back: 'Назад',
        close: 'Закрыть',
        
        // Header
        headerTitle: 'Alyx Babysitter',
        headerSubtitle: 'AI-визуалы и цифровые двойники',
        leaveRequest: 'Оставить заявку',
        writeTelegram: 'Написать в Telegram',
        
        // Case details
        whatWasDone: 'Что было сделано',
        audience: 'Для кого',
        orderSimilar: 'Заказать похожее',
        
        // Services
        servicesTitle: 'Услуги и цены',
        service1Title: 'Цифровой двойник',
        service1Desc: 'Создание вашего реалистичного AI-аватара для контента.',
        service2Title: 'AI-фотосессия',
        service2Desc: 'Пакеты AI-фотографий в любой заданной эстетике.',
        service3Title: 'AI-сниппет',
        service3Desc: 'Короткие кинематографичные ролики для релизов и промо.',
        service4Title: 'Дизайн',
        service4Desc: 'Обложки, постеры и другой контент с помощью AI.',
        
        // FAQ
        faqTitle: 'Частые вопросы',
        faq1Title: 'Какие сроки?',
        faq1Answer: 'От 3 дней на фотосессию до 2-3 недель на создание двойника, в зависимости от сложности.',
        faq2Title: 'Что я получу?',
        faq2Answer: 'Готовые файлы в высоком разрешении (JPG, PNG, MP4) под ваши задачи.',
        faq3Title: 'Как происходит работа?',
        faq3Answer: 'Мы обсуждаем задачу, я готовлю референсы, вы утверждаете, я выполняю работу и вносим правки.',
        
        // Course
        courseTitle: 'Цифровой двойник',
        courseDescription: 'Создавайте безлимитный контент с вашим лицом за 1 клик',
        courseProgramTitle: '3 МОДУЛЯ = 3 НЕДЕЛИ',
        courseProgramItems: [
            'Модуль 1: Подготовка датасета',
            'Модуль 2: Обучение ИИ-модели', 
            'Модуль 3: Монетизация и автоматизация'
        ],
        enrollCourse: 'Записаться за 19 990₽',
        
        // About
        aboutTitle: 'О преподавателе',
        aboutSubtitle: 'Эксперт по ИИ-технологиям и цифровым двойникам',
        aboutText: 'ALYX Babysitter — эксперт по ИИ-визуалу и цифровым двойникам. Преподаватель. Бывший high-fashion модель и AI-дизайнер: переношу логику света и кадра из моды в нейросеточный продакшн. Делаю и обучаю под задачу: digital-twins, фотореалистичные AI-серии, кинематографичные сниппеты, AI-брендинг артистов. Пайплайны и промпт-дизайн на практике): идея → референсы → генерация → доработка → публикация. Сильные стороны: фотореализм, вкус, скорость, конфиденциальность.',


        contactMe: 'Связаться со мной',
        
        // Form
        formTitle: 'Форма заявки',
        formName: 'Ваше имя или никнейм',
        formContact: 'Ваш контакт (Telegram/Email)',
        formTask: 'Опишите задачу',
        formSubmit: 'Отправить',
        formSuccess: 'Спасибо! Ваша заявка отправлена. Alyx скоро с вами свяжется.',
        formError: 'Ошибка. Попробуйте снова или напишите в Telegram напрямую.'
    },
    
    en: {
        // Navigation
        home: 'Home',
        services: 'Services',
        course: 'Course',
        about: 'About Me',
        
        // Common
        allCategories: 'All',
        back: 'Back',
        close: 'Close',
        
        // Header
        headerTitle: 'Alyx Babysitter',
        headerSubtitle: 'AI visuals and digital twins',
        leaveRequest: 'Submit a Request',
        writeTelegram: 'Contact on Telegram',
        
        // Case details
        whatWasDone: 'What Was Done',
        audience: 'For Whom',
        orderSimilar: 'Order Similar',
        
        // Services
        servicesTitle: 'Services & Pricing',
        service1Title: 'Digital Twin',
        service1Desc: 'Creation of your realistic AI avatar for content.',
        service2Title: 'AI Photoshoot',
        service2Desc: 'AI photo packages in any desired aesthetic.',
        service3Title: 'AI Snippet',
        service3Desc: 'Short cinematic videos for releases and promos.',
        service4Title: 'Design',
        service4Desc: 'Covers, posters, and other content using AI.',
        
        // FAQ
        faqTitle: 'Frequently Asked Questions',
        faq1Title: 'What are the timelines?',
        faq1Answer: 'From 3 days for a photoshoot to 2-3 weeks for a digital twin, depending on complexity.',
        faq2Title: 'What will I get?',
        faq2Answer: 'Ready-to-use high-resolution files (JPG, PNG, MP4) for your needs.',
        faq3Title: 'How does the process work?',
        faq3Answer: 'We discuss the task, I prepare references, you approve, I do the work, and we make revisions.',
        
        // Course
        courseTitle: 'Digital Twin',
        courseDescription: 'Create unlimited content with your face in 1 click',
        courseProgramTitle: '3 MODULES = 3 WEEKS',
        courseProgramItems: [
            'Module 1: Dataset Preparation',
            'Module 2: AI Model Training',
            'Module 3: Monetization and Automation'
        ],
        enrollCourse: 'Enroll for $199',
        
        // About
        aboutTitle: 'About the Instructor',
        aboutSubtitle: 'Expert in AI technologies and digital twins',
        aboutText: 'ALYX Babysitter — expert in AI visuals and digital twins. Instructor. Former high-fashion model and AI designer: I transfer the logic of light and frame from fashion to neural network production. I create and teach for specific tasks: digital-twins, photorealistic AI series, cinematic snippets, AI branding for artists. Pipelines and prompt design in practice): idea → references → generation → refinement → publication. Strengths: photorealism, taste, speed, confidentiality.',


        contactMe: 'Contact Me',
        
        // Form
        formTitle: 'Request Form',
        formName: 'Your name or nickname',
        formContact: 'Your contact (Telegram/Email)',
        formTask: 'Describe your task',
        formSubmit: 'Send',
        formSuccess: 'Thank you! Your request has been sent. Alyx will contact you soon.',
        formError: 'Error. Please try again or contact me directly on Telegram.'
    }
};

// Current language
let currentLang = 'ru';

// Get translation
function t(key) {
    return translations[currentLang][key] || key;
}

// Update all translatable elements
function updateTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = t(key);
    });
    
    // Update document language
    document.documentElement.lang = currentLang;
    
    // Update page title and description
    if (currentLang === 'ru') {
        document.title = 'Alyx Babysitter - AI визуалы и цифровые двойники';
        document.querySelector('meta[name="description"]').content = 'AI-дизайнер создает реалистичных цифровых двойников, AI-фотосессии и кинематографичные сниппеты. Быстро, чисто и системно.';
    } else {
        document.title = 'Alyx Babysitter - AI visuals and digital twins';
        document.querySelector('meta[name="description"]').content = 'AI designer creates realistic digital twins, AI photoshoots and cinematic snippets. Fast, clean and systematic.';
    }
}

// Toggle language
function toggleLanguage() {
    currentLang = currentLang === 'ru' ? 'en' : 'ru';
    localStorage.setItem('language', currentLang);
    updateTranslations();
    
    // Update language button
    document.getElementById('lang-toggle').textContent = currentLang.toUpperCase();
    
    // Refresh dynamic content
    refreshContent();
}

// Initialize language from localStorage
function initializeLanguage() {
    const savedLang = localStorage.getItem('language');
    if (savedLang && ['ru', 'en'].includes(savedLang)) {
        currentLang = savedLang;
    }
    
    updateTranslations();
    document.getElementById('lang-toggle').textContent = currentLang.toUpperCase();
}

// Get localized value from multilingual object
function getLangValue(obj, fallback = '') {
    if (typeof obj === 'string') return obj;
    if (obj && typeof obj === 'object') {
        return obj[currentLang] || obj.ru || fallback;
    }
    return fallback;
}