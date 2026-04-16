import store from '@/store'
import config from '@/config'
import {
	getToken
} from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import {
	toast,
	showConfirm,
	tansParams
} from '@/utils/common'

let timeout = 30000
const baseUrl = {
	"sys": config.baseUrlSys,
	"danger": config.baseUrlDanger,
	"safety": config.baseUrlSafety,
	"maintenance": config.baseUrlMaintenance,
	"project": config.baseUrlProject,
}

var showModal = false;

const request = config => {
	// 是否需要设置 token
	const isToken = (config.headers || {}).isToken === false
	config.header = config.header || {}
	if (getToken() && !isToken) {
		config.header['Authorization'] = 'Bearer ' + getToken()
	}
	config.header['Accept'] = 'application/json'
	config.header['Content-Type'] = 'application/x-www-form-urlencoded'
	config.header['X-Requested-With'] = 'XMLHttpRequest'

	// get请求映射params参数
	if (config.params) {
		let url = config.url + '?' + tansParams(config.params)
		url = url.slice(0, -1)
		config.url = url
	}

	config.url = config.url + "?access_token=" + getToken();
	let json = {
		json: JSON.stringify(config.data)
	}
	if (config.loading) {
		uni.showLoading({});
	}
	return new Promise((resolve, reject) => {
		uni.request({
				method: config.method || 'get',
				timeout: config.timeout || timeout,
				url: config.baseUrl || baseUrl[config.baseUrlType] + config.url,
				data: json,
				header: config.header,
				dataType: 'json'
			}).then(response => {
				let [error, res] = response
				if (error) {
					toast('后端接口连接异常')
					reject('后端接口连接异常')
					return
				}
				const code = res.data.status || 200

				const msg = errorCode[code] || res.data.msg || errorCode['default']
				if (code == 401 || code == 606) {
					if (!showModal) {
						showConfirm('登录状态已过期，您可以继续留在该页面，或者重新登录?').then(res => {
							if (res.confirm) {
								store.dispatch('LogOut').then(res => {
									uni.reLaunch({
										url: '/pages/login'
									})
								})
							}
						})
						showModal = true;
					}

					reject('无效的会话，或者会话已过期，请重新登录。')
				} else if (code == 500) {
					showModal = false;
					toast(msg)
					reject('500')
				} else if (code == 220) {
					showModal = false;
					// toast(msg)
					resolve(res.data)
				} else if (code != 200) {
					showModal = false;
					toast(msg)
					reject(code)
				}
				resolve(res.data)
			})
			.catch(error => {
				showModal = false;
				let {
					message
				} = error
				if (message === 'Network Error') {
					message = '后端接口连接异常'
				} else if (message.includes('timeout')) {
					message = '系统接口请求超时'
				} else if (message.includes('Request failed with status code')) {
					message = '系统接口' + message.substr(message.length - 3) + '异常'
				}
				toast(message)
				reject(error)
			}).finally(() => {
				// 统一关闭loading
				uni.hideLoading()
			});
	})
}

export default request