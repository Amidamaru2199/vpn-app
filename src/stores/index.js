import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getServers, updateUserMainServer, updateAutoPayments, updateEmail, getUser, getAllTariffs, paymentsCreate, createCryptoInvoice } from '../api/index.js'
import { useToast } from '../composables/useToast'

export const useUsersStore = defineStore('users', () => {
	const { success, error, modal } = useToast()

	const servers = ref([])
	const allTariffs = ref([])
	const regularTariffs = computed(() => allTariffs.value.filter(t => !t.is_crypto))
	const cryptoTariffs = computed(() => allTariffs.value.filter(t => t.is_crypto))
	const user = ref(null)
	const payments = ref(null)
	const email = ref('')
	const autoPayments = ref(false)
	const isLoading = ref(false)

	const fetchServers = async (tg_id) => {
		try {
			isLoading.value = true
			const data = await getServers(tg_id)
			servers.value = data.servers
		} catch (err) {
			error(`Ошибка при загрузке серверов: ${err}`)
			console.error('Failed to fetch servers:', err)
		}
		finally {
			isLoading.value = false
		}
	}

	const fetchAllTariffs = async (includeCrypto = false) => {
		try {
			isLoading.value = true
			const data = await getAllTariffs(includeCrypto)
			allTariffs.value = data.tariffs || []
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
			user.value = data.user

			if (data) {
				autoPayments.value = data.user.is_auto_payment || false
				email.value = data.user.email || ''
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
			modal('Список стран для подписки успешно отредактирован. Нажмите кнопку обновления подписки в клиенте (V2RayTun, Happ и т.д.), чтобы они в нём появились.')
			return true
		} catch (err) {
			error(`Ошибка при обновлении серверов: ${err}`)
			console.error('Failed to update servers:', err)
			return false
		}
	}

	// Создание крипто invoice
	const createCryptoPayment = async (tg_id, tariff_id, amount, tariff_name) => {
		try {
			const data = await createCryptoInvoice(tg_id, tariff_id, amount, tariff_name)
			return data
		} catch (err) {
			error(`Ошибка при создании крипто платежа: ${err}`)
			console.error('Failed to create crypto invoice:', err)
			return { success: false, error: err.message }
		}
	}

	return {
		servers,
		allTariffs,
		regularTariffs,
		cryptoTariffs,
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
		createCryptoPayment,
		updateEmailSettings,
		updateAutoPaymentsSettings,
		saveSelectedServers,
	}
})
