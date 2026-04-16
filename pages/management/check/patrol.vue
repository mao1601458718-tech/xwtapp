<template>
	<view class="page">
		<view class="topView">
			<view class="topView1" @click="datetimeShow = true">
				<u-datetime-picker :show="datetimeShow" v-model="datetimeValue" mode="year-month" @confirm="timeConfirm"
					@cancel="timeCose"></u-datetime-picker>
				<view>{{dataForm.searchCheckDate||"日期筛选"}}</view>
				<u-icon class="uIcon" name="arrow-down-fill" color="#999999" size="20" v-if="!datetimeShow"></u-icon>
				<u-icon class="uIcon" name="arrow-up-fill" color="#999999" size="20" v-else></u-icon>
			</view>
			<view class="topView2">
				<u--input class="uInput" borde="none" shape="circle" clearable placeholder="请输入设备名称查询"
					v-model="dataForm.deviceTypeName" @change="clickSearchValue"></u--input>
			</view>
		</view>
		<scroll-view scroll-y refresher-background="#f1f1f1" class="contentView" @scrolltolower="onreachBottom"
			:refresher-threshold="105" :refresher-enabled="true" :refresher-triggered="refreshObj.refresherTriggered"
			@refresherrefresh="refresherrefresh" @refresherrestore="refresherrestore" @refresherabort="refresherabort">

			<uni-swipe-action>
				<!-- 使用插槽 （请自行给定插槽内容宽度）-->

				<uni-swipe-action-item v-for="(item,index) in checkRecordList" :key="index" :threshold="50">
					<view class="contentTab" @click="addPatrol(item)">
						<view class="contentTitle">
							<view class="contentTitle1">
								{{item.deviceTypeName}}({{$store.state.user.maintenanceCheckType[item.checkType]}})
							</view>
							<view class="contentTitle2">{{item.checkDateDesc}}</view>
						</view>
						<view class="contentLi">
							<view class="contentLi1">数量：{{item.checkNum}}</view>
							<view class="contentLi2">巡检人：{{item.createUserName}}</view>
						</view>

						<view class="contentLi">
							<view class="contentLi1">状态：
								<u-tag text="正常" type="success" plain plainFill v-if="item.checkResult === 1"
									size="mini"></u-tag>
								<u-tag text="故障" type="error" plain plainFill v-else size="mini"></u-tag>
							</view>
							<view class="contentLi2">计划类型：{{$store.state.user.planType[item.planTimeType]}}</view>
						</view>
						<view class="contentLi">
							<view class="contentLi1">所在建筑：{{item.buildingName}}</view>
						</view>
						<view class="contentLi">
							<view class="contentLi1">具体位置：{{item.address}}</view>
						</view>
					</view>
					<template v-slot:right>
						<view class="removeView" @click="removeView(item)">
							<view class="removeView1"></view>
							<view class="removeView2">删除</view>
						</view>
					</template>
				</uni-swipe-action-item>

			</uni-swipe-action>



			<view class="uLoadmore">
				<u-loadmore :status="refreshObj.sType" bg-color="#f1f1f1" icon-type="flower" />
			</view>
		</scroll-view>
		<view class="bottomView">
			<view class="buttonView" @click="addPatrol(null)">
				添 加
			</view>
		</view>
	</view>
</template>

