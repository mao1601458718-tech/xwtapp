<template>
	<view class="pageView">

		<view class="topView">
			<view class="topTitleView">
				<image class="topTitle1" src="/static/images/check/check2.png"></image>
				<view class="topTitle2 topTitle3 u-line-1">单位名称：{{$store.state.user.checkProject.checkProjectName}}
				</view>
			</view>
			<view class="topTitleView">
				<image class="topTitle1" src="/static/images/check/check1.png"></image>
				<view class="topTitle2  u-line-1">地址：{{$store.state.user.checkProject.address}}</view>
			</view>
		</view>
		<scroll-view class="liListView" scroll-y v-if="storageSyncObj.deviceTypeList">
			<view class="litView" v-for="(item,index) in storageSyncObj.deviceTypeList" :key="index"
				@click="goPage(item)">
				<view class="liTitle">{{item.deviceSysName}}</view>
				<view class="liRight">
					<text class="liText">
						<text class="liText color">{{getCheckNum(item)}}</text>
						<text class="liText">/</text>
						<text class="liText">{{item.totalNum}}</text>
					</text>
					<u-icon name="arrow-right" size="16" color="#999999"></u-icon>
				</view>
			</view>
			<view class="scrollBottom"></view>
		</scroll-view>


		<view class="emtyView" v-if="!storageSyncObj.deviceTypeList">
			<view class="testEmtyView">
				<image class="testEmty" src="/static/test-emty.png"></image>
			</view>
			<view class="testEmtyView">
				<view class="textEmtyView">暂无项目</view>
			</view>
			<view class="testEmtyView">
				<view class="textEmtyView">下载前请在有网络的情况下对要进行的项目签到</view>
			</view>
			<view class="testEmtyView">
				<view class="textEmtyView">下载前请在有网络的情况录入建筑信息</view>
			</view>
			<view class="testEmtyView">
				<view @click="getAll()" class="textEmtyView">点击<text class="textEmty">下载</text>
				</view>
			</view>
		</view>
		<view class="bottomView">
			<view class="viewLeft" @click="actionSelect">清除本地数据</view>
			<view class="viewRight" @click="postOffline">上传离线数据</view>
		</view>
	</view>
</template>

