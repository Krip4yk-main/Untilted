import { ILanguage } from '../language.model';

export const uaLanguage: ILanguage = {
    userRole: {
        User: 'Користувач',
        Dm: 'Майстер',
        Manager: 'Менеджер',
        Admin: 'Адміністратор',
    },
    good: {
        id: 'ID',
        priceHistory: 'Історія цін',
        uniqueId: 'Унікальний ID',
        uniqueCode: 'Унікальний код',
        name: 'Назва',
        type: 'Тип',
        imageUrl: 'Зображення',
        description: 'Опис',
        shortDescription: 'Короткий опис',
        notes: 'Примітки',
        storage: 'Склад',
        storageType: 'Одиниці',
        nullPrice: 'Собівартість',
        sellPrice: 'Ціна',
        wholePrice: 'Оптова ціна',
        wholeCount: 'Оптова к-сть',
        createdAt: 'Створено',
        updatedAt: 'Оновлено',
        createdBy: 'Створено',
        updatedBy: 'Оновлено',
        deleted: 'Видалено',
    },
    adminTab: {
        goods: 'Товари',
        management: 'Менеджмент',
        statistics: 'Статистика',
        history: 'Історія',
    },
    storageType: {
        items: 'шт.',
        meters: 'м',
    },
    headerTab: {
        admin: 'Адміністрування',
        store: 'Магазин',
    },
    misc: {
        logout: 'Вийти',
        profit: 'Прибуток',
        actions: 'Дії',
        addGood: 'Додати товар',
        modifyPrices: 'Змінити ціни',
    },
};
