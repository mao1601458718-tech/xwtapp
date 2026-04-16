<template>
	<view class="pageView">
		<view class="uTextareaView">
			<u--textarea class="uTextarea" v-model="causeFailure" :adjustPosition="false" :confirmType="null"
				placeholder="请简要填写本次维保具体情况" height="70vh" :maxlength="-1"></u--textarea>
		</view>
		<view class="bottomView">
			<view class="buttonView" @click="save(null)">
				保 存
			</view>
		</view>
	</view>
</template>

<script>
	import {
		updatePlanManagement,
		findPlanManagementList
	} from '@/api/maintenance/maintenance'

	export default {
		data() {
			return {
				timer: null,
				buttonLoading: false,
				causeFailure: "",
				planForm: {},
				dataForm: {
					"customerId": 18125,
					"projectId": 495,
					"pageIndex": 1,
					"pageSize": 0,
					"checkDate": "2021-04-20",
					"id": "",
					"clientType": 1
				}
			}
		},
		onUnload() {
			clearTimeout(this.timer)
			this.timer = null

		},
		onLoad(data) {
			if (data.item) {
				this.planForm = JSON.parse(data.item)
				this.dataForm.id = this.planForm.id
				this.dataForm.customerId = this.planForm.customerId
				this.dataForm.projectId = this.planForm.projectId
				this.getFindPlanManagementList();
			}
		},
		methods: {
			getFindPlanManagementList() {

				findPlanManagementList(this.dataForm).then(res => {
					if (res.listObj) {
						this.planForm = res.listObj[0]
						this.causeFailure = this.planForm.maintenanceInfo
					}
				})

			},
			save() {
				if (!this.causeFailure) {
					this.$modal.showToast('维保情况不能为空')
					return;
				}
				let dataForm = {
					"id": this.planForm.id,
					"maintenanceInfo": this.causeFailure
				}
				if (this.buttonLoading) {
					uni.$u.toast('请勿重复提交')
					return;
				}
				this.buttonLoading = true;
				updatePlanManagement(dataForm).then(res => {
					uni.$u.toast('保存成功')
					this.timer = setTimeout(() => {
						uni.navigateBack();
					}, 700);
				}).finally(() => {
					// 统一关闭loading
					this.buttonLoading = false;
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.pageView {
		width: 100%;
		height: 100vh;
		background-color: #fff;
	}

	.uTextareaView {
		padding: 30rpx;
	}

	.uTextarea {

		background-color: #f7f7f7;
	}

	.bottomView {
		height: 176rpx;
		width: 100%;
		background-color: #fff;
		position: fixed;
		bottom: 0;
		z-index: 99;

		box-shadow: 0rpx -1rpx 0rpx 2rpx rgba(0, 0, 0, 0.16);

		.buttonView {
			width: calc(100% - 60rpx);
			height: 84rpx;
			background: #FA8161;
			border-radius: 12rpx 12rpx 12rpx 12rpx;
			margin-left: 30rpx;
			text-align: center;
			line-height: 84rpx;
			color: #fff;
			margin-top: 20rpx;
		}
	}
</style>