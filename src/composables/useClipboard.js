export function useClipboard() {
    const copyToClipboard = async (text, successMessage = 'Скопировано в буфер обмена') => {
        try {
            await navigator.clipboard.writeText(text)
            alert(successMessage)
        } catch (err) {
            // Fallback для старых браузеров
            const textArea = document.createElement('textarea')
            textArea.value = text
            document.body.appendChild(textArea)
            textArea.select()
            document.execCommand('copy')
            document.body.removeChild(textArea)
            alert(successMessage)
        }
    }

    return {
        copyToClipboard
    }
}

