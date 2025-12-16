import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getServers, updateUserMainServer, updateAutoPayments, updateEmail, getUser, getAllTariffs, paymentsCreate } from '../api/index.js'
import { useToast } from '../composables/useToast'

export const useUsersStore = defineStore('users', () => {
	const { success, error, modal } = useToast()
	
	const servers = ref([])
	const maxServers = ref(0)
	const allTariffs = ref([])
	const user = ref(null)
	const payments = ref(null)
	const email = ref('')
	const autoPayments = ref(false)
	const isLoading = ref(false)

	const fetchServers = async (tg_id) => {
		try {
			isLoading.value = true
			const data = await getServers(tg_id)
			console.log('data', data);
			
			servers.value = data.servers
			maxServers.value = data.max_servers_count
			console.log(servers.value);
			
		} catch (err) {
			error(`Ошибка при загрузке серверов: ${err}`)
			console.error('Failed to fetch servers:', err)
		}
		finally {
			isLoading.value = false
		}
	}

	const fetchAllTariffs = async (tg_id) => {
		try {
			isLoading.value = true
			const data = await getAllTariffs(tg_id)
			allTariffs.value = data.tariffs
			console.log(allTariffs.value);
			
		} catch (err) {
			error(`Ошибка при загрузке тарифов: ${err}`)
			console.error('Failed to fetch tariffs:', err)
		} finally {
			isLoading.value = false
		}
	}

	const fetchUser = async (tg_id) => {
		try {
			isLoading.value = true
			const data = await getUser(tg_id)
			user.value = data

			if (data) {
				autoPayments.value = data.is_auto_pay || false
				email.value = data.email || ''
			}
		} catch (err) {
			error(`Ошибка при загрузке данных пользователя`)
			console.error('Failed to fetch user:', err)
		} finally {
			isLoading.value = false
		}
	}

	// ОБРАБОТЧИКИ
	const toggleServerSelection = (serverId, isSelected) => {
		if (!servers.value) return

		const server = servers.value.find(s => s.id === serverId)

		if (server) {
			server.is_main = isSelected
		}
	}

	const getSelectedServersCount = () => {
		if (!servers.value) return 0
		return servers.value.filter(s => s.is_main).length
	}

	const getSelectedServerIds = () => {
		if (!servers.value) return []
		return servers.value.filter(s => s.is_main).map(s => s.id)
	}

	// POST
	const createPayment = async (tg_id, tariff_id) => {
		try {
			const data = await paymentsCreate(tg_id, tariff_id)
			
			payments.value = data
			
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
			modal('Список стран для подписки успешно отредактирован. Нажмите кнопку обновления подписки в клиенте (V2RayTun, Hiddify и т.д.), чтобы они в нём появились.')
			return true
		} catch (err) {
			error(`Ошибка при обновлении серверов: ${err}`)
			console.error('Failed to update servers:', err)
			return false
		}
	}

	return {
		maxServers,
		servers,
		allTariffs,
		user,
		payments,
		email,
		autoPayments,
		isLoading,

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
