// main.js
document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const couponCards = document.querySelector('.coupons-list');
    const topCoupons = document.querySelector('.top-coupons-scroll');
    const mainSearch = document.getElementById('main-search');
    const adminLogin = document.getElementById('admin-login');

    // Инициализация
    init();

    function init() {
        // Загрузка данных
        loadCoupons();
        loadTopCoupons();
        // Настройка обработчиков
        setupEventListeners();
    }

    function setupEventListeners() {
        // Обработка фильтров
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                const filterType = this.getAttribute('data-filter-type');
                const activeCategory = document.querySelector('.filter-category.active').getAttribute('data-category');
                const searchTerm = mainSearch.value.toLowerCase();
                applyFilters(filterType, activeCategory, searchTerm);
            });
        });

        document.querySelectorAll('.filter-category').forEach(category => {
            category.addEventListener('click', function() {
                document.querySelectorAll('.filter-category').forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                const activeType = document.querySelector('.filter-tab.active').getAttribute('data-filter-type');
                const searchTerm = mainSearch.value.toLowerCase();
                applyFilters(activeType, this.getAttribute('data-category'), searchTerm);
            });
        });

        // Обработка поиска
        mainSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const activeType = document.querySelector('.filter-tab.active').getAttribute('data-filter-type');
            const activeCategory = document.querySelector('.filter-category.active').getAttribute('data-category');
            applyFilters(activeType, activeCategory, searchTerm);
        });

        // Обработка поисковых фильтров
        document.querySelectorAll('.search-filter').forEach(filter => {
            filter.addEventListener('click', function() {
                document.querySelectorAll('.search-filter').forEach(f => f.classList.remove('active'));
                this.classList.add('active');
                const filterValue = this.getAttribute('data-filter');
                // Применяем фильтр по категории
                document.querySelectorAll('.filter-category').forEach(category => {
                    category.classList.remove('active');
                    if (category.getAttribute('data-category') === filterValue || filterValue === 'all') {
                        category.classList.add('active');
                    }
                });
                const activeType = document.querySelector('.filter-tab.active').getAttribute('data-filter-type');
                const searchTerm = mainSearch.value.toLowerCase();
                applyFilters(activeType, filterValue, searchTerm);
            });
        });

        // Вход в админку
        adminLogin.addEventListener('click', function() {
            const password = prompt('Введите пароль для доступа к админ-панели:');
            if (password === 'admin') {
                // Создаем URL для админ-панели с токеном
                const token = 'slonim_admin_' + Date.now();
                localStorage.setItem('admin_token', token);
                // Открываем админ-панель в новом окне
                window.open('admin.html?token=' + token, '_blank');
            } else if (password !== null) {
                alert('Неверный пароль!');
            }
        });
    }

    // Загрузка купонов
    function loadCoupons() {
        const coupons = storage.getCoupons();
        const businesses = storage.getBusinesses();

        // Отображаем купоны
        couponCards.innerHTML = '';
        coupons.forEach(coupon => {
            const business = businesses.find(b => b.id === coupon.businessId);
            if (business) {
                const couponCard = document.createElement('div');
                couponCard.className = 'coupon-card';
                couponCard.setAttribute('data-type', coupon.type);
                couponCard.setAttribute('data-category', coupon.category);
                couponCard.setAttribute('data-coupon-id', coupon.id);

                // Определяем иконку скидки
                let discountIcon = '🔥';
                if (coupon.discount.includes('%')) {
                    discountIcon = '%';
                } else if (coupon.discount.includes('Бесплатная')) {
                    discountIcon = '🎁';
                }

                // Определяем тип бизнеса
                let businessType = 'Бизнес';
                if (business.category === 'food') {
                    businessType = 'Кафе';
                } else if (business.category === 'services') {
                    businessType = 'Услуги';
                } else if (business.category === 'goods') {
                    businessType = 'Магазин';
                } else if (business.category === 'tech') {
                    businessType = 'Техника';
                }

                // Получаем стили купона или используем значения по умолчанию
                const couponStyle = coupon.couponStyle || {
                    backgroundColor: '#fff8e6',
                    borderColor: '#ffd166',
                    borderStyle: 'dashed',
                    borderWidth: '2px'
                };

                couponCard.innerHTML = `
                    <div class="coupon-header">
                        <div class="coupon-logo" style="background-image: url('${business.logo}'); background-size: cover;"></div>
                        <div>
                            <div class="coupon-business">${business.name}</div>
                            <div class="coupon-type">${businessType}</div>
                        </div>
                    </div>
                    <div class="coupon-content">
                        <div class="coupon-img" style="background-image: url('${coupon.image}');"></div>
                        <h3 class="coupon-title">${coupon.title}</h3>
                        <p class="coupon-description">${coupon.description}</p>
                        <div class="coupon-discount" style="
                            background-color: ${couponStyle.backgroundColor};
                            border: ${couponStyle.borderWidth} ${couponStyle.borderStyle} ${couponStyle.borderColor};
                            border-radius: 10px;
                        ">
                            <div class="coupon-discount-icon">${discountIcon}</div>
                            <div class="coupon-discount-text">${coupon.discount}</div>
                        </div>
                        <div class="coupon-actions">
                            <button class="btn-show" data-id="${coupon.id}">Показать купон</button>
                            <button class="btn-save">☆</button>
                        </div>
                    </div>
                `;
                couponCards.appendChild(couponCard);
            }
        });

        // Добавляем обработчики для кнопок "Показать купон"
        document.querySelectorAll('.btn-show').forEach(button => {
            button.addEventListener('click', function() {
                const couponId = this.getAttribute('data-id');
                showCouponModal(couponId);
            });
        });

        // Применяем текущие фильтры
        const activeType = document.querySelector('.filter-tab.active').getAttribute('data-filter-type');
        const activeCategory = document.querySelector('.filter-category.active').getAttribute('data-category');
        const searchTerm = mainSearch.value.toLowerCase();
        applyFilters(activeType, activeCategory, searchTerm);
    }

    // Загрузка топ купонов
    function loadTopCoupons() {
        const coupons = storage.getCoupons();
        const businesses = storage.getBusinesses();

        // Фильтруем только топ купоны
        const topCouponsList = coupons.filter(coupon => coupon.isTop);

        // Отображаем топ купоны
        topCoupons.innerHTML = '';
        topCouponsList.forEach(coupon => {
            const business = businesses.find(b => b.id === coupon.businessId);
            if (business) {
                // Получаем стили купона или используем значения по умолчанию
                const couponStyle = coupon.couponStyle || {
                    backgroundColor: '#fff8e6',
                    borderColor: '#ffd166',
                    borderStyle: 'dashed',
                    borderWidth: '2px'
                };

                const topCoupon = document.createElement('div');
                topCoupon.className = 'top-coupon';
                topCoupon.setAttribute('data-coupon-id', coupon.id);
                topCoupon.innerHTML = `
                    <div class="top-coupon-img" style="background-image: url('${coupon.image}');"></div>
                    <div class="top-coupon-content">
                        <div class="top-coupon-title">${business.name}</div>
                        <div class="top-coupon-discount" style="
                            color: ${couponStyle.borderColor};
                        ">${coupon.discount}</div>
                    </div>
                    <div class="top-coupon-top-badge">ТОП</div>
                `;
                topCoupons.appendChild(topCoupon);

                // Добавляем обработчик клика
                topCoupon.addEventListener('click', function() {
                    const couponId = this.getAttribute('data-coupon-id');
                    scrollToCoupon(couponId);
                });
            }
        });
    }

    // Фильтрация купонов
    function applyFilters(type, category, searchTerm = '') {
        const couponElements = document.querySelectorAll('.coupon-card');
        couponElements.forEach(card => {
            const cardType = card.getAttribute('data-type');
            const cardCategory = card.getAttribute('data-category');

            // Получаем текст для поиска
            const businessName = card.querySelector('.coupon-business').textContent.toLowerCase();
            const title = card.querySelector('.coupon-title').textContent.toLowerCase();
            const description = card.querySelector('.coupon-description').textContent.toLowerCase();

            let show = true;

            // Проверка типа
            if (type !== 'all' && cardType !== type) {
                show = false;
            }

            // Проверка категории
            if (category !== 'all' && cardCategory !== category) {
                show = false;
            }

            // Проверка поиска
            if (searchTerm) {
                const matchesSearch = businessName.includes(searchTerm) || 
                                    title.includes(searchTerm) || 
                                    description.includes(searchTerm);
                show = show && matchesSearch;
            }

            // Отображение/скрытие карточки
            card.style.display = show ? 'block' : 'none';
        });
    }

    // Прокрутка к купону
    function scrollToCoupon(couponId) {
        const couponCard = document.querySelector(`.coupon-card[data-coupon-id="${couponId}"]`);
        if (couponCard) {
            // Прокручиваем к карточке
            couponCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Подсвечиваем на 2 секунды
            couponCard.style.boxShadow = '0 0 0 3px #0d4a9e';
            setTimeout(() => {
                couponCard.style.boxShadow = '';
            }, 2000);
        }
    }

    // Показ модального окна с купоном
    function showCouponModal(couponId) {
        const coupon = storage.getCoupons().find(c => c.id === couponId);
        const business = storage.getBusinesses().find(b => b.id === coupon.businessId);
        
        if (!coupon || !business) return;
        
        // Получаем стили купона или используем значения по умолчанию
        const couponStyle = coupon.couponStyle || {
            backgroundColor: '#fff8e6',
            borderColor: '#ffd166',
            borderStyle: 'dashed',
            borderWidth: '2px'
        };
        
        // Создаем модальное окно с купоном и QR-кодом
        const modal = document.createElement('div');
        modal.className = 'coupon-modal';
        
        modal.innerHTML = `
            <div class="coupon-modal-content">
                <h3 class="coupon-modal-title">Купон от ${business.name}</h3>
                <div class="coupon-modal-discount" style="
                    background-color: ${couponStyle.backgroundColor};
                    border: ${couponStyle.borderWidth} ${couponStyle.borderStyle} ${couponStyle.borderColor};
                    border-radius: 10px;
                ">
                    <div class="coupon-modal-discount-value">${coupon.discount}</div>
                    <div>Срок действия: до ${formatDate(coupon.expiry)}</div>
                </div>
                <div class="coupon-modal-qr">
                    <div class="coupon-modal-qr-code">QR-код</div>
                </div>
                <p class="coupon-modal-instruction">Покажите этот QR-код в заведении для получения скидки</p>
                <div class="coupon-modal-actions">
                    <button class="btn-save-image" data-id="${coupon.id}">Сохранить как изображение</button>
                    <button class="btn-close">Закрыть</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Обработка закрытия модального окна
        modal.querySelector('.btn-close').addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        // Обработка сохранения как изображения
        modal.querySelector('.btn-save-image').addEventListener('click', function() {
            saveCouponAsImage(couponId);
        });
        
        // Закрытие по клику вне модального окна
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    // Сохранение купона как изображения
    function saveCouponAsImage(couponId) {
        const coupon = storage.getCoupons().find(c => c.id === couponId);
        const business = storage.getBusinesses().find(b => b.id === coupon.businessId);
        
        if (!coupon || !business) return;
        
        // Получаем стили купона или используем значения по умолчанию
        const couponStyle = coupon.couponStyle || {
            backgroundColor: '#fff8e6',
            borderColor: '#ffd166',
            borderStyle: 'dashed',
            borderWidth: '2px'
        };
        
        // Создаем canvas для генерации изображения
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Устанавливаем размеры (1200x630 - стандарт для соцсетей)
        canvas.width = 1200;
        canvas.height = 630;
        
        // Заливаем фон
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#1a6ed9');
        gradient.addColorStop(1, '#0d4a9e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Рисуем заголовок
        ctx.fillStyle = 'white';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Слоним Скидки', canvas.width/2, 80);
        
        // Рисуем название бизнеса
        ctx.font = 'bold 36px Arial';
        ctx.fillText(business.name, canvas.width/2, 150);
        
        // Рисуем скидку с учетом стилей
        ctx.fillStyle = couponStyle.borderColor; // Используем цвет рамки как цвет скидки
        ctx.font = 'bold 72px Arial';
        ctx.fillText(coupon.discount, canvas.width/2, 250);
        
        // Рисуем описание
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        wrapText(ctx, coupon.title, canvas.width/2, 320, canvas.width - 100, 35);
        
        // Рисуем срок действия
        ctx.font = '20px Arial';
        ctx.fillText(`Срок действия: до ${formatDate(coupon.expiry)}`, canvas.width/2, canvas.height - 80);
        
        // Рисуем QR-код (в виде прямоугольника)
        ctx.fillStyle = 'white';
        ctx.fillRect(canvas.width/2 - 75, canvas.height - 200, 150, 150);
        ctx.fillStyle = '#0d4a9e';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('QR-код', canvas.width/2, canvas.height - 120);
        
        // Рисуем инструкцию
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '18px Arial';
        ctx.fillText('Покажите этот код в заведении', canvas.width/2, canvas.height - 30);
        
        // Создаем ссылку для скачивания
        const link = document.createElement('a');
        link.download = `coupon-${business.name.replace(/\s+/g, '-')}-${couponId}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        // Показываем уведомление
        showNotification('Изображение купона сохранено!', 'success');
    }
    
    // Вспомогательная функция для переноса текста
    function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        let lineHeightPx = lineHeight;
        let currentY = y;
        
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, x, currentY);
                line = words[n] + ' ';
                currentY += lineHeightPx;
            } else {
                line = testLine;
            }
        }
        
        ctx.fillText(line, x, currentY);
    }
    
    // Показ уведомления
    function showNotification(message, type = 'info') {
        // Удаляем предыдущие уведомления
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // Автоматическое скрытие
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Форматирование даты
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
});