<template>
	<div class="my-overview-taobao-fixde">
		<div class="title">微观维度<i class="el-icon-question" title="根据时间维度对数据进行筛选。(数据来自有效数据)"></i><span>因为爬虫获取面积存在技术问题,所以面积参数仅供参考,一二级区域因为数据量比较客观,所以可信度高.三级区域数量比较少,展示结果仅供参考.</span>
			<div class="filteritem">
				<div class="option">
					<span class="title">选择年:<i class="el-icon-question" title="最多选择一年"></i></span>
					<el-date-picker v-model="YearValue" type="year" value-format="yyyy" placeholder="选择年" size="mini" :editable="editable" :clearable="clearable"  :picker-options="pickerOptions"></el-date-picker>
				</div>
				<div class="option">
					<el-select v-model="OneLevelSelect" filterable placeholder="省/直辖市/自治区" size="mini" @change="OneLevelValChange" >
					    <el-option v-for="item in optionsOneLevel" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="option">
					<el-select v-model="TwoLevelSelect" filterable placeholder="县/市/区" size="mini" @change="TwoLevelValChange">
					    <el-option v-for="item in optionsTwoLevel" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div class="option" v-show="ThreeShow">
					<el-select v-model="ThreeLevelSelect" filterable placeholder="县/市/区" size="mini" >
					    <el-option v-for="item in optionsThreeLevel" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<el-button type="primary" size="mini" @click="MicrocosmicAnalysisClick">开始分析</el-button>
			</div>
		</div>
		<div class="interval"></div>
		<div class="maincontent">
			<div class="title">总概况</div>
			<div class="maindata" style="height: 300px; width: 100%;">
				<div id="dataNational" style="width:100%;height: 100%;"></div>
			</div>
		</div>
		<div class="interval"></div>
		<div class="maincontent">
			<div class="title">价格分布</div>
			<div class="maindata" style="height: 300px; width: 100%;">
				<div id="dataPriceScatter" style="width:100%;height: 100%;"></div>
			</div>
		</div>
		<div class="interval"></div>
		<div class="maincontent">
			<div class="title">买家分析</div>
			<div class="maindata" style="height: 300px; width: 100%;">
				<div id="dataTrade" style="width:100%;height: 100%;"></div>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">
	var echarts = require('echarts');
	
	import $ from 'jquery';
	import '../../common/js/china';
	export default {
		name: 'my-overview-taobao-fixde',
		props: ["default-value"],
		data() {
			return {
				optionsOneLevel: [{
		          value: '北京市',
		          label: '北京市'
		        }, {
		          value: '天津市',
		          label: '天津市'
		        }, {
		          value: '上海市',
		          label: '上海市'
		        }, {
		          value: '重庆市',
		          label: '重庆市'
		        }, {
		          value: '河北省',
		          label: '河北省'
		        }, {
		          value: '山西省',
		          label: '山西省'
		        }, {
		          value: '辽宁省',
		          label: '辽宁省'
		        }, {
		          value: '吉林省',
		          label: '吉林省'
		        }, {
		          value: '黑龙江省',
		          label: '黑龙江省'
		        }, {
		          value: '江苏省',
		          label: '江苏省'
		        }, {
		          value: '浙江省',
		          label: '浙江省'
		        }, {
		          value: '安徽省',
		          label: '安徽省'
		        }, {
		          value: '福建省',
		          label: '福建省'
		        }, {
		          value: '江西省',
		          label: '江西省'
		        }, {
		          value: '山东省',
		          label: '山东省'
		        }, {
		          value: '河南省',
		          label: '河南省'
		        }, {
		          value: '湖北省',
		          label: '湖北省'
		        }, {
		          value: '湖南省',
		          label: '湖南省'
		        }, {
		          value: '广东省',
		          label: '广东省'
		        }, {
		          value: '海南省',
		          label: '海南省'
		        }, {
		          value: '四川省',
		          label: '四川省'
		        }, {
		          value: '贵州省',
		          label: '贵州省'
		        }, {
		          value: '云南省',
		          label: '云南省'
		        }, {
		          value: '陕西省',
		          label: '陕西省'
		        }, {
		          value: '甘肃省',
		          label: '甘肃省'
		        },{
		          value: '青海省',
		          label: '青海省'
		        }, {
		          value: '台湾省',
		          label: '台湾省'
		        }, {
		          value: '内蒙古自治区',
		          label: '内蒙古自治区'
		        }, {
		          value: '广西壮族自治区',
		          label: '广西壮族自治区'
		        }, {
		          value: '西藏自治区',
		          label: '西藏自治区'
		        }, {
		          value: '宁夏回族自治区',
		          label: '宁夏回族自治区'
		        }, {
		          value: '新疆维吾尔自治区',
		          label: '新疆维吾尔自治区'
		        }],
		        optionsTwoLevel:[],
		        optionsThreeLevel:[{}],
		        OneLevelSelect:'北京市',
		        TwoLevelSelect:'所有城市',
		        ThreeLevelSelect:'所有城市',
		        CityDataAll:{},
		        YearValue: [],
				pickerOptions:{
	            	disabledDate(time) {
			            return time.getTime() < Date.parse("2013/01/01") || time.getTime() > Date.now()
			        }
	           },
		        ThreeShow:false, // 三级地区选择显示隐藏
				editable: false,
				clearable: false
			}
		},
		components: { // 注册组件
		},
		created: function() { // 生命周期组件创建
			
		},
		watch:{ // 监控数据变化时触发
		},
		beforeUpdate:function(){ // 生命周期组件更新后
			console.log("Sdfsd")
		},
		filters:{ // 过滤器
		},
		methods:{ // 事件
			OneLevelValChange:function(val){ // 一级地址选择
				this.AjaxCityData();
				this.TwoLevelSelect = "所有城市"
				this.ThreeShow = false;
			},
			TwoLevelValChange:function(val){ // 二级地址选择
				if(val!="所有城市"){
					this.ThreeShow = true;
					this.ThreeLevelSelect = "所有城市"
					this.optionsThreeLevel = [{value: '',label: '所有城市'}]; // 清空数据
					for(var i = 0; i < this.CityDataAll[val].length; i++ ){
						this.optionsThreeLevel.push({value: this.CityDataAll[val][i],label: this.CityDataAll[val][i]});
					}
				}else{
					this.ThreeShow = false;
				}
			},
			AjaxCityData:function(){
				this.$axios.get(ajaxAddress + "ajax/taobaoauction/estate/microcosmic_oneleveltotwolevel", {
					params: {
						"OneLevelCitySet":this.OneLevelSelect
					}
				}).then(res => {
					this.CityDataAll = res.data
					// 将数据付给二级地址下拉
					this.optionsTwoLevel = [{value: '',label: '所有城市'}]; // 清空数据
					for(var key in this.CityDataAll){
						this.optionsTwoLevel.push({value: key,label: key})
					}
				})
			},
			MicrocosmicAnalysisClick:function(){
				myChartdataNational.showLoading(); // 总概况显示加载
				this.AjaxChartdataNationalData(this.YearValue, this.OneLevelSelect, this.TwoLevelSelect, this.ThreeLevelSelect);// 总概况
				myChartdataPriceScatter.showLoading(); // 价格分析显示加载
				this.AjaxChartdataPriceScatter(this.YearValue, this.OneLevelSelect, this.TwoLevelSelect, this.ThreeLevelSelect);// 价格分析
				
				// 买家分析
				myChartDataTrade.showLoading();
				this.AjaxChartDataTrade(this.YearValue, this.OneLevelSelect, this.TwoLevelSelect, this.ThreeLevelSelect)
				
			},
			AjaxChartdataNationalData:function(TimeYear, OneLevelCitySet, TwoLevelCitySet, ThreeLevelCitySet){// 总概况
//			var ajaxAddressRequest = "/api/taobaodataregionnational" // 测试地址
//			var ajaxAddressRequest = ajaxAddress + "ajax/taobaoauction/estate/microcosmic_allsurvey" // 服务器地址
				this.$axios.get(ajaxAddress + "ajax/taobaoauction/estate/microcosmic_allsurvey", {
					params: {
						"TimeYear": TimeYear,
						"OneLevelCitySet": OneLevelCitySet,
						"TwoLevelCitySet": TwoLevelCitySet,
						"ThreeLevelCitySet": ThreeLevelCitySet
					}
				})
				.then(res => {					
					var colors = ['#5793f3', '#d14a61', '#675bba'];
					var optionNational = {
						    color: colors,
						    tooltip: {
						        trigger: 'axis',
						        axisPointer: {
						            type: 'cross'
						        },
						        formatter:'{a0}: {c0} 个<br />{a1}: {c1} m²<br />{a2}: {c2} 万'
						    },
						    grid:{
			                    x:60,
			                    y:55,
			                    x2:180,
			                    y2:25
			                },
						    toolbox: {
						        show: false
						    },
						    legend: {
						        data:['总成交数量','总成交面积','总成交金额'],
						    },
						    xAxis: [
						        {
						            type: 'category',
						            axisTick: {
						                alignWithLabel: true
						            },
						            data: res.data.frametime
						        }
						    ],
						    yAxis: [
						        {
						            type: 'value',
						            name: '总成交数量',
						            min: 0,
						            position: 'left',
						            axisLine: {
						                lineStyle: {
						                    color: colors[0]
						                }
						            },
						            axisLabel: {
						                formatter: '{value} 个'
						            }
						        },
						        {
						            type: 'value',
						            name: '总成交面积',
						            min: 0,
						            position: 'right',
						            offset: 80,
						            axisLine: {
						                lineStyle: {
						                    color: colors[1]
						                }
						            },
						            axisLabel: {
						                formatter: '{value} m²'
						            }
						        },
						        {
						            type: 'value',
						            name: '总成交金额',
						            min: 0,
						            position: 'right',
						            axisLine: {
						                lineStyle: {
						                    color: colors[2]
						                }
						            },
						            axisLabel: {
						                formatter: '{value} 万'
						            }
						        }
						    ],
						    series: [
						        {
						            name:'总成交数量',
						            type:'bar',
						            data:res.data.quantitynationwide
						        },
						        {
						            name:'总成交面积',
						            type:'line',
						            yAxisIndex: 1,
						            data:res.data.areanationwide,
						            itemStyle: {
										color:'rgb(209, 74, 97)'
						            },
						            areaStyle: {
						                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						                    offset: 0,
						                    color: 'rgba(209, 74, 97, .3)'
						                }, {
						                    offset: 1,
						                    color: 'rgba(209, 74, 97, .3)'
						                }])
						            }
						        },
						        {
						            name:'总成交金额',
						            type:'line',
						            yAxisIndex: 2,
						            lineStyle: {
							            normal: {
							                color: 'rgb(103, 91, 186)',
							                width: 1.5,
							                type: 'dashed'
							            }
							        },
						            itemStyle: {
						                color: 'rgb(103, 91, 186)'
						            },
						            data:res.data.pricetionwide
						        }
						    ]
						};
					// 使用刚指定的配置项和数据显示图表。
					myChartdataNational.setOption(optionNational);
					myChartdataNational.hideLoading(); // 隐藏加载
					
				}).catch(function(error) {
					console.log("error init." + error)
				})
			},
			AjaxChartdataPriceScatter:function(TimeYear, OneLevelCitySet, TwoLevelCitySet, ThreeLevelCitySet){
				// 价格分布
//			var ajaxAddressRequest = "/api/taobaodataoverview" // 测试地址
//			var ajaxAddressRequest = ajaxAddress + "ajax/taobaoauction/estate/microcosmic_pricescatte" // 服务器地址
				this.$axios.get(ajaxAddress + "ajax/taobaoauction/estate/microcosmic_pricescatte", {
					params: {
						"TimeYear": TimeYear,
						"OneLevelCitySet": OneLevelCitySet,
						"TwoLevelCitySet": TwoLevelCitySet,
						"ThreeLevelCitySet": ThreeLevelCitySet
					}
				})
				.then(res => {
					// 全数据展示
					console.log(res)
					var colors = ['#5793f3', '#d14a61', '#675bba'];
					var optionPriceScatter = {
						    color: colors,
						    tooltip: {
						        trigger: 'axis',
						        axisPointer: {
						            type: 'cross'
						        },
						        formatter:'{a0}: {c0} 个<br />{a1}: {c1} 万<br />{a2}: {c2} m²'
						    },
						    grid:{
			                    x:100,
			                    y:55,
			                    x2:200,
			                    y2:25
			                },
						    toolbox: {
						        show: false
						    },
						    legend: {
						        data:['数量','总均价','总平均面积'],
						    },
						    xAxis: [
						        {
						            type: 'category',
						            axisTick: {
						                alignWithLabel: true
						            },
						            data: res.data.PriceSection
						        }
						    ],
						    yAxis: [
						        {
						            type: 'value',
						            name: '数量',
						            min: 0,
						            offset: 0,
						            position: 'left',
						            axisLine: {
						                lineStyle: {
						                    color: colors[0]
						                }
						            },
						            axisLabel: {
						                formatter: '{value} 个'
						            }
						        },
						        {
						            type: 'value',
						            name: '总均价',
						            min: 0,
						            position: 'right',
						            offset: 100,
						            axisLine: {
						                lineStyle: {
						                    color: colors[1]
						                }
						            },
						            axisLabel: {
						                formatter: '{value} 万'
						            }
						        },
						        {
						            type: 'value',
						            name: '总平均面积',
						            min: 0,
						            position: 'right',
						            axisLine: {
						                lineStyle: {
						                    color: colors[2]
						                }
						            },
						            axisLabel: {
						                formatter: '{value} m²'
						            }
						        }
						    ],
						    series: [
						        {
						            name:'数量',
						            type:'bar',
						            data:res.data.TotalTransaction
						        },
						        {
						            name:'总均价',
						            type:'line',
						            yAxisIndex: 1,
						            data:res.data.TotalPrice,
						            itemStyle: {
										color:'rgb(209, 74, 97)'
						            },
						            areaStyle: {
						                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						                    offset: 0,
						                    color: 'rgba(209, 74, 97, .3)'
						                }, {
						                    offset: 1,
						                    color: 'rgba(209, 74, 97, .3)'
						                }])
						            }
						        },
						        {
						            name:'总平均面积',
						            type:'line',
						            yAxisIndex: 2,
						            lineStyle: {
							            normal: {
							                color: 'rgb(103, 91, 186)',
							                width: 1.5,
							                type: 'dashed'
							            }
							        },
						            itemStyle: {
						                color: 'rgb(103, 91, 186)'
						            },
						            data:res.data.TotalArea
						        }
						    ]
						};
					// 使用刚指定的配置项和数据显示图表。
					myChartdataPriceScatter.setOption(optionPriceScatter);
					myChartdataPriceScatter.hideLoading(); // 隐藏加载
				}).catch(function(error) {
					console.log("error init." + error)
				})
			},
			AjaxChartDataTrade:function(TimeYear, OneLevelCitySet, TwoLevelCitySet, ThreeLevelCitySet){
//			var ajaxAddressRequest = "/api/taobaodataregionnationalBuyer" // 测试地址
//			var ajaxAddressRequest = ajaxAddress + "ajax/taobaoauction/estate/microcosmic_buyer" // 服务器地址
				this.$axios.get(ajaxAddress + "ajax/taobaoauction/estate/microcosmic_buyer", {
					params: {
						"TimeYear": TimeYear,
						"OneLevelCitySet": OneLevelCitySet,
						"TwoLevelCitySet": TwoLevelCitySet,
						"ThreeLevelCitySet": ThreeLevelCitySet
					}
				}).then(res => {
					for(var i = 0; i < res.data.TurnoverRate.length; i++){
						res.data.TurnoverRate[i] = res.data.TurnoverRate[i]*100
					}
					
					var colors = ['#5793f3', '#d14a61', '#675bba', '#57eaf3'];
					var optionmyChartAreaChange = {
						tooltip: {
						        trigger: 'axis',
						        axisPointer: {
						            type: 'cross'
						        },
						        formatter:'{a0}: {c0} 人<br />{a1}: {c1} 人<br />{a2}: {c2} 次<br />{a3}: {c3} %'
						},
						grid:{
		                    x:150,
		                    y:55,
		                    x2:180,
		                    y2:25
		                },
					    toolbox: {
					        show: false
					    },
					    legend: {
					        data:['围观人数','报名人数','竞拍次数','成交率'],
					    },
					    xAxis: [
					        {
					            type: 'category',
					            axisTick: {
					                alignWithLabel: true
					            },
					            data: res.data.PriceSection
					        }
					    ],
					    yAxis: [
					        {
					            type: 'value',
					            name: '围观人数',
					            min: 0,
					            position: 'left',
					            axisLine: {
					                lineStyle: {
					                    color: colors[0]
					                }
					            },
					            axisLabel: {
					                formatter: '{value} 人'
					            }
					        },
					        {
					            type: 'value',
					            name: '报名人数',
					            min: 0,
					            position: 'right',
					            axisLine: {
					                lineStyle: {
					                    color: colors[1]
					                }
					            },
					            axisLabel: {
					                formatter: '{value} 人'
					            }
					        },
					        {
					            type: 'value',
					            name: '竞拍次数',
					            min: 0,
					            position: 'right',
					            offset: 80,
					            axisLine: {
					                lineStyle: {
					                    color: colors[2]
					                }
					            },
					            axisLabel: {
					                formatter: '{value} 人'
					            }
					        },
					        {
					            type: 'value',
					            name: '成交率',
					            min: 0,
					            position: 'left',
					            offset: 80,
					            axisLine: {
					                lineStyle: {
					                    color: colors[3]
					                }
					            },
					            axisLabel: {
					                formatter: '{value} %'
					            }
					        }
					    ],
					    series: [{
				            name:'围观人数',
				            type:'bar',
				            data:res.data.ViewingTimes,
				            itemStyle: {
								color:colors[0]
				            },
				        },
				        {
				            name:'报名人数',
				            type:'line',
				            yAxisIndex: 1,
				            data:res.data.EnrolmentTime,
				            itemStyle: {
								color:'rgb(209, 74, 97)'
				            },
				            areaStyle: {
				                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
				                    offset: 0,
				                    color: 'rgba(209, 74, 97, .3)'
				                }, {
				                    offset: 1,
				                    color: 'rgba(209, 74, 97, .3)'
				                }])
				            }
				        },
				        {
				            name:'竞拍次数',
				            type:'line',
				            yAxisIndex: 2,
				            lineStyle: {
					            normal: {
					                color: 'rgb(103, 91, 186)',
					                width: 1.5,
					                type: 'dashed'
					            }
					        },
				            itemStyle: {
				                color: 'rgb(103, 91, 186)'
				            },
				            data:res.data.AuctionFrequency
				        },
				        {
				            name:'成交率',
				            type:'line',
				            yAxisIndex: 3,
				            lineStyle: {
					            normal: {
					                color: '#57eaf3',
					                width: 1.5,
					                type: 'dashed'
					            }
					        },
				            itemStyle: {
				                color: '#57eaf3'
				            },
				            data:res.data.TurnoverRate
				        }]
					};
					myChartDataTrade.setOption(optionmyChartAreaChange);
					myChartDataTrade.hideLoading(); // 隐藏加载
				}).catch(function(error) {
					console.log("error init." + error)
				})
			}
		},
		mounted: function() { // 加载完成
			// 初始化城市下拉数据
			this.AjaxCityData();
			// 默认的时间控件值
			var myDate = new Date();
			var currentYear = myDate.getFullYear();    //获取完整的年份(4位,1970-????)
			var currentMonth = myDate.getMonth() + 1;       //获取当前月份(0-11,0代表1月)
			var currentDate = myDate.getDate();        //获取当前日(1-31)
			if(currentMonth < 10){
				currentMonth = "0" + currentMonth.toString();
			}
			if(currentDate < 10){
				currentDate = "0" + currentDate.toString();
			}
			this.YearValue = currentYear.toString();
			// 总概况
			window.myChartdataNational = echarts.init(document.getElementById('dataNational'));
			this.AjaxChartdataNationalData();
			
			
			// 价格分布
			window.myChartdataPriceScatter = echarts.init(document.getElementById('dataPriceScatter'));
			this.AjaxChartdataPriceScatter();

			
			
			// 买家分析
			window.myChartDataTrade = echarts.init(document.getElementById('dataTrade'));
			this.AjaxChartDataTrade()

		
			window.onresize = function(){
			    myChartdataNational.resize();
			    myChartdataPriceScatter.resize();
			    myChartDataTrade.resize();
			}
		}
	}

