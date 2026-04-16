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
		<scroll-view class="liListView" scroll-y refresher-background="#f1f1f1" :refresher-threshold="105"
			:refresher-enabled="true" :refresher-triggered="refreshObj.refresherTriggered"
			@refresherrefresh="refresherrefresh" @refresherrestore="refresherrestore" @refresherabort="refresherabort">
			<view class="litView" v-for="(item,index) in deviceTypeList" :key="index" @click="goPage(item)">
				<view class="liTitle">{{item.deviceSysName}}</view>
				<view class="liRight">
					<text class="liText">
						<text class="liText color">{{item.checkNum}}</text>
						<text class="liText">/</text>
						<text class="liText">{{item.totalNum}}</text>
					</text>
					<u-icon name="arrow-right" size="16" color="#999999"></u-icon>
				</view>
			</view>
			<view class="scrollBottom"></view>
		</scroll-view>


		<!-- <view class="bottomView">
			<view class="buttonView" @click="addPatrol()">
				添 加
			</view>
		</view> -->
	</view>
</template>

<script>
	import {
		findParentDeviceTypeList
	} from '@/api/project/project.js'

	export default {
		data() {
			return {
				dataForm: {
					"checkProjectId": "",
					"deviceSysIds": "",
					"detectType": "",
					"projectId": "",
				},
				refreshObj: {
					refresherTriggered: false,
					_refresherTriggered: false,
				},
				deviceTypeList: []
			};
		},
		onShow() {
			this.dataForm.projectId = this.$store.state.user.projectId;
			this.dataForm.checkProjectId = this.$store.state.user.checkProject.id;
			this.dataForm.deviceSysIds = this.$store.state.user.checkProject.sysTypeIdList;
			this.dataForm.detectType = this.$store.state.user.checkProject.detectType;
			this.getFindParentDeviceTypeList();
		},
		methods: {
			goPage(item) {
				this.$tab.navigateTo("/pages/check/facilityCheck/facilityCheckIndex?item=" + JSON.stringify(item))
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

				this.getFindParentDeviceTypeList();
			},
			getFindParentDeviceTypeList() {

				findParentDeviceTypeList(this.dataForm).then(res => {
					this.deviceTypeList = res.listObj

					this.refreshObj.refresherTriggered = false; //触发onRestore，并关闭刷新图标
					this.refreshObj._refresherTriggered = false;
				})
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

	.bottomView {
		height: 176rpx;
		width: 100%;
		background-color: #fff;
		position: fixed;
		bottom: 0;
		z-index: 99;

		box-shadow: 0rpx -1rpx 0rpx 2rpx rgba(0, 0, 0, 0.16);

		.buttonView {
			width: calc(100% - 60rpx);
			height: 84rpx;
			background: #FA8161;
			border-radius: 12rpx 12rpx 12rpx 12rpx;
			margin-left: 30rpx;
			text-align: center;
			line-height: 84rpx;
			color: #fff;
			margin-top: 20rpx;
		}
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
</style>