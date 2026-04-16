<template>
	<view class="workContainer">
		<view class="topView">
			<view class="top"></view>
			<view class="topTitle">
				<view class="topTitle1">消息</view>
				<view class="topTitle2" @click="allRead()">
					<image class="topImg" src="/static/images/eliminate.png"></image>
					<text class="topText">清除未读</text>
				</view>
			</view>
			<view class="topView2">
				<view class="top2TextView">
					<view class="top2Text " :class="frameOpen==0?'atTop2Text':''" @click="atFrameOpen(0)">未读</view>
					<view class="top2Line" v-if="frameOpen==0"></view>
				</view>
				<view class="top2TextView">
					<view class="top2Text" :class="frameOpen==1?'atTop2Text':''" @click="atFrameOpen(1)">已读</view>
					<view class="top2Line" v-if="frameOpen==1"></view>
				</view>
			</view>
			<view class="searchView">
				<u--input class="uInput" borde="none" shape="circle" clearable placeholder="请输入标题" v-model="searchValue"
					@change="clickSearchValue"></u--input>
			</view>

			<view class="topIconView">
				<view class="iconView" @click="atNoticeAttribute(1)">
					<view class="iconView1">
						<image class="iconImg" src="/static/images/msg/msg2.png"></image>
						<!-- <view class="iconSum">
							8
						</view> -->
					</view>
					<view class="iconView2 " :class="noticeAttribute==1?'atIconView2':''">系统消息</view>
					<view class="iconView3">
						<view class="iconLine" v-if="noticeAttribute==1"></view>
					</view>
				</view>
				<view class="iconView" @click="atNoticeAttribute(2)">
					<view class="iconView1" style="background: linear-gradient( 159deg, #FF9B4E 0%, #FFBF79 100%);">
						<image class="iconImg" src="/static/images/msg/msg1.png"></image>
						<!-- <view class="iconSum">8</view> -->
					</view>
					<view class="iconView2 " :class="noticeAttribute==2?'atIconView2':''">通知信息</view>
					<view class="iconView3">
						<view class="iconLine" v-if="noticeAttribute==2"></view>
					</view>
				</view>
			</view>
		</view>

		<swiper class="swiperView" :current="swiperCurrent" :indicator-dots="false" :autoplay="false"
			@change="changeSwiper">
			<swiper-item class="swiperTtem">
				<system-msg ref="systemMsgRef" :frameOpen="frameOpen" :noticeAttribute="noticeAttribute"></system-msg>
			</swiper-item>
			<swiper-item class="swiperTtem">
				<notifier-msg ref="notifierMsgRef" :frameOpen="frameOpen"
					:noticeAttribute="noticeAttribute"></notifier-msg>
			</swiper-item>

		</swiper>
	</view>
</template>

