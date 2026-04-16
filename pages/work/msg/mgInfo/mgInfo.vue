<template>
	<view class="pageView">
		<view class="msgTitle">
			{{msg.noticeTitle}}
		</view>

		<view class="msgTop1">
			<view>{{msg.noticeAttribute==1?"系统通知":"通知信息"}}</view>
			<view>|</view>
			<view>{{msg.addTime}}</view>
		</view>

		<view class="uParse">
			<u-parse :content="msg.noticeContent"></u-parse>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				msg: {}
			}
		},
		onLoad(data) {
			this.msg = JSON.parse(data.item);
		},
		methods: {

		}
	}
</script>

<style scoped lang="scss">
	.pageView {
		height: auto;
		width: 100%;
		min-height: 100vh;
		background-color: #fff;
		padding: 40rpx 0 0 0;
	}

	.msgTitle {
		width: 100%;
		height: auto;
		text-align: center;
		font-size: 30rpx;
		font-weight: 700;
	}

	.msgTop1 {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 80rpx;
		font-size: 26rpx;
		color: #a2a2a2;
	}

	.uParse {
		height: auto;
		width: 100%;
		padding: 0 30rpx;
	}
</style>