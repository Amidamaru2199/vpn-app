import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getServers, updateUserMainServer as apiUpdateUserMainServer, updateAutoPayments as apiUpdateAutoPayments, updateEmail, getUser } from '../api/index.js'

export const useUsersStore = defineStore('users', () => {
	const servers = ref(null)
	const autoPayments = ref(false)
	const user = ref(null)
	const email = ref('')
	const isLoading = ref(false)

	const fetchServers = async (tg_id) => {
		isLoading.value = true

		try {
			const data = await getServers(tg_id)
			servers.value = data.сервера
		} catch (err) {
			console.error('Failed to fetch servers:', err)
		} finally {
			isLoading.value = false
		}
	}

	const fetchUser = async (tg_id) => {
		isLoading.value = true

		try {
			const data = await getUser(tg_id)
			user.value = data
			
			// Обновляем настройки из данных пользователя
			if (data) {
				autoPayments.value = data.is_auto_payments || false
				email.value = data.email || ''
			}
		} catch (err) {
			console.error('Failed to fetch user:', err)
		} finally {
			isLoading.value = false
		}
	}

	const toggleServerSelection = (serverId, isSelected) => {
		if (!servers.value?.servers) return

		const server = servers.value.servers.find(s => s.id === serverId)
		if (server) {
			server.is_main = isSelected
		}
	}

	const getSelectedServersCount = () => {
		if (!servers.value?.servers) return 0
		return servers.value.servers.filter(s => s.is_main).length
	}

	const getSelectedServerIds = () => {
		if (!servers.value?.servers) return []
		return servers.value.servers.filter(s => s.is_main).map(s => s.id)
	}

	const saveSelectedServers = async (tg_id) => {
		isLoading.value = true

		try {
			const main_servers = getSelectedServerIds()
			await apiUpdateUserMainServer(tg_id, main_servers)
			// Сервер возвращает только текст "обновление успешно"
			// Данные не обновляем, они остаются как есть
			return true
		} catch (err) {
			console.error('Failed to update servers:', err)
			return false
		} finally {
			isLoading.value = false
		}
	}

	const updateAutoPaymentsSettings = async (tg_id, value) => {
		isLoading.value = true

		try {
			await apiUpdateAutoPayments(tg_id, value)
			autoPayments.value = value
			return true
		} catch (err) {
			console.error('Failed to update auto payments:', err)
			return false
		} finally {
			isLoading.value = false
		}
	}

	const updateEmailSettings = async (tg_id, emailValue) => {
		isLoading.value = true

		try {
			await updateEmail(tg_id, emailValue)
			email.value = emailValue
			return true
		} catch (err) {
			console.error('Failed to update email:', err)
			return false
		} finally {
			isLoading.value = false
		}
	}

	return {
		servers,
		autoPayments,
		email,
		user,
		isLoading,
		fetchServers,
		fetchUser,
		toggleServerSelection,
		getSelectedServersCount,
		getSelectedServerIds,
		saveSelectedServers,
		updateAutoPaymentsSettings,
		updateEmailSettings,
	}
})
