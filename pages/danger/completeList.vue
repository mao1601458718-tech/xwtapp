<template>
	<view class="paveView">
		<view class="popupInput">
			<u--input class="uInput" borde="none" shape="circle" clearable placeholder="请输入项目名称"
				v-model="dataForm.placeName" @change="clickSearchValue"></u--input>
		</view>
		<scroll-view scroll-y refresher-background="#f1f1f1" class="scrollView" @scrolltolower="onreachBottom"
			:refresher-threshold="105" :refresher-enabled="true" :refresher-triggered="refreshObj.refresherTriggered"
			@refresherrefresh="refresherrefresh" @refresherrestore="refresherrestore" @refresherabort="refresherabort">
			<view class="faultView" v-for="(item,index) in buildingList" :key="index" @click="goPage(item)">
				<view class="contentTitle">
					<view class="contentTitle1">{{item.standardName}}</view>
					<!-- <view class="contentTitle2">
						时间
					</view> -->
				</view>
				<view class="contentLi">
					<view class="contentLi1">联系人：{{item.contacts}}</view>
					<view class="contentLi2">联系电话：{{item.phone}}</view>
				</view>
				<view class="contentLi">
					<view class="contentLi1">排查人：{{item.investigator}}</view>
					<view class="contentLi2">排查类型：{{item.placeTypeDesc}}</view>
				</view>
				<view class="contentLi">
					<view class="contentLi1">位置：{{item.address}}</view>
				</view>
				<view class="contentBottom">
					<view class="textBottom1" @click.stop="removePlace(item)"><u-icon name="trash-fill" color="#FA8161"
							size="20"></u-icon>删除
					</view>
					<view class="textBottom2" @click.stop="troubleshoot(item)"><u-icon name="edit-pen-fill"
							color="#2979ff" size="20"></u-icon>待排查</view>
				</view>
			</view>

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
		findPlaceList,
		savePlace
	} from '@/api/danger/danger.js'
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
					"orderCols": ["createTime"],
					"orderDesc": true,
					"placeName": "",
					"investigationStatuss": [2, 3]
				}
			};
		},
		onShow() {
			this.getFindBybuildingList(true);
		},
		methods: {
			goPage(item) {
				this.$tab.navigateTo("/pages/danger/addDanger?item=" + JSON.stringify(item))
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
				this.dataForm.placeName = "";

				this.getFindBybuildingList(true);
			},
			getFindBybuildingList(empty) {
				if (empty) {
					this.refreshObj.sType = 'nomore';
					this.dataForm.pageIndex = 1;
					this.buildingList = [];
				}
				findPlaceList(this.dataForm).then(res => {
					if (res.listObj) {
						this.buildingList.push(...res.listObj);
						if (this.buildingList.length < res.totalCount) {
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
			},
			troubleshoot(item) {
				uni.showModal({
					title: '提示',
					content: '确认将重新排查该项目？',
					success: (res) => {
						if (res.confirm) {
							let data = {
								"id": item.id,
								"investigationStatus": 4
							}
							savePlace(data).then(res => {
								uni.$u.toast('操作成功')
								this.getFindBybuildingList(true);
							})
						}
					}
				});
			},
			removePlace(item) {
				uni.showModal({
					title: '提示',
					content: '确认删除当前排查？',
					success: (res) => {
						if (res.confirm) {
							let data = {
								"id": item.id,
								"status": 99
							}
							savePlace(data).then(res => {
								uni.$u.toast('删除成功')
								this.getFindBybuildingList(true);
							})
						}
					}
				});
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

	.contentBottom {
		padding: 20rpx 0 0 0;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: 1rpx solid #eee;

		.textBottom1 {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 26rpx;
			color: #FA8161;
		}

		.textBottom2 {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 26rpx;
			color: #3880ff;
		}
	}
</style>