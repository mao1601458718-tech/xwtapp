import request from '@/utils/request'
import upload from '@/utils/upload'
import storage from '@/utils/storage'
import constant from '@/utils/constant'

// 首页获取项目列表
export function findByMyCheckProjectUnfinishedList(data) {

	return request({
		'url': '/project/checkProject/findByMyCheckProjectUnfinishedList/' + storage.get(constant.projectId),
		"baseUrlType": "maintenance",
		'method': 'post',
		'data': data
	})
}

// 签到页面查询签到计划
export function findPlanManagementList(data) {

	return request({
		'url': '/plan/findPlanManagementList/' + storage.get(constant.projectId),
		"baseUrlType": "maintenance",
		'method': 'post',
		'data': data
	})
}

// 查询项目详情
export function findByCheckProject(data) {

	return request({
		'url': '/project/checkProject/findByCheckProject/' + storage.get(constant.projectId),
		"baseUrlType": "maintenance",
		'method': 'post',
		'data': data
	})
}

// 签到
export function maintenanceSaveSignLog(data) {
	return request({
		'url': '/signLog/saveSignLog/' + storage.get(constant.projectId),
		"baseUrlType": "maintenance",
		'method': 'post',
		'data': data,
		"loading": true,
	})
}


// 巡查测试计划列表
export function findCheckRecordList(data) {
	return request({
		'url': '/check/record/findCheckRecordList',
		"baseUrlType": "maintenance",
		'method': 'post',
		'data': data
	})
}

//查询维保系统列表
export function findParentDeviceTypeList(data) {
	return request({
		'url': '/device/type/findParentDeviceTypeList',
		"baseUrlType": "maintenance",
		'method': 'post',
		'data': data
	})
}

//查询维保设备列表
export function findDeviceTypeList(data) {
	return request({
		'url': '/device/type/findDeviceTypeList',
		"baseUrlType": "maintenance",
		'method': 'post',
		'data': data
	})
}
//删除寻擦测试
export function modifyCheckRecord(data) {
	return request({
		'url': '/check/record/modifyCheckRecord',
		"baseUrlType": "maintenance",
		'method': 'post',
		'data': data,
		"loading": true,
	})
}


//保存巡查测试
export function saveCheckRecord(data) {
	return request({
		'url': '/check/record/saveCheckRecord',
		"baseUrlType": "maintenance",
		'method': 'post',
		'data': data,
		"loading": true,
	})
}

//查询维保计划系统列表
export function findPlanDeviceSysReportList(data) {
	return request({
		'url': '/plan/findPlanDeviceSysReportList/' + storage.get(constant.projectId),
		"baseUrlType": "maintenance",
		'method': 'post',
		'data': data
	})
}
//修改维保任务
export function updatePlanManagement(data) {
	return request({
		'url': '/plan/updatePlanManagement/' + storage.get(constant.projectId),
		"baseUrlType": "maintenance",
		'method': 'post',
		'data': data,
		"loading": true,
	})
}

//引用上一个月计划
export function findLastMonthPlanAuto(data) {
	return request({
		'url': '/plan/findLastMonthPlanAuto/' + storage.get(constant.projectId),
		"baseUrlType": "maintenance",
		'method': 'post',
		'data': data
	})
}

// 查询维保设备列表
export function findCheckPointSysList(data) {
	return request({
		'url': '/check/record/findCheckPointSysList/' + storage.get(constant.projectId),
		"baseUrlType": "maintenance",
		'method': 'post',
		'data': data
	})
}

// 查询维保设备列表类目
export function findCheckPointList(data) {
	return request({
		'url': '/check/record/findCheckPointList/' + storage.get(constant.projectId),
		"baseUrlType": "maintenance",
		'method': 'post',
		'data': data
	})
}

// 查询维保设备项列表类目
export function findCheckItemNotPageList(data) {
	return request({
		'url': '/check/item/findCheckItemNotPageList/',
		"baseUrlType": "maintenance",
		'method': 'post',
		'data': data
	})
}

//查询维保设备 列表
export function findParentDeviceSystemList(data) {
	return request({
		'url': '/device/system/findParentDeviceTypeList',
		"baseUrlType": "maintenance",
		'method': 'post',
		'data': data
	})
}
//修改维保设备
export function modifyCheckPoint(data) {
	return request({
		'url': '/check/record/modifyCheckPoint/' + storage.get(constant.projectId),
		"baseUrlType": "maintenance",
		'method': 'post',
		'data': data,
		"loading": true,
	})
}

//保存维保设备
export function saveCheckPoint(data) {
	return request({
		'url': '/check/record/saveCheckPoint/' + storage.get(constant.projectId),
		"baseUrlType": "maintenance",
		'method': 'post',
		'data': data,
		"loading": true,
	})
}

//查看报告列表
export function findPlanManagementReportList(data) {
	return request({
		'url': '/plan/findPlanManagementReportList/' + storage.get(constant.projectId),
		"baseUrlType": "maintenance",
		'method': 'post',
		'data': data
	})
}

//故障转派人员列表
export function findOrgUserList(data) {
	return request({
		'url': '/project/orgUser/findOrgUserList/' + storage.get(constant.projectId),
		"baseUrlType": "maintenance",
		'method': 'post',
		'data': data
	})
}

//生成报告
export function saveMaintenanceReport(data) {
	return request({
		'url': '/maintenance/report/saveMaintenanceReport/' + storage.get(constant.projectId),
		"baseUrlType": "maintenance",
		'method': 'post',
		'data': data,
		"loading": true,
	})
}


//下载离线维保
export function downloadPlanData(data) {
	return request({
		'url': '/plan/downloadPlanData/' + storage.get(constant.projectId),
		"baseUrlType": "maintenance",
		'method': 'post',
		'data': data,
		"loading": false,
	})
}

//下载离线巡查测试
export function findCheckRecordListOffline(data) {
	return request({
		'url': '/check/record/findCheckRecordListOffline',
		"baseUrlType": "maintenance",
		'method': 'post',
		'data': data,
		"loading": false,
	})
}

//下载离线建筑
export function findByProjectBuildingListOffline(data) {
	return request({
		'url': '/project/building/findByProjectListOffline/' + storage.get(constant.projectId),
		"baseUrlType": "maintenance",
		'method': 'post',
		'data': data,
		"loading": false,
	})
}
//下载离线楼层
export function findBuildingFloorOffline(data) {
	return request({
		'url': '/project/building/findBuildingFloorOffline/' + storage.get(constant.projectId),
		"baseUrlType": "maintenance",
		'method': 'post',
		'data': data,
		"loading": false,
	})
}

//下载离线查询测试设备
export function findParentDeviceTypeOfflineList(data) {
	return request({
		'url': '/device/type/findParentDeviceTypeOfflineList',
		"baseUrlType": "maintenance",
		'method': 'post',
		'data': data,
		"loading": false,
	})
}
//下载离线查询测试系统
export function findDeviceTypeOfflineList(data) {
	return request({
		'url': '/device/type/findDeviceTypeOfflineList',
		"baseUrlType": "maintenance",
		'method': 'post',
		'data': data,
		"loading": false,
	})
}

//上传离线巡查测试

export function saveCheckRecordOffline(data) {
	return request({
		'url': '/check/record/saveCheckRecordOffline',
		"baseUrlType": "maintenance",
		'method': 'post',
		'data': data,
		"loading": true,
	})
}
//上传离线巡查测试

export function saveCheckRecordPlanOffline(data) {
	return request({
		'url': '/check/record/saveCheckRecordPlanOffline',
		"baseUrlType": "maintenance",
		'method': 'post',
		'data': data,
		"loading": true,
	})
}