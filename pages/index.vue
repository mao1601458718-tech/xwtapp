<template>
	<view class="content">
		<scroll-view scroll-y class="scrollView" :refresher-threshold="105" :refresher-enabled="true"
			:refresher-triggered="refresherTriggered" @refresherrefresh="refresherrefresh"
			@refresherrestore="refresherrestore" @refresherabort="refresherabort"
			:refresher-background="'linear-gradient(180deg, #F8765F 0%, #FFD28F 71%, rgba(255, 231, 207, 0) 100%)'">
			<view class="bgColor"></view>
			<view class="top-title">
				<view class="top-title-1"></view>
				<view class="top-title-2 u-line-2">{{atPorject.checkProjectName||"暂无项目"}}</view>
				<view class="top-title-3"><u-icon name="list-dot" size="35" color="#fff"
						@click="showRightPopup(null)"></u-icon>
				</view>
			</view>
			<view class="bannerView">
				<u-swiper :list="list1" indicator height="250rpx" showTitle keyName="url" radius="16rpx"
					:autoplay="false" @click="swiperClick"></u-swiper>
			</view>
			<view class="today">
				<view class="today-top">
					<view class="today-top-1">
						<view class="line"></view>
						<view class="today-top-text">今日概况</view>
					</view>
					<view class="today-top-2">上次更新 {{newDate}}</view>
				</view>
				<view class="today-count">
					<view class="today-view" @click="showRightPopup(0)">
						<view class="today-view-title">维保</view>
						<view class="today-sum">
							<view class="today-sum-1">{{statisticsObj.maintenanceCount}}</view>
							<view class="today-sum-1 color81B456">{{statisticsObj.maintenanceON}}</view>
						</view>
						<view class="today-sum">
							<view class="today-sum-2">总数</view>
							<view class="today-sum-2">未完成</view>
						</view>
					</view>
					<view class="today-view" @click="showRightPopup(1)">
						<view class="today-view-title">检测</view>
						<view class="today-sum">
							<view class="today-sum-1">{{statisticsObj.projectCount}}</view>
							<view class="today-sum-1 color81B456">{{statisticsObj.projectON}}</view>
						</view>
						<view class="today-sum">
							<view class="today-sum-2">总数</view>
							<view class="today-sum-2">未完成</view>
						</view>
					</view>
					<view class="today-view" @click="showRightPopup(2)">
						<view class="today-view-title">评估</view>
						<view class="today-sum">
							<view class="today-sum-1">{{statisticsObj.safetyCount}}</view>
							<view class="today-sum-1 color81B456">{{statisticsObj.safetyON}}</view>
						</view>
						<view class="today-sum">
							<view class="today-sum-2">总数</view>
							<view class="today-sum-2">未完成</view>
						</view>
					</view>
				</view>
			</view>
			<view class="functionView">
				<view class="function-title">功能管理</view>

				<view class="function-count">
					<view class="count-view" v-for="(item,index) in showFunctionList" :key="index"
						:style="'background-color:'+item.backgroundColor+ ';margin-right:'+getMarginRight(index)+';'"
						@click="clickFunction(item)">
						<image :src="item.icon" class="iconImg"></image>
						<view class="count-title">{{item.title}}</view>
						<view class="count-explain">{{item.explain}}</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<u-popup :show="rightPopup" mode="right" closeOnClickOverlay @close="popupClose" @open="popupOpen">
			<view class="popupView" scroll-y="true">
				<view class="popupTitle">请选择项目</view>
				<view class="popupInput">
					<u--input class="uInput" borde="none" shape="circle" clearable placeholder="请输入项目名称"
						v-model="searchValue" @change="clickSearchValue"></u--input>
				</view>
				<view class="popupLine"></view>
				<u-collapse :value="rightPopupIndex" :accordion="accordion" class="uCollapse" :key="uCollapse">
					<u-collapse-item title="维保" :name="0" v-if="maintenanceListSelect.length>0">
						<view class="collapse-item" v-for="(item,index) in maintenanceListSelect" :key="index"
							@click="selecrPorject('maintenance',item,index,0)">
							<view class="collapse-icon on" v-if="!item.planState||item.planState==4">完</view>
							<view class="collapse-icon off" v-else>未</view>
							<view class="collapse-title">
								<view>
									{{item.checkProjectName}}
								</view>
								<view class="collapse-min-title">{{item.maintenanceProjectName}}</view>
							</view>
							<view class="collapse-select">
								<image class="collapse-image" v-if="selectIndex=='maintenance'+item.id"
									src="/static/images/function/dui.png"></image>
							</view>
						</view>
					</u-collapse-item>
					<u-collapse-item title="检测" :name="1" v-if="projectListSelect.length>0">
						<view class="collapse-item" v-for="(item,index) in projectListSelect" :key="index"
							@click="selecrPorject('project',item,index,1)">

							<view class="collapse-title">
								<view>{{item.checkProjectName}}</view>
								<view class="collapse-min-title">{{item.detectType==1?"设施检测":"防火检测"}}</view>
							</view>
							<view class="collapse-select">
								<image class="collapse-image" v-if="selectIndex=='project'+item.id"
									src="/static/images/function/dui.png"></image>
							</view>
						</view>
					</u-collapse-item>
					<u-collapse-item title="评估" :name="2" v-if="safetyListSelect.length>0">
						<view class="collapse-item" v-for="(item,index) in safetyListSelect" :key="index"
							@click="selecrPorject('safety',item,index,2)">
							<!-- <view class="collapse-icon on" v-if="!item.planState||item.planState==4">完</view>
							<view class="collapse-icon off" v-else>未</view> -->
							<view class="collapse-title">
								<view>{{item.checkProjectName}}</view>
								<view class="collapse-min-title">{{item.requesterUnit}}</view>
							</view>
							<view class="collapse-select">
								<image class="collapse-image" v-if="selectIndex=='safety'+item.id"
									src="/static/images/function/dui.png"></image>
							</view>
						</view>
					</u-collapse-item>
					<u-collapse-item title="排查" :name="3" v-if="dangerListSelect.length>0">
						<view class="collapse-item" v-for="(item,index) in dangerListSelect" :key="index"
							@click="selecrPorject('danger',item,index,3)">
							<view class="collapse-icon on" v-if="!item.planState||item.planState==4">完</view>
							<view class="collapse-icon off" v-else>未</view>
							<view class="collapse-title">
								<view>{{item.checkProjectName}}</view>
								<!-- <view class="collapse-min-title">{{item.maintenanceProjectName}}</view> -->
							</view>
							<view class="collapse-select">
								<image class="collapse-image" v-if="selectIndex=='danger'+item.id"
									src="/static/images/function/dui.png"></image>
							</view>
						</view>
					</u-collapse-item>
				</u-collapse>
			</view>
		</u-popup>
	</view>
