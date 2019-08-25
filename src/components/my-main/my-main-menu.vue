<template>
	<div class="my-main-menu">
		<dl class="menu" v-for="(menuData, index) in menuDataJson.menu" :key="menuData.id">
			<dt>
				<i class="menuico" :class="menuData.ico"></i>
				<template v-if="menuData.router != undefined">
					<router-link :to="menuData.router">{{menuData.name}}</router-link>
				</template>
				<template v-else>
					<a href="JavaScript:;">{{menuData.name}}</a>
				</template>
				<i v-if="menuData.menu != undefined ? true : false" class="arrow" :class="menuData.open ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" @click="menuShowHide(index)"></i>
				
			</dt>
			<template v-if="menuData.menu != undefined">
				<transition-group name="arrow">
					<dd v-for="(menu,index) in menuData.menu" :key="index" v-show="menuData.open">
						<router-link :to="menu.router">{{menu.name}}</router-link>
					</dd>
				</transition-group>
			</template>
		</dl>
	</div>
</template>

<script>
	export default {
		name: 'my-main-menu',
		props: ["menuDataJson"],
		data() {
			return {
				menuStatus: -1
			}
		},
		methods: {
			menuShowHide: function(size) {
				if(this.menuDataJson.menu[size].open) { // 关闭菜单
					this.menuDataJson.menu[size].open = false;
				} else {
					this.menuDataJson.menu[size].open = true;
				}
			}
		},
		created: function() { // 组件创建完成

		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
	.arrow-enter-active,.arrow-leave-active {
		transition: opacity .5s;
	}
	
	.arrow-enter,.arrow-leave-to{
		opacity: 0;
	}
	
	.my-main-menu {
		width: 100%;
		background-color: transparent;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		position: relative;
		padding: 15px 0px;
		box-sizing: border-box;
		.menu {
			width: 100%;
			margin-bottom: 10px;
			padding: 0px 10px 0px 15px;
			a {
				font-size: 12px;
				text-decoration: none;
				color: #808492;
				transition: all 1s;
				&:hover {
					color: #343437;
				}
			}
			>dt {
				width: 100%;
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				justify-content: flex-start;
				align-items: center;
				height: 30px;
				line-height: 30px;
				>a {
					display: block;
					font-weight: bold;
					width: 62%;
				}
				>i.menuico {
					margin-right: 10px;
					font-size: 16px;
				}
				>i.arrow {
					font-size: 14px;
					cursor: pointer;
					color: #808492;
					&:hover{
						color: #343437;
					}
				}
			}
			dd {
				margin: 0px;
				padding-left: 15%;
				height: 23px;
				line-height: 23px;
			}
		}
	}
</style>