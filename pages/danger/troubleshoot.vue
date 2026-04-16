<template>
	<view class="pageView" :style="'padding: '+statusBarHeight+'rpx 0 0 0 ;'">
		<view class="customTopView">
			<view class="customTop" :style="'height:'+statusBarHeight+'rpx'">
				<view class="customBottom">
					<view class="customTop1" @click="goBack"> <u-icon class="uIcon" name="arrow-left" color="#000000"
							size="23"></u-icon>
					</view>
					<view class="customTop2">新建排查</view>
					<!-- <view class="customTop3" @click="updateOrAdd=true" v-if="!updateOrAdd">编辑</view> -->
					<view class="customTop3" @click="postSaveCheckRecord()">保存</view>
				</view>
			</view>
		</view>
		<view class="placeInfo">
			<view class="placeTable">
				<view class="placeTitle">排查对象：</view>
				<view class="placetext">
					{{placeForm.standardName}}
				</view>
			</view>
			<view class="lineView"></view>
			<view class="placeTable">
				<view class="placeTitle">对象类型：</view>
				<view class="placetext">{{placeForm.placeTypeDesc}}</view>
			</view>
		</view>
		<view class="checkItemView">
			<view class="allPass">
				<view class="addProblem" @click="allPass"><u-icon name="checkmark" color="#2979ff"
						size="16"></u-icon>全部合格
				</view>
			</view>
			<view v-for="(item,index) in checkItemList" :key="index">
				<view class="itemTitle">{{item.deviceTypeName}}</view>
				<view class="itemListView" v-for="(item2,index2) in item.sonList" :key="index2">
					<view class="itemCheckName">{{item2.checkName}}</view>
					<view class="itemSelect">
						<u-radio-group v-model="item2.checkResult" placement="row">
							<u-radio :customStyle="{marginRight: '24rpx'}" activeColor="#FA8161" label="有"
								:name="1"></u-radio>
							<u-radio :customStyle="{marginRight: '24rpx'}" activeColor="#FA8161" label="无"
								:name="2"></u-radio>
						</u-radio-group>
						<view class="addProblem" @click="addProblemPage(item2)"><u-icon name="plus-circle"
								color="#2979ff" size="16"></u-icon>添加问题
						</view>
						<view class="addProblem" @click="goProblemList(item2)">
							问题列表({{problemNum(item2)}})
						</view>
					</view>
					<view class="lineView"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		findCheckItemList,
		saveCheckRecord,
		saveRiskProblemList,
		findRiskProblemList
	} from '@/api/danger/danger.js'
	export default {
		data() {
			return {
				timer: null,
				buttonLoading: false,
				statusBarHeight: this.$store.state.user.statusBarHeight,
				placeForm: "",
				checkItemList: [],
				problemList: [],
				placeLis: [],

				dataForm: {
					"projectId": this.$store.state.user.projectId,
					"checkProjectId": this.$store.state.user.checkProject.id,
					"deviceType": "",
					"findContent": 1,
					"placeId": ""
				}
			}
		},
		onLoad(data) {
			if (data.item && data.item != "null") {
				this.placeForm = JSON.parse(data.item)
				this.dataForm.deviceType = this.placeForm.placeType;
				this.dataForm.placeId = this.placeForm.id;
			}
			// this.getFindRiskProblemList();
			// 监听事件
			uni.$on('pageData', (data) => {
				uni.$u.toast('别忘了保存')
				if (data.problemData.id) {
					let index = this.problemList.findIndex(parameter => parameter.id === data.problemData.id);
					console.log(data.problemData)
					this.problemList[index] = data.problemData;
				} else {
					this.problemList.push(data.problemData)
				}

			});
		},
		onShow() {
			this.getAll();
		},
		onUnload() {
			// 页面卸载时移除监听
			clearTimeout(this.timer)
			this.timer = null
			uni.$off('pageData');
		},
		methods: {
			async getAll() {
				try {
					await Promise.all([
						this.getFindCheckItemList(),
						this.getFindRiskProblemList(),
					]);

					this.placeLis.forEach((item) => {
						let index = this.checkItemList.findIndex(parameter => parameter
							.deviceTypeId === item.deviceTypeId);
						if (index < 0) {
							let elem = {
								deviceTypeName: item.deviceTypeName,
								deviceTypeId: item.deviceTypeId,
								sonList: [item],
							}
							this.checkItemList.push(elem);
						} else {
							this.checkItemList[index].sonList.push(item);
						}
					})
				} catch (error) {
					console.error("Error executing methods:", error);
				}
			},
			problemNum(item) {
				let list = [];
				this.problemList.forEach((item2) => {
					if (item2.deviceCheckItemId === item.id) {
						list.push(item);
					}
				})
				return list.length;
			},
			async getFindCheckItemList() {

				const res = await findCheckItemList(this.dataForm)
				if (res.listObj) {
					this.placeLis = res.listObj
				}

			},
			async getFindRiskProblemList() {
				let data = {
					"projectId": this.$store.state.user.projectId,
					"checkProjectId": this.$store.state.user.checkProject.id,
					"pageIndex": 1,
					"pageSize": 0,
					"deviceType": this.placeForm.placeType,
					"findContent": 1,
					"placeId": this.placeForm.id
				}
				const res = await findRiskProblemList(data)
				if (res.listObj) {
					this.problemList = res.listObj
				}

			},
			goBack() {
				uni.navigateBack();
			},
			allPass() {
				this.checkItemList.forEach((item) => {
					item.sonList.forEach((item2) => {
						item2.checkResult = 1
					})
				})
			},
			addProblemPage(item) {
				let data = {
					"projectId": this.$store.state.user.projectId,
					"checkProjectId": this.$store.state.user.checkProject.id,
					"placeId": this.placeForm.id,
					"deviceSysId": item.deviceSysId,
					"deviceSysName": item.deviceSysName,
					"deviceTypeId": item.deviceTypeId,
					"deviceTypeName": item.deviceTypeName,
					"deviceCheckItemId": item.id,
					"deviceCheckItemName": item.checkName,
					"standardName": this.placeForm.standardName,
					"placeName": this.placeForm.placeName
				}
				this.$tab.navigateTo(
					`/pages/danger/problemPage?item=${ JSON.stringify(data)}`
				)
			},
			goProblemList(item) {
				let list = [];
				this.problemList.forEach((item2) => {
					if (item2.deviceCheckItemId === item.id) {
						list.push(item2);
					}
				})
				item["problemList"] = list;
				this.$tab.navigateTo(
					`/pages/danger/problemList?item=${ JSON.stringify(item)}`
				)
			},

			postSaveCheckRecord() {
				let dataList = [];
				this.checkItemList.forEach((item) => {
					item.sonList.forEach((item2) => {
						dataList.push({
							"projectId": this.$store.state.user.projectId,
							"checkProjectId": this.$store.state.user.checkProject.id,
							"deviceSysId": item2.deviceSysId,
							"deviceTypeId": item2.deviceTypeId,
							"deviceCheckItemId": item2.id,
							"placeId": this.placeForm.id,
							"checkResult": item2.checkResult,
							"id": item2.checkRecordId
						})
					})
				})
				let data = {
					list: dataList
				}
				if (this.buttonLoading) {
					uni.$u.toast('请勿重复提交')
					return;
				}
				this.buttonLoading = true;
				saveCheckRecord(data).then(res => {
					if (res.status == 200) {
						this.postSaveRiskProblemList();
						this.timer = setTimeout(() => {
							this.goBack();
						}, 700);
					} else {
						uni.$u.toast('保存失败')
					}
				}).finally(() => {
					// 统一关闭loading
					this.buttonLoading = false;
				});
			},
			postSaveRiskProblemList() {
				let data = {
					"projectId": this.$store.state.user.projectId,
					"checkProjectId": this.$store.state.user.checkProject.id,
					"placeId": this.placeForm.id,
					list: this.problemList
				}
				saveRiskProblemList(data).then(res => {

				})

			}
		}
	}
