<template>
	<view class="container">
		<!-- 页面头部 -->
		<view class="header">
			<view class="headerTab" @click="changePage(0)">
				<view class="headerTitle " :class="swiperCurrent==0?'color':''">
					{{dataForm.workOrderStatus==4?'工单信息':'待处理'}}
				</view>
				<view class="headerTitle">
					<view class="headerLine " :class="swiperCurrent==0?'background':''"></view>
				</view>
			</view>
			<view class="headerTab" @click="changePage(1)">
				<view class="headerTitle" :class="swiperCurrent==1?'color':''">工单日志</view>
				<view class="headerTitle">
					<view class="headerLine" :class="swiperCurrent==1?'background':''"></view>
				</view>
			</view>
		</view>

		<!-- 设备列表 -->
		<swiper class="swiperView" :current="swiperCurrent" :indicator-dots="false" :autoplay="false"
			@change="changeSwiper">
			<swiper-item class="swiperTtem">
				<scroll-view class="scrollView" style="height: 100%;" scroll-y>
					<view class="faultView">
						<view class="contentTitle">
							<view class="contentTitle1">工单信息</view>
						</view>
						<view class="contentLi">
							<view class="contentLi1">所属项目：<text class="text">{{dataForm.checkProjectName}}</text></view>
							<!-- <view class="contentLi2">手机号：1231231231</view> -->
						</view>
						<view class="contentLi">
							<view class="contentLi1 background">工单状态：<text
									class="background">{{dataForm.workOrderStatusTxt}}</text></view>
						</view>
					</view>
					<view class="faultView">
						<view class="contentTitle">
							<view class="contentTitle1">故障描述</view>
							<view class="contentTitle2" v-if="dataForm.workOrderStatus!=4" @click="goAddFaultInfo()">
								<u-icon name="edit-pen" size="18" color="#5590F5"></u-icon>编辑
							</view>
						</view>
						<view class="contentLi">
							<view class="contentLi1">报修人：<text class="text">{{dataForm.createUserName}}
									{{dataForm.createUserIdPhone}}</text> <u-icon size="25"
									v-if="dataForm.createUserIdPhone" color=" #5590F5"
									@click="callPhoneNumber(dataForm.createUserIdPhone)" name="phone-fill"></u-icon>
							</view>

						</view>
						<view class="contentLi">
							<view class="contentLi1">故障类型：<text class="text">{{dataForm.faultType}}</text></view>
						</view>
						<view class="contentViewText">
							<text class="contentView1">描述：</text>
							<text class="contentView2 u-line-1"><text
									class="text">{{dataForm.faultDescription}}</text></text>
						</view>
						<view class="imgListView">
							<view class="imageTab">
								<image v-for="(item,index) in imgList" class="image" :src="item"></image>
							</view>
						</view>
					</view>

					<view class="faultView">
						<view class="contentTitle">
							<view class="contentTitle1">维修信息</view>
							<view class="contentTitle2" v-if="dataForm.workOrderStatus!=4"
								@click="goTransmitUserList()"><u-icon name="share-square" size="18"
									color="#5590F5"></u-icon>转派
							</view>
						</view>
						<view class="contentLi">
							<view class="contentLi1">维修工程师：<text
									class="text">{{dataForm.maintenanceUserName || dataForm.createUserName}}
									{{dataForm.maintenancePhone}}</text>
								<u-icon size="25" v-if="dataForm.createUserIdPhone" color=" #5590F5"
									@click="callPhoneNumber(dataForm.maintenancePhone)" name="phone-fill"></u-icon>
							</view>

						</view>
						<view class="contentLi">
							<view class="contentLi1">故障设备：<text class="text">{{dataForm.deviceName}}</text></view>
						</view>

						<view class="contentInput" v-if="dataForm.workOrderStatus!=4">
							<u--textarea v-model="dataForm.maintenanceResult" placeholder="维修说明" height="120rpx"
								:adjustPosition="false" :confirmType="null" :maxlength="-1"></u--textarea>
						</view>

						<view class="contentViewText" v-if="dataForm.workOrderStatus==4">
							<text class="contentView1">描述：</text>
							<text class="contentView2 u-line-1"><text
									class="text">{{dataForm.maintenanceResult}}</text></text>
						</view>
						<img-view :imgListData="maintenanceImage" v-if="dataForm.workOrderStatus!=4" :imgSum="2"
							@uploadSucceed="uploadSucceed" @removeImg="removeImg"></img-view>

						<view class="imgListView" v-if="dataForm.workOrderStatus==4">
							<view class="imageTab">
								<image v-for="(item,index) in imgList" class="image" :src="item"></image>
							</view>
						</view>

						<view class="buttonView" v-if="dataForm.workOrderStatus!=4">
							<view class="button" @click="postMaintain">保存维修信息</view>
						</view>
					</view>

				</scroll-view>

			</swiper-item>
			<swiper-item>
				<view class="logIconView">
					<view class="logIcon1">
						<image class="logIcon3" src="/static/images/fault/fault2.png"></image>
						<view class="logIcon2  completedText">已接受</view>
					</view>
					<view class="lineView completed"></view>
					<view class="logIcon1">
						<image class="logIcon3" src="/static/images/fault/fault1.png"></image>
						<view class="logIcon2 completedText">维修中</view>
					</view>
					<view class="lineView" :class="dataForm.workOrderStatus==4?'completed':''"></view>
					<view class="logIcon1">
						<image class="logIcon3" v-if="dataForm.workOrderStatus==4" src="/static/images/fault/fault.png">
						</image>
						<image class="logIcon3" v-else src="/static/images/fault/fault3.png"></image>
						<view class="logIcon2" :class="dataForm.workOrderStatus==4?'completedText':''">已完成</view>
					</view>

				</view>
				<scroll-view class="scrollView" style="height: 100%;" scroll-y>
					<view class="logTitleView">
						<view class="logTitle1" v-for="(item,index) in repairList" :key="index">
							<view class="logTitle2"></view>
							<view class="logTitle3">
								<view class="logTitle4">
									{{item.content?'':item.createUserName}}
									{{item.content||$store.state.user.workOrderStatus[item.workOrderStatus]}}
								</view>
								<view class="logTitle5">{{item.createTime}}</view>
							</view>
						</view>
					</view>
					<view style="height: 300rpx;"></view>
				</scroll-view>
			</swiper-item>
		</swiper>

		<view class="bottomView" v-if="dataForm.workOrderStatus!=4">
			<view class="viewLeft" v-if="dataForm.workOrderStatus!=6" @click="suspend(6)">暂停维修</view>
			<view class="viewRight" v-if="dataForm.workOrderStatus!=6" @click="suspend(4)">完成维修</view>

			<view class="viewMax" v-if="dataForm.workOrderStatus==6" @click="suspend(2)">恢复维修</view>
		</view>

	</view>
