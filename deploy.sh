#!/bin/bash

# Скрипт для быстрого деплоя VPN App на new.adronvpn.ru
# 
# Использование:
# 1. Измени переменные ниже под свой сервер
# 2. Запусти: chmod +x deploy.sh && ./deploy.sh

# ========== НАСТРОЙКИ ==========
SERVER_USER="root"                    # Твой SSH пользователь
SERVER_HOST="178.130.63.247"          # IP адрес твоего сервера
SERVER_PATH="/var/www/vpn-app/dist"   # Путь на сервере

# ========== ДЕПЛОЙ ==========

echo "🚀 Начинаем деплой VPN App на https://new.adronvpn.ru/vpn-app/"

# Проверяем что сборка существует
if [ ! -d "dist" ]; then
    echo "❌ Папка dist не найдена. Сначала собери приложение:"
    echo "npm run build"
    exit 1
fi

echo "📦 Сборка найдена в папке dist/"

# Создаём архив для загрузки
echo "🗜️  Создаём архив..."
tar -czf vpn-app-deploy.tar.gz -C dist .

# Загружаем на сервер
echo "⬆️  Загружаем файлы на сервер..."
scp vpn-app-deploy.tar.gz ${SERVER_USER}@${SERVER_HOST}:/tmp/

# Распаковываем на сервере
echo "📂 Распаковываем на сервере..."
ssh ${SERVER_USER}@${SERVER_HOST} << 'EOF'
    # Создаём папку если её нет
    sudo mkdir -p /var/www/vpn-app/dist
    
    # Бэкапим старую версию
    if [ -d "/var/www/vpn-app/dist.backup" ]; then
        sudo rm -rf /var/www/vpn-app/dist.backup
    fi
    if [ -d "/var/www/vpn-app/dist" ]; then
        sudo mv /var/www/vpn-app/dist /var/www/vpn-app/dist.backup
    fi
    
    # Создаём новую папку
    sudo mkdir -p /var/www/vpn-app/dist
    
    # Распаковываем новые файлы
    sudo tar -xzf /tmp/vpn-app-deploy.tar.gz -C /var/www/vpn-app/dist/
    
    # Устанавливаем права
    sudo chown -R www-data:www-data /var/www/vpn-app/
    sudo find /var/www/vpn-app/ -type d -exec chmod 755 {} \;
    sudo find /var/www/vpn-app/ -type f -exec chmod 644 {} \;
    
    # Очищаем временные файлы
    sudo rm -f /tmp/vpn-app-deploy.tar.gz
    
    echo "✅ Файлы обновлены на сервере"
EOF

# Удаляем локальный архив
rm -f vpn-app-deploy.tar.gz

echo ""
echo "🎉 Деплой завершён!"
echo "🌐 Приложение доступно по адресу: https://new.adronvpn.ru/vpn-app/"
echo ""
echo "📊 Для проверки логов используй:"
echo "ssh ${SERVER_USER}@${SERVER_HOST} 'sudo tail -f /var/log/nginx/error.log'"
