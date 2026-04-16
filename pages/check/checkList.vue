<template>
	<view class="pageView" :style="'padding: '+statusBarHeight+'rpx 0 0 0 ;'">
		<view class="customTopView">
			<view class="customTop" :style="'height:'+statusBarHeight+'rpx'">
				<view class="customBottom">
					<view class="customTop1" @click="goBack"> <u-icon class="uIcon" name="arrow-left" color="#000000"
							size="23"></u-icon>
					</view>
					<view class="customTop2 u-line-1">{{itemValue.deviceSysName}}</view>
					<view class="customTop3"></view>
				</view>
			</view>
		</view>
		<view class="topView"></view>
		<scroll-view scroll-y refresher-background="#f1f1f1" :style="'height: calc(100vh - '+statusBarHeight+'rpx );'"
			class="list" :refresher-threshold="105" :refresher-enabled="true"
			:refresher-triggered="refreshObj.refresherTriggered" @refresherrefresh="refresherrefresh"
			@refresherrestore="refresherrestore" @refresherabort="refresherabort">

			<view class="listView" v-for="(item, index) in deviceList" :key="index">
				<view class="device-item-title">
					{{ item.deviceTypeName }}
				</view>
				<view class="device-item" v-for="(item2, i) in item.sonList" :key="i" @click="goPage(item2)">
					<view class="device-item-top">
						<!-- 设备名称 -->
						<text class="device-name">{{ item2.checkName }}</text>

						<!-- 状态标签 -->
						<text :class="['status', item2.checkResult? 'completed' : 'pending']">
							{{ item2.checkResult ?"已完成":"未完成" }}
						</text>
					</view>

					<!-- 统计信息 -->
					<view class="stats">
						<text>评定结果：{{checkResult[item2.checkResult] }}</text>
						<text>得分：{{ item2.checkResult>0 && item2.checkResult<5?item2.score:"-" }}</text>
					</view>
				</view>


			</view>
			<view class="scrollBottom"></view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		findCheckRecordDeviceTypeCountReport
	} from '@/api/safety/safety.js'
	export default {
		data() {
			return {
				itemValue: "",
				statusBarHeight: this.$store.state.user.statusBarHeight,
				deviceList: [],
				checkResult: {
					1: "A",
					2: "B",
					3: "C",
					4: "D",
					5: "无此项"
				},
				refreshObj: {
					refresherTriggered: false,
					_refresherTriggered: false,
					sType: 'nomore',
					iconType: 'flower',
					status: true,
				},
				dataForm: {
					"checkProjectId": "",
					"projectId": "",
					"deviceSysId": "",
					"deviceSysIds": "",
					"buildingType": 4
				}
			}
		},
		onLoad(data) {
			this.dataForm.deviceSysIds = this.$store.state.user.checkProject.sysTypeIdList
			this.dataForm.checkProjectId = this.$store.state.user.checkProject.id;
			this.dataForm.projectId = this.$store.state.user.projectId;
			if (data.item) {
				this.itemValue = JSON.parse(data.item)
				this.dataForm.deviceSysId = this.itemValue.deviceSysId
			}
		},
		onShow() {
			this.getFindCheckRecordDeviceTypeCountReport(true);
		},
		onReady() {},
		methods: {
			goBack() {
				uni.navigateBack();
			},
			goPage(item) {
				item["deviceType"] = this.itemValue.deviceType;
				this.$tab.navigateTo("/pages/safety/check/addCheckInfo?item=" + JSON.stringify(item))
			},
			refresherrefresh() {
				if (this.refreshObj._refresherTriggered) {
					return;
				}
				this.refreshObj._refresherTriggered = true;
				//界面下拉触发，triggered可能不是true，要设为true
				if (!this.refreshObj.refresherTriggered) {
					this.refreshObj.refresherTriggered = true;
				}
				this.loadStoreData();
			},
			refresherrestore() {
				this.refreshObj.refresherTriggered = false;
				this.refreshObj._refresherTriggered = false;
			},
			refresherabort() {
				this.refreshObj.refresherTriggered = false;
				this.refreshObj._refresherTriggered = false;
			},
			loadStoreData() {
				this.datetimeValue = "";
				this.dataForm.searchCheckDate = "";
				this.dataForm.deviceTypeName = "";

				this.getFindCheckRecordDeviceTypeCountReport(true);
			},
			getFindCheckRecordDeviceTypeCountReport(empty) {
				this.dataForm.pageIndex = 1;
				this.deviceList = [];
				findCheckRecordDeviceTypeCountReport(this.dataForm).then(res => {
					if (res.listObj) {
						res.listObj.forEach((item) => {
							let index = this.deviceList.findIndex(parameter => parameter.deviceTypeId ===
								item
								.deviceTypeId);
							if (index < 0) {
								let elem = {
									deviceTypeName: item.deviceTypeName,
									deviceTypeId: item.deviceTypeId,
									sonList: [item],
								}
								this.deviceList.push(elem);
							} else {
								this.deviceList[index].sonList.push(item);
							}
						})

					}


					this.refreshObj.refresherTriggered = false; //触发onRestore，并关闭刷新图标
					this.refreshObj._refresherTriggered = false;
				})

			}
		}
	}
</script>

<style lang="scss" scoped>
	.pageView {
		min-height: 100vh;
		height: auto;
		width: 100%;
		// background-color: #fff;
	}

	.topView {
		width: 100%;
		height: 20rpx;
		background-color: #F7F7F7;
	}

	.scrollBottom {
		height: 200rpx;
		width: 100%;
	}

	.list {
		width: 100%;
		// height: calc(100% - 1rpx);
		// margin-left: 30rpx;
	}

	.listView {
		margin-bottom: 20rpx;
	}

	.device-item-title {
		height: 80rpx;
		width: 100%;
		background-color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		font-size: 30rpx;
		color: #e74c3c;
		;
		font-weight: 600;
		border-bottom: 1rpx solid #eee;
	}

	.device-item {
		padding: 0 30rpx 0 30rpx;
		background-color: white;
	}

	.device-item-top {
		height: 80rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.device-name {
		font-size: 30rpx;
		color: #333;
		flex: 1;
	}

	.status {
		font-size: 24rpx;
		padding: 4rpx 12rpx;
		border-radius: 12rpx;
		min-width: 60rpx;
		text-align: center;
	}

	.status.completed {
		color: #2ecc71;
		background-color: rgba(46, 204, 113, 0.1);
	}

	.status.pending {
		color: #e74c3c;
		background-color: rgba(231, 76, 54, 0.1);
	}

	.stats {
		font-size: 24rpx;
		color: #666;
		display: flex;
		justify-content: space-between;
		width: 100%;
		padding: 0 60rpx 20rpx 60rpx;
		border-bottom: 1rpx solid #eee;
	}
</style>