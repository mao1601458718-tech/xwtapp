import config from '@/config'
import storage from '@/utils/storage'
import constant from '@/utils/constant'
import {
	isHttp,
	isEmpty
} from "@/utils/validate"
import {
	login,
	logout,
	getInfo,
	wxLogin
} from '@/api/login'
import {
	getToken,
	setToken,
	removeToken
} from '@/utils/auth'
import defAva from '@/static/images/profile.jpg'

const baseUrl = config.baseUrl

const user = {
	state: {
		token: getToken(),
		statusBarHeight: 0,
		windowHeight: 0,
		id: storage.get(constant.id),
		name: storage.get(constant.name),
		avatar: storage.get(constant.avatar),
		roles: storage.get(constant.roles),
		nickName: storage.get(constant.nickName),
		permissions: storage.get(constant.permissions),
		projectId: storage.get(constant.projectId),
		projectName: storage.get(constant.projectName),
		atType: "maintenance",
		checkProject: "",
		maintenanceCheckType: {
			2: "巡检",
			3: "测试",
			4: "保养",
		},
		workOrderStatus: {
			1: "待指派",
			2: "维修中",
			3: "审核中",
			4: "已完成",
			5: "不予处理",
			6: "暂停维修",
		},
		planType: {
			1: "月",
			2: "季",
			3: "半年",
			4: "年",
		},
		safetyBuildingTypes: [{
				label: '厂房（甲、乙类）',
				value: 1
			},
			{
				label: '其它厂房',
				value: 2
			},
			{
				label: '仓库',
				value: 3
			},
			{
				label: '民用建筑',
				value: 4
			}
		],
		buildingTypes: [{
				name: '一类高层民用建筑',
				value: 1
			},
			{
				name: '二类高层民用建筑',
				value: 2
			},
			{
				name: '高层厂房',
				value: 3
			},
			{
				name: '高层库房',
				value: 4
			},
			{
				name: '单、多层民用建筑',
				value: 5
			},
			{
				name: '单、多层厂房',
				value: 6
			},
			{
				name: '单、多层库房',
				value: 7
			},
			{
				name: '地下建筑',
				value: 8
			},
			{
				name: '隧道、涵洞',
				value: 9
			},
			{
				name: '其他建筑',
				value: 10
			}
		],
		functionList: [{
				"backgroundColor": "#F1FFFC",
				"title": "签到",
				"explain": "现场签到",
				"type": ["project", "safety", "maintenance"],
				"page": "/pages/work/signNvue",
				"signType": false,
				"icon": "/static/images/function/sign.png"
			}, {
				"backgroundColor": "#FFF9FE",
				"title": "设施检测",
				"explain": "设施检测",
				"type": ["project"],
				"signType": true,
				"page": "/pages/check/facilityCheck/checkIndex",
				"icon": "/static/images/function/jianzhu.png"
			}, {
				"backgroundColor": "#FFF9FE",
				"title": "防火检测",
				"explain": "防火检测",
				"type": ["project"],
				"signType": true,
				"page": "/pages/check/fhCheck/checkIndex",
				"icon": "/static/images/function/homebar5.png"
			}, {
				"backgroundColor": "#FFF9F5",
				"title": "离线操作",
				"explain": "设施检测",
				"type": ["project"],
				"page": "/pages/check/offLine/offLineIndex",
				"icon": "/static/images/function/lixian.png"
			}, {
				"backgroundColor": "#FFF9F5",
				"title": "离线操作",
				"explain": "防火检测",
				"type": ["project"],
				"page": "/pages/check/offLine/fhOffLineIndex",
				"icon": "/static/images/function/lixian.png"
			}, {
				"backgroundColor": "#FFFCF3",
				"title": "巡查测试",
				"explain": "巡查测试",
				"type": ["maintenance"],
				"signType": false,
				"page": "/pages/management/check/patrol",
				"icon": "/static/images/function/xunjian.png"
			}, {
				"backgroundColor": "#F3FAFF",
				"title": "维保任务",
				"explain": "维保任务",
				"type": ["maintenance"],
				"signType": false,
				"page": "/pages/management/plan/planList",
				"icon": "/static/images/function/weibao.png"
			}, {
				"backgroundColor": "#FFF5F3",
				"title": "故障报修",
				"explain": "故障报修",
				"type": ["maintenance"],
				"signType": true,
				"page": "/pages/management/planFault/faultIndex",
				"icon": "/static/images/function/guzhang.png"
			}, {
				"backgroundColor": "#F8F8FF",
				"title": "设备管理",
				"explain": "设备管理",
				"type": ["maintenance"],
				"signType": false,
				"page": "/pages/management/facility/facilityIndex",
				"icon": "/static/images/function/shebei.png"
			},
			{
				"backgroundColor": "#F3FAFF",
				"title": "项目信息",
				"explain": "项目信息",
				"type": ["safety"],
				"signType": false,
				"page": "/pages/safety/project/projectIndex",
				"icon": "/static/images/function/xiangmu.png"
			},
			{
				"backgroundColor": "#F8F8FF",
				"title": "问题列表",
				"explain": "问题列表",
				"type": ["safety"],
				"signType": true,
				"page": "/pages/safety/problem/problemIndex",
				"icon": "/static/images/function/wenti.png"
			},
			{
				"backgroundColor": "#FFFCF3",
				"title": "建筑防火",
				"explain": "评建筑防火",
				"type": ["safety"],
				"signType": true,
				"page": "/pages/safety/check/checkIndex?type=1",
				"icon": "/static/images/function/jianzhupg.png"
			}, {
				"backgroundColor": "#FFF9FE",
				"title": "设施器材",
				"explain": "评设施器材",
				"type": ["safety"],
				"signType": true,
				"page": "/pages/safety/check/checkIndex?type=2",
				"icon": "/static/images/function/qicai.png"
			}, {
				"backgroundColor": "#F3FAFF",
				"title": "安全管理",
				"explain": "评安全管理",
				"type": ["safety"],
				"signType": true,
				"page": "/pages/safety/check/checkIndex?type=3",
				"icon": "/static/images/function/anqua.png"
			},
			{
				"backgroundColor": "#FFF9F5",
				"title": "离线计划",
				"explain": "离线计划",
				"type": ["maintenance"],
				"page": "/pages/management/offLine/offLineIndex",
				"icon": "/static/images/function/lixian.png"
			},

			{
				"backgroundColor": "#F3FAFF",
				"title": "检测标准",
				"explain": "检测标准",
				"type": ["project"],
				"signType": false,
				"page": "/pages/check/facilityCheck/checkStandard",
				"icon": "/static/images/function/biaozhun.png"
			}, {
				"backgroundColor": "#F8F8FF",
				"title": "操作记录",
				"explain": "操作记录",
				"type": ["project"],
				"page": "/pages/check/log/log",
				"signType": false,
				"icon": "/static/images/function/caozuojilu.png"
			}, {
				"backgroundColor": "#FFF9FE",
				"title": "建筑信息",
				"explain": "建筑信息",
				"signType": false,
				"type": ["maintenance"],
				"page": "/pages/management/buildings/buildingsList",
				"icon": "/static/images/function/jianzhu.png"
			},
			{
				"backgroundColor": "#FFF9FE",
				"title": "建筑信息",
				"explain": "建筑信息",
				"signType": false,
				"type": ["project"],
				"page": "/pages/check/buildings/buildingsList",
				"icon": "/static/images/function/jianzhu.png"
			}, {
				"backgroundColor": "#FFF9FE",
				"title": "建筑信息",
				"explain": "建筑信息",
				"signType": false,
				"type": ["safety"],
				"page": "/pages/safety/buildings/buildingsList",
				"icon": "/static/images/function/jianzhu.png"
			},
			// {
			// 	"backgroundColor": "#F3F8FF",
			// 	"title": "项目会议",
			// 	"explain": "项目会议",
			// 	"icon": "/static/images/function/huiyi.png"
			// },

			{
				"backgroundColor": "#F3FAFF",
				"title": "新建排查",
				"explain": "新建排查",
				"type": ["danger"],
				"icon": "/static/images/function/weibao.png",
				"page": "/pages/danger/addDanger"
			},
			{
				"backgroundColor": "#F8F8FF",
				"title": "待排查",
				"explain": "待排查",
				"type": ["danger"],
				"icon": "/static/images/function/shebei.png",
				"page": "/pages/danger/dangerList"
			},
			{
				"backgroundColor": "#FFFCF3",
				"title": "待复查",
				"explain": "待复查",
				"type": ["danger"],
				"icon": "/static/images/function/xunjian.png",
				"page": "/pages/danger/reviewList"
			}, {
				"backgroundColor": "#F3FAFF",
				"title": "已完成",
				"explain": "已完成",
				"type": ["danger"],
				"icon": "/static/images/function/weibao.png",
				"page": "/pages/danger/completeList"
			},
			{
				"backgroundColor": "#F2F7FF",
				"title": "查看报告",
				"type": ["maintenance"],
				"explain": "查看报告",
				"page": "/pages/management/plan/seeReport",
				"icon": "/static/images/function/baogao.png"
			},
			{
				"backgroundColor": "#F2F7FF",
				"title": "查看报告",
				"type": ["project", ],
				"explain": "查看报告",
				"page": "/pages/check/pdf/seeReport",
				"icon": "/static/images/function/baogao.png"
			},
			{
				"backgroundColor": "#F2F7FF",
				"title": "查看报告",
				"type": ["safety"],
				"explain": "查看报告",
				"page": "/pages/safety/pdf/seeReport",
				"icon": "/static/images/function/baogao.png"
			}
		],
	},

	mutations: {
		SET_TOKEN: (state, token) => {
			state.token = token
		},
		SET_TYPE: (state, atType) => {
			state.atType = atType
		},
		SET_HEIGTH: (state, height) => {
			state.statusBarHeight = height
		},
		SET_WINHEIGTH: (state, height) => {
			state.windowHeight = height
		},
		SET_CHECK_PROJECT: (state, checkProject) => {
			state.checkProject = checkProject
		},
		SET_ID: (state, id) => {
			state.id = id
			storage.set(constant.id, id)
		},
		SET_NAME: (state, name) => {
			state.name = name
			storage.set(constant.name, name)
		},
		SET_NIKE: (state, nickName) => {
			state.nickName = nickName
			storage.set(constant.nickName, nickName)
		},
		SET_AVATAR: (state, avatar) => {
			state.avatar = avatar
			storage.set(constant.avatar, avatar)
		},
		SET_ROLES: (state, roles) => {
			state.roles = roles
			storage.set(constant.roles, roles)
		},
		SET_PERMISSIONS: (state, permissions) => {
			state.permissions = permissions
			storage.set(constant.permissions, permissions)
		},
		SET_PROJECTID: (state, projectId) => {
			state.projectId = projectId
			storage.set(constant.projectId, projectId)
		},
		SET_PROJECTNAME: (state, projectName) => {
			state.projectName = projectName
			storage.set(constant.projectName, projectName)
		}
	},

	actions: {
		// 登录
		Login({
			commit
		}, userInfo) {
			// const username = userInfo.username.trim()
			// const password = userInfo.password
			// const code = userInfo.code
			// const uuid = userInfo.uuid
			return new Promise((resolve, reject) => {
				login(userInfo).then(res => {
					setToken(res.object.access_token)
					commit('SET_TOKEN', res.object.access_token)
					resolve(res)
				}).catch(error => {
					reject(error)
				})
			})
		},
		// 登录
		WxLogin({
			commit
		}, data) {
			return new Promise((resolve, reject) => {
				wxLogin(data).then(res => {
					setToken(res.token)
					commit('SET_TOKEN', res.token)
					resolve()
				}).catch(error => {
					reject(error)
				})
			})
		},
		// 获取用户信息
		GetInfo({
				commit
			},
			res) {
			return new Promise((resolve, reject) => {
				const user = res.object.user
				const project = res.object.project
				let avatar = ""
				if (!isHttp(avatar)) {
					avatar = (isEmpty(avatar)) ? defAva : baseUrl + avatar
				}
				const userid = (isEmpty(user) || isEmpty(user.id)) ? "" : user.id
				const username = (isEmpty(user) || isEmpty(user.loginName)) ? "" : user.loginName
				// if (res.roles && res.roles.length > 0) {
				// 	commit('SET_ROLES', res.roles)
				// 	commit('SET_PERMISSIONS', res.permissions)
				// } else {
				// 	commit('SET_ROLES', ['ROLE_DEFAULT'])
				// }
				commit('SET_ID', userid)
				commit('SET_NAME', username)
				commit('SET_AVATAR', avatar)
				commit('SET_NIKE', user.userName)
				commit('SET_PROJECTNAME', project.projectName)
				commit('SET_PROJECTID', project.id)
				resolve(res)
			})
		},
		//设置当前模块和项目
		SetAtType({
			commit,
			state
		}, type) {
			return new Promise((resolve, reject) => {
				commit('SET_TYPE', type)
			})
		},
		SetStatusBarHeight({
			commit,
			state
		}, height) {
			return new Promise((resolve, reject) => {
				commit('SET_HEIGTH', height)
			})
		},
		SetWindowHeight({
			commit,
			state
		}, height) {
			return new Promise((resolve, reject) => {
				commit('SET_WINHEIGTH', height)
			})
		},
		SetAtProject({
			commit,
			state
		}, project) {
			return new Promise((resolve, reject) => {
				commit('SET_CHECK_PROJECT', project)
			})
		},
		// 退出系统
		LogOut({
			commit,
			state
		}) {
			return new Promise((resolve, reject) => {
				logout(null).then(() => {
					commit('SET_TOKEN', '')
					commit('SET_ID', "")
					commit('SET_NAME', "")
					commit('SET_AVATAR', "")
					commit('SET_NIKE', "")
					commit('SET_PROJECTNAME', "")
					commit('SET_PROJECTID', "")
					removeToken()
					storage.clean()
					resolve()
				}).catch(error => {
					commit('SET_TOKEN', '')
					commit('SET_ID', "")
					commit('SET_NAME', "")
					commit('SET_AVATAR', "")
					commit('SET_NIKE', "")
					commit('SET_PROJECTNAME', "")
					commit('SET_PROJECTID', "")
					removeToken()
					storage.clean()
					uni.reLaunch({
						url: '/pages/login' // 登录页面的路径
					});
				})
			})
		}
	}
}

export default user