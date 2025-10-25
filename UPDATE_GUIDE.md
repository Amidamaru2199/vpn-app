# 🔄 Руководство по обновлению VPN App

## 🚀 Быстрое обновление (рекомендуется)

**После любых изменений в коде запусти:**

```bash
./update-and-deploy.sh
```

**Этот скрипт автоматически:**
- ✅ Предложит сделать git commit
- ✅ Установит зависимости если нужно
- ✅ Соберёт приложение (`npm run build`)
- ✅ Загрузит на сервер с бэкапом
- ✅ Установит права доступа
- ✅ Проверит что всё работает

## 🛠 Ручное обновление

Если хочешь всё контролировать сам:

### 1. Сборка
```bash
npm run build
```

### 2. Простой деплой (без git)
```bash
./deploy.sh
```

### 3. Проверка
- Открой: https://new.adronvpn.ru/vpn-app/
- Проверь консоль браузера (F12)

## 🔍 Типичные проблемы и решения

### 403 Forbidden после обновления
```bash
ssh root@77.110.105.100
sudo chown -R www-data:www-data /var/www/vpn-app/
sudo chmod -R 755 /var/www/vpn-app/
```

### Белый экран после обновления
1. **Очисти кеш браузера** (Ctrl+F5)
2. **Проверь консоль** на ошибки JavaScript
3. **Проверь логи nginx:**
   ```bash
   ssh root@77.110.105.100 'sudo tail -f /var/log/nginx/error.log'
   ```

### Service Worker не обновляется
```bash
# В браузере:
# F12 → Application → Service Workers → Update
# Или Hard Refresh (Ctrl+Shift+R)
```

## 📱 Особенности Telegram Web App

- **В браузере:** ограниченная функциональность
- **В Telegram боте:** полная функциональность через кнопку Web App
- **URL для бота:** https://new.adronvpn.ru/vpn-app/

## 🔄 Откат к предыдущей версии

Если что-то пошло не так:

```bash
ssh root@77.110.105.100
sudo rm -rf /var/www/vpn-app/dist
sudo mv /var/www/vpn-app/dist.backup /var/www/vpn-app/dist
sudo systemctl reload nginx
```

## 📊 Мониторинг

### Проверка статуса
```bash
curl -I https://new.adronvpn.ru/vpn-app/
# Должен вернуть: HTTP/2 200
```

### Логи nginx
```bash
ssh root@77.110.105.100 'sudo tail -f /var/log/nginx/error.log'
```

### Размер приложения
```bash
ssh root@77.110.105.100 'du -sh /var/www/vpn-app/dist/'
```

---

## 💡 Рекомендации

1. **Всегда используй** `./update-and-deploy.sh` - он делает всё автоматически
2. **Тестируй локально** перед деплоем: `npm run dev`
3. **Делай git commits** для отслеживания изменений
4. **Проверяй в Telegram боте** после каждого обновления

**Готово! Процесс обновления максимально автоматизирован! 🎉**
