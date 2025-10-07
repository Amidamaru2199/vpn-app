# Как получить Telegram ID пользователя - Quick Start

## ✅ Что уже настроено

1. ✅ Telegram WebApp API подключен в `index.html`
2. ✅ Создан composable `useTelegram.js` для работы с Telegram API
3. ✅ Добавлен в `OpenApp.vue` и `Home.vue`

## 🚀 Быстрый старт

### Использование в любом компоненте:

```vue
<template>
    <div>
        <p v-if="userId">Telegram ID: {{ userId }}</p>
        <p v-if="user">Привет, {{ user.first_name }}!</p>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useTelegram } from '../composables/useTelegram'

const { user, userId, initTelegram } = useTelegram()

onMounted(() => {
    initTelegram()
    
    // Теперь userId.value содержит Telegram ID
    console.log('Telegram ID:', userId.value)
})
</script>
```

## 📋 Доступные данные

После вызова `initTelegram()`:

- `userId.value` - Telegram ID (число)
- `user.value` - Объект с данными пользователя:
  - `id` - Telegram ID
  - `first_name` - Имя
  - `last_name` - Фамилия
  - `username` - Username
  - `language_code` - Код языка

## 📝 Примеры использования

### Пример 1: Отправка на сервер

```javascript
const sendToServer = async () => {
    if (userId.value) {
        await fetch('/api/users', {
            method: 'POST',
            body: JSON.stringify({
                telegram_id: userId.value,
                name: user.value.first_name
            })
        })
    }
}
```

### Пример 2: Сохранение в localStorage

```javascript
if (userId.value) {
    localStorage.setItem('telegram_id', userId.value)
}
```

### Пример 3: Условный рендеринг

```vue
<template>
    <div v-if="userId">
        <h1>Добро пожаловать, {{ user.first_name }}!</h1>
        <p>Ваш ID: {{ userId }}</p>
    </div>
    <div v-else>
        <p>Загрузка данных пользователя...</p>
    </div>
</template>
```

## 🔧 Дополнительные функции

```javascript
const { 
    user,              // Данные пользователя
    userId,            // Telegram ID
    initTelegram,      // Инициализация
    showBackButton,    // Показать кнопку "Назад"
    hideBackButton,    // Скрыть кнопку "Назад"
    showMainButton,    // Показать главную кнопку
    hideMainButton,    // Скрыть главную кнопку
    closeTelegram      // Закрыть приложение
} = useTelegram()
```

## ⚠️ Важно

1. Данные доступны только при запуске через Telegram
2. Для локального тестирования используйте Telegram Bot
3. Для безопасной авторизации валидируйте `initData` на сервере

## 📚 Подробная документация

См. файл `TELEGRAM_API_USAGE.md` для полной документации.

