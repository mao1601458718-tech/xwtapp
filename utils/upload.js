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

let timeout = 10000
const baseUrl = {
	"sys": config.baseUrlSys,
	"danger": config.baseUrlDanger,
	"safety": config.baseUrlSafety,
	"maintenance": config.baseUrlMaintenance,
	"project": config.baseUrlProject,
}

const upload = config => {

	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: config.baseUrl || baseUrl[config.baseUrlType] + config.url + '?access_token=' +
				getToken(),
			filePath: config.filePath,
			header: config.header,
			name: 'file',
			formData: config.formData,
			success: (response) => {
				response = JSON.parse(response.data)
				const code = response.status || 200
				const msg = response.msg
				if (code == 401 || code == 606) {
					showConfirm('登录状态已过期，您可以继续留在该页面，或者重新登录?').then(res => {
						if (res.confirm) {
							store.dispatch('LogOut').then(res => {
								uni.reLaunch({
									url: '/pages/login'
								})
							})
						}
					})
					reject('无效的会话，或者会话已过期，请重新登录。')
				} else if (code == 500) {
					toast(msg)
					reject('500')
				} else if (code != 200) {
					toast(msg)
					reject(code)
				}
				resolve(response.object)
			},
			fail: (error) => {
				let message = "提示：服务器繁忙，请稍后重试"
				toast(message)
				reject(null)
			}
		})
	})
}

export default upload