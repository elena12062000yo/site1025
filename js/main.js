// Main application logic
let currentPage = 'home';
let currentVideoIndex = 0;
let isMusicPlaying = false;
let isFormVisible = false;

// DOM elements
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const musicToggle = document.getElementById('music-toggle');
const langToggle = document.getElementById('lang-toggle');
const backgroundAudio = document.getElementById('background-audio');
// Background videos будут получены в initializeBackgroundVideo()

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeLanguage();
        initializeNavigation();
        initializeBackgroundVideo();
        initializeMobileMenu();
        initializeMusicPlayer();
        initializeForm();
        
        // Render portfolio immediately
        renderPortfolio();
        renderServices();
        renderFAQ();
        renderCourseProgram();
        renderAboutPage();
        refreshContent();
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});

// Navigation
function navigate(page) {
    if (currentPage === page) return;
    
    currentPage = page;
    
    // Hide all pages
    pages.forEach(p => p.classList.add('hidden'));
    
    // Show target page
    const targetPage = document.getElementById(`page-${page}`);
    if (targetPage) {
        targetPage.classList.remove('hidden');
        targetPage.classList.add('animate-fade-in');
    }
    
    // Update navigation
    updateNavigationState();
    
    // Close mobile menu
    mobileMenu.classList.add('hidden');
    
    // Scroll to top
    window.scrollTo(0, 0);
}

function updateNavigationState() {
    // Update desktop nav
    navLinks.forEach(link => {
        if (link.dataset.page === currentPage) {
            link.classList.add('text-white', 'font-bold');
            link.classList.remove('text-white/80');
        } else {
            link.classList.remove('text-white', 'font-bold');
            link.classList.add('text-white/80');
        }
    });
    
    // Update mobile nav
    mobileNavLinks.forEach(link => {
        if (link.dataset.page === currentPage) {
            link.classList.add('bg-white/10', 'text-white');
        } else {
            link.classList.remove('bg-white/10', 'text-white');
        }
    });
}

function initializeNavigation() {
    // Add click handlers
    document.getElementById('lang-toggle').addEventListener('click', toggleLanguage);
    updateNavigationState();
}

// Background video management like in React version
function initializeBackgroundVideo() {
    // Получаем все видео элементы
    const videoElements = [
        document.getElementById('bg-video-0'),
        document.getElementById('bg-video-1'),
        document.getElementById('bg-video-2'),
        document.getElementById('bg-video-3')
    ];
    
    // Проверяем что элементы найдены
    const validVideos = videoElements.filter(video => video !== null);
    if (validVideos.length === 0) {
        console.error('Background video elements not found');
        return;
    }
    
    console.log(`🎬 Initialized ${validVideos.length} background videos`);
    
    // Начинаем с первого видео (индекс 0)
    let activeVideoIndex = 0;
    
    // Функция смены активного видео
    const switchToVideo = (newIndex) => {
        console.log(`🎬 Switching to video ${newIndex}`);
        
        // Скрываем все видео
        validVideos.forEach((video, index) => {
            if (video) {
                video.classList.remove('opacity-100');
                video.classList.add('opacity-0');
            }
        });
        
        // Показываем активное видео
        if (validVideos[newIndex]) {
            validVideos[newIndex].classList.remove('opacity-0');
            validVideos[newIndex].classList.add('opacity-100');
        }
        
        activeVideoIndex = newIndex;
    };
    
    // Добавляем обработчики для отладки
    validVideos.forEach((video, index) => {
        if (video) {
            video.addEventListener('loadstart', () => {
                console.log(`🎬 Video ${index} loading started`);
            });
            
            video.addEventListener('canplay', () => {
                console.log(`🎬 Video ${index} ready to play`);
            });
            
            video.addEventListener('error', (e) => {
                console.error(`🚫 Video ${index} error:`, e);
            });
        }
    });
    
    // Запускаем таймер смены видео каждые 20 секунд (как в React версии)
    if (validVideos.length > 1) {
        setInterval(() => {
            const nextIndex = (activeVideoIndex + 1) % validVideos.length;
            switchToVideo(nextIndex);
        }, 20000); // 20 секунд
    }
}

