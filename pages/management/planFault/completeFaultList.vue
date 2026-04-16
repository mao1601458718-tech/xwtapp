<template>
	<scroll-view scroll-y refresher-background="#f1f1f1" class="scrollView" @scrolltolower="onreachBottom"
		:refresher-threshold="105" :refresher-enabled="true" :refresher-triggered="refreshObj.refresherTriggered"
		@refresherrefresh="refresherrefresh" @refresherrestore="refresherrestore" @refresherabort="refresherabort">
		<view style="height: 30rpx;"></view>
		<uni-swipe-action>
			<!-- 使用插槽 （请自行给定插槽内容宽度）-->

			<uni-swipe-action-item v-for="(item,index) in findFaultList" :key="index" :threshold="50">
				<view class="faultView" @click="goPage(item)">
					<view class="contentTitle">
						<view class="contentTitle1">{{item.deviceName}}</view>
						<view class="contentTitle2 statusType2">
							{{item.workOrderStatusTxt}}
						</view>
					</view>
					<view class="contentLi">
						<view class="contentLi1">项目名称：{{item.checkProjectName}}</view>
					</view>
					<view class="contentLi">
						<view class="contentLi1">创建人：{{item.createUserName}}</view>
						<view class="contentLi2">手机号：{{item.createUserIdPhone}}</view>
					</view>
					<view class="contentLi">
						<view class="contentLi1">最后修改时间：{{item.lastModifyTime}}</view>
					</view>
					<view class="contentView">
						<text class="contentView1">描述：</text>
						<text class="contentView2 u-line-1">{{item.faultDescription}}</text>
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
		<view class="uLoadmoreBak">
			<u-loadmore :status="refreshObj.sType" bg-color="#f1f1f1" icon-type="flower" />
		</view>
	</scroll-view>
</template>

<script>
	import {
		findFaultRepairRecordList,
		updateFaultRepairRecord
	} from '@/api/maintenance/findFault.js'

	export default {
		data() {
			return {
				swiperCurrent: 0,
				findFaultList: [],
				refreshObj: {
					refresherTriggered: false,
					_refresherTriggered: false,
					sType: 'nomore',
					iconType: 'flower',
					status: true,
				},
				dataForm: {
					"checkProjectId": "",
					"projectId": "",
					"pageIndex": 1,
					"pageSize": 15,
					"workOrderStatusArr": [4]
				},

			};
		},

		methods: {
			onreachBottom(e) {
				if (this.refreshObj.status) {
					this.refreshObj.sType = 'loading';
					this.refreshObj.status = false;
					this.getFindFaultRepairRecordList(false);
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

				this.getFindFaultRepairRecordList(true);
			},
			goPage(item) {
				this.$tab.navigateTo("/pages/management/planFault/faultInfo?item=" + JSON.stringify(item))
			},
			removeView(item) {
				let data = {
					"id": item.id,
					"status": 99
				}
				uni.showModal({
					title: '提示',
					content: '确定删除该记录？',
					success: (res) => {
						if (res.confirm) {
							updateFaultRepairRecord(data).then(res => {
								if (res.status == 200) {
									this.getFindFaultRepairRecordList(true);
								}
							});
						}
					}
				});
			},
			getFindFaultRepairRecordList(empty) {
				this.dataForm.checkProjectId = this.$store.state.user.checkProject.id;
				this.dataForm.projectId = this.$store.state.user.projectId;
				if (empty) {
					this.refreshObj.sType = 'nomore';
					this.dataForm.pageIndex = 1;
					this.findFaultList = [];
				}
				findFaultRepairRecordList(this.dataForm).then(res => {
					if (res.object && res.object.listObj) {
						this.findFaultList.push(...res.object.listObj);
						if (this.findFaultList.length < res.object.totalCount) {
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

			}
		}
	};
</script>

<style scoped lang="scss">
	.container {
		width: 100%;
		background-color: #f0f2f5;
		height: 100%;
	}


	.scrollView {
		width: 100%;
		height: 100%;

		.faultView {
			width: 100%;
			height: auto;
			background: #FFFFFF;
			border-radius: 12rpx;
			margin-bottom: 20rpx;
			padding: 0 0 24rpx 0;

			.contentTitle {
				width: 100%;
				min-height: 80rpx;
				height: auto;
				padding: 10rpx 0;
				border-bottom: 1px solid #F5F5F5;
				display: flex;
				align-items: center;
				justify-content: space-between;
				position: relative;

				padding: 24rpx 0 24rpx 24rpx;

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
					width: auto;
					height: auto;
					padding: 10rpx;
					font-family: PingFang SC, PingFang SC;
					font-weight: 400;
					font-size: 24rpx;
					color: #FFFFFF;
					text-align: right;
					font-style: normal;
					text-transform: none;
					position: absolute;
					right: 0;
					top: 0;
				}

				.statusType1 {
					background: #6DA0F6;
					border-radius: 0rpx 12rpx 0rpx 12rpx;

					font-family: PingFang SC, PingFang SC;

				}

				.statusType2 {
					background: #FA8161;
					border-radius: 0rpx 12rpx 0rpx 12rpx;

				}
			}

			.contentLi {
				width: 100%;
				height: auto;
				padding: 10rpx 24rpx;
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

			.contentView {
				width: calc(100% - 48rpx);
				display: flex;
				margin-top: 10rpx;
				padding: 15rpx;
				margin-left: 24rpx;
				background-color: #F7F7F7;

				.contentView1 {
					width: 100rpx;
					font-size: 25rpx;
					color: #181818;

				}

				.contentView2 {
					font-size: 25rpx;
					color: #999999;
				}
			}

		}
	}

	.uLoadmoreBak {
		height: 250rpx;
		width: 100%;
		padding: 20rpx 0 0 0;
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