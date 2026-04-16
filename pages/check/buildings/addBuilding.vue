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
				<view class="contentInput1">建筑高度</view>
				<view class="contentInput2">{{dataForm.height}}m</view>
			</view>
			<view class="contentInput">
				<view class="contentInput1">建筑面积</view>
				<view class="contentInput2">{{dataForm.acreage}}m²</view>
			</view>
			<view class="contentInput">
				<view class="contentInput1">地上层层数</view>
				<view class="contentInput2">{{dataForm.upstairsFloor}}</view>
			</view>
			<view class="contentInput">
				<view class="contentInput1">地下层层数*</view>
				<view class="contentInput2">{{dataForm.undergroundFloor}}</view>
			</view>
		</view>
		<view class="contentView" v-show="updateOrAdd">

			<u--form :model="dataForm" :rules="rules" ref="uForm">
				<u-form-item label="建筑名称" prop="buildingName" borderBottom required labelWidth="120">
					<u--input v-model="dataForm.buildingName" border="none" placeholder="请输入建筑名称"
						inputAlign="right"></u--input>
				</u-form-item>
				<u-form-item label="建筑高度(m)" prop="height" borderBottom required labelWidth="120">
					<u--input v-model="dataForm.height" type="number" border="none" placeholder="请输入建筑高度"
						inputAlign="right"></u--input>
				</u-form-item>
				<u-form-item label="建筑面积(m²)" prop="acreage" borderBottom required labelWidth="120">
					<u--input v-model="dataForm.acreage" type="number" border="none" placeholder="请输入建筑面积"
						inputAlign="right"></u--input>
				</u-form-item>
				<u-form-item label="地上层数" prop="upstairsFloor" borderBottom required labelWidth="120">
					<u--input v-model="dataForm.upstairsFloor" @change="clickSearchValue('upstairsFloor')" type="number"
						border="none" placeholder="请输入地上层数" inputAlign="right"></u--input>
				</u-form-item>

				<u-form-item label="地下层数" prop="undergroundFloor" borderBottom required labelWidth="120">
					<u--input v-model="dataForm.undergroundFloor" @change="clickSearchValue('undergroundFloor')"
						type="number" border="none" placeholder="请输入地下层数" inputAlign="right"></u--input>
				</u-form-item>

			</u--form>
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
	} from '@/api/project/project.js'
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
					"acreage": "",
					"height": "",
					"upstairsFloor": "",
					"undergroundFloor": "",
					"id": ""
				},
				buildingFloor: [],
				undergroundFloorList: [],
				upstairsFloorList: [],
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
					acreage: {
						type: 'number',
						required: true,
						message: '建筑面积不能为空',
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
		onUnload() {
			clearTimeout(this.timer)
			this.timer = null

		},
		onReady() {
			this.$refs.uForm.setRules(this.rules)
		},
		methods: {
			goBack() {
				uni.navigateBack();
			},
			clickSearchValue(type) {
				if (type == 'upstairsFloor' && this.dataForm.upstairsFloor) {
					this.upstairsFloorList = [];
					for (let i = 1; i <= this.dataForm.upstairsFloor; i++) {
						this.upstairsFloorList.push({
							"floorName": i + "F",
							"floor": i,
							"imageUrl": ""
						})
					}
				} else if (type == 'undergroundFloor') {
					this.undergroundFloorList = [];
					for (let i = 1; i <= this.dataForm.undergroundFloor; i++) {
						this.undergroundFloorList.push({
							"floorName": "B" + i,
							"floor": -i,
							"imageUrl": ""
						})
					}
				}
			},
			getBuildingInfo(item) {
				Object.keys(this.dataForm).forEach(key => {
					if (item.hasOwnProperty(key)) {
						this.dataForm[key] = item[key];
					}
				});

			},
			sexSelect(e) {
				this.dataForm.buildingType = e.value
				this.dataForm.buildingTypeDesc = e.name
			},
			submit() {
				this.buildingFloor = [];
				this.buildingFloor.push(...this.upstairsFloorList)
				this.buildingFloor.push(...this.undergroundFloorList)
				let data = {
					building: this.dataForm,
					buildingFloor: this.buildingFloor
				}


				this.$refs.uForm.validate().then(res => {
					if (this.dataForm.id) {
						if (this.buttonLoading) {
							uni.$u.toast('请勿重复提交')
							return;
						}
						this.buttonLoading = true;
						updateBuilding(data).then(res => {
							if (res.status == 200) {
								uni.$u.toast('修改成功')
								this.updateOrAdd = false;
							}

						}).finally(() => {
							// 统一关闭loading
							this.buttonLoading = false;
						});
					} else {
						if (this.buttonLoading) {
							uni.$u.toast('请勿重复提交')
							return;
						}
						this.buttonLoading = true;
						addBuilding(data).then(res => {
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