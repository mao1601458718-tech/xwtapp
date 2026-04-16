<template>
	<view class="pageView" :style="'padding: '+statusBarHeight+'rpx 0 0 0 ;'">
		<view class="customTopView">
			<view class="customTop" :style="'height:'+statusBarHeight+'rpx'">
				<view class="customBottom">
					<view class="customTop1" @click="goBack"> <u-icon class="uIcon" name="arrow-left" color="#000000"
							size="23"></u-icon>
					</view>
					<view class="customTop2">建筑信息</view>
					<view class="customTop3" @click="updateOrAdd=true" v-if="!updateOrAdd">编辑</view>
					<view class="customTop3" @click="submit()" v-else>保存</view>
				</view>
			</view>
		</view>
		<view class="topView"></view>

		<view class="contentView" v-show="!updateOrAdd">
			<view class="contentInput">
				<view class="contentInput1">建筑名称</view>
				<view class="contentInput2">{{dataForm.buildingName}}</view>
			</view>
			<view class="contentInput">
				<view class="contentInput1">建筑地址</view>
				<view class="contentInput2">{{dataForm.address}}</view>
			</view>
			<view class="contentInput">
				<view class="contentInput1">建筑类别</view>
				<view class="contentInput2">{{dataForm.buildingTypeDesc}}</view>
			</view>
			<view class="contentInput">
				<view class="contentInput1">自动消防设施</view>
				<view class="contentInput2">{{dataForm.automaticFireFighting?"有":"无"}}</view>
			</view>
			<view class="contentInput">
				<view class="contentInput1">占地面积(m²)</view>
				<view class="contentInput2">{{dataForm.acreage}}</view>
			</view>
			<view class="contentInput">
				<view class="contentInput1">建筑面积(m²)</view>
				<view class="contentInput2">{{dataForm.buildingAcreage}}</view>
			</view>
			<view class="contentInput">
				<view class="contentInput1">建筑高度(M)</view>
				<view class="contentInput2">{{dataForm.height}}</view>
			</view>
			<view class="contentInput">
				<view class="contentInput1">楼层数(层)</view>
				<view class="contentInput2">{{dataForm.floorNumber}}</view>
			</view>

			<view class="contentInput">
				<view class="contentInput1">地上层层数</view>
				<view class="contentInput2">{{dataForm.upstairsFloor}}</view>
			</view>
			<view class="contentInput">
				<view class="contentInput1">地下层层数*</view>
				<view class="contentInput2">{{dataForm.undergroundFloor}}</view>
			</view>
			<view class="contentInput">
				<view class="contentInput1">安全出口数(个)</view>
				<view class="contentInput2">{{dataForm.safetyExitNumber}}</view>
			</view>
			<view class="contentInput">
				<view class="contentInput1">疏散楼梯数(个)</view>
				<view class="contentInput2">{{dataForm.evacuationStaircasesNumber}}</view>
			</view>
			<view class="contentInput">
				<view class="contentInput1">消防电梯数(个)</view>
				<view class="contentInput2">{{dataForm.fireLiftNumber}}</view>
			</view>
			<view class="contentInput">
				<view class="contentInput1">避难层楼层</view>
				<view class="contentInput2">{{dataForm.locationRefugeFloor}}</view>
			</view>
			<view class="contentInput">
				<view class="contentInput1">建筑描述：</view>
				<view class="contentInput2">{{dataForm.description}}</view>
			</view>

		</view>
		<view class="contentView" v-show="updateOrAdd">

			<u--form :model="dataForm" :rules="rules" ref="uForm">
				<u-form-item label="建筑名称" prop="buildingName" borderBottom required labelWidth="120">
					<u--input v-model="dataForm.buildingName" border="none" placeholder="请输入建筑名称"
						inputAlign="right"></u--input>
				</u-form-item>

				<u-form-item label="建筑地址" prop="address" borderBottom required labelWidth="120">
					<u--input v-model="dataForm.address" border="none" placeholder="请输入建筑地址"
						inputAlign="right"></u--input>
				</u-form-item>

				<u-form-item label="建筑类别" prop="buildingTypeDesc" borderBottom required labelWidth="120"
					@click="showSex=true">
					<text class="placeholderText" v-if="!dataForm.buildingTypeDesc">请选择建筑类别</text>
					<text class="placeholderValue" v-else>{{dataForm.buildingTypeDesc}}</text>

					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>

				<u-form-item label="自动消防设施" prop="automaticFireFighting" borderBottom labelWidth="120">
					<u-radio-group v-model="dataForm.automaticFireFighting" placement="row" activeColor="#FA8161">
						<u-radio style="margin-right: 50rpx;" label="有" :name="1"></u-radio>
						<u-radio style="margin-right: 50rpx;" label="无" :name="0"></u-radio>
					</u-radio-group>
				</u-form-item>

				<u-form-item label="占地面积(m²)" prop="acreage" borderBottom required labelWidth="120">
					<u--input v-model="dataForm.acreage" type="number" border="none" placeholder="请输入占地面积"
						inputAlign="right"></u--input>
				</u-form-item>

				<u-form-item label="建筑面积(m²)" prop="buildingAcreage" borderBottom required labelWidth="120">
					<u--input v-model="dataForm.buildingAcreage" type="number" border="none" placeholder="请输入建筑面积"
						inputAlign="right"></u--input>
				</u-form-item>

				<u-form-item label="建筑高度(m)" prop="height" borderBottom required labelWidth="120">
					<u--input v-model="dataForm.height" type="number" border="none" placeholder="请输入建筑高度"
						inputAlign="right"></u--input>
				</u-form-item>

				<u-form-item label="建筑楼层" prop="floorNumber" borderBottom required labelWidth="120">
					<u--input v-model="dataForm.floorNumber" type="number" border="none" placeholder="请输入建筑楼层"
						inputAlign="right"></u--input>
				</u-form-item>

				<u-form-item label="地上层数" prop="upstairsFloor" borderBottom required labelWidth="120">
					<u--input v-model="dataForm.upstairsFloor" type="number" border="none" placeholder="请输入地上层数"
						inputAlign="right"></u--input>
				</u-form-item>

				<u-form-item label="地下层数" prop="undergroundFloor" borderBottom required labelWidth="120">
					<u--input v-model="dataForm.undergroundFloor" type="number" border="none" placeholder="请输入地下层数"
						inputAlign="right"></u--input>
				</u-form-item>

				<u-form-item label="安全出口数(个)" prop="safetyExitNumber" borderBottom labelWidth="120">
					<u--input v-model="dataForm.safetyExitNumber" type="number" border="none" placeholder="请输入安全出口"
						inputAlign="right"></u--input>
				</u-form-item>

				<u-form-item label="疏散楼梯数(个)" prop="evacuationStaircasesNumber" borderBottom labelWidth="120">
					<u--input v-model="dataForm.evacuationStaircasesNumber" type="number" border="none"
						placeholder="请输入疏散楼梯数数" inputAlign="right"></u--input>
				</u-form-item>

				<u-form-item label="消防电梯数(个)" prop="fireLiftNumber" borderBottom labelWidth="120">
					<u--input v-model="dataForm.fireLiftNumber" type="number" border="none" placeholder="请输入消防电梯数"
						inputAlign="right"></u--input>
				</u-form-item>

				<u-form-item label="避难层楼层" prop="locationRefugeFloor" borderBottom labelWidth="120">
					<u--input v-model="dataForm.locationRefugeFloor" border="none" placeholder="请输入避难层楼层"
						inputAlign="right"></u--input>
				</u-form-item>


			</u--form>
			<!-- <view class="imgViewTitle">建筑描述</view> -->
			<view class="contentInput" style="padding: 20rpx 0;">
				<u--textarea v-model="dataForm.description" placeholder="请描述情况" height="120rpx" :adjustPosition="false"
					:confirmType="null" :maxlength="-1"></u--textarea>
			</view>

			<u-action-sheet :show="showSex" :actions="$store.state.user.buildingTypes" title="请选择"
				@close="showSex = false" @select="sexSelect">
			</u-action-sheet>
		</view>

	</view>