<script>
	import {
		saveRead
	} from '@/api/project/project.js'
	import notifierMsg from "./msg/notifierMsg.vue"
	import systemMsg from "./msg/systemMsg.vue"
	export default {
		components: {
			notifierMsg,
			systemMsg
		},
		data() {
			return {
				swiperCurrent: 1,
				searchValue: "",
				frameOpen: 0,
				noticeAttribute: 2,
				index: 0,
			}
		},
		onReady() {
			this.$refs.systemMsgRef.getMsg(this.frameOpen);
			this.$refs.notifierMsgRef.getMsg(this.frameOpen);
		},
		methods: {
			clickSearchValue() {

				this.$refs.completeFaultListRef.getFindFaultRepairRecordList(true);
			},
			changeSwiper(current, source) {
				this.swiperCurrent = current.detail.current

				if (this.swiperCurrent == 0) {
					this.noticeAttribute = 1
				} else {
					this.noticeAttribute = 2
				}
			},
			atFrameOpen(item) {
				this.frameOpen = item;
				if (this.swiperCurrent == 0) {
					this.$refs.systemMsgRef.getMsg(this.frameOpen);
				} else {
					this.$refs.notifierMsgRef.getMsg(this.frameOpen);
				}
			},
			allRead() {
				let data = {
					"projectId": this.$store.state.user.projectId,
					"userId": this.$store.state.user.id,
					"frameOpen": 0
				}
				saveRead(data).then(res => {

				});
			},
			atNoticeAttribute(item) {
				this.noticeAttribute = item
				if (item == 1) {
					this.swiperCurrent = 0;
				} else {
					this.swiperCurrent = 1;
				}
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
				height: 104rpx;
				width: 100%;
			}

			.topTitle {
				display: flex;
				justify-content: space-between;
				width: 100%;
				height: 54rpx;
				align-items: center;
				padding: 0 30rpx;

				.topTitle1 {
					width: auto;
					height: 54rpx;
					font-family: MiSans, MiSans;
					font-weight: 600;
					font-size: 40rpx;
					color: #1B1B1B;
					text-align: left;
					font-style: normal;
					text-transform: none;
				}

				.topTitle2 {
					display: flex;
					align-items: center;
					width: auto;
					height: 42rpx;
					background: #FFFFFF;
					border-radius: 26rpx 26rpx 26rpx 26rpx;
					// opacity: 0.8;
					padding: 0 15rpx;

					.topText {
						height: 34rpx;
						font-family: PingFang SC, PingFang SC;
						font-weight: 400;
						font-size: 24rpx;
						color: #B3B3B3;
						text-align: left;
						font-style: normal;
						text-transform: none;
					}

					.topImg {
						width: 26rpx;
						height: 26rpx;
						margin-right: 10rpx;
					}
				}
			}
		}


		.topView2 {
			width: 100%;
			height: 56rpx;
			display: flex;
			justify-content: center;
			align-items: center;

			.top2TextView {
				margin: 0 24rpx;

				.top2Text {
					font-family: PingFang SC, PingFang SC;
					font-weight: 600;
					font-size: 32rpx;
					color: #808080;
					text-align: center;
					font-style: normal;
					text-transform: none;
				}

				.atTop2Text {
					font-family: PingFang SC, PingFang SC;
					font-weight: 600;
					font-size: 40rpx;
					color: #1B1B1B;
					text-align: center;
					font-style: normal;
					text-transform: none;
				}

				.top2Line {
					width: 64rpx;
					height: 12rpx;
					margin-top: -15rpx;
					background: linear-gradient(90deg, #FF9940 0%, rgba(254, 216, 163, 0) 100%);
					border-radius: 8rpx 0rpx 0rpx 2rpx;
				}
			}
		}

		.searchView {
			width: 100%;
			height: auto;
			padding: 0 30rpx;
			margin-top: 40rpx;

			.uInput {
				background-color: #fff;
			}
		}

		.topIconView {
			height: 206rpx;
			width: 100%;
			// margin-top: 40rpx;
			border-bottom: 2rpx solid #E3E3E3;
			padding: 44rpx 30rpx 0 30rpx;
			display: flex;

			.iconView {
				width: auto;
				height: auto;
				margin-right: 80rpx;

				.iconView1 {
					width: 92rpx;
					height: 92rpx;
					background: linear-gradient(154deg, #55D6C1 0%, #7FE8DB 100%);
					border-radius: 52rpx 52rpx 52rpx 52rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					position: relative;

					.iconImg {
						width: 56rpx;
						height: 56rpx;
					}

					.iconSum {
						position: absolute;
						right: -15rpx;
						top: 0;

						padding: 0 5rpx;
						min-width: 38rpx;
						min-height: 32rpx;
						background: #FF3D3D;
						border-radius: 16rpx 16rpx 16rpx 0rpx;
						border: 2rpx solid #FFFFFF;

						font-family: PingFang SC, PingFang SC;
						font-weight: 400;
						font-size: 22rpx;
						color: #FDFCFE;
						text-align: center;
						font-style: normal;
						text-transform: none;
					}
				}

				.iconView2 {
					margin-top: 15rpx;
					width: 92rpx;
					height: 34rpx;
					font-family: PingFang SC, PingFang SC;
					font-weight: 400;
					font-size: 24rpx;
					color: #4B4B4B;
					text-align: center;
					font-style: normal;
					text-transform: none;
				}

				.atIconView2 {
					font-family: PingFang SC, PingFang SC;
					font-weight: 500;
					font-size: 24rpx;
					color: #FC9867;
					text-align: left;
					font-style: normal;
					text-transform: none;
				}

				.iconView3 {
					width: 92rpx;
					height: 34rpx;
					display: flex;
					justify-content: center;
					padding: 10rpx 0 0 0;

					.iconLine {
						width: 36rpx;
						height: 8rpx;
						background: #FC9867;
						border-radius: 4rpx 4rpx 4rpx 4rpx;
					}

				}
			}
		}
	}

	.swiperView {
		width: 100%;
		height: calc(100% - 520rpx);
		padding: 20rpx 30rpx 0 30rpx;

		.swiperTtem {
			width: 100%;

			.scrollView {
				width: 100%;

				.msgView {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin: 40rpx 0;

					.msgIcon {
						width: 88rpx;
						height: 88rpx;
						background: #F7F7F7;
						border-radius: 52rpx 52rpx 52rpx 52rpx;
						display: flex;
						align-items: center;
						justify-content: center;

						.msgImg {
							width: 52rpx;
							height: 52rpx;
						}
					}

					.msgTitleView {
						width: calc(100% - 240rpx);
						height: 88rpx;

						.msgTitle {
							width: 100%;
							height: 44rpx;
							font-family: PingFang SC, PingFang SC;
							font-weight: 600;
							font-size: 32rpx;
							color: #1B1B1B;
							text-align: left;
							font-style: normal;
							text-transform: none;
						}

						.msgText {
							width: 100%;
							height: 44rpx;
							font-family: PingFang SC, PingFang SC;
							font-weight: 400;
							font-size: 24rpx;
							line-height: 44rpx;
							color: #808080;
							text-align: left;
							font-style: normal;
							text-transform: none;
						}
					}

					.msgTimeView {
						width: 112rpx;
						height: 28rpx;
						font-family: PingFang SC, PingFang SC;
						font-weight: 400;
						font-size: 20rpx;
						color: #808080;
						text-align: right;
						font-style: normal;
						text-transform: none;
					}
				}

				.scrollBottom {
					height: 100rpx;
					width: 100%;
				}
			}
		}
	}
</style>