// Mobile menu
function initializeMobileMenu() {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Music player
function initializeMusicPlayer() {
    musicToggle.addEventListener('click', toggleMusic);
    
    // Auto-start music on page load
    startMusicOnInteraction();
}

// Function to start music automatically on first user interaction
function startMusicOnInteraction() {
    const startMusic = () => {
        if (!isMusicPlaying) {
            // Small delay to ensure page is fully loaded
            setTimeout(() => {
                backgroundAudio.play().then(() => {
                    isMusicPlaying = true;
                    musicToggle.innerHTML = '<i data-lucide="pause" class="w-5 h-5"></i>';
                    lucide.createIcons();
                    console.log('Music started automatically');
                }).catch(error => {
                    console.log('Auto-play was prevented by browser:', error);
                    // Keep volume icon, music will start when user clicks the button
                    musicToggle.innerHTML = '<i data-lucide="play" class="w-5 h-5"></i>';
                    lucide.createIcons();
                });
            }, 500);
        }
        
        // Remove event listeners after first interaction
        document.removeEventListener('click', startMusic);
        document.removeEventListener('keydown', startMusic);
        document.removeEventListener('touchstart', startMusic);
    };
    
    // Add event listeners for first user interaction
    document.addEventListener('click', startMusic);
    document.addEventListener('keydown', startMusic);
    document.addEventListener('touchstart', startMusic);
}

function toggleMusic() {
    if (isMusicPlaying) {
        backgroundAudio.pause();
        musicToggle.innerHTML = '<i data-lucide="play" class="w-5 h-5"></i>';
        isMusicPlaying = false;
    } else {
        backgroundAudio.play().then(() => {
            musicToggle.innerHTML = '<i data-lucide="pause" class="w-5 h-5"></i>';
            isMusicPlaying = true;
        }).catch(error => {
            console.error('Audio play failed:', error);
            // Keep the play icon if playback failed
        });
    }
    lucide.createIcons();
}

// Portfolio rendering
function renderPortfolio() {
    const grid = document.getElementById('portfolio-grid');
    const filters = document.getElementById('category-filters');
    
    // Check if cases are loaded
    if (!cases || cases.length === 0) {
        console.error('Cases data not loaded');
        grid.innerHTML = '<div class="col-span-full text-center text-white/70">Загрузка портфолио...</div>';
        return;
    }
    
    // Render category filters
    const categories = [t('allCategories'), ...getUniqueCategories()];
    filters.innerHTML = categories.map((category, index) => `
        <button class="category-btn nav-item-enhanced ${category === t('allCategories') ? 'active' : ''} px-4 py-2 text-sm rounded-md transition-colors fade-in-up" 
                data-category="${category === t('allCategories') ? 'all' : category}"
                style="animation-delay: ${index * 0.1}s">
            ${category}
        </button>
    `).join('');
    
    // Add filter handlers
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const category = e.target.dataset.category;
            filterPortfolio(category);
            
            // Update active filter with premium styles
            document.querySelectorAll('.category-btn').forEach(b => {
                b.classList.remove('active');
            });
            e.target.classList.add('active');
        });
    });
    
    // Render all cases initially
    renderCases(cases);
}

function getUniqueCategories() {
    return [...new Set(cases.map(c => getLangValue(c.category)))];
}

function filterPortfolio(category) {
    if (category === 'all') {
        renderCases(cases);
    } else {
        const filtered = cases.filter(c => getLangValue(c.category) === category);
        renderCases(filtered);
    }
}

function renderCases(casesToRender) {
    const grid = document.getElementById('portfolio-grid');
    const connection = window.performanceUtils?.connectionMonitor;
    
    if (!casesToRender || casesToRender.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center text-white/70">Нет данных для отображения</div>';
        return;
    }
    
    grid.innerHTML = casesToRender.map(caseItem => {
        // Simplified - always use images for faster loading
        const coverElement = `<img src="${caseItem.cover}" 
                                  alt="${getLangValue(caseItem.title)}" 
                                  loading="lazy" 
                                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />`;
        
        return `
            <div class="cursor-pointer group portfolio-item case-item portfolio-card-enhanced fade-in-up" onclick="openCaseModal('${caseItem.slug}')">
                <div class="aspect-[3/4] overflow-hidden rounded-lg relative video-enhanced">
                    ${coverElement}
                    <div class="absolute bottom-2 left-2 right-2">
                        <div class="flex flex-wrap gap-1">
                            ${caseItem.tags.slice(0, 2).map(tag => `
                                <span class="tag-enhanced text-xs">${tag}</span>
                            `).join('')}
                        </div>
                    </div>
                </div>
                <h3 class="mt-2 font-semibold text-sm truncate text-white/90">
                    ${getLangValue(caseItem.title)}
                </h3>
            </div>
        `;
    }).join('');
    
    // Initialize lucide icons
    setTimeout(() => {
        if (window.lucide) {
            lucide.createIcons();
        }
    }, 50);
}

// Services rendering
function renderServices() {
    const grid = document.getElementById('services-grid');
    if (!grid) {
        console.log('Services grid element not found');
        return;
    }
    
    grid.innerHTML = services.map(service => `
        <div class="bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 p-4 transition-all hover:shadow-lg hover:-translate-y-1">
            <h3 class="font-bold text-lg text-white">${getLangValue(service.title)}</h3>
            <p class="text-sm text-white/70 mt-1">${getLangValue(service.description)}</p>
        </div>
    `).join('');
}

