<template>
	<view class="pageView">
		<view class="topView">
			<view class="topTitleView">
				<image class="topTitle1" src="/static/images/check/check2.png"></image>
				<view class="topTitle2 topTitle3 u-line-1">单位名称：{{$store.state.user.checkProject.checkProjectName}}
				</view>
			</view>
			<view class="topTitleView">
				<image class="topTitle1" src="/static/images/check/check1.png"></image>
				<view class="topTitle2  u-line-1">地址：{{$store.state.user.checkProject.address}}</view>
			</view>
		</view>
		<scroll-view class="liListView" scroll-y>
			<view class="contentView">
				<u--form :model="dataForm" :rules="rules" ref="uForm">
					<u-form-item label="建筑名称" prop="buildingName" required borderBottom @click="selectBuilding()"
						labelWidth="120">
						<text class="placeholderText" v-if="!dataForm.buildingName">请选择所在建筑</text>
						<text class="placeholderValue" v-else>{{dataForm.buildingName}}</text>
						<u-icon slot="right" name="arrow-right"></u-icon>
					</u-form-item>
					<u-form-item label="所在楼层" prop="buildingFloorName" required borderBottom @click="selectBuilding()"
						labelWidth="120">
						<text class="placeholderText" v-if="!dataForm.buildingFloorName">请选择所在楼层</text>
						<text class="placeholderValue" v-else>{{dataForm.buildingFloorName}}</text>
						<u-icon slot="right" name="arrow-right"></u-icon>
					</u-form-item>
					<u-form-item label="检测类别" prop="deviceTypeName" borderBottom required @click="selectDeviceType()"
						labelWidth="120">
						<text class="placeholderText" v-if="!dataForm.deviceTypeName">请选择检测类别</text>
						<text class="placeholderValue" v-else>{{dataForm.deviceTypeName}}</text>
						<u-icon slot="right" name="arrow-right"></u-icon>
					</u-form-item>
					<u-form-item label="具体位置" prop="address" borderBottom labelWidth="120">
						<u--input v-model="dataForm.address" border="none" placeholder="请输入具体位置"
							inputAlign="right"></u--input>
					</u-form-item>
					<u-form-item label="数量" prop="checkNum" borderBottom labelWidth="120">
						<u--input v-model="dataForm.checkNum" type="number" border="none" placeholder="请输入数量"
							inputAlign="right"></u--input>
					</u-form-item>

				</u--form>
				<view class="contentInput" style="padding: 20rpx 0;">
					<u--textarea v-model="dataForm.memo" placeholder="请描述情况" height="120rpx" :adjustPosition="false"
						:confirmType="null" :maxlength="-1"></u--textarea>
				</view>

			</view>

			<view class="contentView">
				<view class="viewTop2">
					<view class="viewTab " :class="itemCurrent==1?'onViewTab':''" @click="changePage(1)">全合格</view>
					<view class="viewTab" :class="itemCurrent==3?'onViewTab':''" @click="changePage(3)">全无</view>
					<view class="viewTab" :class="itemCurrent==2?'onViewTab':''" @click="changePage(2)">全不合格</view>
				</view>
				<view>
					<view class="radioListView" v-for="(item,index) in checkItemList" :key="index">
						<view class="radioTitleView">{{index+1}}.{{item.checkName}}</view>
						<view class="radioView">
							<u-radio-group v-model="item.checkResult" placement="row">
								<u-radio :customStyle="{marginRight: '24rpx'}" activeColor="#FA8161" label="合格"
									:name="1">
								</u-radio>
								<u-radio :customStyle="{marginRight: '24rpx'}" activeColor="#FA8161" label="不合格"
									:name="2">
								</u-radio>
								<u-radio :customStyle="{marginRight: '24rpx'}" activeColor="#FA8161" label="无此项"
									:name="3">
								</u-radio>
							</u-radio-group>

							<u-number-box v-model="item.checkNum" :step="1" button-size="25" integer
								:min="0"></u-number-box>
						</view>
					</view>
				</view>
			</view>

			<img-view :imgListData="imgList" :imgSum="2" @uploadSucceed="uploadSucceed"
				@removeImg="removeImg"></img-view>
			<view class="scrollBottom"></view>
		</scroll-view>
		<view class="bottomView">
			<view class="viewLeft" @click="postCheckRecord()">提 交</view>
		</view>
	</view>
</template>

