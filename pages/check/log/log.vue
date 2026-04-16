<template>
	<view class="paveView">
		<view class="topView"></view>
		<scroll-view scroll-y class="liListView" @scrolltolower="onreachBottom" :refresher-threshold="105"
			:refresher-enabled="true" :refresher-triggered="refreshObj.refresherTriggered"
			@refresherrefresh="refresherrefresh" @refresherrestore="refresherrestore" @refresherabort="refresherabort">
			<view class="litView" v-for="(item,index) in logList" :key="index">
				<view class="liTitle">
					<view class="liTitle1">【签到日志】</view>
					<view class="liTitle2">{{item.createTimeDesc}}</view>
				</view>
				<view class="liText">{{item.location}}</view>
			</view>
			<view class="uLoadmore">
				<u-loadmore :status="refreshObj.sType" bg-color="#fff" icon-type="flower" />
			</view>
		</scroll-view>

	</view>
</template>

<script>
	import {
		findSignLogByProjectId
	} from '@/api/project/project.js'

	export default {
		data() {
			return {
				logList: [],
				refreshObj: {
					refresherTriggered: false,
					_refresherTriggered: false,
					sType: 'nomore',
					iconType: 'flower',
					status: true,
				},
				dataForm: {
					"projectId": this.$store.state.user.projectId,
					"checkProjectId": this.$store.state.user.checkProject.id,
					"pageIndex": 1,
					"pageSize": 15
				}
			};
		},
		onLoad() {
			this.getFindSignLogByProjectId(true);
		},
		methods: {
			onreachBottom(e) {
				if (this.refreshObj.status) {
					this.refreshObj.sType = 'loading';
					this.refreshObj.status = false;
					this.getFindPlanManagementList(false);
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
				this.getFindSignLogByProjectId(true);
			},
			getFindSignLogByProjectId(empty) {
				if (empty) {
					this.refreshObj.sType = 'nomore';
					this.dataForm.pageIndex = 1;
					this.logList = [];
				}
				findSignLogByProjectId(this.dataForm).then(res => {
					this.logList.push(...res.object.signLogList);
					if (this.logList.length < res.object.totalCount) {
						this.refreshObj.status = true;
						this.dataForm.pageIndex++;
						this.refreshObj.sType = 'loadmore';
					} else {
						this.refreshObj.status = false;
						this.refreshObj.sType = 'nomore';
					}
					this.refreshObj.refresherTriggered = false; //触发onRestore，并关闭刷新图标
					this.refreshObj._refresherTriggered = false;
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.paveView {
		width: 100%;
		min-height: 100vh;
		height: auto;
		background-color: #fff;

		.topView {
			width: 100%;
			height: 20rpx;
			background-color: #F7F7F7;
		}

		.liListView {
			padding: 0 30rpx;
			height: calc(100vh - 20rpx);

			.litView {
				height: auto;
				width: 100%;
				border-bottom: 1rpx solid #eee;
				padding: 15rpx 0;

				.liTitle {
					width: 100%;
					height: auto;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.liTitle1 {
						color: #549EFF;
					}

					.liTitle2 {
						font-family: PingFang SC, PingFang SC;
						font-weight: 400;
						font-size: 24rpx;
						color: #999999;
						text-align: right;
						font-style: normal;
						text-transform: none;
					}
				}

				.liText {
					margin-top: 20rpx;
					padding: 0 20rpx;
					color: #767676;
				}

			}
		}
	}
</style>