</script>

<style scoped lang="scss">
	.pageView {
		width: 100%;
		height: auto;

		.placeInfo {
			width: auto;
			height: auto;
			background-color: #fff;
			padding: 20rpx;



			.placeTable {
				width: 100%;
				height: auto;
				display: flex;
				padding: 20rpx 0;

				.placeTitle {
					width: 150rpx;
					height: auto;
				}

				.placetext {
					width: calc(100% - 150rpx);
				}
			}
		}
	}

	.checkItemView {
		width: 100%;
		height: auto;
		background-color: #fff;
		margin-top: 20rpx;
		padding: 0 0 20rpx 0;

		.itemTitle {
			height: auto;
			padding: 10rpx 20rpx;
			background-color: #f1f1f1;
		}

		.itemListView {
			padding: 20rpx;
			// border-top: 1rpx solid #eee;
		}

		.itemCheckName {}

		.itemSelect {
			display: flex;
			justify-content: space-around;
			align-items: center;
			padding: 0 0 0 40rpx;
			height: 80rpx;


		}
	}

	.allPass {
		height: auto;
		display: flex;
		justify-content: right;
		align-items: center;
		padding: 20rpx 40rpx;
	}

	.addProblem {
		color: #3880ff;
		font-size: 24rpx;
		display: flex;
		align-items: center;
		margin-right: 40rpx;
	}

	.lineView {
		border-top: 1rpx solid #eee;
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
</style>