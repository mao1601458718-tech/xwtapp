<template>
	<view class="paveView">
		<view class="popupInput">
			<u--input class="uInput" borde="none" shape="circle" clearable placeholder="请输入项目名称"
				v-model="dataForm.buildingName" @change="clickSearchValue"></u--input>
		</view>
		<scroll-view scroll-y refresher-background="#f1f1f1" class="scrollView" @scrolltolower="onreachBottom"
			:refresher-threshold="105" :refresher-enabled="true" :refresher-triggered="refreshObj.refresherTriggered"
			@refresherrefresh="refresherrefresh" @refresherrestore="refresherrestore" @refresherabort="refresherabort">


			<uni-swipe-action>
				<!-- 使用插槽 （请自行给定插槽内容宽度）-->

				<uni-swipe-action-item v-for="(item,index) in buildingList" :key="index" :threshold="50">
					<view class="faultView" @click="goPage(item)">
						<view class="contentTitle">
							<view class="contentTitle1">{{item.buildingName}}</view>
							<!-- <view class="contentTitle2">
								时间
							</view> -->
						</view>
						<view class="contentLi">
							<view class="contentLi1">占地面积：{{item.acreage}}㎡</view>
							<view class="contentLi2">建筑面积：{{item.buildingAcreage}}㎡</view>
						</view>
						<view class="contentLi">
							<view class="contentLi1">楼层：{{item.floorNumber}}</view>
							<view class="contentLi2">建筑高度：{{item.height}}M</view>
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



			<view class="uLoadmore">
				<u-loadmore :status="refreshObj.sType" bg-color="#f1f1f1" icon-type="flower" />
			</view>
		</scroll-view>

		<view class="bottomView">
			<view class="viewLeft" @click="goPage(null)">添 加</view>
		</view>
	</view>
</template>

<script>
	import {
		findBybuilding,
		deleteBuilding
	} from '@/api/maintenance/building.js'
	export default {
		data() {
			return {
				searchValue: "",
				totalCount: "",
				refreshObj: {
					refresherTriggered: false,
					_refresherTriggered: false,
					sType: 'nomore',
					iconType: 'flower',
					status: true,
				},
				buildingList: [],
				dataForm: {
					"projectId": this.$store.state.user.projectId,
					"checkProjectId": this.$store.state.user.checkProject.id,
					"pageIndex": 1,
					"pageSize": 15,
					"buildingName": ""
				},
			};
		},
		onShow() {
			this.getFindBybuildingList(true);
		},
		methods: {
			goPage(item) {
				this.$tab.navigateTo("/pages/management/buildings/addBuilding?item=" + JSON.stringify(item))
			},
			removeView(item) {
				let data = {
					ids: [item.id]
				}
				uni.showModal({
					title: '提示',
					content: '确定删除该建筑？',
					success: (res) => {
						if (res.confirm) {
							deleteBuilding(data).then(res => {
								if (res.status == 200) {
									this.getFindBybuildingList(true);
								}
							});
						}
					}
				});
			},
			onreachBottom(e) {
				if (this.refreshObj.status) {
					this.refreshObj.sType = 'loading';
					this.refreshObj.status = false;
					this.getFindPlanManagementList(false);
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
				this.dataForm.buildingName = "";

				this.getFindBybuildingList(true);
			},
			getFindBybuildingList(empty) {
				if (empty) {
					this.refreshObj.sType = 'nomore';
					this.dataForm.pageIndex = 1;
					this.buildingList = [];
				}
				findBybuilding(this.dataForm).then(res => {
					if (res.object && res.object.list) {
						this.buildingList.push(...res.object.list);
						if (this.buildingList.length < res.object.totalCount) {
							this.refreshObj.status = true;
							this.dataForm.pageIndex++;
							this.refreshObj.sType = 'loadmore';
						} else {
							this.refreshObj.status = false;
							this.refreshObj.sType = 'nomore';
						}
					}

					this.refreshObj.refresherTriggered = false; //触发onRestore，并关闭刷新图标
					this.refreshObj._refresherTriggered = false;
				})
			},
			clickSearchValue() {
				this.getFindBybuildingList(true);
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
		height: calc(100% - 100rpx);
		padding: 0 30rpx 0 30rpx;

		.scrollBottom {
			height: 200rpx;
			width: 100%;
		}

		.removeView {
			height: calc(100% - 20rpx);
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