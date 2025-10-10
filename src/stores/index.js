import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getServers, updateUserMainServer as apiUpdateUserMainServer } from '../api/index.js'

export const useUsersStore = defineStore('users', () => {
	const servers = ref(null)
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

	return {
		servers,
		isLoading,
		fetchServers,
		toggleServerSelection,
		getSelectedServersCount,
		getSelectedServerIds,
		saveSelectedServers
	}
})
