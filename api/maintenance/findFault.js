import request from '@/utils/request'
import upload from '@/utils/upload'
import storage from '@/utils/storage'
import constant from '@/utils/constant'

// 查询故障列表
export function findFaultRepairRecordList(data) {

	return request({
		'url': '/fault/findFaultRepairRecordList/' + storage.get(constant.projectId),
		"baseUrlType": "maintenance",
		'method': 'post',
		'data': data
	})
}


// 修改故障
export function updateFaultRepairRecord(data) {

	return request({
		'url': '/fault/updateFaultRepairRecord/' + storage.get(constant.projectId),
		"baseUrlType": "maintenance",
		'method': 'post',
		'data': data,
		"loading": true,
	})
}

// 添加故障
export function addFaultRepairRecord(data) {

	return request({
		'url': '/fault/addFaultRepairRecord/' + storage.get(constant.projectId),
		"baseUrlType": "maintenance",
		'method': 'post',
		'data': data,
		"loading": true,
	})
}

//查询故障日志
export function findRepairProgressList(data) {

	return request({
		'url': '/fault/findRepairProgressList/' + storage.get(constant.projectId),
		"baseUrlType": "maintenance",
		'method': 'post',
		'data': data
	})
}