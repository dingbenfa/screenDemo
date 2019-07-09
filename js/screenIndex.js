$(function() {
    // 基于准备好的dom，初始化echarts实例
    var mapChart = echarts.init(document.getElementById('chart-map-box'));

    // 指定图表的配置项和数据
    var mapOption = {
        // 加载 bmap 组件
        bmap: {
            // 百度地图中心经纬度
            center: [120.13066322374, 30.240018034923],
            // 百度地图缩放
            zoom: 14,
            // 是否开启拖拽缩放，可以只设置 'scale' 或者 'move'
            roam: true,
            // 百度地图的自定义样式，见 http://developer.baidu.com/map/jsdevelop-11.htm
            mapStyle: {}
        },
        series: [{
            type: 'scatter',
            // 使用百度地图坐标系
            coordinateSystem: 'bmap',
            // 数据格式跟在 geo 坐标系上一样，每一项都是 [经度，纬度，数值大小，其它维度...]
            data: [
                [120, 30, 1]
            ]
        }]
    };

    // 获取百度地图实例，使用百度地图自带的控件
    // var bmap = mapChart.getModel().getComponent('bmap').getBMap();
    // bmap.addControl(new BMap.MapTypeControl());

    // 使用刚指定的配置项和数据显示图表。
    mapChart.setOption(mapOption);


    // 第二区域
    var lineChart = echarts.init(document.getElementById('chart-line-box'));
    var lineOption = {
        title: {
            text: '',
            textStyle: {
                color: '#fff',
                fontSize: 18
            },
            subtext: '更新时间：2019-07-03',
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
            data: ['铣床', '冷轧机-01', '冷轧机-02', '电表'],
            top: '13%',
            left: '6%',
            textStyle: {
                color: '#fff',
                lineHeight: 16,
            }
        },
        grid: {
            left: '25%',
            right: 0,
            bottom: '5%',
            containLabel: true
        },
        color: ['#c1272d', '#e69013', '#8cc63f', '#004f9c'],
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['2019-06-15', '2019-06-16', '2019-06-17', '2019-06-18', '2019-06-19', '2019-06-20', '2019-06-21'],
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
                max: 1000,
                min: 0,
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
                max: 1000,
                min: 0,
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
        series: [{
                name: '铣床',
                type: 'line',
                stack: '总量',
                data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
                name: '冷轧机-01',
                type: 'line',
                stack: '总量',
                data: [220, 182, 191, 234, 290, 330, 310]
            },
            {
                name: '冷轧机-02',
                type: 'line',
                stack: '总量',
                data: [150, 232, 201, 154, 190, 330, 410]
            },
            {
                name: '电表',
                type: 'line',
                stack: '总量',
                data: [150, 432, 201, 154, 190, 430, 510]
            }
        ],
        textStyle: {
            color: '#fff'
        }
    };
    lineChart.setOption(lineOption);


    // 第三区域
    var barLChart = echarts.init(document.getElementById('chart-barL-box'));
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
                stack: '总量',
                itemStyle: {
                    normal: {
                        show: true,
                        color: '#e69013',
                        barBorderRadius: 50,
                        borderWidth: 0,

                    }
                },
                data: [5, 6, 10, 12, 5, 19, 13, 10, 3, 6]
            },
            {
                name: '未运行',
                type: 'bar',
                stack: '总量',
                itemStyle: {
                    normal: {
                        show: true,
                        color: '#e6e6e6',
                        barBorderRadius: 50,
                        borderWidth: 0,

                    }
                },
                data: [15, 8, 9, 11, 12, 5, 8, 12, 11, 6]
            }
        ]
    };
    barLChart.setOption(barLOption);


    // 第四区域
    var barRChart = echarts.init(document.getElementById('chart-barR-box'));
    var barROption = option = {
        title: {
            text: '当月耗能：',
            textStyle: {
                color: '#fff',
                fontSize: 15
            },
            textAlign: 'left',
            subtext: '54800千瓦时',
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
            data: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10']
        },
        series: [{
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
        }, {
            type: "bar",
            barWidth: 12,
            xAxisIndex: 0,
            barGap: "-100%",
            data: [24, 24, 24, 24, 24, 24, 24, 24, 24, 24],
            itemStyle: {
                normal: {
                    color: "#fff",
                    barBorderRadius: 12
                }
            },
            zlevel: -1
        }]
    };
    barRChart.setOption(barROption);
});