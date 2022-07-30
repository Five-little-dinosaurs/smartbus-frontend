import { Component } from 'react';
import * as echarts from 'echarts';
import {data} from './data';

class Echarts extends Component {
    componentDidMount() {
        const chartDom = document.getElementById('main');
        const myChart = echarts.init(chartDom);
        let option;

        const hStep = 300 / (data.length - 1);
        // eslint-disable-next-line prefer-spread
            const busLines = [].concat.apply(
                [],
                data.map((busLine, idx) => {
                    let prevPt = [];
                    const points = [];
                    for (let i = 0; i < busLine.length; i += 2) {
                        let pt = [busLine[i], busLine[i + 1]];
                        if (i > 0) {
                            pt = [prevPt[0] + pt[0], prevPt[1] + pt[1]];
                        }
                        prevPt = pt;
                        points.push([pt[0] / 1e4, pt[1] / 1e4]);
                    }
                    return {
                        coords: points,
                        lineStyle: {
                            normal: {
                                color: echarts.color.modifyHSL('#5A94DF', Math.round(hStep * idx))
                            }
                        }
                    };
                })
            );
        const color = '#F0FFFF';
        myChart.setOption(
            (option = {
                bmap: {
                    center: [116.50, 39.92],
                    zoom: 10,
                    // roam: true,
                    mapStyle: {
                        styleJson: [
                            {
                                featureType: 'water',
                                elementType: 'all',
                                stylers: {
                                    color
                                }
                            },
                            {
                                featureType: 'land',
                                elementType: 'geometry',
                                stylers: {
                                    color
                                }
                            },
                            {
                                featureType: 'highway',
                                elementType: 'all',
                                stylers: {
                                    visibility: 'off'
                                }
                            },
                            {
                                featureType: 'arterial',
                                elementType: 'geometry.fill',
                                stylers: {
                                    color
                                }
                            },
                            {
                                featureType: 'arterial',
                                elementType: 'geometry.stroke',
                                stylers: {
                                    color
                                }
                            },
                            {
                                featureType: 'local',
                                elementType: 'geometry',
                                stylers: {
                                    color
                                }
                            },
                            {
                                featureType: 'railway',
                                elementType: 'geometry.fill',
                                stylers: {
                                    color
                                }
                            },
                            {
                                featureType: 'railway',
                                elementType: 'geometry.stroke',
                                stylers: {
                                    color
                                }
                            },
                            {
                                featureType: 'subway',
                                elementType: 'geometry',
                                stylers: {
                                    lightness: -70
                                }
                            },
                            {
                                featureType: 'building',
                                elementType: 'geometry.fill',
                                stylers: {
                                    color
                                }
                            },
                            {
                                featureType: 'all',
                                elementType: 'labels.text.fill',
                                stylers: {
                                    color
                                }
                            },
                            {
                                featureType: 'all',
                                elementType: 'labels.text.stroke',
                                stylers: {
                                    color
                                }
                            },
                            {
                                featureType: 'building',
                                elementType: 'geometry',
                                stylers: {
                                    color
                                }
                            },
                            {
                                featureType: 'green',
                                elementType: 'geometry',
                                stylers: {
                                    color
                                }
                            },
                            {
                                featureType: 'boundary',
                                elementType: 'all',
                                stylers: {
                                    color
                                }
                            },
                            {
                                featureType: 'manmade',
                                elementType: 'all',
                                stylers: {
                                    color
                                }
                            },
                            {
                                featureType: 'label',
                                elementType: 'all',
                                stylers: {
                                    visibility: 'off'
                                }
                            }
                        ]
                    }
                },
                series: [
                    {
                        type: 'lines',
                        coordinateSystem: 'bmap',
                        polyline: true,
                        data: busLines,
                        silent: true,
                        lineStyle: {
                            // color: '#c23531',
                            // color: 'rgb(200, 35, 45)',
                            opacity: 0.2,
                            width: 1
                        },
                        progressiveThreshold: 500,
                        progressive: 200
                    },
                    {
                        type: 'lines',
                        coordinateSystem: 'bmap',
                        polyline: true,
                        data: busLines,
                        lineStyle: {
                            width: 0
                        },
                        effect: {
                            constantSpeed: 20,
                            show: true,
                            trailLength: 0.1,
                            symbolSize: 1.5
                        },
                        zlevel: 1
                    }
                ]
            })
        );

        // eslint-disable-next-line no-unused-expressions
        option && myChart.setOption(option);
    }

    render() {
        return <div id="main" style={{ position: 'relative', width: 800, height: 500 }} />;
    }
}

export default Echarts;
