// admin.js
document.addEventListener('DOMContentLoaded', function() {
    // Проверка токена (для продакшена)
    // В разработке можно отключить проверку
    /*
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const storedToken = localStorage.getItem('admin_token');
    
    if (!token || token !== storedToken) {
        alert('Доступ запрещен! Неверный токен.');
        window.close();
        return;
    }
    */
    
    // Элементы DOM
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const couponsContainer = document.getElementById('coupons-container');
    const businessesContainer = document.getElementById('businesses-container');
    const notification = document.getElementById('notification');
    
    // Формы
    const addCouponForm = document.getElementById('add-coupon-form');
    const addBusinessForm = document.getElementById('add-business-form');
    
    // Кнопки
    const addCouponBtn = document.getElementById('add-coupon-btn');
    const addBusinessBtn = document.getElementById('add-business-btn');
    const exportDataBtn = document.getElementById('export-data-btn');
    const importDataBtn = document.getElementById('import-data-btn');
    const clearDataBtn = document.getElementById('clear-data-btn');
    const saveCouponBtn = document.getElementById('save-coupon-btn');
    const cancelCouponBtn = document.getElementById('cancel-coupon-btn');
    const saveBusinessBtn = document.getElementById('save-business-btn');
    const cancelBusinessBtn = document.getElementById('cancel-business-btn');
    
    // Поля
    const businessSelect = document.getElementById('business-select');
    const couponImage = document.getElementById('coupon-image');
    const couponImagePreview = document.getElementById('coupon-image-preview');
    const businessLogo = document.getElementById('business-logo');
    const businessLogoPreview = document.getElementById('business-logo-preview');
    
    // Поля стилей купона
    const backgroundColor = document.getElementById('background-color');
    const borderColor = document.getElementById('border-color');
    const borderStyle = document.getElementById('border-style');
    const borderWidth = document.getElementById('border-width');
    const borderWidthValue = document.getElementById('border-width-value');
    
    // Статистика
    const totalCoupons = document.getElementById('total-coupons');
    const totalBusinesses = document.getElementById('total-businesses');
    const totalTops = document.getElementById('total-tops');
    const totalExpired = document.getElementById('total-expired');
    
    // Текущий режим
    let currentMode = 'add'; // 'add' или 'edit'
    let currentCouponId = null;
    let currentBusinessId = null;
    
    // Инициализация
    init();
    
    function init() {
        // Загрузка данных
        loadBusinesses();
        loadCoupons();
        loadStatistics();
        
        // Настройка обработчиков
        setupEventListeners();
    }
    
    function setupEventListeners() {
        // Переключение вкладок
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                this.classList.add('active');
                document.getElementById(`${this.dataset.tab}-tab`).classList.add('active');
            });
        });
        
        // Добавление купона
        addCouponBtn.addEventListener('click', function() {
            resetCouponForm();
            currentMode = 'add';
            document.querySelector('#coupons-tab .admin-card-title').textContent = '➕ Добавить купон';
        });
        
        // Добавление бизнеса
        addBusinessBtn.addEventListener('click', function() {
            resetBusinessForm();
            currentMode = 'add';
            document.querySelector('#businesses-tab .admin-card-title').textContent = '➕ Добавить бизнес';
        });
        
        // Сохранение купона
        addCouponForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveCoupon();
        });
        
        // Сохранение бизнеса
        addBusinessForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveBusiness();
        });
        
        // Отмена купона
        cancelCouponBtn.addEventListener('click', function() {
            resetCouponForm();
        });
        
        // Отмена бизнеса
        cancelBusinessBtn.addEventListener('click', function() {
            resetBusinessForm();
        });
        
        // Загрузка изображения купона
        couponImage.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const file = this.files[0];
                
                // Проверка типа файла
                if (!file.type.match('image.*')) {
                    showNotification('Пожалуйста, выберите изображение (JPG, PNG, GIF)', 'error');
                    return;
                }
                
                // Проверка размера файла (максимум 2MB)
                if (file.size > 2 * 1024 * 1024) {
                    showNotification('Размер файла не должен превышать 2MB', 'error');
                    return;
                }
                
                // Создаем превью и проверяем размеры
                const img = new Image();
                img.onload = function() {
                    // Проверка размеров (рекомендуем 600x400)
                    if (img.width < 400 || img.height < 300) {
                        showNotification('Рекомендуемый размер изображения: 600x400 пикселей', 'info');
                    }
                    
                    // Создаем canvas для преобразования в data URL
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Устанавливаем размеры canvas
                    canvas.width = 600;
                    canvas.height = 400;
                    
                    // Рисуем изображение с сохранением пропорций
                    const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
                    const x = (canvas.width / 2) - (img.width / 2) * scale;
                    const y = (canvas.height / 2) - (img.height / 2) * scale;
                    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                    
                    // Отображаем в превью
                    couponImagePreview.innerHTML = `<img src="${canvas.toDataURL('image/jpeg', 0.8)}" alt="Preview">`;
                };
                
                img.src = URL.createObjectURL(file);
            }
        });
        
        // Загрузка логотипа бизнеса
        businessLogo.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const file = this.files[0];
                
                // Проверка типа файла
                if (!file.type.match('image.*')) {
                    showNotification('Пожалуйста, выберите изображение (JPG, PNG, GIF)', 'error');
                    return;
                }
                
                // Проверка размера файла (максимум 1MB)
                if (file.size > 1 * 1024 * 1024) {
                    showNotification('Размер файла не должен превышать 1MB', 'error');
                    return;
                }
                
                // Создаем превью и проверяем размеры
                const img = new Image();
                img.onload = function() {
                    // Проверка размеров (рекомендуем 100x100)
                    if (img.width < 50 || img.height < 50) {
                        showNotification('Рекомендуемый размер логотипа: 100x100 пикселей', 'info');
                    }
                    
                    // Создаем canvas для преобразования в data URL
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Устанавливаем размеры canvas
                    canvas.width = 100;
                    canvas.height = 100;
                    
                    // Рисуем изображение с сохранением пропорций
                    const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
                    const x = (canvas.width / 2) - (img.width / 2) * scale;
                    const y = (canvas.height / 2) - (img.height / 2) * scale;
                    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                    
                    // Отображаем в превью
                    businessLogoPreview.innerHTML = `<img src="${canvas.toDataURL('image/jpeg', 0.8)}" alt="Preview">`;
                };
                
                img.src = URL.createObjectURL(file);
            }
        });
        
        // Обработчик изменения толщины рамки
        borderWidth.addEventListener('input', function() {
            borderWidthValue.textContent = `${this.value}px`;
        });
        
        // Экспорт данных
        exportDataBtn.addEventListener('click', function() {
            const data = storage.exportData();
            const blob = new Blob([data], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `slonim-skidki-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showNotification('Данные успешно экспортированы!', 'success');
        });
        
        // Импорт данных
        importDataBtn.addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    const success = storage.importData(e.target.result);
                    if (success) {
                        showNotification('Данные успешно импортированы!', 'success');
                        init();
                    } else {
                        showNotification('Ошибка при импорте данных', 'error');
                    }
                };
                reader.readAsText(file);
            };
            
            input.click();
        });
        
        // Очистка данных
        clearDataBtn.addEventListener('click', function() {
            if (confirm('Вы уверены, что хотите очистить все данные? Это действие нельзя отменить!')) {
                storage.clearAll();
                showNotification('Данные успешно очищены. Приложение перезагружается...', 'success');
                setTimeout(() => {
                    location.reload();
                }, 1500);
            }
        });
    }
    
    // Загрузка бизнесов
    function loadBusinesses() {
        const businesses = storage.getBusinesses();
        
        // Обновляем список бизнесов в выпадающем меню
        businessSelect.innerHTML = '';
        businesses.forEach(business => {
            const option = document.createElement('option');
            option.value = business.id;
            option.textContent = business.name;
            businessSelect.appendChild(option);
        });
        
        // Отображаем бизнесы
        businessesContainer.innerHTML = '';
        businesses.forEach(business => {
            const businessItem = document.createElement('div');
            businessItem.className = 'coupon-item';
            businessItem.innerHTML = `
                <div class="coupon-info">
                    <div class="coupon-business">${business.name}</div>
                    <div class="coupon-title">УНП: ${business.unp}</div>
                </div>
                <div class="coupon-actions">
                    <button class="btn edit-business" data-id="${business.id}">Редактировать</button>
                    <button class="btn btn-danger delete-business" data-id="${business.id}">Удалить</button>
                </div>
            `;
            businessesContainer.appendChild(businessItem);
        });
        
        // Добавляем обработчики для кнопок
        document.querySelectorAll('.edit-business').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.dataset.id;
                editBusiness(id);
            });
        });
        
        document.querySelectorAll('.delete-business').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.dataset.id;
                deleteBusiness(id);
            });
        });
    }
    
    // Загрузка купонов
    function loadCoupons() {
        const coupons = storage.getCoupons();
        
        // Отображаем купоны
        couponsContainer.innerHTML = '';
        coupons.forEach(coupon => {
            const business = storage.getBusinesses().find(b => b.id === coupon.businessId);
            
            const couponItem = document.createElement('div');
            couponItem.className = 'coupon-item';
            couponItem.innerHTML = `
                <div class="coupon-info">
                    <div class="coupon-business">${business ? business.name : 'Неизвестный бизнес'}</div>
                    <div class="coupon-title">${coupon.title}</div>
                </div>
                <div class="coupon-actions">
                    ${coupon.isTop ? '<span class="coupon-top">ТОП</span>' : ''}
                    <button class="btn edit-coupon" data-id="${coupon.id}">Редактировать</button>
                    <button class="btn btn-danger delete-coupon" data-id="${coupon.id}">Удалить</button>
                </div>
            `;
            couponsContainer.appendChild(couponItem);
        });
        
        // Добавляем обработчики для кнопок
        document.querySelectorAll('.edit-coupon').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.dataset.id;
                editCoupon(id);
            });
        });
        
        document.querySelectorAll('.delete-coupon').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.dataset.id;
                deleteCoupon(id);
            });
        });
    }
    
    // Загрузка статистики
    function loadStatistics() {
        const coupons = storage.getCoupons();
        const businesses = storage.getBusinesses();
        
        // Общая статистика
        totalCoupons.textContent = coupons.length;
        totalBusinesses.textContent = businesses.length;
        totalTops.textContent = coupons.filter(c => c.isTop).length;
        
        const today = new Date();
        totalExpired.textContent = coupons.filter(c => new Date(c.expiry) < today).length;
        
        // Статистика по категориям
        const categoryStats = {
            food: 0,
            goods: 0,
            tech: 0,
            services: 0
        };
        
        coupons.forEach(coupon => {
            if (categoryStats[coupon.category] !== undefined) {
                categoryStats[coupon.category]++;
            }
        });
        
        let statsHTML = '';
        for (const [category, count] of Object.entries(categoryStats)) {
            if (count > 0) {
                const categoryName = {
                    food: 'Еда',
                    goods: 'Товары',
                    tech: 'Техника',
                    services: 'Услуги'
                }[category];
                
                statsHTML += `
                    <div class="stat-item">
                        <div class="stat-value">${count}</div>
                        <div class="stat-label">${categoryName}</div>
                    </div>
                `;
            }
        }
        
        document.getElementById('category-stats').innerHTML = statsHTML || '<div class="stat-item"><div class="stat-label">Нет данных</div></div>';
    }
    
    // Сброс формы купона
    function resetCouponForm() {
        addCouponForm.reset();
        couponImagePreview.innerHTML = '<span>Нет изображения</span>';
        document.getElementById('coupon-id').value = '';
        currentMode = 'add';
        document.querySelector('#coupons-tab .admin-card-title').textContent = '➕ Добавить купон';
        
        // Сброс стилей купона к значениям по умолчанию
        backgroundColor.value = '#fff8e6';
        borderColor.value = '#ffd166';
        borderStyle.value = 'dashed';
        borderWidth.value = '2';
        borderWidthValue.textContent = '2px';
        
        // Устанавливаем дату по умолчанию (через 30 дней)
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 30);
        const formattedDate = defaultDate.toISOString().split('T')[0];
        document.getElementById('expiry').value = formattedDate;
    }
    
    // Сброс формы бизнеса
    function resetBusinessForm() {
        addBusinessForm.reset();
        businessLogoPreview.innerHTML = '<span>Нет изображения</span>';
        document.getElementById('business-id').value = '';
        currentMode = 'add';
        document.querySelector('#businesses-tab .admin-card-title').textContent = '➕ Добавить бизнес';
    }
    
    // Сохранение купона
    function saveCoupon() {
        const businessId = businessSelect.value;
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const discount = document.getElementById('discount').value;
        const expiry = document.getElementById('expiry').value;
        const type = document.getElementById('type').value;
        const category = document.getElementById('category').value;
        const isTop = document.getElementById('is-top').checked;
        
        // Получаем стили купона
        const couponStyle = {
            backgroundColor: backgroundColor.value,
            borderColor: borderColor.value,
            borderStyle: borderStyle.value,
            borderWidth: borderWidth.value + 'px'
        };
        
        // Проверка обязательных полей
        if (!businessId || !title || !description || !discount || !expiry || !type || !category) {
            showNotification('Пожалуйста, заполните все обязательные поля', 'error');
            return;
        }
        
        // Получаем изображение
        let image = '';
        if (couponImage.files && couponImage.files[0]) {
            // Изображение уже загружено и отображено в preview
            const img = couponImagePreview.querySelector('img');
            if (img) {
                image = img.src;
            }
        } else if (currentMode === 'edit' && currentCouponId) {
            // Сохраняем существующее изображение при редактировании
            const coupon = storage.getCoupons().find(c => c.id === currentCouponId);
            if (coupon) {
                image = coupon.image;
            }
        }
        
        const couponData = {
            businessId,
            title,
            description,
            discount,
            expiry,
            type,
            category,
            isTop,
            image,
            couponStyle // Добавляем стили купона
        };
        
        let result;
        if (currentMode === 'add') {
            result = storage.addCoupon(couponData);
            showNotification('Купон успешно добавлен!', 'success');
        } else if (currentMode === 'edit' && currentCouponId) {
            result = storage.updateCoupon(currentCouponId, couponData);
            showNotification('Купон успешно обновлен!', 'success');
        }
        
        // Обновляем интерфейс
        loadBusinesses();
        loadCoupons();
        loadStatistics();
        resetCouponForm();
    }
    
    // Сохранение бизнеса
    function saveBusiness() {
        const name = document.getElementById('business-name').value;
        const unp = document.getElementById('business-unp').value;
        const category = document.getElementById('business-category').value;
        const description = document.getElementById('business-description').value;
        
        // Проверка обязательных полей
        if (!name || !unp || !category) {
            showNotification('Пожалуйста, заполните все обязательные поля', 'error');
            return;
        }
        
        // Получаем логотип
        let logo = '';
        if (businessLogo.files && businessLogo.files[0]) {
            // Логотип уже загружен и отображен в preview
            const img = businessLogoPreview.querySelector('img');
            if (img) {
                logo = img.src;
            }
        } else if (currentMode === 'edit' && currentBusinessId) {
            // Сохраняем существующий логотип при редактировании
            const business = storage.getBusinesses().find(b => b.id === currentBusinessId);
            if (business) {
                logo = business.logo;
            }
        }
        
        const businessData = {
            name,
            unp,
            category,
            description,
            logo
        };
        
        let result;
        if (currentMode === 'add') {
            result = storage.addBusiness(businessData);
            showNotification('Бизнес успешно добавлен!', 'success');
        } else if (currentMode === 'edit' && currentBusinessId) {
            result = storage.updateBusiness(currentBusinessId, businessData);
            showNotification('Бизнес успешно обновлен!', 'success');
        }
        
        // Обновляем интерфейс
        loadBusinesses();
        loadCoupons();
        loadStatistics();
        resetBusinessForm();
    }
    
    // Редактирование купона
    function editCoupon(id) {
        const coupon = storage.getCoupons().find(c => c.id === id);
        if (!coupon) return;
        
        currentMode = 'edit';
        currentCouponId = id;
        document.querySelector('#coupons-tab .admin-card-title').textContent = '✏️ Редактировать купон';
        
        // Заполняем форму
        businessSelect.value = coupon.businessId;
        document.getElementById('title').value = coupon.title;
        document.getElementById('description').value = coupon.description;
        document.getElementById('discount').value = coupon.discount;
        document.getElementById('expiry').value = coupon.expiry;
        document.getElementById('type').value = coupon.type;
        document.getElementById('category').value = coupon.category;
        document.getElementById('is-top').checked = coupon.isTop;
        document.getElementById('coupon-id').value = id;
        
        // Заполняем стили купона
        if (coupon.couponStyle) {
            backgroundColor.value = coupon.couponStyle.backgroundColor || '#fff8e6';
            borderColor.value = coupon.couponStyle.borderColor || '#ffd166';
            borderStyle.value = coupon.couponStyle.borderStyle || 'dashed';
            
            // Извлекаем числовое значение толщины рамки
            const borderWidthValue = coupon.couponStyle.borderWidth ? 
                coupon.couponStyle.borderWidth.replace('px', '') : '2';
            borderWidth.value = borderWidthValue;
            document.getElementById('border-width-value').textContent = coupon.couponStyle.borderWidth || '2px';
        }
        
        // Отображаем изображение
        if (coupon.image) {
            couponImagePreview.innerHTML = `<img src="${coupon.image}" alt="Preview">`;
        } else {
            couponImagePreview.innerHTML = '<span>Нет изображения</span>';
        }
    }
    
    // Редактирование бизнеса
    function editBusiness(id) {
        const business = storage.getBusinesses().find(b => b.id === id);
        if (!business) return;
        
        currentMode = 'edit';
        currentBusinessId = id;
        document.querySelector('#businesses-tab .admin-card-title').textContent = '✏️ Редактировать бизнес';
        
        // Заполняем форму
        document.getElementById('business-name').value = business.name;
        document.getElementById('business-unp').value = business.unp;
        document.getElementById('business-category').value = business.category;
        document.getElementById('business-description').value = business.description || '';
        document.getElementById('business-id').value = id;
        
        // Отображаем логотип
        if (business.logo) {
            businessLogoPreview.innerHTML = `<img src="${business.logo}" alt="Preview">`;
        } else {
            businessLogoPreview.innerHTML = '<span>Нет изображения</span>';
        }
    }
    
    // Удаление купона
    function deleteCoupon(id) {
        if (confirm('Вы уверены, что хотите удалить этот купон?')) {
            const success = storage.deleteCoupon(id);
            if (success) {
                showNotification('Купон успешно удален!', 'success');
                loadCoupons();
                loadStatistics();
            } else {
                showNotification('Ошибка при удалении купона', 'error');
            }
        }
    }
    
    // Удаление бизнеса
    function deleteBusiness(id) {
        if (confirm('Вы уверены, что хотите удалить этот бизнес? Все связанные купоны также будут удалены.')) {
            // Сначала удаляем купоны этого бизнеса
            const coupons = storage.getCoupons();
            const businessCoupons = coupons.filter(c => c.businessId === id);
            
            businessCoupons.forEach(coupon => {
                storage.deleteCoupon(coupon.id);
            });
            
            // Затем удаляем сам бизнес
            const success = storage.deleteBusiness(id);
            
            if (success) {
                showNotification('Бизнес и все связанные купоны успешно удалены!', 'success');
                loadBusinesses();
                loadCoupons();
                loadStatistics();
            } else {
                showNotification('Ошибка при удалении бизнеса', 'error');
            }
        }
    }
    
    // Показ уведомления
    function showNotification(message, type = 'info') {
        notification.textContent = message;
        notification.className = 'notification ' + type;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
});