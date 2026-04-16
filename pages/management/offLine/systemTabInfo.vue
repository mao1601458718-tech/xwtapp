<template>
	<view class="container">
		<!-- 页面头部 -->
		<view class="header">
			<!-- <text class="title"></text> -->
			<text class="title">{{TypeForm.checkName}}</text>
			<!-- <text class="title"></text> -->
		</view>

		<!-- 设备列表 -->
		<view class="contentDiv">
			<view class="inputView">
				<view class="inputTitle">设备状态</view>
				<view class="inputRadio">
					<u-radio-group v-model="TypeForm.checkResult" placement="row" activeColor="#FA8161">
						<u-radio style="margin-left: 30rpx;" label="正常" :name="1"></u-radio>
						<u-radio style="margin-left: 30rpx;" label="故障" :name="2"></u-radio>
						<u-radio style="margin-left: 30rpx;" label="无此设备" :name="3"></u-radio>
					</u-radio-group>
				</view>
			</view>
			<view class="inputView">
				<view class="inputTitle">设备状态</view>
				<view class="inputRadio">
					<u-radio-group v-model="TypeForm.treatmentMeasures" placement="row" activeColor="#FA8161">
						<u-radio style="margin-left: 30rpx;" label="现场解决" :name="1"></u-radio>
						<u-radio style="margin-left: 30rpx;" label="故障报修" :name="2"></u-radio>
					</u-radio-group>
				</view>
			</view>
			<view class="inputView">
				<u--textarea v-model="TypeForm.causeFailure" placeholder="请描述情况" height="120rpx" :adjustPosition="false"
					:confirmType="null" :maxlength="-1"></u--textarea>
			</view>
		</view>
		<view class="contentView">
			<view class="imgViewTitle">上传图片</view>
			<view class="imgListView">
				离线状态下不支持上传图片，请用手机拍照。待有网后在"巡查测试"中修改
			</view>
		</view>
		<!-- <img-view :imgListData="imgList" :imgSum="2" @uploadSucceed="uploadSucceed" @removeImg="removeImg"></img-view> -->
		<view class="bottomView">
			<view class="viewLeft" @click="confirm()">确 定</view>
		</view>
	</view>
</template>

<script>
	import imgView from "@/pages/common/uploadImg.vue"
	export default {
		components: {
			imgView
		},
		data() {
			return {
				radiovalue1: "1",
				radiovalue2: "2",
				textarea: "",
				TypeForm: {
					"projectId": "",
					"checkType": "",
					"checkProjectId": "",
					"deviceSysId": "",
					"deviceSysName": "",
					"deviceTypeId": "",
					"checkResult": "",
					"causeFailure": "",
					"treatmentMeasures": "",
					"deviceCheckItemId": "",
					"checkImgUrls": "",
					"planId": "",
					"id": "",
					"checkName": "",
					"checkNum": ""
				},

			};
		},
		onLoad(data) {
			if (data.item) {
				this.TypeForm = JSON.parse(data.item)
				if (!this.TypeForm.treatmentMeasures) {
					this.TypeForm.treatmentMeasures = 2;
				}

			}
		},
		methods: {

			confirm() {
				uni.navigateBack({
					delta: 1,
					success: () => {
						// 通过事件总线传递数据
						uni.$emit('pageData', {
							typeForm: this.TypeForm
						});
					}
				});
			}

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
		justify-content: center;
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

	.contentDiv {
		width: 100%;
		height: auto;
		background-color: #fff;
		padding: 0 30rpx;

		.inputView {
			width: 100%;
			height: auto;
			padding: 30rpx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1rpx solid #eee;

			.inputTitle {
				width: 150rpx;
				height: auto;
			}

			.inputRadio {}
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
		justify-content: space-between;

		.viewLeft {
			width: calc(50% - 45rpx);
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

		.viewRight {
			width: calc(50% - 45rpx);
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

	.contentView {
		width: 100%;
		height: auto;
		background-color: #fff;
		margin-top: 20rpx;
		padding: 0 30rpx;

		.contentInput {
			width: 100%;
			min-height: 88rpx;
			border-bottom: 1px solid #F5F5F5;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.contentInput1 {
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 28rpx;
				color: #333333;
				text-align: left;
				font-style: normal;
				text-transform: none;
			}

			.contentInput2 {
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 28rpx;
				color: #999999;
				text-align: right;
				font-style: normal;
				text-transform: none;

			}
		}

		.imgViewTitle {
			width: 100%;
			height: 84rpx;
			font-family: PingFang SC, PingFang SC;
			font-weight: 400;
			font-size: 28rpx;
			color: #181818;
			text-align: left;
			font-style: normal;
			text-transform: none;
			line-height: 84rpx;
		}

		.imgListView {
			display: flex;
			justify-content: left;
			padding: 0 0 20rpx 0;

			.imgView {
				width: 160rpx;
				height: 160rpx;
				border-radius: 12rpx 12rpx 12rpx 12rpx;
				border: 2rpx solid #E3E3E3;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-right: 20rpx;

				.iconView {

					.imgIcon {
						width: 100%;
						display: flex;
						justify-content: center;
					}

					.iconView1 {
						width: 100%;
						font-family: PingFang SC, PingFang SC;
						font-weight: 400;
						font-size: 24rpx;
						color: #A4A4A4;
						text-align: center;
						font-style: normal;
						text-transform: none;
						margin-top: 10rpx;
					}
				}
			}

			.imageTab {
				position: relative;

				.image {
					width: 160rpx;
					height: 160rpx;
					background-size: 100%;
					margin-right: 20rpx;
					border-radius: 12rpx;
				}

				.imgClose {
					position: absolute;
					top: 5rpx;
					right: 25rpx;
				}
			}


		}

	}
</style>