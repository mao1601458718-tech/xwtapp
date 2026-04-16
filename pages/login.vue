<template>
	<view class="normal-login-container">
		<view class="bgtag">
			<view class="bgtag1">Hello!</view>
			<view class="bgtag2">欢迎来到消维通~</view>

		</view>
		<view class="bgImage">
			<image style="width: 250px;height: 365px;" src="/static/images/login/loginxf.png">
			</image>
		</view>

		<view class="login-form-content">
			<view class="login-top-View">
				<view class="login-top">
					账号登录
				</view>
			</view>
			<view class="login-top-View">
				<view class="login-lin">
				</view>
			</view>
			<view class="accountView">
				<view class="addountTextView">账号</view>
				<view class="addountInputView">
					<u--input class="uInput" borde="none" shape="circle" clearable placeholder="请输入内容"
						v-model="loginForm.loginName"></u--input>
				</view>
				<view class="addountTextView">密码</view>
				<view class="addountInputView">
					<u--input class="uInput" borde="none" shape="circle" clearable placeholder="请输入内容"
						v-model="loginForm.password" password></u--input>
				</view>
				<view class="addountButton" @click="handleLogin"
					:class="loginForm.password&&loginForm.loginName?'addountButtonBack':''">
					登 录
				</view>
				<view class="xieyi ">
					<uni-data-checkbox multiple v-model="agree" :localdata="verifyTypeList"></uni-data-checkbox>
					<view class="text-blue2">我已阅读并同意</view>
					<view @click="handleUserAgrement" class="text-blue">《用户协议》</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	import {
		login
	} from '@/api/login'

	import {
		getToken
	} from '@/utils/auth'

	export default {
		data() {
			return {
				verifyTypeList: [{
					text: '',
					value: 1
				}],
				agree: 0,
				globalConfig: getApp().globalData.config,
				loginForm: {
					loginName: "LIUYAO",
					password: "Qwe123",
					loginType: 1,
				}
			}
		},
		onShow() {
			// 隐藏底部导航栏
			uni.hideTabBar();
		},
		methods: {
			// 用户协议
			handleUserAgrement() {
				let site = this.globalConfig.appInfo.agreements[1]
				this.$tab.navigateTo(`/pages/common/webview/index?title=${site.title}&url=${site.url}`)
			},
			// 登录方法
			async handleLogin() {
				if (!this.loginForm.loginName || !this.loginForm.password) {
					return;
				}
				if (!this.agree || this.agree.length == 0) {
					uni.showToast({
						icon: 'none',
						title: "请阅读并同意用户协议",
						mask: true,
						duration: 1500
					})
					return;
				}
				this.$store.dispatch('SetAtProject', "").then(res => {})
				this.$store.dispatch('Login', this.loginForm).then((result) => {
					this.$modal.closeLoading()
					this.loginSuccess(result)
				}).catch(() => {
					if (this.captchaEnabled) {
						this.getCode()
					}
				})

				// login(this.loginForm).then(res => {
				// 	this.loginSuccess(res)
				// })
				return;
			},

			// 登录成功后，处理函数
			loginSuccess(result) {
				// 设置用户信息
				this.$store.dispatch('GetInfo', result).then(res => {
					this.$tab.reLaunch('/pages/index')
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #ffffff;
	}

	.bgtag {
		width: 100%;
		height: 382px;
		background: linear-gradient(180deg, #F6594F 0%, #FFD28F 71%, rgba(223, 180, 137, 0) 100%);
		border-radius: 0px 0px 0px 0px;
		position: fixed;
		top: 0;

		.bgtag1 {
			width: 84px;
			height: 40px;
			font-family: Noto Sans CJK SC, Noto Sans CJK SC;
			font-weight: bold;
			font-size: 30px;
			color: #FFFFFF;
			text-align: center;
			font-style: normal;
			text-transform: none;
			margin-top: 84px;
			margin-left: 26px;
		}

		.bgtag2 {
			width: 115px;
			height: 20px;
			font-family: PingFang SC, PingFang SC;
			font-weight: 400;
			font-size: 14px;
			color: #FFFFFF;
			text-align: left;
			font-style: normal;
			text-transform: none;
			margin-top: 8px;
			margin-left: 26px;
		}
	}

	.bgImage {
		position: fixed;
		top: 0;
		right: -60rpx;
	}

	.normal-login-container {
		width: 100%;

		.logo-content {
			width: 100%;
			font-size: 21px;
			text-align: center;
			padding-top: 15%;

			image {
				border-radius: 4px;
			}

			.title {
				margin-left: 10px;
			}
		}

		.login-form-content {
			width: calc(100% - 30px);
			left: 15px;
			height: auto;
			background-image: url("/static/images/login/login2.png");
			background-size: cover;
			background-position: center;

			/* 添加模糊效果 */
			backdrop-filter: blur(5px);
			-webkit-backdrop-filter: blur(5px);
			/* 添加半透明遮罩以增强模糊效果 */
			background-color: rgba(255, 255, 255, 0.2);
			z-index: 9999;
			position: fixed;
			top: 200px;
			border-radius: 20px;
			box-shadow: 0px 6px 8px 1px rgba(179, 179, 179, 0.4);

			.login-top-View {
				width: 50%;
				height: auto;
				display: flex;
				justify-content: center;
			}

			.login-top {
				margin-top: 14px;
				width: 65px;
				height: auto;
				font-family: PingFang SC, PingFang SC;
				font-weight: 500;
				font-size: 16px;
				color: #F9765E;
				text-align: center;
				font-style: normal;
				text-transform: none;
			}

			.login-lin {
				width: 25px;
				height: 3px;
				background: #F9765E;
				margin-top: 5px;
				border-radius: 2px 2px 2px 2px;
			}

			.input-item {
				margin: 20px auto;
				background-color: #f5f6f7;
				height: 45px;
				border-radius: 20px;

				.icon {
					font-size: 38rpx;
					margin-left: 10px;
					color: #999;
				}

				.input {
					width: 100%;
					font-size: 14px;
					line-height: 20px;
					text-align: left;
					padding-left: 15px;
				}

			}

			.login-btn {
				margin-top: 40px;
				height: 45px;
			}

			.reg {
				margin-top: 15px;
			}


			.login-code {
				height: 38px;
				float: right;

				.login-code-img {
					height: 38px;
					position: absolute;
					margin-left: 10px;
					width: 200rpx;
				}
			}
		}
	}



	.accountView {
		width: 100%;
		height: auto;
		padding: 50rpx 46rpx;

		font-family: PingFang SC, PingFang SC;
		font-weight: 500;
		font-size: 28rpx;
		color: #656565;
		font-style: normal;
		text-transform: none;

		.addountInputView {
			width: 100%;
			height: 96rpx;
			background: #F5F5F5;
			border-radius: 50rpx 50rpx 50rpx 50rpx;
			margin-top: 16rpx;
			margin-bottom: 48rpx;

			.uInput {
				height: 96rpx;
				width: 100%;
			}
		}

		.addountTextView {
			margin-left: 10rpx;
		}

		.addountButton {
			width: 100%;
			height: 96rpx;
			box-shadow: 0rpx 12rpx 16rpx 2rpx rgba(207, 118, 78, 0.4);
			border-radius: 50rpx 50rpx 50rpx 50rpx;
			text-align: center;
			color: #fff;
			line-height: 96rpx;
			background: rgba(255, 173, 110, 0.8);
			font-family: PingFang SC, PingFang SC;
			font-weight: 600;
			font-size: 32rpx;
			color: #FFFFFF;
			font-style: normal;
			text-transform: none;
		}

		.addountButtonBack {
			background: linear-gradient(94deg, #FFAD6E 0%, #F8725C 100%) !important;
		}

		.xieyi {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: left !important;
			color: #333;
			margin-top: 20px;
			height: auto;

			.uni-data-checklist {
				flex: 0 !important;
			}

			.text-blue2 {
				margin-left: -45rpx;
				color: #CBCBCB;
			}

		}

	}
</style>