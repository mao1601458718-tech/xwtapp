<template>
	<view class="container">
		<!-- 页面头部 -->
		<view class="header">
			<text class="subtitle1"></text>
			<text class="title">{{TypeForm.deviceTypeName}}</text>
			<text class="subtitle" @click="oneKey()">一键正常</text>
		</view>

		<!-- 设备列表 -->
		<view class="list">
			<block v-for="(item, index) in deviceList" :key="index">
				<view class="device-item">
					<view class="device-item-top">
						<!-- 设备名称 -->
						<text class="device-name">{{ item.checkName }}</text>

						<!-- 状态标签 -->
						<u-tag text="未完成" type="info" v-if="item.checkNum==0" plain plainFill size="mini"></u-tag>
						<u-tag text="已完成" type="success" v-else plain plainFill size="mini"></u-tag>
					</view>

					<!-- 统计信息 -->
					<view class="stats" :key="radioKey">
						<u-radio-group v-model="item.checkResult" placement="row" activeColor="#FA8161"
							@change="(value) => groupChange(value, item)">
							<u-radio style="margin-right: 50rpx;" label="正常" :name="1"></u-radio>
							<u-radio style="margin-right: 50rpx;" label="故障" :name="2"></u-radio>
							<u-radio style="margin-right: 50rpx;" label="无此项" :name="3"></u-radio>
						</u-radio-group>
					</view>
				</view>
			</block>
		</view>

		<view class="bottomView">
			<view class="viewLeft" @click="postSaveCheckRecord()">保 存</view>
		</view>
	</view>
</template>

<script>
	import {
		findPlanDeviceSysReportList,
		saveCheckRecord
	} from '@/api/maintenance/maintenance'
	export default {
		data() {
			return {
				timer: null,
				buttonLoading: false,
				radioKey: 0,
				radiovalue1: "3",
				deviceList: [],
				TypeForm: "",
				refreshObj: {
					refresherTriggered: false,
					_refresherTriggered: false,
				},
			};
		},
		onLoad(data) {
			if (data.item) {
				this.TypeForm = JSON.parse(data.item)
			}
			this.getFindPlanDeviceSysReportList()
			// 监听事件
			uni.$on('pageData', (data) => {
				if (data.TypeForm) {
					const index = this.deviceList.findIndex(item => item.deviceCheckItemId === data.TypeForm
						.deviceCheckItemId);
					if (index !== -1) {
						this.deviceList.splice(index, 1, data.TypeForm);
					}
					this.radioKey++;
				}
			});
		},
		onUnload() {
			// 页面卸载时移除监听      clearTimeout(this.timer)
			this.timer = null
			uni.$off('pageData');
		},
		methods: {
			oneKey() {
				this.deviceList.forEach((item, index) => {
					item.checkResult = 1
				})
				this.radioKey++;
			},
			groupChange(value, item) {
				if (value == 2) {
					this.$tab.navigateTo("/pages/management/plan/systemTabInfo?item=" + JSON.stringify(item))
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
				this.getFindPlanDeviceSysReportList();
			},
			goPage(item) {
				this.$tab.navigateTo("/pages/management/plan/systemInfo?item=" + JSON.stringify(item))
			},
			postSaveCheckRecord() {
				let allCheckResult = true;
				this.deviceList.forEach((item) => {
					if (!item.checkResult) {
						allCheckResult = false;
					}
				})
				if (!allCheckResult) {
					uni.$u.toast('还有未完成项目')
					return;
				}
				let data = {
					list: this.deviceList
				}

				if (this.buttonLoading) {
					uni.$u.toast('请勿重复提交')
					return;
				}
				this.buttonLoading = true;
				saveCheckRecord(data).then(res => {
					uni.$u.toast('保存成功')
					this.timer = setTimeout(() => {
						uni.navigateBack();
					}, 700);
				}).finally(() => {
					// 统一关闭loading
					this.buttonLoading = false;
				});

			},
			getFindPlanDeviceSysReportList() {
				let data = {
					"customerId": this.$store.state.user.checkProject.id,
					"projectId": this.$store.state.user.projectId,
					"id": this.TypeForm.id,
					"deviceTypeId": this.TypeForm.deviceTypeId,
					"pageIndex": 1,
					"pageSize": 15,
				}
				this.deviceList = [];
				console.log(this.TypeForm)
				findPlanDeviceSysReportList(data).then(res => {
					if (res.listObj) {
						res.listObj.forEach((item) => {
							this.deviceList.push({
								"projectId": this.$store.state.user.projectId,
								"checkType": 1,
								"checkProjectId": this.$store.state.user.checkProject.id,
								"deviceSysId": item.deviceSysId,
								"deviceSysName": item.deviceSysName,
								"deviceTypeId": item.deviceTypeId,
								"checkResult": item.checkResult || "",
								"causeFailure": item.causeFailure || "",
								"treatmentMeasures": item.treatmentMeasures,
								"deviceCheckItemId": item.checkItemId,
								"checkImgUrls": item.checkImgUrls,
								"planId": this.TypeForm.id,
								"planTimeType": item.planTimeType,
								"id": item.checkRecordId || "",
								"checkName": item.checkName,
								"checkNum": item.checkNum
							})
						})
					}

					this.refreshObj.refresherTriggered = false; //触发onRestore，并关闭刷新图标
					this.refreshObj._refresherTriggered = false;
				})
			},
		}
	};
</script>

<style scoped lang="scss">
	.container {
		width: 100%;
		background-color: #f0f2f5;
		height: 100vh;
	}

	.header {
		width: 100%;
		text-align: center;
		margin-bottom: 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;
		height: 80rpx;
		border-top: 1rpx solid #eee;
		padding: 0 20rpx;
	}

	.title {
		width: auto;
		height: 40rpx;
		font-family: PingFang SC, PingFang SC;
		font-weight: 600;
		font-size: 28rpx;
		color: #FA8161;
		text-align: center;
		font-style: normal;
		text-transform: none;
	}

	.subtitle1 {
		width: 100rpx;
		height: auto;
		padding: 5rpx 10rpx;
		font-size: 22rpx;
		border-radius: 8rpx;

	}

	.subtitle {
		width: 100rpx;
		height: auto;
		padding: 5rpx 10rpx;
		font-size: 22rpx;
		border-radius: 8rpx;
		background-color: rgba(85, 144, 245, 0.10);
		color: #5590F5;
	}

	.list {
		width: 100%;
	}

	.device-item {
		padding: 20rpx;
		background-color: white;
		border-bottom: 1rpx solid #eee;
	}

	.device-item-top {
		height: 60rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.device-name {
		font-size: 30rpx;
		color: #333;
		flex: 1;
	}

	.status {
		font-size: 24rpx;
		padding: 4rpx 12rpx;
		border-radius: 12rpx;
		min-width: 60rpx;
		text-align: center;

	}

	.status.completed {
		color: #2ecc71;
		background-color: rgba(46, 204, 113, 0.1);
	}

	.status.pending {
		color: #e74c3c;
		background-color: rgba(231, 76, 54, 0.1);
	}

	.stats {
		font-size: 24rpx;
		color: #666;
		display: flex;
		justify-content: space-between;
		width: 100%;
		padding: 20rpx 0 0 0;
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