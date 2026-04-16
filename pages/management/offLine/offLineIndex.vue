<template>
	<view class="pageView" :style="'padding: '+statusBarHeight+'rpx 0 0 0 ;'">
		<view class="customTopView">
			<view class="customTop" :style="'height:'+statusBarHeight+'rpx'">
				<view class="customBottom">
					<view class="customTop1" @click="goBack"> <u-icon class="uIcon" name="arrow-left" color="#000000"
							size="23"></u-icon>
					</view>
					<view class="customTop2">离线维保</view>
					<view class="customTop3" @click="actionShow=true">更多</view>
				</view>
			</view>
		</view>
		<view class="tabView" v-if="storageSyncObj.planList" @click="goPlanPage()">
			<image class="tabView1" src="/static/images/function/weibao.png" />
			<view class="tabView2">离线维保任务</view>
			<view class="tabView3">点击进入</view>
		</view>

		<view class="tabView" v-if="storageSyncObj.planList" @click="goPlanCheck()">
			<image class="tabView1" src="/static/images/function/xunjian.png" />
			<view class="tabView2">离线巡查测试</view>
			<view class="tabView3">点击进入</view>
		</view>

		<!-- 	<view class="tabView" v-if="storageSyncObj.planList">
			<image class="tabView1" src="/static/images/function/guzhang.png" />
			<view class="tabView2">离线故障</view>
			<view class="tabView3">点击进入</view>
		</view> -->

		<view class="emtyView" v-if="!storageSyncObj.planList">
			<view class="testEmtyView">
				<image class="testEmty" src="/static/test-emty.png"></image>
			</view>
			<view class="testEmtyView">
				<view class="textEmtyView">暂无计划</view>
			</view>
			<view class="testEmtyView">
				<view class="textEmtyView">下载前请在有网络的情况下对要进行的计划签到</view>
			</view>
			<view class="testEmtyView">
				<view class="textEmtyView">下载前请在有网络的情况录入建筑信息</view>
			</view>
			<view class="testEmtyView">
				<view @click="getAll()" class="textEmtyView">点击<text class="textEmty">下载</text>
				</view>
			</view>
		</view>
		<u-action-sheet :actions="actionSheet" safeAreaInsetBottom :show="actionShow" @close="actionClose"
			@select="actionSelect"></u-action-sheet>
	</view>
</template>

