<template>
	<div id="app">
		<my-nav>
			<my-nav-menu><router-link to="/analysis">分析</router-link></my-nav-menu>
			<my-nav-menu><router-link to="/develop">开发</router-link></my-nav-menu>
			<my-nav-menu><router-link to="/explore">探索</router-link></my-nav-menu>
		</my-nav>
		<router-view></router-view>
	</div>
</template>

<script>
	import 'common/css/public.css'; // 功能样式
	import MyNav from 'components/my-nav/my-nav'; // 导航
	import MyNavMenu from 'components/my-nav/my-nav-menu'; // 导航-菜单
	export default {
		data() {
		return {
			}
		},
		name: 'app',
		components: {
			MyNav,
			MyNavMenu
		},
		methods: {
		},
		mounted: function() {}
	}
</script>

<style scoped="scoped" lang="scss">
	#app {
	}
</style>