# 📘 Полное руководство по развёртыванию VPN App на новом сервере

## 📋 Содержание

1. [Требования](#требования)
2. [Подготовка сервера](#подготовка-сервера)
3. [Настройка Nginx](#настройка-nginx)
4. [Настройка SSL (HTTPS)](#настройка-ssl-https)
5. [Настройка проекта](#настройка-проекта)
6. [Деплой приложения](#деплой-приложения)
7. [Проверка работы](#проверка-работы)
8. [Обновление приложения](#обновление-приложения)
9. [Решение проблем](#решение-проблем)
10. [Автоматизация деплоя](#автоматизация-деплоя)

---

## 🔧 Требования

### На сервере должно быть установлено:

- **Nginx** (версия 1.18+)
- **Node.js** (версия 16+ для сборки, на сервере не обязательно)
- **SSL сертификат** (Let's Encrypt или другой)
- **SSH доступ** к серверу
- **Права sudo** для настройки

### На локальной машине:

- **Node.js** (версия 16+)
- **npm** или **yarn**
- **Git** (опционально)
- **SSH клиент**

---

## 🖥 Подготовка сервера

### Шаг 1: Подключение к серверу

```bash
# Подключись к серверу
ssh root@ВАШ_IP_АДРЕС
# или
ssh ваш_пользователь@ВАШ_IP_АДРЕС
```

### Шаг 2: Обновление системы

```bash
# Для Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# Для CentOS/RHEL
sudo yum update -y
```

### Шаг 3: Установка Nginx (если не установлен)

```bash
# Ubuntu/Debian
sudo apt install nginx -y

# CentOS/RHEL
sudo yum install nginx -y

# Запуск и автозапуск
sudo systemctl start nginx
sudo systemctl enable nginx

# Проверка статуса
sudo systemctl status nginx
```

### Шаг 4: Создание директорий для приложения

```bash
# Создаём директорию для приложения
sudo mkdir -p /var/www/vpn-app/dist

# Устанавливаем владельца (www-data для Ubuntu/Debian, nginx для CentOS)
# Ubuntu/Debian:
sudo chown -R www-data:www-data /var/www/vpn-app/

# CentOS/RHEL:
sudo chown -R nginx:nginx /var/www/vpn-app/

# Устанавливаем права
sudo find /var/www/vpn-app/ -type d -exec chmod 755 {} \;
sudo find /var/www/vpn-app/ -type f -exec chmod 644 {} \;
```

### Шаг 5: Проверка структуры

```bash
# Проверь что директория создана
ls -la /var/www/vpn-app/

# Должна быть структура:
# /var/www/vpn-app/
# └── dist/  (пока пустая)
```

---

## 🌐 Настройка Nginx

### Шаг 1: Определение конфигурационного файла

```bash
# Найди конфигурационные файлы
ls -la /etc/nginx/sites-available/
ls -la /etc/nginx/sites-enabled/

# Или для CentOS/RHEL:
ls -la /etc/nginx/conf.d/
```

Обычно это один из вариантов:
- `/etc/nginx/sites-available/default` (Ubuntu/Debian)
- `/etc/nginx/sites-available/ваш-домен.conf`
- `/etc/nginx/conf.d/default.conf` (CentOS/RHEL)
- `/etc/nginx/nginx.conf` (прямо в основном файле)

### Шаг 2: Создание или редактирование конфигурации

#### Вариант А: Если у вас уже есть конфигурация для домена

Открой существующий файл конфигурации:

```bash
sudo nano /etc/nginx/sites-available/ваш-домен.conf
# или
sudo nano /etc/nginx/conf.d/default.conf
```

Найди блок `server { ... }` для вашего домена и добавьте внутрь него:

```nginx
server {
    listen 443 ssl http2;
    server_name ваш-домен.ru;
    
    # ... существующие настройки SSL ...
    
    # ========== ДОБАВЬ ЭТОТ БЛОК ==========
    # Конфигурация для VPN App по пути /vpn-app
    location /vpn-app {
        alias /var/www/vpn-app/dist;
        try_files $uri $uri/ /vpn-app/index.html;
        
        # Заголовки для PWA manifest
        location ~* /vpn-app/manifest\.webmanifest$ {
            add_header Content-Type application/manifest+json;
            expires 1d;
            add_header Cache-Control "public";
        }
        
        # Service Worker (должен быть без кеша)
        location ~* /vpn-app/sw\.js$ {
            add_header Content-Type application/javascript;
            add_header Cache-Control "no-cache, no-store, must-revalidate";
            add_header Pragma "no-cache";
            add_header Expires "0";
        }
        
        # Статические файлы с долгим кешированием
        location ~* /vpn-app/.*\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # Заголовки безопасности
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }
    # ========== КОНЕЦ БЛОКА ==========
    
    # ... остальные location блоки ...
}
```

#### Вариант Б: Если создаёте новую конфигурацию

Создайте новый файл:

```bash
sudo nano /etc/nginx/sites-available/vpn-app.conf
```

Вставьте полную конфигурацию:

```nginx
# Редирект с HTTP на HTTPS
server {
    listen 80;
    server_name ваш-домен.ru;
    return 301 https://$server_name$request_uri;
}

# Основной сервер с HTTPS
server {
    listen 443 ssl http2;
    server_name ваш-домен.ru;
    
    # SSL сертификаты (замените на свои пути)
    ssl_certificate /etc/letsencrypt/live/ваш-домен.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ваш-домен.ru/privkey.pem;
    
    # SSL настройки
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Логи
    access_log /var/log/nginx/vpn-app-access.log;
    error_log /var/log/nginx/vpn-app-error.log;
    
    # Конфигурация для VPN App
    location /vpn-app {
        alias /var/www/vpn-app/dist;
        try_files $uri $uri/ /vpn-app/index.html;
        
        # PWA manifest
        location ~* /vpn-app/manifest\.webmanifest$ {
            add_header Content-Type application/manifest+json;
            expires 1d;
        }
        
        # Service Worker
        location ~* /vpn-app/sw\.js$ {
            add_header Content-Type application/javascript;
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }
        
        # Статические файлы
        location ~* /vpn-app/.*\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # Безопасность
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }
    
    # Корневой путь (опционально, для редиректа)
    location = / {
        return 301 /vpn-app/;
    }
}
```

Активируйте конфигурацию (Ubuntu/Debian):

```bash
sudo ln -s /etc/nginx/sites-available/vpn-app.conf /etc/nginx/sites-enabled/
```

### Шаг 3: Включение gzip сжатия (рекомендуется)

Добавьте в блок `server` или в `http` блок в `/etc/nginx/nginx.conf`:

```nginx
# Gzip сжатие
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types
    text/plain
    text/css
    text/xml
    text/javascript
    application/javascript
    application/xml+rss
    application/json
    application/manifest+json
    image/svg+xml;
```

### Шаг 4: Проверка и применение конфигурации

```bash
# Проверка синтаксиса
sudo nginx -t

# Если ошибок нет, перезагрузите nginx
sudo systemctl reload nginx

# Проверка статуса
sudo systemctl status nginx
```

**Важно:** Если `nginx -t` показывает ошибки, исправьте их перед перезагрузкой!

---

## 🔒 Настройка SSL (HTTPS)

### Вариант 1: Let's Encrypt (бесплатный, рекомендуется)

```bash
# Установка Certbot
# Ubuntu/Debian:
sudo apt install certbot python3-certbot-nginx -y

# CentOS/RHEL:
sudo yum install certbot python3-certbot-nginx -y

# Получение сертификата (замените на свой домен и email)
sudo certbot --nginx -d ваш-домен.ru -d www.ваш-домен.ru --email ваш@email.com --agree-tos --non-interactive

# Автоматическое обновление (добавится в cron автоматически)
sudo certbot renew --dry-run
```

### Вариант 2: Существующий сертификат

Если у вас уже есть SSL сертификат, укажите пути в конфигурации nginx:

```nginx
ssl_certificate /путь/к/fullchain.pem;
ssl_certificate_key /путь/к/privkey.pem;
```

---

## ⚙️ Настройка проекта

### Шаг 1: Клонирование или копирование проекта

```bash
# На локальной машине
cd ~/projects  # или другая папка

# Если проект в Git:
git clone https://github.com/ваш-репозиторий/vpn-app.git
cd vpn-app

# Или скопируйте проект вручную
```

### Шаг 2: Настройка API URL

Откройте файл `src/api/index.js` и проверьте/измените URL бэкенда:

```javascript
// Если бэкенд на том же домене:
const API_URL = 'https://ваш-домен.ru'

// Или если бэкенд на другом домене:
const API_URL = 'https://api.ваш-домен.ru'
```

### Шаг 3: Настройка base path (опционально)

Если хотите изменить путь приложения (по умолчанию `/vpn-app/`), откройте `vite.config.js`:

```javascript
export default defineConfig({
  base: '/ваш-путь/',  // Измените здесь
  // ...
})
```

**Важно:** Если меняете base path, не забудьте обновить конфигурацию nginx соответственно!

### Шаг 4: Установка зависимостей

```bash
# На локальной машине
npm install
```

---

## 🚀 Деплой приложения

### Вариант 1: Автоматический деплой (рекомендуется)

#### Шаг 1: Настройка скрипта деплоя

Откройте файл `update-and-deploy.sh` и измените переменные:

```bash
SERVER_USER="root"                    # Ваш SSH пользователь
SERVER_HOST="ВАШ_IP_ИЛИ_ДОМЕН"        # IP или домен сервера
SERVER_PATH="/var/www/vpn-app/dist"   # Путь на сервере
```

#### Шаг 2: Запуск деплоя

```bash
# Сделайте скрипт исполняемым
chmod +x update-and-deploy.sh

# Запустите деплой
./update-and-deploy.sh
```

Скрипт автоматически:
- ✅ Проверит git статус (если есть репозиторий)
- ✅ Соберёт приложение (`npm run build`)
- ✅ Создаст архив
- ✅ Загрузит файлы на сервер
- ✅ Распакует и установит права
- ✅ Проверит nginx конфигурацию
- ✅ Проверит доступность приложения

### Вариант 2: Ручной деплой

#### Шаг 1: Сборка приложения

```bash
# На локальной машине, в папке проекта
npm run build
```

После сборки должна появиться папка `dist/` с готовыми файлами.

#### Шаг 2: Загрузка файлов на сервер

**Способ А: rsync (рекомендуется, быстрее и надёжнее)**

```bash
# Загружает только изменённые файлы
rsync -avz --delete dist/ root@ВАШ_IP:/var/www/vpn-app/dist/

# С прогрессом
rsync -avz --progress --delete dist/ root@ВАШ_IP:/var/www/vpn-app/dist/
```

**Способ Б: scp (простой способ)**

```bash
# Создайте архив
tar -czf vpn-app.tar.gz -C dist .

# Загрузите на сервер
scp vpn-app.tar.gz root@ВАШ_IP:/tmp/

# Подключитесь к серверу и распакуйте
ssh root@ВАШ_IP
sudo tar -xzf /tmp/vpn-app.tar.gz -C /var/www/vpn-app/dist/
sudo chown -R www-data:www-data /var/www/vpn-app/
sudo rm /tmp/vpn-app.tar.gz
```

**Способ В: Git (если проект в репозитории)**

```bash
# На сервере
cd /var/www/vpn-app
git clone https://github.com/ваш-репозиторий/vpn-app.git .
npm install
npm run build
sudo mv dist /var/www/vpn-app/dist
sudo chown -R www-data:www-data /var/www/vpn-app/
```

#### Шаг 3: Установка прав доступа

```bash
# На сервере
sudo chown -R www-data:www-data /var/www/vpn-app/
sudo find /var/www/vpn-app/ -type d -exec chmod 755 {} \;
sudo find /var/www/vpn-app/ -type f -exec chmod 644 {} \;
```

---

## ✅ Проверка работы

### Шаг 1: Базовая проверка

1. Откройте в браузере: `https://ваш-домен.ru/vpn-app/`
2. Приложение должно загрузиться
3. Откройте консоль браузера (F12) и проверьте на ошибки

### Шаг 2: Проверка файлов на сервере

```bash
# Проверьте что файлы загружены
ls -la /var/www/vpn-app/dist/

# Должны быть файлы:
# - index.html
# - assets/
# - manifest.webmanifest (если PWA включен)
# - sw.js (если PWA включен)
```

### Шаг 3: Проверка логов

```bash
# Логи ошибок nginx
sudo tail -f /var/log/nginx/vpn-app-error.log

# Логи доступа
sudo tail -f /var/log/nginx/vpn-app-access.log

# Общие логи nginx
sudo tail -f /var/log/nginx/error.log
```

### Шаг 4: Проверка HTTP заголовков

```bash
# Проверка основного ответа
curl -I https://ваш-домен.ru/vpn-app/

# Проверка index.html
curl -I https://ваш-домен.ru/vpn-app/index.html

# Проверка статических файлов
curl -I https://ваш-домен.ru/vpn-app/assets/index-*.js
```

### Шаг 5: Проверка PWA (если включено)

1. Откройте `https://ваш-домен.ru/vpn-app/` в Chrome/Edge
2. В адресной строке должна появиться иконка установки
3. Откройте DevTools → Application → Service Workers
4. Service Worker должен быть активен

---

## 🔄 Обновление приложения

### Быстрое обновление

```bash
# На локальной машине
./update-and-deploy.sh
```

### Ручное обновление

```bash
# 1. Соберите новую версию
npm run build

# 2. Загрузите на сервер
rsync -avz --delete dist/ root@ВАШ_IP:/var/www/vpn-app/dist/

# 3. Установите права (на сервере)
ssh root@ВАШ_IP "sudo chown -R www-data:www-data /var/www/vpn-app/"
```

### Откат к предыдущей версии

Если скрипт создал бэкап:

```bash
# На сервере
sudo rm -rf /var/www/vpn-app/dist
sudo mv /var/www/vpn-app/dist.backup /var/www/vpn-app/dist
sudo chown -R www-data:www-data /var/www/vpn-app/
```

---

## 🐛 Решение проблем

### Проблема 1: 404 Not Found при открытии /vpn-app/

**Причины:**
- Неправильный путь в nginx конфигурации
- Файлы не загружены
- Неправильные права доступа

**Решение:**
```bash
# Проверьте путь к файлам
ls -la /var/www/vpn-app/dist/

# Проверьте права
sudo chown -R www-data:www-data /var/www/vpn-app/
sudo find /var/www/vpn-app/ -type d -exec chmod 755 {} \;
sudo find /var/www/vpn-app/ -type f -exec chmod 644 {} \;

# Проверьте nginx конфигурацию
sudo nginx -t
```

### Проблема 2: 403 Forbidden

**Причины:**
- Неправильные права доступа
- SELinux блокирует доступ (CentOS/RHEL)

**Решение:**
```bash
# Установите правильные права
sudo chown -R www-data:www-data /var/www/vpn-app/
sudo chmod -R 755 /var/www/vpn-app/

# Для CentOS/RHEL с SELinux:
sudo setsebool -P httpd_can_network_connect 1
sudo chcon -R -t httpd_sys_content_t /var/www/vpn-app/
```

### Проблема 3: 502 Bad Gateway

**Причины:**
- Nginx не запущен
- Ошибка в конфигурации nginx

**Решение:**
```bash
# Проверьте статус nginx
sudo systemctl status nginx

# Запустите если не запущен
sudo systemctl start nginx

# Проверьте конфигурацию
sudo nginx -t

# Перезагрузите если нужно
sudo systemctl reload nginx
```

### Проблема 4: Приложение не загружается после перехода по ссылкам

**Причина:**
- Проблема с роутингом SPA (Single Page Application)

**Решение:**
Убедитесь что в nginx конфигурации есть:
```nginx
try_files $uri $uri/ /vpn-app/index.html;
```

### Проблема 5: Ошибки CORS или API не работает

**Причина:**
- Неправильный API_URL в `src/api/index.js`
- Бэкенд не настроен для CORS

**Решение:**
1. Проверьте `src/api/index.js` - правильный ли API_URL
2. Пересоберите приложение: `npm run build`
3. Загрузите заново на сервер
4. Проверьте настройки CORS на бэкенде

### Проблема 6: PWA не устанавливается

**Причины:**
- Нет HTTPS (PWA требует HTTPS)
- Неправильный путь к manifest.webmanifest
- Service Worker не загружается

**Решение:**
```bash
# Проверьте доступность manifest
curl https://ваш-домен.ru/vpn-app/manifest.webmanifest

# Проверьте Service Worker
curl https://ваш-домен.ru/vpn-app/sw.js

# Убедитесь что используется HTTPS
```

### Проблема 7: Статические файлы не загружаются (404 на .js, .css)

**Причина:**
- Неправильный base path в vite.config.js
- Файлы не собраны правильно

**Решение:**
1. Проверьте `vite.config.js` - правильный ли `base`
2. Пересоберите: `npm run build`
3. Проверьте что в `dist/index.html` правильные пути к assets
4. Загрузите заново

### Проблема 8: Белый экран при загрузке

**Причина:**
- Ошибки JavaScript в консоли
- Проблемы с API

**Решение:**
1. Откройте консоль браузера (F12)
2. Проверьте ошибки в Console и Network
3. Проверьте логи nginx на сервере
4. Убедитесь что API_URL правильный и бэкенд доступен

---

## 🤖 Автоматизация деплоя

### Настройка CI/CD (опционально)

#### GitHub Actions пример

Создайте файл `.github/workflows/deploy.yml`:

```yaml
name: Deploy VPN App

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build
      run: npm run build
      
    - name: Deploy to server
      uses: appleboy/scp-action@master
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        source: "dist/*"
        target: "/var/www/vpn-app/dist/"
        
    - name: Set permissions
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        script: |
          sudo chown -R www-data:www-data /var/www/vpn-app/
          sudo find /var/www/vpn-app/ -type d -exec chmod 755 {} \;
          sudo find /var/www/vpn-app/ -type f -exec chmod 644 {} \;
```

Настройте Secrets в GitHub:
- `SERVER_HOST` - IP или домен сервера
- `SERVER_USER` - SSH пользователь
- `SSH_PRIVATE_KEY` - приватный SSH ключ

### Cron для автоматического обновления SSL

```bash
# Проверка обновления SSL сертификата (добавляется автоматически certbot)
sudo crontab -e

# Должна быть строка:
# 0 0,12 * * * certbot renew --quiet
```

---

## 📊 Мониторинг и логи

### Полезные команды для мониторинга

```bash
# Мониторинг логов в реальном времени
sudo tail -f /var/log/nginx/vpn-app-access.log
sudo tail -f /var/log/nginx/vpn-app-error.log

# Поиск ошибок
sudo grep -i error /var/log/nginx/vpn-app-error.log

# Статистика запросов
sudo awk '{print $1}' /var/log/nginx/vpn-app-access.log | sort | uniq -c | sort -rn | head -10

# Размер директории приложения
du -sh /var/www/vpn-app/dist/

# Количество файлов
find /var/www/vpn-app/dist/ -type f | wc -l
```

---

## 🔐 Безопасность

### Рекомендации по безопасности

1. **Огранчение доступа к файлам:**
```bash
# Убедитесь что только nginx имеет доступ
sudo chown -R www-data:www-data /var/www/vpn-app/
sudo chmod -R 755 /var/www/vpn-app/
```

2. **Firewall:**
```bash
# Откройте только необходимые порты
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp     # HTTP
sudo ufw allow 443/tcp    # HTTPS
sudo ufw enable
```

3. **Регулярные обновления:**
```bash
# Обновляйте систему регулярно
sudo apt update && sudo apt upgrade -y
```

4. **Резервное копирование:**
```bash
# Создайте скрипт бэкапа
#!/bin/bash
tar -czf /backup/vpn-app-$(date +%Y%m%d).tar.gz /var/www/vpn-app/dist/
```

---

## 📞 Поддержка

Если возникли проблемы:

1. Проверьте логи nginx
2. Проверьте консоль браузера (F12)
3. Убедитесь что все файлы загружены
4. Проверьте права доступа
5. Проверьте конфигурацию nginx

---

## ✅ Чеклист развёртывания

- [ ] Сервер подготовлен (Nginx установлен)
- [ ] Директории созданы (`/var/www/vpn-app/dist`)
- [ ] Права установлены (www-data:www-data)
- [ ] Nginx конфигурация настроена
- [ ] SSL сертификат установлен
- [ ] Проект настроен (API_URL правильный)
- [ ] Приложение собрано (`npm run build`)
- [ ] Файлы загружены на сервер
- [ ] Nginx перезагружен
- [ ] Приложение доступно по HTTPS
- [ ] Логи проверены на ошибки
- [ ] PWA работает (если включено)

---

**Готово! Приложение развёрнуто и готово к использованию! 🎉**

