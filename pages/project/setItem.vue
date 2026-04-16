<template>
	<view class="pageView">
		<view :key="uCollapse">
			<u-collapse :value="collapseValue">
				<u-collapse-item :title="item.itemName" :name="index" v-for="(item,index) in parentCodeList"
					:key="index">
					<view class="contentTab" v-for="(deviceItem,deviceIndex) in item.deviceTypeList "
						:key="deviceIndex">
						<view class="contentTab1">{{deviceItem.deviceSysName}}</view>
						<view class="contentTab2">
							<u-radio-group v-model="deviceItem.checkResult" placement="row">
								<u-radio :customStyle="{marginRight: '24rpx'}" activeColor="#FA8161" label="有"
									:name="1"></u-radio>
								<u-radio :customStyle="{marginRight: '24rpx'}" activeColor="#FA8161" label="无"
									:name="0"></u-radio>
							</u-radio-group>
						</view>
					</view>
				</u-collapse-item>
			</u-collapse>
		</view>
		<view style="width: 100%;height: 166rpx;"></view>
		<view class="bottomView">
			<view class="viewLeft" @click="postSaveCheckProject()">保 存</view>
		</view>
	</view>
</template>

<script>
	import {
		findDictItemListByParentCode,
		findParentDeviceTypeList,
		saveCheckProject
	} from '@/api/safety/safety.js'


	export default {
		data() {
			return {
				timer: null,
				buttonLoading: false,
				checkProjectInfo: "",
				parentCodeList: [],
				dataForm: {
					radio1: ""
				},
				objectDataForm: {},
				collapseValue: [],
				uCollapse: 0
			};
		},
		onLoad(data) {
			this.uCollapse++;
			this.getFindDictItemListByParentCode();
			this.checkProjectInfo = JSON.parse(data.checkProjectInfo)
			this.objectDataForm = this.$store.state.user.checkProject
		},
		onReady() {

		},
		onUnload() {
			clearTimeout(this.timer)
			this.timer = null

		},
		methods: {
			getFindDictItemListByParentCode() {
				let data = {
					"dictCode": "SAFETY_DEVICE_SYS_TYPE"
				}
				findDictItemListByParentCode(data).then(res => {
					if (res.listObj) {
						this.parentCodeList = res.listObj;
						this.parentCodeList.forEach((item, index) => {
							this.collapseValue.push(index)
						})
						this.uCollapse++;
						this.getFindParentDeviceTypeList();
					} else {
						this.$modal.showToast('未查询到项目')
					}
				})
			},
			getFindParentDeviceTypeList() {
				let data = {
					"projectId": this.$store.state.user.projectId,
				}
				findParentDeviceTypeList(data).then(res => {
					if (res.listObj) {
						this.parentCodeList.forEach((item, index) => {
							item["deviceTypeList"] = []
							res.listObj.forEach((item2) => {
								if (Number(item.itemValue) === item2.deviceType) {
									if (this.checkProjectInfo.sysTypeIdList.includes(item2.id)) {
										item2["checkResult"] = 1
									} else {
										item2["checkResult"] = 0
									}
									item.deviceTypeList.push(item2);
								}
							})
						})
						this.uCollapse++;
					} else {
						this.$modal.showToast('未查询到项目')
					}
				})
			},
			postSaveCheckProject() {
				let data = {
					"projectId": this.$store.state.user.projectId,
					"id": this.checkProjectInfo.id,
					"sysTypeIdList": []
				}

				this.parentCodeList.forEach((item) => {
					item.deviceTypeList.forEach((item2) => {
						if (item2.checkResult == 1) {
							data.sysTypeIdList.push(item2.id)
						}
					})
				})
				if (this.buttonLoading) {
					uni.$u.toast('请勿重复提交')
					return;
				}
				this.buttonLoading = true;
				saveCheckProject(data).then(res => {
					if (res.status == 200) {
						this.objectDataForm.sysTypeIdList = res.obj.sysTypeIdList;
						this.objectDataForm.sysTypeIds = res.obj.sysTypeIdList;
						this.$store.dispatch('SetAtProject', this.objectDataForm)
						uni.$u.toast('保存成功')
						this.timer = setTimeout(() => {
							uni.navigateBack();
						}, 700);
					}
				}).finally(() => {
					// 统一关闭loading
					this.buttonLoading = false;
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pageView {
		width: 100%;
		min-height: 100vh;
		height: auto;
		background-color: #fff;
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

	.contentTab {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 2rpx solid #E3E3E3;
		padding: 20rpx 0;

		.contentTab1 {
			width: calc(100% - 180rpx);
		}

		.contentTab2 {
			text-align: right;
			width: 180rpx;
		}
	}

	::v-deep .u-collapse {
		.u-collapse-item {
			.u-cell {
				font-weight: 700;
				background-color: #F7F7F7;
			}
		}
	}
</style>