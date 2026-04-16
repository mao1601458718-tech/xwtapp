<template>
	<view class="paveView">
		<view class="popupInput">
			<u--input class="uInput" borde="none" shape="circle" clearable placeholder="请输入项目名称"
				v-model="dataForm.checkName" @change="clickSearchValue"></u--input>
		</view>
		<scroll-view scroll-y class="scrollView" refresher-background="#f1f1f1" @scrolltolower="onreachBottom"
			:refresher-threshold="105" :refresher-enabled="true" :refresher-triggered="refreshObj.refresherTriggered"
			@refresherrefresh="refresherrefresh" @refresherrestore="refresherrestore" @refresherabort="refresherabort">
			<view class="faultView" v-for="(item,index) in checkList" :key="index">
				<view class="contentTitle">
					<view class="contentTitle1">检测项：</view>
					<view class="contentTitle2">
						{{item.checkName}}
					</view>
				</view>
				<view class="contentLi">
					<view class="contentLi1">等级：</view>
					<view class="contentLi2">{{item.grade}}</view>
				</view>
				<view class="contentLi">
					<view class="contentLi1">指导标准：</view>
					<view class="contentLi2">{{item.checkSpecification}}</view>
				</view>
			</view>
			<view class="uLoadmore">
				<u-loadmore :status="refreshObj.sType" bg-color="#f1f1f1" icon-type="flower" />
			</view>
		</scroll-view>
		<!-- <view class="bottomView">
			<view class="viewLeft" @click="goAddFacility()">添 加</view>
		</view> -->
	</view>
</template>

<script>
	import {
		findCheckItemList
	} from '@/api/project/project.js'
	export default {
		data() {
			return {
				checkList: [],
				refreshObj: {
					refresherTriggered: false,
					_refresherTriggered: false,
					sType: 'nomore',
					iconType: 'flower',
					status: true,
				},
				dataForm: {
					"pageIndex": 1,
					"pageSize": 15,
					"orderCols": ["grade"],
					"orderDesc": false,
					"deviceSysIds": "",
					"checkProjectId": "",
					"checkName": ""
				}
			};
		},
		onLoad() {
			this.dataForm.checkProjectId = this.$store.state.user.checkProject.id;
			this.dataForm.deviceSysIds = this.$store.state.user.checkProject.sysTypeIdList;
			this.getFindCheckItemList(true);
		},
		methods: {
			// goPage(item) {
			// 	this.$tab.navigateTo("/pages/management/buildings/addBuilding?item=" + JSON.stringify(item))
			// },
			clickSearchValue() {
				this.getFindCheckItemList(true);
			},
			onreachBottom(e) {
				if (this.refreshObj.status) {
					this.refreshObj.sType = 'loading';
					this.refreshObj.status = false;
					this.getFindCheckItemList(false);
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
				this.getFindCheckItemList(true);
			},
			getFindCheckItemList(empty) {
				if (empty) {
					this.refreshObj.sType = 'nomore';
					this.dataForm.pageIndex = 1;
					this.checkList = [];
				}
				findCheckItemList(this.dataForm).then(res => {
					if (res.listObj) {
						this.checkList.push(...res.listObj);
						if (this.checkList.length < res.totalCount) {
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


				.contentTitle1 {
					width: 120rpx;
					height: auto;
					font-family: PingFang SC, PingFang SC;
					font-weight: 500;
					font-size: 28rpx;
					color: #e75555;
					font-style: normal;
					text-transform: none;
				}

				.contentTitle2 {
					width: calc(100% - 120rpx);
					font-family: PingFang SC, PingFang SC;
					font-weight: 600;
					font-size: 28rpx;
					color: #333333;
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

				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 24rpx;
				color: #999999;
				text-align: left;
				font-style: normal;
				text-transform: none;

				.contentLi1 {
					width: 120rpx;
					display: flex;

					align-items: center;
				}

				.contentLi2 {
					width: calc(100% - 120rpx);
					color: #000000;
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