</template>


<script>
	import {
		findByMyCheckProjectUnfinishedList
	} from '@/api/maintenance/maintenance'
	import {
		findByMyCheckProjectList
	} from '@/api/project/project.js'
	import {
		findByMyCheckProjectSafetyList
	} from '@/api/safety/safety.js'
	import {
		findByMyCheckProjectDangerList
	} from '@/api/danger/danger.js'
	import config from '@/config'
	// import "@/static/home.css";
	export default {
		data() {
			return {
				timer: null,
				searchValue: "",
				rightPopupIndex: "",
				rightPopupName: "",
				rightPopup: false,
				uCollapse: 0,
				accordion: true,
				list1: [{
						url: "/static/images/slider3.png",
						title: "",
						poster: "/static/images/slider3.png",
						src: ""
					},
					{
						url: "/static/images/slider2.png",
						title: "",
						poster: "/static/images/slider2.png",
						src: ""
					}
				],
				safetyList: [],
				dangerList: [],
				projectList: [],
				maintenanceList: [],
				safetyListSelect: [],
				dangerListSelect: [],
				projectListSelect: [],
				maintenanceListSelect: [],
				selectIndex: "",
				showFunctionList: [],
				atPorject: "",
				newDate: "",
				statisticsObj: {
					maintenanceCount: 0,
					maintenanceON: 0,
					projectCount: 0,
					projectON: 0,
					safetyCount: 0,
					safetyON: 0,
				},
				refresherTriggered: false,
				_refresherTriggered: false,
				securitData: {
					msgList: [],
					parameter: {
						keyword: "",
						page: 1,
						limit: 20,
						sType: 'nomore',
						iconType: 'flower',
						status: true,
					}
				},
			}
		},
		onLoad() {
			this.getNewDate();
			this.getAllCheckProjectList();
		},
		onUnload() {
			clearTimeout(this.timer)
			this.timer = null

		},
		onShow() {
			this.atPorject = this.$store.state.user.checkProject;
			if (!this.atPorject) {
				this.getAllCheckProjectList();
			}
		},
		methods: {
			refresherrefresh() {
				if (this._refresherTriggered) {
					return;
				}
				this._refresherTriggered = true;
				//界面下拉触发，triggered可能不是true，要设为true
				if (!this.refresherTriggered) {
					this.refresherTriggered = true;
				}
				this.loadStoreData();
			},
			refresherrestore() {
				this.refresherTriggered = false;
				this._refresherTriggered = false;
			},
			refresherabort() {
				this.refresherTriggered = false;
				this._refresherTriggered = false;
			},
			loadStoreData() {
				this.getAllCheckProjectList();
				this.timer = setTimeout(() => {
					this.refresherTriggered = false; //触发onRestore，并关闭刷新图标
					this._refresherTriggered = false;
				}, 1000)
			},

			//设置右边弹框模式
			showRightPopup(index) {
				this.rightPopup = true;

				if (this.searchValue) {
					this.rightPopupIndex = [0, 1, 2, 3]
					return;
				}

				if (index != null) {
					this.rightPopupIndex = index;
				} else {
					if (this.rightPopupName != "") {
						this.rightPopupIndex = this.rightPopupName;
					}
				}

				// this.rightPopupIndex = index;
			},
			//点击轮播图
			swiperClick(index) {
				let src = this.list1[index].src;
				if (src) {

				}
			},
			//模糊查询
			clickSearchValue(value) {
				if (value) {
					this.maintenanceListSelect = this.maintenanceList.filter(item =>
						item.maintenanceProjectName.toLowerCase().includes(value.toLowerCase()) ||
						item.checkProjectName.toLowerCase().includes(value.toLowerCase())
					);
					this.projectListSelect = this.projectList.filter(item =>
						item.checkProjectName.toLowerCase().includes(value.toLowerCase())
					);
					this.safetyListSelect = this.safetyList.filter(item =>
						item.requesterUnit.toLowerCase().includes(value.toLowerCase()) ||
						item.checkProjectName.toLowerCase().includes(value.toLowerCase())
					);
					this.dangerListSelect = this.dangerList.filter(item =>

						item.checkProjectName.toLowerCase().includes(value.toLowerCase())
					);
					this.uCollapse += 1;
					this.rightPopupIndex = [0, 1, 2, 3]
					this.accordion = false;


				} else {
					this.maintenanceListSelect = this.maintenanceList;
					this.projectListSelect = this.projectList;
					this.safetyListSelect = this.safetyList;
					this.dangerListSelect = this.dangerList;
					this.accordion = true;
					this.rightPopupIndex = this.rightPopupName;
					this.uCollapse += 1;
				}

			},
			//右边弹框选择项目是设置相关属性
			selecrPorject(type, item, index, name) {
				this.selectIndex = type + item.id;
				this.rightPopupName = name;
				this.popupClose();
				this.atPorject = item;
				this.$store.dispatch('SetAtProject', item).then(res => {})
				this.$store.dispatch('SetAtType', type).then(res => {})
				this.filtrateFunctionList(type);
			},
			//点击功能块
			clickFunction(item) {
				//判断是否需要签到
				if (this.$store.state.user.atType == "project" || this.$store.state.user.atType ==
					"safety") { //检测和评估模块
					if (item.signType && (this.atPorject.singLog == 0 || !this.atPorject.singLog)) {
						this.$modal.showToast('请先进行现场签到')
						return;
					}
				}
				this.$tab.navigateTo(item.page)

			},
			//按照不通模块显示不用功能
			filtrateFunctionList(type) {
				this.showFunctionList = [];
				this.$store.state.user.functionList.forEach((item) => {
					if (item.type.some(value => value === type)) {
						if (item.title === "设施检测" || item.title === "防火检测" || item.title === "离线操作") {
							if (this.atPorject.detectType === 2 && item.explain === "防火检测") {
								this.showFunctionList.push(item)
							}
							if (this.atPorject.detectType === 1 && item.explain === "设施检测") {
								this.showFunctionList.push(item)
							}
						} else {
							this.showFunctionList.push(item)
						}
					}
				})
			},
			//获取当前时间
			getNewDate() {
				const now = new Date();
				const year = now.getFullYear();
				const month = String(now.getMonth() + 1).padStart(2, '0');
				const day = String(now.getDate()).padStart(2, '0');
				this.newDate = year + "/" + month + "/" + day
			},
			//动态设置功能模块右边距
			getMarginRight(index) {
				let a = (index + 1) % 3 == 0 ? "0rpx" : "21rpx";
				return a;
			},
			//侧边弹框关闭
			popupClose() {
				this.rightPopup = false
			},
			//侧边弹框打开
			popupOpen() {

			},
			//获取所有项目列表方法
			async getAllCheckProjectList() {
				let data = {
					"projectId": this.$store.state.user.projectId,
					"pageSize": 0,
					"pageIndex": 1,
					"limitSign": "project_data_limit"
				}
				this.searchValue = "";
				try {
					await Promise.all([
						this.getMaintenanceList(data),
						this.getCheckProjectList(data),
						this.getCheckProjectSafetyList(data),
						this.getCheckProjectDangerList(data)
					]);
					if (!this.atPorject && this.maintenanceList.length > 0) {
						this.filtrateFunctionList("maintenance");
						this.selecrPorject('maintenance', this.maintenanceList[0], 0, 0);
						this.rightPopupIndex = 0
						this.rightPopupName = 0;
						this.uCollapse++;

					} else if (!this.atPorject && this.projectList.length > 0) {
						this.filtrateFunctionList("project");
						this.selecrPorject('project', this.projectList[0], 0, 0);
						this.rightPopupIndex = 1
						this.rightPopupName = 1;
						this.uCollapse++;
					} else if (!this.atPorject && this.safetyList.length > 0) {
						this.filtrateFunctionList("safety");
						this.selecrPorject('safety', this.safetyList[0], 0, 0);
						this.rightPopupIndex = 2
						this.rightPopupName = 2;
						this.uCollapse++;
					} else if (!this.atPorject && this.dangerList.length > 0) {
						this.filtrateFunctionList("danger");
						this.selecrPorject('danger', this.dangerList[0], 0, 0);
						this.rightPopupIndex = 3
						this.rightPopupName = 3;
						this.uCollapse++;
					}
					// this.filtrateFunctionList("danger");
					// this.selecrPorject('danger', this.dangerList[0], 0, 0);
					// this.rightPopupIndex = 3
					// this.rightPopupName = 3;
					// this.uCollapse++;
				} catch (error) {
					console.error("Error executing methods:", error);
				}
			},

			//获取维保项目列表
			async getMaintenanceList(data) {

				const res = await findByMyCheckProjectUnfinishedList(data);
				if (res.object) {
					this.maintenanceList = res.object.list
					this.maintenanceListSelect = this.maintenanceList;
					this.statisticsObj.maintenanceCount = res.object.allTotalCount;
					this.statisticsObj.maintenanceON = res.object.unTotalCount;
				}

			},

			//获取排查项目列表
			async getCheckProjectDangerList(data) {

				const res = await findByMyCheckProjectDangerList(data);
				if (res.object) {
					this.dangerList = res.object.list
					this.dangerListSelect = this.dangerList;
				}

			},
			//获取评估项目列表
			async getCheckProjectSafetyList(data) {

				const res = await findByMyCheckProjectSafetyList(data);
				if (res.object) {
					this.safetyList = res.object.list
					this.safetyListSelect = this.safetyList;
					this.statisticsObj.safetyCount = res.object.allTotalCount;
					this.statisticsObj.safetyON = res.object.unTotalCount;
				}

			},
			//获取检测项目列表
			async getCheckProjectList(data) {
				const res = await findByMyCheckProjectList(data);
				if (res.object) {
					this.projectList = res.object.list
					this.projectListSelect = this.projectList;
					this.statisticsObj.projectCount = res.object.allTotalCount;
					this.statisticsObj.projectON = res.object.unTotalCount;
				}
			},
		}
	}
