<template>
	<view class="viewPage" :style="'padding: '+statusBarHeight+'rpx 0 0 0 ;'">
		<view class="customTopView">
			<view class="customTop" :style="'height:'+statusBarHeight+'rpx'">
				<view class="customBottom">
					<view class="customTop1" @click="goBack"> <u-icon class="uIcon" name="arrow-left" color="#000000"
							size="23"></u-icon>
					</view>
					<view class="customTop2">详情</view>
					<view class="customTop3" @click="submit()">保存</view>
				</view>
			</view>
		</view>
		<view class="topView"></view>
		<view class="titleView">
			<text>{{dataForm.checkName}}</text>
		</view>
		<view class="minTitleView">条文编号：{{dataForm.code}}</view>
		<view class="contentView" v-if="false">
			<view class="contentTabView">
				<view class="contentTab1">评定结果</view>
				<view class="contentTab2">B</view>
			</view>
			<view class="contentTabView">
				<view class="contentTab1">子项得分</view>
				<view class="contentTab2">B</view>
			</view>
			<view class="contentTabView">
				<view class="contentTab1">检查情况</view>
				<view class="contentTab2"><text>修改时间修改时间修改时间修改时间修改时间修改时间修改时间修改时间修改时间修改时间修改时间修改时间修改时间</text></view>
			</view>
			<view class="contentTabView">
				<view class="contentTab1">修改时间</view>
				<view class="contentTab2">B</view>
			</view>
			<view class="contentImgTitle">图片</view>
			<view class="contentImgView">
				<image class="ImgView" src="/static/images/profile.jpg"></image>
				<image class="ImgView" src="/static/images/profile.jpg"></image>
				<image class="ImgView" src="/static/images/profile.jpg"></image>
				<image class="ImgView" src="/static/images/profile.jpg"></image>
				<image class="ImgView" src="/static/images/profile.jpg"></image>
				<image class="ImgView" src="/static/images/profile.jpg"></image>
			</view>

		</view>
		<view class="contentView" v-if="true">
			<view class="contentInputView">
				<view class="contentTab1">评定结果</view>
				<view class="contentTab2">
					<u-radio-group v-model="dataForm.checkResult" placement="row" style="flex-wrap: wrap;"
						@change="groupChange(dataForm.checkResult,true)">
						<u-radio :customStyle="{marginRight: '100rpx',marginBottom:'20rpx'}" activeColor="#FA8161"
							label="A" :name="1">
						</u-radio>
						<u-radio :customStyle="{marginRight: '100rpx',marginBottom:'20rpx'}" activeColor="#FA8161"
							label="B" :name="2">
						</u-radio>
						<u-radio :customStyle="{marginRight: '100rpx',marginBottom:'20rpx'}" activeColor="#FA8161"
							label="C" :name="3">
						</u-radio>
						<u-radio :customStyle="{marginRight: '100rpx',marginBottom:'20rpx'}" activeColor="#FA8161"
							label="D" :name="4">
						</u-radio>
						<u-radio :customStyle="{marginRight: '100rpx'}" activeColor="#FA8161" label="无此项" :name="5">
						</u-radio>
					</u-radio-group>
				</view>
			</view>

			<view class="contentInputView">
				<view class="contentTab1">子项得分</view>
				<view class="contentTab3" :key="refreshScore">
					<view class="score" @click="atScore(100-index)" :class="(100-index)==dataForm.score?'atScore':''"
						v-for="(item,index) in 100"
						v-if="  (100-index)==maxScore || ((100-index)%5==0 && (100-index)>=minScore) && (100-index)<=maxScore"
						:key="">
						{{100-index}}
					</view>
				</view>
				<view class="contentTab4">
					<text>自定义分数：({{minScore}}-{{maxScore}})</text>
					<u-number-box :step="1" v-model="dataForm.score" :min="1" :max="100"
						@change="valChange"></u-number-box>
				</view>
			</view>
			<view class="contentInputView">
				<view class="contentTab1">情况描述</view>
				<u--textarea v-model="dataForm.inspection" border="false" placeholder="请描述情况" height="120rpx"
					:adjustPosition="false" :confirmType="null" :maxlength="-1"></u--textarea>
			</view>

			<img-view :imgListData="imgList" :imgSum="2" @uploadSucceed="uploadSucceed"
				@removeImg="removeImg"></img-view>
			<view class="contentInputView" :key="refresh">
				<view class="contentTab4">
					<text>问题列表</text>
					<view class="botton" @click="goProblem(null)">添加</view>
				</view>
				<view class="contentTab5" v-for="(item,index) in problemList" :key="index"
					@click="goProblem(item,index)">
					<text>{{item.problem}}</text>
					<view class="botton" @click.stop="removeImgProblem(index)">删除</view>
				</view>
			</view>

		</view>
		<view class="byLaws">
			<view class="byLawsTitle">检查细则</view>
			<view v-for="(item,index) in dataForm.checkSpecificationList" :key="index">
				{{item}}
			</view>
		</view>
	</view>