<script>
	import {
		downloadPlanData,
		findCheckRecordListOffline,
		findByProjectBuildingListOffline,
		findBuildingFloorOffline,
		findDeviceTypeOfflineList,
		findParentDeviceTypeOfflineList,
		saveCheckRecordOffline
	} from '@/api/maintenance/maintenance'
	export default {
		data() {
			return {
				actionShow: false,
				actionSheet: [
					// 	{
					// 	name: '添加数据',
					// }, {
					// 	name: '删除数据',
					// }, 
					{
						name: '清除离线数据',
					}, {
						name: '上传离线巡查测试数据',
					}
				],
				statusBarHeight: this.$store.state.user.statusBarHeight,
				storageSyncObj: {
					planList: "",
					deviceType: "",
					parentDevice: "",
					buildingFloor: "",
					building: "",
					checkRecord: "",
				},
				dataForm: {
					"customerId": "",
					"projectId": "",
					"pageIndex": 1,
					"pageSize": 999,
					"effective": 1,
					"clientType": 1
				},
			}
		},
		onLoad() {
			this.dataForm.customerId = this.$store.state.user.checkProject.id;
			this.dataForm.projectId = this.$store.state.user.projectId;
			let getStorage = uni.getStorageSync('planOffLine_' + this.$store.state.user.checkProject.id);
			if (getStorage) {
				this.storageSyncObj = getStorage;
			}
		},
		methods: {
			async getAll() {
				uni.showLoading({});
				try {
					await Promise.all([
						this.getFindPlanManagementList(),
						this.getFindDeviceTypeOfflineList(),
						this.getFindParentDeviceTypeOfflineList(),
						this.getFindBuildingFloorOffline(),
						this.getFindByProjectListOffline(),
						this.getFindCheckRecordListOffline(),
					]);
					if (this.storageSyncObj.planList) {
						uni.setStorageSync('planOffLine_' + this.$store.state.user.checkProject.id, this
							.storageSyncObj);
					}
					uni.hideLoading()
				} catch (error) {
					uni.hideLoading()
					console.error("Error executing methods:", error);
				}
			},
			goPlanPage() {
				this.$tab.navigateTo("/pages/management/offLine/planList")
			},
			goPlanCheck() {
				this.$tab.navigateTo("/pages/management/offLine/check/patrol")
			},
			actionClose() {
				this.actionShow = false;
			},
			actionSelect(item) {
				if (item.name === "清除离线数据") {
					uni.showModal({
						title: '提示',
						content: '确定清除该项目本地离线记录？清除离线记录不影响线上计划',
						success: (res) => {
							if (res.confirm) {
								uni.setStorageSync('planOffLine_' + this.$store.state.user.checkProject.id,
									"");
								this.storageSyncObj = {
									planList: "",
									deviceType: "",
									parentDevice: "",
									buildingFloor: "",
									building: "",
									checkRecord: "",
								};
							}
						}
					});
				} else if (item.name === "上传离线巡查测试数据") {
					uni.showModal({
						title: '提示',
						content: '确定上传离线巡查测试数据?',
						success: async (res) => {
							if (res.confirm) {
								let getStorage = uni.getStorageSync('planOffLine_' + this.$store.state.user
									.checkProject.id);
								if (getStorage && getStorage.checkRecord) {

									let res = await saveCheckRecordOffline(getStorage.checkRecord)
									if (res.status == 200) {
										uni.$u.toast('离线巡查数据上传成功')
										let getData = {
											"checkProjectId": this.$store.state.user.checkProject.id,
											"projectId": this.$store.state.user.projectId,
											"deviceType": 3,
											"pageIndex": 1,
											"pageSize": 0,
											"maintenanceOrCheck": 2,
											"orderCols": ["createTime"],
											"orderDesc": true
										}
										let res = await findCheckRecordListOffline(getData)
										if (res.status == 200) {
											getStorage.checkRecord = res.listObj
											uni.setStorageSync('planOffLine_' + this.$store.state.user
												.checkProject.id, getStorage);
										}
									}

								}

							}
						}
					});

				}
			},
			//离线巡查测试
			async getFindCheckRecordListOffline() {
				let getData = {
					"checkProjectId": this.$store.state.user.checkProject.id,
					"projectId": this.$store.state.user.projectId,
					"deviceType": 3,
					"pageIndex": 1,
					"pageSize": 0,
					"maintenanceOrCheck": 2,
					"orderCols": ["createTime"],
					"orderDesc": true
				}
				let res = await findCheckRecordListOffline(getData)
				if (res.status == 200) {
					this.storageSyncObj.checkRecord = res.listObj
				}

			},
			//离线建筑
			async getFindByProjectListOffline() {
				let getData = {
					"checkProjectId": this.$store.state.user.checkProject.id,
					"projectId": this.$store.state.user.projectId,
					"pageSize": 0,
					"pageIndex": 1,
				}

				let res = await findByProjectBuildingListOffline(getData)
				if (res.status == 200) {
					this.storageSyncObj.building = res.object.list
				}
			},
			//查询维保建筑楼层
			async getFindBuildingFloorOffline() {
				let getData = {
					"checkProjectId": this.$store.state.user.checkProject.id,
					"projectId": this.$store.state.user.projectId,
				}

				let res = await findBuildingFloorOffline(getData)
				if (res.status == 200) {
					this.storageSyncObj.buildingFloor = res.listObj
				}
			},
			//查询寻擦测试系统
			async getFindParentDeviceTypeOfflineList() {
				let getData = {
					"checkProjectId": this.$store.state.user.checkProject.id,
					"projectId": this.$store.state.user.projectId,
				}
				let res = await findParentDeviceTypeOfflineList(getData)
				if (res.status == 200) {
					this.storageSyncObj.parentDevice = res.listObj
				}
			},
			async getFindDeviceTypeOfflineList() {
				let getData = {
					"projectId": this.$store.state.user.projectId,
				}
				let res = await findDeviceTypeOfflineList(getData)
				if (res.status == 200) {
					this.storageSyncObj.deviceType = res.listObj
				}
			},

			//离线维保任务
			async getFindPlanManagementList() {
				let res = await downloadPlanData(this.dataForm);
				if (res.status == 200) {
					if (res.object.planManagementList.length == 0) {
						this.$modal.showToast('暂无需要执业计划')
						return;
					}
					res.object.planDeviceTypeReportList.forEach((type) => {
						type["planCheckItemReportList"] = [];
						res.object.planCheckItemReportList.forEach((item) => {
							if (type.id == item.id && item.deviceTypeId == type.deviceTypeId) {

								item["planId"] = item.id
								item["id"] = item.checkRecordId

								type.planCheckItemReportList.push(item);
							}
						})
					})
					res.object.planDeviceSysReportList.forEach((sys) => {
						sys["planDeviceTypeReportList"] = [];
						res.object.planDeviceTypeReportList.forEach((type) => {
							if (type.id == sys.id && sys.deviceSysId == type.deviceSysId) {
								sys.planDeviceTypeReportList.push(type);
							}
						})
					})

					res.object.planManagementList.forEach((plan) => {
						plan["planDeviceSysReportList"] = [];
						res.object.planDeviceSysReportList.forEach((sys) => {
							if (sys.id == plan.id) {
								plan.planDeviceSysReportList.push(sys);
							}
						})
					})
					this.storageSyncObj.planList = res.object.planManagementList
					// this.planList = res.object.planManagementList;
				}
			},
			goBack() {
				uni.navigateBack();
			},
		}
	}
</script>

<style scoped lang="scss">
	.pageView {
		width: 100%;
		height: auto;

		.tabView {
			width: calc(100% - 60rpx);
			margin-left: 30rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx;
			background-color: #fff;
			margin-top: 20rpx;
			border-radius: 8rpx;

			.tabView1 {
				width: 70rpx;
				height: 65rpx;
			}

			.tabView2 {
				width: calc(100% - 260rpx);
				height: 40rpx;
			}

			.tabView3 {
				width: 140rpx;
				height: 50rpx;
				font-size: 22rpx;
				text-align: center;
				line-height: 50rpx;
				color: #5590f5;
				background-color: #eef4fe;
			}
		}
	}
</style>