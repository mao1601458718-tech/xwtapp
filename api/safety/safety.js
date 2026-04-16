import request from '@/utils/request'
import storage from '@/utils/storage'
import constant from '@/utils/constant'

// 首页获取项目列表
export function findByMyCheckProjectSafetyList(data) {

	return request({
		'url': '/project/checkProject/findByMyCheckProjectUnfinishedList/' + storage.get(constant.projectId),
		"baseUrlType": "safety",
		'method': 'post',
		'data': data
	})
}


//添加评估建筑信息
export function addBuilding(data) {

	return request({
		'url': '/project/building/addBuilding/' + storage.get(constant.projectId),
		"baseUrlType": "safety",
		'method': 'post',
		'data': data,
		"loading": true,
	})
}

//查询评估建筑信息
export function findByProjectList(data) {

	return request({
		'url': '/project/building/findByProjectList/' + storage.get(constant.projectId),
		"baseUrlType": "safety",
		'method': 'post',
		'data': data
	})
}
export function deleteBuilding(data) {

	return request({
		'url': '/project/building/deleteBuilding/' + storage.get(constant.projectId),
		"baseUrlType": "safety",
		'method': 'post',
		'data': data,
		"loading": true,
	})
}


//添加评估建筑信息
export function updateBuilding(data) {

	return request({
		'url': '/project/building/updateBuilding/' + storage.get(constant.projectId),
		"baseUrlType": "safety",
		'method': 'post',
		'data': data,
		"loading": true,
	})
}

//查看报告
export function findCheckProjectReportList(data) {

	return request({
		'url': '/project/report/findCheckProjectReportList',
		"baseUrlType": "safety",
		'method': 'post',
		'data': data
	})
}



// 查询项目详情
export function findBySafetyCheckProject(data) {

	return request({
		'url': '/project/checkProject/findByCheckProject/' + storage.get(constant.projectId),
		"baseUrlType": "safety",
		'method': 'post',
		'data': data
	})
}
// 查询项目详情
export function findByMyCheckProjectList(data) {

	return request({
		'url': '/project/checkProject/findByMyCheckProjectList/' + storage.get(constant.projectId),
		"baseUrlType": "safety",
		'method': 'post',
		'data': data
	})
}
//查询评估成员
export function findAssessmentMemberList(data) {

	return request({
		'url': '/assessment/user/findAssessmentMemberList/' + storage.get(constant.projectId),
		"baseUrlType": "safety",
		'method': 'post',
		'data': data
	})
}
//查询项目设置大类

export function findDictItemListByParentCode(data) {

	return request({
		'url': '/dict/findDictItemListByParentCode/',
		"baseUrlType": "sys",
		'method': 'post',
		'data': data
	})
}
//查询项目设置大类子项
export function findParentDeviceTypeList(data) {

	return request({
		'url': '/device/type/findParentDeviceTypeList/',
		"baseUrlType": "safety",
		'method': 'post',
		'data': data
	})
}
//修改项目评估项设置
export function saveCheckProject(data) {
	return request({
		'url': '/project/checkProject/saveCheckProject/' + storage.get(constant.projectId),
		"baseUrlType": "safety",
		'method': 'post',
		'data': data,
		"loading": true,
	})
}



// 签到
export function safetySaveSignLog(data) {
	return request({
		'url': '/signLog/saveSignLog/' + storage.get(constant.projectId),
		"baseUrlType": "safety",
		'method': 'post',
		'data': data,
		"loading": true,
	})
}

//问题列表
export function findRiskProblemList(data) {
	return request({
		'url': '/risk/problem/findRiskProblemList',
		"baseUrlType": "safety",
		'method': 'post',
		'data': data
	})
}

//修改问题列表
export function modifyRiskProblem(data) {
	return request({
		'url': '/risk/problem/modifyRiskProblem',
		"baseUrlType": "safety",
		'method': 'post',
		'data': data,
		"loading": true,
	})
}

//添加问题列表
export function saveRiskProblemList(data) {
	return request({
		'url': '/risk/problem/saveRiskProblemList',
		"baseUrlType": "safety",
		'method': 'post',
		'data': data,
		"loading": true,
	})
}
export function saveRiskProblem(data) {
	return request({
		'url': '/risk/problem/saveRiskProblem',
		"baseUrlType": "safety",
		'method': 'post',
		'data': data,
		"loading": true,
	})
}


//查询评估条目
export function findCheckRecordDeviceSysCountReport(data) {
	return request({
		'url': '/check/record/findCheckRecordDeviceSysCountReport',
		"baseUrlType": "safety",
		'method': 'post',
		'data': data
	})
}

//查询评估子条目
export function findCheckRecordDeviceTypeCountReport(data) {
	return request({
		'url': '/check/record/findCheckRecordDeviceTypeCountReport',
		"baseUrlType": "safety",
		'method': 'post',
		'data': data
	})
}
//保存评估检查
export function saveCheckRecord(data) {
	return request({
		'url': '/check/record/saveCheckRecord',
		"baseUrlType": "safety",
		'method': 'post',
		'data': data,
		"loading": true,
	})
}

export function delRiskProblemItem(data) {
	return request({
		'url': '/risk/problem/delRiskProblemItemJson',
		"baseUrlType": "safety",
		'method': 'post',
		'data': data,
		"loading": true,
	})
}