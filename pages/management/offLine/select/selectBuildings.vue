<template>
	<view class="pageDiv" scroll-y="true">
		<view :key="uCollapse">
			<u-collapse v-if="buildingDataList.length>0" :value="rightPopupIndex" class="uCollapse" accordion>
				<u-collapse-item :title="item.buildingName" :name="item.id" v-for="(item,index) in buildingDataList">
					<view class="viewDiv">
						<view class="viewTabs" :class="atFloor==itemFloor.id?'atViewDiv':''"
							@click="clickFloor(item,itemFloor)"
							v-for="(itemFloor,indexFloor) in selectBuildingFloor[item.id]" :key="indexFloor">
							{{itemFloor.floorName}}
						</view>
					</view>
				</u-collapse-item>
			</u-collapse>
		</view>

		<u-empty v-if="!buildingDataList||buildingDataList.length==0" mode="list" icon="/static/images/nodata.png">
		</u-empty>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uCollapse: 0,
				rightPopupIndex: 0,
				buildingDataList: [],
				buildingFloor: [],
				selectBuildingFloor: {},
				atFloor: ""
			}
		},
		onLoad(data) {
			this.getFindBybuilding();
			if (data.buildingFloorId) {
				this.atFloor = data.buildingFloorId
			}
			if (data.buildingId) {
				this.rightPopupIndex = data.buildingId
			}
		},
		methods: {

			clickFloor(item, itemFloor) {
				this.atFloor = itemFloor.id;

				uni.navigateBack({
					delta: 1,
					success: () => {
						// 通过事件总线传递数据
						uni.$emit('pageData', {
							item,
							itemFloor
						});
					}
				});
			},
			getFindBybuilding() {

				this.buildingDataList = [];
				if (this.$store.state.user.atType == "maintenance") {
					let getStorage = uni.getStorageSync('planOffLine_' + this.$store.state.user.checkProject.id);
					if (getStorage && getStorage.building) {
						this.buildingDataList = getStorage.building;
					}
					if (getStorage && getStorage.buildingFloor) {
						getStorage.buildingFloor.forEach((item) => {
							if (this.selectBuildingFloor[item.buildingId]) {
								this.selectBuildingFloor[item.buildingId].push(item);
							} else {
								this.selectBuildingFloor[item.buildingId] = [item]
							}
						})
					}
					if (this.buildingDataList.length > 0 && !this.rightPopupIndex) {
						this.rightPopupIndex = this.buildingDataList[0].id
					}
					this.uCollapse++;

				}

			},
		}
	}
</script>

<style scoped lang="scss">
	.pageDiv {
		height: 100vh;
		width: 100%;
		background-color: #fff;
	}

	::v-deep .uCollapse {
		background-color: #f7f7f7;

		.u-cell__body {
			background-color: #fff;
		}
	}

	.viewDiv {
		width: 100%;
		height: auto;
		display: flex;
		flex-wrap: wrap;
		padding: 20rpx 0;
		// justify-content: space-between;
	}

	.viewTabs {
		width: 100rpx;
		height: 50rpx;
		border-radius: 8rpx;
		display: flex;
		justify-content: center;
		align-items: center;

		border: 1px solid #8b8b8b;
		background-color: #ebebeb;
		margin: 15rpx;
	}

	.atViewDiv {
		color: #fe3535;
		border: 1px solid #FA8161;
		background-color: rgba(250, 129, 97, 0.3);
	}
</style>