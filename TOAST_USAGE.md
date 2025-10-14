# Toast Уведомления

## Описание

Компонент Toast используется для показа красивых уведомлений пользователю вместо стандартных `alert()`. Уведомления появляются в правом верхнем углу экрана и автоматически исчезают через заданное время.

## Типы уведомлений

- **success** (зеленый) - успешные операции
- **error** (красный) - ошибки
- **warning** (оранжевый) - предупреждения
- **info** (синий) - информационные сообщения

## Использование

### В компонентах Vue

```vue
<script setup>
import { useToast } from '../composables/useToast'

const { success, error, warning, info } = useToast()

// Примеры использования
const handleSuccess = () => {
  success('Операция выполнена успешно!')
}

const handleError = () => {
  error('Произошла ошибка')
}

const handleWarning = () => {
  warning('Внимание! Это важно')
}

const handleInfo = () => {
  info('Полезная информация')
}

// С кастомным временем отображения (в миллисекундах)
const customDuration = () => {
  success('Это сообщение покажется на 5 секунд', 5000)
}
</script>
```

### В Pinia Store

```javascript
import { useToast } from '../composables/useToast'

export const useMyStore = defineStore('myStore', () => {
  const { success, error } = useToast()
  
  const saveData = async () => {
    try {
      // ... ваш код
      success('Данные успешно сохранены')
    } catch (err) {
      error('Ошибка при сохранении данных')
    }
  }
  
  return { saveData }
})
```

### Базовое использование

```javascript
import { useToast } from './composables/useToast'

const { show } = useToast()

// Показать уведомление с кастомным типом и длительностью
show('Текст сообщения', 'success', 3000)
```

## API

### Методы

- `success(message, duration = 3000)` - показать успешное уведомление
- `error(message, duration = 4000)` - показать ошибку (по умолчанию на 4 секунды)
- `warning(message, duration = 3000)` - показать предупреждение
- `info(message, duration = 3000)` - показать информационное сообщение
- `show(message, type, duration)` - базовый метод для показа любого типа
- `remove(id)` - удалить конкретное уведомление по ID
- `clear()` - очистить все уведомления

### Параметры

- **message** (string) - текст уведомления
- **type** (string) - тип уведомления: 'success' | 'error' | 'warning' | 'info'
- **duration** (number) - время отображения в миллисекундах (0 = не скрывать автоматически)

## Примеры из проекта

### Копирование в буфер обмена

```javascript
// useClipboard.js
import { useToast } from './useToast'

export function useClipboard() {
    const { success, error } = useToast()
    
    const copyToClipboard = async (text, successMessage) => {
        try {
            await navigator.clipboard.writeText(text)
            success(successMessage)
        } catch (err) {
            error('Ошибка копирования')
        }
    }

    return { copyToClipboard }
}
```

### Обработка API запросов

```javascript
// stores/index.js
const updateEmailSettings = async (tg_id, emailValue) => {
    try {
        await updateEmail(tg_id, emailValue)
        email.value = emailValue
        success('Email успешно обновлен')
        return true
    } catch (err) {
        error('Ошибка при обновлении email')
        console.error('Failed to update email:', err)
        return false
    }
}
```

### Валидация

```javascript
// Servers.vue
const toggleEditMode = async () => {
    if (isEditMode.value) {
        const currentSelectedCount = usersStore.getSelectedServersCount()
        
        if (currentSelectedCount < 1) {
            showError('Должен быть выбран хотя бы 1 сервер')
            return
        }
        
        const success = await usersStore.saveSelectedServers(userId.value)
        if (success) {
            isEditMode.value = false
        }
    } else {
        isEditMode.value = true
    }
}
```

## Особенности

1. **Автоматическое скрытие**: Уведомления автоматически исчезают через заданное время
2. **Ручное закрытие**: Пользователь может закрыть уведомление кликом на крестик
3. **Анимация**: Плавное появление справа и исчезновение вверх
4. **Стек уведомлений**: Несколько уведомлений отображаются друг под другом
5. **Адаптивность**: Корректно отображается на всех размерах экрана

## Стилизация

Toast использует gradient фоны для каждого типа:
- Success: зеленый градиент
- Error: красный градиент
- Warning: оранжевый градиент
- Info: синий градиент

Все стили можно изменить в `src/App.vue` в секции `.toast-*` классов.

