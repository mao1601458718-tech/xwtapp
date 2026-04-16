<template>
	<view class="pageView" :style="'padding: '+statusBarHeight+'rpx 0 0 0 ;'">
		<view class="customTopView">
			<view class="customTop" :style="'height:'+statusBarHeight+'rpx'">
				<view class="customBottom">
					<view class="customTop1" @click="goBack"> <u-icon class="uIcon" name="arrow-left" color="#000000"
							size="23"></u-icon>
					</view>
					<view class="customTop2">新建排查</view>
					<view class="customTop3" @click="updateOrAdd=true" v-if="!updateOrAdd">编辑</view>
					<view class="customTop3" @click="submit()" v-else>保存</view>
				</view>
			</view>
		</view>
		<view class="topView"></view>

		<view class="contentView" v-show="!updateOrAdd">
			<!-- 	<view class="contentInput">
				<view class="contentInput1">排查状态</view>
				<view class="contentInput2">{{dataForm.investigationStatus}}</view>
			</view> -->
			<view class="contentInput">
				<view class="contentInput1">排查对象</view>
				<view class="contentInput2">{{dataForm.standardName}}</view>
			</view>
			<view class="contentInput">
				<view class="contentInput1">详细地址</view>
				<view class="contentInput2">{{dataForm.address}}</view>
			</view>
			<view class="contentInput">
				<view class="contentInput1">联系人</view>
				<view class="contentInput2">{{dataForm.contacts}}</view>
			</view>
			<view class="contentInput">
				<view class="contentInput1">联系电话</view>
				<view class="contentInput2">{{dataForm.phone}}</view>
			</view>
			<view class="contentInput">
				<view class="contentInput1">排查人</view>
				<view class="contentInput2">{{dataForm.investigator}}</view>
			</view>
			<view class="contentInput">
				<view class="contentInput1">排查类型</view>
				<view class="contentInput2">{{dataForm.placeTypeDesc}}</view>
			</view>
			<view class="contentInput">
				<view class="contentInput1">营业状态</view>
				<view class="contentInput2">{{dataForm.businessStatusDesc}}</view>
			</view>
			<view class="contentInput">
				<view class="contentInput1">定位</view>
				<view class="contentInput2">{{dataForm.location}}</view>
			</view>

			<view class="contentInput">
				<view class="contentInput1">村居</view>
				<view class="contentInput2">{{dataForm.committee}}</view>
			</view>
			<view class="contentInput">
				<view class="contentInput1">整治责任区</view>
				<view class="contentInput2">{{dataForm.remediationArea}}</view>
			</view>
			<view class="contentInput">
				<view class="contentInput1">使用功能</view>
				<view class="contentInput2">{{dataForm.usageFunction}}</view>
			</view>
			<view class="contentInput">
				<view class="contentInput1">是否与政府提供台账使用功能一致</view>
				<view class="contentInput2">{{dataForm.consistent}}</view>
			</view>
			<view class="contentInput">
				<view class="contentInput1">现有消防设施</view>
				<view class="contentInput2">{{dataForm.fireFightingFacilities}}</view>
			</view>
			<view class="contentInput" v-if="dataForm.investigationStatus==3||dataForm.investigationStatus==2">
				<view class="contentInput1">排查报告</view>
				<view class="contentInput2">
					<view style="color: #3880ff;" v-if="dataForm.investigationStatus==3&&dataForm.reportUrl"
						@click="goFacilityList(dataForm.reportUrl)">
						查看报告</view>
					<view style="color: #3880ff;" v-if="dataForm.investigationStatus==2"
						@click="postSaveDangerReport()">生成报告</view>
				</view>
			</view>
			<view class="imageTab">
				<image class="image" v-for="(item,index) in imgList" :key="index" :src="item.src"></image>
			</view>
		</view>
		<view class="contentView" v-show="updateOrAdd">

			<u--form :model="dataForm" :rules="rules" ref="uForm">
				<u-form-item label="排查对象" prop="standardName" borderBottom required labelWidth="120">
					<u--input v-model="dataForm.standardName" border="none" placeholder="请输入排查对象"
						inputAlign="right"></u--input>
				</u-form-item>

				<u-form-item label="详细地址" prop="address" borderBottom required labelWidth="120">
					<u--input v-model="dataForm.address" @blur="changeInput" border="none" placeholder="请输入详细地址"
						inputAlign="right"></u--input>
				</u-form-item>

				<u-form-item label="联系人" prop="contacts" borderBottom required labelWidth="120">
					<u--input v-model="dataForm.contacts" border="none" placeholder="请输入联系人"
						inputAlign="right"></u--input>
				</u-form-item>

				<u-form-item label="联系电话" prop="phone" borderBottom required labelWidth="120">
					<u--input v-model="dataForm.phone" border="none" placeholder="请输入联系电话"
						inputAlign="right"></u--input>
				</u-form-item>

				<u-form-item label="排查人" prop="investigator" borderBottom required labelWidth="120">
					<u--input v-model="dataForm.investigator" border="none" placeholder="请输入排查人"
						inputAlign="right"></u--input>
				</u-form-item>

				<u-form-item label="排查类型" prop="placeTypeDesc" borderBottom required labelWidth="120"
					@click="clickShowSex('placeType')">
					<text class="placeholderText" v-if="!dataForm.placeTypeDesc">请选择排查类型</text>
					<text class="placeholderValue" v-else>{{dataForm.placeTypeDesc}}</text>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>

				<u-form-item label="营业状态" prop="businessStatusDesc" borderBottom required labelWidth="120"
					@click="clickShowSex('businessStatus')">
					<u--input v-model="dataForm.businessStatusDesc" style="background-color: #fff;" disabled
						border="none" placeholder="请选择营业状态" inputAlign="right"></u--input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>

				<!-- <u-form-item label="定位" prop="location" borderBottom labelWidth="120">
					<u--input v-model="dataForm.location" border="none" placeholder="请输入定位"
						inputAlign="right"></u--input>
				</u-form-item> -->

				<u-form-item label="村居" prop="committee" borderBottom labelWidth="120">
					<u--input v-model="dataForm.committee" border="none" placeholder="请输入村居"
						inputAlign="right"></u--input>
				</u-form-item>

				<u-form-item label="整治责任区" prop="remediationArea" borderBottom labelWidth="120">
					<u--input v-model="dataForm.remediationArea" border="none" placeholder="请输入整治责任区"
						inputAlign="right"></u--input>
				</u-form-item>

				<u-form-item label="使用功能" prop="usageFunction" borderBottom labelWidth="120">
					<u--input v-model="dataForm.usageFunction" border="none" placeholder="请输入使用功能"
						inputAlign="right"></u--input>
				</u-form-item>

				<u-form-item label="是否与政府提供台账使用功能一致" prop="consistent" borderBottom labelWidth="120">
					<u--input v-model="dataForm.consistent" border="none" placeholder="请输入定位"
						inputAlign="right"></u--input>
				</u-form-item>

				<u-form-item label="现有消防设施" prop="fireFightingFacilities" borderBottom labelWidth="120">
					<u--input v-model="dataForm.fireFightingFacilities" border="none" placeholder="请输入定位"
						inputAlign="right"></u--input>
				</u-form-item>

			</u--form>
			<!-- <view class="imgViewTitle">建筑描述</view> -->
			<view class="contentInput" style="padding: 20rpx 0;">
				<u--textarea v-model="dataForm.info" placeholder="请描述情况" height="120rpx" :maxlength="-1"
					:adjustPosition="false" :confirmType="null"></u--textarea>
			</view>
			<img-view class="contentViewImg" :imgListData="imgList" :imgSum="2" @uploadSucceed="uploadSucceed"
				@removeImg="removeImg"></img-view>
			<u-action-sheet :show="showSex" :actions="actionList" title="请选择" @close="showSex = false"
				@select="sexSelect">
			</u-action-sheet>
		</view>

	</view>