// FAQ rendering
function renderFAQ() {
    const faqList = document.getElementById('faq-list');
    if (!faqList) {
        console.log('FAQ list element not found');
        return;
    }
    
    faqList.innerHTML = faqItems.map(item => `
        <details class="bg-black/30 p-3 rounded-lg border border-white/10">
            <summary class="font-semibold cursor-pointer text-white">${getLangValue(item.question)}</summary>
            <p class="text-sm text-white/70 mt-2">${getLangValue(item.answer)}</p>
        </details>
    `).join('');
}

// Course program rendering
function renderCourseProgram() {
    const programList = document.getElementById('course-program');
    if (!programList) {
        console.log('Course program element not found');
        return;
    }
    
    const items = courseProgramItems[currentLang] || courseProgramItems.ru;
    
    programList.innerHTML = items.map(item => `
        <li class="flex items-start">
            <span class="text-gray-300 mr-2 mt-1">✓</span>
            <span>${item}</span>
        </li>
    `).join('');
}

// About page rendering
function renderAboutPage() {
    // Re-initialize Lucide icons for new content
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Modal functionality
function openCaseModal(slug) {
    const caseData = cases.find(c => c.slug === slug);
    if (!caseData) return;
    
    const modal = document.getElementById('case-modal');
    const content = document.getElementById('case-modal-content');
    
    content.innerHTML = `
        <h1 class="text-3xl font-bold tracking-tight text-white">${getLangValue(caseData.title)}</h1>
        
        <div class="flex flex-wrap gap-2">
            ${caseData.tags.map(tag => `<span class="bg-black/30 text-white/80 text-xs font-mono px-2 py-1 rounded">#${tag}</span>`).join('')}
        </div>

        ${caseData.media ? `
            <div class="grid grid-cols-2 gap-3">
                ${caseData.media.map((item, index) => `
                    <div class="rounded-lg overflow-hidden border border-white/10 aspect-square relative">
                        ${item.type === 'image' 
                            ? `<img src="${item.src}" alt="${getLangValue(caseData.title)} ${index + 1}" loading="lazy" class="w-full h-full object-cover" />`
                            : `<video src="${item.src}" 
                                      controls 
                                      muted 
                                      loop 
                                      playsinline 
                                      preload="metadata"
                                      class="w-full h-full object-cover"
                                      onloadstart="this.style.opacity='0.7'"
                                      oncanplay="this.style.opacity='1'"
                                      onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                               </video>
                               <div class="absolute inset-0 bg-gray-800 flex items-center justify-center" style="display: none;">
                                   <i data-lucide="play-circle" class="w-12 h-12 text-white/50"></i>
                                   <span class="ml-2 text-white/70">Видео недоступно</span>
                               </div>`
                        }
                    </div>
                `).join('')}
            </div>
        ` : ''}

        <p class="text-base text-white/90">${getLangValue(caseData.summary)}</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 p-4">
                <h3 class="font-bold mb-2 text-white">${t('whatWasDone')}</h3>
                <ul class="list-disc list-inside space-y-1 text-sm text-white/70">
                    ${getLangValue(caseData.whatWasDone).map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            <div class="bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 p-4">
                <h3 class="font-bold mb-2 text-white">${t('audience')}</h3>
                <p class="text-sm text-white/70">${getLangValue(caseData.audience)}</p>
            </div>
        </div>
        
        <button onclick="showForm('${t('orderSimilar')}')" class="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors">
            ${t('orderSimilar')}
        </button>
    `;
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Refresh icons in modal and initialize video loading
    setTimeout(() => {
        lucide.createIcons();
        
        // Initialize videos in modal
        const modalVideos = modal.querySelectorAll('video');
        modalVideos.forEach(video => {
            video.addEventListener('error', (e) => {
                console.error('Modal video failed to load:', video.src, e);
                video.style.display = 'none';
                const fallback = video.nextElementSibling;
                if (fallback) {
                    fallback.style.display = 'flex';
                }
            });
        });
    }, 100);
}

function closeCaseModal() {
    const modal = document.getElementById('case-modal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Form functionality
function initializeForm() {
    const form = document.getElementById('request-form');
    form.addEventListener('submit', handleFormSubmit);
}

function showForm(initialTask = '') {
    const modal = document.getElementById('form-modal');
    const taskField = document.getElementById('form-task');
    
    if (initialTask) {
        taskField.value = initialTask;
    }
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeForm() {
    const modal = document.getElementById('form-modal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    
    // Reset form
    document.getElementById('request-form').reset();
    document.getElementById('form-status').classList.add('hidden');
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        contact: formData.get('contact'),
        task: formData.get('task')
    };
    
    const statusEl = document.getElementById('form-status');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Show loading state
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;
    
    try {
        // Verify Telegram config first
        if (!window.TELEGRAM_CONFIG?.BOT_TOKEN || !window.TELEGRAM_CONFIG?.CHAT_ID) {
            throw new Error('Telegram not configured');
        }
        
        // Send to Telegram
        await sendToTelegram(data);
        
        // Show success message
        statusEl.textContent = t('formSuccess');
        statusEl.className = 'text-center text-sm text-gray-300';
        statusEl.classList.remove('hidden');
        
        // Reset form after delay
        setTimeout(() => {
            closeForm();
        }, 3000);
        
    } catch (error) {
        console.error('Form submission error:', error);
        // Show error message
        statusEl.textContent = t('formError');
        statusEl.className = 'text-center text-sm text-red-400';
        statusEl.classList.remove('hidden');
    } finally {
        // Reset button
        submitBtn.textContent = t('formSubmit');
        submitBtn.disabled = false;
    }
}

// Send form data to Telegram
async function sendToTelegram(data) {
    const BOT_TOKEN = window.TELEGRAM_CONFIG?.BOT_TOKEN;
    const CHAT_ID = window.TELEGRAM_CONFIG?.CHAT_ID;
    
    // Check if configuration is set
    if (!BOT_TOKEN || !CHAT_ID || BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') {
        console.warn('Telegram configuration not set. Please update js/config.js');
        throw new Error('Telegram not configured');
    }
    
    const message = `🔔 Новая заявка с сайта

👤 Имя: ${data.name}
📞 Контакт: ${data.contact}
📝 Задача: ${data.task}

📅 Время: ${new Date().toLocaleString('ru-RU')}
🌐 Сайт: ${window.location.hostname}`;
    
    const telegramAPI = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    console.log('Sending to Telegram:', { BOT_TOKEN: BOT_TOKEN.substring(0, 10) + '...', CHAT_ID, message });
    
    try {
        // Try POST method first
        const response = await fetch(telegramAPI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message
            })
        });
        
        const result = await response.json();
        console.log('Telegram API response:', result);
        
        if (!response.ok || !result.ok) {
            throw new Error(`Telegram API error: ${result.description || response.status}`);
        }
        
        return result;
    } catch (error) {
        console.error('Telegram POST error:', error);
        
        // Fallback: try GET method
        try {
            console.log('Trying GET method as fallback...');
            const encodedMessage = encodeURIComponent(message);
            const getURL = `${telegramAPI}?chat_id=${CHAT_ID}&text=${encodedMessage}`;
            
            const getResponse = await fetch(getURL, { method: 'GET' });
            const getResult = await getResponse.json();
            
            console.log('Telegram GET response:', getResult);
            
            if (!getResponse.ok || !getResult.ok) {
                throw new Error(`Telegram GET error: ${getResult.description || getResponse.status}`);
            }
            
            return getResult;
        } catch (fallbackError) {
            console.error('Telegram GET error:', fallbackError);
            throw error; // Throw original error
        }
    }
}

// Custom cursor
function initializeCursor() {
    const trailContainer = document.getElementById('cursor-trail');
    const trailCount = 5;
    const trails = [];
    
    // Create cursor trail elements
    for (let i = 0; i < trailCount; i++) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.transform = 'translate(-50px, -50px)';
        trail.style.transition = `transform ${0.1 + i * 0.02}s ease-out`;
        trailContainer.appendChild(trail);
        trails.push(trail);
    }
    
    // Mouse move handler
    document.addEventListener('mousemove', (e) => {
        trails.forEach((trail, index) => {
            setTimeout(() => {
                trail.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            }, index * 20);
        });
    });
    
    // Hover effects
    const interactiveElements = document.querySelectorAll('button, a, summary, [onclick], .cursor-pointer');
    
    function addHoverClass() {
        document.body.classList.add('cursor-hover-active');
    }
    
    function removeHoverClass() {
        document.body.classList.remove('cursor-hover-active');
    }
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', addHoverClass);
        el.addEventListener('mouseleave', removeHoverClass);
    });
}

// Refresh content when language changes
function refreshContent() {
    renderPortfolio();
    renderServices();
    renderFAQ();
    renderCourseProgram();
    renderAboutPage();
}

// Close modals when clicking outside
document.addEventListener('click', (e) => {
    const caseModal = document.getElementById('case-modal');
    const formModal = document.getElementById('form-modal');
    
    if (e.target === caseModal) {
        closeCaseModal();
    }
    if (e.target === formModal) {
        closeForm();
    }
});

// Handle escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCaseModal();
        closeForm();
    }
});

// Export functions for global access
window.navigate = navigate;
window.showForm = showForm;
window.closeForm = closeForm;
window.openCaseModal = openCaseModal;
window.closeCaseModal = closeCaseModal;