<script>
	import {
		findCheckRecordList,
		modifyCheckRecord,
		delRiskProblemItem
	} from '@/api/maintenance/maintenance'
	export default {
		data() {
			return {
				searchValue: "",
				datetimeShow: false,
				datetimeValue: Number(new Date()),
				checkRecordList: [],
				searchCheckRecordList: [],
				totalCount: "",
				refreshObj: {
					refresherTriggered: false,
					_refresherTriggered: false,
					sType: 'nomore',
					iconType: 'flower',
					status: true,
				},
				dataForm: {
					"checkProjectId": "",
					"projectId": "",
					"deviceType": 3,
					"pageIndex": 1,
					"deviceTypeName": "",
					"searchCheckDate": "",
					"pageSize": 15,
					"maintenanceOrCheck": 2,
					"orderCols": ["createTime"],
					"orderDesc": true
				}
			}
		},
		onLoad() {
			this.dataForm.checkProjectId = this.$store.state.user.checkProject.id;
			this.dataForm.projectId = this.$store.state.user.projectId;
			// this.getFindCheckRecordList(true);
		},
		onShow() {
			this.dataForm.checkProjectId = this.$store.state.user.checkProject.id;
			this.dataForm.projectId = this.$store.state.user.projectId;
			this.getFindCheckRecordList(true);
		},
		methods: {
			onreachBottom(e) {
				if (this.refreshObj.status) {
					this.refreshObj.sType = 'loading';
					this.refreshObj.status = false;
					this.getFindCheckRecordList(false);
				}
			},
			refresherrefresh() {
				if (this.refreshObj._refresherTriggered) {
					return;
				}
				this.refreshObj._refresherTriggered = true;
				//界面下拉触发，triggered可能不是true，要设为true
				if (!this.refreshObj.refresherTriggered) {
					this.refreshObj.refresherTriggered = true;
				}
				this.loadStoreData();
			},
			refresherrestore() {
				this.refreshObj.refresherTriggered = false;
				this.refreshObj._refresherTriggered = false;
			},
			refresherabort() {
				this.refreshObj.refresherTriggered = false;
				this.refreshObj._refresherTriggered = false;
			},
			loadStoreData() {
				this.datetimeValue = "";
				this.dataForm.searchCheckDate = "";
				this.dataForm.deviceTypeName = "";

				this.getFindCheckRecordList(true);
			},
			removeView(item) {

				let data = {
					"ids": [item.id],
					"status": 99
				}
				uni.showModal({
					title: '提示',
					content: '确定删除该记录？',
					success: (res) => {
						if (res.confirm) {
							modifyCheckRecord(data).then(res => {
								if (res.status == 200) {
									this.getFindCheckRecordList(true);
								}
							});
						}
					}
				});
			},
			getFindCheckRecordList(empty) {
				if (empty) {
					this.refreshObj.sType = 'nomore';
					this.dataForm.pageIndex = 1;
					this.checkRecordList = [];
				}
				findCheckRecordList(this.dataForm).then(res => {
					if (res.listObj) {
						this.checkRecordList.push(...res.listObj);
						if (this.checkRecordList.length < res.totalCount) {
							this.refreshObj.status = true;
							this.dataForm.pageIndex++;
							this.refreshObj.sType = 'loadmore';
						} else {
							this.refreshObj.status = false;
							this.refreshObj.sType = 'nomore';
						}
					}


				}).finally(() => {
					this.refreshObj.refresherTriggered = false; //触发onRestore，并关闭刷新图标
					this.refreshObj._refresherTriggered = false;
				});

			},
			clickSearchValue() {
				this.getFindCheckRecordList(true);
			},
			// searchList() {

			// 	// 如果都没有搜索条件，返回全部数据
			// 	if (!this.datetimeValueText && !this.searchValue) {
			// 		this.searchCheckRecordList = this.checkRecordList;
			// 		return;
			// 	}

			// 	// 使用 filter 一次性筛选符合条件的数据
			// 	this.searchCheckRecordList = this.checkRecordList.filter(item => {
			// 		// 检查设备类型是否匹配（如果没有搜索值则默认匹配）
			// 		const deviceTypeMatch = !this.searchValue ||
			// 			item.deviceTypeName.includes(this.searchValue);

			// 		// 检查日期是否匹配（如果没有日期值则默认匹配）
			// 		const dateMatch = !this.datetimeValueText ||
			// 			item.checkDateDesc.includes(this.datetimeValueText);

			// 		// 两个条件都满足才返回
			// 		return deviceTypeMatch && dateMatch;
			// 	});
			// },
			timeCose() {
				this.datetimeShow = false;
			},
			timeConfirm(data) {
				this.datetimeShow = false;
				var now = new Date(data.value); // 依情况进行更改 * 1
				var y = now.getFullYear();
				var m = now.getMonth() + 1;
				var d = now.getDate();
				this.dataForm.searchCheckDate = y + "-" + m.toString().padStart(2, '0');
				this.getFindCheckRecordList(true);
			},
			addPatrol(item) {
				if (item) {
					item = JSON.stringify(item);
				}
				this.$tab.navigateTo("/pages/management/check/addOrUpdatePatrol?item=" + item)
			}
		}
	}
</script>

<style scoped lang="scss">
	.page {
		height: 100vh;
		width: 100%;
		padding: 130rpx 0 0 0;
	}

	.topView {
		width: 100%;
		height: 110rpx;
		position: fixed;
		top: 0;
		padding: 0 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #fff;
		border-top: 1px solid #F5F5F5;
		z-index: 999;

		.topView1 {
			width: 180rpx;
			height: 60rpx;
			color: #999999;
			display: flex;
			align-items: center;
			font-size: 26rpx;

			.uIcon {
				margin-left: 5rpx;
			}
		}

		.topView2 {
			width: calc(100% - 200rpx);
			height: auto;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	}


	.removeView {
		height: calc(100% - 20rpx);
		width: 120rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;

		.removeView1 {
			width: 6rpx;
			height: 100%;
			background-color: #ffffff;
		}

		.removeView2 {
			display: flex;
			justify-content: center;
			align-items: center;
			width: calc(100% - 6rpx);
			height: 100%;
			background-color: #ff5500;
		}
	}


	.contentView {
		width: 100%;
		height: calc(100% - 176rpx);
		overflow-y: auto;
		padding: 0 30rpx;



		.contentTab {
			width: 100%;
			height: auto;
			background: #FFFFFF;
			border-radius: 12rpx;
			padding: 0 24rpx 24rpx 24rpx;
			margin-bottom: 20rpx;

			.contentTitle {
				width: 100%;
				min-height: 80rpx;
				height: auto;
				padding: 10rpx 0;
				border-bottom: 1px solid #F5F5F5;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.contentTitle1 {
					width: calc(100% - 145rpx);
					height: auto;
					font-family: PingFang SC, PingFang SC;
					font-weight: 500;
					font-size: 28rpx;
					color: #333333;
					font-style: normal;
					text-transform: none;
				}

				.contentTitle2 {
					width: 140rpx;
					height: auto;
					font-family: PingFang SC, PingFang SC;
					font-weight: 400;
					font-size: 24rpx;
					color: #999999;
					text-align: left;
					font-style: normal;
					text-transform: none;
				}
			}

			.contentLi {
				width: 100%;
				height: auto;
				min-height: 72rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 24rpx;
				color: #999999;
				text-align: left;
				font-style: normal;
				text-transform: none;

				.contentLi1 {
					display: flex;
					align-items: center;
				}

				// .contentLi2 {}
			}
		}
	}

	.bottomView {
		height: 176rpx;
		width: 100%;
		background-color: #fff;
		position: fixed;
		bottom: 0;
		z-index: 99;

		box-shadow: 0rpx -1rpx 0rpx 2rpx rgba(0, 0, 0, 0.16);

		.buttonView {
			width: calc(100% - 60rpx);
			height: 84rpx;
			background: #FA8161;
			border-radius: 12rpx 12rpx 12rpx 12rpx;
			margin-left: 30rpx;
			text-align: center;
			line-height: 84rpx;
			color: #fff;
			margin-top: 20rpx;
		}
	}
</style>