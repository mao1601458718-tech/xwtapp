<template>
	<view class="pageView">

		<scroll-view scroll-y refresher-background="#f1f1f1" class="contentView" @scrolltolower="onreachBottom"
			:refresher-threshold="105" :refresher-enabled="true" :refresher-triggered="refreshObj.refresherTriggered"
			@refresherrefresh="refresherrefresh" @refresherrestore="refresherrestore" @refresherabort="refresherabort">


			<view class="contentTab" v-for="(item,index) in planList" :key="index" @click="goPlan(item)">
				<view class="contentTitle">
					<view class="contentTitle1">{{item.planName}}</view>
					<view class="contentTitle2">
						<u-tag text="待执业" type="info" v-if="item.planState==2" plain plainFill size="mini"></u-tag>
						<u-tag text="待生成" v-if="item.planState==3" plain plainFill size="mini"></u-tag>
						<u-tag text="已完成" type="success" v-if="item.planState==4" plain plainFill size="mini"></u-tag>
					</view>
				</view>

				<view class="contentLi">
					<view class="contentLi1">负责人：{{item.projectPerson}}</view>
					<view class="contentLi2">手机号：{{item.projectPersonPhoneStr}}</view>
				</view>
				<view class="contentLi">
					<view class="contentLi1">维保员：{{item.maintenancePerson}}</view>
				</view>
				<view class="contentButton">
					<view class="contentLiText" v-if="item.planState>2" @click.stop="addPdf(item)">生成临时报告</view>
					<view class="contentLiText" v-if="item.temReportFileUrl" @click.stop="showPdf(item)">查看临时报告</view>
				</view>

			</view>
			<view class="uLoadmore">
				<u-loadmore :status="refreshObj.sType" bg-color="#f1f1f1" icon-type="flower" />
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		findPlanManagementList,
		saveMaintenanceReport
	} from '@/api/maintenance/maintenance'
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
				dataForm: {
					"customerId": "",
					"projectId": "",
					"pageIndex": 1,
					"pageSize": 15,
					"effective": 1,
					"clientType": 1
				},
				planList: []
			}
		},
		onLoad() {

		},
		onShow() {
			this.dataForm.customerId = this.$store.state.user.checkProject.id;
			this.dataForm.projectId = this.$store.state.user.projectId;
			this.getFindPlanManagementList(true);
		},
		methods: {
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
				this.datetimeValue = "";
				this.dataForm.searchCheckDate = "";
				this.dataForm.deviceTypeName = "";

				this.getFindPlanManagementList(true);
			},
			showPdf(item) {
				let url = item.temReportFileUrl;
				if (!url) {
					this.$modal.loading('暂无可查看临时报告')
					return;
				}
				this.$modal.loading('报告加载中...')

				uni.downloadFile({
					url: url,
					success: (res) => {
						var filePath = res.tempFilePath;

						uni.openDocument({
							filePath: filePath,
							showMenu: true,
							success: function(res) {
								console.log('打开文档成功');
							}
						});
					},
					complete: () => {
						this.$modal.closeLoading()
					}
				});
			},
			addPdf(item) {
				let data = {
					"projectId": item.projectId,
					"id": item.customerId,
					"planId": item.id
				}
				saveMaintenanceReport(data).then(res => {
					if (res.object) {
						this.showPdf({
							temReportFileUrl: res.object
						})
					}

				})
			},
			getFindPlanManagementList(empty) {
				if (empty) {
					this.refreshObj.sType = 'nomore';
					this.dataForm.pageIndex = 1;
					this.planList = [];
				}
				findPlanManagementList(this.dataForm).then(res => {
					if (res.listObj) {
						this.planList.push(...res.listObj);
						if (this.planList.length < res.totalCount) {
							this.refreshObj.status = true;
							this.dataForm.pageIndex++;
							this.refreshObj.sType = 'loadmore';
						} else {
							this.refreshObj.status = false;
							this.refreshObj.sType = 'nomore';
						}
					} else {
						this.refreshObj.status = false;
						this.refreshObj.sType = 'nomore';
					}

					this.refreshObj.refresherTriggered = false; //触发onRestore，并关闭刷新图标
					this.refreshObj._refresherTriggered = false;
				})

			},

			goPlan(item) {
				if (item.singLog < 1) {
					this.$modal.showToast('请先进行现场签到')
					return;
				}
				this.$tab.navigateTo("/pages/management/plan/planInfo?item=" + JSON.stringify(item))
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pageView {
		height: 100vh;
		width: 100%;
		padding: 20rpx 0 0 0;

		.contentView {
			width: 100%;
			height: 100%;
			overflow-y: auto;
			padding: 0 0 50rpx 0;

			.contentTab {
				width: calc(100% - 60rpx);
				margin-left: 30rpx;
				height: auto;
				background: #FFFFFF;
				border-radius: 12rpx;
				padding: 0 24rpx 24rpx 24rpx;
				margin-bottom: 20rpx;

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
						width: auto;
						height: auto;
						font-family: PingFang SC, PingFang SC;
						font-weight: 400;
						font-size: 24rpx;
						color: #999999;
						text-align: left;
						font-style: normal;
						text-transform: none;
					}
				}

				.contentLi {
					width: 100%;
					height: auto;
					min-height: 72rpx;
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

				.contentButton {
					width: 100%;
					display: flex;
					justify-content: center;
					border-top: 1px solid #F5F5F5;
					padding: 20rpx 0 0 0;

					.contentLiText {
						font-size: 25rpx;
						color: #5590F5;
						margin: 0 50rpx;
					}
				}
			}
		}
	}
</style>