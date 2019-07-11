var reApiData = {
    locationFactorsData: {
        "enterpriseName": "大大铜业优先公司",
        "bankName": "江苏银行",
        "tagName": "金属加工",
        "refreshDate": "2019-11-11 12:12:12",
        "rating": 90,
        "areaLocations": [{
                "lng": 120.30,
                "lat": 31.59
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
    productionStatusData: [{
            "ismeter": true,
            "name": "电表",
            "data": [{
                    "date": "2019-11-11",
                    "value": 12
                },
                {
                    "date": "2019-11-12",
                    "value": 12
                }
            ]
        },
        {
            "ismeter": false,
            "name": "冷轧机",
            "data": [{
                    "date": "2019-11-11",
                    "value": 12
                },
                {
                    "date": "2019-11-12",
                    "value": 12
                }
            ]
        }
    ],
    equipmentOperationData: [{
            "deviceName": "铣床",
            "days": [{
                    "day": "01",
                    "stateDurations": [{
                            "duration": 10,
                            "state": 0
                        },
                        {
                            "duration": 14,
                            "state": 1
                        }
                    ]
                },
                {
                    "day": "02",
                    "stateDurations": [{
                            "duration": 10,
                            "state": 1
                        },
                        {
                            "duration": 14,
                            "state": 0
                        }
                    ]
                }
            ]
        },
        {
            "deviceName": "冷轧机",
            "days": [{
                    "day": "01",
                    "stateDurations": [{
                            "duration": 10,
                            "state": 1
                        },
                        {
                            "duration": 14,
                            "state": 1
                        }
                    ]
                },
                {
                    "day": "02",
                    "stateDurations": [{
                            "duration": 10,
                            "state": 1
                        },
                        {
                            "duration": 14,
                            "state": 0
                        }
                    ]
                }
            ]
        }
    ],
    enterpriseElectricityData: {
        "total": 54800,
        "days": [{
                "day": "01",
                "value": 24000
            },
            {
                "day": "02",
                "value": 34000
            }
        ]
    }
};