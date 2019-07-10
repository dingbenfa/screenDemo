$(function() {
    var app = {
        data: {
            regionName: '苏州相城区',
            enterpriseName: '大大铜业有限公司',
            rating: '90',
            refreshDate: '2019-07-03',
            mapChartData: {
                locationName: '苏州市-滨湖区-滨湖路49号',
                bankName: '银行预留文本',
                tagName: '金属加工',
                areaLocations: [{
                        "lng": 120.30,
                        "lat": 31.57
                    }, {
                        "lng": 120.33,
                        "lat": 31.59
                    },
                    {
                        "lng": 120.32,
                        "lat": 31.61
                    }
                ]
            },
            lineChartData: {
                legendData: ['铣床', '冷轧机-01', '冷轧机-02', '电表'],
                xAxisData: ['2019-06-15', '2019-06-16', '2019-06-17', '2019-06-18', '2019-06-19', '2019-06-20', '2019-06-21'],
                seriesData: [{
                        name: '铣床',
                        type: 'line',
                        stack: '总量',
                        yAxisIndex: 1,
                        data: [12, 13, 10, 13, 9, 23, 21]
                    },
                    {
                        name: '冷轧机-01',
                        type: 'line',
                        stack: '总量',
                        yAxisIndex: 1,
                        data: [22, 18, 19, 23, 29, 33, 31]
                    },
                    {
                        name: '冷轧机-02',
                        type: 'line',
                        stack: '总量',
                        yAxisIndex: 1,
                        data: [15, 23, 20, 15, 19, 33, 41]
                    },
                    {
                        name: '电表',
                        type: 'line',
                        stack: '总量',
                        data: [150, 432, 201, 154, 190, 430, 510]
                    }
                ]
            },
            barLChartData: {},
            barRChartData: {
                totalPower: 54800,
                yAxisData: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'],
                seriesFixedObj: {
                    type: "bar",
                    barWidth: 12,
                    xAxisIndex: 0,
                    barGap: "-100%",
                    data: [24, 24, 24, 24, 24, 24, 24, 24, 24, 24],
                    itemStyle: {
                        normal: {
                            color: "#fff",
                            borderColor: '#fff',
                            borderWidth: 2,
                            barBorderRadius: 12
                        }
                    },
                    zlevel: -1
                },
                seriesData: [{
                        type: "bar",
                        barWidth: 12,
                        xAxisIndex: 0,
                        barGap: "-100%",
                        data: [24, 24, 24, 24, 24, 24, 24, 24, 24, 24],
                        itemStyle: {
                            normal: {
                                color: "#fff",
                                borderColor: '#fff',
                                borderWidth: 2,
                                barBorderRadius: 12
                            }
                        },
                        zlevel: -1
                    },
                    {
                        name: '',
                        type: 'bar',
                        barWidth: 12,
                        itemStyle: {
                            normal: {
                                color: '#004f9c',
                                barBorderRadius: 12
                            }
                        },
                        data: [5, 6, 10, 12, 5, 19, 13, 10, 3, 6]
                    }
                ]
            }
        },
        init: function() {
            //地图图表初始化 ----大屏区位要素模块
            this.mapChartInit('chart-map-box');

            // 第二区域 ----生产状况
            this.lineChartInit('chart-line-box');

            // 第三区域 ----设备运行模块
            this.barLChartInit('chart-barL-box');

            // 第四区域 ----企业用电
            this.barRChartInit('chart-barR-box');
        },
        getMapChartData: function() { //获取地图图表数据 ----大屏区位要素模块
            var _this = this;

            httpRequest('get', baseUrl + 'api', { 'enterprise': 1 }, true, 1, 1, null, function(data) {
                var reData = data.object;

                _this.data.enterpriseName = reData.enterpriseName || '';
                _this.data.rating = reData.rating || '';
                _this.data.refreshDate = reData.refreshDate || '';

                _this.data.mapChartData.bankName = reData.bankName || '';
                _this.data.mapChartData.tagName = reData.tagName || '';
                _this.data.mapChartData.areaLocations = reData.areaLocations || [];

                _this.mapChartInit('chart-map-box');
            }, function(msg, code) {
                alert(msg);
            });
        },
        getLineChartData: function() { //获取第二区域图表数据 ----生产状况
            var _this = this;

            httpRequest('get', baseUrl + 'api', { 'enterprise': 1 }, true, 1, 1, null, function(data) {
                var reData = data.rows || [];

                _this.handleLineChartData(reData);
                _this.lineChartInit('chart-line-box');
            }, function(msg, code) {
                alert(msg);
            });
        },
        getBarLChartData: function() { //获取第三区域图表数据 ----设备运行模块
            var _this = this;

            httpRequest('get', baseUrl + 'api', { 'enterprise': 1 }, true, 1, 1, null, function(data) {
                var reData = data.rows || [];


                _this.barLChartInit('chart-barL-box');
            }, function(msg, code) {
                alert(msg);
            });
        },
        getBarRChartData: function() { //获取第四区域图表数据 ----企业用电
            var _this = this;

            httpRequest('get', baseUrl + 'api', { 'enterprise': 1 }, true, 1, 1, null, function(data) {
                var reData = data.object || {};
                var reArr = reData.days || [];

                var yAxisArr = [],
                    seriesArr = [_this.data.barRChartData.seriesFixedObj];
                for (var i = 0; i < reArr.length; i++) {
                    legendArr.push(reArr[i].day);
                    seriesArr.push(reArr[i].value);
                }

                _this.data.barRChartData.totalPower = reData.total;
                _this.data.barRChartData.yAxisData = yAxisArr;
                _this.data.barRChartData.seriesData = seriesArr;

                _this.barRChartInit('chart-barR-box');
            }, function(msg, code) {
                alert(msg);
            });
        },
        handleLineChartData: function(reArr) { //生产状况 -- 回调数据格式处理
            var legendArr = [],
                xAxisArr = [],
                seriesArr = [];
            for (var i = 0; i < reArr.length; i++) {
                if ($.inArray(reArr[i].name, legendArr) < 0) {
                    legendArr.push(reArr[i].name);
                }

                var itemObj = {
                    name: reArr[i].name,
                    type: 'line',
                    yAxisIndex: reArr[i].ismeter ? 0 : 1, //ismeter 标志该设备是否为电表， 如果电表则使用电量Y轴（千瓦时）。非电表设备使用时间Y轴，运行时间（小时）
                    stack: '总量',
                    data: []
                };
                var itemArr = reArr[i].data || [];
                for (var j = 0; j < itemArr.length; j++) {
                    if ($.inArray(itemArr[j].date, xAxisArr) < 0) {
                        xAxisArr.push(itemArr[j].date);
                    }

                    itemObj.data.push(itemArr[j].value);
                }
                seriesArr.push(itemObj);
            }

            this.data.lineChartData.legendData = legendArr;

            xAxisArr.sort(function(a, b) {
                return a < b ? -1 : 1;
            });
            this.data.lineChartData.xAxisData = xAxisArr;
            this.data.lineChartData.seriesData = seriesArr;
        },
        mapChartInit: function(id) {
            // 基于准备好的dom，初始化echarts实例
            var mapChart = echarts.init(document.getElementById(id));
            var mapOption = {
                // 加载 bmap 组件
                bmap: {
                    // 百度地图中心经纬度
                    center: [120.30, 31.57],
                    // 百度地图缩放
                    zoom: 12,
                    // 是否开启拖拽缩放，可以只设置 'scale' 或者 'move'
                    roam: false,
                    // 百度地图的自定义样式，见 http://developer.baidu.com/map/jsdevelop-11.htm
                    mapStyle: {}
                }
            };

            // 使用刚指定的配置项和数据显示图表。
            mapChart.setOption(mapOption);

            this.handleMapChartOpt(mapChart); //百度地图操作

            //中心数据显示
            $("#chart-title").html(this.data.regionName + '<br>' + this.data.enterpriseName); //中心区域标题
            $("#chart-score").text(this.data.rating); //企业评分
            $("#chart-uptate-time").text(this.data.refreshDate); //更新时间
        },
        handleMapChartOpt: function(chart) {
            // 获取百度地图实例，使用百度地图
            var bmap = chart.getModel().getComponent('bmap').getBMap();
            var mapIcon = new BMap.Icon("../screenDemo/images/map-sgin.png", new BMap.Size(32, 32), {
                // 指定定位位置。   
                // 当标注显示在地图上时，其所指向的地理位置距离图标左上    
                // 角各偏移10像素和25像素。您可以看到在本例中该位置即是   
                // 图标中央下端的尖角位置。    
                anchor: new BMap.Size(10, 25),
                // 设置图片偏移。   
                // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您   
                // 需要指定大图的偏移位置，此做法与css sprites技术类似。    
                // imageOffset: new BMap.Size(0, 0) // 设置图片偏移   
            });

            bmap.centerAndZoom(point, 12);

            var areaLocations = this.data.mapChartData.areaLocations || [];
            for (var i = 0; i < areaLocations.length; i++) {
                var point = new BMap.Point(areaLocations[i].lng, areaLocations[i].lat);
                var marker = new BMap.Marker(point, { icon: mapIcon }); // 创建标注  
                bmap.addOverlay(marker); // 将标注添加到地图中
            }
        },
        lineChartInit: function(id) { // 第二区域 ----生产状况 
            var lineChart = echarts.init(document.getElementById(id));
            var lineOption = {
                title: {
                    text: '',
                    textStyle: {
                        color: '#fff',
                        fontSize: 18
                    },
                    subtext: '更新时间：' + this.data.refreshDate,
                    subtextStyle: {
                        color: '#fff',
                        fontSize: 12
                    },
                    top: '6.5%',
                    left: 'middle'
                },
                legend: {
                    icon: 'roundRect',
                    orient: 'vertical',
                    data: this.data.lineChartData.legendData,
                    top: '13%',
                    left: '6%',
                    textStyle: {
                        color: '#fff',
                        lineHeight: 16,
                    }
                },
                grid: {
                    left: '25%',
                    right: '6%',
                    bottom: '5%',
                    containLabel: true
                },
                color: ['#c1272d', '#e69013', '#8cc63f', '#004f9c'],
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.data.lineChartData.xAxisData,
                    axisLine: {
                        lineStyle: {
                            type: 'solid',
                            color: '#fff'
                        }
                    }
                },
                yAxis: [{
                        type: 'value',
                        scale: true,
                        name: '千瓦时',
                        axisLine: {
                            lineStyle: {
                                type: 'solid',
                                color: '#fff'
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                type: 'dashed'
                            }
                        }
                    },
                    {
                        type: 'value',
                        scale: true,
                        name: '小时',
                        axisLine: {
                            lineStyle: {
                                type: 'solid',
                                color: '#fff'
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                type: 'dashed'
                            }
                        }
                    }
                ],
                series: this.data.lineChartData.seriesData,
                textStyle: {
                    color: '#fff'
                }
            };
            lineChart.setOption(lineOption);
        },
        barLChartInit: function(id) { // 第三区域 ----设备运行模块
            var barLChart = echarts.init(document.getElementById(id));
            var barLOption = option = {
                title: {
                    text: '铣床',
                    textStyle: {
                        color: '#e69013',
                        fontSize: 15
                    },
                    textAlign: 'middle',
                    subtext: '冷轧机-01\n冷轧机-02',
                    subtextStyle: {
                        color: '#999999',
                        fontSize: 17,
                        lineHeight: 24
                    },
                    bottom: '38%',
                    right: '-1%'
                },
                legend: {
                    icon: 'roundRect',
                    orient: 'vertical',
                    data: ['运行中', '未运行'],
                    bottom: '8%',
                    right: '6%',
                    textStyle: {
                        color: '#fff',
                        lineHeight: 16,
                    }
                },
                grid: {
                    left: '1%',
                    right: '25%',
                    bottom: '6%',
                    containLabel: true
                },
                xAxis: [{
                    type: 'value',
                    position: 'top',
                    axisLine: {
                        lineStyle: {
                            type: 'solid',
                            color: '#fff'
                        }
                    },
                    min: 0,
                    max: 24
                }, {
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            type: 'solid',
                            color: '#fff'
                        }
                    }
                }],
                yAxis: {
                    type: 'category',
                    axisLine: {
                        lineStyle: {
                            type: 'solid',
                            color: '#fff'
                        }
                    },
                    data: ['7-01', '7-02', '7-03', '7-04', '7-05', '7-06', '7-07', '7-08', '7-09', '7-10']
                },
                series: [{
                        name: '运行中',
                        type: 'bar',
                        barWidth: 12,
                        stack: '总量',
                        itemStyle: {
                            normal: {
                                color: '#e69013',
                                barBorderRadius: 12
                            }
                        },
                        data: [3, 3, 5, 2, 5, 2, 6, 4, 3, 4]
                    },
                    {
                        name: '未运行',
                        type: 'bar',
                        barWidth: 12,
                        stack: '总量',
                        itemStyle: {
                            normal: {
                                show: true,
                                color: '#fff',
                                barBorderRadius: 12,
                                borderWidth: 0,

                            }
                        },
                        data: [6, 4, 2, 3, 2, 3, 3, 2, 7, 3]
                    },
                    {
                        name: '运行中',
                        type: 'bar',
                        barWidth: 12,
                        stack: '总量',
                        itemStyle: {
                            normal: {
                                color: '#e69013',
                                barBorderRadius: 12
                            }
                        },
                        data: [2, 1, 1, 0, 2, 3, 1, 2, 3, 2]
                    },
                    {
                        name: '未运行',
                        type: 'bar',
                        barWidth: 12,
                        stack: '总量',
                        itemStyle: {
                            normal: {
                                show: true,
                                color: '#fff',
                                barBorderRadius: 12,
                                borderWidth: 0,

                            }
                        },
                        data: [2, 3, 3, 4, 2, 5, 4, 1, 7, 3]
                    },
                    {
                        type: "bar",
                        barWidth: 12,
                        xAxisIndex: 0,
                        barGap: "-100%",
                        data: [24, 24, 24, 24, 24, 24, 24, 24, 24, 24],
                        itemStyle: {
                            normal: {
                                color: "#fff",
                                borderColor: '#fff',
                                borderWidth: 2,
                                barBorderRadius: 12
                            }
                        },
                        zlevel: -1
                    }
                ]
            };
            barLChart.setOption(barLOption);
        },
        barRChartInit: function(id) { // 第四区域 ----企业用电
            var barRChart = echarts.init(document.getElementById(id));
            var barROption = option = {
                title: {
                    text: '当月耗能：',
                    textStyle: {
                        color: '#fff',
                        fontSize: 15
                    },
                    textAlign: 'left',
                    subtext: this.data.barRChartData.totalPower + '千瓦时',
                    subtextStyle: {
                        color: '#fff',
                        fontSize: 15
                    },
                    bottom: '18%',
                    left: '4%'
                },
                grid: {
                    right: '3%',
                    left: '25%',
                    bottom: '6%',
                    containLabel: true
                },
                xAxis: [{
                    type: 'value',
                    position: 'top',
                    axisLine: {
                        lineStyle: {
                            type: 'solid',
                            color: '#fff'
                        }
                    },
                    min: 0,
                    max: 24
                }, {
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            type: 'solid',
                            color: '#fff'
                        }
                    }
                }],
                yAxis: {
                    type: 'category',
                    axisLine: {
                        lineStyle: {
                            type: 'solid',
                            color: '#fff'
                        }
                    },
                    data: this.data.barRChartData.yAxisData
                },
                series: this.data.barRChartData.seriesData
            };
            barRChart.setOption(barROption);
        }
    };

    app.init();
});