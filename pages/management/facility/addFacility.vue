<template>
	<view class="paveView">
		<view class="topView"></view>
		<view class="liListView">

			<u--form :model="dataForm" :rules="rules" ref="uForm">
				<u-form-item label="所在建筑" prop="buildingName" borderBottom required @click="selectBuilding()"
					labelWidth="120">
					<text class="placeholderText" v-if="!dataForm.buildingName">请选择所在建筑</text>
					<text class="placeholderValue" v-else>{{dataForm.buildingName}}</text>

					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
				<u-form-item label="所在楼层" prop="floorName" borderBottom required @click="selectBuilding()"
					labelWidth="120">
					<text class="placeholderText" v-if="!dataForm.floorName">请选择所在楼层</text>
					<text class="placeholderValue" v-else>{{dataForm.floorName}}</text>

					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
				<u-form-item label="系统名称" prop="deviceSysName" borderBottom required @click="selectSystem()"
					labelWidth="120">
					<text class="placeholderText" v-if="!dataForm.deviceSysName">请选择系统名称</text>
					<text class="placeholderValue" v-else>{{dataForm.deviceSysName}}</text>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
				<u-form-item label="设备名称" prop="deviceTypeName" borderBottom required @click="selectSystemItem()"
					labelWidth="120">
					<text class="placeholderText" v-if="!dataForm.deviceTypeName">请选择设备名称</text>
					<text class="placeholderValue" v-else>{{dataForm.deviceTypeName}}</text>

					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>

				<u-form-item label="生产厂家" prop="manufacturer" borderBottom labelWidth="120">
					<u--input v-model="dataForm.manufacturer" border="none" placeholder="请输入生产厂家"
						inputAlign="right"></u--input>
				</u-form-item>
				<u-form-item label="设备数量" prop="checkNum" borderBottom required labelWidth="120">
					<u--input v-model="dataForm.checkNum" type="number" border="none" placeholder="请输入设备数量"
						inputAlign="right"></u--input>
				</u-form-item>
				<u-form-item label="具体位置" prop="address" borderBottom required labelWidth="120">
					<u--input v-model="dataForm.address" border="none" placeholder="请输入具体位置"
						inputAlign="right"></u--input>
				</u-form-item>
				<u-form-item label="型号规格" prop="productModel" borderBottom required labelWidth="120">
					<u--input v-model="dataForm.productModel" border="none" placeholder="请输入型号规格"
						inputAlign="right"></u--input>
				</u-form-item>

			</u--form>

		</view>
		<img-view :imgListData="imgList" :imgSum="2" @uploadSucceed="uploadSucceed" @removeImg="removeImg"></img-view>
		<view class="bottomView1" v-if="!dataForm.checkPointId">
			<view class="viewLeft" @click="submit(true)">保存并继续添加</view>
			<view class="viewRight" @click="submit(false)">保 存</view>
		</view>
		<view class="bottomView" v-else>
			<view class="viewLeft" @click="submit(false)">保 存</view>
		</view>
	</view>
</template>