</template>

<script>
	import {
		updateBuilding,
		addBuilding
	} from '@/api/safety/safety.js'
	export default {
		data() {
			return {
				timer: null,
				buttonLoading: false,
				statusBarHeight: this.$store.state.user.statusBarHeight,
				dataForm: {
					"projectId": "",
					"checkProjectId": "",
					"buildingName": "",
					"address": "",
					"buildingType": "",
					"buildingTypeDesc": "",
					"automaticFireFighting": 0,
					"acreage": "",
					"buildingAcreage": "",
					"floorNumber": "",
					"height": "",
					"upstairsFloor": "",
					"undergroundFloor": "",
					"safetyExitNumber": "",
					"evacuationStaircasesNumber": "",
					"fireLiftNumber": "",
					"locationRefugeFloor": "",
					"description": "",
					"id": ""
				},
				showSex: false,
				updateOrAdd: false,
				imgList: [],
				radiovalue1: '苹果',
				rules: {
					buildingName: {
						type: 'string',
						required: true,
						message: '建筑名称不能为空',
						trigger: ['blur', 'change']
					},
					address: {
						type: 'string',
						required: true,
						message: '地址不能为空',
						trigger: ['blur', 'change']
					},
					buildingTypeDesc: {
						type: 'string',
						required: true,
						message: '建筑类别不能为空',
						trigger: ['blur', 'change']
					},
					buildingAcreage: {
						type: 'number',
						required: true,
						message: '建筑面积不能为空',
						trigger: ['blur', 'change']
					},
					acreage: {
						type: 'number',
						required: true,
						message: '占地面积不能为空',
						trigger: ['blur', 'change']
					},
					floorNumber: {
						type: 'number',
						required: true,
						message: '楼层不能为空',
						trigger: ['blur', 'change']
					},
					height: {
						type: 'number',
						required: true,
						message: '建筑高度不能为空',
						trigger: ['blur', 'change']
					},
					undergroundFloor: {
						type: 'number',
						required: true,
						message: '地下层数不能为空',
						trigger: ['blur', 'change']
					},
					upstairsFloor: {
						type: 'number',
						required: true,
						message: '地上层数不能为空',
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
			if (data.item && data.item != "null") {
				this.updateOrAdd = false;
				this.getBuildingInfo(JSON.parse(data.item))
			} else {
				this.updateOrAdd = true;
			}
			this.dataForm.checkProjectId = this.$store.state.user.checkProject.id;
			this.dataForm.projectId = this.$store.state.user.projectId;
			this.dataForm.createUserName = this.$store.state.user.nickName;

		},
		onReady() {
			this.$refs.uForm.setRules(this.rules)
		},
		methods: {
			goBack() {
				uni.navigateBack();
			},
			getBuildingInfo(item) {
				Object.keys(this.dataForm).forEach(key => {
					if (item.hasOwnProperty(key)) {
						this.dataForm[key] = item[key];
					}
				});
				this.$store.state.user.buildingTypes.forEach((item) => {
					if (item.value == this.dataForm.buildingType) {
						this.dataForm.buildingTypeDesc = item.name
					}
				})
			},
			sexSelect(e) {
				this.dataForm.buildingType = e.value
				this.dataForm.buildingTypeDesc = e.name
			},
			submit() {

				this.$refs.uForm.validate().then(res => {
					if (this.buttonLoading) {
						uni.$u.toast('请勿重复提交')
						return;
					}
					this.buttonLoading = true;
					if (this.dataForm.id) {
						updateBuilding(this.dataForm).then(res => {
							uni.$u.toast('修改成功')
							this.updateOrAdd = false;
						}).finally(() => {
							// 统一关闭loading
							this.buttonLoading = false;
						});
					} else {
						addBuilding(this.dataForm).then(res => {
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