</template>

<script>
	import {
		findRiskProblemList,
		saveCheckRecord,
		saveRiskProblemList
	} from '@/api/safety/safety.js'

	import imgView from "@/pages/common/uploadImg.vue"
	export default {
		components: {
			imgView
		},
		data() {
			return {
				buttonLoading: false,
				statusBarHeight: this.$store.state.user.statusBarHeight,
				maxScore: 100,
				minScore: 1,
				dataForm: {},
				imgList: [],
				problemList: [],
				refresh: 0,
				refreshScore: 0,
				timer: null
			};
		},
		onLoad(data) {
			this.getFindCheckRecordList(JSON.parse(data.item));
			this.groupChange(this.dataForm.checkResult, false)
			if (this.dataForm.id) {
				this.getFindRiskProblemList(true);
			}
			// 监听事件
			uni.$on('pageData', (data) => {
				if (data.problemData) {
					if (data.itemIndex == 0 || data.itemIndex > 0) {
						// let index = this.problemList.findIndex(parameter => parameter.id === data.problemData.id);
						// if (index >= 0) {
						// 	this.problemList[index] = data.problemData;
						// } else {
						// 	this.problemList.push(data.problemData);
						// }
						this.problemList[data.itemIndex] = data.problemData;
					} else {
						this.problemList.push(data.problemData);
					}

				}
				this.refresh++;
			});
		},
		onUnload() {
			clearTimeout(this.timer)
			this.timer = null
			// 页面卸载时移除监听
			uni.$off('pageData');
		},
		methods: {
			goBack() {
				uni.navigateBack();
			},
			getFindCheckRecordList(item) {
				this.dataForm = item
				if (item.checkImgUrls && item.checkImgUrls != ";") {
					let imgs = item.checkImgUrls.split(";");
					imgs.forEach((item) => {
						this.imgList.push({
							src: item,
							text: "上传成功",
							uploading: 1
						});
					})
				}

			},
			groupChange(item, change) {
				if (item == 1) {
					this.minScore = 90;
					this.maxScore = 100;
					if (change) {
						this.dataForm.score = 100;
					}
				} else if (item == 2) {
					this.minScore = 60;
					this.maxScore = 89;
					if (change) {
						this.dataForm.score = 89;
					}
				} else if (item == 3) {
					this.minScore = 40;
					this.maxScore = 59;
					if (change) {
						this.dataForm.score = 59;
					}
				} else if (item == 4) {
					this.minScore = 1;
					this.maxScore = 39;
					if (change) {
						this.dataForm.score = 39;
					}
				} else {
					this.dataForm.score = "";
				}
			},
			valChange(item) {
				if (item.value >= 90) {
					this.dataForm.checkResult = 1
				} else if (item.value >= 60) {
					this.dataForm.checkResult = 2
				} else if (item.value >= 40) {
					this.dataForm.checkResult = 3
				} else if (item.value >= 1) {
					this.dataForm.checkResult = 4
				}

				this.groupChange(this.dataForm.checkResult, false);
			},

			getFindRiskProblemList(empty) {
				let data = {
					"checkProjectId": this.dataForm.checkProjectId,
					"projectId": this.dataForm.projectId,
					"orderCols": ["createTime"],
					"orderDesc": true,
					"checkRecordId": this.dataForm.id,
					"deviceCheckItemId": this.dataForm.deviceCheckItemId,
				}
				this.problemList = [];
				findRiskProblemList(data).then(res => {
					if (res.listObj) {
						this.problemList.push(...res.listObj);
					}
				})

			},
			submit() {
				if (!this.dataForm.checkResult) {
					uni.$u.toast('评定结果不能为空')
					return;
				}
				let data = {
					"projectId": this.$store.state.user.projectId,
					"checkProjectId": this.$store.state.user.checkProject.id,
					"deviceSysId": this.dataForm.deviceSysId,
					"deviceTypeId": this.dataForm.deviceTypeId,
					"deviceCheckItemId": this.dataForm.deviceCheckItemId,
					"checkResult": this.dataForm.checkResult,
					"score": this.dataForm.score,
					"inspection": this.dataForm.inspection,
					"checkImgUrls": this.dataForm.checkImgUrls,
					"deviceSysIds": this.$store.state.user.checkProject.sysTypeIdList,
					"buildingType": 4,
					"id": this.dataForm.id,
				}
				saveCheckRecord(data).then(res => {
					if (res.obj.id) {
						this.dataForm.id = res.obj.id;
						this.postRiskProblemList();
					} else {
						uni.$u.toast('保存失败')
					}

				})
			},
			removeImg(data) {

				if (data.length == 0) {
					this.dataForm.checkImgUrls = "";
				} else {
					let list = [];
					data.forEach((item) => {
						if (item.src) {
							list.push(item.src);
						}
					})
					this.dataForm.checkImgUrls = list.join(';');
				}
			},
			uploadSucceed(data) {
				if (data.length == 0) {
					this.dataForm.checkImgUrls = "";
				} else {
					let list = [];
					data.forEach((item) => {
						if (item.src) {
							list.push(item.src);
						}
					})
					this.dataForm.checkImgUrls = list.join(';');
				}
			},
			atScore(score) {

				this.valChange({
					value: score
				})
				this.dataForm.score = score
				this.refreshScore++;
			},
			goProblem(item, index) {
				this.$tab.navigateTo(
					`/pages/safety/check/problemPage?index=${index}&item=${ JSON.stringify(item)}&info=${JSON.stringify(this.dataForm)}`
				)
			},
			removeImgProblem(index) {
				this.problemList.splice(index, 1);
			},
			postRiskProblemList() {
				let data = {
					"projectId": this.$store.state.user.projectId,
					"checkProjectId": this.$store.state.user.checkProject.id,
					"checkRecordId": this.dataForm.id,
					"deviceSysId": this.dataForm.deviceSysId,
					"deviceCheckItemId": this.dataForm.deviceCheckItemId,
					"safetyType": this.dataForm.deviceType,
					"deviceSysName": this.dataForm.checkName,
					"deviceSysIds": this.$store.state.user.checkProject.sysTypeIdList,
					"buildingType": 4,
					"list": [...this.problemList]
				}
				if (this.buttonLoading) {
					uni.$u.toast('请勿重复提交')
					return;
				}
				this.buttonLoading = true;
				saveRiskProblemList(data).then(res => {
					if (res.status == 200) {
						uni.$u.toast('保存成功')
						this.timer = setTimeout(() => {
							this.goBack();
						}, 700);
					} else {
						uni.$u.toast('保存失败')
					}

				}).finally(() => {
					// 统一关闭loading
					this.buttonLoading = false;
				});
			}

		}
	}
