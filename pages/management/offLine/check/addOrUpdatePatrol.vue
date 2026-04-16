<template>
	<view class="pageView" :style="'padding: '+statusBarHeight+'rpx 0 0 0 ;'">
		<view class="customTopView">
			<view class="customTop" :style="'height:'+statusBarHeight+'rpx'">
				<view class="customBottom">
					<view class="customTop1" @click="goBack"> <u-icon class="uIcon" name="arrow-left" color="#000000"
							size="23"></u-icon>
					</view>
					<view class="customTop2">巡查登记</view>
					<view class="customTop3" @click="submit()">保存</view>
				</view>
			</view>
		</view>
		<view class="contentView">
			<view class="contentInput">
				<view class="contentInput1">单位名称</view>
				<view class="contentInput2">{{$store.state.user.checkProject.checkProjectName}}</view>
			</view>
			<u--form :model="dataForm" :rules="rules" ref="uForm">
				<u-form-item label="维保类型" prop="checkType" borderBottom required labelWidth="120">
					<u-radio-group v-model="dataForm.checkType" placement="row" @change="groupChange">
						<u-radio :customStyle="{marginRight: '24rpx'}" activeColor="#FA8161" label="测试" :name="3" />
						<u-radio :customStyle="{marginRight: '24rpx'}" activeColor="#FA8161" label="巡查" :name="2" />
						<u-radio :customStyle="{marginRight: '24rpx'}" activeColor="#FA8161" label="保养" :name="4" />
					</u-radio-group>
				</u-form-item>
				<u-form-item label="计划类型" prop="planTimeType" borderBottom required labelWidth="120">
					<u-radio-group v-model="dataForm.planTimeType" placement="row">
						<u-radio :customStyle="{marginRight: '24rpx'}" activeColor="#FA8161" label="月" :name="1" />
						<u-radio :customStyle="{marginRight: '24rpx'}" activeColor="#FA8161" label="季" :name="2" />
						<u-radio :customStyle="{marginRight: '24rpx'}" activeColor="#FA8161" label="半年" :name="3" />
						<u-radio :customStyle="{marginRight: '24rpx'}" activeColor="#FA8161" label="年" :name="4" />
					</u-radio-group>
				</u-form-item>
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

				<u-form-item label="设备数量" prop="checkNum" borderBottom required labelWidth="120">
					<u--input v-model="dataForm.checkNum" type="number" border="none" placeholder="请输入设备数量"
						inputAlign="right"></u--input>
				</u-form-item>
				<u-form-item label="具体位置" prop="address" borderBottom required labelWidth="120">
					<u--input v-model="dataForm.address" border="none" placeholder="请输入具体位置"
						inputAlign="right"></u--input>
				</u-form-item>
				<u-form-item label="巡检时间" prop="checkDateDesc" borderBottom required @click="datetimeShow=true"
					labelWidth="120">
					<text class="placeholderText" v-if="!dataForm.checkDateDesc">请选择巡检时间</text>
					<text class="placeholderValue" v-else>{{dataForm.checkDateDesc}}</text>

					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
				<u-form-item label="是否正常" prop="checkResultDesc" borderBottom required labelWidth="120">
					<u-switch v-model="dataForm.checkResultDesc" space="2" activeColor="#05CF47"
						inactiveColor="#FA8161"></u-switch>
				</u-form-item>
			</u--form>
			<view class="contentInput" style="padding: 20rpx 0;">
				<u--textarea v-model="dataForm.causeFailure" placeholder="请描述情况" height="120rpx" :adjustPosition="false"
					:confirmType="null" :maxlength="-1"></u--textarea>
			</view>
			<view class="contentInput" style="justify-content: left;">
				<u-tag text="状态正常" @click="addTextarea('状态正常')" type="success" plain plainFill
					style="margin-right: 20rpx;"></u-tag>
				<u-tag text="表面损坏" @click="addTextarea('表面损坏')" type="error" plain plainFill
					style="margin-right: 20rpx;"></u-tag>
				<u-tag text="设备无法启动" @click="addTextarea('设备无法启动')" type="error" plain plainFill
					style="margin-right: 20rpx;"></u-tag>
				<u-tag text="破损" type="error" @click="addTextarea('破损')" plain plainFill
					style="margin-right: 20rpx;"></u-tag>
			</view>
			<u-datetime-picker :show="datetimeShow" v-model="datetimeValue" mode="date" :maxDate="Number(new Date())"
				@confirm="timeConfirm" @cancel="datetimeShow=false"></u-datetime-picker>
		</view>

		<view class="contentView">
			<view class="imgViewTitle">上传图片</view>
			<view class="imgListView">
				离线状态下不支持上传图片，请用手机拍照。待有网后在"巡查测试"中修改
			</view>
		</view>
	</view>
</template>

