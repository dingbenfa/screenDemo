$(function() {
    var app = {
        refreshTime: 3600000, //所有api刷新时长 -- 1h
        data: {
            regionName: '苏州相城区',
            enterpriseName: '',
            rating: '',
            refreshDate: '',
            mapChartData: {
                locationName: '苏州市-滨湖区-滨湖路49号',
                bankName: '',
                tagName: '',
                areaLocations: []
            },
            lineChartData: {
                legendData: [],
                xAxisData: [],
                seriesData: []
            },
            barLChartData: {
                titleData: [],
                yAxisData: [],
                seriesData: []
            },
            barRChartData: {
                maxValue: 0,
                totalPower: 0,
                yAxisData: [],
                seriesData: []
            }
        },
        init: function() {
            //地图图表初始化 ----大屏区位要素模块
            // this.mapChartInit('chart-map-box');
            this.getMapChartData();

            // 第二区域 ----生产状况
            // this.lineChartInit('chart-line-box');
            this.getLineChartData();

            // 第三区域 ----设备运行模块
            // this.barLChartInit('chart-barL-box');
            this.getBarLChartData();

            // 第四区域 ----企业用电
            // this.barRChartInit('chart-barR-box');
            this.getBarRChartData();
        },
        getMapChartData: function() { //获取地图图表数据 ----大屏区位要素模块
            var _this = this;

            if (isMock) {
                var reData = reApiData.locationFactorsData;

                this.data.enterpriseName = reData.enterpriseName || '';
                this.data.rating = reData.rating || '';
                this.data.refreshDate = reData.refreshDate || '';

                this.data.mapChartData.bankName = reData.bankName || '';
                this.data.mapChartData.tagName = reData.tagName || '';
                this.data.mapChartData.areaLocations = reData.areaLocations || [];

                this.mapChartInit('chart-map-box');
            } else {
                httpRequest('get', locationFactorsApi, { 'enterprise': 1 }, true, 1, 1, null, function(data) {
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
            }
        },
        getLineChartData: function() { //获取第二区域图表数据 ----生产状况
            var _this = this;

            if (isMock) {
                var reData = reApiData.productionStatusData;

                this.handleLineChartData(reData); //数据回调处理
                this.lineChartInit('chart-line-box');
            } else {
                httpRequest('get', productionStatusApi, { 'enterprise': 1 }, true, 1, 1, null, function(data) {
                    var reData = data.rows || [];

                    _this.handleLineChartData(reData); //数据回调处理
                    _this.lineChartInit('chart-line-box');
                }, function(msg, code) {
                    alert(msg);
                });
            }
        },
        getBarLChartData: function() { //获取第三区域图表数据 ----设备运行模块
            var _this = this;

            if (isMock) {
                var reData = reApiData.equipmentOperationData;
                this.setDeviceRunTime(5000, reData); //数据回调处理
            } else {
                httpRequest('get', equipmentOperationApi, { 'enterprise': 1 }, true, 1, 1, null, function(data) {
                    var reData = data.rows || [];
                    _this.setDeviceRunTime(5000, reData); //数据回调处理
                }, function(msg, code) {
                    alert(msg);
                });
            }
        },
        getBarRChartData: function() { //获取第四区域图表数据 ----企业用电
            var _this = this;

            if (isMock) {
                var reData = reApiData.enterpriseElectricityData;
                var reArr = reData.days || [];

                var yAxisArr = [],
                    seriesArr = [],
                    itemObjData = [],
                    maxValue = 0; //默认最大值
                for (var i = 0; i < reArr.length; i++) {
                    yAxisArr.push(reArr[i].day);
                    itemObjData.push(reArr[i].value);
                    if (maxValue < reArr[i].value) maxValue = reArr[i].value;
                }

                var maxLen = String(maxValue).length;
                var maxCeilNum = '1';
                for (var t = 0; t < maxLen - 1; t++) {
                    maxCeilNum += '0';
                }
                maxCeilNum = Number(maxCeilNum);
                var maxCeil = maxValue / maxCeilNum;
                maxValue = Math.ceil(maxCeil) * maxCeilNum;

                var itemObj = {
                    name: '',
                    type: 'bar',
                    barWidth: 12,
                    itemStyle: {
                        normal: {
                            color: '#004f9c',
                            barBorderRadius: 12
                        }
                    },
                    data: itemObjData
                };
                seriesArr.push(itemObj);

                //背景条数据设定
                var seriesFixedArr = [];
                for (var j = 0; j < yAxisArr.length; j++) {
                    seriesFixedArr.push(maxValue);
                };
                //加入背景条
                seriesArr.push({
                    type: "bar",
                    barWidth: 12,
                    xAxisIndex: 0,
                    barGap: "-100%",
                    data: seriesFixedArr,
                    itemStyle: {
                        normal: {
                            color: "#fff",
                            borderColor: '#fff',
                            borderWidth: 2,
                            barBorderRadius: 12
                        }
                    },
                    zlevel: -1
                });

                this.data.barRChartData.maxValue = maxValue;

                this.data.barRChartData.totalPower = reData.total;
                this.data.barRChartData.yAxisData = yAxisArr;
                this.data.barRChartData.seriesData = seriesArr;

                this.barRChartInit('chart-barR-box');
            } else {
                httpRequest('get', enterpriseElectricityApi, { 'enterprise': 1 }, true, 1, 1, null, function(data) {
                    var reData = data.object || {};
                    var reArr = reData.days || [];

                    var yAxisArr = [],
                        seriesArr = [],
                        itemObjData = [],
                        maxValue = 0; //默认最大值
                    for (var i = 0; i < reArr.length; i++) {
                        yAxisArr.push(reArr[i].day);
                        itemObjData.push(reArr[i].value);
                        if (maxValue < reArr[i].value) maxValue = reArr[i].value;
                    }

                    var maxLen = String(maxValue).length;
                    var maxCeilNum = '1';
                    for (var t = 0; t < maxLen - 1; t++) {
                        maxCeilNum += '0';
                    }
                    maxCeilNum = Number(maxCeilNum);
                    var maxCeil = maxValue / maxCeilNum;
                    maxValue = Math.ceil(maxCeil) * maxCeilNum;

                    var itemObj = {
                        name: '',
                        type: 'bar',
                        barWidth: 12,
                        itemStyle: {
                            normal: {
                                color: '#004f9c',
                                barBorderRadius: 12
                            }
                        },
                        data: itemObjData
                    };
                    seriesArr.push(itemObj);

                    //背景条数据设定
                    var seriesFixedArr = [];
                    for (var j = 0; j < yAxisArr.length; j++) {
                        seriesFixedArr.push(maxValue);
                    };
                    //加入背景条
                    seriesArr.push({
                        type: "bar",
                        barWidth: 12,
                        xAxisIndex: 0,
                        barGap: "-100%",
                        data: seriesFixedArr,
                        itemStyle: {
                            normal: {
                                color: "#fff",
                                borderColor: '#fff',
                                borderWidth: 2,
                                barBorderRadius: 12
                            }
                        },
                        zlevel: -1
                    });

                    _this.data.barRChartData.maxValue = maxValue;

                    _this.data.barRChartData.totalPower = reData.total;
                    _this.data.barRChartData.yAxisData = yAxisArr;
                    _this.data.barRChartData.seriesData = seriesArr;

                    _this.barRChartInit('chart-barR-box');
                }, function(msg, code) {
                    alert(msg);
                });
            }
        },
        setDeviceRunTime: function(stime, reArr) { //设备运行模块 -- 回调数据格式处理 ----定时刷新
            var _this = this;

            var tIndex = 0;
            if (reArr.length) {
                var sdaysArr = reArr[tIndex].days || [];
                this.handleBarLChartTitle(reArr, tIndex);
                this.handleBarLChartData(sdaysArr);

                console.log(this.data.barLChartData);
                this.barLChartInit('chart-barL-box'); //初始化图表
                var deviceTime = setInterval(function() {
                    var daysArr = reArr[tIndex].days || [];
                    _this.handleBarLChartTitle(reArr, tIndex);
                    _this.handleBarLChartData(daysArr);

                    _this.barLChartInit('chart-barL-box'); //重新初始化图表
                    tIndex++;

                    if (tIndex === reArr.length) tIndex = 0;
                }, stime);
            }
        },
        handleBarLChartTitle: function(reArr, index) { //设备运行模块 -- 回调数据格式处理 --标题设置
            var legendTitleArr = [];
            for (var i = 0; i < reArr.length; i++) {
                var tItem = {
                    text: reArr[i].deviceName,
                    textStyle: {
                        color: index === i ? '#e69013' : '#999999',
                        fontSize: 15
                    },
                    textAlign: 'left',
                    bottom: 30 + i * 10 + "%",
                    right: '6%'
                };
                legendTitleArr.push(tItem); //获取循环标题
            }
            this.data.barLChartData.titleData = legendTitleArr;
        },
        handleBarLChartData: function(daysArr) { //设备运行模块 -- 回调数据格式处理
            var yAxisArr = [],
                seriesArr = [];

            var notRunningArr = [],
                runArr = [];
            for (var j = 0; j < daysArr.length; j++) {
                if ($.inArray(daysArr[j].day, yAxisArr) < 0) {
                    yAxisArr.push(daysArr[j].day);
                }

                var stateDurationsArr = daysArr[j].stateDurations || [];
                for (var m = 0; m < stateDurationsArr.length; m++) {
                    stateDurationsArr[m].day = daysArr[j].day;
                    if (stateDurationsArr[m].state) {
                        runArr.push(stateDurationsArr[m]);
                    } else {
                        notRunningArr.push(stateDurationsArr[m]);
                    }
                }
            }

            var jNotRunningArr = this.handleReArrChart(notRunningArr, 'day');
            var jRunArr = this.handleReArrChart(runArr, 'day');

            var reNotRunningArr = this.handleRunDataJson(jNotRunningArr, 0);
            var reRunArr = this.handleRunDataJson(jRunArr, 1);
            seriesArr = reRunArr.concat(reNotRunningArr);


            //背景条数据设定
            var seriesFixedArr = [];
            for (var j = 0; j < yAxisArr.length; j++) {
                seriesFixedArr.push(24);
            };
            //加入背景条
            seriesArr.push({
                type: "bar",
                barWidth: 12,
                xAxisIndex: 0,
                barGap: "-100%",
                data: seriesFixedArr,
                itemStyle: {
                    normal: {
                        color: "#fff",
                        borderColor: '#fff',
                        borderWidth: 2,
                        barBorderRadius: 12
                    }
                },
                zlevel: -1
            });

            this.data.barLChartData.yAxisData = yAxisArr;
            this.data.barLChartData.seriesData = seriesArr;
        },
        handleRunDataJson: function(arr, type) { //设备运行模块 --数据格式化处理
            var reArr = [];
            var itemObjs = {
                name: type ? '运行中' : '未运行',
                type: 'bar',
                barWidth: 12,
                stack: '总量',
                itemStyle: {
                    normal: {
                        color: type ? '#e69013' : '#fff',
                        barBorderRadius: 12
                    }
                },
                data: []
            };
            for (var i in arr) {
                if (arr[i] instanceof Array) {
                    var rarr = arr[i];
                    for (var j in rarr) {
                        var itemObj = {
                            name: type ? '运行中' : '未运行',
                            type: 'bar',
                            barWidth: 12,
                            stack: '总量',
                            itemStyle: {
                                normal: {
                                    color: type ? '#e69013' : '#fff',
                                    barBorderRadius: 12
                                }
                            },
                            data: [rarr[j][0].duration]
                        };
                        reArr.push(itemObj);
                    }
                } else {
                    itemObjs.data.push(arr[i].duration);
                }
            }
            reArr.push(itemObjs);
            return reArr;
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

            $("#map-chart-bank").html(this.data.mapChartData.bankName);
            $("#map-chart-lable").html(this.data.mapChartData.tagName);
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
                    // subtext: '更新时间：' + this.data.refreshDate,
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
                title: this.data.barLChartData.titleData,
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
                    data: this.data.barLChartData.yAxisData
                },
                series: this.data.barLChartData.seriesData
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
                    right: '5%',
                    left: '25%',
                    bottom: '6%',
                    containLabel: true
                },
                xAxis: [{
                    type: 'value',
                    position: 'top',
                    min: 0,
                    max: this.data.barRChartData.maxValue,
                    axisLine: {
                        lineStyle: {
                            type: 'solid',
                            color: '#fff'
                        }
                    }
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
        },
        // 将设备运行模块格式化数据
        handleReArrChart: function(arr, str) {
            var _arr = [],
                _t = [];
            // 临时变量
            var _temp;

            // 对数组的元素进行排序，并返回数组。 
            arr = arr.sort(function(a, b) {
                var s = a[str],
                    t = b[str]
                return s < t ? -1 : 1;
            });

            // 将相同类别的对象添加到统一个数组
            for (var i in arr) {
                if (arr[i][str] === _temp) {
                    _t.push([arr[i]]);
                } else {
                    _temp = arr[i][str];
                    _arr.push(arr[i]);
                }
            }
            // 将最后的内容推出
            _arr.push(_t);

            return _arr
        }
    };

    app.init();

    var appUptateTime = setInterval(function() {
        app.init();
    }, app.refreshTime);
});