</script>

<style lang="scss" scoped>
	.viewPage {
		min-height: 100vh;
		width: 100%;
		height: auto;
		background-color: #fff;
	}

	.customTop3 {
		font-family: PingFang SC, PingFang SC;
		font-weight: 400;
		font-size: 28rpx;
		color: #FA8161;
		text-align: right;
		font-style: normal;
		text-transform: none;
	}

	.topView {
		width: 100%;
		height: 20rpx;
		background-color: #F7F7F7;
	}

	.titleView {
		width: 100%;
		display: flex;
		justify-content: center;
		text-align: center;
		padding: 0 30rpx;
		height: auto;
		font-size: 30rpx;
		font-weight: 600;
		margin-top: 30rpx;
	}

	.minTitleView {
		width: 100%;
		font-family: PingFang SC, PingFang SC;
		font-weight: 400;
		font-size: 20rpx;
		color: #999999;
		text-align: center;
		font-style: normal;
		text-transform: none;
		margin-top: 15rpx;
	}

	.contentView {
		width: 100%;
		height: auto;
		padding: 0 30rpx;

		.contentTabView {
			width: 100%;
			min-height: 60rpx;
			height: auto;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid #F5F5F5;

			.contentTab1 {
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 28rpx;
				color: #999999;
				text-align: left;
				font-style: normal;
				text-transform: none;
				width: 120rpx;
			}

			.contentTab2 {
				display: flex;
				justify-content: right;
				height: auto;
				width: calc(100% - 150rpx);
			}
		}

		.contentInputView {
			height: auto;
			border-bottom: 2px solid #F5F5F5;

			.contentTab1 {
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 28rpx;
				text-align: left;
				font-style: normal;
				text-transform: none;
				width: 120rpx;
				padding: 20rpx 0;
			}

			.contentTab2 {

				padding: 30rpx 20rpx;
				width: 100%;
			}

			.contentTab3 {
				display: flex;
				flex-wrap: wrap;
				margin-bottom: 15rpx;

				.score {
					width: 100rpx;
					height: 60rpx;
					border: 1px solid #cecece;
					margin-right: 15rpx;
					margin-bottom: 15rpx;
					text-align: center;
					line-height: 60rpx;
					border-radius: 12rpx;
				}

				.atScore {
					background: #FA8161;
					color: #fff;
					border: 1px solid #FA8161;
				}
			}

			.contentTab4 {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 20rpx 0;

				.botton {
					width: 100rpx;
					height: 50rpx;
					text-align: center;
					line-height: 50rpx;
					background: #00aaff;
					color: #fff;
					font-size: 26rpx;
					border-radius: 8rpx;
				}
			}


			.contentTab5 {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 20rpx 0;
				color: #8d8d8d;

				.botton {
					width: 100rpx;
					height: 50rpx;
					text-align: center;
					line-height: 50rpx;
					// background: #FA8161;
					color: #FA8161;
					font-size: 26rpx;
					border-radius: 8rpx;
				}
			}
		}
	}

	.contentImgTitle {
		height: 78rpx;
		line-height: 78rpx;
		font-family: PingFang SC, PingFang SC;
		font-weight: 400;
		font-size: 28rpx;
		color: #181818;
		text-align: left;
		font-style: normal;
		text-transform: none;
	}

	.contentImgView {
		display: flex;
		flex-wrap: wrap;

		.ImgView {
			width: 160rpx;
			height: 160rpx;
			background: #F7F7F7;
			border-radius: 12rpx 12rpx 12rpx 12rpx;
			margin-right: 15rpx;
			margin-bottom: 15rpx;
		}
	}

	.byLaws {
		margin-top: 30rpx;
		font-family: PingFang SC, PingFang SC;
		font-weight: 400;
		font-size: 24rpx;
		color: #999999;
		text-align: left;
		font-style: normal;
		text-transform: none;
		padding: 0 30rpx 100rpx 30rpx;

		.byLawsTitle {
			margin-bottom: 20rpx;
		}
	}

	.imgViewTitle {
		width: 100%;
		height: auto;
		font-family: PingFang SC, PingFang SC;
		font-weight: 400;
		font-size: 28rpx;
		color: #181818;
		text-align: left;
		font-style: normal;
		text-transform: none;
		padding: 15rpx 0;
	}

	.imgListView {
		display: flex;
		justify-content: left;
		padding: 0 0 20rpx 0;
		border-bottom: 1px solid #cecece;

		.imgView {
			width: 160rpx;
			height: 160rpx;
			border-radius: 12rpx 12rpx 12rpx 12rpx;
			border: 2rpx solid #E3E3E3;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-right: 20rpx;

			.iconView {

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
					margin-top: 10rpx;
				}
			}
		}

		.imageTab {
			position: relative;

			.image {
				width: 160rpx;
				height: 160rpx;
				background-size: 100%;
				margin-right: 20rpx;
				border-radius: 12rpx;
			}

			.imgClose {
				position: absolute;
				top: 5rpx;
				right: 25rpx;
			}
		}


	}
</style>