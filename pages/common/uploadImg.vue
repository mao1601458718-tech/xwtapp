<template>
	<view class="contentView">
		<view class="imgViewTitle">上传图片</view>
		<view class="imgListView" :key="imgKey">
			<view class="imgView" @click="getImg()" v-if="imgListData.length<imgSum">
				<view class="iconView">
					<view class="imgIcon"><u-icon name="plus" color="#999999" size="25"></u-icon></view>
					<view class="iconView1">添加照片</view>
				</view>
			</view>
			<view class="imageTab" v-for="(item,index) in imgListData" :key="index">
				<view class="image" v-if="item.uploading!=1">{{item.text}}</view>
				<image class="image" v-if="item.uploading==1" :src="item.src" @click="showImg(index)"></image>
				<view class="imgClose" v-if="item.uploading!=2"><u-icon name="close" color="#999999" size="20"
						@click="removeImg(index)"></u-icon></view>
			</view>
		</view>
		<canvas canvas-id="watermarkCanvas0" style="visibility:hidden;position:absolute;z-index:-111;"
			:style="{'width':canvasWidth+'px','height':canvasHeight+'px'}">
		</canvas>
		<canvas canvas-id="watermarkCanvas1" style="visibility:hidden;position:absolute;z-index:-111;"
			:style="{'width':canvasWidth+'px','height':canvasHeight+'px'}">
		</canvas>
	</view>
</template>

