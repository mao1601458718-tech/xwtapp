<template>
	<view class="page">
		<view class="searchView">
			<u--input class="uInput" borde="none" shape="circle" clearable placeholder="请输入项目名称"
				v-model="dataForm.userName" @change="clickSearchValue"></u--input>
		</view>

		<scroll-view scroll-y refresher-background="#f1f1f1" class="scrollView" @scrolltolower="onreachBottom"
			:refresher-threshold="105" :refresher-enabled="true" :refresher-triggered="refreshObj.refresherTriggered"
			@refresherrefresh="refresherrefresh" @refresherrestore="refresherrestore" @refresherabort="refresherabort">
			<view style="height: 80rpx;"></view>
			<view class="faultView" v-for="(item,index) in userLis" :key="index" @click="suspend(item)">
				<view class="contentTitle">
					<view class="contentTitle1">{{item.userName}}-{{item.roleName}}</view>
					<view class="contentTitle2 statusType2">
						{{item.phone}}
					</view>
				</view>
			</view>
			<view class="uLoadmore">
				<u-loadmore :status="refreshObj.sType" bg-color="#fff" icon-type="flower" />
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		findOrgUserList
	} from '@/api/maintenance/maintenance.js'
	import {
		updateFaultRepairRecord
	} from '@/api/maintenance/findFault.js'
	export default {
		data() {
			return {
				timer: null,
				buttonLoading: false,
				userLis: [],
				refreshObj: {
					refresherTriggered: false,
					_refresherTriggered: false,
					sType: 'nomore',
					iconType: 'flower',
					status: true,
				},
				dataForm: {
					"projectId": "",
					"checkProjectId": "",
					"pageIndex": 1,
					"pageSize": 30,
					userName: ""
				},
				faultForm: ""
			}
		},
		onUnload() {
			clearTimeout(this.timer)
			this.timer = null

		},
		onLoad(data) {
			this.faultForm = JSON.parse(data.item)
			this.dataForm.checkProjectId = this.$store.state.user.checkProject.id;
			this.dataForm.projectId = this.$store.state.user.projectId;
			this.getFindOrgUserList(true);

		},
		methods: {
			clickSearchValue(value) {
				this.getFindOrgUserList(true);
			},
			onreachBottom(e) {
				if (this.refreshObj.status) {
					this.refreshObj.sType = 'loading';
					this.refreshObj.status = false;
					this.getFindOrgUserList(false);
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
				this.dataForm.userName = "";
				this.getFindOrgUserList(true);
			},
			getFindOrgUserList(empty) {
				if (empty) {
					this.refreshObj.sType = 'nomore';
					this.dataForm.pageIndex = 1;
					this.userLis = [];
				}
				findOrgUserList(this.dataForm).then(res => {
					if (res.listObj) {
						this.userLis.push(...res.listObj);
						if (this.userLis.length < res.totalCount) {
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

			},
			suspend(item) {
				if (!this.faultForm.id) {
					uni.$u.toast('故障工单不明,请返回重试')
					return;
				}
				uni.showModal({
					title: '提示',
					content: '是否转派给' + item.userName,
					success: (res) => {
						if (res.confirm) {
							let data = {
								"id": this.faultForm.id,
								"repairUserId": item.id
							}
							if (this.buttonLoading) {
								uni.$u.toast('请勿重复提交')
								return;
							}
							this.buttonLoading = true;
							updateFaultRepairRecord(data).then(res => {
								uni.$u.toast('转派成功')
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
		}
	}
</script>

<style scoped lang="scss">
	.page {
		width: 100%;
		height: 100vh;
		background-color: #fff;

		.searchView {
			position: fixed;
			top: 0;
			height: 80rpx;
			width: 100%;
			background-color: #F7F7F7;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 0 30rpx;
			z-index: 9;
		}

		.scrollView {
			height: 100%;
			width: 100%;
			padding: 0 30rpx;

			.contentTitle {
				width: 100%;
				height: auto;
				padding: 30rpx 15rpx;
				display: flex;
				justify-content: space-between;
				border-bottom: 1rpx solid #eee;

				.contentTitle1 {
					font-size: 26rpx;
				}

				.contentTitle2 {
					font-size: 24rpx;
					color: #a6a6a6;
				}
			}
		}
	}
</style>