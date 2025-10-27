#!/bin/bash

# 🚀 Полный скрипт обновления и деплоя VPN App
# 
# Использование: ./update-and-deploy.sh
# Этот скрипт автоматически собирает и деплоит изменения

# ========== НАСТРОЙКИ ==========
SERVER_USER="root"
SERVER_HOST="178.130.63.247"
SERVER_PATH="/var/www/vpn-app/dist"

# Цвета для красивого вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Начинаем полное обновление VPN App...${NC}"

# ========== 1. ПРОВЕРКА GIT ==========
echo -e "${YELLOW}📋 Проверяем статус git...${NC}"
if [ -d ".git" ]; then
    # Показываем статус
    git status --porcelain
    
    # Спрашиваем про коммит
    read -p "Хочешь сделать git commit? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Введи сообщение коммита: " commit_message
        git add .
        git commit -m "$commit_message"
        
        read -p "Push в удалённый репозиторий? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git push
        fi
    fi
fi

# ========== 2. СБОРКА ==========
echo -e "${YELLOW}🔨 Собираем приложение...${NC}"

# Устанавливаем зависимости если нужно
if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
    echo -e "${BLUE}📦 Устанавливаем/обновляем зависимости...${NC}"
    npm install
fi

# Собираем
echo -e "${BLUE}⚙️  Запускаем сборку...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка при сборке! Проверь код.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Сборка завершена успешно!${NC}"

# ========== 3. ДЕПЛОЙ ==========
echo -e "${YELLOW}📤 Загружаем на сервер...${NC}"

# Проверяем что сборка существует
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Папка dist не найдена!${NC}"
    exit 1
fi

echo -e "${BLUE}📁 Найдено файлов для деплоя: $(find dist -type f | wc -l)${NC}"

# Создаём архив с временной меткой
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
ARCHIVE_NAME="vpn-app-deploy-${TIMESTAMP}.tar.gz"

echo -e "${BLUE}🗜️  Создаём архив ${ARCHIVE_NAME}...${NC}"
tar -czf "$ARCHIVE_NAME" -C dist .

# Загружаем на сервер
echo -e "${BLUE}⬆️  Загружаем файлы на сервер...${NC}"
scp "$ARCHIVE_NAME" ${SERVER_USER}@${SERVER_HOST}:/tmp/

# Распаковываем на сервере
echo -e "${BLUE}📂 Обновляем файлы на сервере...${NC}"
ssh ${SERVER_USER}@${SERVER_HOST} << EOF
    echo "🔄 Создаём бэкап текущей версии..."
    if [ -d "/var/www/vpn-app/dist" ]; then
        sudo rm -rf /var/www/vpn-app/dist.backup
        sudo mv /var/www/vpn-app/dist /var/www/vpn-app/dist.backup
    fi
    
    echo "📂 Создаём новую папку..."
    sudo mkdir -p /var/www/vpn-app/dist
    
    echo "📦 Распаковываем новые файлы..."
    sudo tar -xzf /tmp/$ARCHIVE_NAME -C /var/www/vpn-app/dist/
    
    echo "🔐 Устанавливаем права..."
    sudo chown -R www-data:www-data /var/www/vpn-app/
    sudo find /var/www/vpn-app/ -type d -exec chmod 755 {} \;
    sudo find /var/www/vpn-app/ -type f -exec chmod 644 {} \;
    
    echo "🗑️  Очищаем временные файлы..."
    sudo rm -f /tmp/$ARCHIVE_NAME
    
    echo "✅ Файлы обновлены на сервере!"
    
    echo "🔍 Проверяем nginx..."
    sudo nginx -t
    if [ \$? -eq 0 ]; then
        echo "✅ Nginx конфигурация корректна"
    else
        echo "❌ Проблема с nginx конфигурацией!"
        exit 1
    fi
EOF

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка при деплое на сервер!${NC}"
    exit 1
fi

# Удаляем локальный архив
rm -f "$ARCHIVE_NAME"

# Удаляем все старые архивы деплоя
echo -e "${BLUE}🧹 Очищаем старые архивы...${NC}"
rm -f vpn-app-deploy-*.tar.gz 2>/dev/null
echo -e "${GREEN}✅ Архивы очищены${NC}"

# ========== 4. ПРОВЕРКА ==========
echo -e "${YELLOW}🧪 Проверяем результат...${NC}"

# Проверяем HTTP статус
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://app.adron-soft.ru/vpn-app/)

if [ "$HTTP_STATUS" == "200" ]; then
    echo -e "${GREEN}✅ Приложение доступно и отвечает!${NC}"
else
    echo -e "${RED}⚠️  Приложение отвечает с кодом: $HTTP_STATUS${NC}"
fi

# ========== ГОТОВО ==========
echo ""
echo -e "${GREEN}🎉 Деплой завершён успешно!${NC}"
echo -e "${BLUE}🌐 Приложение доступно по адресу: https://app.adron-soft.ru/vpn-app/${NC}"
echo -e "${BLUE}🤖 Основной бот: https://app.adron-soft.ru/${NC}"
echo ""
echo -e "${YELLOW}📊 Для мониторинга логов:${NC}"
echo -e "${BLUE}   ssh ${SERVER_USER}@${SERVER_HOST} 'sudo tail -f /var/log/nginx/error.log'${NC}"
echo ""
echo -e "${GREEN}✨ Готово! Приложение обновлено.${NC}"
