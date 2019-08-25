<template>
	<div class="my-overview-taobao-fixde">
		<div class="title">数据概况<i class="el-icon-question" title="数据概况是数据源可靠性仪表盘，通过集中展现当前应用的核心数据指标（如：数据来源、数据采集、数据损失等）及主要报表的近30日趋势变化缩略图，帮助您快速了解应用的当前数据表现。"></i></div>
		<div class="interval"></div>
		<div class="maincontent">
			<div class="overview">
				<dl>
					<dt><span>来源:</span>淘宝司法拍卖</dt>
					<dd>当前</dd>
					<dd>新增</dd>
				</dl>
				<dl>
					<dd>总数据量<i class="el-icon-question" title="包含所有数据。"></i></dd>
					<dt>{{ datasummary.alldatacurrent | thousandsformat }}</dt>
					<dd>{{ datasummary.alldatacurrent - datasummary.alldatalast | thousandsformat }}</dd>
				</dl>
				<dl>
					<dd>成交数量<i class="el-icon-question" title="只有交易成功的数据。"></i></dd>
					<dt>{{ datasummary.alldatacurrent - datasummary.invaliddatacurrent | thousandsformat }}</dt>
					<dd>{{ datasummary.invaliddatacurrent - datasummary.invaliddatalast | thousandsformat }}</dd>
				</dl>
				<dl>
					<dd>更新时间</dd>
					<dt>{{ datasummary.timeupdate }}</dt>
				</dl>
				<dl>
					<dd>数据起点</dd>
					<dt>{{ datasummary.timestarting }}</dt>
				</dl>
				<dl>
					<dd>更新周期</dd>
					<dt>{{ datasummary.updatecycle }}天</dt>
				</dl>
			</div>
			<div class="maindata" style="height: 300px; width: 100%;">
				<div id="main" style="width:100%;height: 100%;"></div>
			</div>
		</div>
		<div class="overviewdimension">
				<div class="dimensionbok">
					<div class="title">成交金额<span>最近30天(万)</span></div>
					<div class="datachange" id="datachange" style="width:100%;height: 100%;"></div>
				</div>
				<div class="dimensionbok">
					<div class="title">成交面积<span>最近30天(万平米)</span></div>
					<div class="areachange" id="areachange" style="width:100%;height: 100%;"></div>
				</div>
				<div class="dimensionbok">
					<div class="title">各省分布<span>今年总数据</span></div>
					<div class="regionchange" id="regionchange" style="width:100%;height: 100%;"></div>
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
		props: {},
		data() {
			return {
				datasummary: {}
			}
		},
		components: { // 注册组件
		},
		created: function() { // 生命周期组件创建
		},
		filters:{
			thousandsformat: function(value){
				if(value == null) {
					value = '';
				}
				var str = value.toString();
				var len = str.length;
	
				if(len > 3) {
					var l1 = len % 3,
						l2 = parseInt(len / 3),
						arr = [],
						first = str.substr(0, l1);
					if(first != '') {
						arr.push(first);
					};
					for(var i = 0; i < l2; i++) {
						arr.push(str.substr(l1 + i * 3, 3));
					};
					str = arr.join(',');
				};
				return str;
			}
		},
		mounted: function() { // 加载完成
			//get请求
//			var ajaxAddressRequest = "/api/taobaodataoverview" // 测试地址
//			var ajaxAddressRequest = ajaxAddress + "ajax/taobaoauction/estate/survey" // 服务器地址
			this.$axios.get(ajaxAddress + "ajax/taobaoauction/estate/survey", {
				params: {}
			})
			.then(res => {
				this.datasummary = res.data.datasummary;
				// 指定图表的配置项和数据
				var option = {
				    tooltip: {
				        trigger: 'axis',
				        axisPointer: {
				            type: 'cross'
				        },
				        formatter:'{a0}: {c0} 个 </br>{a1}: {c1} 个'
				    },
				    grid:{
	                    x:100,
	                    y:55,
	                    x2:65,
	                    y2:75
	                },
					toolbox: {
				        feature: {
				        }
				    },
				    legend: {
				        data:['最近30天','上一个30天'],
				        x: 'left'
				    },
					xAxis: [{
						type: 'category',
	        			boundaryGap: false,
	        			axisPointer: {
			                label: {
			                    formatter: function (params) {
			                        return '最近30天  ' + params.value;
			                    }
			                }
			            },
						data: res.data.time.onetime
					},
					{
						type: 'category',
	        			boundaryGap: false,
	        			axisLine:{
	        				lineStyle:{
		        				color:"#d5d9dc"
		        			}
	        			},
	        			axisTick:{
	        				lineStyle:{
	        					color:"#d5d9dc"
	        				}
	        			},
	        			axisPointer: {
			                label: {
			                    formatter: function (params) {
			                        return '上一个30天  ' + params.value + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
			                    }
			                }
			            },
						data: res.data.time.twotime
					}
					],
					yAxis: {
						type: 'value',
	        			boundaryGap: [0, '5%']
					},
					dataZoom: [{
				        type: 'inside',
				        start: 0,
				        end: 100
				    }, {
				        start: 0,
				        end: 100,
				        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
				        handleSize: '80%',
				        handleStyle: {
				            color: '#fff',
				            shadowBlur: 3,
				            shadowColor: 'rgba(0, 0, 0, 0.6)',
				            shadowOffsetX: 2,
				            shadowOffsetY: 2
				        }
				    }],
					series: [{
						type:'line',
						name: '最近30天',
						itemStyle: {
							color:'rgb(65, 125, 245)'
			            },
			            areaStyle: {
			                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
			                    offset: 0,
			                    color: 'rgba(65, 125, 245, .3)'
			                }, {
			                    offset: 1,
			                    color: 'rgba(65, 125, 245, .3)'
			                }])
			            },
						data: res.data.data.onedata
					},
					{
						type:'line',
						name:'上一个30天',
						lineStyle: {
				            normal: {
				                color: 'rgb(112, 158, 251)',
				                width: 1.5,
				                type: 'dashed'
				            }
				        },
			            itemStyle: {
			                color: 'rgb(112, 158, 251)'
			            },
						data: res.data.data.twodata
					}
					]
				};
				// 使用刚指定的配置项和数据显示图表。
				myChartmain.setOption(option);
			}).catch(function(error) {
				console.log("error init." + error)
			})
			
			
			
			// 基于准备好的dom，初始化echarts实例
			var myChartmain = echarts.init(document.getElementById('main'));
			
			// 数据波动维度
			var myChartDataChange = echarts.init(document.getElementById('datachange'));
			//get请求
