const API_URL = 'https://bot.adronvpn.ru'

export const getServers = async (tg_id) => {
	try {
		const response = await fetch(`${API_URL}/user/servers/${tg_id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const data = await response.json()

		return data
	} catch (e) {
		console.error('getUserCount error:', e)
		throw e
	}
}

export const updateUserMainServer = async (tg_id, main_servers) => {
	try {
		const response = await fetch(`${API_URL}/user/keys`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				tgID: tg_id,
				main_servers: main_servers
			})
		})

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		// Сервер возвращает текст, а не JSON
		const text = await response.text()
		return { success: true, message: text }
	} catch (e) {
		console.error('updateUserMainServer error:', e)
		throw e
	}
}