<template>
	<scroll-view scroll-y refresher-background="#f1f1f1" class="scrollView" @scrolltolower="onreachBottom"
		:refresher-threshold="105" :refresher-enabled="true" :refresher-triggered="refreshObj.refresherTriggered"
		@refresherrefresh="refresherrefresh" @refresherrestore="refresherrestore" @refresherabort="refresherabort">
		<view class="msgView" v-for="(item,index) in msgList" :key="index" @click="msgInfo(item)">
			<view class="msgIcon">
				<image class="msgImg" src="/static/images/msg/msg3.png" v-if="item.noticeAttribute==2"></image>
				<image class="msgImg" src="/static/images/msg/msg4.png" v-else></image>
			</view>
			<view class="msgTitleView">
				<view class="msgTitle">{{item.noticeTitle}}</view>
				<view class="msgText u-line-1">{{item.noticeContent}}</view>
			</view>
			<view class="msgTimeView">
				<view class="msgTime">{{showDate(item.addTime)}}</view>
			</view>
		</view>
		<view class="uLoadmore">
			<u-loadmore :status="refreshObj.sType" bg-color="#f1f1f1" icon-type="flower" />
		</view>
	</scroll-view>
</template>

<script>
	import {
		noticePage
	} from '@/api/project/project.js'
	export default {
		props: {
			noticeAttribute: {
				type: Number,
				default () {
					return
				}
			},

		},
		data() {
			return {
				swiperCurrent: 0,
				searchValue: "",
				refreshObj: {
					refresherTriggered: false,
					_refresherTriggered: false,
					sType: 'nomore',
					iconType: 'flower',
					status: true,
				},
				dataForm: {
					"projectId": "",
					"pageSize": 15,
					"pageIndex": 1,
					"userId": "",
					"noticeAttribute": "",
					"frameOpen": "",
					"noticeTitle": ""
				},
				msgList: []
			}
		},
		methods: {
			msgInfo(item) {
				this.$tab.navigateTo("/pages/work/msg/mgInfo/mgInfo?item=" + JSON.stringify(item))
			},
			showDate(time) {
				const now = new Date();
				const date = new Date(time);

				if (date.toDateString() === now.toDateString()) {
					// 今天的日期，返回时间 HH:mm
					return this.formatTime(date);
				} else if (date.toDateString() === new Date(now.getTime() - 86400000).toDateString()) {
					// 昨天的日期，返回 "昨日 HH:mm"
					return "昨日 " + this.formatTime(date);
				} else if (date.getFullYear() === now.getFullYear()) {
					// 今年的日期，返回 MM-dd HH:mm
					return this.formatDateOnly(date);
				} else {
					// 去年及以前的日期，返回 yyyy-MM-dd HH:mm
					return this.formatFullDate(date);
				}

			},
			formatTime(date) {
				return date.toLocaleTimeString([], {
					hour: '2-digit',
					minute: '2-digit'
				});
			},
			formatDateOnly(date) {
				return date.toLocaleDateString([], {
					month: '2-digit',
					day: '2-digit'
				});
			},
			formatFullDate(date) {
				return date.toISOString().slice(0, 10);
			},
			onreachBottom(e) {
				if (this.refreshObj.status) {
					this.refreshObj.sType = 'loading';
					this.refreshObj.status = false;
					this.getFindFaultRepairRecordList(false);
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

				this.getNoticePage(true);
			},
			goPage(item) {
				this.$tab.navigateTo("/pages/management/planFault/faultInfo?item=" + JSON.stringify(item))
			},
			getMsg(frameOpen) {
				this.dataForm.frameOpen = frameOpen;
				this.getNoticePage(true);
			},
			getNoticePage(empty) {
				this.dataForm.userId = this.$store.state.user.id;
				this.dataForm.projectId = this.$store.state.user.projectId;
				this.dataForm.noticeAttribute = this.noticeAttribute;
				if (empty) {
					this.refreshObj.sType = 'nomore';
					this.dataForm.pageIndex = 1;
					this.msgList = [];
				}
				noticePage(this.dataForm).then(res => {
					if (res.object && res.object.list) {
						this.msgList.push(...res.object.list);
						if (this.msgList.length < res.object.totalCount) {
							this.refreshObj.status = true;
							this.dataForm.pageIndex++;
							this.refreshObj.sType = 'loadmore';
						} else {
							this.refreshObj.status = false;
							this.refreshObj.sType = 'nomore';
						}
					}
					this.refreshObj.refresherTriggered = false; //触发onRestore，并关闭刷新图标
					this.refreshObj._refresherTriggered = false;
				})

			}

		}
	}
</script>
<style scoped lang="scss">
	.scrollView {
		width: 100%;
		height: 100%;

		.msgView {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin: 40rpx 0;

			.msgIcon {
				width: 88rpx;
				height: 88rpx;
				background: #F7F7F7;
				border-radius: 52rpx 52rpx 52rpx 52rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				.msgImg {
					width: 52rpx;
					height: 52rpx;
				}
			}

			.msgTitleView {
				width: calc(100% - 240rpx);
				height: 88rpx;

				.msgTitle {
					width: 100%;
					height: 44rpx;
					font-family: PingFang SC, PingFang SC;
					font-weight: 600;
					font-size: 32rpx;
					color: #1B1B1B;
					text-align: left;
					font-style: normal;
					text-transform: none;
				}

				.msgText {
					width: 100%;
					height: 44rpx;
					font-family: PingFang SC, PingFang SC;
					font-weight: 400;
					font-size: 24rpx;
					line-height: 44rpx;
					color: #808080;
					text-align: left;
					font-style: normal;
					text-transform: none;
				}
			}

			.msgTimeView {
				width: 112rpx;
				height: 28rpx;
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 20rpx;
				color: #808080;
				text-align: right;
				font-style: normal;
				text-transform: none;
			}
		}

		.scrollBottom {
			height: 100rpx;
			width: 100%;
		}
	}
</style>