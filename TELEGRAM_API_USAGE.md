# Использование Telegram WebApp API

## Получение Telegram ID пользователя

### Метод 1: Использование composable `useTelegram` (рекомендуется)

```javascript
import { useTelegram } from '../composables/useTelegram'
import { onMounted } from 'vue'

const { user, userId, initTelegram } = useTelegram()

onMounted(() => {
    initTelegram()
    
    if (userId.value) {
        console.log('Telegram ID:', userId.value)
        console.log('User info:', user.value)
        // user.value содержит:
        // {
        //   id: 123456789,
        //   first_name: "John",
        //   last_name: "Doe",
        //   username: "johndoe",
        //   language_code: "ru"
        // }
    }
})
```

### Метод 2: Прямое использование Telegram WebApp API

```javascript
const tg = window.Telegram?.WebApp

if (tg) {
    const user = tg.initDataUnsafe?.user
    
    if (user) {
        const telegramId = user.id
        const firstName = user.first_name
        const lastName = user.last_name
        const username = user.username
        
        console.log('Telegram ID:', telegramId)
    }
}
```

## Доступные данные пользователя

```javascript
user.value = {
    id: 123456789,              // Telegram ID (число)
    first_name: "John",         // Имя
    last_name: "Doe",           // Фамилия (может отсутствовать)
    username: "johndoe",        // Username (может отсутствовать)
    language_code: "ru",        // Код языка
    is_premium: true,           // Premium статус (может отсутствовать)
    photo_url: "https://..."    // URL фото профиля (может отсутствовать)
}
```

## Дополнительные функции composable

### Управление кнопкой "Назад"

```javascript
import { useTelegram } from '../composables/useTelegram'
import { useRouter } from 'vue-router'

const router = useRouter()
const { showBackButton, hideBackButton } = useTelegram()

// Показать кнопку "Назад"
showBackButton(() => {
    router.back()
})

// Скрыть кнопку
hideBackButton()
```

### Управление главной кнопкой

```javascript
const { showMainButton, hideMainButton } = useTelegram()

// Показать главную кнопку
showMainButton('Продолжить', () => {
    console.log('Кнопка нажата')
})

// Скрыть главную кнопку
hideMainButton()
```

### Закрытие Mini App

```javascript
const { closeTelegram } = useTelegram()

// Закрыть приложение
closeTelegram()
```

## Пример полного использования в компоненте

```vue
<template>
    <div>
        <div v-if="userId">
            <h2>Привет, {{ user.first_name }}!</h2>
            <p>Ваш Telegram ID: {{ userId }}</p>
        </div>
        <div v-else>
            <p>Данные пользователя не загружены</p>
        </div>
        
        <button @click="handleAction">Продолжить</button>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegram } from '../composables/useTelegram'

const router = useRouter()
const { user, userId, initTelegram, showBackButton, showMainButton } = useTelegram()

onMounted(() => {
    // Инициализируем Telegram WebApp
    initTelegram()
    
    // Показываем кнопку "Назад"
    showBackButton(() => {
        router.back()
    })
    
    // Проверяем ID пользователя
    if (userId.value) {
        console.log('User logged in:', userId.value)
        
        // Можно отправить на сервер для регистрации/авторизации
        // sendToServer(userId.value)
    }
})

const handleAction = () => {
    // Ваша логика
}
</script>
```

## Отправка данных на сервер

```javascript
const sendUserToServer = async () => {
    if (userId.value) {
        try {
            const response = await fetch('https://your-api.com/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    telegram_id: userId.value,
                    first_name: user.value.first_name,
                    last_name: user.value.last_name,
                    username: user.value.username,
                })
            })
            
            const data = await response.json()
            console.log('User saved:', data)
        } catch (error) {
            console.error('Error saving user:', error)
        }
    }
}
```

## Важные замечания

1. **Безопасность**: Telegram ID - это публичная информация, но её следует проверять на сервере используя `initData` для валидации.

2. **Доступность данных**: Данные пользователя доступны только если приложение открыто через Telegram.

3. **Тестирование**: Для тестирования локально данные могут быть недоступны. Используйте Telegram Bot для запуска Mini App.

4. **initData**: Для безопасной авторизации используйте `tg.initData` - это подписанная строка с данными пользователя.

```javascript
const tg = window.Telegram?.WebApp
const initData = tg.initData // Отправьте это на сервер для валидации
```

