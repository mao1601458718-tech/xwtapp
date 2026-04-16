<template>
	<view class="pageView" :style="'padding: '+statusBarHeight+'rpx 0 0 0 ;'">
		<view class="customTopView">
			<view class="customTop" :style="'height:'+statusBarHeight+'rpx'">
				<view class="customBottom">
					<view class="customTop1" @click="goBack"> <u-icon class="uIcon" name="arrow-left" color="#000000"
							size="23"></u-icon>
					</view>
					<view class="customTop2">设备详情</view>
					<view class="customTop3" @click="submit()">保存</view>
				</view>
			</view>
		</view>
		<view class="topView"></view>
		<view class="contentView">
			<u--form :model="dataForm" :rules="rules" ref="uForm">
				<u-form-item label="所在建筑" prop="sex" borderBottom @click="onShowSex('sex')" labelWidth="120">
					<u--input v-model="dataForm.sex" readonly disabledColor="#ffffff" placeholder="请选择"
						inputAlign="right" border="none"></u--input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
				<u-form-item label="所在楼层" prop="sex" borderBottom @click="onShowSex('sex')" labelWidth="120">
					<u--input v-model="dataForm.sex" readonly disabledColor="#ffffff" placeholder="请选择"
						inputAlign="right" border="none"></u--input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
				<u-form-item label="系统名称" prop="sex" borderBottom @click="onShowSex('sex')" labelWidth="120">
					<u--input v-model="dataForm.sex" readonly disabledColor="#ffffff" placeholder="请选择"
						inputAlign="right" border="none"></u--input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
				<u-form-item label="设备名称" prop="sex" borderBottom @click="onShowSex('sex')" labelWidth="120">
					<u--input v-model="dataForm.sex" readonly disabledColor="#ffffff" placeholder="请选择"
						inputAlign="right" border="none"></u--input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>

				<u-form-item label="生产厂家" prop="name" borderBottom required labelWidth="120">
					<u--input v-model="dataForm.name" border="none" placeholder="请输入设备数量" inputAlign="right"></u--input>
				</u-form-item>
				<u-form-item label="设备数量" prop="name" borderBottom required labelWidth="120">
					<u--input v-model="dataForm.name" border="none" placeholder="请输入设备数量" inputAlign="right"></u--input>
				</u-form-item>
				<u-form-item label="具体位置" prop="name" borderBottom required labelWidth="120">
					<u--input v-model="dataForm.name" border="none" placeholder="请输入设备数量" inputAlign="right"></u--input>
				</u-form-item>
				<u-form-item label="型号规格" prop="name" borderBottom required labelWidth="120">
					<u--input v-model="dataForm.name" border="none" placeholder="请输入设备数量" inputAlign="right"></u--input>
				</u-form-item>
			</u--form>

			<u-action-sheet :show="showSex" :actions="actions" title="请选择" @close="showSex = false" @select="sexSelect">
			</u-action-sheet>
			<view class="imgViewTitle">上传图片</view>
			<view class="imgListView">
				<view class="imgView" @click="getImg(1)">
					<view class="iconView">
						<view class="imgIcon"><u-icon name="plus" color="#999999" size="25"></u-icon></view>
						<view class="iconView1">添加照片</view>
					</view>
				</view>
				<view class="imageTab">
					<image class="image" src="/static/images/profile.jpg"></image>
					<view class="imgClose"><u-icon name="close" color="#999999" size="20"
							@click="removeImg(index)"></u-icon></view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusBarHeight: this.$store.state.user.statusBarHeight,
				dataForm: {
					name: "",
					sex: "",
					radio1: "",
					value3: true,
					textarea: ""
				},
				showSex: false,
				atSelect: "",
				imgList: [],
				// 基本案列数据
				radiolist1: [{
						label: '测试',
						name: 1,
						disabled: false
					},
					{
						label: '巡查',
						name: 2,
						disabled: false
					},
					{
						label: '保养',
						name: 3,
						disabled: false
					},
				],
				// u-radio-group的v-model绑定的值如果设置为某个radio的name，就会被默认选中
				radiovalue1: '苹果',
				actions: [{
						name: '男',
					},
					{
						name: '女',
					},
					{
						name: '保密',
					},
				],
				rules: {
					name: {
						type: 'string',
						required: true,
						message: '请填写姓名',
						trigger: ['blur', 'change']
					},
					sex: {
						type: 'string',
						max: 1,
						required: true,
						message: '请选择男或女',
						trigger: ['blur', 'change']
					},
				},

			}
		},
		onLoad() {

		},
		onReady() {
			this.$refs.uForm.setRules(this.rules)
		},
		methods: {
			goBack() {
				uni.navigateBack();
			},
			onShowSex(type) {
				this.showSex = true
				this.atSelect = type
			},
			sexSelect(e) {
				this.dataForm[this.atSelect] = e.name
				this.$refs.uForm.validateField(this.atSelect)
			},
			submit() {
				this.$refs.uForm.validate().then(res => {
					uni.$u.toast('校验通过')
				}).catch(errors => {
					uni.$u.toast('校验失败')
				})
			},
			groupChange(n) {
				console.log('groupChange', n);
			},
			radioChange(n) {
				console.log('radioChange', n);
			},
			getImg(type) {
				uni.chooseImage({
					count: 2, //默认9
					sizeType: ['compressed '], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['camera', 'album'], //从相册选择
					success: (res) => {
						console.log(res.tempFilePaths)
					}
				});
			},
			removeImg() {

			}
		}
	}
</script>

<style lang="scss" scoped>
	.pageView {
		min-height: 100vh;
		width: 100%;
		height: auto;
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