</script>


<style scoped lang="scss">
	.content {
		width: 100%;
		height: 100vh;
		padding: 96rpx 0 0 0;
	}

	.scrollView {
		width: 100%;
		height: calc(100% - 0rpx);
	}

	.bgColor {
		position: fixed;
		top: 0;
		z-index: -1;
		width: 750rpx;
		height: 602rpx;
		background: linear-gradient(180deg, #F8765F 0%, #FFD28F 71%, rgba(255, 231, 207, 0) 100%);
		border-radius: 0rpx 0rpx 0rpx 0rpx;
	}

	.top-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: auto;
		// margin-top: 96px;
		width: calc(100% - 60rpx);
		margin-left: 30rpx;

		.top-title-1 {
			width: 30px;
			height: 50px;
		}

		.top-title-2 {
			width: calc(100% - 140px);
			height: 50px;

			font-family: PingFang SC, PingFang SC;
			font-weight: 600;
			font-size: 36rpx;
			color: #FFFFFF;
			text-align: center;
			font-style: normal;
			text-transform: none;
		}

		.top-title-3 {
			width: 30px;
			height: 50px;
		}
	}

	.bannerView {
		margin-top: 30rpx;
		width: calc(100% - 60rpx);
		margin-left: 30rpx;
		height: 250rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
	}

	.today {
		margin-top: 30rpx;
		width: calc(100% - 60rpx);
		margin-left: 30rpx;
		height: 258rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
		padding: 24rpx;

		.today-top {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.today-top-1 {
				display: flex;
				align-items: center;

				.line {
					width: 6rpx;
					height: 28rpx;
					background: #FC9867;
					border-radius: 4rpx 4rpx 4rpx 4rpx;
					margin-right: 10rpx;
				}

				.today-top-text {
					font-family: PingFang SC, PingFang SC;
					font-weight: 600;
					font-size: 30rpx;
					color: #181818;
					font-style: normal;
					text-transform: none;
				}
			}


			.today-top-2 {
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 24rpx;
				color: #9A9A9A;
				text-align: right;
				font-style: normal;
				text-transform: none;
			}
		}


		.today-count {
			width: 100%;
			height: 146rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 20rpx;

			.today-view {
				width: calc(100% / 3 - 15rpx);
				height: 146rpx;
				background: #F8F8F8;
				border-radius: 12rpx 12rpx 12rpx 12rpx;
				padding: 14rpx 28rpx;

				.today-view-title {
					font-family: PingFang SC, PingFang SC;
					font-weight: 400;
					font-size: 24rpx;
					color: #333333;
					text-align: left;
					font-style: normal;
					text-transform: none;
					margin-bottom: 18rpx;
					text-align: center;
				}

				.today-sum {
					width: 100%;
					display: flex;
					align-items: center;

					.today-sum-1 {
						width: 50%;
						font-family: Arial, Arial;
						font-weight: bold;
						font-size: 28rpx;
						text-align: left;
						font-style: normal;
						text-transform: none;
						text-align: center;
					}

					.color81B456 {
						color: #FF7171;
					}

					.today-sum-2 {
						width: 50%;
						font-family: PingFang SC, PingFang SC;
						font-weight: 400;
						font-size: 20rpx;
						color: #333333;
						text-align: left;
						font-style: normal;
						text-transform: none;
						text-align: center;
						margin-top: 12rpx;
					}
				}

			}
		}
	}

	.functionView {
		margin-top: 30rpx;
		margin-bottom: 50px;
		width: calc(100% - 60rpx);
		margin-left: 30rpx;
		min-height: 750rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
		padding: 21rpx;

		.function-title {
			width: 120rpx;
			height: 42rpx;
			font-family: PingFang SC, PingFang SC;
			font-weight: 600;
			font-size: 30rpx;
			color: #181818;
			text-align: center;
			font-style: normal;
			text-transform: none;
			margin-bottom: 24rpx;
		}

		.function-count {

			display: flex;
			// justify-content: space-between;
			flex-wrap: wrap;

			.count-view {
				width: calc(100% / 3 - 18rpx);
				height: 196rpx;
				border-radius: 12rpx;
				margin-bottom: 21rpx;
				padding: 24rpx;
				// box-shadow: 0rpx 12rpx 16rpx 2rpx rgba(198, 209, 207, 0.4);

				.iconImg {
					width: 64rpx;
					height: 60rpx;
				}

				.count-title {
					font-family: PingFang SC, PingFang SC;
					font-weight: 600;
					font-size: 28rpx;
					color: #181818;
					text-align: left;
					font-style: normal;
					text-transform: none;
					margin-top: 10rpx;
				}

				.count-explain {
					font-family: PingFang SC, PingFang SC;
					font-weight: 400;
					font-size: 22rpx;
					color: #9A9A9A;
					text-align: left;
					font-style: normal;
					text-transform: none;
					margin-top: 14rpx;
				}
			}
		}
	}

	.popupView {
		width: 300px;
		height: calc(100vh - 20rpx);
		overflow-y: auto;

		.popupTitle {
			width: 100%;
			padding: 25px;
			font-size: 20px;
			font-weight: 600;
			margin-top: 20px;
		}

		.popupInput {
			padding: 10px 20rpx;
			background-color: #f4f4f4;

		}

		.popupLine {
			width: 100%;
			height: 10rpx;
			background-color: #e8e8e8;
		}

		.uCollapse {
			overflow-y: auto;
			height: calc(100% - 160px);
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
		padding: 10rpx 0;

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
</style>