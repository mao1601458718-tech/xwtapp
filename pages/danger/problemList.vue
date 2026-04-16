<template>
	<view class="paveView">
		<view style="height: 30rpx;"></view>
		<scroll-view scroll-y class="scrollView" :key="scrollIndex">
			<view class="faultView" v-for="(item,index) in problemList" :key="index" @click="goPage(item)">
				<view class="contentTitle">
					<view class="contentTitle1">{{item.problem}}</view>
					<!-- <view class="contentTitle2">
						时间
					</view> -->
				</view>
				<view class="contentLi">
					<view class="contentLi1">排查对象：{{item.placeName}}</view>
				</view>
				<view class="contentLi">
					<view class="contentLi1">对象类型：{{item.deviceSysName}}</view>
				</view>
				<view class="contentLi">
					<view class="contentLi2">排查类目：{{item.deviceTypeName}}</view>
				</view>
				<view class="contentLi">
					<view class="contentLi1">所属子项：{{item.deviceCheckItemName}}</view>
				</view>
			</view>
			<view class="uLoadmore">
				<u-loadmore :status="refreshObj.sType" bg-color="#f1f1f1" icon-type="flower" />
			</view>
		</scroll-view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				refreshObj: {
					refresherTriggered: false,
					_refresherTriggered: false,
					sType: 'nomore',
					iconType: 'flower',
					status: true,
				},
				problemList: [],
				scrollIndex: 0
			};
		},
		onLoad(data) {
			let item = JSON.parse(data.item)
			this.problemList = item.problemList
			uni.$on('pageData', (data) => {
				if (data.problemData.id) {
					let index = this.problemList.findIndex(parameter => parameter.id === data.problemData.id);
					console.log(index)
					this.problemList[index] = data.problemData;
				} else {
					this.problemList.push(data.problemData)
				}
				this.scrollIndex++;
			});
		},
		onUnload() {
			// 页面卸载时移除监听

			uni.$off('pageData');
		},
		methods: {
			goPage(item) {
				this.$tab.navigateTo("/pages/danger/problemPage?item=" + JSON.stringify(item))
			}
		}
	}
</script>

<style lang="scss" scoped>
	.paveView {
		width: 100%;
		height: 100vh;


		.popupInput {
			height: 100rpx;
			display: flex;
			align-items: center;
			padding: 0 30rpx;

			.uInput {
				background-color: #fff;
			}
		}
	}


	.scrollView {
		width: 100%;
		height: calc(100% - 1rpx);
		padding: 0 30rpx 0 30rpx;

		.scrollBottom {
			height: 200rpx;
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
					width: calc(100% - 145rpx);
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
				}


				// .contentLi2 {}
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