import Vue from 'vue';
import Router from 'vue-router';
import myMainTaobaoFixed from '../my-main/my-main-taobao-fixed'; // 菜单
import myMainOverviewTaobaoFixed from '../my-main/my-main-overview-taobao-fixed'; // 数据概况
import myMainMacroscopicTaobaoFixed from '../my-main/my-main-macroscopic-taobao-fixed'; // 宏观维度
import myMainMicrocosmicTaobaoFixed from '../my-main/my-main-microcosmic-taobao-fixed'; // 微观维度
import myMainExtremumTaobaoFixed from '../my-main/my-main-extremum-taobao-fixed'; // 极值维度


Vue.use(Router)

export default new Router({
	routes: [{
			path: '/',
			name: '默认',
			component: myMainTaobaoFixed
		},
		{
			path: '/analysis',
			name: '分析',
			component: myMainTaobaoFixed,
			children: [{
					path: '/',
					name: '概况概况',
					component: myMainOverviewTaobaoFixed,
				},
				{
					path: '/analysis/overview',
					name: '数据概况',
					component: myMainOverviewTaobaoFixed,
				},
				{
					path: '/analysis/macroscopic',
					name: '宏观维度',
					component: myMainMacroscopicTaobaoFixed,
				},
				{
					path: '/analysis/microcosmic',
					name: '微观维度',
					component: myMainMicrocosmicTaobaoFixed,
				},
				{
					path: '/analysis/extremum',
					name: '极值维度',
					component: myMainExtremumTaobaoFixed,
				}
			]
		}
	]
})