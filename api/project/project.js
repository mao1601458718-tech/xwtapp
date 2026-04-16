import request from '@/utils/request'
import storage from '@/utils/storage'
import constant from '@/utils/constant'

// 首页获取项目列表
export function findByMyCheckProjectList(data) {

	return request({
		'url': '/project/checkProject/findByMyCheckProjectUnfinishedList/' + storage.get(constant.projectId),
		"baseUrlType": "project",
		'method': 'post',
		'data': data
	})
}

// 查询项目详情
export function findByProjectCheckProject(data) {

	return request({
		'url': '/project/checkProject/findByCheckProject/' + storage.get(constant.projectId),
		"baseUrlType": "project",
		'method': 'post',
		'data': data
	})
}

// 签到
export function projectSaveSignLog(data) {
	return request({
		'url': '/signLog/saveSignLog/' + storage.get(constant.projectId),
		"baseUrlType": "project",
		'method': 'post',
		'data': data,
		"loading": true,
	})
}

// 地图解析
export function reGeo(data) {
	return request({
		'url': '/map/reGeo',
		"baseUrlType": "project",
		'method': 'post',
		'data': data
	})
}

//查询建筑物列表
export function buildingList(data) {
	return request({
		'url': '/project/building/findByProjectList/' + storage.get(constant.projectId),
		"baseUrlType": "project",
		'method': 'post',
		'data': data
	})
}
//查询建筑楼层
export function projectFindBuildingFloor(data) {
	return request({
		'url': '/project/building/findByBuildIngFloorList/' + storage.get(constant.projectId),
		"baseUrlType": "project",
		'method': 'post',
		'data': data
	})
}

//添加建筑物列表
export function addBuilding(data) {
	return request({
		'url': '/project/building/addBuilding/' + storage.get(constant.projectId),
		"baseUrlType": "project",
		'method': 'post',
		'data': data,
		"loading": true,
	})
}

//修改建筑物列表
export function updateBuilding(data) {
	return request({
		'url': '/project/building/updateBuilding/' + storage.get(constant.projectId),
		"baseUrlType": "project",
		'method': 'post',
		'data': data,
		"loading": true,
	})
}
//删除建筑

export function deleteBuilding(data) {
	return request({
		'url': '/project/building/deleteBuilding/' + storage.get(constant.projectId),
		"baseUrlType": "project",
		'method': 'post',
		'data': data,
		"loading": true,
	})
}
//操作记录
export function findSignLogByProjectId(data) {
	return request({
		'url': '/signLog/findSignLogByProjectId/' + storage.get(constant.projectId),
		"baseUrlType": "project",
		'method': 'post',
		'data': data
	})
}
//查看报告
export function findByCheckProjectPdf(data) {
	return request({
		'url': '/project/checkProject/findByCheckProject/' + storage.get(constant.projectId),
		"baseUrlType": "project",
		'method': 'post',
		'data': data
	})
}
//检测标准
export function findCheckItemList(data) {
	return request({
		'url': '/check/item/findCheckItemList/',
		"baseUrlType": "project",
		'method': 'post',
		'data': data
	})
}

//检测列表大类
export function findParentDeviceTypeList(data) {
	return request({
		'url': '/device/type/findParentDeviceTypeList/',
		"baseUrlType": "project",
		'method': 'post',
		'data': data
	})
}

//防火检测大类
export function findDeviceTypeListFireproof(data) {
	return request({
		'url': '/device/type/findDeviceTypeListFireproof/',
		"baseUrlType": "project",
		'method': 'post',
		'data': data
	})
}


//检测点列表中类
export function findDeviceTypeList(data) {
	return request({
		'url': '/device/type/findDeviceTypeList/',
		"baseUrlType": "project",
		'method': 'post',
		'data': data
	})
}

//查询已检测的检测点列表

export function findCheckPointList(data) {
	return request({
		'url': '/check/record/findCheckPointList/',
		"baseUrlType": "project",
		'method': 'post',
		'data': data
	})
}
export function fireproofDeviceTypeListApp(data) {
	return request({
		'url': '/device/type/fireproofDeviceTypeListApp/',
		"baseUrlType": "project",
		'method': 'post',
		'data': data
	})
}


