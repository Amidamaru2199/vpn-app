# VPN App - PWA приложение

Vue.js PWA приложение с возможностью установки как нативное приложение.

## 🚀 Быстрый старт

### Разработка
```bash
npm install
npm run dev
```

### Сборка для продакшна
```bash
npm run build
```

### Деплой на https://app.adron-soft.ru/vpn-app/
```bash
# Быстрое обновление (рекомендуется)
./update-and-deploy.sh

# Или только деплой (без пересборки)
./deploy.sh
```

## 📁 Файлы для деплоя

- `nginx-vpn-app.conf` - конфигурация nginx (добавить к существующему)
- `DEPLOY_INSTRUCTIONS.md` - подробная инструкция по развёртыванию
- `deploy.sh` - скрипт для автоматического деплоя
- `update-and-deploy.sh` - полный скрипт обновления (сборка + деплой)
- `UPDATE_GUIDE.md` - руководство по обновлениям

## 🌐 URL после деплоя

**Приложение:** https://app.adron-soft.ru/vpn-app/  
**Бот (без изменений):** https://app.adron-soft.ru/

## 📱 PWA функции

- ✅ Установка как нативное приложение
- ✅ Работа офлайн (Service Worker)
- ✅ Push уведомления (готово к настройке)
- ✅ Иконки для всех устройств

## 🛠 Технологии

- Vue 3 + Composition API
- Vite для сборки
- PWA plugin для Service Worker
- SCSS для стилей