<script>
	import {
		findParentDeviceTypeListOffline,
		findCheckPointListOffline,
		findDeviceTypeListOffline,
		findByBuildingProjectListOffline,
		findCheckRecordListOffline,
		findBuildingFloorOffline,
		findCheckRecordListAllOffline,
		saveCheckRecordOffline
	} from '@/api/project/project.js'

	export default {
		data() {
			return {
				storageSyncObj: {
					deviceTypeList: "",
					checkPointList: "",
					deviceTypeAllList: "",
					checkRecordList: "",
					projectBuildingList: "",
					projectBuildingFloorList: "",
					itemAll: ""
				}
			};
		},
		onShow() {
			let getStorage = uni.getStorageSync('projectOffLine_' + this.$store.state.user.checkProject.id);
			if (getStorage) {
				this.storageSyncObj = getStorage;
			}
		},
		methods: {
			async getAll() {
				uni.showLoading({});
				try {
					await Promise.all([
						this.getFindParentDeviceTypeListOffline(),
						this.getFindCheckPointListOffline(),
						this.getFindDeviceTypeListOffline(),
						this.getFindCheckRecordListOffline(),
						this.getFindByBuildingProjectListOffline(),
						this.getFindBuildingFloorOffline(),
						this.getFindCheckRecordListAllOffline()
					]);
					if (this.storageSyncObj.deviceTypeList) {
						uni.setStorageSync('projectOffLine_' + this.$store.state.user.checkProject.id, this
							.storageSyncObj);
					}
					uni.hideLoading()
				} catch (error) {
					uni.hideLoading()
					console.error("Error executing methods:", error);
				}
			},
			goPage(item) {
				this.$tab.navigateTo("/pages/check/offLine/facilityCheckIndex?item=" + JSON.stringify(item))
			},
			getCheckNum(data) {
				if (this.storageSyncObj.checkRecordList) {
					const count = new Set(this.storageSyncObj.checkRecordList.filter(item => item.deviceSysId === data
						.id).map(
						item => item.deviceCheckItemId)).size;
					return count;
				} else {
					return 0;
				}

			},
			actionSelect(item) {
				uni.showModal({
					title: '提示',
					content: '确定清除该项目本地离线记录？清除离线记录不影响线上计划',
					success: (res) => {
						if (res.confirm) {
							uni.setStorageSync('projectOffLine_' + this.$store.state.user.checkProject.id,
								"");
							this.storageSyncObj = {
								deviceTypeList: "",
								checkPointList: "",
								deviceTypeAllList: "",
								checkRecordList: "",
								projectBuildingList: "",
								projectBuildingFloorList: "",
								itemAll: ""
							};
						}
					}
				});
			},

			postOffline() {
				uni.showModal({
					title: '提示',
					content: '确定上传离线记录?,上传成功离线记录将被清除',
					success: (res) => {
						if (res.confirm) {
							this.postAuto();
						}
					}
				});
			},
			async postAuto() {
				let data = [];
				let getStorage = uni.getStorageSync('projectOffLine_' + this.$store.state.user.checkProject.id);

				if (getStorage && getStorage.checkPointList) {
					getStorage.checkPointList.forEach((item) => {
						item["list"] = [];
						getStorage.checkRecordList.forEach((recordItem) => {
							let checkPointId = recordItem.checkPointId ? recordItem.checkPointId :
								recordItem.tempcheckPointId;
							let itemId = item.id || item.tempId;
							if (itemId == checkPointId) {
								item.list.push(recordItem);
							}
						})
						data.push(item);
					})
				}
				let res = await saveCheckRecordOffline(data);
				if (res.status == 200) {
					uni.$u.toast('离线记录上传成功')
					uni.setStorageSync('projectOffLine_' + this.$store.state.user.checkProject.id,
						"");
					this.storageSyncObj = {
						deviceTypeList: "",
						checkPointList: "",
						deviceTypeAllList: "",
						checkRecordList: "",
						projectBuildingList: "",
						projectBuildingFloorList: "",
						itemAll: ""
					};
				}
			},

			//获取离线检测数据
			async getFindParentDeviceTypeListOffline() {
				let data = {
					"checkProjectId": this.$store.state.user.checkProject.id,
					"deviceSysIds": this.$store.state.user.checkProject.sysTypeIdList,
					"projectId": this.$store.state.user.projectId
				}
				let res = await findParentDeviceTypeListOffline(data);
				if (res.status == 200) {
					this.storageSyncObj.deviceTypeList = res.listObj;
				}

			},
			//获取离线已检检测项
			async getFindCheckPointListOffline() {
				let data = {
					"pageIndex": 1,
					"pageSize": 0,
					"checkProjectId": this.$store.state.user.checkProject.id,
					"orderCols": ["createTime"],
					"orderDesc": true
				}
				let res = await findCheckPointListOffline(data);
				if (res.status == 200) {
					this.storageSyncObj.checkPointList = res.listObj;
				}
			},
			//获取离线所有检测项
			async getFindDeviceTypeListOffline() {
				let data = {
					parentId: ""
				}
				let res = await findDeviceTypeListOffline(data);
				if (res.status == 200) {
					this.storageSyncObj.deviceTypeAllList = res.listObj;
				}

			},
			//获取离线检测已检条目
			async getFindCheckRecordListOffline() {
				let data = {
					"checkProjectId": this.$store.state.user.checkProject.id,
				}
				let res = await findCheckRecordListOffline(data);
				if (res.status == 200) {
					this.storageSyncObj.checkRecordList = res.listObj;
				}
			},
			//获取离线建筑
			async getFindByBuildingProjectListOffline() {

				let data = {
					"checkProjectId": this.$store.state.user.checkProject.id,
					"projectId": this.$store.state.user.projectId
				}
				let res = await findByBuildingProjectListOffline(data);
				if (res.status == 200) {
					this.storageSyncObj.projectBuildingList = res.object.list;
				}

			},
			//获取离线楼层
			async getFindBuildingFloorOffline() {
				let data = {
					"checkProjectId": this.$store.state.user.checkProject.id,
					"projectId": this.$store.state.user.projectId
				}
				let res = await findBuildingFloorOffline(data)
				if (res.status == 200) {
					this.storageSyncObj.projectBuildingFloorList = res.listObj;
				}
			},
			////获取检测所有检测条目
			async getFindCheckRecordListAllOffline() {
				let data = {
					"checkProjectId": this.$store.state.user.checkProject.id,
					"projectId": this.$store.state.user.projectId
				}
				let res = await findCheckRecordListAllOffline(data)
				if (res.status == 0) {
					this.storageSyncObj.itemAll = res.listObj;
				}
			}


		}
	}