<script>
	import {
		uploadFileBase64,
		uploadFile
	} from '@/api/uploadFile'
	export default {
		props: {
			imgListData: {
				type: Array,
				default () {
					return []
				}
			},
			imgSum: {
				type: Number,
				default () {
					return 2
				}
			},

		},
		data() {
			return {
				imgKey: 0,
				canvasWidth: '',
				canvasHeight: '',
			}
		},
		methods: {
			showImg(index) {
				// 预览图片
				let imgList = [];
				this.imgListData.forEach((item) => {
					imgList.push(item.src)
				})
				uni.previewImage({
					urls: imgList,
					current: index,
					// longPressActions: {
					// 	itemList: ['发送给朋友', '保存图片', '收藏'],
					// 	success: function(data) {
					// 		console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
					// 	},
					// 	fail: function(err) {
					// 		console.log(err.errMsg);
					// 	}
					// }
				});
			},
			getImg() {
				uni.chooseImage({
					count: this.imgSum - this.imgListData.length, //默认9
					sizeType: ['compressed '], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['camera', 'album'], //从相册选择
					success: async (res) => {
						let formData = {
							packageName: "MaintenanceCheckRecord"
						}
						// 创建一个 Promise 数组来跟踪所有上传操作
						const uploadPromises = res.tempFilePaths.map(async (item, i) => {

							this.imgListData.push({
								uploading: 2,
								src: "",
								text: "上传中..."
							})

							const index = this.imgListData.length - 1;
							try {
								const src = await uploadFile(item, formData,
									'maintenance');
								if (src && src !== "undefined") {
									this.imgListData[index].uploading = 1;
									this.imgListData[index].src = src;
									this.imgListData[index].text = "上传成功";
								} else {
									this.imgListData[index].uploading = 0;
									this.imgListData[index].text = "上传失败";
								}
							} catch (err) {
								console.error('上传失败:', err);
								this.imgListData[index].uploading = 0;
								this.imgListData[index].text = "上传失败";
							}
							this.imgKey++;
						});



						// 
						// 	this.imgKey++;
						// 	// 将每个上传操作包装成 Promise 并添加到数组中
						// 	console.log(index)
						// 	const uploadPromise = uploadFile(item, formData, 'maintenance').then(
						// 		src => {
						// 			if (src) {
						// 				this.imgListData[index].uploading = 1;
						// 				this.imgListData[index].src = src;
						// 				this.imgListData[index].text = "上传成功";
						// 			} else if (!src || src == "undefined") {
						// 				this.imgListData[index].uploading = 0;
						// 				this.imgListData[index].text = "上传失败";
						// 			}
						// 			this.imgKey++;
						// 		}).catch(err => {
						// 		this.imgListData[index].uploading = 0;
						// 		this.imgListData[index].text = "上传失败";
						// 		this.imgKey++;
						// 	});
						// 	uploadPromises.push(uploadPromise);
						// });

						// 等待所有上传完成后再触发事件
						await Promise.all(uploadPromises);
						this.$emit('uploadSucceed', this.imgListData);

					}
				});
			},
			getImgBak() {
				uni.chooseImage({
					count: this.imgSum - this.imgListData.length, //默认9
					sizeType: ['compressed '], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['camera', 'album'], //从相册选择
					success: async (res) => {
						let formData = {
							packageName: "MaintenanceCheckRecord"
						}
						// 创建一个 Promise 数组来跟踪所有上传操作
						const uploadPromises = [];

						this.imgListData.push({
							uploading: 2,
							src: "",
							text: "上传中..."
						})
						let imgIndex = 0;

						for (const item of res.tempFilePaths) {

							let type = '',
								url = "";
							// #ifdef H5
							type = 'h5';
							// #endif
							if (type == 'h5') {
								url = await this.addH5WatermarkToImage(item);

							} else {
								let imgUrl = plus.io.convertLocalFileSystemURL(item);
								url = await this.addWatermarkToImage(imgUrl, imgIndex);
								imgIndex++;

							}

							const index = this.imgListData.length - 1;
							this.imgKey++;
							// 将每个上传操作包装成 Promise 并添加到数组中
							const uploadPromise = "";

							// #ifdef H5
							let fileData = {
								packageName: "MaintenanceCheckRecord",
								file: url || item
							}
							uploadPromise = uploadFileBase64(fileData, 'maintenance').then(
								src => {
									if (src) {
										this.imgListData[index].uploading = 1;
										this.imgListData[index].src = src.object;
										this.imgListData[index].text = "上传成功";
									} else if (!src || src == "undefined") {
										this.imgListData[index].uploading = 0;
										this.imgListData[index].text = "上传失败";
									}
									this.imgKey++;
								});
							// #endif

							uploadPromise = uploadFile(url, formData, 'maintenance').then(
								src => {
									if (src) {
										this.imgListData[index].uploading = 1;
										this.imgListData[index].src = src;
										this.imgListData[index].text = "上传成功";
									} else if (!src || src == "undefined") {
										this.imgListData[index].uploading = 0;
										this.imgListData[index].text = "上传失败";
									}
									this.imgKey++;
								});


							uploadPromises.push(uploadPromise);
						};

						// 等待所有上传完成后再触发事件
						await Promise.all(uploadPromises);
						this.$emit('uploadSucceed', this.imgListData);

					}
				});
			},
			async addWatermarkToImage(tempFilePath, imgIndex) {
				console.log(imgIndex)
				return new Promise(resolve => {
					uni.getImageInfo({
						src: tempFilePath,
						success: (imageInfo) => {
							if (!imageInfo || !imageInfo.width || !imageInfo.height) {
								resolve('');
								return;
							}

							const canvasId = 'watermarkCanvas' +
								imgIndex; // 假设页面中已经有了这个canvas
							const ctx = uni.createCanvasContext(canvasId, this);
							this.canvasHeight = imageInfo.height;
							this.canvasWidth = imageInfo.width;

							plus.io.resolveLocalFileSystemURL(tempFilePath, entry => {
								entry.file(file => {
									const reader = new plus.io
										.FileReader();
									reader.onload = (e) => {
										const base64Data = e.target
											.result;
										// 绘制原图
										ctx.drawImage(base64Data,
											0, 0,
											imageInfo.width,
											imageInfo
											.height -
											40);

										// ✅ 5. 添加水印（文字/颜色/位置）
										// 设置背景矩形样式
										ctx.fillStyle =
											'rgba(0, 0, 0, 1)'; // 黑色不透明
										// 绘制覆盖图片底部40像素高的矩形
										ctx.fillRect(0, imageInfo
											.height,
											imageInfo.width,
											40
										); // 起点x, 起点y, 宽度, 高度

										// 设置文字样式
										ctx.font =
											'10px Arial'; // 可能需要调整字体大小以适应40rpx的高度和两行文本
										ctx.fillStyle =
											'yellow'; // 文字颜色为黄色

										// 准备要显示的文字
										const textLines = [
											this
											.getFormattedDateTime(),
											this.$store.state
											.user
											.projectName
										];

										// 计算每行文本的起始y坐标，确保两行文本都在矩形内居中显示
										const lineHeight =
											20; // 根据字体大小调整
										const startY = (imageInfo
											.height + ((
												40 -
												textLines
												.length *
												lineHeight
											) / 2));

										textLines.forEach((line,
											index) => {
											// 计算文本宽度来居中显示
											const
												textWidth =
												ctx
												.measureText(
													line)
												.width;
											const startX =
												(imageInfo
													.width -
													textWidth
												) / 2;

											// 确认 startY 计算是否正确
											console.log(
												'Start Y:',
												startX,
												startY +
												index *
												lineHeight +
												imageInfo
												.height
											);

											// 在指定位置绘制每一行文本
											ctx.fillText(
												line,
												15, (
													imageInfo
													.height -
													10
												) -
												(15 *
													index
												));
										});
										ctx.draw(false,
											() => { // false 表示异步绘制
												uni.canvasToTempFilePath({
													canvasId: canvasId,
													success: (
														result
													) => {
														resolve
															(result
																.tempFilePath
															);
													},
													fail: () =>
														resolve(
															''
														)
												});
											});
									};
									reader.readAsDataURL(file);
								});
							}, () => {
								resolve('');
							});
						},
						fail: () => resolve('') // 获取图片失败也返回空
					});
				});
			},
			async addH5WatermarkToImage(tempFilePath) {
				return new Promise(resolve => {
					const imageInfo = new Image()
					imageInfo.src = tempFilePath
					imageInfo.crossOrigin = 'anonymous'
					imageInfo.onload = () => {
						// ✅ 2. 创建原生 canvas（H5/App/鸿蒙都支持）
						const canvas = document.createElement('canvas');

						const ctx = canvas.getContext('2d');

						// ✅ 3. **关键：必须在 drawImage 前设置 canvas 尺寸**
						canvas.width = imageInfo.width;
						canvas.height = imageInfo.height;

						// ✅ 4. 画原图
						ctx.drawImage(imageInfo, 0, 0, imageInfo.width, imageInfo.height -
							40);

						// ✅ 5. 添加水印（文字/颜色/位置）
						// 设置背景矩形样式
						ctx.fillStyle = 'rgba(0, 0, 0, 1)'; // 黑色不透明
						// 绘制覆盖图片底部40像素高的矩形
						ctx.fillRect(0, imageInfo.height, imageInfo.width,
							40); // 起点x, 起点y, 宽度, 高度

						// 设置文字样式
						ctx.font = '10px Arial'; // 可能需要调整字体大小以适应40rpx的高度和两行文本
						ctx.fillStyle = 'yellow'; // 文字颜色为黄色

						// 准备要显示的文字
						const textLines = [
							this.getFormattedDateTime(),
							this.$store.state.user.projectName
						];

						// 计算每行文本的起始y坐标，确保两行文本都在矩形内居中显示
						const lineHeight = 20; // 根据字体大小调整
						const startY = (imageInfo.height + ((40 - textLines.length *
							lineHeight) / 2));

						textLines.forEach((line, index) => {
							// 计算文本宽度来居中显示
							const textWidth = ctx.measureText(line).width;
							const startX = (imageInfo.width - textWidth) / 2;

							// 确认 startY 计算是否正确
							console.log('Start Y:', startX, startY + index *
								lineHeight + imageInfo
								.height);

							// 在指定位置绘制每一行文本
							ctx.fillText(line, 15, (imageInfo.height - 10) - (15 *
								index));
						});
						try {
							// ✅ H5 直接用 toDataURL 生成 base64
							const dataUrl = canvas.toDataURL('image/jpeg',
								0.9); // 可选 quality
							resolve(dataUrl); // 返回 base64 字符串
						} catch (e) {
							console.error('Canvas toDataURL failed:', e);
							resolve('失败'); // 失败返回空
						}
					}
				});
			},
			getFormattedDateTime() {
				const now = new Date();

				// 获取各个部分
				const year = now.getFullYear();
				const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
				const day = String(now.getDate()).padStart(2, '0');
				const hours = String(now.getHours()).padStart(2, '0');
				const minutes = String(now.getMinutes()).padStart(2, '0');
				const seconds = String(now.getSeconds()).padStart(2, '0');

				// 组合成你想要的格式，例如：2025-12-25 14:57:30
				return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
			},
			removeImg(index) {
				this.imgListData.splice(index, 1);
				this.$emit('removeImg', this.imgListData)
			}
		}
	}
</script>

<style scoped lang="scss">
	.contentView {
		width: 100%;
		height: auto;
		background-color: #fff;
		margin-top: 20rpx;
		padding: 0 30rpx;

		.imgViewTitle {
			width: 100%;
			height: 84rpx;
			font-family: PingFang SC, PingFang SC;
			font-weight: 400;
			font-size: 28rpx;
			color: #181818;
			text-align: left;
			font-style: normal;
			text-transform: none;
			line-height: 84rpx;
		}

		.imgListView {
			display: flex;
			justify-content: left;
			padding: 0 0 20rpx 0;

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

	}
</style>