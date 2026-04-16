<template>
	<view class="container">
		<!-- 页面头部 -->
		<view class="header" :key="index">
			<view class="headerTab" @click="changePage(0)">
				<view class="headerTitle " :class="swiperCurrent==0?'color':''">待处理</view>
				<view class="headerTitle">
					<view class="headerLine " :class="swiperCurrent==0?'background':''"></view>
				</view>
			</view>
			<view class="headerTab" @click="changePage(1)">
				<view class="headerTitle" :class="swiperCurrent==1?'color':''">已完成</view>
				<view class="headerTitle">
					<view class="headerLine" :class="swiperCurrent==1?'background':''"></view>
				</view>
			</view>
		</view>

		<!-- 设备列表 -->
		<swiper class="swiperView" :current="swiperCurrent" :indicator-dots="false" :autoplay="false"
			@change="changeSwiper" :disable-touch="true">
			<swiper-item class="swiperTtem">
				<fault-list ref="faultListRef"></fault-list>
			</swiper-item>
			<swiper-item>
				<complete-fault-list ref="completeFaultListRef"></complete-fault-list>
			</swiper-item>
		</swiper>

		<view class="bottomView">
			<view class="viewLeft" @click="goPage(null)">添 加</view>
		</view>
	</view>
</template>

<script>
	import {
		findFaultRepairRecordList
	} from '@/api/maintenance/findFault.js'
	import faultList from "./faultList.vue"
	import completeFaultList from "./completeFaultList.vue"
	export default {
		components: {
			faultList,
			completeFaultList
		},
		data() {
			return {
				swiperCurrent: 0,
				index: 0,
			};
		},
		onReady() {

		},
		onShow() {
			this.$nextTick(() => {
				this.$refs.faultListRef.getFindFaultRepairRecordList(true);
				this.$refs.completeFaultListRef.getFindFaultRepairRecordList(true);
			});

		},
		methods: {

			changeSwiper(current, source) {
				this.swiperCurrent = current.detail.current
				this.index++;
			},
			goPage(item) {
				this.$tab.navigateTo("/pages/management/planFault/addFaultInfo")
			},
			changePage(type) {
				this.swiperCurrent = type
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
		// margin-bottom: 30rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #fff;
		height: 80rpx;
		border-top: 1rpx solid #eee;
		padding: 0 20rpx;

		.headerTab {
			margin: 0 50rpx;

			font-family: PingFang SC, PingFang SC;
			font-weight: 400;
			font-size: 30rpx;
			color: #999999;
			text-align: left;
			font-style: normal;
			text-transform: none;

			.color {
				color: #FA8161;
			}

			.background {
				background: #FA8161;
			}

			.headerTitle {
				width: 100%;
				height: auto;
				display: flex;
				justify-content: center;
			}

			.headerLine {
				width: 28rpx;
				height: 6rpx;
				margin-top: 10rpx;
				border-radius: 4rpx 4rpx 4rpx 4rpx;
			}
		}
	}

	.swiperView {
		height: calc(100% - 170rpx);
		width: 100%;
		padding: 0 30rpx;

		.swiperTtem {
			height: 100%;
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
		justify-content: space-between;

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