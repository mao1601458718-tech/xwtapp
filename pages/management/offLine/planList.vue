<template>
	<view class="pageView" :style="'padding: '+statusBarHeight+'rpx 0 0 0 ;'">
		<view class="customTopView">
			<view class="customTop" :style="'height:'+statusBarHeight+'rpx'">
				<view class="customBottom">
					<view class="customTop1" @click="goBack"> <u-icon class="uIcon" name="arrow-left" color="#000000"
							size="23"></u-icon>
					</view>
					<view class="customTop2">离线维保计划</view>
					<view class="customTop3">
						<!-- 更多 @click="actionShow=true" -->
					</view>
				</view>
			</view>
		</view>
		<scroll-view scroll-y refresher-background="#f1f1f1" class="contentView">
			<view style="height: 20rpx;"></view>
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
					<view class="contentLiText" style="color: #5590F5;" @click.stop="addPdf(item)">上传离线数据</view>
					<view class="contentLiText">最近上传</view>
				</view>
			</view>
		</scroll-view>
		<u-action-sheet :actions="actionSheet" safeAreaInsetBottom :show="actionShow" @close="actionClose"
			@select="actionSelect"></u-action-sheet>
	</view>
</template>

<script>
	import {
		updatePlanManagement,
		saveCheckRecordPlanOffline
	} from '@/api/maintenance/maintenance'
	export default {
		data() {
			return {
				statusBarHeight: this.$store.state.user.statusBarHeight,
				planList: [],
				actionShow: false,
				actionSheet: [{
					name: '清除离线计划数据',
				}, {
					name: '上传离线计划数据',
				}],
			}
		},
		onLoad() {},
		onShow() {
			let getStorage = uni.getStorageSync('planOffLine_' + this.$store.state.user.checkProject.id);
			if (getStorage && getStorage.planList) {
				this.planList = getStorage.planList;
			}
		},
		methods: {
			goPlanPage() {
				this.$tab.navigateTo("/pages/management/offLine/planList")
			},
			actionClose() {
				this.actionShow = false;
			},
			actionSelect(item) {
				if (item.name === "清除离线数据") {
					uni.showModal({
						title: '提示',
						content: '确定清除该项目本地离线记录？清除离线记录不影响线上计划',
						success: (res) => {
							if (res.confirm) {
								uni.setStorageSync('planOffLine_' + this.$store.state.user.checkProject.id,
									"");
								this.planObj = "";
							}
						}
					});
				}
			},
			addPdf(planData) {
				console.log(planData)
				let getStorage = uni.getStorageSync('planOffLine_' + this.$store.state.user.checkProject.id)
				let reportList = [];
				let planStorage = "";
				if (getStorage && getStorage.planList) {
					getStorage.planList.forEach((plan) => {
						if (plan.id == planData.id) {
							planStorage = plan;
							plan.planDeviceSysReportList.forEach((device) => {
								device.planDeviceTypeReportList.forEach((type) => {
									type.planCheckItemReportList.forEach((item) => {
										if (item.checkResult) {
											item["checkProjectId"] = this.$store.state.user
												.checkProject.id;
											item["projectId"] = this.$store.state.user
												.projectId;
											reportList.push(item);
										}
									})
								})
							})
						}

					})
				}
				if (reportList.length > 0) {
					uni.showModal({
						title: '提示',
						content: '确定上传离线计划数据?',
						success: async (res) => {
							if (res.confirm) {
								let res = await saveCheckRecordPlanOffline({
									list: reportList
								})

								let maintenanceInfoData = {
									"id": planStorage.id,
									"maintenanceInfo": planStorage.maintenanceInfo
								}
								let causeRes = await updatePlanManagement(maintenanceInfoData);

								if (res.status == 200) {

									// 1. 获取当前页面栈
									const pages = getCurrentPages();

									// 2. 如果栈中有至少两个页面，说明有上一页
									if (pages.length >= 2) {
										const prevPage = pages[pages.length - 2]; // 上一页实例

										// 3. 调用上一页的方法（假设上一页有 refreshList 方法）
										if (typeof prevPage.getAll === 'function') {
											prevPage.getAll(); // 可传参
										}
									}
									uni.$u.toast('离线计划数据上传成功')
								}
							}
						}
					});
				}
			},
			goPlan(item) {
				if (item.singLog < 1) {
					this.$modal.showToast('请先进行现场签到')
					return;
				}
				this.$tab.navigateTo("/pages/management/offLine/planInfo?item=" + JSON.stringify(item))
			},
			goBack() {
				uni.navigateBack();
			},
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
						margin: 0 50rpx;
					}
				}
			}
		}
	}
</style>