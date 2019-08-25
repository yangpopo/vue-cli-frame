<template>
	<div class="my-overview-taobao-fixde">
		<div class="title">宏观维度<i class="el-icon-question" title="根据区域维度对数据进行筛选。(数据来自有效数据)"></i></div>
		<div class="interval"></div>
		<div class="maincontent">
			<div class="title">年度数据<span>成交数量=成交数量求和,&nbsp;成交额=拍卖成功求和.</span></div>
			<div class="maindata" style="height: 300px; width: 100%;">
				<div id="dataYear" style="width:100%;height: 100%;"></div>
			</div>
		</div>
		<div class="interval"></div>
		<div class="maincontent">
			<div class="filteritem">
				<div class="option">
					<span class="title">时间区间:<i class="el-icon-question" title="最大时间区间30天"></i></span>
					<el-date-picker v-model="MonthTimeSelect0" type="date" placeholder="开始日期" size="mini" :editable="editable" :clearable="clearable" :picker-options="pickerOptions0">
					</el-date-picker>
					<el-date-picker v-model="MonthTimeSelect1" type="date" placeholder="结束日期" size="mini" :editable="editable" :clearable="clearable" :picker-options="pickerOptions1">
					</el-date-picker>
				</div>
				<el-button type="primary" size="mini" @click="DaySectionButClick">开始分析</el-button>
			</div>
			<div class="title">全国数据</div>
			<div class="maindata" style="height: 300px; width: 100%;">
				<div id="dataNational" style="width:100%;height: 100%;"></div>
			</div>
		</div>
		<div class="interval"></div>
		<div class="maincontent">
			<div class="filteritem">
				<div class="option">
					<span class="title">时间区间:</span>
					<el-date-picker v-model="MonthProvinceValue" type="month" size="mini" placeholder="选择月" :editable="editable" :clearable="clearable" :picker-options="pickerOptions2" value-format="yyyy-MM">
					</el-date-picker>
				</div>
				<el-button type="primary" size="mini" @click="MonthProvinceButClick">开始分析</el-button>
			</div>
			<div class="title">各省数据<span>中位价是中间区间的平均数(均省会城市)</span></div>
			<div class="maindata" style="height: 300px; width: 100%;">
				<div id="dataProvince" style="width:100%;height: 100%;"></div>
			</div>
		</div>
		<div class="interval"></div>
		<div class="maincontent">
			<div class="filteritem">
				<div class="option">
					<span class="title">时间区间:</span>
					<el-date-picker v-model="MonthTradeValue" type="month" size="mini" placeholder="选择月" :editable="editable" :clearable="clearable" :picker-options="pickerOptions3" value-format="yyyy-MM">
					</el-date-picker>
				</div>
				<el-button type="primary" size="mini" @click="MonthTransactionButClick">开始分析</el-button>
			</div>
			<div class="title">交易数据</div>
			<div class="maindata" style="height: 300px; width: 100%;">
				<div id="dataTrade" style="width:100%;height: 100%;"></div>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">
	var echarts = require('echarts');
	import $ from 'jquery';
	export default {
		name: 'my-overview-taobao-fixde',
		props: ["default-value"],
		data() {
			return {
				MonthTimeSelect0: '',
				MonthTimeSelect1:'',
				MonthProvinceValue:'',
				MonthTradeValue:'',
				editable: false,
				clearable: false,
				pickerOptions0: {
					disabledDate: (time) => {
	                    if (this.MonthTimeSelect1 != "") {
	                        return time.getTime() > Date.now() || time.getTime() > this.MonthTimeSelect1;
	                    } else {
	                        return time.getTime() > Date.now();
	                    }
	                }
	            },
	            pickerOptions1: {
	                disabledDate: (time) => {
	                    return time.getTime() < this.MonthTimeSelect0 || time.getTime() > Date.now();
	                }
	            },
	            pickerOptions2:{
	            	disabledDate(time) {
			            return time.getTime() < Date.parse("2013/01/01") || time.getTime() > Date.now()
			        }
	            },
	            pickerOptions3:{
	            	disabledDate(time) {
			            return time.getTime() < Date.parse("2013/01/01") || time.getTime() > Date.now()
			        }
	            }
			}
		},
		components: { // 注册组件
		},
		created: function() { // 生命周期组件创建
			
		},
		beforeUpdate:function(){ // 生命周期组件更新后
			console.log("Sdfsd")
		},
		filters:{ // 过滤器
		},
		methods:{ // 事件
			// 全国天数据
			DaySectionButClick:function(){
				if(datedifference(this.MonthTimeSelect0, this.MonthTimeSelect1) > 60){
					alert("选择的范围超过了60天,请重新选择")
					return false;
				}
				myChartdataNational.showLoading(); // 显示加载
				var MonthTimeSelect0 = fmtDate(this.MonthTimeSelect0);
				var MonthTimeSelect1 = fmtDate(this.MonthTimeSelect1);
				this.AjaxMacrographyDayTransactionData(MonthTimeSelect0, MonthTimeSelect1);
				
			},
			// 各省月数据
			MonthProvinceButClick:function(){
				myChartdataProvince.showLoading(); // 显示加载
				this.AjaxMacrographyMonthProvince(this.MonthProvinceValue);
			},
			// 各省月交易数据
			MonthTransactionButClick:function(){
				myChartDataTrade.showLoading(); // 显示加载
				this.AjaxMonthTransactionData(this.MonthTradeValue);
			},
			AjaxMonthTransactionData:function(timemonth){
//			var ajaxAddressRequest = "/api/taobaoDataRegionTrade" // 测试地址
//			var ajaxAddressRequest = ajaxAddress + "ajax/taobaoauction/estate/macrography_monthtransactiondata" // 服务器地址
				this.$axios.get(ajaxAddress + "ajax/taobaoauction/estate/macrography_monthtransactiondata", {
					params: {
						"timemonth":timemonth
					}
				}).then(res => { 
					var colors = ['#5793f3', '#d14a61', '#675bba'];
					var optionmyChartAreaChange = {
						tooltip: {
						        trigger: 'axis',
						        axisPointer: {
						            type: 'cross'
						        },
						        formatter:'{a0}: {c0} 次<br />{a1}: {c1} %<br />{a2}: {c2} %'
						},
						grid:{
		                    x:100,
		                    y:55,
		                    x2:150,
		                    y2:25
		                },
					    toolbox: {
					        show: false
					    },
					    legend: {
					        data:['竞拍次数','溢价率','成交率'],
					    },
					    xAxis: [
					        {
					            type: 'category',
					            axisTick: {
					                alignWithLabel: true
					            },
					            data: res.data.provincename
					        }
					    ],
					    yAxis: [
					        {
					            type: 'value',
					            name: '竞拍次数',
					            min: 0,
					            position: 'left',
					            axisLine: {
					                lineStyle: {
					                    color: colors[0]
					                }
					            },
					            axisLabel: {
					                formatter: '{value} 次'
					            }
					        },
					        {
					            type: 'value',
					            name: '溢价率',
					            min: 0,
					            position: 'right',
					            axisLine: {
					                lineStyle: {
					                    color: colors[1]
					                }
					            },
					            axisLabel: {
					                formatter: '{value} %'
					            }
					        },
					        {
					            type: 'value',
					            name: '成交率',
					            min: 0,
					            position: 'right',
					            offset: 60,
					            axisLine: {
					                lineStyle: {
					                    color: colors[2]
					                }
					            },
					            axisLabel: {
					                formatter: '{value} %'
					            }
					        }
					    ],
					    series: [{
				            name:'竞拍次数',
				            type:'bar',
				            data:res.data.BiddingPriceNumber,
				            itemStyle: {
								color:colors[0]
				            },
				        },
				        {
				            name:'溢价率',
				            type:'line',
				            yAxisIndex: 1,
				            data:res.data.PremiumRate,
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
				            name:'成交率',
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
				            data:res.data.TurnoverRate
				        }]
					};
					myChartDataTrade.setOption(optionmyChartAreaChange);
					myChartDataTrade.hideLoading(); // 隐藏加载
				}).catch(function(error) {
					console.log("error init." + error)
				})
			},
			AjaxMacrographyDayTransactionData:function(timezero, timeend){
	//			var ajaxAddressRequest = "/api/taobaodataregionnational" // 测试地址
	//			var ajaxAddressRequest = ajaxAddress + "ajax/taobaoauction/estate/macrography_daytransactiondata" // 服务器地址
				this.$axios.get(ajaxAddress + "ajax/taobaoauction/estate/macrography_daytransactiondata", {
					params: {
						"timezero": timezero,
						"timeend": timeend
					}
				})
				.then(res => {
					// 全数据展示			
					var colors = ['#5793f3', '#d14a61', '#675bba'];
					var optionNational = {
						    color: colors,
						    tooltip: {
						        trigger: 'axis',
						        axisPointer: {
						            type: 'cross'
						        },
						        formatter:'{a0}: {c0} 个<br />{a1}: {c1} m²<br />{a2}: {c2} 百万'
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
						        data:['总销售数量','总销售面积','总成交额'],
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
						            name: '总销售数量',
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
						            name: '总销售面积',
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
						            name: '总成交额',
						            min: 0,
						            position: 'right',
						            axisLine: {
						                lineStyle: {
						                    color: colors[2]
						                }
						            },
						            axisLabel: {
						                formatter: '{value} 百万'
						            }
						        }
						    ],
						    series: [
						        {
						            name:'总销售数量',
						            type:'bar',
						            data:res.data.quantitynationwide
						        },
						        {
						            name:'总销售面积',
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
						            name:'总成交额',
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
			AjaxMacrographyMonthProvince:function(timemonth){
	//			var ajaxAddressRequest = "/api/taobaoDataRegionProvince" // 测试地址
	//			var ajaxAddressRequest = ajaxAddress + "ajax/taobaoauction/estate/macrography_monthprovince" // 服务器地址
				this.$axios.get(ajaxAddress + "ajax/taobaoauction/estate/macrography_monthprovince", {
					params: {
						"timemonth":timemonth
					}
				})
				.then(res => {			
					var colors = ['#5793f3', '#d14a61', '#675bba', '#57eaf3'];
					var optionProvince = {
						    color: colors,
						    tooltip: {
						        trigger: 'axis',
						        axisPointer: {
						            type: 'cross'
						        },
						        formatter:'{a0}: {c0} 个<br />{a1}: {c1} m²<br />{a2}: {c2} 万元<br />{a3}: {c3} 元/m²'
						    },
						    grid:{
			                    x:180,
			                    y:55,
			                    x2:180,
			                    y2:25
			                },
						    toolbox: {
						        show: false
						    },
						    legend: {
						        data:['成交数量','成交面积','成交额', '中位数'],
						    },
						    xAxis: [
						        {
						            type: 'category',
						            axisTick: {
						                alignWithLabel: true
						            },
						            data: res.data.provincename
						        }
						    ],
						    yAxis: [
						        {
						            type: 'value',
						            name: '成交数量',
						            min: 0,
						            offset: 110,
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
						            name: '成交面积',
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
						            name: '成交额',
						            min: 0,
						            position: 'right',
						            axisLine: {
						                lineStyle: {
						                    color: colors[2]
						                }
						            },
						            axisLabel: {
						                formatter: '{value} 万元'
						            }
						        },
						        {
						            type: 'value',
						            name: '中位数',
						            min: 0,
						            position: 'left',
						            axisLine: {
						                lineStyle: {
						                    color: colors[3]
						                }
						            },
						            axisLabel: {
						                formatter: '{value} 元/m²'
						            }
						        }
						    ],
						    series: [
						        {
						            name:'成交数量',
						            type:'bar',
						            data:res.data.pawnnumber
						        },
						        {
						            name:'成交面积',
						            type:'line',
						            yAxisIndex: 1,
						            data:res.data.pawnarea,
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
						            name:'成交额',
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
						            data:res.data.pawnprice
						        },
						        {
						            name:'中位数',
						            type:'line',
						            yAxisIndex: 3,
						            lineStyle: {
							            normal: {
							                color: 'rgb(87, 234, 243)',
							                width: 1
							            }
							        },
						            itemStyle: {
						                color: 'rgb(87, 234, 243)'
						            },
						            data:res.data.pawnmedian
						        }
						    ]
						};
					// 使用刚指定的配置项和数据显示图表。
					myChartdataProvince.setOption(optionProvince);
					myChartdataProvince.hideLoading(); // 隐藏加载
				}).catch(function(error) {
					console.log("error init." + error)
				})
			}
		},
		mounted: function() { // 加载完成
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
			this.MonthTimeSelect0 = currentYear.toString() + "-" + currentMonth.toString() + "-" + "01";
			this.MonthTimeSelect1 = currentYear.toString() + "-" + currentMonth.toString() + "-" + currentDate.toString();
			this.MonthProvinceValue = currentYear.toString() + "-" + currentMonth.toString();
			this.MonthTradeValue = currentYear.toString() + "-" + currentMonth.toString();
			
			//  年度数据
		    var myChartdataYear = echarts.init(document.getElementById('dataYear'));
//			var ajaxAddressRequest = "/api/taobaodataregionyear" // 测试地址
//			var ajaxAddressRequest = ajaxAddress + "ajax/taobaoauction/estate/macrography_yeartotal" // 服务器地址
			this.$axios.get(ajaxAddress + "ajax/taobaoauction/estate/macrography_yeartotal",{params: {}})
			.then(res => {
				var optionYear = {
				    tooltip: {
					        trigger: 'axis',
					        axisPointer: {
					            type: 'cross'
					        },
					        formatter:'{a0}: {c0} 个<br />{a1}: {c1} 亿'
					    },
				    grid:{
	                    x:100,
	                    y:55,
	                    x2:100,
	                    y2:25
	                },
				    toolbox: {
				        show: false
				    },
				    legend: {
				        data:['成交数量','成交额']
				    },
				    xAxis: [
				        {
				            type: 'category',
				            data: res.data.yearTime,
				            axisTick: {
				                alignWithLabel: true
				            }
				        }
				    ],
				    yAxis: [
				        {
				            type: 'value',
				            name: '成交数量',
				            min: 0,
				            axisLine: {
				                lineStyle: {
				                    color: '#5793f3'
				                }
				            },
				            axisLabel: {
				                formatter: '{value} 个'
				            }
				        },
				        {
				            type: 'value',
				            name: '成交额',
				            min: 0,
				            axisLine: {
				                lineStyle: {
				                    color: '#d14a61'
				                }
				            },
				            axisLabel: {
				                formatter: '{value} 亿'
				            }
				        }
				    ],
				    series: [
				        {
				            name:'成交数量',
				            type:'bar',
				            itemStyle: {
								color:'#5793f3'
				            },
				            data:res.data.CollateralNumber
				        },
				        {
				            name:'成交额',
				            type:'line',
				            yAxisIndex: 1,
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
				            },
				            data:res.data.Turnover
				        }
				    ]
				};
				// 使用刚指定的配置项和数据显示图表。
				myChartdataYear.setOption(optionYear);
			}).catch(function(error) {
				console.log("error init." + error)
			})
			
			// 全国数据
			window.myChartdataNational = echarts.init(document.getElementById('dataNational'));
			// 全国时间数据
			this.AjaxMacrographyDayTransactionData();

			
			// 各个省的数据
			window.myChartdataProvince = echarts.init(document.getElementById('dataProvince'));
			this.AjaxMacrographyMonthProvince();

			
			
			// 交易情况
			window.myChartDataTrade = echarts.init(document.getElementById('dataTrade'));
			this.AjaxMonthTransactionData();
		
			window.onresize = function(){
				myChartdataYear.resize();
			    myChartdataNational.resize();
			    myChartdataProvince.resize();
			    myChartDataTrade.resize();
			}
		}
	}

// 计算2个日期的时间差
function datedifference(sDate1, sDate2) {    //sDate1和sDate2是2006-12-18格式  
    var dateSpan,
        tempDate,
        iDays;
    sDate1 = Date.parse(sDate1);
    sDate2 = Date.parse(sDate2);
    dateSpan = sDate2 - sDate1;
    dateSpan = Math.abs(dateSpan);
    iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
    return iDays
};
// 时间格式修改
function fmtDate(obj){
    var date =  new Date(obj);
    var y = 1900+date.getYear();
    var m = "0"+(date.getMonth()+1);
    var d = "0"+date.getDate();
    return y+"-"+m.substring(m.length-2,m.length)+"-"+d.substring(d.length-2,d.length);
}
</script>

<style scoped lang="scss">
	.my-overview-taobao-fixde {
		.filteritem{
			margin: 10px 0px 25px 0px;
			.option{
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
		}
		.maincontent {
			width: 100%;
			box-sizing: border-box;
			padding: 20px 40px;
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
</style>