<template>
	<view class="page">
		<view class="topView">
			<view class="topView1" @click="datetimeShow = true">
				<u-datetime-picker :show="datetimeShow" v-model="datetimeValue" mode="year-month" @confirm="timeConfirm"
					@cancel="timeCose"></u-datetime-picker>
				<view>{{searchCheckDate||"日期筛选"}}</view>
				<u-icon class="uIcon" name="arrow-down-fill" color="#999999" size="20" v-if="!datetimeShow"></u-icon>
				<u-icon class="uIcon" name="arrow-up-fill" color="#999999" size="20" v-else></u-icon>
			</view>
			<view class="topView2">
				<u--input class="uInput" borde="none" shape="circle" clearable placeholder="请输入设备名称查询"
					v-model="deviceTypeName" @change="clickSearchValue"></u--input>
			</view>
		</view>
		<scroll-view scroll-y class="contentView">

			<uni-swipe-action>
				<!-- 使用插槽 （请自行给定插槽内容宽度）-->

				<uni-swipe-action-item v-for="(item,index) in selectCheckRecordList" :key="index" :threshold="50">
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
								<text v-if="!item.id" style="margin-left: 10rpx;color: #ff5500;"> 离线数据未上传</text>
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
		modifyCheckRecord
	} from '@/api/maintenance/maintenance'
	export default {
		data() {
			return {
				datetimeShow: false,
				datetimeValue: Number(new Date()),
				deviceTypeName: "",
				searchCheckDate: "",
				selectCheckRecordList: [],
				checkRecordList: [],
			}
		},
		onShow() {
			this.getFindCheckRecordList();
		},
		methods: {
			removeView(row) {
				uni.showModal({
					title: '提示',
					content: '确定删除该离线记录？',
					success: (res) => {
						if (res.confirm) {
							let getStorage = uni.getStorageSync('planOffLine_' + this.$store.state.user
								.checkProject.id);
							if (getStorage && getStorage.checkRecord) {
								getStorage.checkRecord.forEach((item, index) => {
									if (row.id == item.id || (!item.id && row.itemId == item.itemId)) {
										getStorage.checkRecord.splice(index, 1)
									}
								})
								uni.setStorageSync('planOffLine_' + this.$store.state.user.checkProject.id,
									getStorage);
								this.getFindCheckRecordList();
							}
						}
					}
				});
			},
			getFindCheckRecordList() {
				let getStorage = uni.getStorageSync('planOffLine_' + this.$store.state.user.checkProject.id);
				if (getStorage && getStorage.checkRecord) {
					this.checkRecordList = getStorage.checkRecord;
					// this.selectCheckRecordList = getStorage.checkRecord;
					this.clickSearchValue();
				}
			},


			clickSearchValue() {
				this.selectCheckRecordList = [];
				this.checkRecordList.forEach((item) => {
					if ((!this.deviceTypeName || item.deviceTypeName.toLowerCase().includes(this
							.deviceTypeName)) && (!this.searchCheckDate || item.checkDateDesc.toLowerCase()
							.includes(
								this.searchCheckDate))) {
						this.selectCheckRecordList.push(item)
					}
				})

			},
			timeCose() {
				this.searchCheckDate = "";
				this.datetimeShow = false;
				this.clickSearchValue();
			},
			timeConfirm(data) {
				this.datetimeShow = false;
				var now = new Date(data.value); // 依情况进行更改 * 1
				var y = now.getFullYear();
				var m = now.getMonth() + 1;
				var d = now.getDate();
				this.searchCheckDate = y + "-" + m.toString().padStart(2, '0');
				this.clickSearchValue();
			},
			addPatrol(item) {
				if (item) {
					item = JSON.stringify(item);
				}
				this.$tab.navigateTo("/pages/management/offLine/check/addOrUpdatePatrol?item=" + item)
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