import request from '@/utils/request'
import storage from '@/utils/storage'
import constant from '@/utils/constant'


// 登录方法
export function login(data) {

	return request({
		'url': '/login',
		"baseUrlType": "sys",
		headers: {
			isToken: false
		},
		"loading": true,
		'method': 'post',
		'data': data
	})
}

// 获取用户信息
export function getInfo(data) {

	return request({
		'url': '/getInfo',
		"baseUrlType": "sys",
		'method': 'post',
		'data': data
	})
}


// 退出方法
export function logout() {

	let data = {
		loginName: storage.get(constant.name)
	}

	return request({
		'url': '/userLogout',
		"baseUrlType": "sys",
		'method': 'post',
		'data': data
	})
}
// 修改密码
export function modifyUserPassword(data) {
	return request({
		'url': '/user/modifyUserPassword',
		"baseUrlType": "sys",
		'method': 'post',
		'data': data
	})
}