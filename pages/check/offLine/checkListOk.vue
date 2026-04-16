<template>
	<scroll-view class="scrollView" scroll-y>
		<view class="faultView" v-for="(item,index) in checkTypeList" :key="index" @click="goPage(item)">
			<view class="contentTitle">
				<view class="contentTitle1">检测编号：{{item.deviceCheckItemCode}}</view>
				<view class="contentTitle2 statusType2 contentTitle3" @click.stop="removeCheckItem(item)">
					<u-icon name="trash" color="#FF5E5E"></u-icon>
					删除
				</view>
			</view>
			<view class="contentLi">
				<view class="contentLi1">设备名称：{{item.deviceTypeName}}</view>
			</view>
			<view class="contentLi">
				<view class="contentLi1">检测时间：{{item.createTime}}</view>
			</view>
			<view class="contentLi">
				<view class="contentLi1 u-line-1">
					位置：{{item.buildingName||""}}{{item.buildingFloorName||""}}{{item.address||""}}</view>
			</view>
			<view class="contentLi">
				<view class="contentLi1">检测结果：
					<text :class="'color'+item.checkResult">{{item.checkResult === 1 ? '合格' : '不合格'}}</text>
					<text class="color2" v-if="!item.id">离线数据未上传</text>
				</view>
			</view>
		</view>
	</scroll-view>
</template>

<script>
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

				checkTypeList: [],
			};
		},
		onLoad() {

		},
		methods: {

			removeCheckItem(data) {
				uni.showModal({
					title: '提示',
					content: '确定删除吗？',
					success: (res) => {
						if (res.confirm) {
							let getStorage = uni.getStorageSync('projectOffLine_' + this.$store.state.user
								.checkProject.id);
							let dataFormId = data.tempId || data.id;

							if (getStorage && getStorage.checkPointList) {
								getStorage.checkPointList.forEach((item, index) => {
									let itemId = item.id || item.tempId;
									if (dataFormId === itemId) {
										getStorage.checkPointList.splice(index, 1)
									}
								})
							}
							if (getStorage && getStorage.checkRecordList) {
								getStorage.checkRecordList = getStorage.checkRecordList.filter(recordItem => {
									let itemId = recordItem.checkPointId || recordItem
										.tempcheckPointId;
									return dataFormId != itemId; // 保留不匹配的
								});
							}
							uni.setStorageSync('projectOffLine_' + this.$store.state.user.checkProject.id,
								getStorage);
							this.getFindCheckPointList();
						}
					}
				});
			},
			getFindCheckPointList() {
				this.checkTypeList = [];
				let getStorage = uni.getStorageSync('projectOffLine_' + this.$store.state.user.checkProject.id);
				if (getStorage && getStorage.checkPointList) {
					getStorage.checkPointList.forEach((item) => {
						if (item.deviceSysId == this.checkInfo.id && item.checkResult == 1) {
							this.checkTypeList.push(item);
						}
					})
				}
			},
			goPage(item) {
				this.$tab.navigateTo("/pages/check/offLine/updateCheckInfo?item=" + JSON.stringify(item))
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
								margin-right: 20rpx;
							}

							.color2 {
								color: #FF5E5E;
								margin-right: 20rpx;
							}
						}
					}
				}
			}
		}
	}
</style>