<template>
	<div class="my-overview-taobao-fixde">
		<div class="title">极值维度<i class="el-icon-question" title="根据所选时间范围,显示各维度的最大最小值!"></i>
			<div class="filteritem">
				<div class="option">
					<span class="title">选择年:<i class="el-icon-question" title="最多选择一年"></i></span>
					<el-date-picker v-model="YearValue" type="year" value-format="yyyy" placeholder="选择年" size="mini" :editable="editable" :clearable="clearable" :picker-options="pickerOptions"></el-date-picker>
				</div>
				<div class="option">
					<span class="title">选择月:<i class="el-icon-question" title="最多选择一月"></i></span>
					<el-select v-model="MonthValue" filterable placeholder="选择月" size="mini" >
					    <el-option v-for="item in optionsMonth" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				
				<el-button type="primary" size="mini" @click="ExtremumAnalysisClick">开始分析</el-button>
			</div>
		</div>
		<div class="interval"></div>
		<div class="maincontent">
			<div class="title">拍卖数量TOP</div>
			<div class="maindata" style="height: 300px; width: 100%;">
				<div id="dataAuctionNumberTOP" style="width:100%;height: 100%;"></div>
			</div>
		</div>
		<div class="interval"></div>
		<div class="maincontent">
			<div class="title">拍卖面积TOP</div>
			<div class="maindata" style="height: 300px; width: 100%;">
				<div id="dataAuctionAreaTOP" style="width:100%;height: 100%;"></div>
			</div>
		</div>
		<div class="interval"></div>
		<div class="maincontent">
			<div class="title">成交额TOP</div>
			<div class="maindata" style="height: 300px; width: 100%;">
				<div id="dataTurnoverTOP" style="width:100%;height: 100%;"></div>
			</div>
		</div>
		<div class="interval"></div>
		<div class="maincontent">
			<div class="title">价格中位数TOP<span>中位价是中间区间的平均数(均省会城市)</span></div>
			<div class="maindata" style="height: 300px; width: 100%;">
				<div id="dataMedianTOP" style="width:100%;height: 100%;"></div>
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
				YearValue: '',
				MonthValue:'',
				editable: false,
				clearable: false,
				optionsMonth:[
					{
			        	value: '',
			        	label: '全年'
			        },{
			        	value: '01',
			        	label: '1月'
			        },{
			        	value: '02',
			        	label: '2月'
			        },{
			        	value: '03',
			        	label: '3月'
			        },{
			        	value: '04',
			        	label: '4月'
			        },{
			        	value: '05',
			        	label: '5月'
			        },{
			        	value: '06',
			        	label: '6月'
			        },{
			        	value: '07',
			        	label: '7月'
			        },{
			        	value: '08',
			        	label: '8月'
			        },{
			        	value: '09',
			        	label: '9月'
			        },{
			        	value: '10',
			        	label: '10月'
			        },{
			        	value: '11',
			        	label: '11月'
			        },{
			        	value: '12',
			        	label: '12月'
			        }
				],
	            pickerOptions:{
	            	disabledDate:(time)=> {
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
			ExtremumAnalysisClick:function(){
				myChartdataAuctionNumberTOP.showLoading(); // 销售数量排名显示加载
				this.AjaxChartdataAuctionNumberTOP(this.YearValue, this.MonthValue)
				myChartdataAuctionAreaTOP.showLoading(); // 销售面积排名显示加载
				this.AjaxChartdataAuctionAreaTOP(this.YearValue, this.MonthValue)
				myChartdataTurnoverTOP.showLoading(); // 成交额排名显示加载
				this.AjaxChartdataTurnoverTOP(this.YearValue, this.MonthValue)
				myChartdataMedianTOP.showLoading(); // 价格中位数排名
				this.AjaxChartdataMedianTOP(this.YearValue, this.MonthValue)
			},
			AjaxChartdataAuctionNumberTOP:function(TimeYear, TimeMonth){//  销售数量排名
//			var ajaxAddressRequest = "/api/taobaoDataRegionAuctionNumberTOP" // 测试地址
//			var ajaxAddressRequest = ajaxAddress + "ajax/taobaoauction/estate/extremum_number" // 服务器地址
				this.$axios.get(ajaxAddress + "ajax/taobaoauction/estate/extremum_number",{params: {
					"TimeYear": TimeYear,
					"TimeMonth": TimeMonth
				}})
				.then(res => {
					var optionAuctionNumberTOP = {
					    tooltip: {
					        trigger: 'axis',
					        axisPointer: {
					            type: 'cross'
					        },
					        formatter:'{a0}: {c0} 个'
					    },
					    grid:{
		                    x:100,
		                    y:55,
		                    x2:25,
		                    y2:25
		                },
					    toolbox: {
					        show: false
					    },
					    legend: {
					        data:['拍卖数量']
					    },
					    xAxis: [
					        {
					            type: 'category',
					            data: res.data.AdministrativeDivision,
					            axisTick: {
					                alignWithLabel: true
					            }
					        }
					    ],
					    yAxis: [
					        {
					            type: 'value',
					            name: '拍卖数量',
					            min: 0,
					            axisLabel: {
					                formatter: '{value} 个'
					            }
					        }
					    ],
					    series: [
					        {
					            name:'拍卖数量',
					            type:'bar',
					            itemStyle: {
									color:'#5793f3'
					            },
					            data:res.data.CollateralNumber
					        }
					    ]
					};
					// 使用刚指定的配置项和数据显示图表。
					myChartdataAuctionNumberTOP.setOption(optionAuctionNumberTOP);
					myChartdataAuctionNumberTOP.hideLoading(); // 隐藏加载
				}).catch(function(error) {
					console.log("error init." + error)
				})
			},
			AjaxChartdataAuctionAreaTOP: function(TimeYear, TimeMonth){ //  销售面积排名
//			var ajaxAddressRequest = "/api/taobaoDataRegionAuctionAreaTOP" // 测试地址
//			var ajaxAddressRequest = ajaxAddress + "ajax/taobaoauction/estate/extremum_area" // 服务器地址
			this.$axios.get(ajaxAddress + "ajax/taobaoauction/estate/extremum_area", {
				params: {
					"TimeYear": TimeYear,
					"TimeMonth": TimeMonth
				}
			})
			.then(res => {
				var optionAuctionAreaTOP = {
				    tooltip: {
				        trigger: 'axis',
				        axisPointer: {
				            type: 'cross'
				        },
				        formatter:'{a0}: {c0} m²'
				    },
				    grid:{
	                    x:100,
	                    y:55,
	                    x2:25,
	                    y2:25
	                },
				    toolbox: {
				        show: false
				    },
				    legend: {
				        data:['拍卖面积']
				    },
				    xAxis: [
				        {
				            type: 'category',
				            data: res.data.AdministrativeDivision,
				            axisTick: {
				                alignWithLabel: true
				            }
				        }
				    ],
				    yAxis: [
				        {
				            type: 'value',
				            name: '拍卖面积',
				            min: 0,
				            axisLabel: {
				                formatter: '{value} m²'
				            }
				        }
				    ],
				    series: [
				        {
				            name:'拍卖面积',
				            type:'bar',
				            itemStyle: {
								color:'#5793f3'
				            },
				            data:res.data.CollateralArea
				        }
				    ]
				};
				// 使用刚指定的配置项和数据显示图表。
				myChartdataAuctionAreaTOP.setOption(optionAuctionAreaTOP);
				myChartdataAuctionAreaTOP.hideLoading(); // 隐藏加载
			}).catch(function(error) {
				console.log("error init." + error)
			})
			},
			AjaxChartdataTurnoverTOP:function(TimeYear, TimeMonth){ // 成交额排名
//			var ajaxAddressRequest = "/api/taobaoDataRegionAuctionTurnoverTOP" // 测试地址
//			var ajaxAddressRequest = ajaxAddress + "ajax/taobaoauction/estate/extremum_turnover" // 服务器地址
				this.$axios.get(ajaxAddress + "ajax/taobaoauction/estate/extremum_turnover", {
					params: {
						"TimeYear": TimeYear,
						"TimeMonth": TimeMonth
					}
				})
				.then(res => {
					// 把销售价格转换成万元
					var optionTurnoverTOP = {
						    tooltip: {
						        trigger: 'axis',
						        axisPointer: {
						            type: 'cross'
						        },
						        formatter:'{a0}: {c0} 万'
						    },
						    grid:{
			                    x:75,
			                    y:55,
			                    x2:25,
			                    y2:25
			                },
						    toolbox: {
						        show: false
						    },
						    legend: {
						        data:['成交额']
						    },
						    xAxis: [
						        {
						            type: 'category',
						            data: res.data.AdministrativeDivision,
						            axisTick: {
						                alignWithLabel: true
						            }
						        }
						    ],
						    yAxis: [
						        {
						            type: 'value',
						            name: '成交额',
						            min: 0,
						            axisLabel: {
						                formatter: '{value} 万'
						            }
						        }
						    ],
						    series: [
						        {
						            name:'成交额',
						            type:'bar',
						            itemStyle: {
										color:'#5793f3'
						            },
						            data:res.data.Turnover
						        }
						    ]
						};
					// 使用刚指定的配置项和数据显示图表。
					myChartdataTurnoverTOP.setOption(optionTurnoverTOP);
					myChartdataTurnoverTOP.hideLoading(); // 隐藏加载
				}).catch(function(error) {
					console.log("error init." + error)
				})
			},
			AjaxChartdataMedianTOP:function(TimeYear, TimeMonth){ // 价格中位数排名
//			var ajaxAddressRequest = "/api/taobaoDataRegionAuctionMedianTOP" // 测试地址
//			var ajaxAddressRequest = ajaxAddress + "ajax/taobaoauction/estate/extremum_medianprice" // 服务器地址
				this.$axios.get(ajaxAddress + "ajax/taobaoauction/estate/extremum_medianprice", {
					params: {
						"TimeYear": TimeYear,
						"TimeMonth": TimeMonth
					}
				})
				.then(res => {
					var optionMedianTOP = {
						    tooltip: {
						        trigger: 'axis',
						        axisPointer: {
						            type: 'cross'
						        },
						        formatter:'{a0}: {c0} 元/m²'
						    },
						    grid:{
			                    x:100,
			                    y:55,
			                    x2:25,
			                    y2:25
			                },
						    toolbox: {
						        show: false
						    },
						    legend: {
						        data:['中位数']
						    },
						    xAxis: [
						        {
						            type: 'category',
						            data: res.data.AdministrativeDivision,
						            axisTick: {
						                alignWithLabel: true
						            }
						        }
						    ],
						    yAxis: [
						        {
						            type: 'value',
						            name: '中位数',
						            min: 0,
						            axisLabel: {
						                formatter: '{value} 元/m²'
						            }
						        }
						    ],
						    series: [
						        {
						            name:'中位数',
						            type:'bar',
						            itemStyle: {
										color:'#5793f3'
						            },
						            data:res.data.Median
						        }
						    ]
						};
					// 使用刚指定的配置项和数据显示图表。
					myChartdataMedianTOP.setOption(optionMedianTOP);
					myChartdataMedianTOP.hideLoading(); // 隐藏加载
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
			this.YearValue = currentYear.toString();
			this.MonthValue = ""
			
			//  销售数量排名
			window.myChartdataAuctionNumberTOP = echarts.init(document.getElementById('dataAuctionNumberTOP'));
			myChartdataAuctionNumberTOP.showLoading();
			this.AjaxChartdataAuctionNumberTOP();

			//  销售面积排名
			window.myChartdataAuctionAreaTOP = echarts.init(document.getElementById('dataAuctionAreaTOP'));
			myChartdataAuctionAreaTOP.showLoading();
			this.AjaxChartdataAuctionAreaTOP();

			// 成交额排名
			window.myChartdataTurnoverTOP = echarts.init(document.getElementById('dataTurnoverTOP'));
			myChartdataTurnoverTOP.showLoading();
			this.AjaxChartdataTurnoverTOP();
			
			// 价格中位数排名
			window.myChartdataMedianTOP = echarts.init(document.getElementById('dataMedianTOP'));
			myChartdataMedianTOP.showLoading();
			this.AjaxChartdataMedianTOP()
			
			window.onresize = function(){
				myChartdataAuctionNumberTOP.resize();
			    myChartdataAuctionAreaTOP.resize();
			    myChartdataTurnoverTOP.resize();
			    myChartdataMedianTOP.resize();
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