</template>

<script>
	import {
		findCheckStandardList,
		savePlace,
		saveDangerReport
	} from '@/api/danger/danger.js'

	import {
		getGeo
	} from '@/api/project/project.js'

	import imgView from "@/pages/common/uploadImg.vue"
	export default {
		components: {
			imgView
		},
		data() {
			return {
				timer: null,
				buttonLoading: false,
				statusBarHeight: this.$store.state.user.statusBarHeight,
				dataForm: {
					address: "",
					businessStatus: "",
					businessStatusDesc: "",
					checkProjectId: "",
					committee: "",
					consistent: "",
					contacts: "",
					createTime: "",
					fireFightingFacilities: "",
					id: "",
					imgUrls: "",
					info: "",
					investigationStatus: "",
					investigator: "",
					phone: "",
					lng: "",
					lat: "",
					placeName: "",
					placeType: "",
					placeTypeDesc: "",
					projectId: "",
					remediationArea: "",
					standardName: "",
					status: "",
					usageFunction: "",
					reportUrl: "",
				},
				showSex: false,
				updateOrAdd: false,
				imgList: [],
				atAction: "",
				actionList: [],
				dangerList: [],
				businessList: [{
					name: "正常",
					value: 1
				}, {
					name: "关门",
					value: 2
				}, {
					name: "停业",
					value: 3
				}, {
					name: "其他",
					value: 4
				}],
				radiovalue1: '苹果',
				rules: {
					standardName: {
						type: 'string',
						required: true,
						message: '排查对象不能为空',
						trigger: ['blur', 'change']
					},
					address: {
						type: 'string',
						required: true,
						message: '地址不能为空',
						trigger: ['blur', 'change']
					},
					phone: {
						type: 'string',
						required: true,
						message: '联系人不能为空',
						trigger: ['blur', 'change']
					},
					contacts: {
						type: 'string',
						required: true,
						message: '联系电话不能为空',
						trigger: ['blur', 'change']
					},
					businessStatusDesc: {
						type: 'string',
						required: true,
						message: '营业状态不能为空',
						trigger: ['blur', 'change']
					},
					placeTypeDesc: {
						type: 'string',
						required: true,
						message: '排查类型不能为空',
						trigger: ['blur', 'change']
					}
				},
			}
		},
		onUnload() {
			clearTimeout(this.timer)
			this.timer = null

		},
		onLoad(data) {
			this.getFindCheckStandardList();
			if (data.item && data.item != "null") {
				this.updateOrAdd = false;
				this.getBuildingInfo(JSON.parse(data.item))
			} else {
				this.updateOrAdd = true;
			}
			this.dataForm.checkProjectId = this.$store.state.user.checkProject.id;
			this.dataForm.projectId = this.$store.state.user.projectId;
			this.dataForm.contacts = this.$store.state.user.nickName;

		},
		onReady() {
			this.$refs.uForm.setRules(this.rules)
		},
		methods: {
			changeInput(value) {
				if (value) {
					let data = {
						address: value
					}
					getGeo(data).then(res => {
						if (res.status) {
							this.dataForm.lat = res.obj.lat;
							this.dataForm.lng = res.obj.lng;
						}
					})
				}

			},
			postSaveDangerReport() {

				let data = {
					"projectId": this.dataForm.projectId,
					"checkProjectId": this.dataForm.checkProjectId,
					"id": this.dataForm.checkProjectId,
					"placeId": this.dataForm.id
				}
				this.$modal.loading('报告生成中...')
				saveDangerReport(data).then(res => {
					if (res.object) {
						this.goFacilityList(res.object)
					}
				})
			},
			goFacilityList(reportUrl) {
				let url = reportUrl
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
					}
				});
			},
			getFindCheckStandardList() {
				let data = {
					"projectId": this.$store.state.user.projectId,
					"checkProjectId": this.$store.state.user.checkProject.id,
					"placeId": ""
				}
				this.dangerList = [];
				findCheckStandardList(data).then(res => {
					if (res.listObj) {
						res.listObj.forEach((item) => {
							this.dangerList.push({
								value: item.id,
								name: item.standardName
							})
						})
					}
				})
			},
			clickShowSex(type) {
				this.atAction = type;
				if (type == "businessStatus") {
					this.actionList = this.businessList;
				} else {
					this.actionList = this.dangerList;
				}
				this.showSex = true;
			},
			goBack() {
				uni.navigateBack();
			},
			getBuildingInfo(item) {
				Object.keys(this.dataForm).forEach(key => {
					if (item.hasOwnProperty(key)) {
						this.dataForm[key] = item[key];
					}
				});

				if (item.imgUrls) {
					let imgs = item.imgUrls.split(";");
					imgs.forEach((item) => {
						this.imgList.push({
							src: item,
							text: "上传成功",
							uploading: 1
						});
					})
				}

				this.dangerList.forEach((item) => {
					if (item.value == this.dataForm.placeType) {
						this.dataForm.placeTypeDesc = item.name
					}
				})
				this.businessList.forEach((item) => {
					if (item.value == this.dataForm.businessStatus) {
						this.dataForm.businessStatusDesc = item.name
					}
				})
			},
			sexSelect(e) {
				if (this.atAction == "businessStatus") {
					this.dataForm.businessStatus = e.value
					this.dataForm.businessStatusDesc = e.name
				} else {
					this.dataForm.placeType = e.value
					this.dataForm.placeTypeDesc = e.name
				}

			},
			submit() {

				this.$refs.uForm.validate().then(res => {

					if (this.buttonLoading) {
						uni.$u.toast('请勿重复提交')
						return;
					}
					this.buttonLoading = true;
					savePlace(this.dataForm).then(res => {
						uni.$u.toast('保存成功')
						this.timer = setTimeout(() => {
							this.goBack();
						}, 700);
					}).finally(() => {
						// 统一关闭loading
						this.buttonLoading = false;
					});


				}).catch(errors => {
					this.buttonLoading = false;
				})
			},
			removeImg(data) {

				if (data.length == 0) {
					this.dataForm.imgUrls = "";
				} else {
					let list = [];
					data.forEach((item) => {
						if (item.src) {
							list.push(item.src);
						}
					})
					this.dataForm.imgUrls = list.join(';');
				}
			},
			uploadSucceed(data) {
				if (data.length == 0) {
					this.dataForm.imgUrls = "";
				} else {
					let list = [];
					data.forEach((item) => {
						if (item.src) {
							list.push(item.src);
						}
					})
					this.dataForm.imgUrls = list.join(';');
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

	.contentViewImg {
		padding: 0 !important;
	}
</style>