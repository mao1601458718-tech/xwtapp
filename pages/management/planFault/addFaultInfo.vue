<template>
	<view class="container">
		<view class="contentView">
			<view class="contentInput">
				<view class="contentInput1">单位名称</view>
				<view class="contentInput2">{{dataForm.projectName}}</view>
			</view>
			<u--form :model="dataForm" :rules="rules" ref="uForm">
				<u-form-item label="系统名称" prop="deviceSysName" required borderBottom @click="selectSystem()"
					labelWidth="120">
					<text class="placeholderText" v-if="!dataForm.deviceSysName">请选择系统名称</text>
					<text class="placeholderValue" v-else>{{dataForm.deviceSysName}}</text>

					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
				<u-form-item label="设备名称" prop="deviceName" required borderBottom @click="selectSystemItem()"
					labelWidth="120">
					<text class="placeholderText" v-if="!dataForm.deviceName">请选择设备名称</text>
					<text class="placeholderValue" v-else>{{dataForm.deviceName}}</text>

					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
				<u-form-item label="设备项名称" prop="deviceCheckTtemName" required borderBottom @click="selectCheckItem()"
					labelWidth="120">
					<text class="placeholderText" v-if="!dataForm.deviceCheckTtemName">请选择设备项名称</text>
					<text class="placeholderValue" v-else>{{dataForm.deviceCheckTtemName}}</text>

					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
				<u-form-item label="故障类别" prop="faultType" borderBottom @click="onShowSex('faultType')"
					labelWidth="120">
					<text class="placeholderText" v-if="!dataForm.faultType">请选择故障类别</text>
					<text class="placeholderValue" v-else>{{dataForm.faultType}}</text>

					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
				<u-form-item label="是否上报" prop="handInText" borderBottom @click="onShowSex('handIn')" labelWidth="120">
					<text class="placeholderText" v-if="!dataForm.handInText">请选择是否上报</text>
					<text class="placeholderValue" v-else>{{dataForm.handInText}}</text>

					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
			</u--form>
			<view class="contentInput" style="padding: 20rpx 0;">
				<u--textarea v-model="dataForm.faultDescription" placeholder="请描述情况" height="120rpx"
					:adjustPosition="false" :confirmType="null" :maxlength="-1"></u--textarea>
			</view>

			<u-action-sheet :show="showSex" :actions="actions" title="请选择" @close="showSex = false" @select="sexSelect">
			</u-action-sheet>

		</view>

		<img-view :imgListData="imgList" :imgSum="2" @uploadSucceed="uploadSucceed" @removeImg="removeImg"></img-view>
		<view class="contentView">
			<view class="contentInput" style="justify-content: left;">
				<view class="imgViewTitle" style="width: 160rpx;">紧急程度</view>
				<u-tag text="一般" @click="dataForm.urgentDegree=1" :type="dataForm.urgentDegree==1?'success':'info'"
					plain plainFill style="margin-right: 30rpx;"></u-tag>
				<u-tag text="紧急" @click="dataForm.urgentDegree=2" :type="dataForm.urgentDegree==2?'warning':'info'"
					plain plainFill style="margin-right: 30rpx;"></u-tag>
				<u-tag text="特急" @click="dataForm.urgentDegree=3" :type="dataForm.urgentDegree==3?'error':'info'" plain
					plainFill style="margin-right: 30rpx;"></u-tag>
			</view>
		</view>
		<view class="bottomView">
			<view class="viewLeft" @click="submit()">提 交</view>
		</view>
	</view>
</template>

