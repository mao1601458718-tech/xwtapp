import request from '@/utils/request'
import upload from '@/utils/upload'
import storage from '@/utils/storage'
import constant from '@/utils/constant'


// 查询建筑楼层
export function findBuildingFloor(data) {

	return request({
		'url': '/project/building/findByBuildIngFloorList/' + storage.get(constant.projectId),
		"baseUrlType": "maintenance",
		'method': 'post',
		'data': data
	})
}

// 查询建筑
export function findBybuilding(data) {

	return request({
		'url': '/project/building/findByProjectList/' + storage.get(constant.projectId),
		"baseUrlType": "maintenance",
		'method': 'post',
		'data': data
	})
}

//添加建筑物
export function addBuilding(data) {

	return request({
		'url': '/project/building/addBuilding/' + storage.get(constant.projectId),
		"baseUrlType": "maintenance",
		'method': 'post',
		'data': data,
		"loading": true,
	})
}


//修改建筑物
export function updateBuilding(data) {

	return request({
		'url': '/project/building/updateBuilding/' + storage.get(constant.projectId),
		"baseUrlType": "maintenance",
		'method': 'post',
		'data': data,
		"loading": true,
	})
}

//
//删除建筑
export function deleteBuilding(data) {

	return request({
		'url': '/project/building/deleteBuilding/' + storage.get(constant.projectId),
		"baseUrlType": "maintenance",
		'method': 'post',
		'data': data,
		"loading": true,
	})
}