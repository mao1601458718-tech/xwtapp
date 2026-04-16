<template>
	<view class="pageView" :style="'padding: '+statusBarHeight+'rpx 0 0 0 ;'">
		<view class="customTopView">
			<view class="customTop" :style="'height:'+statusBarHeight+'rpx'">
				<view class="customBottom">
					<view class="customTop1" @click="goBack"> <u-icon class="uIcon" name="arrow-left" color="#000000"
							size="23"></u-icon>
					</view>
					<view class="customTop2">问题详情</view>
					<view class="customTop3" v-if="!updateOrAdd" @click="submit()">确定</view>
					<view class="customTop3" v-else @click="updateOrAdd=false">编辑</view>
				</view>
			</view>
		</view>
		<view class="topView"></view>

		<view class="contentView" v-show="updateOrAdd">

			<view class="contentInput">
				<view class="contentInput1">主要隐患</view>
				<view class="contentInput2">{{dataForm.problem}}</view>
			</view>
			<view class="contentInput">
				<view class="contentInput1">隐患描述</view>
				<view class="contentInput2">{{dataForm.aftermath}}</view>
			</view>
			<view class="contentInput">
				<view class="contentInput1">整改建议</view>
				<view class="contentInput2">{{dataForm.countermeasure}}</view>
			</view>

			<view class="imageTab">
				<image class="image" v-for="(item,index) in imgList" :key="index" :src="item.src"></image>
			</view>
		</view>
		<view class="contentView" v-show="!updateOrAdd">
			<u--form :model="dataForm" :rules="rules" ref="uForm">

				<u-form-item label="主要隐患" prop="problem" borderBottom required labelWidth="120">
					<u--textarea v-model="dataForm.problem" placeholder="请描述情况" height="120rpx" :adjustPosition="false"
						:confirmType="null" :maxlength="-1"></u--textarea>
				</u-form-item>

				<u-form-item label="隐患描述" prop="aftermath" borderBottom labelWidth="120">
					<u--textarea v-model="dataForm.aftermath" placeholder="请描述情况" height="120rpx"
						:maxlength="-1"></u--textarea>
				</u-form-item>

				<u-form-item label="整改建议" prop="countermeasure" borderBottom labelWidth="120">
					<u--textarea v-model="dataForm.countermeasure" placeholder="请描述情况" height="120rpx"
						:maxlength="-1"></u--textarea>
				</u-form-item>
			</u--form>
			<img-view :imgListData="imgList" :imgSum="2" @uploadSucceed="uploadSucceed"
				@removeImg="removeImg"></img-view>

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
				updateOrAdd: true,
				statusBarHeight: this.$store.state.user.statusBarHeight,
				dataForm: {
					"createTime": "",
					"projectId": "",
					"deleted": "",
					"status": "",
					"createUserName": "",
					"createUserId": "",
					"checkProjectId": "",
					"placeId": "",
					"safetyLevel": "",
					"majorFirePotential": "",
					"majorFirePotentialDesc": "",
					"num": "",
					"numDesc": "",
					"address": "",
					"problem": "",
					"countermeasure": "",
					"inspectionBasis": "",
					"aftermath": "",
					"fileUrl": "",
					"deviceSysId": "",
					"deviceSysName": "",
					"deviceTypeId": "",
					"deviceTypeName": "",
					"deviceCheckItemId": "",
					"deviceCheckItemName": "",
					"standardName": "",
					"placeName": "",
					"id": "",
				},
				imgList: [],
				rules: {
					problem: {
						type: 'string',
						required: true,
						message: '主要隐患不能为空',
						trigger: ['blur', 'change']
					},
					aftermath: {
						type: 'string',
						required: true,
						message: '隐患描述不能为空',
						trigger: ['blur', 'change']
					},
					countermeasure: {
						type: 'string',
						required: true,
						message: '整改建议不能为空',
						trigger: ['blur', 'change']
					}
				},
			}
		},
		onLoad(data) {

			if (data.info && data.info != "null") {
				this.updateOrAdd = true;
				this.getFindCheckRecordList(JSON.parse(data.info));
			} else {
				this.updateOrAdd = false;
				this.getFindCheckRecordList(JSON.parse(data.item));
			}

		},
		onReady() {
			this.$refs.uForm.setRules(this.rules)
		},
		methods: {
			goBack() {
				uni.navigateBack();
			},
			getFindCheckRecordList(item) {
				Object.keys(this.dataForm).forEach(key => {
					if (item.hasOwnProperty(key)) {
						this.dataForm[key] = item[key];
					}
				});
				if (item.fileUrl && item.fileUrl != ";") {
					let imgs = item.fileUrl.split(";");
					imgs.forEach((item) => {
						this.imgList.push({
							src: item,
							text: "上传成功",
							uploading: 1
						});
					})
				}
			},
			submit() {
				this.$refs.uForm.validate().then(res => {

					if (this.dataForm.majorFirePotentialDesc) {
						this.dataForm.majorFirePotential = 1
					} else {
						this.dataForm.majorFirePotential = 2
					}
					uni.navigateBack({
						delta: 1,
						success: () => {
							// 通过事件总线传递数据
							uni.$emit('pageData', {
								problemData: this.dataForm
							});
						}
					});
				}).catch(errors => {
					this.buttonLoading = false;
				})
			},
			removeImg(data) {

				if (data.length == 0) {
					this.dataForm.fileUrl = "";
				} else {
					let list = [];
					data.forEach((item) => {
						if (item.src) {
							list.push(item.src);
						}
					})
					this.dataForm.fileUrl = list.join(';');
				}
			},
			uploadSucceed(data) {
				if (data.length == 0) {
					this.dataForm.fileUrl = "";
				} else {
					let list = [];
					data.forEach((item) => {
						if (item.src) {
							list.push(item.src);
						}
					})
					this.dataForm.fileUrl = list.join(';');
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pageView {
		min-height: 100vh;
		height: auto;
		width: 100%;
		background-color: #fff;
	}

	.topView {
		width: 100%;
		height: 20rpx;
		background-color: #F7F7F7;
	}

	.customTop3 {
		font-family: PingFang SC, PingFang SC;
		font-weight: 400;
		font-size: 28rpx;
		color: #FA8161;
		text-align: right;
		font-style: normal;
		text-transform: none;
	}

	.contentView {
		width: 100%;
		height: auto;
		background-color: #fff;
		margin-top: 20rpx;
		padding: 0 30rpx;

		.contentInput {
			width: 100%;
			height: auto;
			padding: 20rpx 0;
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
				width: 200rpx;
			}

			.contentInput2 {
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 28rpx;
				color: #999999;
				text-align: right;
				font-style: normal;
				text-transform: none;
				width: calc(100% - 200rpx);
			}
		}

		.imgViewTitle {
			width: 100%;
			height: 60rpx;
			font-family: PingFang SC, PingFang SC;
			font-weight: 400;
			font-size: 28rpx;
			color: #181818;
			text-align: left;
			font-style: normal;
			text-transform: none;
			line-height: 60rpx;
		}

	}

	.contentViewImg {
		width: 100%;
		height: auto;
		background-color: #fff;
		margin-top: 20rpx;


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



		}

	}

	.imageTab {
		position: relative;
		display: flex;
		margin-top: 20rpx;

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


	::v-deep .u-form {
		.u-form-item {
			.u-form-item__body {
				.u-form-item__body__right {
					.u-form-item__body__right__content {
						.u-form-item__body__right__content__slot {
							display: flex !important;
							justify-content: right !important;

							.u-radio-group {
								display: flex !important;
								justify-content: right !important;


							}
						}

					}

				}
			}
		}
	}
</style>