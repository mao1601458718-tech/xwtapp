<template>
	<view class="pageDiv" scroll-y="true">

		<view class="systemDiv" v-for="(item,index) in deviceTypeList " :key="index" @click="clickItem(item)">
			<view class="systemTitle">
				{{item.deviceSysName}}
			</view>
			<view>
				<image class="collapse-image" v-if="selectIndex==item.id" src="/static/images/function/dui.png">
				</image>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		findParentDeviceSystemList
	} from '@/api/maintenance/maintenance.js'
	export default {
		data() {
			return {
				selectIndex: "",
				deviceTypeList: []
			}
		},
		onLoad(data) {
			this.getFindParentDeviceTypeList();
		},
		methods: {
			clickItem(item) {
				this.selectIndex = item.id

				uni.navigateBack({
					delta: 1,
					success: () => {
						// 通过事件总线传递数据
						uni.$emit('pageData', {
							deviceData: item
						});
					}
				});
			},
			getFindParentDeviceTypeList() {

				let data = {
					deviceSysIds: this.$store.state.user.checkProject.sysTypeIdList
				}

				findParentDeviceSystemList(data).then(res => {
					this.deviceTypeList = res.listObj;
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.pageDiv {
		width: 100%;
		height: 100vh;
		background-color: #fff;
		padding: 0 30rpx;
	}

	.systemDiv {
		min-height: 80rpx;
		height: auto;
		width: 100%;
		display: flex;
		padding: 15rpx 0;
		justify-content: space-between;
		align-items: center;
		border-bottom: 2rpx solid #E3E3E3;
	}

	.systemTitle {
		width: calc(100% - 50rpx);
		height: auto;
		word-wrap: break-word;
	}

	.collapse-image {
		width: 30rpx;
		height: 30rpx;
	}
</style>