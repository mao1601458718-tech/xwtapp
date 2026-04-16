<template>
	<view>
		<view class="mapViewTop">
			<view class="mapViewTop-1">
				<view class="mapViewTop-2">签到项目：</view>
				<view class="mapViewTop-3">
					{{atPorject.checkProjectName}}
				</view>
			</view>
			<view class="mapViewTop-1" v-if="atType=='maintenance'">
				<view class="mapViewTop-2">签到计划：</view>
				<view class="mapViewTop-3">
					{{atPlan.planName||"暂无需要签到计划"}}
				</view>
				<view class="mapViewTop-4"> <u-icon name="list-dot" color="#999999" size="25"
						@click="rightPopup=true"></u-icon></view>
			</view>
		</view>
		<map class="mapView" :latitude="latitude" :longitude="longitude" :markers="covers"
			:include-points="includePoints">
		</map>
		<view class="mapViewBotton">
			<view class="mapViewBotton1">
				<view class="mapViewBotton1-1">我的位置</view>
				<view class="mapViewBotton1-2">{{longitude}},{{latitude}}</view>
			</view>
			<view class="mapViewBotton2">
				<view class="mapViewBotton2-1">地址：</view>
				<view class="mapViewBotton2-2 u-line-2">广东省广州市天河区车陂西路2112号</view>
			</view>
			<view class="buttonView" :class="showSignTextclass()" @click="addSign()">
				{{showSignText()}}
			</view>
		</view>

		<u-popup :show="rightPopup" mode="bottom" :zIndex="99999999" :overlay="false" @close="popupClose"
			@open="popupOpen">
			<view class="uPopup">
				<view class="uPopupTop">
					<view class="uPopupTop1"></view>
					<view class="uPopupTop2">签到计划</view>
					<view class="uPopupTop3"><u-icon @click="popupClose()" name="close" color="#999999"
							size="22"></u-icon></view>
				</view>
				<view class="planListView">
					<view class="collapse-item" v-for="(item,index) in planList" :key="index" @click="selecrPlan(item)">
						<view class="collapse-icon on" v-if="item.singLog>0">已</view>
						<view class="collapse-icon off" v-else>未</view>
						<view class="collapse-title">
							<view>
								{{item.planName}}
							</view>
						</view>
						<view class="collapse-select">
							<image class="collapse-image" v-if="atPlan.id==item.id"
								src="/static/images/function/dui.png">
							</image>
						</view>
					</view>
				</view>

				<view class="notPlanList" v-if="!planList||planList.length==0">— 暂无签到计划 —</view>
			</view>
		</u-popup>

		<u-modal :show="uModal.show" :title="uModal.title" showCancelButton @confirm="confirm"
			@cancel="cancel"></u-modal>

		<u-popup :show="imgPopup" mode="center" :zIndex="999999" @close="imgPopupClose" :closeOnClickOverlay="false">
			<view class="imgPopupView">
				<view class="uPopupTop">
					<view class="uPopupTop1"></view>
					<view class="uPopupTop2">签到图片</view>
					<view class="uPopupTop3"><u-icon @click="imgPopupClose()" name="close" color="#999999"
							size="22"></u-icon></view>
				</view>
				<view class="imgTitle">请按要求拍摄签到图片</view>
				<view class="imgViewList">
					<view class="imgView" @click="getImg(1)">
						<view class="iconView" v-if="!imgList.src1">
							<view class="imgIcon"><u-icon name="plus" color="#999999" size="35"></u-icon></view>
							<view class="iconView1">拍摄现场建筑图片</view>
						</view>
						<view v-else>
							<image class="image" :src="imgList.src2"></image>
						</view>
					</view>
					<view class="imgView" @click="getImg(2)">
						<view class="iconView" v-if="!imgList.src2">
							<view class="imgIcon"><u-icon name="plus" color="#999999" size="35"></u-icon></view>
							<view class="iconView1">拍摄本人现场图片</view>
						</view>
						<view v-else>
							<image class="image" :src="imgList.src2"></image>
						</view>
					</view>

				</view>
				<view class="signBotton">签 到</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		findPlanManagementList
	} from '@/api/maintenance/maintenance'
	import {
		findByProjectCheckProject
	} from '@/api/project/project.js'
	import {
		findBySafetyCheckProject
	} from '@/api/safety/safety.js'
	export default {
		data() {
			return {
				imgPopup: false,
				rightPopup: false,
				latitude: "23.123465",
				longitude: "112.11231312",
				covers: [],
				includePoints: [],
				atPorject: "",
				atType: "",
				planList: "",
				atPlan: "",
				uModal: {
					show: false,
					title: "",
				},
				imgList: {
					src1: "",
					src2: ""
				}
			}
		},
		onReady() {


		},
		onLoad() {
			this.atPorject = this.$store.state.user.checkProject;
			this.atType = this.$store.state.user.atType;
			this.covers = []
			this.includePoints = [],
				this.$nextTick(() => {
					uni.getLocation({
						type: 'gcj02',
						success: (res) => {
							this.latitude = res.latitude
							this.longitude = res.longitude
							this.covers.push({
								id: 1,
								latitude: res.latitude,
								longitude: res.longitude,
								iconPath: '/static/images/map/map3.png',
							})
							this.covers.push({
								id: 2,
								latitude: this.atPorject.lat,
								longitude: this.atPorject.lng,
								iconPath: '/static/images/map/map3.png',
							})
							this.includePoints = this.covers
						}
					});

					// 提取所有坐标的数组

				})

			this.getFindByCheckProject();

		},
		methods: {
			getFindByCheckProject() {
				let data = {
					id: this.atPorject.id
				}
				if (this.atType == 'maintenance') {
					this.getFindPlanManagementList();
				} else if (this.atType == 'project') {
					findByProjectCheckProject(data).then(res => {
						this.atPlan = res.obj
					})
				} else if (this.atType == 'safety') {
					findBySafetyCheckProject(data).then(res => {
						this.atPlan = res.obj
					})
				}


			},
			//侧边弹框关闭
			popupClose() {
				this.rightPopup = false;
			},
			//侧边弹框打开
			popupOpen() {

			},
			//签到图片弹框
			imgPopupClose() {
				this.imgPopup = false;
			},
			selecrPlan(item) {
				this.atPlan = item;
				this.popupClose();
			},
			showSignText() {

				if (!this.atPlan && this.atType == 'maintenance') {
					return "暂无签到计划"
				}
				if (this.atPlan && this.atPlan.singLog == 0) {
					return "签 到"
				}
				if (this.atPlan && this.atPlan.singLog > 0) {
					return "已 签 到"
				}
			},
			showSignTextclass() {
				if (!this.atPlan && this.atType == 'maintenance') {
					return "buttonView2"
				}
				if (this.atPlan && this.atPlan.singLog > 0) {
					return "buttonView1"
				}
			},
			addSign() {
				if (!this.atPlan) {
					this.$modal.showToast('暂无签到计划')
					return;
				}
				if (this.atPlan && this.atPlan.singLog > 0) {
					this.uModal.show = true;
					this.uModal.title = "该项目已签到，是否继续签到。";
					return;
				}

				if (this.atType == 'maintenance') {
					this.uModal.show = true;
					this.uModal.title = "当前计划：" + this.atPlan.planName + "。是否进行签到";
				} else {
					this.uModal.show = true;
					this.uModal.title = "当前项目：" + this.atPlan.checkProjectName + "。是否进行签到";
				}
			},
			confirm() {
				this.uModal.show = false;
				this.imgPopup = true;
			},
			cancel() {
				this.uModal.show = false;
			},
			postSign() {

			},
			getFindPlanManagementList() {
				let data = {
					"customerId": this.atPorject.id,
					"projectId": this.$store.state.user.projectId,
					"pageIndex": 1,
					"pageSize": 0,
					"checkDate": "2021-04-20",
					"effective": 1,
					"clientType": 1
				}

				let time = new Date();
				const year = time.getFullYear();
				const month = (time.getMonth() + 1).toString().padStart(2, '0'); // 月份是从0开始的
				let date = `${year}-${month}`;
				findPlanManagementList(data).then(res => {
					this.planList = res.listObj;
					this.planList.forEach((item) => {
						if (item.startDate.substring(0, 7) == date) {
							this.atPlan = item;
						}
					})
					if (!this.atPlan && this.planList.length > 0) {
						this.atPlan = this.planList[0];
					}
				})
			},
			getImg(type) {
				uni.chooseImage({
					count: 6, //默认9
					sizeType: ['compressed '], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['camera'], //从相册选择
					success: (res) => {
						console.log(res.tempFilePaths)
						if (type == 1) {
							this.imgList.src1 = res.tempFilePaths[0];
						} else {
							this.imgList.src2 = res.tempFilePaths[0];
						}
					}
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.mapView {
		width: 100%;
		position: fixed;
		height: calc(100vh - 302rpx);
	}

	.mapViewTop {
		width: calc(100% - 60rpx);
		margin-left: 30rpx;
		margin-top: 24rpx;
		height: auto;
		position: fixed;
		z-index: 11;
		background-color: #fff;
		padding: 20rpx;
		border-radius: 12rpx;

		.mapViewTop-1 {
			display: flex;
			align-items: center;
			height: auto;
		}

		.mapViewTop-2 {
			width: 100px;
			height: 40px;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.mapViewTop-3 {
			width: calc(100% - 125px);
			height: auto;
			display: flex;
			align-items: center;
		}

		.mapViewTop-4 {
			width: 25px;
			height: auto;

		}
	}

	.mapViewBotton {
		height: 302rpx;
		width: 100%;
		position: fixed;
		z-index: 11;
		background-color: #fff;
		padding: 20rpx;
		bottom: 0;

		.mapViewBotton1 {
			width: 100%;
			display: flex;
			height: auto;
			align-items: center;

			.mapViewBotton1-1 {
				font-family: PingFang SC, PingFang SC;
				font-weight: 500;
				font-size: 28rpx;
				color: #333333;
				text-align: left;
				font-style: normal;
				text-transform: none;
				width: 120rpx;
			}

			.mapViewBotton1-2 {
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 24rpx;
				color: #999999;
				text-align: left;
				font-style: normal;
				text-transform: none;
				margin-left: 20rpx;
			}
		}

		.mapViewBotton2 {
			width: 100%;
			display: flex;
			height: auto;
			align-items: center;
			margin-top: 16rpx;
			padding: 0 0 40rpx 0;
			border-bottom: 1px solid #F5F5F5;

			.mapViewBotton2-1 {
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 24rpx;
				color: #999999;
				text-align: left;
				font-style: normal;
				text-transform: none;
				width: 120rpx;
			}

			.mapViewBotton2-2 {
				width: calc(100% - 120rpx);
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 24rpx;
				color: #999999;
				text-align: left;
				font-style: normal;
				text-transform: none;
				margin-left: 20rpx;
			}
		}
	}

	.buttonView {
		width: calc(100% - 60rpx);
		margin-left: 30rpx;
		height: 84rpx;
		text-align: center;
		line-height: 84rpx;
		margin-top: 15rpx;
		font-family: PingFang SC, PingFang SC;
		font-weight: 600;
		font-size: 32rpx;
		color: #FFFFFF;
		text-align: center;
		font-style: normal;
		text-transform: none;
		background-color: #FA8161;

		border-radius: 12rpx 12rpx 12rpx 12rpx;
	}

	.buttonView1 {
		background: rgba(250, 129, 97, 0.7) !important;
	}

	.buttonView2 {
		background: #F5F5F5 !important;
		color: #9a9a9a;
	}

	.uPopup {
		width: 100%;
		height: 600px;
		background: #fff;
		border-radius: 12rpx 12rpx 0 0;

		.planListView {
			overflow-y: auto;
			height: 520px;
		}
	}

	.uPopupTop {
		width: 100%;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #F5F5F5;

		.uPopupTop1 {
			width: 50rpx;
			height: 20rpx;
			margin-left: 20rpx;
		}

		.uPopupTop2 {
			width: auto;
			height: auto;
		}

		.uPopupTop3 {
			width: 50rpx;
			height: auto;
			margin-right: 20rpx;
		}
	}

	.collapse-item {
		width: 100%;
		height: auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 50px;
		border-bottom: 2rpx solid #E3E3E3;
		padding: 10rpx 20rpx;

		.collapse-select {
			width: 50rpx;
			height: 50rpx;

			.collapse-image {
				width: 30rpx;
				height: 30rpx;
			}
		}

		.collapse-icon {
			width: 50rpx;
			height: 50rpx;
			text-align: center;
			line-height: 50rpx;
		}

		.off {
			background-color: #f4f4f5;
			border-color: #e9e9eb;
			color: #909399;
			border: 1px solid #d9ecff;
		}

		.on {
			background-color: #f0f9eb;
			border-color: #e1f3d8;
			color: #67c23a;
			border: 1px solid #d9ecff;
		}

		.collapse-title {
			width: calc(100% - 140rpx);
			height: auto;

			.collapse-min-title {
				font-size: 22rpx;
				color: #909399;
			}
		}

	}

	.notPlanList {
		width: 100%;
		height: 60rpx;
		line-height: 60rpx;
		margin-top: 40rpx;
		text-align: center;
		font-size: 28rpx;
		color: #909399;
	}

	.imgPopupView {
		width: 600rpx;
		height: auto;
		background: #FFFFFF;
		box-shadow: 0rpx 2rpx 64rpx 2rpx rgba(151, 154, 158, 0.1);

		.imgTitle {
			padding: 10rpx 20rpx;
		}

		.imgViewList {
			width: auto;
			height: auto;
			display: flex;
			justify-content: space-between;
			padding: 0 30rpx;
			margin-top: 20rpx;

			.imgView {
				width: 260rpx;
				height: 400rpx;
				border-radius: 12rpx 12rpx 12rpx 12rpx;
				border: 2rpx solid rgba(0, 0, 0, 0);
				background-color: #F1F1F1;
				display: flex;
				justify-content: center;
				align-items: center;
				text-align: center;

				.image {
					width: 260rpx;
					height: 400rpx;
					background-size: 100%;
				}

				.iconView {
					width: 100%;
					height: auto;

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
						margin-top: 40rpx;
					}
				}
			}
		}

		.signBotton {
			margin-top: 40rpx;
			margin-bottom: 40rpx;
			width: calc(100% - 60rpx);
			margin-left: 30rpx;
			height: 84rpx;
			text-align: center;
			line-height: 84rpx;
			font-family: PingFang SC, PingFang SC;
			font-weight: 600;
			font-size: 32rpx;
			color: #FFFFFF;
			text-align: center;
			font-style: normal;
			text-transform: none;
			background-color: #FA8161;

			border-radius: 12rpx 12rpx 12rpx 12rpx;
		}
	}
</style>