import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getServers, updateUserMainServer, updateAutoPayments, updateEmail, getUser, getAllTariffs, paymentsCreate } from '../api/index.js'
import { useToast } from '../composables/useToast'

export const useUsersStore = defineStore('users', () => {
	const { success, error, info } = useToast()
	
	const servers = ref(null)
	const allTariffs = ref(null)
	const user = ref(null)
	const payments = ref(null)
	const email = ref('')
	const autoPayments = ref(false)

	// GET
	const fetchServers = async (tg_id) => {
		try {
			const data = await getServers(tg_id)
			servers.value = data.сервера
		} catch (err) {
			error(`Ошибка при загрузке серверов: ${err}`)
			console.error('Failed to fetch servers:', err)
		}
	}

	const fetchAllTariffs = async () => {
		try {
			const data = await getAllTariffs()
			allTariffs.value = data.тарифы
		} catch (err) {
			error(`Ошибка при загрузке тарифов: ${err}`)
			console.error('Failed to fetch tariffs:', err)
		}
	}

	const fetchUser = async (tg_id) => {
		try {
			const data = await getUser(tg_id)
			user.value = data.юзер

			if (data) {
				autoPayments.value = data.юзер.is_auto_payment || false
				email.value = data.юзер.email || ''
			}
		} catch (err) {
			error(`Ошибка при загрузке данных пользователя`)
			console.error('Failed to fetch user:', err)
		}
	}

	// ОБРАБОТЧИКИ
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

	// POST
	const createPayment = async (tg_id, tariff_id) => {
		try {
			const data = await paymentsCreate(tg_id, tariff_id)
			payments.value = data.payment_info
			return data
		} catch (err) {
			error(`Ошибка при создании платежа: ${err}`)
			console.error('Failed to create payment:', err)
			return { success: false, error: err.message }
		}
	}

	// PUT
	const updateEmailSettings = async (tg_id, emailValue) => {
		try {
			await updateEmail(tg_id, emailValue)
			email.value = emailValue
			success('Email успешно обновлен')
			return true
		} catch (err) {
			error(`Ошибка при обновлении email: ${err}`)
			console.error('Failed to update email:', err)
			return false
		}
	}

	const updateAutoPaymentsSettings = async (tg_id, value) => {
		try {
			await updateAutoPayments(tg_id, value)
			autoPayments.value = value
			success(`Автоплатежи ${value ? 'включены' : 'выключены'}`)
			return true
		} catch (err) {
			error(`Ошибка при обновлении настроек: ${err}`)
			console.error('Failed to update auto payments:', err)
			return false
		}
	}

	const saveSelectedServers = async (tg_id) => {
		try {
			const main_servers = getSelectedServerIds()
			await updateUserMainServer(tg_id, main_servers)
			success('Серверы успешно обновлены')
			return true
		} catch (err) {
			error(`Ошибка при обновлении серверов: ${err}`)
			console.error('Failed to update servers:', err)
			return false
		}
	}

	return {
		servers,
		allTariffs,
		user,
		payments,
		email,
		autoPayments,

		fetchServers,
		fetchAllTariffs,
		fetchUser,
		toggleServerSelection,
		getSelectedServersCount,
		getSelectedServerIds,
		createPayment,
		updateEmailSettings,
		updateAutoPaymentsSettings,
		saveSelectedServers,
	}
})
