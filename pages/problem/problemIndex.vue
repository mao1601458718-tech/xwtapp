<template>
	<view class="paveView">
		<view class="popupInput">
			<u--input class="uInput" borde="none" shape="circle" clearable placeholder="请输入项目名称" v-model="searchValue"
				@change="clickSearchValue"></u--input>
		</view>

		<scroll-view scroll-y refresher-background="#f1f1f1" class="scrollView" @scrolltolower="onreachBottom"
			:refresher-threshold="105" :refresher-enabled="true" :refresher-triggered="refreshObj.refresherTriggered"
			@refresherrefresh="refresherrefresh" @refresherrestore="refresherrestore" @refresherabort="refresherabort">
			<uni-swipe-action>
				<!-- 使用插槽 （请自行给定插槽内容宽度）-->

				<uni-swipe-action-item class="faultView" v-for="(item,index) in problemList" :key="index"
					:threshold="50">
					<view @click="goPage(item)" class="contentTab">
						<view class="contentTitle">
							<view class="contentTitle1">{{item.deviceSysName}}</view>
							<!-- <view class="contentTitle2">
							时间
						</view> -->
						</view>
						<view class="contentLi">
							<view class="contentLi1">添加时间：{{item.createTime}}</view>
						</view>
					</view>

					<template v-slot:right>
						<view class="removeView" @click="removeView(item)">
							<view class="removeView1"></view>
							<view class="removeView2">删除</view>
						</view>
					</template>
				</uni-swipe-action-item>
			</uni-swipe-action>
			<view class="scrollBottom">
				<u-loadmore :status="refreshObj.sType" bg-color="#f1f1f1" icon-type="flower" />
			</view>
		</scroll-view>

		<view class="bottomView">
			<view class="viewLeft" @click="goPage()">添 加</view>
		</view>
	</view>
</template>

<script>
	import {
		findRiskProblemList,
		delRiskProblemItem
	} from '@/api/safety/safety.js'

	export default {
		data() {
			return {
				searchValue: "",
				refreshObj: {
					refresherTriggered: false,
					_refresherTriggered: false,
					sType: 'nomore',
					iconType: 'flower',
					status: true,
				},
				dataForm: {
					"checkProjectId": 22,
					"projectId": 495,
					"pageIndex": 1,
					"pageSize": 15,
					"orderCols": ["createTime"],
					"orderDesc": true
				},
				problemList: []
			};
		},
		onLoad() {
			this.dataForm.checkProjectId = this.$store.state.user.checkProject.id;
			this.dataForm.projectId = this.$store.state.user.projectId;
		},
		onShow() {
			this.getFindRiskProblemList(true);
		},
		methods: {
			goPage(item) {
				if (item) {
					this.$tab.navigateTo("/pages/safety/problem/problemInfo?item=" + JSON.stringify(item))
				} else {
					this.$tab.navigateTo("/pages/safety/problem/problemInfo")
				}
			},
			onreachBottom(e) {
				if (this.refreshObj.status) {
					this.refreshObj.sType = 'loading';
					this.refreshObj.status = false;
					this.getFindRiskProblemList(false);
				}
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
				this.datetimeValue = "";
				this.dataForm.searchCheckDate = "";
				this.dataForm.deviceTypeName = "";

				this.getFindRiskProblemList(true);
			},
			removeView(item) {
				let data = {
					"id": item.id
				}
				uni.showModal({
					title: '提示',
					content: '确定删除该记录？',
					success: (res) => {
						if (res.confirm) {
							delRiskProblemItem(data).then(res => {
								if (res.status == 200) {
									this.getFindRiskProblemList(true);
								}
							});
						}
					}
				});
			},
			getFindRiskProblemList(empty) {
				if (empty) {
					this.refreshObj.sType = 'nomore';
					this.dataForm.pageIndex = 1;
					this.problemList = [];
				}
				findRiskProblemList(this.dataForm).then(res => {
					if (res.listObj) {
						this.problemList.push(...res.listObj);
						if (this.problemList.length < res.totalCount) {
							this.refreshObj.status = true;
							this.dataForm.pageIndex++;
							this.refreshObj.sType = 'loadmore';
						} else {
							this.refreshObj.status = false;
							this.refreshObj.sType = 'nomore';
						}
					}
				}).finally(() => {
					this.refreshObj.refresherTriggered = false; //触发onRestore，并关闭刷新图标
					this.refreshObj._refresherTriggered = false;
				});

			},
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
		height: calc(100% - 100rpx);
		padding: 0 30rpx 0 30rpx;

		.scrollBottom {
			height: 300rpx;
			padding: 10rpx 0 0 0;
			width: 100%;
		}

		.faultView {
			width: 100%;
			height: auto;
			background: #FFFFFF;
			border-radius: 12rpx;
			margin-bottom: 20rpx;

			.contentTab {
				width: 100%;
				height: auto;
				background: #FFFFFF;
				border-radius: 12rpx;
				padding: 0 24rpx 24rpx 24rpx;
				// margin-bottom: 20rpx;
			}

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

	.removeView {
		height: 100%;
		width: 120rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;

		.removeView1 {
			width: 6rpx;
			height: 100%;
			background-color: #ffffff;
		}

		.removeView2 {
			display: flex;
			justify-content: center;
			align-items: center;
			width: calc(100% - 6rpx);
			height: 100%;
			background-color: #ff5500;
		}
	}
</style>