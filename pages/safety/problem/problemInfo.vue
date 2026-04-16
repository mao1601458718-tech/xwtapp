<template>
	<view class="pageView" :style="'padding: '+statusBarHeight+'rpx 0 0 0 ;'">
		<view class="customTopView">
			<view class="customTop" :style="'height:'+statusBarHeight+'rpx'">
				<view class="customBottom">
					<view class="customTop1" @click="goBack"> <u-icon class="uIcon" name="arrow-left" color="#000000"
							size="23"></u-icon>
					</view>
					<view class="customTop2">问题详情</view>
					<view class="customTop3" v-if="!updateOrAdd" @click="submit()">保存</view>
					<view class="customTop3" v-else @click="updateOrAdd=false">编辑</view>
				</view>
			</view>
		</view>
		<view class="topView"></view>

		<view class="contentView" v-show="updateOrAdd">
			<view class="contentInput">
				<view class="contentInput1">所属类别</view>
				<view class="contentInput2">{{dataForm.deviceTypeName}}</view>
			</view>
			<view class="contentInput">
				<view class="contentInput1">所属小类</view>
				<view class="contentInput2">{{dataForm.deviceSysName}}</view>
			</view>
			<view class="contentInput">
				<view class="contentInput1">问题详情</view>
				<view class="contentInput2">{{dataForm.problem}}</view>
			</view>
			<view class="contentInput">
				<view class="contentInput1">对策与措施</view>
				<view class="contentInput2">{{dataForm.countermeasure}}</view>
			</view>
			<view class="contentInput">
				<view class="contentInput1">检测依据</view>
				<view class="contentInput2">{{dataForm.inspectionBasis}}</view>
			</view>
			<view class="contentInput">
				<view class="contentInput1">风险可能产生的后果</view>
				<view class="contentInput2">{{dataForm.aftermath}}</view>
			</view>
			<view class="contentInput">
				<view class="contentInput1">所在位置</view>
				<view class="contentInput2">{{dataForm.address}}</view>
			</view>
			<view class="contentInput">
				<view class="contentInput1">风险成都</view>
				<view class="contentInput2">{{dataForm.safetyLevelName}}</view>
			</view>
			<view class="contentInput">
				<view class="contentInput1">重大火灾隐患</view>
				<view class="contentInput2">{{dataForm.majorFirePotentialDesc?"是":"否"}}</view>
			</view>
			<view class="contentInput">
				<view class="contentInput1">不符合检查项个数</view>
				<view class="contentInput2">{{dataForm.num}}</view>
			</view>
			<view class="contentInput">
				<view class="contentInput1">添加时间</view>
				<view class="contentInput2">{{dataForm.createTime}}</view>
			</view>
			<view class="imageTab">
				<image class="image" v-for="(item,index) in imgList" :key="index" :src="item.src"></image>
			</view>
		</view>
		<view class="contentView" v-show="!updateOrAdd">
			<u--form :model="dataForm" :rules="rules" ref="uForm">
				<u-form-item label="所属类别" prop="deviceTypeName" borderBottom required labelWidth="120"
					@click="selectDict()">
					<text class="placeholderText" v-if="!dataForm.deviceTypeName">请选择所属类别</text>
					<text class="placeholderValue" v-else>{{dataForm.deviceTypeName}}</text>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>

				<u-form-item label="所属小类" prop="deviceSysName" borderBottom required labelWidth="120"
					@click="selectSystemItem()">
					<text class="placeholderText" v-if="!dataForm.deviceSysName">请选择所属小类</text>
					<text class="placeholderValue" v-else>{{dataForm.deviceSysName}}</text>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>

				<u-form-item label="问题详情" prop="problem" borderBottom required labelWidth="120">
					<u--textarea v-model="dataForm.problem" placeholder="请描述情况" height="120rpx" :adjustPosition="false"
						:confirmType="null" :maxlength="-1"></u--textarea>
				</u-form-item>

				<u-form-item label="对策与措施" prop="countermeasure" borderBottom labelWidth="120">
					<u--textarea v-model="dataForm.countermeasure" placeholder="请描述情况" height="120rpx"
						:adjustPosition="false" :confirmType="null" :maxlength="-1"></u--textarea>
				</u-form-item>

				<u-form-item label="检测依据" prop="inspectionBasis" borderBottom labelWidth="120">
					<u--textarea v-model="dataForm.inspectionBasis" placeholder="请描述情况" height="120rpx"
						:adjustPosition="false" :confirmType="null" :maxlength="-1"></u--textarea>
				</u-form-item>

				<u-form-item label="风险可能产生的后果" prop="aftermath" borderBottom required labelWidth="120">
					<u--textarea v-model="dataForm.aftermath" placeholder="请描述情况" height="120rpx"
						:adjustPosition="false" :confirmType="null" :maxlength="-1"></u--textarea>
				</u-form-item>

				<u-form-item label="所在位置" prop="address" borderBottom required labelWidth="120">
					<u--input v-model="dataForm.address" type="number" border="none" placeholder="请输入建筑高度"
						inputAlign="right"></u--input>
				</u-form-item>


				<u-form-item label="风险程度" prop="safetyLevelName" borderBottom labelWidth="120" @click="showSex=true">
					<text class="placeholderText" v-if="!dataForm.safetyLevelName">请选择风险程度</text>
					<text class="placeholderValue" v-else>{{dataForm.safetyLevelName}}</text>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>

				<u-form-item label="重大火灾隐患" prop="majorFirePotentialDesc" borderBottom labelWidth="120">
					<u-switch v-model="dataForm.majorFirePotentialDesc" space="2" activeColor="#05CF47"
						inactiveColor="#FA8161"></u-switch>
				</u-form-item>
				<u-form-item label="不符合检查项个数" prop="num" borderBottom required labelWidth="130">
					<u--input v-model="dataForm.num" type="number" border="none" placeholder="请输入不符合检查项个数"
						inputAlign="right"></u--input>
				</u-form-item>

			</u--form>
			<img-view :imgListData="imgList" :imgSum="2" @uploadSucceed="uploadSucceed"
				@removeImg="removeImg"></img-view>
			<u-action-sheet :show="showSex" :actions="actions" title="请选择" @close="showSex = false" @select="sexSelect">
			</u-action-sheet>
		</view>

	</view>