<script>
	import imgView from "@/pages/common/uploadImg.vue"
	import {
		addFaultRepairRecord,
		updateFaultRepairRecord
	} from '@/api/maintenance/findFault.js'

	export default {
		components: {
			imgView
		},
		data() {
			return {
				timer: null,
				buttonLoading: false,
				dataForm: {
					"projectId": "",
					"checkProjectId": "",
					"projectName": "",
					"deviceId": "",
					"deviceName": "",
					"deviceSysId": "",
					"deviceSysName": "",
					"deviceCheckTtemId": "",
					"deviceCheckTtemName": "",
					"deviceName": "",
					"faultDescription": "",
					"faultType": "其它",
					"handIn": 1,
					"handInText": "上报",
					"urgentDegree": 1,
					"imageUrl": ";",
					"id": ""
				},
				showSex: false,
				imgList: [],
				actions: [],
				actionsFaultType: [{
						name: '接触不良的故障',
						value: "接触不良的故障",
					},
					{
						name: '其他',
						value: "其他",
					}
				],
				actionsHandIn: [{
						name: '上报',
						value: 1,
					},
					{
						name: '不上报',
						value: 2,
					}
				],
				rules: {
					deviceName: {
						type: 'string',
						required: true,
						message: '设备名称不能为空',
						trigger: ['blur', 'change']
					},
					deviceCheckTtemName: {
						type: 'string',
						required: true,
						message: '设备项名称不能为空',
						trigger: ['blur', 'change']
					},
					deviceSysName: {
						type: 'string',
						required: true,
						message: '系统名称不能为空',
						trigger: ['blur', 'change']
					}
				},

			}
		},
		onLoad(data) {
			this.dataForm.checkProjectId = this.$store.state.user.checkProject.id;
			this.dataForm.projectId = this.$store.state.user.projectId;
			this.dataForm.projectName = this.$store.state.user.checkProject.checkProjectName;
			if (data.item && data.item != "null") {
				this.getDataForm(JSON.parse(data.item));
			}
			// 监听事件
			uni.$on('pageData', (data) => {

				if (data.deviceData) {
					this.dataForm.deviceSysId = data.deviceData.id
					this.dataForm.deviceSysName = data.deviceData.deviceSysName

					this.dataForm.deviceId = ""
					this.dataForm.deviceName = ""

					this.dataForm.deviceCheckTtemId = ""
					this.dataForm.deviceCheckTtemName = ""
				}
				if (data.deviceTypeData) {
					this.dataForm.deviceId = data.deviceTypeData.id
					this.dataForm.deviceName = data.deviceTypeData.deviceSysName

					this.dataForm.deviceCheckTtemId = ""
					this.dataForm.deviceCheckTtemName = ""
				}
				if (data.checkItemData) {
					this.dataForm.deviceCheckTtemId = data.checkItemData.id
					this.dataForm.deviceCheckTtemName = data.checkItemData.checkName
				}
			});
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules)

		},
		onUnload() {
			clearTimeout(this.timer)
			this.timer = null

		},
		methods: {

			getDataForm(item) {
				Object.keys(this.dataForm).forEach(key => {
					if (item.hasOwnProperty(key)) {
						this.dataForm[key] = item[key];
					}
				});
				if (this.dataForm.imageUrl) {
					let imgs = this.dataForm.imageUrl.split(";");
					imgs.forEach((item) => {
						this.imgList.push({
							src: item,
							text: "上传成功",
							uploading: 1
						});
					})
				}
			},
			goBack() {
				uni.navigateBack();
			},
			selectSystem() {
				this.$tab.navigateTo(`/pages/common/selectSystem?id=${this.dataForm.deviceSysId}`)
			},
			selectSystemItem() {
				if (!this.dataForm.deviceSysId) {
					this.$modal.showToast('请先选择系统名称')
					return;
				}
				this.$tab.navigateTo(
					`/pages/common/selectSystemItem?parentId=${this.dataForm.deviceSysId}&id=${this.dataForm.deviceId}`
				)
			},
			selectCheckItem() {
				if (!this.dataForm.deviceSysId) {
					this.$modal.showToast('请先选择系统名称')
					return;
				}
				this.$tab.navigateTo(
					`/pages/common/selectCheckItem?parentId=${this.dataForm.deviceId}&id=${this.dataForm.deviceCheckTtemId}`
				)
			},
			onShowSex(type) {
				this.showSex = true
				this.atSelect = type
				if (type == "handIn") {
					this.actions = this.actionsHandIn
				} else {
					this.actions = this.actionsFaultType
				}
			},
			sexSelect(e) {
				this.dataForm[this.atSelect] = e.value
				if (this.atSelect == "handIn") {
					this.dataForm.handInText = e.name
				}
			},
			submit() {
				this.$refs.uForm.validate().then(res => {
					uni.$u.toast('校验通过')
				}).catch(errors => {
					uni.$u.toast('校验失败')
				})
			},

			removeImg(data) {

				if (data.length == 0) {
					this.dataForm.imageUrl = "";
				} else {
					let list = [];
					data.forEach((item) => {
						if (item.src) {
							list.push(item.src);
						}
					})
					this.dataForm.imageUrl = list.join(';');
				}
			},
			uploadSucceed(data) {
				if (data.length == 0) {
					this.dataForm.imageUrl = "";
				} else {
					let list = [];
					data.forEach((item) => {
						if (item.src) {
							list.push(item.src);
						}
					})
					this.dataForm.imageUrl = list.join(';');
				}
			},
			submit() {
				let imgs = this.dataForm.imageUrl.split(";");

				this.$refs.uForm.validate().then(res => {
					if (this.buttonLoading) {
						uni.$u.toast('请勿重复提交')
						return;
					}
					this.buttonLoading = true;
					if (this.dataForm.id) {
						updateFaultRepairRecord(this.dataForm).then(res => {
							uni.$u.toast('修改成功')
							this.timer = setTimeout(() => {
								this.goBack();
							}, 700);
						}).finally(() => {
							// 统一关闭loading
							this.buttonLoading = false;
						});
					} else {
						addFaultRepairRecord(this.dataForm).then(res => {
							uni.$u.toast('添加成功')
							this.timer = setTimeout(() => {
								this.goBack();
							}, 700);
						}).finally(() => {
							// 统一关闭loading
							this.buttonLoading = false;
						});
					}
				}).catch(errors => {
					this.buttonLoading = false;
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.pageView {
		height: auto;
		width: 100%;

	}


	.contentView {
		width: 100%;
		height: auto;
		background-color: #fff;
		margin-top: 20rpx;
		padding: 0 30rpx;


		.contentInput {
			width: 100%;
			min-height: 78rpx;
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