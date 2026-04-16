<template>
	<view class="pageView">
		<view v-if="advertising">
			<view class="logView">
				<view class="logTab1">
					<image class="logIcon" src="/static/logo.png"></image>
				</view>

			</view>
			<view class="logView">
				<view class="logTab2">
					<view class="logText">欢迎使用消维通</view>
				</view>
			</view>
		</view>
		<view class="advertisingView" v-else>
			<view class="skip" @click="checkLogin()">
				<text>跳过(</text>
				<uni-countdown :showDay="false" :showHour="false" :showMinute="false" :filterShow="{}"
					:second="stopTime" @timeup="timeup()"></uni-countdown>
				<text>)</text>
			</view>
			<u--image v-if="advertisingFrom.fileUrl" :showLoading="true" :src="advertisingFrom.fileUrl" width="100%"
				height="100vh" @click="clickImg"></u--image>
			<video v-else class="videoView" :autoplay="true" :loop="true" :muted="true" :controls="false"
				:enable-progress-gesture="false" :object-fit="cover" :enable-play-gesture="false"
				src="/static/e01571d577bc95f10a85ec2701f43e16.mp4"></video>
		</view>
	</view>
</template>

<script>
	import {
		getToken
	} from '@/utils/auth'
	import {
		addAdvertisingOpen,
		selectAdvertising
	} from '@/api/project/project.js'

	export default {
		data() {
			return {
				advertising: true,
				advertisingFrom: "",
				stopTime: 5,
				systemInfo: "",
				timer: null // 👈 用于保存 setTimeout 的返回值
			}
		},
		onUnload() {
			if (this.timer) {
				clearTimeout(this.timer);
				this.timer = null; // 重置为 null，避免重复清除
			}
		},
		onLoad() {
			this.systemInfo = uni.getSystemInfoSync();
			// 清除可能存在的旧定时器（可选，防重复）
			if (this.timer) {
				clearTimeout(this.timer);
			}
			this.timer = setTimeout(() => {
				// 防止页面已销毁后执行
				if (!this.timer) return;

				// 延迟执行的代码
				if (this.advertising) {
					this.checkLogin();
				}
			}, 3000); // 1000 毫秒 = 1 秒
			// this.checkLogin()
			this.getSelectAdvertising();
		},
		methods: {
			getSelectAdvertising() {
				selectAdvertising().then(res => {
					if (res.status == 200) {
						this.advertisingFrom = res.obj
						if (this.advertisingFrom.stopTime) {
							this.advertising = false;
						}
						if (this.advertisingFrom.stopTime && this.advertisingFrom.stopTime > 2) {
							this.stopTime = this.advertisingFrom.stopTime;
						}
					} else {
						this.checkLogin();
					}
				}).catch(error => {
					// 任何请求失败（网络错误、4xx、5xx、服务停用等）都会进入这里
					console.error('请求广告数据失败:', error);
					this.checkLogin();
				});;
			},
			timeup() {
				this.checkLogin();
			},
			clickImg() {
				if (this.advertisingFrom.isSkip == 1 && this.advertisingFrom.skipUrl) {
					this.openExternalLink(this.advertisingFrom.skipUrl);
					let data = {
						advertisingId: this.advertisingFrom.id,
						advertisingType: this.systemInfo.appName + "_" + this.systemInfo.model + "_" + this.systemInfo
							.platform + "_" + this.systemInfo.hostLanguage + "_" + this.$store.state.user.id,
					}
					addAdvertisingOpen(data);
				}
			},
			openExternalLink(url) {
				// #ifdef APP-PLUS
				plus.runtime.openURL(url, (e) => {
					console.error('打开失败:', e.message);
					// 可选：失败时提示用户或尝试其他方式
				});
				// #endif

				// #ifdef H5
				window.open(url, '_blank');
				// #endif
			},
			checkLogin() {
				if (!getToken()) {
					this.$tab.reLaunch('/pages/login')
				} else {
					this.$tab.switchTab("/pages/index")
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.pageView {
		width: 100%;
		height: 100vh;
		background-color: #fff;

		.advertisingView {
			width: 100%;
			height: 100vh;
		}

		.skip {
			display: flex;
			justify-content: center;
			align-items: center;
			position: fixed;
			top: 96rpx;
			right: 60rpx;
			height: 50rpx;
			font-size: 28rpx;
			border: 2px solid #acacac;
			color: #717171;
			padding: 0 15rpx;
			border-radius: 15rpx;
			z-index: 9999;
		}

		.videoView {
			width: 100%;
			height: 100vh;
		}

		.logView {
			width: 100%;
			display: flex;
			justify-content: center;

			.logTab1 {
				width: auto;
				height: auto;
				position: fixed;
				top: 350rpx;

				.logIcon {
					width: 150rpx;
					height: 150rpx;
				}


			}

			.logTab2 {
				width: auto;
				height: auto;
				position: fixed;
				top: 500rpx;

				.logText {
					text-align: center;
					margin-top: 40rpx;
					font-size: 28rpx;
					font-weight: 600;
				}
			}
		}


	}
</style>