<script>
	import imgView from "@/pages/common/uploadImg.vue"
	import {
		saveCheckRecord
	} from '@/api/maintenance/maintenance'
	export default {
		components: {
			imgView
		},
		data() {
			return {
				timer: null,
				statusBarHeight: this.$store.state.user.statusBarHeight,
				datetimeShow: false,
				datetimeValue: Number(new Date()),
				dataForm: {
					id: "",
					tempId: "",
					buildingName: "",
					createUserName: "",
					deviceTypeName: "",
					deviceTypeNameDesc: "",
					projectId: "",
					checkProjectId: "",
					checkType: 2,
					buildingId: "",
					buildingFloorId: "",
					floorName: "",
					deviceSysId: "",
					deviceSysName: "",
					deviceTypeId: "",
					checkNum: "",
					address: "",
					checkResult: "",
					checkResultDesc: true,
					causeFailure: "",
					checkDate: "",
					checkImgUrls: "",
					planTimeType: 1,
				},

				atSelect: "",

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
				rules: {
					floorName: {
						type: 'string',
						required: true,
						message: '所在楼层不能为空',
						trigger: ['blur', 'change']
					},
					buildingName: {
						type: 'string',
						required: true,
						message: '所在建筑物不能为空',
						trigger: ['blur', 'change']
					},
					checkDateDesc: {
						type: 'string',
						required: true,
						message: '巡检时间不能为空',
						trigger: ['blur', 'change']
					},
					address: {
						type: 'string',
						required: true,
						message: '具体位置不能为空',
						trigger: ['blur', 'change']
					},
					checkNum: {
						type: 'number',
						required: true,
						message: '检测数量不能为空',
						trigger: ['blur', 'change']
					},
					deviceTypeName: {
						type: 'string',
						required: true,
						message: '设备名称不能为空',
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

		onUnload() {
			clearTimeout(this.timer)
			this.timer = null
			// 页面卸载时移除监听
			uni.$off('pageData');
		},
		onLoad(data) {
			if (data.item && data.item != "null") {
				// this.dataForm = JSON.parse(data.item)
				this.getFindCheckRecordList(JSON.parse(data.item))

			}
			this.dataForm.checkProjectId = this.$store.state.user.checkProject.id;
			this.dataForm.projectId = this.$store.state.user.projectId;
			this.dataForm.createUserName = this.$store.state.user.nickName;

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
		onReady() {
			this.$refs.uForm.setRules(this.rules)
		},
		methods: {
			groupChange() {
				this.dataForm.deviceSysId = "";
				this.dataForm.deviceSysName = "";
				this.dataForm.deviceTypeId = "";
				this.dataForm.deviceTypeName = "";
			},
			getFindCheckRecordList(item) {
				Object.keys(this.dataForm).forEach(key => {
					if (item.hasOwnProperty(key)) {
						this.dataForm[key] = item[key];
					}
				});
				if (this.dataForm.checkDate) {
					this.timeConfirm({
						value: new Date(this.dataForm.checkDate).getTime(),
						mode: "date"
					});
				}
				this.dataForm.id = item.id;
				if (item.checkResult == 1) {
					this.dataForm.checkResultDesc = true
				} else {
					this.dataForm.checkResultDesc = false
				}


			},
			addTextarea(text) {
				if (this.dataForm.causeFailure) {
					this.dataForm.causeFailure = this.dataForm.causeFailure + ";" + text
				} else {
					this.dataForm.causeFailure = stext
				}
			},
			timeConfirm(data) {

				this.datetimeShow = false;
				var now = new Date(data.value); // 依情况进行更改 * 1
				var y = now.getFullYear();
				var m = now.getMonth() + 1;
				var d = now.getDate();
				this.dataForm.checkDateDesc = y + "-" + m.toString().padStart(2, '0') + "-" + d.toString().padStart(2,
					'0');
				this.dataForm.checkDate = this.dataForm.checkDateDesc + " 00:00:00";
			},
			selectSystem() {
				this.$tab.navigateTo(
					`/pages/management/offLine/select/selectSystem?id=${this.dataForm.deviceSysId}&deviceType=${this.dataForm.checkType}`
				)
			},
			selectSystemItem() {
				if (!this.dataForm.deviceSysId) {
					this.$modal.showToast('请先选择系统名称')
					return;
				}
				this.$tab.navigateTo(
					`/pages/management/offLine/select/selectSystemItem?parentId=${this.dataForm.deviceSysId}&id=${this.dataForm.deviceTypeId}`
				)
			},
			selectBuilding() {
				this.$tab.navigateTo(
					`/pages/management/offLine/select/selectBuildings?buildingId=${this.dataForm.buildingId}&buildingFloorId=${this.dataForm.buildingFloorId}`
				)
			},
			goBack() {
				uni.navigateBack();
			},
			submit() {

				this.dataForm.deviceTypeNameDesc = this.dataForm.deviceTypeName
				if (this.dataForm.checkResultDesc) {
					this.dataForm.checkResult = 1
				} else {
					this.dataForm.checkResult = 2
				}

				let getStorage = uni.getStorageSync('planOffLine_' + this.$store.state.user.checkProject.id);

				if (getStorage && getStorage.checkRecord) {
					let checkRecordId = this.dataForm.tempId || this.dataForm.id;
					console.log(checkRecordId)
					if (checkRecordId) {
						getStorage.checkRecord.forEach((item, index) => {
							let itemId = item.tempId || item.id;
							if (checkRecordId == itemId) {
								getStorage.checkRecord[index] = this.dataForm;
							}
						})
					} else {
						this.dataForm["tempId"] = new Date().getTime();
						getStorage.checkRecord.unshift(this.dataForm);
					}
					uni.setStorageSync('planOffLine_' + this.$store.state.user.checkProject.id,
						getStorage);
					uni.$u.toast('添加成功')
					this.timer = setTimeout(() => {
						this.goBack();
					}, 700);
				} else {
					getStorage.checkRecord = [this.dataForm];
					uni.setStorageSync('planOffLine_' + this.$store.state.user.checkProject.id,
						getStorage);
					uni.$u.toast('添加成功')
					this.timer = setTimeout(() => {
						this.goBack();
					}, 700);
				}


			}
		}
	}
</script>

<style lang="scss" scoped>
	.pageView {
		height: auto;
		width: 100%;

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

	.imgListView {
		padding: 20rpx 0;
	}
</style>