</template>

<script>
	import {
		modifyRiskProblem,
		saveRiskProblemList,
		saveRiskProblem
	} from '@/api/safety/safety.js'

	import imgView from "@/pages/common/uploadImg.vue"
	export default {
		components: {
			imgView
		},
		data() {
			return {
				timer: null,
				buttonLoading: false,
				updateOrAdd: true,
				statusBarHeight: this.$store.state.user.statusBarHeight,
				dataForm: {
					"projectId": "",
					"checkProjectId": "",
					"deviceSysName": "",
					"deviceSysId": "",
					"deviceTypeName": "",
					"safetyType": "",
					"problem": "",
					"countermeasure": "",
					"inspectionBasis": "",
					"aftermath": "",
					"address": "",
					"safetyLevelName": "低",
					"safetyLevel": 1,
					"majorFirePotential": "",
					"majorFirePotentialDesc": "",
					"num": 1,
					"fileUrl": "",
					"id": "",
					"createTime": "",
				},
				showSex: false,
				atSelect: "",
				imgList: [],
				actions: [{
						name: '低',
						value: 1
					},
					{
						name: '中',
						value: 2
					},
					{
						name: '高',
						value: 3
					},
				],
				rules: {
					deviceTypeName: {
						type: 'string',
						required: true,
						message: '所属类别不能为空',
						trigger: ['blur', 'change']
					},
					deviceSysName: {
						type: 'string',
						required: true,
						message: '所属小类不能为空',
						trigger: ['blur', 'change']
					},
					problem: {
						type: 'string',
						required: true,
						message: '问题详情不能为空',
						trigger: ['blur', 'change']
					},
					address: {
						type: 'string',
						required: true,
						message: '所在位置不能为空',
						trigger: ['blur', 'change']
					},
					num: {
						type: 'number',
						required: true,
						message: '不符合检查项个数不能为空',
						trigger: ['blur', 'change']
					},
				},

			}
		},
		onLoad(data) {

			this.dataForm.checkProjectId = this.$store.state.user.checkProject.id;
			this.dataForm.projectId = this.$store.state.user.projectId;
			if (data.item) {
				this.updateOrAdd = true;
				this.getFindCheckRecordList(JSON.parse(data.item));
			} else {
				this.updateOrAdd = false;
			}
			// 监听事件
			uni.$on('pageData', (data) => {

				if (data.checkDict) {
					this.dataForm.safetyType = data.checkDict.itemValue
					this.dataForm.deviceTypeName = data.checkDict.itemName
				}
				if (data.checkItemData) {
					this.dataForm.deviceSysId = data.checkItemData.id
					this.dataForm.deviceSysName = data.checkItemData.deviceSysName
				}
			});
		},
		onUnload() {
			clearTimeout(this.timer)
			this.timer = null
			// 页面卸载时移除监听
			uni.$off('pageData');
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
				if (item.majorFirePotential == 1) {
					this.dataForm.majorFirePotentialDesc = true
				} else {
					this.dataForm.majorFirePotentialDesc = false
				}
				this.actions.forEach((data) => {
					if (data.value === item.safetyLevel) {
						this.dataForm.safetyLevelName = data.name
						this.dataForm.safetyLevel = data.value
					}
				})
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
			sexSelect(e) {
				this.dataForm.safetyLevelName = e.name
				this.dataForm.safetyLevel = e.value
				this.$refs.uForm.validateField(this.atSelect)
			},
			submit() {
				this.$refs.uForm.validate().then(res => {

					if (this.dataForm.majorFirePotentialDesc) {
						this.dataForm.majorFirePotential = 1
					} else {
						this.dataForm.majorFirePotential = 2
					}
					if (this.buttonLoading) {
						uni.$u.toast('请勿重复提交')
						return;
					}
					this.buttonLoading = true;

					if (this.dataForm.id) {
						modifyRiskProblem(this.dataForm).then(res => {
							if (res.status == 200) {
								uni.$u.toast('修改成功')
								this.updateOrAdd = true;
							}
						}).finally(() => {
							// 统一关闭loading
							this.buttonLoading = false;
						});
					} else {
						saveRiskProblem(this.dataForm).then(res => {
							if (res.status == 200) {
								uni.$u.toast('添加成功')
								this.timer = setTimeout(() => {
									this.goBack();
								}, 700);
							}

						}).finally(() => {
							// 统一关闭loading
							this.buttonLoading = false;
						});
					}

				}).catch(errors => {
					this.buttonLoading = false;
					// uni.$u.toast('校验失败')
				})
			},
			selectSystemItem() {
				if (!this.dataForm.safetyType) {
					this.$modal.showToast('请先选择系统名称')
					return;
				}
				this.$tab.navigateTo(
					`/pages/common/safety/selectDictItem?parentId=${this.dataForm.safetyType}&id=${this.dataForm.deviceSysId}`
				)
			},
			selectDict() {
				this.$tab.navigateTo(
					`/pages/common/safety/selectDict?selectIndex=${this.dataForm.safetyType}`
				)
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