//			var ajaxAddressRequest = "/api/datachange" // 测试地址
//			var ajaxAddressRequest = ajaxAddress + "ajax/taobaoauction/estate/survey_turnover" // 服务器地址
			this.$axios.get(ajaxAddress + "ajax/taobaoauction/estate/survey_turnover", {
					params: {}
				})
				.then(res => {
					var optionmyChartDataChange = {
					    tooltip: {
					        trigger: 'axis',
					        axisPointer: {
					            type: 'cross'
					        },
					        formatter:'销售金额: {c0}万'
					    },
						grid:{
		                    x:50,
		                    y:40,
		                    x2:5,
		                    y2:30
		                },
					    xAxis: {
					        type: 'category',
					        data: res.data.time
					    },
					    yAxis: {
					        type: 'value',
					        boundaryGap: [0, '10%']
					    },
					    series: [{
					        data: res.data.data,
					        type: 'bar',
					        color:"rgb(112, 158, 251)"
					    }]
					};
					myChartDataChange.setOption(optionmyChartDataChange);
				}).catch(function(error) {
					console.log("error init." + error)
				})
			
			
			// 拍卖面积维度
			this.$axios.get(ajaxAddress + "ajax/taobaoauction/estate/survey_acreage", {
				params: {}
			})
			.then(res => {
				var myChartAreaChange = echarts.init(document.getElementById('areachange'));
				var optionmyChartAreaChange = {
					tooltip: {
				        trigger: 'axis',
				        axisPointer: {
				            type: 'cross'
				        },
				        formatter:'销售面积: {c0}万m²'
				    },
					grid:{
	                    x:50,
	                    y:40,
	                    x2:5,
	                    y2:30
	                },
				    xAxis: {
				        type: 'category',
				        data: res.data.time
				    },
				    yAxis: {
				        type: 'value',
				        boundaryGap: [0, '10%']
				    },
				    series: [{
				        data: res.data.data,
				        type: 'line',
				        color:"rgb(112, 158, 251)",
				        areaStyle: {
			                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
			                    offset: 0,
			                    color: 'rgba(65, 125, 245, .3)'
			                }, {
			                    offset: 1,
			                    color: 'rgba(65, 125, 245, .3)'
			                }])
			            }
				    }]
				};
				myChartAreaChange.setOption(optionmyChartAreaChange);
			}).catch(function(error) {
				console.log("error init." + error)
			})
			
			
			// 区域分布
			this.$axios.get(ajaxAddress + "ajax/taobaoauction/estate/survey_province", {
				params: {}
			})
			.then(res => {
				var mydata = res.data.data;
				var myChartRegionChange = echarts.init(document.getElementById('regionchange'));
	            var optionMap = {  
		                backgroundColor: '#FFFFFF',  
		                tooltip : {  
		                    trigger: 'item'  
		                },  
		                
		                //左侧小导航图标
		                visualMap: {  
		                    left: 'left',
				            min: 0,
				            max: res.data.maxdara,
				            inRange: {
				                color: ['#f6f7f8','#dbdddf','#b7b9ba', '#5de1ff', '#44ffff', '#91b6fe', '#3f8eed', '#0e5bcf', '#0a41b1', '#0d09a1', '#800584', '#560584', '#42064f', '#020546']
				            },
				            text:['高','底'],           // 文本，默认为数值文本
				            calculable: true
		                },  
		                //配置属性
		                series: [{  
		                    name: '数据变化',  
		                    type: 'map',  
		                    mapType: 'china',   
		                    roam: false,  
		                    aspectScale:.8,
		                    nameMap:{
		                    	'China' : '中国'
		                    },
		                    itemStyle: {
		                    	borderColor:"#f6f7f8",
				                emphasis: {
				                    borderColor: '#91b6fe',
				                    areaColor:'#ffe8e8',
				                    borderWidth: 1
				                    
				                }
				            },
			                symbolSize: 12,
		                    label: {  
		                        normal: {  
		                            show: false  //省份名称  
		                        },  
		                        emphasis: {  
		                            show: false  
		                        }  
		                    },  
		                    data:mydata  //数据
		                }]  
		            };  
		
		        //使用制定的配置项和数据显示图表
		        myChartRegionChange.setOption(optionMap);
				
			}).catch(function(error) {
				console.log("error init." + error)
			})
			
		

			
			
			window.onresize = function(){
			    myChartmain.resize();
			    myChartDataChange.resize();
			    myChartAreaChange.resize();
			    myChartRegionChange.resize();
			}
		}
	}