//查询 已检查检测项
export function findCheckRecordList(data) {
	return request({
		'url': '/check/record/findCheckRecordList/',
		"baseUrlType": "project",
		'method': 'post',
		'data': data
	})
}


//新增、修改检测点
export function saveCheckRecord(data) {
	return request({
		'url': '/check/record/saveCheckRecord/',
		"baseUrlType": "project",
		'method': 'post',
		'data': data,
		"loading": true,
	})
}

//删除检测点
export function modifyCheckPoint(data) {
	return request({
		'url': '/check/record/modifyCheckPoint/',
		"baseUrlType": "project",
		'method': 'post',
		'data': data,
		"loading": true,
	})
}


//查询通知
export function noticePage(data) {
	return request({
		'url': '/notice/noticePage',
		"baseUrlType": "project",
		'method': 'post',
		'data': data
	})
}

//全部已读
export function saveRead(data) {
	return request({
		'url': '/notice/saveRead',
		"baseUrlType": "project",
		'method': 'post',
		'data': data
	})
}


//获取广告
export function selectAdvertising(data) {
	return request({
		'url': '/advertising/selectAdvertising',
		"baseUrlType": "project",
		'method': 'post',
		'data': data
	})
}

//点击广告
export function addAdvertisingOpen(data) {
	return request({
		'url': '/advertising/addAdvertisingOpen',
		"baseUrlType": "project",
		'method': 'post',
		'data': data
	})
}


//获取离线检测系统数据
export function findParentDeviceTypeListOffline(data) {
	return request({
		'url': '/device/type/findParentDeviceTypeListOffline',
		"baseUrlType": "project",
		'method': 'post',
		'data': data
	})
}
//获取离线防火检测系统数据
export function findDeviceTypeListFireproofOffline(data) {
	return request({
		'url': '/device/type/findDeviceTypeListFireproofOffline',
		"baseUrlType": "project",
		'method': 'post',
		'data': data
	})
}



//获取离线检测系统已检测数据
export function findCheckPointListOffline(data) {
	return request({
		'url': '/check/record/findCheckPointListOffline',
		"baseUrlType": "project",
		'method': 'post',
		'data': data
	})
}


//获取所有系统数据
export function findDeviceTypeListOffline(data) {
	return request({
		'url': '/device/type/findDeviceTypeListOffline',
		"baseUrlType": "project",
		'method': 'post',
		'data': data
	})
}
//获取离线建筑
export function findByBuildingProjectListOffline(data) {
	return request({
		'url': '/project/building/findByProjectListOffline/' + storage.get(constant.projectId),
		"baseUrlType": "project",
		'method': 'post',
		'data': data
	})
}
//获取离线建筑楼层
export function findBuildingFloorOffline(data) {
	return request({
		'url': '/project/building/findBuildingFloorOffline/' + storage.get(constant.projectId),
		"baseUrlType": "project",
		'method': 'post',
		'data': data
	})
}
//获取离线检测系统数据
export function findCheckRecordListOffline(data) {
	return request({
		'url': '/check/record/findCheckRecordListOffline',
		"baseUrlType": "project",
		'method': 'post',
		'data': data
	})
}


//获取离线检测系统数据
export function findCheckRecordListAllOffline(data) {
	return request({
		'url': '/check/record/findCheckRecordListAllOffline',
		"baseUrlType": "project",
		'method': 'post',
		'data': data
	})
}

//上传离线检测数据
export function saveCheckRecordOffline(data) {
	return request({
		'url': '/check/record/saveCheckRecordOffline',
		"baseUrlType": "project",
		'method': 'post',
		'data': data,
		"loading": true,
	})
}


//获取经纬度
export function getGeo(data) {
	return request({
		'url': '/map/geo',
		"baseUrlType": "project",
		'method': 'post',
		'data': data
	})
}