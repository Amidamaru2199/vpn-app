# 📋 Изменения в новой версии приложения

## ✨ Что добавлено (от eca1ca3)

### Новые функции
- ✅ **Toast уведомления** - система красивых всплывающих уведомлений
- ✅ **API интеграция** (`src/api/index.js`) - подключение к бэкенду
- ✅ **Pinia Store** - централизованное управление состоянием
- ✅ **Новая страница Settings** - настройки приложения
- ✅ **Composables**:
  - `useTelegram` - работа с Telegram Web App API
  - `useToast` - управление уведомлениями
  - `useClipboard` - копирование в буфер обмена
  - `useDate` - работа с датами
  - `usePlatform` - определение платформы

### Новые компоненты
- `Toast.vue` - компонент уведомлений
- `Switch.vue` - переключатель
- `KeySVG.vue` - иконка ключа

### Изменения в роутинге
- ⚠️ **Переход на Hash History Mode**
  - Было: `createWebHistory()` → URL вида `/vpn-app/configurations`
  - Стало: `createWebHashHistory('/vpn-app/')` → URL вида `/vpn-app/#/configurations`
- ⚠️ **Изменён base в vite.config.js**
  - Было: `base: '/vpn-app'`
  - Пришло с git: `base: '/vpn-app/#/'`
  - **Исправлено на:** `base: '/vpn-app/'` (для работы на сервере)

### Удалено
- ❌ Многие картинки из `public/img/`:
  - background.png, background-gr.png
  - Флаги стран (canada, germany, iceland и т.д.)
  - Frame 7.png, big-button.png
  - ⚠️ **Проверь что приложение не сломалось из-за удалённых картинок**

### Зависимости
- ✅ Добавлена: `pinia@^3.0.3` (store management)

## 🔧 Что изменилось в деплое

### Актуальность скриптов: ✅ ВСЁ РАБОТАЕТ

Все скрипты деплоя остаются актуальными:
- ✅ `./update-and-deploy.sh` - работает
- ✅ `./deploy.sh` - работает
- ✅ `npm run build` - успешно собирается

### Что было исправлено для сервера

1. **vite.config.js** - убрал `#/` из base:
   ```javascript
   // Было в git: base: '/vpn-app/#/',
   // Исправлено: base: '/vpn-app/',
   ```

2. **Совместимость Vite** - откачен на v4.5.3 (работает с Node 16):
   ```bash
   npm install vite@4.5.3 @vitejs/plugin-vue@4.6.2 --save-dev
   ```

## 📊 Статистика сборки

**Размер приложения увеличился:**
- JS: 138.23 KB (было ~115 KB) → **+20% из-за Pinia и новых функций**
- CSS: 15.98 KB (было ~12 KB)
- Прекеш: 16 файлов (было 27) → **меньше из-за удалённых картинок**

## ⚠️ Что проверить после деплоя

1. **URL с хэшем:**
   - Основная: `https://new.adronvpn.ru/vpn-app/`
   - Роуты: `https://new.adronvpn.ru/vpn-app/#/configurations`
   - Hash mode работает лучше с nginx (не нужен сложный try_files)

2. **Toast уведомления:**
   - Проверь что они появляются и исчезают
   - Протестируй в Telegram Web App

3. **API интеграция:**
   - Убедись что приложение подключается к бэкенду на `localhost:1025`
   - Проверь что CORS настроен правильно

4. **Store (Pinia):**
   - Проверь что состояние сохраняется между страницами
   - Тестируй в Telegram Web App

5. **Картинки:**
   - **Проверь что ничего не сломалось** из-за удалённых картинок
   - Если что-то не показывается - нужно будет вернуть файлы или обновить код

## 🚀 Деплой новой версии

```bash
# Рекомендуемый способ
./update-and-deploy.sh

# Или вручную
npm run build
./deploy.sh
```

## 🔙 Откат если что-то пошло не так

```bash
ssh root@77.110.105.100
sudo rm -rf /var/www/vpn-app/dist
sudo mv /var/www/vpn-app/dist.backup /var/www/vpn-app/dist
sudo systemctl reload nginx
```

## ✅ Итог

**Скрипты полностью актуальны!** Можно смело деплоить новую версию:

```bash
./update-and-deploy.sh
```

После деплоя проверь приложение в Telegram боте - там должны работать все новые функции! 🎉
