// Portfolio data and configuration
const backgroundVideos = [
    'https://files.catbox.moe/smu9e9.mp4',
    'https://files.catbox.moe/863ki6.mp4',
    'https://files.catbox.moe/bbid4p.mp4',
    'https://files.catbox.moe/sxe1hl.mp4'
];

const cases = [
    {
        slug: 'y2k-portrait',
        title: { ru: 'AI-портрет: Y2K/трэп', en: 'AI Portrait: Y2K/Trap' },
        category: { ru: 'Портреты', en: 'Portraits' },
        cover: 'https://files.catbox.moe/lx45zy.jpg',
        media: [
            { type: 'image', src: 'https://files.catbox.moe/nuyn47.jpg' },
            { type: 'image', src: 'https://files.catbox.moe/wspc09.jpg' },
            { type: 'image', src: 'https://files.catbox.moe/u9l8e7.jpg' },
            { type: 'image', src: 'https://files.catbox.moe/lx45zy.jpg' },
            { type: 'image', src: 'https://files.catbox.moe/o1ypq6.jpg' },
            { type: 'image', src: 'https://files.catbox.moe/pi1y3j.jpg' },
            { type: 'image', src: 'https://files.catbox.moe/8lqcd8.jpg' },
            { type: 'image', src: 'https://files.catbox.moe/k1oq41.jpg' }
        ],
        tags: ['Y2K', 'glossy', 'trap'],
        summary: {
            ru: 'Серия AI-портретов под лейбл, глянцевый свет, зерно, кибер-деталь.',
            en: 'A series of AI portraits for a music label, featuring glossy light, grain, and cyber details.'
        },
        whatWasDone: {
            ru: ['Подбор референсов', 'Настройка промптов', 'Генерация серии из 8 кадров', 'Цветокоррекция и финализация'],
            en: ['Reference gathering', 'Prompt setup', 'Generation of an 8-image series', 'Color grading and finalization']
        },
        audience: { ru: 'Артист', en: 'Artist' }
    },
    {
        slug: 'digital-twin',
        title: { ru: 'Цифровой двойник артиста', en: "Artist's Digital Twin" },
        category: { ru: 'Аватары', en: 'Avatars' },
        cover: 'https://files.catbox.moe/yuxkrr.jpg',
        media: [
            { type: 'image', src: 'https://files.catbox.moe/gutm3a.jpg' },
            { type: 'image', src: 'https://files.catbox.moe/dkypqp.jpg' },
            { type: 'image', src: 'https://files.catbox.moe/uryy3m.jpg' },
            { type: 'image', src: 'https://files.catbox.moe/18m1id.jpg' },
            { type: 'image', src: 'https://files.catbox.moe/kjaf7b.jpg' },
            { type: 'image', src: 'https://files.catbox.moe/0ztpdj.jpg' },
            { type: 'image', src: 'https://files.catbox.moe/s7p5pi.jpg' },
            { type: 'image', src: 'https://files.catbox.moe/xy969a.jpg' },
            { type: 'image', src: 'https://files.catbox.moe/trwhvb.jpg' },
            { type: 'image', src: 'https://files.catbox.moe/i0kh38.jpg' },
            { type: 'image', src: 'https://files.catbox.moe/jf8iye.jpg' }
        ],
        tags: ['avatar', 'realistic', 'studio', 'AI-model'],
        summary: {
            ru: 'Создание высококачественного цифрового двойника артиста для использования в контенте, клипах и рекламных кампаниях.',
            en: 'Creation of a high-quality digital twin of an artist for use in content, music videos and advertising campaigns.'
        },
        whatWasDone: {
            ru: ['Подбор и обработка датасета из 50+ фотографий', 'Обучение LoRA модели в облаке', 'Тестовые генерации и корректировка', 'Создание 11 финальных изображений', 'Разработка гайда по использованию'],
            en: ['Selection and processing of 50+ photo dataset', 'LoRA model training in the cloud', 'Test generations and adjustments', 'Creation of 11 final images', 'Usage guide development']
        },
        audience: { ru: 'Артист', en: 'Artist' }
    },
    {
        slug: 'ai-snippet',
        title: { ru: 'AI-сниппеты под релиз', en: 'AI Snippets for Release' },
        category: { ru: 'Видео', en: 'Video' },
        cover: 'https://files.catbox.moe/ykvg5o.jpg?v=2',
        media: [
            { type: 'video', src: 'https://files.catbox.moe/o06b31.mp4' },
            { type: 'video', src: 'https://files.catbox.moe/fovpk7.mp4' },
            { type: 'video', src: 'https://files.catbox.moe/2q9ivm.mp4' },
            { type: 'video', src: 'https://files.catbox.moe/jc6eko.mp4' }
        ],
        tags: ['video', 'cinematic', 'release'],
        summary: {
            ru: 'Кинематографичные короткие ролики 9-15 секунд для TikTok/Reels и музыкальных релизов.',
            en: 'Cinematic short videos (9-15 seconds) for TikTok/Reels and music releases.'
        },
        whatWasDone: {
            ru: ['Разработка сториборда', 'Видеомонтаж', 'Генерация AI-визуала', 'Адаптация под саунд-дизайн', 'Создание серии из 4 роликов'],
            en: ['Storyboard development', 'Video editing', 'AI visual generation', 'Sound design adaptation', 'Creation of a 4-video series']
        },
        audience: { ru: 'Лейбл', en: 'Label' }
    },
    {
        slug: 'cover-design',
        title: { ru: 'Обложка релиза', en: 'Release Cover Art' },
        category: { ru: 'Дизайн', en: 'Design' },
        cover: 'https://files.catbox.moe/0scav0.jpg',
        media: [
            { type: 'image', src: 'https://files.catbox.moe/vd8zmu.jpg' },
            { type: 'image', src: 'https://files.catbox.moe/3lw3r0.jpg' },
            { type: 'image', src: 'https://files.catbox.moe/4cnq7a.jpg' },
            { type: 'image', src: 'https://files.catbox.moe/t73o70.jpg' },
            { type: 'image', src: 'https://files.catbox.moe/2b0a7v.jpg' },
            { type: 'image', src: 'https://files.catbox.moe/jnqeuh.jpg' },
            { type: 'image', src: 'https://files.catbox.moe/qelyty.jpg' }
        ],
        tags: ['design', 'music', 'cover'],
        summary: {
            ru: 'Дизайн обложки для музыкального релиза с использованием AI.',
            en: 'Cover art design for a music release using AI.'
        },
        whatWasDone: {
            ru: ['Анализ брифа', 'Генерация концептов', 'Типографика и вёрстка', 'Подготовка файлов для площадок'],
            en: ['Brief analysis', 'Concept generation', 'Typography and layout', 'File preparation for platforms']
        },
        audience: { ru: 'Артист', en: 'Artist' }
    },
    {
        slug: 'fashion-photoshoot',
        title: { ru: 'AI-фотосессии для брендов', en: 'AI Photoshoots for Brands' },
        category: { ru: 'Фэшн', en: 'Fashion' },
        cover: 'https://files.catbox.moe/spklu2.jpg',
        media: [
            { type: 'image', src: 'https://files.catbox.moe/0qo92c.png' },
            { type: 'image', src: 'https://files.catbox.moe/0amtrg.png' },
            { type: 'image', src: 'https://files.catbox.moe/jjp762.png' },
            { type: 'image', src: 'https://files.catbox.moe/a0f0x0.png' },
            { type: 'image', src: 'https://files.catbox.moe/mh39oa.png' },
            { type: 'image', src: 'https://files.catbox.moe/0fcqwz.png' },
            { type: 'image', src: 'https://files.catbox.moe/0ruytp.png' },
            { type: 'image', src: 'https://files.catbox.moe/zen1s2.png' },
            { type: 'image', src: 'https://files.catbox.moe/auzsxu.png' },
            { type: 'image', src: 'https://files.catbox.moe/3mbfu3.png' },
            { type: 'image', src: 'https://files.catbox.moe/qyw1kt.png' },
            { type: 'image', src: 'https://files.catbox.moe/aesywj.png' },
            { type: 'image', src: 'https://files.catbox.moe/fnrpts.png' },
            { type: 'image', src: 'https://files.catbox.moe/i8ovl1.png' },
            { type: 'image', src: 'https://files.catbox.moe/tcrjq1.png' },
            { type: 'image', src: 'https://files.catbox.moe/igrgjy.png' },
            { type: 'image', src: 'https://files.catbox.moe/vd5q6o.png' },
            { type: 'image', src: 'https://files.catbox.moe/32hkio.png' },
            { type: 'image', src: 'https://files.catbox.moe/okkzg4.png' },
            { type: 'image', src: 'https://files.catbox.moe/bwjqmf.png' },
            { type: 'image', src: 'https://files.catbox.moe/hvnxnu.png' },
            { type: 'image', src: 'https://files.catbox.moe/pf046a.png' }
        ],
        tags: ['fashion', 'photoshoot', 'brand'],
        summary: {
            ru: 'Полностью сгенерированная AI-фотосессия для кампейна бренда одежды.',
            en: 'A fully AI-generated photoshoot for a clothing brand campaign.'
        },
        whatWasDone: {
            ru: ['Создание мудборда', 'Генерация моделей и одежды', 'Постановка виртуального света', 'Финальный ретушинг'],
            en: ['Moodboard creation', 'Model and clothing generation', 'Virtual lighting setup', 'Final retouching']
        },
        audience: { ru: 'Бренд', en: 'Brand' }
    },
    {
        slug: 'event-visuals',
        title: { ru: 'Визуалы для ивентов', en: 'Visuals for Events' },
        category: { ru: 'Видео', en: 'Video' },
        cover: 'https://files.catbox.moe/rovzbg.jpg',
        media: [
            { type: 'video', src: 'https://files.catbox.moe/ja7yoj.mp4' },
            { type: 'video', src: 'https://files.catbox.moe/syqnoc.mp4' },
            { type: 'video', src: 'https://files.catbox.moe/9frs57.mp4' },
            { type: 'video', src: 'https://files.catbox.moe/y6b66n.mp4' },
            { type: 'video', src: 'https://files.catbox.moe/qaasdv.mp4' },
            { type: 'video', src: 'https://files.catbox.moe/631gnp.mp4' }
        ],
        tags: ['event', 'vj', 'motion'],
        summary: {
            ru: 'Анимированные фоны и визуалы для музыкального фестиваля.',
            en: 'Animated backgrounds and visuals for a music festival.'
        },
        whatWasDone: {
            ru: ['Разработка визуальной концепции', 'Генерация видео-лупов', 'Адаптация под сценические экраны'],
            en: ['Visual concept development', 'Video loop generation', 'Adaptation for stage screens']
        },
        audience: { ru: 'Агентство', en: 'Agency' }
    },
    {
        slug: 'commercial-shoot',
        title: { ru: 'Коммерческая съемка', en: 'Commercial Shoot' },
        category: { ru: 'Коммерческие съемки', en: 'Commercial Shoots' },
        cover: 'https://files.catbox.moe/gl4bye.png',
        media: [
            { type: 'image', src: 'https://files.catbox.moe/gl4bye.png' },
            { type: 'image', src: 'https://files.catbox.moe/hvnxnu.png' },
            { type: 'image', src: 'https://files.catbox.moe/2u1b45.png' },
            { type: 'image', src: 'https://files.catbox.moe/infjtm.png' },
            { type: 'image', src: 'https://files.catbox.moe/qjkcn7.png' },
            { type: 'image', src: 'https://files.catbox.moe/sn70s6.png' },
            { type: 'image', src: 'https://files.catbox.moe/chcopp.png' },
            { type: 'image', src: 'https://files.catbox.moe/8co7mq.png' },
            { type: 'image', src: 'https://files.catbox.moe/r3dlgj.png' },
            { type: 'image', src: 'https://files.catbox.moe/sbzro6.png' },
            { type: 'image', src: 'https://files.catbox.moe/3mbfu3.png' },
            { type: 'image', src: 'https://files.catbox.moe/oy0nb0.png' },
            { type: 'image', src: 'https://files.catbox.moe/lzyujv.png' },
            { type: 'image', src: 'https://files.catbox.moe/aorff7.png' },
            { type: 'image', src: 'https://files.catbox.moe/rxzw5s.png' },
            { type: 'image', src: 'https://files.catbox.moe/ecz5sw.png' },
            { type: 'image', src: 'https://files.catbox.moe/jkjxud.png' },
            { type: 'image', src: 'https://files.catbox.moe/of6hss.png' },
            { type: 'image', src: 'https://files.catbox.moe/5ajluy.png' },
            { type: 'image', src: 'https://files.catbox.moe/s3dw7a.png' },
            { type: 'image', src: 'https://files.catbox.moe/1qez6a.png' },
            { type: 'image', src: 'https://files.catbox.moe/090z51.png' },
            { type: 'image', src: 'https://files.catbox.moe/n5n9ka.png' }
        ],
        tags: ['commercial', 'product', 'advertising'],
        summary: {
            ru: 'Создание рекламных визуалов для продукта или услуги.',
            en: 'Creation of advertising visuals for a product or service.'
        },
        whatWasDone: {
            ru: ['Брифинг с клиентом', 'Разработка концепции', 'Сет-дизайн и генерация', 'Пост-обработка'],
            en: ['Client briefing', 'Concept development', 'Set design and generation', 'Post-processing']
        },
        audience: { ru: 'Бизнес', en: 'Business' }
    },
    {
        slug: 'custom-design',
        title: { ru: 'Кастомный дизайн', en: 'Custom Design' },
        category: { ru: 'Кастомный дизайн', en: 'Custom Design' },
        cover: 'https://files.catbox.moe/o19fbx.jpg',
        media: [
            { type: 'image', src: 'https://files.catbox.moe/o19fbx.jpg' },
            { type: 'image', src: 'https://files.catbox.moe/vxt4c6.jpg' },
            { type: 'image', src: 'https://files.catbox.moe/92vf7z.jpg' },
            { type: 'image', src: 'https://files.catbox.moe/osp8hr.jpg' },
            { type: 'image', src: 'https://files.catbox.moe/91sm57.jpg' },
            { type: 'image', src: 'https://files.catbox.moe/8wmz40.jpg' },
            { type: 'image', src: 'https://files.catbox.moe/h0bv2q.jpg' },
            { type: 'image', src: 'https://files.catbox.moe/db0pxi.jpg' }
        ],
        tags: ['design', 'custom', 'branding', 'poster'],
        summary: {
            ru: 'Коллекция кастомного дизайна: постеры, обложки и брендинговые материалы в различных стилях.',
            en: 'Collection of custom design: posters, covers and branding materials in various styles.'
        },
        whatWasDone: {
            ru: ['Разработка концепции дизайна', 'Создание айдентики', 'Типографическое решение', 'Цветовая схема и композиция', 'Создание 8 уникальных работ', 'Финальная обработка'],
            en: ['Design concept development', 'Identity creation', 'Typography solution', 'Color scheme and composition', 'Creation of 8 unique works', 'Final processing']
        },
        audience: { ru: 'Артист/Бренд', en: 'Artist/Brand' }
    }
];