</script>

<style lang="scss" scoped>
	.pageView {
		width: 100%;
		height: 100vh;

		.topView {
			background-color: #fff;
			width: 100%;
			padding: 10rpx 30rpx 0 30rpx;
			height: 110rpx;
			border-top: 2rpx solid #E3E3E3;

			.topTitleView {
				display: flex;
				align-items: center;
				margin-bottom: 5rpx;

				.topTitle3 {
					font-weight: 600 !important;
					font-size: 26rpx !important;
					color: #FA8161 !important;
				}

				.topTitle2 {
					font-family: PingFang SC, PingFang SC;
					font-weight: 400;
					font-size: 24rpx;
					color: #999999;
					text-align: left;
					font-style: normal;
					text-transform: none;
					margin-left: 20rpx;
				}

				.topTitle1 {
					height: 42rpx;
					width: 42rpx;
				}
			}
		}


	}

	.scrollBottom {
		height: 50rpx;
		width: 100%;
	}



	.liListView {
		height: calc(100% - 124rpx);
		margin-top: 20rpx;

		.litView {
			height: 88rpx;
			width: 100%;
			border-bottom: 1rpx solid #eee;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 30rpx;
			background-color: #fff;

			.liTitle {
				height: 40rpx;
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 28rpx;
				color: #333333;
				text-align: left;
				font-style: normal;
				text-transform: none;
			}

			.liRight {
				display: flex;
				align-items: center;

				.liText {
					width: auto;
					height: 34rpx;
					font-family: PingFang SC, PingFang SC;
					font-weight: 400;
					font-size: 24rpx;
					color: #999999;
					text-align: right;
					font-style: normal;
					text-transform: none;
				}
			}
		}
	}

	.color {
		color: #56B75D !important;
	}

	.bottomView {
		width: 100%;
		height: 166rpx;
		background: #FFFFFF;
		box-shadow: 0rpx -1rpx 0rpx 2rpx rgba(0, 0, 0, 0.16);
		border-top: 1rpx solid #eee;
		position: fixed;
		bottom: 0;
		z-index: 9;
		padding: 10rpx 30rpx;
		display: flex;
		justify-content: space-between;

		.viewLeft {
			width: calc(50% - 45rpx);
			height: 84rpx;
			background: #fff;
			border-radius: 12rpx 12rpx 12rpx 12rpx;
			line-height: 84rpx;
			font-family: PingFang SC, PingFang SC;
			font-weight: 500;
			font-size: 32rpx;
			color: #FA8161;
			text-align: center;
			font-style: normal;
			text-transform: none;
			border: 1rpx solid #FA8161;

		}

		.viewRight {
			width: calc(50% - 45rpx);
			height: 84rpx;
			background: #FA8161;
			border-radius: 12rpx 12rpx 12rpx 12rpx;

			line-height: 84rpx;
			font-family: PingFang SC, PingFang SC;
			font-weight: 500;
			font-size: 32rpx;
			color: #FFFFFF;
			text-align: center;
			font-style: normal;
			text-transform: none;
		}
	}
</style>