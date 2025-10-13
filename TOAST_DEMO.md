# Демонстрация Toast компонента

## Быстрый тест

Чтобы протестировать все типы toast уведомлений, добавьте этот код в любой компонент:

```vue
<template>
  <div class="toast-demo">
    <button @click="showSuccess">Success Toast</button>
    <button @click="showError">Error Toast</button>
    <button @click="showWarning">Warning Toast</button>
    <button @click="showInfo">Info Toast</button>
    <button @click="showMultiple">Show Multiple</button>
  </div>
</template>

<script setup>
import { useToast } from '../composables/useToast'

const { success, error, warning, info } = useToast()

const showSuccess = () => {
  success('Операция выполнена успешно! ✓')
}

const showError = () => {
  error('Произошла ошибка при выполнении операции')
}

const showWarning = () => {
  warning('Внимание! Убедитесь что вы сохранили изменения')
}

const showInfo = () => {
  info('Для получения чеков укажите email в настройках')
}

const showMultiple = () => {
  info('Первое уведомление')
  setTimeout(() => success('Второе уведомление'), 500)
  setTimeout(() => warning('Третье уведомление'), 1000)
  setTimeout(() => error('Четвертое уведомление'), 1500)
}
</script>

<style scoped>
.toast-demo {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
}

button {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  background: #4CAF50;
  color: white;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  opacity: 0.9;
}
</style>
```

## Текущее использование в проекте

### 1. Копирование ключей серверов
Файл: `src/views/Servers.vue`
```javascript
// При клике на сервер копируется ключ
copyToClipboard(server.key, 'Ключ сервера скопирован!')
```

### 2. Обновление настроек
Файл: `src/views/Settings.vue`
```javascript
// Автоплатежи
await usersStore.updateAutoPaymentsSettings(userId.value, value)
// Toast показывается автоматически в store

// Email
await usersStore.updateEmailSettings(userId.value, email.value)
// Toast показывается автоматически в store
```

### 3. Сохранение серверов
Файл: `src/views/Servers.vue`
```javascript
const success = await usersStore.saveSelectedServers(userId.value)
// Toast: "Серверы успешно обновлены" показывается в store
```

### 4. Валидация
Файл: `src/views/Servers.vue`
```javascript
if (currentSelectedCount < 1) {
    showError('Должен быть выбран хотя бы 1 сервер')
    return
}

if (value && currentSelectedCount >= maxServers) {
    showError(`Максимальное количество серверов: ${maxServers}. Сначала отключите другой сервер.`)
    return
}
```

### 5. Ошибки API
Файл: `src/stores/index.js`
```javascript
const fetchServers = async (tg_id) => {
    try {
        const data = await getServers(tg_id)
        servers.value = data.сервера
    } catch (err) {
        error('Ошибка при загрузке серверов')
        console.error('Failed to fetch servers:', err)
    }
}
```

## Где НЕ используется Toast (планы на будущее)

1. **App.vue** - строка 55: `alert('Ошибка: Telegram ID не найден')`
   - Можно заменить на: `showError('Ошибка: Telegram ID не найден')`

2. **Tarifes.vue** - обработка ошибок при создании платежа
   - Добавить toast при успешном создании платежа

## Преимущества перед alert()

✅ Не блокирует интерфейс  
✅ Красивый дизайн  
✅ Автоматическое скрытие  
✅ Поддержка нескольких уведомлений  
✅ Анимация появления/исчезновения  
✅ Разные типы для разных ситуаций  
✅ Ручное закрытие кликом  
✅ Адаптивность  

## Рекомендации

1. Используйте `success` для подтверждения успешных операций
2. Используйте `error` для показа ошибок и проблем
3. Используйте `warning` для важных предупреждений
4. Используйте `info` для подсказок и информационных сообщений
5. Для критичных ошибок можно увеличить duration до 5000-6000ms
6. Для простых подтверждений достаточно 2000-3000ms

