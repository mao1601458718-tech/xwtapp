<template>
	<scroll-view class="scrollView" scroll-y refresher-background="#f1f1f1" :refresher-threshold="105"
		:refresher-enabled="true" :refresher-triggered="refreshObj.refresherTriggered"
		@refresherrefresh="refresherrefresh" @refresherrestore="refresherrestore" @refresherabort="refresherabort">
		<view class="faultView" v-for="(item,index) in deviceTypeList" :key="index" @click="goPage(item)">
			<view class="contentTitle">
				<view class="contentTitle1">检测编号：{{item.code}}</view>
				<view class="contentTitle2 statusType2 contentTitle3">
					<!-- <u-icon name="trash" color="#FF5E5E"></u-icon>
					删除 -->
				</view>
			</view>
			<view class="contentLi">
				<view class="contentLi1">检测类别：{{item.deviceSysName}}</view>
			</view>
			<view class="contentLi">
				<view class="contentLi1">是否检测：<text
						:class="'color'+item.status">{{item.status === 1 ? '已检' : '未检'}}</text></view>
			</view>

		</view>
		<view class="scrollBottom"></view>
	</scroll-view>
</template>

<script>
	import {
		fireproofDeviceTypeListApp,
		findCheckPointList
	} from '@/api/project/project.js'

	export default {
		props: {
			checkInfo: {
				type: Object,
				default () {
					return {}
				}
			},


		},
		data() {
			return {
				refreshObj: {
					refresherTriggered: false,
					_refresherTriggered: false,
				},
				dataForm: {
					"pageIndex": 1,
					"pageSize": 0,
					"checkProjectId": "",
					"deviceSysId": "",
					"orderCols": ["createTime"],
					"orderDesc": true,
					"checkResult": ""
				},
				deviceTypeList: [],
				checkTypeList: [],
			};
		},
		onLoad() {

		},
		methods: {
			async getAll() {
				try {
					await Promise.all([
						this.getFindDeviceTypeList(),
						this.getFindCheckPointList(),
					]);
					this.refreshObj.refresherTriggered = false;
					this.refreshObj._refresherTriggered = false;
					this.setStatus();
				} catch (error) {
					this.refreshObj.refresherTriggered = false;
					this.refreshObj._refresherTriggered = false;
				}
			},
			setStatus() {

				this.deviceTypeList.forEach((item) => {
					if (this.checkTypeList.length > 0 && this.checkTypeList.some(e => e.deviceTypeId ===
							item.id)) {
						item.status = 1;
					} else {
						item.status = 0;
					}
				});
				this.deviceTypeList.sort((a, b) => a.status - b.status);


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
				this.getAll();
			},
			async getFindDeviceTypeList() {
				let data = {
					"parentId": this.checkInfo.id
				}
				const res = await fireproofDeviceTypeListApp(data);
				this.deviceTypeList = res.listObj;
			},
			async getFindCheckPointList() {
				this.dataForm.deviceSysId = this.checkInfo.id;
				this.dataForm.checkProjectId = this.$store.state.user.checkProject.id;
				// 注意这里需要 return，并且使用 await
				const res = await findCheckPointList(this.dataForm);
				if (res.listObj) {
					this.checkTypeList = res.listObj;
				}
			},
			goPage(item) {
				this.$tab.navigateTo(
					`/pages/check/facilityCheck/checkInfo?item=${JSON.stringify(item)}&checkInfo=${JSON.stringify(this.checkInfo)}`
				)
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

		.viewTop2 {
			margin-top: 24rpx;
			width: 100%;
			height: 124rpx;
			background: #FFFFFF;
			border-radius: 0rpx 0rpx 0rpx 0rpx;

			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 30rpx;

			.viewTab {
				width: 214rpx;
				height: 76rpx;
				background: #F7F7F7;
				border-radius: 12rpx 12rpx 12rpx 12rpx;
				text-align: center;
				line-height: 76rpx;
			}

			.onViewTab {
				background: #FA8161;
				border-radius: 12rpx 12rpx 12rpx 12rpx;
				color: #fff;
			}
		}
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

	.swiperView {
		width: 100%;
		height: calc(100% - 248rpx);
		padding: 20rpx 30rpx 0 30rpx;

		.swiperTtem {
			width: 100%;

			.scrollView {
				width: 100%;
				height: 100%;

				.scrollBottom {
					height: 100rpx;
					width: 100%;
				}

				.faultView {
					width: 100%;
					height: auto;
					background: #FFFFFF;
					border-radius: 12rpx;
					margin-bottom: 20rpx;
					padding: 0 24rpx 24rpx 24rpx;

					.contentTitle {
						width: 100%;
						min-height: 80rpx;
						height: auto;
						padding: 10rpx 0;
						border-bottom: 1px solid #F5F5F5;
						display: flex;
						align-items: center;
						justify-content: space-between;

						.contentTitle1 {
							width: calc(100% - 245rpx);
							height: auto;
							font-family: PingFang SC, PingFang SC;
							font-weight: 500;
							font-size: 28rpx;
							color: #333333;
							font-style: normal;
							text-transform: none;
						}

						.contentTitle2 {
							font-family: PingFang SC, PingFang SC;
							font-weight: 400;
							font-size: 24rpx;
							color: #999999;
							text-align: right;
							font-style: normal;
							text-transform: none;
							display: flex;
							align-items: center;
						}

						.contentTitle3 {
							font-family: PingFang SC, PingFang SC;
							font-weight: 400;
							font-size: 24rpx;
							color: #FF5E5E;
							text-align: right;
							font-style: normal;
							text-transform: none;
						}

					}

					.contentLi {
						width: 100%;
						height: auto;
						padding: 10rpx 0;
						display: flex;
						align-items: center;
						justify-content: space-between;
						font-family: PingFang SC, PingFang SC;
						font-weight: 400;
						font-size: 24rpx;
						color: #999999;
						text-align: left;
						font-style: normal;
						text-transform: none;

						.contentLi1 {
							display: flex;
							align-items: center;

							.color1 {
								color: #56B75D;
							}

							.color0 {
								color: #FF5E5E;
							}
						}
					}
				}
			}
		}
	}
</style>