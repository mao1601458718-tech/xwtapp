<template>
	<view class="paveView">
		<view class="popupInput">
			<u--input class="uInput" borde="none" shape="circle" clearable placeholder="请输入项目名称"
				v-model="dataForm.deviceTypeName" @change="getFindCheckPointList(true)"></u--input>
		</view>

		<scroll-view class="scrollView" scroll-y refresher-background="#f1f1f1" @scrolltolower="onreachBottom"
			:refresher-threshold="105" :refresher-enabled="true" :refresher-triggered="refreshObj.refresherTriggered"
			@refresherrefresh="refresherrefresh" @refresherrestore="refresherrestore" @refresherabort="refresherabort">

			<uni-swipe-action>
				<!-- 使用插槽 （请自行给定插槽内容宽度）-->

				<uni-swipe-action-item v-for="(item,index) in pointList" :key="index" :threshold="50">
					<view class="faultView" @click="goPage(item)">
						<view class="contentTitle">
							<view class="contentTitle1">{{item.deviceTypeName}}</view>
							<view class="contentTitle2">
								{{item.createTimeDesc}}
							</view>
						</view>
						<view class="contentLi">
							<view class="contentLi1">设备编码：{{item.deviceCode}}</view>
							<view class="contentLi2">数量：{{item.checkNum}}</view>
						</view>
						<view class="contentLi">
							<view class="contentLi1">所在建筑：{{item.buildingName}}</view>
							<view class="contentLi2">楼层：{{item.floorName}}</view>
						</view>
						<view class="contentLi">
							<view class="contentLi3">所在位置：{{item.address}}</view>
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
	</view>
</template>

<script>
	import {
		findCheckPointList,
		modifyCheckPoint
	} from '@/api/maintenance/maintenance'

	export default {
		data() {
			return {
				pointList: [],
				pointForm: "",
				dataForm: {
					"checkProjectId": "",
					"projectId": "",
					"pageIndex": 1,
					"pageSize": 15,
					"deviceSysId": "",
					"deviceTypeName": "",
				},
				refreshObj: {
					refresherTriggered: false,
					_refresherTriggered: false,
					sType: 'nomore',
					iconType: 'flower',
					status: true,
				},
			};
		},
		onLoad(data) {
			this.dataForm.checkProjectId = this.$store.state.user.checkProject.id;
			this.dataForm.projectId = this.$store.state.user.projectId;
			if (data.item) {
				this.pointForm = JSON.parse(data.item);
				this.dataForm.deviceSysId = this.pointForm.deviceSysId
			}

			this.getFindCheckPointList(true);
		},
		methods: {
			onreachBottom(e) {
				if (this.refreshObj.status) {
					this.refreshObj.sType = 'loading';
					this.refreshObj.status = false;
					this.getFindCheckPointList(false);
				}
			},
			removeView(item) {
				let data = {
					"checkPointId": item.id,
					"status": 99
				}
				uni.showModal({
					title: '提示',
					content: '确定删除该记录？',
					success: (res) => {
						if (res.confirm) {
							modifyCheckPoint(data).then(res => {
								if (res.status == 200) {
									this.getFindCheckPointList(true);
								}
							});
						}
					}
				});
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
				this.dataForm.deviceTypeName = "";
				this.getFindCheckPointList(true);
			},
			getFindCheckPointList(empty) {
				if (empty) {
					this.refreshObj.sType = 'nomore';
					this.dataForm.pageIndex = 1;
					this.pointList = [];
				}
				findCheckPointList(this.dataForm).then(res => {
					if (res.listObj) {
						this.pointList.push(...res.listObj);
						if (this.pointList.length < res.totalCount) {
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
			goPage(item) {
				this.$tab.navigateTo("/pages/management/facility/addFacility?item=" + JSON.stringify(item))
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
			height: 50rpx;
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
					width: calc(100% - 285rpx);
					height: auto;
					font-family: PingFang SC, PingFang SC;
					font-weight: 500;
					font-size: 28rpx;
					color: #333333;
					font-style: normal;
					text-transform: none;
				}

				.contentTitle2 {
					width: 285rpx;
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
					width: calc(100% - 120rpx);
				}


				.contentLi2 {
					width: 120rpx;
				}
			}
		}
	}

	.removeView {
		height: calc(100% - 24rpx);
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