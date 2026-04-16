<template>
	<view class="pageView" :style="'padding: '+statusBarHeight+'rpx 0 0 0 ;'">

		<view class="customTopView">
			<view class="customTop" :style="'height:'+statusBarHeight+'rpx'">
				<view class="customBottom">
					<view class="customTop1" @click="goBack"> <u-icon class="uIcon" name="arrow-left" color="#000000"
							size="23"></u-icon>
					</view>
					<view class="customTop2">设施检测点列表</view>
					<view class="customTop3" @click="submit()"><u-icon name="plus" size="20" bold
							color="#FF5E5E"></u-icon>
					</view>
				</view>
			</view>

		</view>

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

		<view class="viewTop2">
			<view class="viewTab " :class="swiperTabCurrent==0?'onViewTab':''" @click="changePage(0)">全部检测项</view>
			<view class="viewTab" :class="swiperTabCurrent==1?'onViewTab':''" @click="changePage(1)">合格</view>
			<view class="viewTab" :class="swiperTabCurrent==2?'onViewTab':''" @click="changePage(2)">不合格</view>

		</view>


		<swiper class="swiperView" :current="swiperTabCurrent" :indicator-dots="false" :autoplay="false"
			@change="changeSwiper">
			<swiper-item class="swiperTtem">
				<check-list-all ref="checkListAllRef" :checkInfo="checkInfo"></check-list-all>
			</swiper-item>
			<swiper-item class="swiperTtem">
				<check-list-ok ref="checkListOkRef" :checkInfo="checkInfo"></check-list-ok>
			</swiper-item>
			<swiper-item class="swiperTtem">
				<check-list-fail ref="checkListFallRef" :checkInfo="checkInfo"></check-list-fail>
			</swiper-item>
		</swiper>

		<!-- <view class="bottomView">
			<view class="buttonView" @click="addPatrol()">
				添 加
			</view>
		</view> -->
	</view>
</template>

<script>
	import checkListAll from "./checkListAll.vue"
	import checkListOk from "./checkListOk.vue"
	import checkListFail from "./checkListFail.vue"
	export default {
		components: {
			checkListAll,
			checkListFail,
			checkListOk
		},
		data() {
			return {
				statusBarHeight: this.$store.state.user.statusBarHeight,
				swiperTabCurrent: 0,
				checkInfo: "",
			};
		},
		onUnload() {
			// 页面卸载时移除监听
			uni.$off('refreshData');
		},
		onLoad(data) {
			this.checkInfo = JSON.parse(data.item)

			// 监听事件
			uni.$on('refreshData', (data) => {
				if (data.refreshData) {
					if (this.swiperTabCurrent == 0) {
						this.$refs.checkListAllRef.getAll();
					} else if (this.swiperTabCurrent == 1) {
						this.$refs.checkListOkRef.getFindCheckPointList(true);
					} else {
						this.$refs.checkListFallRef.getFindCheckPointList(true);
					}
				}
			});

		},
		onReady() {
			this.$refs.checkListAllRef.getAll();
			this.$refs.checkListOkRef.getFindCheckPointList(true);
			this.$refs.checkListFallRef.getFindCheckPointList(true);
		},
		methods: {
			changeSwiper(current, source) {
				this.swiperTabCurrent = current.detail.current
			},
			changePage(type) {
				this.swiperTabCurrent = type
			},
			goBack() {
				uni.navigateBack();
			},
			submit() {
				this.$tab.navigateTo(`/pages/check/facilityCheck/checkInfo?checkInfo=${JSON.stringify(this.checkInfo)}`)
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

							.color2 {
								color: #FF5E5E;
							}
						}
					}
				}
			}
		}
	}
</style>