</template>

<script>
	import imgView from "@/pages/common/uploadImg.vue"
	import {
		updateFaultRepairRecord,
		findRepairProgressList
	} from '@/api/maintenance/findFault.js'

	export default {
		components: {
			imgView
		},
		data() {
			return {
				timer: null,
				buttonLoading: false,
				repairList: [],
				swiperCurrent: 0,
				dataForm: {},
				imgList: [],
				maintenanceImage: [],
			};
		},
		onLoad(data) {
			this.dataForm = JSON.parse(data.item)
			this.getFindRepairProgressList();
			this.imgList = this.dataForm.imageUrl.split(";");
			if (this.dataForm.maintenanceImageUrl) {
				let imgs = this.dataForm.maintenanceImageUrl.split(";");
				imgs.forEach((item) => {
					this.maintenanceImage.push({
						src: item,
						text: "上传成功",
						uploading: 1
					});
				})
			}
		},
		onUnload() {
			clearTimeout(this.timer)
			this.timer = null

		},
		methods: {
			changeSwiper(current, source) {
				console.log(current.detail.current)
			},
			goAddFaultInfo() {
				this.$tab.navigateTo("/pages/management/planFault/addFaultInfo?item=" + JSON.stringify(this.dataForm))
			},
			goTransmitUserList() {
				this.$tab.navigateTo("/pages/management/planFault/transmitUserList?item=" + JSON.stringify(this.dataForm))
			},
			changePage(type) {
				this.swiperCurrent = type
			},
			removeImg(data) {

				if (data.length == 0) {
					this.dataForm.maintenanceImageUrl = "";
				} else {
					let list = [];
					data.forEach((item) => {
						if (item.src) {
							list.push(item.src);
						}
					})
					this.dataForm.maintenanceImageUrl = list.join(';');
				}
			},
			uploadSucceed(data) {
				if (data.length == 0) {
					this.dataForm.maintenanceImageUrl = "";
				} else {
					let list = [];
					data.forEach((item) => {
						if (item.src) {
							list.push(item.src);
						}
					})
					this.dataForm.maintenanceImageUrl = list.join(';');
				}
			},
			postMaintain() {
				let data = {
					"id": this.dataForm.id,
					"maintenanceUserId": this.$store.state.user.id,
					"maintenanceImageUrl": this.dataForm.maintenanceImageUrl,
					"maintenanceResult": this.dataForm.maintenanceResult,
				}
				updateFaultRepairRecord(data).then(res => {
					uni.$u.toast('保存成功')
				})
			},
			getFindRepairProgressList() {
				let data = {
					"projectId": this.$store.state.user.projectId,
					"checkProjectId": this.$store.state.user.checkProject.id,
					"pageIndex": 1,
					"pageSize": 0,
					"faultRepairRecordId": this.dataForm.id,
					"orderCols": ["createTime"],
					"orderDesc": true
				}
				findRepairProgressList(data).then(res => {
					this.repairList = res.listObj;
				})
			},
			suspend(workOrderStatus) {
				let text = ""
				if (workOrderStatus == 2) {
					text = "恢复维修"
				} else if (workOrderStatus == 6) {
					text = "暂停维修"
				} else if (workOrderStatus == 4) {
					text = "完成维修"
				}
				uni.showModal({
					title: '提示',
					content: '是否' + text,
					success: (res) => {
						if (res.confirm) {
							let data = {
								"id": this.dataForm.id,
								"workOrderStatus": workOrderStatus
							}
							if (this.buttonLoading) {
								uni.$u.toast('请勿重复提交')
								return;
							}
							this.buttonLoading = true;
							updateFaultRepairRecord(data).then(res => {
								uni.$u.toast('操作成功')
								this.timer = setTimeout(() => {
									uni.navigateBack();
								}, 700);
							}).finally(() => {
								// 统一关闭loading
								this.buttonLoading = false;
							});
						}
					}
				});
			},
			callPhoneNumber(phone) {
				// 电话号码，请替换为实际号码

				uni.makePhoneCall({
					phoneNumber: phone, // 仅为示例，请使用正确的电话号码
					success: () => {
						console.log('拨打电话成功！');
					},
					fail: (err) => {
						console.error('拨打电话失败：', err);
					}
				});
			}
		}
	};
