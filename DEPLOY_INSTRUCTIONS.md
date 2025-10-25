# 🚀 Инструкция по развёртыванию VPN App на app.adron-soft.ru

## 📋 Что уже готово

✅ **dist/** - собранное PWA приложение (27 файлов включая Service Worker)  
✅ **nginx-vpn-app.conf** - дополнительная конфигурация для существующего nginx  
✅ **Настройка base: '/vpn-app'** - приложение работает по пути /vpn-app  
✅ **Домен с SSL:** https://app.adron-soft.ru/ уже настроен

**Результат:** Твоё приложение будет доступно по адресу **https://app.adron-soft.ru/vpn-app/**  
Бэкенд бота продолжит работать на основном домене без изменений.

## 🔧 Настройка на сервере

### 1. Подготовка директорий на сервере
```bash
# Подключись к серверу app.adron-soft.ru и создай директорию
sudo mkdir -p /var/www/vpn-app
sudo chown $USER:$USER /var/www/vpn-app
```

### 2. Загрузка файлов приложения

#### Вариант А: Через SCP (рекомендуется)
```bash
# На твоём локальном компьютере из папки vpn-app:
scp -r dist/* root@77.110.105.100:/var/www/vpn-app/dist/
```

#### Вариант Б: Через rsync (более надёжно)
```bash
# С локального компьютера:
rsync -avz --delete dist/ root@77.110.105.100:/var/www/vpn-app/dist/
```

#### Вариант В: Архивом
```bash
# Создай архив локально:
tar -czf vpn-app-dist.tar.gz -C dist .

# Загрузи на сервер:
scp vpn-app-dist.tar.gz root@77.110.105.100:/tmp/

# На сервере распакуй:
cd /var/www/vpn-app
sudo tar -xzf /tmp/vpn-app-dist.tar.gz -C dist/
sudo chown -R www-data:www-data dist/
```

### 3. Настройка Nginx (дополнение к существующей конфигурации)

**ВАЖНО:** Не создаём новый server блок! Дополняем существующий для app.adron-soft.ru.

#### 3.1 Найди текущую конфигурацию nginx
```bash
# На сервере app.adron-soft.ru найди конфигурационный файл:
sudo ls /etc/nginx/sites-available/
sudo ls /etc/nginx/sites-enabled/

# Обычно это может быть:
# /etc/nginx/sites-available/default
# /etc/nginx/sites-available/app.adron-soft.ru  
# /etc/nginx/nginx.conf
```

#### 3.2 Добавь конфигурацию для VPN App
```bash
# Загрузи конфигурацию с локального компьютера:
scp nginx-vpn-app.conf root@77.110.105.100:/tmp/

# На сервере открой СУЩЕСТВУЮЩИЙ конфигурационный файл nginx:
sudo nano /etc/nginx/sites-available/default  # или другой файл конфигурации

# Найди server { блок для app.adron-soft.ru и добавь ВНУТРЬ него 
# location блоки из файла /tmp/nginx-vpn-app.conf

# НЕ создавай новый server блок, а дополни существующий!
```

#### 3.3 Пример результата в nginx конфиге
```nginx
server {
    listen 443 ssl http2;
    server_name app.adron-soft.ru;
    
    # ... существующие настройки SSL и бота ...
    
    # ДОБАВЬ СЮДА блок для VPN App:
    location /vpn-app {
        alias /var/www/vpn-app/dist;
        try_files $uri $uri/ /vpn-app/index.html;
        
        # ... остальные настройки из nginx-vpn-app.conf ...
    }
    
    # ... остальные location блоки для бота ...
}
```

#### 3.4 Проверь и примени конфигурацию
```bash
# Проверь синтаксис:
sudo nginx -t

# Если OK - перезапусти:
sudo systemctl reload nginx

# Проверь статус:
sudo systemctl status nginx
```

### 4. Установка прав доступа
```bash
# Правильные права для Nginx:
sudo chown -R www-data:www-data /var/www/vpn-app/
sudo find /var/www/vpn-app/ -type d -exec chmod 755 {} \;
sudo find /var/www/vpn-app/ -type f -exec chmod 644 {} \;
```

## 🌐 DNS уже настроен

✅ Домен https://app.adron-soft.ru/ уже корректно настроен и работает  
✅ SSL сертификат установлен и активен

## ✅ Проверка работы

### Базовая проверка:
1. **Открой:** `https://app.adron-soft.ru/vpn-app/`
2. Приложение должно загрузиться
3. Проверь что основной бот продолжает работать: `https://app.adron-soft.ru/`
4. Проверь консоль браузера (F12) на ошибки

### Проверка PWA:
1. В Chrome/Edge открой приложение: `https://app.adron-soft.ru/vpn-app/`
2. В адресной строке должна появиться иконка установки PWA
3. Service Worker должен работать (проверь в DevTools → Application → Service Workers)
4. Можешь установить приложение на рабочий стол/домашний экран

### Проверка логов:
```bash
# Логи ошибок:
sudo tail -f /var/log/nginx/vpn-app-error.log

# Логи доступа:
sudo tail -f /var/log/nginx/vpn-app-access.log

# Общие логи Nginx:
sudo tail -f /var/log/nginx/error.log
```

## 🔄 Обновление приложения в будущем

Когда внесёшь изменения в код:

1. **Собери новую версию:**
   ```bash
   npm run build
   ```

2. **Загрузи на сервер:**
   ```bash
   rsync -avz --delete dist/ root@77.110.105.100:/var/www/vpn-app/dist/
   ```

3. **Готово!** Nginx сразу начнёт отдавать новые файлы

## 🐛 Решение проблем

### 404 Not Found при открытии /vpn-app/
- Проверь путь к файлам: `ls -la /var/www/vpn-app/dist/`
- Проверь права: `sudo chown -R www-data:www-data /var/www/vpn-app/`

### 403 Forbidden
```bash
# Проверь права:
sudo chmod -R 755 /var/www/vpn-app/
sudo chown -R www-data:www-data /var/www/vpn-app/

# Проверь SELinux (если есть):
sudo setsebool -P httpd_can_network_connect 1
```

### 502 Bad Gateway
```bash
# Проверь запущен ли Nginx:
sudo systemctl status nginx
sudo systemctl start nginx

# Проверь конфигурацию:
sudo nginx -t
```

### Приложение не загружается после перехода по ссылкам
- Это нормально для SPA - конфигурация nginx уже настроена с `try_files`
- Проверь что в браузере нет старого кеша (Ctrl+F5)

### PWA не устанавливается
- Проверь что manifest.webmanifest доступен: `/vpn-app/manifest.webmanifest`
- Проверь что Service Worker загружается: `/vpn-app/sw.js`
- Для PWA нужен HTTPS в продакшне (кроме localhost)

## 🔒 SSL уже настроен

✅ **HTTPS работает:** https://app.adron-soft.ru/ уже использует SSL  
✅ **PWA готова к работе:** с HTTPS все PWA функции работают полноценно  
✅ **Приложение можно устанавливать** как нативное на устройства

## 📱 Особенности PWA

После деплоя твоё приложение будет:
- ✅ Устанавливаться как нативное приложение  
- ✅ Работать офлайн (благодаря Service Worker)
- ✅ Иметь иконку на домашнем экране
- ✅ Кешировать ресурсы для быстрой загрузки
- ✅ Полноценно работать с HTTPS (уже настроен на app.adron-soft.ru)

## 📞 Поддержка

Если что-то не работает:
1. Проверь логи nginx
2. Проверь консоль браузера
3. Убедись что все файлы загружены
4. Проверь права доступа к файлам

---

**Готово! Твоё PWA приложение развёрнуто и готово к использованию! 🎉**