<script>
	import {
		findCheckItemList,
		saveCheckRecord
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
				checkInfo: "",
				checkItemInfo: "",
				checkItemList: [],
				itemCurrent: 0,
				dataForm: {
					"id": "",
					"buildingId": "",
					"buildingFloorId": "",
					"buildingFloorName": "",
					"buildingName": "",
					"checkProjectId": "",
					"deviceSysName": "",
					"checkNum": "",
					"address": "",
					"memo": "",
					"deviceSysId": "",
					"deviceSysCode": "",
					"deviceTypeId": "",
					"deviceTypeName": "",
					"deviceTypeCode": "",
					"imgUrl": "",
				},
				//全部检测项
				deviceTypeList: [],
				itemIndex: "",


				imgList: [],
				// 基本案列数据

				rules: {
					// address: {
					// 	type: 'string',
					// 	required: true,
					// 	message: '位置不能为空',
					// 	trigger: ['blur', 'change']
					// },
					buildingFloorName: {
						type: 'string',
						required: true,
						message: '楼层不能为空',
						trigger: ['blur', 'change']
					},
					buildingName: {
						type: 'string',
						required: true,
						message: '建筑不能为空',
						trigger: ['blur', 'change']
					},
					// checkNum: {
					// 	type: 'number',
					// 	required: true,
					// 	message: '数量不能为空',
					// 	trigger: ['blur', 'change']
					// },
					deviceTypeName: {
						type: 'string',
						required: true,
						message: '检测类别不能为空',
						trigger: ['blur', 'change']
					},
				},
			}
		},
		onUnload() {
			// 页面卸载时移除监听
			clearTimeout(this.timer)
			this.timer = null
			uni.$off('pageData');
		},
		onLoad(data) {
			this.checkInfo = JSON.parse(data.checkInfo)
			this.dataForm.deviceSysId = this.checkInfo.id;
			this.dataForm.deviceSysCode = this.checkInfo.code;
			this.dataForm.deviceSysName = this.checkInfo.deviceSysName;
			this.dataForm.checkProjectId = this.$store.state.user.checkProject.id;

			if (data.item) {
				this.checkItemInfo = JSON.parse(data.item)
				this.dataForm.deviceTypeId = this.checkItemInfo.id;
				this.dataForm.deviceTypeCode = this.checkItemInfo.code;
				this.dataForm.deviceTypeName = this.checkItemInfo.deviceSysName;
				this.getFindCheckItemList();
			}
			if (data.itemList) {
				this.deviceTypeList = JSON.parse(data.itemList)
			}
			if (data.itemIndex) {
				this.itemIndex = data.itemIndex
			}
			// 监听事件
			uni.$on('pageData', (data) => {
				if (data.itemFloor && data.item) {
					this.dataForm.buildingFloorName = data.itemFloor.floorName
					this.dataForm.buildingFloorId = data.itemFloor.id
					this.dataForm.buildingId = data.item.id
					this.dataForm.buildingName = data.item.buildingName
				}
				if (data.deviceTypeData) {
					this.checkItemInfo = data.deviceTypeData;
					this.dataForm.deviceTypeId = data.deviceTypeData.id
					this.dataForm.deviceTypeName = data.deviceTypeData.deviceSysName
					this.dataForm.deviceTypeCode = data.deviceTypeData.code
					this.getFindCheckItemList();
				}
			});

		},
		onReady() {
			this.$refs.uForm.setRules(this.rules)
		},
		methods: {
			getFindCheckItemList() {
				let data = {
					deviceTypeId: this.checkItemInfo.id
				}
				findCheckItemList(data).then(res => {
					if (res.listObj) {
						this.checkItemList = res.listObj;
						this.checkItemList.forEach((item) => {
							item["checkResult"] = ""
						})
					}
				})
			},
			selectBuilding() {
				this.$tab.navigateTo(
					`/pages/common/selectBuildings?buildingId=${this.checkInfo.buildingId}&buildingFloorId=${this.dataForm.buildingFloorId}`
				)
			},
			selectDeviceType() {
				this.$tab.navigateTo(
					`/pages/common/projectSelectSystemItem?parentId=${this.checkInfo.id}&id=${this.dataForm.deviceTypeId}`
				)
			},
			goBack() {
				uni.navigateBack();
			},
			changePage(type) {
				if (type == 3) {
					this.dataForm.address = "";
					this.dataForm.checkNum = "";
				}
				this.itemCurrent = type;
				this.checkItemList.forEach((item, index) => {
					this.$set(this.checkItemList[index], 'checkResult', type);
				});
			},
			postCheckRecord() {
				let allCheck = true;
				this.checkItemList.forEach((item) => {
					if (!item.checkResult) {
						allCheck = false;
					}
				})
				if (!allCheck) {
					uni.$u.toast('还有未检测项')
					return;
				}

				this.$refs.uForm.validate().then(res => {
					this.dataForm["list"] = [];
					this.checkItemList.forEach((item) => {
						this.dataForm.list.push({
							"checkProjectId": this.dataForm.checkProjectId,
							"deviceSysId": this.dataForm.deviceSysId,
							"deviceSysName": this.dataForm.deviceSysName,
							"deviceSysCode": this.dataForm.deviceSysCode,
							"deviceTypeId": this.dataForm.deviceTypeId,
							"deviceTypeName": this.dataForm.deviceTypeName,
							"deviceTypeCode": this.dataForm.deviceTypeCode,
							"checkNum": (item.checkNum >= 0 ? item.checkNum : this.dataForm
								.checkNum),
							"buildingId": this.dataForm.buildingId,
							"buildingFloorId": this.dataForm.buildingFloorId,
							"buildingFloorName": this.dataForm.buildingFloorName,
							"buildingName": this.dataForm.buildingName,
							"address": this.dataForm.address,
							"memo": this.dataForm.memo,
							"imgUrl": this.dataForm.imgUrl,
							"checkResult": item.checkResult,
							"checkName": item.checkName,
							"deviceCheckItemId": item.id
						});
					})
					if (this.buttonLoading) {
						uni.$u.toast('请勿重复提交')
						return;
					}
					this.buttonLoading = true;
					saveCheckRecord(this.dataForm).then(res => {
						if (res.status == 200) {
							uni.$u.toast('添加成功')
							uni.$emit('refreshData', {
								refreshData: true
							});
							this.timer = setTimeout(() => {

								this.goBack();
							}, 700);
						}

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
					this.dataForm.imgUrl = "";
				} else {
					let list = [];
					data.forEach((item) => {
						if (item.src) {
							list.push(item.src);
						}
					})
					this.dataForm.imgUrl = list.join(';');
				}
			},
			uploadSucceed(data) {
				if (data.length == 0) {
					this.dataForm.imgUrl = "";
				} else {
					let list = [];
					data.forEach((item) => {
						if (item.src) {
							list.push(item.src);
						}
					})
					this.dataForm.imgUrl = list.join(';');
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pageView {
		width: 100%;
		height: 100vh;
	}

	.topView {
		background-color: #fff;
		width: 100%;
		padding: 10rpx 30rpx 0 30rpx;
		height: 110rpx;
		border-top: 2rpx solid #E3E3E3;

		.topTitleView {
			display: flex;
			align-items: center;
			margin-bottom: 5rpx;

			.topTitle3 {
				font-weight: 600 !important;
				font-size: 26rpx !important;
				color: #FA8161 !important;
			}

			.topTitle2 {
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 24rpx;
				color: #999999;
				text-align: left;
				font-style: normal;
				text-transform: none;
				margin-left: 20rpx;
			}

			.topTitle1 {
				height: 42rpx;
				width: 42rpx;
			}
		}
	}

	.liListView {
		width: 100%;
		height: calc(100% - 270rpx);
	}

	.contentView {
		width: 100%;
		height: auto;
		background-color: #fff;
		margin-top: 20rpx;
		padding: 0 30rpx;

		.radioListView {
			min-height: 154rpx;
			height: auto;
			width: 100%;
			border-bottom: 1px solid #F5F5F5;
			padding: 24rpx 30rpx;

			.radioTitleView {
				width: auto;
				height: auto;
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 28rpx;
				color: #333333;
				text-align: left;
				font-style: normal;
				text-transform: none;
			}

			.radioView {
				margin-top: 26rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
		}

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

		.imgViewTitle {
			width: 100%;
			height: auto;
			font-family: PingFang SC, PingFang SC;
			font-weight: 400;
			font-size: 28rpx;
			color: #181818;
			text-align: left;
			font-style: normal;
			text-transform: none;
			padding: 15rpx 0;
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

	.scrollBottom {
		height: 180rpx;
		width: 100%;
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

	.viewTop2 {
		margin-top: 24rpx;
		width: 100%;
		height: 124rpx;
		background: #FFFFFF;
		border-radius: 0rpx 0rpx 0rpx 0rpx;

		display: flex;
		justify-content: space-between;
		align-items: center;

		.viewTab {
			width: 200rpx;
			height: 76rpx;
			background: #F7F7F7;
			border-radius: 12rpx 12rpx 12rpx 12rpx;
			text-align: center;
			line-height: 76rpx;
		}

		.onViewTab {
			background: #FA8161;
			border-radius: 12rpx 12rpx 12rpx 12rpx;
			color: #fff;
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