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

export const getUser = async (tg_id) => {
	try {
		const response = await fetch(`${API_URL}/user/${tg_id}`, {
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
		console.error('getUser error:', e)
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

export const updateAutoPayments = async (tg_id, is_auto_payments) => {
	try {
		const response = await fetch(`${API_URL}/user/autopay`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				tgID: tg_id,
				is_auto_payments: is_auto_payments
			})
		})

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		// Сервер возвращает текст, а не JSON
		const text = await response.text()
		return { success: true, message: text }
	} catch (e) {
		console.error('updateAutoPayments error:', e)
		throw e
	}
}

export const updateEmail = async (tg_id, email) => {
	try {
		const response = await fetch(`${API_URL}/user/email`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				tgID: tg_id,
				email: email
			})
		})

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		// Сервер возвращает текст, а не JSON
		const text = await response.text()
		return { success: true, message: text }
	} catch (e) {
		console.error('updateEmail error:', e)
		throw e
	}
}