</script>

<style scoped lang="scss">
	.my-overview-taobao-fixde {
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
		}
		.maincontent {
			width: 100%;
			box-sizing: border-box;
			padding: 20px 40px;
			.overview{
				display: flex;
				flex-direction: row;
				flex-wrap:nowrap;
				>dl{
					width: 17%;
					text-align: right;
					border-top: 3px solid transparent;
					padding-top: 20px;
					margin-top: -20px;
					margin-bottom: 35px;
					transition: all .5s;
					>dt{
						height: 35px;
						font-size: 23px;
						color: #222e38;
					}
					>dd{
						font-size: 12px;
						color: #808492;
						padding: 10px 0px;
						height: 23px;
						i.el-icon-question{
							margin-left: 5px;
							cursor: help;
							font-size: 14px;
						}
					}
					&:hover{
						border-top: 3px solid #396fff;
						dt,dd{
							color: #396fff;
						}
					}
				}
				>dl:nth-child(1){
					width:15%;
					min-width: 200px;
					dt span{
						font-size: 12px;
						color: #808492;
						margin-right: 10px;
					}
				}
			}
		}
		.overviewdimension{
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			justify-content: flex-start;
			align-items: stretch;
			border-top: 1px solid #e7e9f0;
			.dimensionbok{
				width: 33.3333%;
				padding: 30px;
				border-right: 1px solid #e7e9f0;
				height: 350px;
				&:last-child{
					border-right:none;
				}
				> .title{
					font-size: 14px;
					font-weight: normal;
					color: #343437;
					span{
						font-size: 12px;
						color: #808492;
						padding: 0px 5px;
					}
				}
			}
		}
	}
</style>