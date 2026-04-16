<template>
	<view class="container">
		<!-- 页面头部 -->
		<view class="header">
			<text class="title"></text>
			<text class="title">{{deviceForm.deviceSysName}}</text>
			<text class="title"></text>
		</view>

		<!-- 设备列表 -->
		<scroll-view scroll-y class="list">

			<block v-for="(item, index) in deviceList" :key="index">
				<view class="device-item" @click="goPage(item)">
					<view class="device-item-top">
						<!-- 设备名称 -->
						<text class="device-name">{{ item.deviceTypeName }}</text>

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
		</scroll-view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				deviceList: [],

				deviceForm: ""
			};
		},
		onLoad(data) {
			if (data.item) {
				this.deviceForm = JSON.parse(data.item)
			}
		},
		onShow() {
			this.getFindPlanDeviceSysReportList()
		},
		methods: {

			goPage(item) {
				this.$tab.navigateTo("/pages/management/offLine/systemInfo?item=" + JSON.stringify(item))
			},
			getFindPlanDeviceSysReportList() {
				this.deviceList

				let getStorage = uni.getStorageSync('planOffLine_' + this.$store.state.user.checkProject.id)
				if (getStorage && getStorage.planList) {
					let planObj = "";
					getStorage.planList.forEach((item) => {
						if (item.id == this.deviceForm.id) {
							item.planDeviceSysReportList.forEach((sys) => {
								if (sys.deviceTypeId == this.deviceForm.deviceTypeId && sys.deviceSysId ==
									this.deviceForm.deviceSysId) {
									this.deviceList = sys.planDeviceTypeReportList
								}
							})
						}
					})
				}
			},
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


	.subtitle {
		width: auto;
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
		padding: 120rpx 0 0 0;
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