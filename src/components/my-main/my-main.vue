<template>
	<div class="my-main">
		<div class="menu">
			<my-main-menu :menu-data-json="menuDataJson"></my-main-menu>
		</div>
		<div class="content">
			<router-view></router-view>
		</div>
	</div>
</template>

<script>
	import MyMainMenu from './my-main-menu'; // 菜单栏
	export default {
		name: 'my-main',
		props: {
		},
		data() {
			return {
				menuDataJson:{}
			}
		},
		components: {
			MyMainMenu
		},
		created:function(){
			this.menuDataJson = dataJson;
		}
	}
	var dataJson={
		"menu": [
			{
				"name": "应用概况",
				"ico": "el-icon-mobile-phone",
				"router": "/analysis/overview"
			}, {
				"name": "定制分析",
				"ico": "el-icon-service",
				"open": true,
				"menu": [
					{
						"name": "实时分析",
						"router": "/analysis/realtime"
					}, {
						"name": "定制报告",
						"router": "/analysis/regular"
					}
				]
			},{
				"name": "用户分析",
				"ico": "el-icon-edit-outline",
				"open": true,
				"menu": [
					{
						"name": "用户趋势",
						"router": "/analysis/newuser"
					}, {
						"name": "活跃用户",
						"router": "/analysis/activitydegree"
					}
				]
			}
		]
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
	.my-main {
		width: 100%;
		min-width: 1200px;
		background-color: transparent;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: stretch;
		position: relative;
		.menu{
			width: 180px;
			background-color: #fafafb;
    		border-right: 1px solid #e7e9f0;
		}
		.content{
			width: calc(100% - 180px);
			min-height: 600px;
		}
	}
</style>