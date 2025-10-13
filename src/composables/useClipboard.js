import { useToast } from './useToast'

export function useClipboard() {
    const { success, error } = useToast()
    
    const copyToClipboard = async (text, successMessage = 'Скопировано в буфер обмена') => {
        try {
            await navigator.clipboard.writeText(text)
            success(successMessage)
        } catch (err) {
            // Fallback для старых браузеров
            try {
                const textArea = document.createElement('textarea')
                textArea.value = text
                document.body.appendChild(textArea)
                textArea.select()
                document.execCommand('copy')
                document.body.removeChild(textArea)
                success(successMessage)
            } catch (fallbackErr) {
                error('Ошибка копирования')
            }
        }
    }

    return {
        copyToClipboard
    }
}