// Services data
const services = [
    {
        title: { ru: 'Цифровой двойник', en: 'Digital Twin' },
        description: { ru: 'Создание вашего реалистичного AI-аватара для контента.', en: 'Creation of your realistic AI avatar for content.' }
    },
    {
        title: { ru: 'AI-фотосессия', en: 'AI Photoshoot' },
        description: { ru: 'Пакеты AI-фотографий в любой заданной эстетике.', en: 'AI photo packages in any desired aesthetic.' }
    },
    {
        title: { ru: 'AI-сниппет', en: 'AI Snippet' },
        description: { ru: 'Короткие кинематографичные ролики для релизов и промо.', en: 'Short cinematic videos for releases and promos.' }
    },
    {
        title: { ru: 'Дизайн', en: 'Design' },
        description: { ru: 'Обложки, постеры и другой контент с помощью AI.', en: 'Covers, posters, and other content using AI.' }
    }
];

// FAQ data
const faqItems = [
    {
        question: { ru: 'Какие сроки?', en: 'What are the timelines?' },
        answer: { ru: 'От 3 дней на фотосессию до 2-3 недель на создание двойника, в зависимости от сложности.', en: 'From 3 days for a photoshoot to 2-3 weeks for a digital twin, depending on complexity.' }
    },
    {
        question: { ru: 'Что я получу?', en: 'What will I get?' },
        answer: { ru: 'Готовые файлы в высоком разрешении (JPG, PNG, MP4) под ваши задачи.', en: 'Ready-to-use high-resolution files (JPG, PNG, MP4) for your needs.' }
    },
    {
        question: { ru: 'Как происходит работа?', en: 'How does the process work?' },
        answer: { ru: 'Мы обсуждаем задачу, я готовлю референсы, вы утверждаете, я выполняю работу и вносим правки.', en: 'We discuss the task, I prepare references, you approve, I do the work, and we make revisions.' }
    }
];





// Course program items
const courseProgramItems = {
    ru: [
        'Модуль 1: Подготовка датасета',
        'Модуль 2: Обучение ИИ-модели',
        'Модуль 3: Монетизация и автоматизация'
    ],
    en: [
        'Module 1: Dataset Preparation',
        'Module 2: AI Model Training',
        'Module 3: Monetization and Automation'
    ]
};