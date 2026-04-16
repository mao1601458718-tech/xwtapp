<template>
	<view class="paveView">
		<view class="topView"></view>
		<scroll-view scroll-y refresher-background="#fff" class="liListView" :refresher-threshold="105"
			:refresher-enabled="true" :refresher-triggered="refreshObj.refresherTriggered"
			@refresherrefresh="refresherrefresh" @refresherrestore="refresherrestore" @refresherabort="refresherabort">

			<view class="litView" v-for="(item,index) in pointList" :key="index" @click="goFacilityList(item)">
				<view class="liTitle">{{item.deviceSysName}}</view>
				<view class="liRight">
					<text class="liText">{{item.deviceNum}}</text>
					<u-icon name="arrow-right" size="16" color="#999999"></u-icon>
				</view>
			</view>
		</scroll-view>

		<view class="bottomView">
			<view class="viewLeft" @click="goAddFacility(null)">添 加</view>
		</view>
	</view>
</template>

<script>
	import {
		findCheckPointSysList
	} from '@/api/maintenance/maintenance'
	export default {
		data() {
			return {
				pointList: [],
				refreshObj: {
					refresherTriggered: false,
					_refresherTriggered: false,
				},
			};
		},
		onShow() {
			this.getFindCheckPointSysList()
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
				this.getFindCheckPointSysList();
			},
			getFindCheckPointSysList() {
				let data = {
					"checkProjectId": this.$store.state.user.checkProject.id,
					"projectId": this.$store.state.user.projectId,
					"pageIndex": 1,
					"pageSize": 30,
				}
				findCheckPointSysList(data).then(res => {
					this.pointList = res.listObj;
					this.refreshObj.refresherTriggered = false; //触发onRestore，并关闭刷新图标
					this.refreshObj._refresherTriggered = false;
				})
			},
			goAddFacility(item) {
				this.$tab.navigateTo("/pages/management/facility/addFacility?item=" + JSON.stringify(item))
			},
			goFacilityList(item) {
				this.$tab.navigateTo("/pages/management/facility/facilityList?item=" + JSON.stringify(item))
			}
		}
	}
</script>

<style lang="scss" scoped>
	.paveView {
		width: 100%;
		min-height: 100vh;
		height: auto;
		background-color: #fff;
		padding: 0 0 300rpx 0;

		.topView {
			width: 100%;
			height: 20rpx;
			background-color: #F7F7F7;
		}

		.liListView {
			padding: 0 30rpx;
			height: calc(100vh - 288rpx);

			.litView {
				height: 88rpx;
				width: 100%;
				border-bottom: 1rpx solid #eee;
				display: flex;
				justify-content: space-between;
				align-items: center;


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
						margin-right: 25rpx;
						width: 10rpx;
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
		justify-content: center;

		.viewLeft {
			width: 100%;
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