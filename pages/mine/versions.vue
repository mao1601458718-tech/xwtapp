<template>
	<view class="pageView">
		<view class="logoView">
			<image src="/static/logo.png" class="logo"></image>
		</view>
		<view class="versions">
			消维通 2.0.9.微服务版
		</view>

		<view class="privacy" @click="goPrivacy">
			隐私政策
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			goPrivacy() {
				this.$tab.navigateTo("/pages/mine/privacy")
			}
		}
	}
</script>

<style scoped lang="scss">
	.pageView {
		width: 100%;
		height: 100vh;

		.logoView {
			height: 300rpx;
			display: flex;
			justify-content: center;
			align-items: center;

			.logo {
				width: 150rpx;
				height: 150rpx;
			}
		}

		.versions {
			width: 100%;
			height: auto;
			text-align: center;
		}

		.privacy {
			width: 100%;
			height: 60rpx;
			background-color: #fff;
			margin-top: 50rpx;
			line-height: 60rpx;
			padding: 0 0 0 40rpx;
		}
	}
</style>