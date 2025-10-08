import { ref, computed, onMounted } from 'vue'

export function usePlatform() {
    const currentPlatform = ref('')

    const detectPlatform = () => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera
        
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            currentPlatform.value = 'ios'
        }
        else if (/android/i.test(userAgent)) {
            currentPlatform.value = 'android'
        }
        else if (/Macintosh|Mac OS X/.test(userAgent)) {
            currentPlatform.value = 'macos'
        }
    }

    const isIOS = computed(() => currentPlatform.value === 'ios')
    const isAndroid = computed(() => currentPlatform.value === 'android')
    const isMacOS = computed(() => currentPlatform.value === 'macos')
    const isApplePlatform = computed(() => isIOS.value || isMacOS.value)

    const openAppStore = () => {
        if (isApplePlatform.value) {
            window.open('https://apps.apple.com/ru/app/v2raytun/id6476628951', '_blank')
        } else if (isAndroid.value) {
            window.open('https://play.google.com/store/apps/details?id=com.v2raytun.android', '_blank')
        } else {
            const choice = confirm('Выберите магазин приложений:\nOK - App Store (iOS/macOS)\nCancel - Google Play (Android)')
            if (choice) {
                window.open('https://apps.apple.com/ru/app/v2raytun/id6476628951', '_blank')
            } else {
                window.open('https://play.google.com/store/apps/details?id=com.v2raytun.android', '_blank')
            }
        }
    }

    return {
        currentPlatform,
        detectPlatform,
        isIOS,
        isAndroid,
        isMacOS,
        isApplePlatform,
        openAppStore
    }
}

