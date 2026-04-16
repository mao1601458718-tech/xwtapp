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
	} from '@/api/maintenance/maintenance'

	export default {
		data() {
			return {
				timer: null,
				causeFailure: "",
				planForm: {},

			}
		},
		onLoad(data) {
			let getStorage = uni.getStorageSync('planOffLine_' + this.$store.state.user.checkProject.id);
			if (getStorage && getStorage.planList) {
				getStorage.planList.forEach((item) => {
					if (item.id == data.planId) {
						this.planForm = item;
					}
				})
				this.causeFailure = this.planForm.maintenanceInfo
			}
		},
		onUnload() {
			clearTimeout(this.timer)
			this.timer = null

		},
		methods: {

			save() {
				if (!this.causeFailure) {
					this.$modal.showToast('维保情况不能为空')
					return;
				}

				let getStorage = uni.getStorageSync('planOffLine_' + this.$store.state.user.checkProject.id);
				if (getStorage && getStorage.planList) {
					getStorage.planList.forEach((item) => {
						if (item.id == this.planForm.id) {
							item.maintenanceInfo = this.causeFailure;
						}
					})
				}
				this.$modal.showToast('离线保存成功')
				uni.setStorageSync('planOffLine_' + this.$store.state.user.checkProject.id, getStorage);
				this.timer = setTimeout(() => {
					this.goBack();
				}, 700);
			},
			goBack() {
				uni.navigateBack();
			},
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