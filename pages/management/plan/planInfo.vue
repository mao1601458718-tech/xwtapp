<template>
	<view class="container">
		<!-- 页面头部 -->
		<view class="header">
			<text class="subtitle1"></text>
			<text class="title">{{planForm.planName||"暂无"}}</text>
			<text class="subtitle" @click="addCheck()">添加巡查测试</text>
		</view>

		<!-- 设备列表 -->
		<scroll-view scroll-y refresher-background="#f1f1f1" class="list" :refresher-threshold="105"
			:refresher-enabled="true" :refresher-triggered="refreshObj.refresherTriggered"
			@refresherrefresh="refresherrefresh" @refresherrestore="refresherrestore" @refresherabort="refresherabort">
			<view style="height: 10rpx;">
			</view>
			<!-- <view class="list"> -->
			<block v-for="(item, index) in deviceList" :key="index">
				<view class="device-item" @click="goPage(item)">
					<view class="device-item-top">
						<!-- 设备名称 -->
						<text class="device-name">{{ item.deviceSysName }}</text>

						<!-- 状态标签 -->
						<u-tag text="未开始" type="info" v-if="item.checkNum==0" plain plainFill size="mini"></u-tag>
						<u-tag text="未完成" v-if="item.checkNum>0&&item.checkNum<item.totalCheckNum" plain plainFill
							size="mini"></u-tag>
						<u-tag text="已完成" type="success" v-if="item.checkNum==item.totalCheckNum" plain plainFill
							size="mini"></u-tag>
					</view>

					<!-- 统计信息 -->
					<view class="stats">
						<text>总项：{{ item.totalCheckNum }}</text>
						<text>已完成：{{ item.checkNum }}</text>
						<text>未完成：{{ item.totalCheckNum-item.checkNum }}</text>
					</view>
				</view>
			</block>
			<view class="uLoadmore">
			</view>
			<view class="uLoadmore">
			</view>
		</scroll-view>

		<view class="bottomView">
			<view class="viewLeft" @click="addPlanExplain">维保情况简述</view>
			<view class="viewRight" @click="planAuto">引用上月维保</view>
		</view>
	</view>
</template>

<script>
	import {
		findPlanDeviceSysReportList,
		findLastMonthPlanAuto
	} from '@/api/maintenance/maintenance'

	export default {
		data() {
			return {
				deviceList: [],
				planForm: "",
				refreshObj: {
					refresherTriggered: false,
					_refresherTriggered: false,
				},
			};
		},
		onLoad(data) {
			if (data.item) {
				this.planForm = JSON.parse(data.item)
			}
			// this.getFindPlanDeviceSysReportList()
		},
		onShow() {
			this.getFindPlanDeviceSysReportList()
		},
		methods: {
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
				this.getFindPlanDeviceSysReportList();
			},
			goPage(item) {
				this.$tab.navigateTo("/pages/management/plan/planSystem?item=" + JSON.stringify(item))
			},
			addCheck() {
				let item = JSON.stringify(this.planForm);
				item = JSON.parse(item);
				item.id = "";
				item.checkResult = 1;
				this.$tab.navigateTo("/pages/management/check/addOrUpdatePatrol?item=" + JSON.stringify(item))
			},
			getFindPlanDeviceSysReportList() {
				let data = {
					"customerId": this.$store.state.user.checkProject.id,
					"projectId": this.$store.state.user.projectId,
					"id": this.planForm.id,
					"pageIndex": 1,
					"pageSize": 15,
				}
				findPlanDeviceSysReportList(data).then(res => {
					this.deviceList = res.listObj;
					this.refreshObj.refresherTriggered = false; //触发onRestore，并关闭刷新图标
					this.refreshObj._refresherTriggered = false;
				})
			},
			addPlanExplain() {
				this.$tab.navigateTo("/pages/management/plan/planExplain?item=" + JSON.stringify(this.planForm))
			},
			planAuto() {
				let data = {
					"customerId": this.$store.state.user.checkProject.id,
					"projectId": this.$store.state.user.projectId,
					"pageIndex": 1,
					"pageSize": 15,
					"checkDate": "2021-04-20",
					"effective": 1,
					"clientType": 1,
					"id": this.planForm.id,
				}
				this.$modal.loadingNotNone('引用中')
				findLastMonthPlanAuto(data).then(res => {
					this.$modal.closeLoading();
					this.$modal.showToast("引用成功")
				})
			}
		}
	};
</script>

<style scoped lang="scss">
	.container {
		width: 100%;
		background-color: #f0f2f5;
		height: 100vh;
	}

	.header {
		width: 100%;
		text-align: center;
		margin-bottom: 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;
		height: 80rpx;
		border-top: 1rpx solid #eee;
		padding: 0 20rpx;
		position: fixed;
		z-index: 999;
	}

	.title {
		width: auto;
		height: 40rpx;
		font-family: PingFang SC, PingFang SC;
		font-weight: 600;
		font-size: 28rpx;
		color: #FA8161;
		text-align: center;
		font-style: normal;
		text-transform: none;
	}

	.subtitle1 {
		width: 130rpx;
		height: auto;
		padding: 5rpx 10rpx;
		font-size: 22rpx;
		border-radius: 8rpx;

	}

	.subtitle {
		width: 130rpx;
		height: auto;
		padding: 5rpx 10rpx;
		font-size: 22rpx;
		border-radius: 8rpx;
		background-color: rgba(85, 144, 245, 0.10);
		color: #5590F5;
	}

	.list {
		width: calc(100% - 60rpx);
		margin-left: 30rpx;
		padding: 90rpx 0 0 0;
		height: 100%;
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