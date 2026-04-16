<template>
	<view class="pageView">
		<view class="projectView">
			<text>{{checkProjectInfo.checkProjectName}}</text>
		</view>
		<view class="contentView">
			<view class="contentTab">
				<view class="contentTab1">委托单位:</view>
				<view class="contentTab2">{{checkProjectInfo.requesterUnit}}</view>
			</view>
			<view class="contentTab">
				<view class="contentTab1">委托单位联系人:</view>
				<view class="contentTab2">{{checkProjectInfo.contactUserName}}</view>
			</view>
			<view class="contentTab">
				<view class="contentTab1">委托单位电话:</view>
				<view class="contentTab2">{{checkProjectInfo.contactPhone}}</view>
			</view>
			<view class="contentTab">
				<view class="contentTab1">评估成员:</view>
				<view class="contentTab2">{{assessmentUser}}</view>
			</view>
			<view class="contentTab">
				<view class="contentTab1">建筑类型:</view>
				<view class="contentTab2">{{buildingType(checkProjectInfo.buildingType)}}
				</view>
			</view>
			<view class="contentTab">
				<view class="contentTab1">评估日期:</view>
				<view class="contentTab2">{{ checkProjectInfo.assessmentDate}}
				</view>
			</view>
			<view class="contentTab">
				<view class="contentTab1">添加时间:</view>
				<view class="contentTab2">{{checkProjectInfo.createTime}}</view>
			</view>
			<view class="contentTab">
				<view class="contentTab1">项目地址:</view>
				<view class="contentTab2">{{checkProjectInfo.address}}</view>
			</view>
		</view>

		<view class="bottomView">
			<view class="viewLeft" @click="goAddFacility()">设 定</view>
		</view>
	</view>
</template>

<script>
	import {
		findByMyCheckProjectList,
		findAssessmentMemberList
	} from '@/api/safety/safety.js'

	export default {
		data() {
			return {
				checkProjectInfo: "",
				userList: [],
				assessmentUser: ""
			};
		},
		onShow() {
			this.getFindByMyCheckProjectList();
			this.getFindAssessmentMemberList();
		},
		methods: {
			buildingType(value) {
				let text;
				this.$store.state.user.safetyBuildingTypes.forEach((item) => {
					if (item.value == value) {
						text = item.label
					}
				})
				return text;
			},
			getFindByMyCheckProjectList() {
				let data = {
					"projectId": this.$store.state.user.projectId,
					"pageIndex": 1,
					"pageSize": 0,
					"id": this.$store.state.user.checkProject.id,
				}

				findByMyCheckProjectList(data).then(res => {
					if (res.object.list) {
						this.checkProjectInfo = res.object.list[0];
					} else {
						this.$modal.showToast('未查询到项目')
					}
				})
			},
			getFindAssessmentMemberList() {
				let data = {
					"projectId": this.$store.state.user.projectId,
					"checkProjectId": this.$store.state.user.checkProject.id,
					"pageIndex": 1,
					"pageSize": 0
				}
				let users = []
				findAssessmentMemberList(data).then(res => {
					if (res.listObj) {
						this.userList = res.listObj;
						this.userList.forEach((item) => {
							if (item.assessmentUserType == 2) {
								users.push(item.userName)
							}
						})

					}

					this.assessmentUser = users.join(';');
				})

			},
			goAddFacility(item) {
				this.$tab.navigateTo(
					`/pages/safety/project/setItem?checkProjectInfo=${JSON.stringify(this.checkProjectInfo)}`)
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

		.projectView {
			height: 100rpx;
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 34rpx;
			font-weight: 600;
			padding: 0 30rpx;
			text-align: center;
			border-top: 2rpx solid #E3E3E3;
		}

		.contentView {
			width: 100%;
			padding: 0 30rpx;

			.contentTab {
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 2rpx solid #E3E3E3;
				padding: 20rpx 0;

				.contentTab1 {
					width: auto;
				}

				.contentTab2 {
					text-align: right;
					width: calc(100% - 220rpx);
				}
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
</style>