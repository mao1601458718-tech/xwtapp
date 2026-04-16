<script>
	import config from './config'
	import {
		getToken
	} from '@/utils/auth'

	export default {
		onLaunch: function() {
			this.initApp()

			uni.getSystemInfo({
				success: (res) => {
					let windowHeight = res.windowHeight * 2;
					let height = (res.statusBarHeight * 2) + 92;
					this.$store.dispatch('SetStatusBarHeight', height).then(res => {})
					this.$store.dispatch('SetWindowHeight', windowHeight).then(res => {})
				}
			});
		},
		methods: {
			// 初始化应用
			initApp() {
				// 初始化应用配置
				this.initConfig()
				// 检查用户登录状态
				//#ifdef H5
				//#endif
			},
			initConfig() {
				this.globalData.config = config
			},

		}
	}
</script>

<style lang="scss">
	@import "@/node_modules/uview-ui/index.scss";
	@import '@/static/scss/index.scss'
</style>