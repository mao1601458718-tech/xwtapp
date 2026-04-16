<template>
	<view class="paveView">
		<view class="topView"></view>
		<scroll-view scroll-y refresher-background="#f1f1f1" class="liListView" :refresher-threshold="105"
			:refresher-enabled="true" :refresher-triggered="refreshObj.refresherTriggered"
			@refresherrefresh="refresherrefresh" @refresherrestore="refresherrestore" @refresherabort="refresherabort">
			<view class="litView" v-for="(item,index) in planList" :key="index" @click="goFacilityList(item)">
				<view class="liTitle">{{item.reportNumber||"未签章报告"}}</view>
				<view class="liRight">
					<view class="liText">{{item.checkProjectNumber}}</view>
					<view class="liText">{{item.checkProjectReportCreateTime||item.createTime}}</view>
					<!-- <view class="liText">{{item.lastModifyTime}}</view> -->
				</view>
			</view>
			<view class="uLoadmore">
				<u-loadmore :status="refreshObj.sType" bg-color="#fff" icon-type="flower" />
			</view>
		</scroll-view>

	</view>
</template>

<script>
	import {
		findCheckProjectReportList
	} from '@/api/safety/safety.js'
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
				planList: [],
				dataForm: {
					"checkProjectId": 22,
					"projectId": 495,
					"customerId": 22,
					"pageIndex": 1,
					"pageSize": 0,
					"orderCols": ["createTime"],
					"orderDesc": true
				}
			};
		},
		onLoad() {

			this.dataForm.customerId = this.$store.state.user.checkProject.id;
			this.dataForm.checkProjectId = this.$store.state.user.checkProject.id;
			this.dataForm.projectId = this.$store.state.user.projectId;
			this.getFindPlanManagementReportList(true);
		},
		methods: {
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
				this.getFindPlanManagementReportList(true);
			},
			getFindPlanManagementReportList(empty) {
				if (empty) {
					this.refreshObj.sType = 'nomore';
					this.dataForm.pageIndex = 1;
					this.planList = [];
				}
				findCheckProjectReportList(this.dataForm).then(res => {
					if (res.listObj) {
						this.planList.push(...res.listObj);
					}
					this.refreshObj.refresherTriggered = false; //触发onRestore，并关闭刷新图标
					this.refreshObj._refresherTriggered = false;
				})
			},
			goFacilityList(item) {
				let url = item.fileUrl
				if (!url) {
					this.$modal.loading('暂无可查看报告')
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
						this.$modal.loading('加载失败')
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.paveView {
		width: 100%;
		min-height: 100vh;
		height: auto;
		background-color: #fff;
		padding: 0 0 300rpx 0;

		.topView {
			width: 100%;
			height: 20rpx;
			background-color: #F7F7F7;
		}

		.liListView {
			padding: 0 30rpx;
			height: auto;

			.litView {
				height: auto;
				width: 100%;
				padding: 20rpx 0;
				border-bottom: 1rpx solid #eee;



				.liTitle {
					height: auto;
					font-family: PingFang SC, PingFang SC;
					font-weight: 600;
					font-size: 28rpx;
					color: #333333;
					text-align: left;
					font-style: normal;
					text-transform: none;
				}

				.liRight {
					// display: flex;
					// align-items: center;
					margin-top: 10rpx;

					.liText {
						margin-right: 25rpx;
						width: auto;
						height: auto;
						font-family: PingFang SC, PingFang SC;
						font-weight: 400;
						font-size: 24rpx;
						color: #999999;
						font-style: normal;
						text-transform: none;
					}
				}
			}
		}
	}
</style>