</script>

<style scoped lang="scss">
	.container {
		width: 100%;
		background-color: #f0f2f5;
		height: 100vh;
	}

	.header {
		width: 100%;
		text-align: center;
		margin-bottom: 30rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #fff;
		height: 80rpx;
		border-top: 1rpx solid #eee;
		padding: 0 20rpx;

		.headerTab {
			margin: 0 50rpx;

			font-family: PingFang SC, PingFang SC;
			font-weight: 400;
			font-size: 30rpx;
			color: #999999;
			text-align: left;
			font-style: normal;
			text-transform: none;

			.color {
				color: #FA8161;
			}

			.background {
				background: #FA8161;
			}

			.headerTitle {
				width: 100%;
				height: auto;
				display: flex;
				justify-content: center;
			}

			.headerLine {
				width: 28rpx;
				height: 6rpx;
				margin-top: 10rpx;
				border-radius: 4rpx 4rpx 4rpx 4rpx;
			}
		}
	}

	.swiperView {
		height: calc(100% - 280rpx);
		width: 100%;

		.swiperTtem {
			height: 100%;


			.scrollView {
				width: 100%;

				.faultView {
					width: 100%;
					height: auto;
					background: #FFFFFF;
					// border-radius: 12rpx;
					margin-bottom: 20rpx;
					padding: 0 24rpx 24rpx 24rpx;

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
							width: auto;
							height: auto;
							padding: 10rpx;
							font-family: PingFang SC, PingFang SC;
							font-weight: 400;
							font-size: 24rpx;
							color: #5590F5;
							text-transform: none;
							display: flex;
							align-items: center;

							.u-icon {
								margin-right: 10rpx;
							}
						}

						.statusType1 {
							background: #6DA0F6;
							border-radius: 0rpx 12rpx 0rpx 12rpx;
							font-family: PingFang SC, PingFang SC;

						}

						.statusType2 {
							background: #FA8161;
							border-radius: 0rpx 12rpx 0rpx 12rpx;

						}
					}

					.contentLi {
						width: 100%;
						height: auto;
						padding: 10rpx;
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

							.background {
								color: #FA8161;
							}

						}


						// .contentLi2 {}
					}

					.contentViewText {
						width: 100%;
						display: flex;
						margin-top: 10rpx;
						padding: 15rpx;

						background-color: #F7F7F7;

						.contentView1 {
							width: 130rpx;
							font-size: 25rpx;
							color: #999;

						}

						.contentView2 {
							width: calc(100% - 130rpx);
							font-size: 25rpx;
							color: #999999;
						}
					}

					.buttonView {
						width: 100%;
						height: auto;
						padding: 30rpx;

						.button {
							width: 100%;
							height: 72rpx;
							background: rgba(250, 129, 97, 0.1);
							border-radius: 12rpx 12rpx 12rpx 12rpx;
							border: 2rpx solid #FA8161;
							line-height: 72rpx;
							font-family: PingFang SC, PingFang SC;
							font-weight: 500;
							font-size: 28rpx;
							color: #FA8161;
							text-align: center;
							font-style: normal;
							text-transform: none;
						}
					}

					.imgListView {
						display: flex;
						justify-content: left;
						padding: 0 0 20rpx 0;
						margin-top: 10rpx;

						.imageTab {
							position: relative;

							.image {
								width: 160rpx;
								height: 160rpx;
								background-size: 100%;
								margin-right: 20rpx;
								border-radius: 12rpx;
							}

						}

					}
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
		justify-content: space-between;

		.viewMax {
			width: 100%;
			height: 84rpx;
			background: #FF5E5E;
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

		.viewLeft {
			width: calc(50% - 45rpx);
			height: 84rpx;
			background: #FF5E5E;
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

		.viewRight {
			width: calc(50% - 45rpx);
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

	.logIconView {
		width: 100%;
		height: auto;
		padding: 30rpx;
		background-color: #fff;
		display: flex;
		justify-content: space-between;

		.logIcon1 {
			text-align: center;

			.logIcon2 {
				height: 40rpx;
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 24rpx;
				text-align: left;
				font-style: normal;
				text-transform: none;
			}

			.logIcon3 {
				width: 60rpx;
				height: 60rpx;
			}
		}

		.lineView {
			margin-top: 30rpx;
			width: 204rpx;
			height: 2rpx;
			background-color: #999;
		}
	}

	.completed {
		background: #56B75D !important;
	}

	.completedText {
		color: #56B75D;
	}

	.logTitleView {
		margin-top: 20rpx;
		width: 100%;
		height: auto;
		background-color: #fff;

		padding: 0 30rpx 0 30rpx;

		.logTitle1 {
			width: 100%;
			height: 126rpx;
			display: flex;
			align-items: center;
			border-bottom: 1rpx solid #eee;

			.logTitle2 {
				width: 16rpx;
				height: 16rpx;
				background: #FA8161;
				border-radius: 8rpx;
			}

			.logTitle3 {
				margin-left: 20rpx;

				.logTitle4 {
					width: auto;
					height: auto;
					font-family: PingFang SC, PingFang SC;
					font-weight: 400;
					font-size: 24rpx;
					color: #333333;
					text-align: left;
					font-style: normal;
					text-transform: none;
				}

				.logTitle5 {
					width: auto;
					height: 34rpx;
					font-family: PingFang SC, PingFang SC;
					font-weight: 400;
					font-size: 24rpx;
					color: #999999;
					font-style: normal;
					text-transform: none;
				}
			}
		}
	}

	.contentView {
		width: 100%;
		height: auto;
		background-color: #fff;
		margin-top: 0;
		padding: 0 !important;
	}

	.text {
		color: #000;
		margin-right: 10rpx;
	}
</style>