<script>
	import {
		modifyCheckPoint,
		saveCheckPoint
	} from '@/api/maintenance/maintenance'
	import imgView from "@/pages/common/uploadImg.vue"
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
					"buildingName": "",
					"floorName": "",
					"checkProjectId": "",
					"buildingId": "",
					"buildingFloorId": "",
					"deviceSysId": "",
					"deviceSysName": "",
					"deviceTypeId": "",
					"deviceTypeName": "",
					"manufacturer": "",
					"productModel": "",
					"checkNum": "",
					"address": "",
					"relevantFilePath": "",
					"checkPointId": "",
				},
				imgList: [],
				rules: {
					buildingName: {
						type: 'string',
						required: true,
						message: '所在建筑不能为空',
						trigger: ['blur', 'change']
					},
					floorName: {
						type: 'string',
						required: true,
						message: '所在楼层不能为空',
						trigger: ['blur', 'change']
					},
					deviceSysName: {
						type: 'string',
						required: true,
						message: '系统名称',
						trigger: ['blur', 'change']
					},
					deviceTypeName: {
						type: 'string',
						required: true,
						message: '设备名称',
						trigger: ['blur', 'change']
					},
					productModel: {
						type: 'string',
						required: true,
						message: '型号规格不能为空',
						trigger: ['blur', 'change']
					},
					address: {
						type: 'string',
						required: true,
						message: '具体位置不能为空',
						trigger: ['blur', 'change']
					},
					checkNum: {
						type: "number",
						required: true,
						message: '设备数量不能为空',
						trigger: ['blur', 'change']
					}
				},
			};
		},
		onUnload() {
			// 页面卸载时移除监听
			clearTimeout(this.timer)
			this.timer = null
			uni.$off('pageData');
		},
		onLoad(data) {
			if (data.item && data.item != "null") {
				this.goAddFacility(JSON.parse(data.item))
			}
			this.dataForm.checkProjectId = this.$store.state.user.checkProject.id;
			this.dataForm.projectId = this.$store.state.user.projectId;

			// 监听事件
			uni.$on('pageData', (data) => {

				if (data.itemFloor && data.item) {
					this.dataForm.floorName = data.itemFloor.floorName
					this.dataForm.buildingFloorId = data.itemFloor.id
					this.dataForm.buildingId = data.item.id
					this.dataForm.buildingName = data.item.buildingName
				}
				if (data.deviceData) {
					this.dataForm.deviceSysId = data.deviceData.id
					this.dataForm.deviceSysName = data.deviceData.deviceSysName

					this.dataForm.deviceTypeId = ""
					this.dataForm.deviceTypeName = ""
				}
				if (data.deviceTypeData) {
					this.dataForm.deviceTypeId = data.deviceTypeData.id
					this.dataForm.deviceTypeName = data.deviceTypeData.deviceSysName
				}
			});
		},
		methods: {
			selectBuilding() {
				this.$tab.navigateTo(
					`/pages/common/selectBuildings?buildingId=${this.dataForm.buildingId}&buildingFloorId=${this.dataForm.buildingFloorId}`
				)
			},
			goAddFacility(item) {

				Object.keys(this.dataForm).forEach(key => {
					if (item.hasOwnProperty(key)) {
						this.dataForm[key] = item[key];
					}
				});

				this.dataForm.checkPointId = item.id;

				if (item.relevantFilePath) {
					let imgs = item.relevantFilePath.split(";");
					console.log(imgs)
					console.log(item.relevantFilePath)
					imgs.forEach((item) => {
						this.imgList.push({
							src: item,
							text: "上传成功",
							uploading: 1
						});
					})
				}
			},
			selectSystemItem() {
				if (!this.dataForm.deviceSysId) {
					this.$modal.showToast('请先选择系统名称')
					return;
				}
				this.$tab.navigateTo(
					`/pages/common/selectSystemItem?parentId=${this.dataForm.deviceSysId}&id=${this.dataForm.deviceTypeId}`
				)
			},
			submit(add) {
				this.$refs.uForm.validate().then(res => {
					// uni.$u.toast('校验通过')
					if (this.buttonLoading) {
						uni.$u.toast('请勿重复提交')
						return;
					}
					this.buttonLoading = true;
					if (this.dataForm.checkPointId) {
						modifyCheckPoint(this.dataForm).then(res => {
							if (res.status == 200) {
								uni.$u.toast('修改成功')
								this.timer = setTimeout(() => {
									uni.navigateBack();
								}, 700);
							}

						}).finally(() => {
							// 统一关闭loading
							this.buttonLoading = false;
						});
					} else {
						saveCheckPoint(this.dataForm).then(res => {
							if (res.status == 200) {
								uni.$u.toast('添加成功')
								if (add) {
									this.dataForm.address = "";
									this.dataForm.checkNum = ""
									this.dataForm.productModel = ""
									this.dataForm.manufacturer = ""
								} else {
									this.timer = setTimeout(() => {
										uni.navigateBack();
									}, 700);
								}
							}

						}).finally(() => {
							// 统一关闭loading
							this.buttonLoading = false;
						});


					}


				}).catch(errors => {
					this.buttonLoading = false;
					uni.$u.toast('校验失败')
				})
			},
			selectSystem() {
				this.$tab.navigateTo(`/pages/common/selectDeviceSystem?id=${this.dataForm.deviceSysId}`)
			},
			selectSystemItem() {
				if (!this.dataForm.deviceSysId) {
					this.$modal.showToast('请先选择系统名称')
					return;
				}
				this.$tab.navigateTo(
					`/pages/common/selectSystemItem?parentId=${this.dataForm.deviceSysId}&id=${this.dataForm.deviceTypeId}`
				)
			},
			removeImg(data) {

				if (data.length == 0) {
					this.dataForm.relevantFilePath = "";
				} else {
					let list = [];
					data.forEach((item) => {
						if (item.src) {
							list.push(item.src);
						}
					})
					this.dataForm.relevantFilePath = list.join(';');
				}
			},
			uploadSucceed(data) {
				if (data.length == 0) {
					this.dataForm.relevantFilePath = "";
				} else {
					let list = [];
					data.forEach((item) => {
						if (item.src) {
							list.push(item.src);
						}
					})
					this.dataForm.relevantFilePath = list.join(';');
				}
			}

		}
	}
</script>

<style lang="scss" scoped>
	.paveView {
		width: 100%;
		min-height: 100vh;
		height: auto;
		background-color: #fff;
		padding: 0 0 300rpx 0;

		.topView {
			width: 100%;
			height: 20rpx;
			background-color: #F7F7F7;
		}

		.liListView {
			padding: 0 30rpx;
			height: auto;

			.litView {
				height: 88rpx;
				width: 100%;
				border-bottom: 1rpx solid #eee;
				display: flex;
				justify-content: space-between;
				align-items: center;


				.liTitle {
					height: 40rpx;
					font-family: PingFang SC, PingFang SC;
					font-weight: 400;
					font-size: 28rpx;
					color: #333333;
					text-align: left;
					font-style: normal;
					text-transform: none;
				}

				.liRight {
					display: flex;
					align-items: center;

					.liText {
						margin-right: 25rpx;
						width: 10rpx;
						height: 34rpx;
						font-family: PingFang SC, PingFang SC;
						font-weight: 400;
						font-size: 24rpx;
						color: #999999;
						text-align: right;
						font-style: normal;
						text-transform: none;
					}
				}
			}
		}
	}

	.bottomView1 {
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
			background: #F7F7F7;
			border-radius: 12rpx 12rpx 12rpx 12rpx;
			line-height: 84rpx;
			font-family: PingFang SC, PingFang SC;
			font-weight: 500;
			font-size: 28rpx;
			color: #FA8161;
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
			font-size: 28rpx;
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
</style>