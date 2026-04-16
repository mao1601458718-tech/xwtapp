<template>
	<view class="pageView" :style="'padding: '+statusBarHeight+'rpx 0 0 0 ;'">
		<view class="customTopView">
			<view class="customTop" :style="'height:'+statusBarHeight+'rpx'">
				<view class="customBottom">
					<view class="customTop1" @click="goBack"> <u-icon class="uIcon" name="arrow-left" color="#000000"
							size="23"></u-icon>
					</view>
					<view class="customTop2">{{titleText[dataForm.deviceType]}}</view>
					<view class="customTop3"></view>
				</view>
			</view>
		</view>
		<view class="topView"></view>

		<scroll-view scroll-y refresher-background="#f1f1f1" class="list"
			:style="'height: calc(100vh - '+statusBarHeight+'rpx );'" @scrolltolower="onreachBottom"
			:refresher-threshold="105"" :refresher-enabled=" true" :refresher-triggered="refreshObj.refresherTriggered"
			@refresherrefresh="refresherrefresh" @refresherrestore="refresherrestore" @refresherabort="refresherabort">

			<block v-for="(item, index) in deviceList" :key="index">
				<view class="device-item" @click="goPage(item)">
					<view class="device-item-top">
						<!-- 设备名称 -->
						<text class="device-name">{{ item.deviceSysName }}</text>

						<!-- 状态标签 -->
						<text :class="['status', item.deviceTypeNum==item.checkNum ? 'completed' : 'pending']">
							{{ item.deviceTypeNum==item.checkNum?"已完成":"未完成" }}
						</text>
					</view>
					<!-- 统计信息 -->
					<view class="stats">
						<text>总项：{{ item.deviceTypeNum }}</text>
						<text>权重：{{ item.weight }}</text>
						<text>完成：{{ item.checkNum }}</text>
						<text>得分：{{ item.deviceTypeNum==item.checkNum? (item.score/100):"/" }}</text>
					</view>
				</view>
			</block>
			<view class="uLoadmore">
				<u-loadmore :status="refreshObj.sType" bg-color="#f1f1f1" icon-type="flower" />
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		findCheckRecordDeviceSysCountReport
	} from '@/api/safety/safety.js'

	export default {
		data() {
			return {
				titleText: {
					"1": "评建筑防火",
					"2": "评设施器材",
					"3": "评安全管理",
				},

				statusBarHeight: this.$store.state.user.statusBarHeight,
				deviceList: [],
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
					"pageIndex": 1,
					"pageSize": 15,
					"orderCols": ["createTime"],
					"orderDesc": true,
					"deviceType": "",
					"deviceSysIds": "",
					"buildingType": 4
				},

			}
		},
		onLoad(data) {
			this.dataForm.deviceSysIds = this.$store.state.user.checkProject.sysTypeIdList
			this.dataForm.checkProjectId = this.$store.state.user.checkProject.id;
			this.dataForm.projectId = this.$store.state.user.projectId;
			this.dataForm.deviceType = data.type

		},
		onShow() {
			this.getFindCheckRecordDeviceSysCountReport(true);
		},
		onReady() {},
		methods: {
			goBack() {
				uni.navigateBack();
			},
			goPage(item) {
				this.$tab.navigateTo("/pages/safety/check/checkList?item=" + JSON.stringify(item))
			},
			onreachBottom(e) {
				if (this.refreshObj.status) {
					this.refreshObj.sType = 'loading';
					this.refreshObj.status = false;
					this.getFindCheckRecordDeviceSysCountReport(false);
				}
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

				this.getFindCheckRecordDeviceSysCountReport(true);
			},
			getFindCheckRecordDeviceSysCountReport(empty) {
				if (empty) {
					this.refreshObj.sType = 'nomore';
					this.dataForm.pageIndex = 1;
					this.deviceList = [];
				}
				findCheckRecordDeviceSysCountReport(this.dataForm).then(res => {
					if (res.listObj) {
						this.deviceList.push(...res.listObj);
						if (this.deviceList.length < res.totalCount) {
							this.refreshObj.status = true;
							this.dataForm.pageIndex++;
							this.refreshObj.sType = 'loadmore';
						} else {
							this.refreshObj.status = false;
							this.refreshObj.sType = 'nomore';
						}
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
		width: calc(100% - 60rpx);
		margin-left: 30rpx;
	}

	.device-item {
		padding: 20rpx;
		margin-bottom: 20rpx;
		border-radius: 12rpx;
		background-color: white;
	}

	.device-item-top {
		height: 80rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #eee;
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
		padding: 20rpx 0 0 0;
	}
</style>