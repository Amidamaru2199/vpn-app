export function useDate() {
    const formatSubscriptionDate = (dateString) => {
        if (!dateString) return ''
        
        try {
            const date = new Date(dateString)
            
            // Получаем компоненты даты
            const day = String(date.getDate()).padStart(2, '0')
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const year = date.getFullYear()
            const hours = String(date.getHours()).padStart(2, '0')
            const minutes = String(date.getMinutes()).padStart(2, '0')
            
            // Форматируем: 21.04.2028 (23:23)
            return `${day}.${month}.${year} (${hours}:${minutes})`
        } catch (error) {
            console.error('Date formatting error:', error)
            return dateString
        }
    }
    
    return {
        formatSubscriptionDate
    }
}

