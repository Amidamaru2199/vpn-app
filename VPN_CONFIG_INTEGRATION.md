# Интеграция с VPN конфигурацией через Telegram ID

## 📋 Как это работает

### Схема работы:

1. **Пользователь открывает приложение** через Telegram бот
2. **Получаем Telegram ID** пользователя автоматически
3. **При клике на "Добавить"** формируется URL: `https://bot.adronvpn.ru/key/main/{TELEGRAM_ID}`
4. **Приложение загружает конфигурацию** с сервера по этому URL
5. **Открывается V2Raytun** с полученной конфигурацией

## 🔧 Реализация

### Configurations.vue

```javascript
const installProfile = () => {
    if (!userId.value) {
        alert('Ошибка: Telegram ID не найден.')
        return
    }
    
    // URL для получения конфигурации
    const configUrl = `https://bot.adronvpn.ru/key/main/${userId.value}`
    
    // Перенаправляем через OpenApp
    const installUrl = `${window.location.origin}/vpn-app/openapp?key=${encodeURIComponent(configUrl)}&platform=${platform}`
    
    window.open(installUrl, '_blank')
}
```

### OpenApp.vue

```javascript
onMounted(async () => {
    const decodedKey = decodeURIComponent(key)
    
    // Если key - это URL, загружаем конфигурацию с сервера
    if (decodedKey.startsWith('http://') || decodedKey.startsWith('https://')) {
        const response = await fetch(decodedKey)
        const configData = await response.text()
        config.value = configData
    } else {
        // Иначе это прямая vless:// конфигурация
        config.value = decodedKey
    }
    
    // Открываем V2Raytun с конфигурацией
    if (isApplePlatform.value) {
        appURL.value = `v2raytun://import/${encodeURIComponent(config.value)}`
    } else if (isAndroid.value) {
        appURL.value = `intent://import/${encodeURIComponent(config.value)}#Intent;scheme=v2raytun;package=com.v2raytun.android;end`
    }
    
    window.location.href = appURL.value
})
```

## 📡 Формат ответа от сервера

Сервер по адресу `https://bot.adronvpn.ru/key/main/{TELEGRAM_ID}` должен возвращать:

**Content-Type:** `text/plain`

**Body:** Base64-encoded строка с vless конфигурациями, разделенными переводом строки

### Пример ответа:
```
dmxlc3M6Ly9iNzVlNThkYS00OWY0LTQzNGUtYWZlYS1hMzJhYzg1NGEzOWFANDUuMTI4LjYwLjI6NDQzP3R5cGU9dGNwJnNlY3VyaXR5PXJlYWxpdHkmcGJrPVdwR1A3R28zMHlEUEdaNkRETEtrUFhrUTRMd0FLVjJHSVMxT3hBVjE3a0EmZnA9Y2hyb21lJnNuaT13d3cuY2xvdWRmbGFyZS5jb20mc2lkPTllYjZmMDY1MGImc3B4PSUyRiNBZHJvblZQTl/Qm9C40YLQstCwIPCfh7Hwn4e5CnZsZXNzOi8vYjc1ZTU4ZGEtNDlmNC00MzRlLWFmZWEtYTMyYWM4NTRhMzlhQDUuMTgwLjQwLjMzOjQ0Mz90eXBlPXRjcCZzZWN1cml0eT1yZWFsaXR5JnBiaz1nMVFhRmF4d1FVZ2J6cUk5U0J0c3o1Qm1pNFpDU2FTcUlDZjFTNlBJN0FrJmZwPWNocm9tZSZzbmk9d3d3LmNsb3VkZmxhcmUuY29tJnNpZD03Y2VjMDI2NjMyJnNweD0lMkYjQWRyb25WUE5f0K3RgdGC0L7QvdC40Y8g8J+HqvCfh6o=
```

При декодировании из Base64 это даст несколько `vless://` конфигураций.

## 🎯 Использование

### Автоматическая установка:
1. Пользователь нажимает **"Добавить"**
2. Открывается страница OpenApp
3. Конфигурация загружается с сервера
4. V2Raytun автоматически открывается с конфигурацией

### Ручная установка:
1. Пользователь нажимает **"Скопировать ссылку на подписку"**
2. Копируется URL: `https://bot.adronvpn.ru/key/main/{TELEGRAM_ID}`
3. Пользователь вручную вставляет в V2Raytun

## 🔐 Безопасность

- Telegram ID используется как идентификатор пользователя
- Сервер должен проверять валидность запросов
- Конфигурации персонализированы для каждого пользователя

## 📝 Пример URL-ов

### Для Telegram ID: 302060345

**API URL:**
```
https://bot.adronvpn.ru/key/main/302060345
```

**OpenApp URL:**
```
https://your-domain.com/vpn-app/openapp?key=https%3A%2F%2Fbot.adronvpn.ru%2Fkey%2Fmain%2F302060345&platform=ios
```

**V2Raytun Deep Link (iOS/macOS):**
```
v2raytun://import/vless%3A%2F%2F...
```

**V2Raytun Intent (Android):**
```
intent://import/vless%3A%2F%2F...#Intent;scheme=v2raytun;package=com.v2raytun.android;end
```

## 🐛 Отладка

В консоли браузера можно увидеть:
```javascript
console.log('User Telegram ID:', userId.value)
console.log('Config URL:', configUrl)
console.log('Opening install URL:', installUrl)
console.log('Fetching config from URL:', decodedKey)
console.log('Config fetched successfully')
```

## ⚠️ Обработка ошибок

Приложение показывает ошибки пользователю:

1. **Telegram ID не найден:**
   ```
   "Ошибка: Telegram ID не найден. Пожалуйста, откройте приложение через Telegram бот."
   ```

2. **Ошибка загрузки конфигурации:**
   ```
   "Ошибка загрузки конфигурации с сервера: [детали ошибки]"
   ```

3. **Неподдерживаемая платформа:**
   ```
   "Unsupported platform: [платформа]"
   ```

## 🔄 Поток данных

```
User clicks "Добавить"
    ↓
Get Telegram ID from useTelegram()
    ↓
Build URL: https://bot.adronvpn.ru/key/main/{ID}
    ↓
Redirect to: /vpn-app/openapp?key={encoded_url}&platform={platform}
    ↓
OpenApp fetches config from URL
    ↓
Decode Base64 response
    ↓
Build V2Raytun deep link
    ↓
Open V2Raytun with config
```

