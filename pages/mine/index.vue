<template>
	<view class="workContainer">
		<view class="topView">
			<view class="top"></view>
			<view class="headerView">
				<view class="headerImg">
					<image class="header" src="/static/images/user/head_geren.png"></image>
				</view>
				<view class="headerName">
					<view class="userName">张三</view>
					<view class="userPhone">12345678911</view>
				</view>
			</view>
			<view class="top2View">
				<view class="top2" @click="versions">
					<view class="top2Title">
						<view class="top2Text1">关于我们</view>
						<view class="top2Text2">关于消维通</view>
					</view>
					<view class="top2ImgView">
						<image class="top2Img" src="/static/images/user/img2.png"></image>
					</view>
				</view>

				<view class="top2" @click="handleToPwd">
					<view class="top2Title">
						<view class="top2Text1">修改密码</view>
						<view class="top2Text2">修改密码</view>
					</view>
					<view class="top2ImgView">
						<image class="top2Img" src="/static/images/user/img1.png"></image>
					</view>
				</view>
			</view>
			<!-- 	<view class="top3View">
				<image class="top3View1" src="/static/images/user/img3.png"></image>
				<view class="top3View2">标签粘贴指南</view>
				<view class="top3View3"><u-icon name="arrow-right" size="20" color="rgba(179, 179, 179, 1)"></u-icon>
				</view>
			</view> -->

			<!-- <view class="top3View">
				<image class="top3View1" src="/static/images/user/img5.png"></image>
				<view class="top3View2">常见问题</view>
				<view class="top3View3"><u-icon name="arrow-right" size="20" color="rgba(179, 179, 179, 1)"></u-icon>
				</view>
			</view> -->
			<view class="top3View" @click="postLogout">
				<image class="top3View1" src="/static/images/user/img4.png"></image>
				<view class="top3View2">退出登录</view>
				<view class="top3View3"><u-icon name="arrow-right" size="20" color="rgba(179, 179, 179, 1)"></u-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		logout
	} from '@/api/login.js'

	export default {
		data() {
			return {

			}
		},
		methods: {
			versions() {
				this.$tab.navigateTo("/pages/mine/versions")
			},
			handleToPwd() {
				this.$tab.navigateTo('/pages/mine/pwd/index')
			},

			postLogout(data) {
				uni.showModal({
					title: '提示',
					content: '是否退出当前账号？',
					success: (res) => {
						if (res.confirm) {
							this.$store.dispatch('LogOut').then(() => {}).finally(() => {
								uni.reLaunch({
									url: '/pages/login' // 登录页面的路径
								});
							})

						}
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.workContainer {
		width: 100%;
		height: 100vh;


		.topView {
			width: 100%;
			height: 520rpx;
			background: linear-gradient(180deg, rgba(255, 143, 17, 0.35) 0%, rgba(248, 191, 84, 0.25) 27%, rgba(249, 201, 129, 0.25) 65%, rgba(202, 130, 6, 0) 100%);
			border-radius: 0rpx 0rpx 0rpx 0rpx;
			// opacity: 0.25;

			.top {
				height: 176rpx;
				width: 100%;
			}

			.headerView {
				display: flex;
				height: 112rpx;
				padding: 0 30rpx;

				.headerImg {
					width: 112rpx;
					height: 112rpx;

					.header {
						width: 112rpx;
						height: 112rpx;
					}
				}

				.headerName {
					width: calc(100% - 142rpx);
					height: 112rpx;
					margin-left: 30rpx;
					padding: 10rpx 0;

					.userName {
						width: auto;
						height: 46rpx;
						font-family: PingFang SC, PingFang SC;
						font-weight: 600;
						font-size: 36rpx;
						color: #1B1B1B;
						text-align: left;
						line-height: 46rpx;
						font-style: normal;
						text-transform: none;
					}

					.userPhone {
						width: auto;
						height: 46rpx;
						font-family: PingFang SC, PingFang SC;
						font-weight: 400;
						font-size: 24rpx;
						color: #616161;
						text-align: left;
						line-height: 46rpx;
						font-style: normal;
						text-transform: none;
					}
				}
			}

			.top2View {
				width: 100%;
				height: 134rpx;
				margin-top: 36rpx;
				display: flex;
				padding: 0 30rpx;
				justify-content: space-between;

				.top2 {
					width: 336rpx;
					height: 100%;
					background: #FFFFFF;
					border-radius: 16rpx 16rpx 16rpx 16rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 0 30rpx;

					.top2Title {
						.top2Text1 {
							height: 44rpx;
							font-family: PingFang SC, PingFang SC;
							font-weight: 600;
							font-size: 32rpx;
							color: #1B1B1B;
							text-align: center;
							font-style: normal;
							text-transform: none;
						}

						.top2Text2 {
							height: 34rpx;
							font-family: PingFang SC, PingFang SC;
							font-weight: 400;
							font-size: 24rpx;
							color: #B3B3B3;
							text-align: left;
							font-style: normal;
							text-transform: none;
						}
					}

					.top2ImgView {
						width: 80rpx;
						height: 80rpx;
						// background: linear-gradient(180deg, rgba(73, 150, 241, 0.2) 0%, rgba(73, 150, 241, 0) 100%);
						border-radius: 28rpx 28rpx 28rpx 28rpx;

						.top2Img {
							width: 80rpx;
							height: 80rpx;
						}
					}
				}
			}

			.top3View {
				width: calc(100% - 60rpx);
				margin-left: 30rpx;
				height: 98rpx;
				background: #FFFFFF;
				border-radius: 12rpx 12rpx 12rpx 12rpx;
				margin-top: 24rpx;
				display: flex;
				padding: 0 30rpx;
				// justify-content: center;
				align-items: center;

				.top3View1 {
					width: 42rpx;
					height: 42rpx;
				}

				.top3View2 {
					width: calc(100% - 114rpx);
					margin-left: 30rpx;
					font-family: PingFang SC, PingFang SC;
					font-weight: 400;
					font-size: 30rpx;
					color: #181818;
					text-align: left;
					font-style: normal;
					text-transform: none;
				}

			}
		}

	}
</style>