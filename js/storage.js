// storage.js
class StorageManager {
    constructor() {
        this.couponsKey = 'slonim_coupons';
        this.businessesKey = 'slonim_businesses';
        // Инициализация данных, если их нет
        if (!this.getCoupons()) {
            this.initCoupons();
        }
        if (!this.getBusinesses()) {
            this.initBusinesses();
        }
    }
    
    // Инициализация демо-данных
    initCoupons() {
        const demoCoupons = [
            {
                id: 'c1',
                businessId: 'b1',
                title: 'Скидка на бизнес-ланч',
                description: 'Только до конца месяца получайте скидку 20% на бизнес-ланч при предъявлении купона.',
                discount: '-20% на обед',
                expiry: '2024-12-31',
                type: 'coupons',
                category: 'food',
                isTop: true,
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiMwMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPlJhbmRldnU8L3RleHQ+PC9zdmc+',
                // Новые поля для стилей купона
                couponStyle: {
                    backgroundColor: '#fff8e6',
                    borderColor: '#ffd166',
                    borderStyle: 'dashed',
                    borderWidth: '2px'
                },
                createdAt: new Date().toISOString()
            },
            {
                id: 'c2',
                businessId: 'b2',
                title: 'Бесплатная стрижка',
                description: 'При третьей покупке получите бесплатную стрижку. Акция действует до конца октября.',
                discount: 'Бесплатная стрижка',
                expiry: '2024-10-31',
                type: 'actions',
                category: 'services',
                isTop: true,
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiMwMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPlN0cml6a2E8L3RleHQ+PC9zdmc+',
                // Новые поля для стилей купона
                couponStyle: {
                    backgroundColor: '#e3f2fd',
                    borderColor: '#2196f3',
                    borderStyle: 'dashed',
                    borderWidth: '2px'
                },
                createdAt: new Date().toISOString()
            },
            {
                id: 'c3',
                businessId: 'b3',
                title: 'Распродажа хозтоваров',
                description: 'Скидка 25% на весь ассортимент хозтоваров. Только для держателей купона.',
                discount: '-25% на всё',
                expiry: '2024-11-15',
                type: 'sales',
                category: 'goods',
                isTop: false,
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiMwMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPkhvc3RvdmFyeTwvdGV4dD48L3N2Zz4=',
                // Новые поля для стилей купона
                couponStyle: {
                    backgroundColor: '#f3e5f5',
                    borderColor: '#9c27b0',
                    borderStyle: 'dashed',
                    borderWidth: '2px'
                },
                createdAt: new Date().toISOString()
            },
            {
                id: 'c4',
                businessId: 'b4',
                title: 'Скидка на хлеб',
                description: 'Скидка 15% на весь ассортимент хлебобулочных изделий при предъявлении купона.',
                discount: '-15% на хлеб',
                expiry: '2024-12-31',
                type: 'coupons',
                category: 'food',
                isTop: true,
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiMwMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPkhsw6liPC90ZXh0Pjwvc3ZnPg==',
                // Новые поля для стилей купона
                couponStyle: {
                    backgroundColor: '#fff3e0',
                    borderColor: '#ff9800',
                    borderStyle: 'dashed',
                    borderWidth: '2px'
                },
                createdAt: new Date().toISOString()
            },
            {
                id: 'c5',
                businessId: 'b5',
                title: 'Букет в подарок',
                description: 'При покупке букета получите небольшой букет в подарок. Только до конца недели.',
                discount: '+Букет в подарок',
                expiry: '2024-10-27',
                type: 'actions',
                category: 'goods',
                isTop: true,
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiMwMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPlJvemE8L3RleHQ+PC9zdmc+',
                // Новые поля для стилей купона
                couponStyle: {
                    backgroundColor: '#fce4ec',
                    borderColor: '#e91e63',
                    borderStyle: 'dashed',
                    borderWidth: '2px'
                },
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem(this.couponsKey, JSON.stringify(demoCoupons));
    }
    
    initBusinesses() {
        const demoBusinesses = [
            {
                id: 'b1',
                name: 'ИП "Рандеву"',
                unp: '192837465',
                category: 'food',
                logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzAwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+UjwvdGV4dD48L3N2Zz4=',
                description: 'Кафе в центре Слонима',
                createdAt: new Date().toISOString()
            },
            {
                id: 'b2',
                name: 'ИП "Стрижка"',
                unp: '192837466',
                category: 'services',
                logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzAwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+UzwvdGV4dD48L3N2Zz4=',
                description: 'Парикмахерская',
                createdAt: new Date().toISOString()
            },
            {
                id: 'b3',
                name: 'ИП "Светофор"',
                unp: '192837467',
                category: 'goods',
                logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzAwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+UzwvdGV4dD48L3N2Zz4=',
                description: 'Магазин хозтоваров',
                createdAt: new Date().toISOString()
            },
            {
                id: 'b4',
                name: 'ИП "Хлебный уголок"',
                unp: '192837468',
                category: 'food',
                logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzAwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+SDwvdGV4dD48L3N2Zz4=',
                description: 'Пекарня',
                createdAt: new Date().toISOString()
            },
            {
                id: 'b5',
                name: 'ИП "Роза"',
                unp: '192837469',
                category: 'goods',
                logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzAwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+UjwvdGV4dD48L3N2Zz4=',
                description: 'Цветочный магазин',
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem(this.businessesKey, JSON.stringify(demoBusinesses));
    }
    
    // Получение купонов
    getCoupons() {
        const data = localStorage.getItem(this.couponsKey);
        return data ? JSON.parse(data) : null;
    }
    
    // Получение бизнесов
    getBusinesses() {
        const data = localStorage.getItem(this.businessesKey);
        return data ? JSON.parse(data) : null;
    }
    
    // Добавление купона
    addCoupon(coupon) {
        const coupons = this.getCoupons() || [];
        coupon.id = 'c' + Date.now();
        coupon.createdAt = new Date().toISOString();
        
        // Установка стилей по умолчанию, если не заданы
        if (!coupon.couponStyle) {
            coupon.couponStyle = {
                backgroundColor: '#fff8e6',
                borderColor: '#ffd166',
                borderStyle: 'dashed',
                borderWidth: '2px'
            };
        }
        
        coupons.push(coupon);
        localStorage.setItem(this.couponsKey, JSON.stringify(coupons));
        return coupon;
    }
    
    // Обновление купона
    updateCoupon(id, updatedCoupon) {
        const coupons = this.getCoupons() || [];
        const index = coupons.findIndex(c => c.id === id);
        if (index !== -1) {
            coupons[index] = {...coupons[index], ...updatedCoupon};
            localStorage.setItem(this.couponsKey, JSON.stringify(coupons));
            return coupons[index];
        }
        return null;
    }
    
    // Удаление купона
    deleteCoupon(id) {
        const coupons = this.getCoupons() || [];
        const filtered = coupons.filter(c => c.id !== id);
        localStorage.setItem(this.couponsKey, JSON.stringify(filtered));
        return coupons.length !== filtered.length;
    }
    
    // Добавление бизнеса
    addBusiness(business) {
        const businesses = this.getBusinesses() || [];
        business.id = 'b' + Date.now();
        business.createdAt = new Date().toISOString();
        businesses.push(business);
        localStorage.setItem(this.businessesKey, JSON.stringify(businesses));
        return business;
    }
    
    // Обновление бизнеса
    updateBusiness(id, updatedBusiness) {
        const businesses = this.getBusinesses() || [];
        const index = businesses.findIndex(b => b.id === id);
        if (index !== -1) {
            businesses[index] = {...businesses[index], ...updatedBusiness};
            localStorage.setItem(this.businessesKey, JSON.stringify(businesses));
            return businesses[index];
        }
        return null;
    }
    
    // Удаление бизнеса
    deleteBusiness(id) {
        const businesses = this.getBusinesses() || [];
        const filtered = businesses.filter(b => b.id !== id);
        localStorage.setItem(this.businessesKey, JSON.stringify(filtered));
        return businesses.length !== filtered.length;
    }
    
    // Экспорт данных
    exportData() {
        const data = {
            coupons: this.getCoupons(),
            businesses: this.getBusinesses(),
            timestamp: new Date().toISOString()
        };
        return JSON.stringify(data, null, 2);
    }
    
    // Импорт данных
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            if (data.coupons && data.businesses) {
                localStorage.setItem(this.couponsKey, JSON.stringify(data.coupons));
                localStorage.setItem(this.businessesKey, JSON.stringify(data.businesses));
                return true;
            }
            return false;
        } catch (e) {
            console.error('Invalid import data', e);
            return false;
        }
    }
    
    // Очистка данных (для разработки)
    clearAll() {
        localStorage.removeItem(this.couponsKey);
        localStorage.removeItem(this.businessesKey);
        this.initCoupons();
        this.initBusinesses();
    }
}
// Глобальный экземпляр для удобства
window.storage = new StorageManager();