</script>

<style scoped lang="scss">
	.my-overview-taobao-fixde {
		.filteritem{
			margin: 25px 0px 0px 0px;
			>.option{
				display: inline-block;
				margin-right: 10px;
				.title{
					font-size: 12px;
					font-weight: normal;
					display: inline-block;
					margin-right: 10px;
					i.el-icon-question{
						cursor: help;
						margin-left: 5px;
						color: #808492;
					}
				}
			}
		}
		.interval {
			background-color: #fafafb;
			border-top: 1px solid #e7e9f0;
			border-bottom: 1px solid #e7e9f0;
			height: 8px;
			position: relative;
    		z-index: -1;
		}
		> .title {
			width: 100%;
			padding: 20px 40px;
			font-size: 16px;
			color: #222e38;
			font-weight: bold;
			box-sizing: border-box;
			>i.el-icon-question {
				font-size: 18px;
				margin-left: 10px;
				color: #808492;
				cursor: help;
			}
			>span{
				font-size: 12px;
			    color: #808492;
			    padding: 0px 5px;
			    font-weight: normal;
			}
		}
		.maincontent {
			width: 100%;
			box-sizing: border-box;
			padding: 20px 40px;
			> .title{
				font-size: 14px;
				font-weight: normal;
				color: #343437;
				padding: 0px 0px 10px 0px;
				span{
					font-size: 12px;
					color: #808492;
					padding: 0px 5px;
				}
			}
		}
	}
</style>