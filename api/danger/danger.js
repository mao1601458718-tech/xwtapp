import request from '@/utils/request'
import storage from '@/utils/storage'
import constant from '@/utils/constant'

// 首页获取项目列表
export function findByMyCheckProjectDangerList(data) {

	return request({
		'url': '/project/checkProject/findByMyCheckProjectList/' + storage.get(constant.projectId),
		"baseUrlType": "danger",
		'method': 'post',
		'data': data
	})
}


export function findCheckStandardList(data) {

	return request({
		'url': '/device/type/findCheckStandardList',
		"baseUrlType": "danger",
		'method': 'post',
		'data': data
	})
}



export function findPlaceList(data) {

	return request({
		'url': '/place/findPlaceList',
		"baseUrlType": "danger",
		'method': 'post',
		'data': data
	})
}

export function savePlace(data) {

	return request({
		'url': '/place/savePlace',
		"baseUrlType": "danger",
		'method': 'post',
		'data': data,
		"loading": true,
	})
}

//查询排查详情
export function findCheckItemList(data) {

	return request({
		'url': '/check/item/findCheckItemList',
		"baseUrlType": "danger",
		'method': 'post',
		'data': data
	})
}

//保存排查条目
export function saveCheckRecord(data) {

	return request({
		'url': '/check/record/saveCheckRecord',
		"baseUrlType": "danger",
		'method': 'post',
		'data': data,
		"loading": true,
	})
}

//查询排查问题
export function findRiskProblemList(data) {
	return request({
		'url': '/risk/problem/findRiskProblemList',
		"baseUrlType": "danger",
		'method': 'post',
		'data': data
	})
}



//保存排查问题
export function saveRiskProblemList(data) {

	return request({
		'url': '/risk/problem/saveRiskProblemList',
		"baseUrlType": "danger",
		'method': 'post',
		'data': data,
		"loading": true,
	})
}
export function modifyRiskProblem(data) {

	return request({
		'url': '/risk/problem/modifyRiskProblem',
		"baseUrlType": "danger",
		'method': 'post',
		'data': data,
		"loading": true,
	})
}

//生成报告
export function saveDangerReport(data) {

	return request({
		'url': '/danger/report/saveDangerReport/' + storage.get(constant.projectId),
		"baseUrlType": "danger",
		'method': 'post',
		'data': data,
		"loading": true,
	})
}