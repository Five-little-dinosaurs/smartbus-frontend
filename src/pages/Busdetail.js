import { Scene, PointLayer, LineLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
// import AMapLoader from '@amap/amap-jsapi-loader';
import {Box, Button, Card, TextField} from "@mui/material";
import {useEffect, useState} from "react";


export default function Busdetail() {
    const [bus, setBus] = useState(59);
    const [scene, setScene] = useState(null);
    // const [gps, setGps] = useState({R: 120.19247000000001, Q: 35.951667});
    function showBus(gps){
        const scene = new Scene({
            id: 'map',
            map: new GaodeMap({
                center: [ gps.R, gps.Q ],
                pitch: 0,
                zoom: 11.5,
                plugin: [ 'AMap.ToolBar', 'AMap.LineSearch' ]
            }),
            logoVisible: false
        });
        setScene(scene);
        scene.addImage(
            'road',
            'https://gw.alipayobjects.com/zos/bmw-prod/ce83fc30-701f-415b-9750-4b146f4b3dd6.svg'
        );
        scene.addImage(
            'start',
            'https://gw.alipayobjects.com/zos/bmw-prod/1c301f25-9bb8-4e67-8d5c-41117c877caf.svg'
        );
        scene.addImage(
            'end',
            'https://gw.alipayobjects.com/zos/bmw-prod/f3db4998-e657-4c46-b5ab-205ddc12031f.svg'
        );

        scene.addImage(
            'busStop',
            'https://gw.alipayobjects.com/zos/bmw-prod/54345af2-1d01-43e1-9d11-cd9bb953202c.svg'
        );
        scene.on('loaded', () => {
            // scene.destroy();
            window.AMap.plugin([ 'AMap.ToolBar', 'AMap.LineSearch' ], () => {
                // eslint-disable-next-line no-undef
                scene.map.addControl(new AMap.ToolBar());

                // eslint-disable-next-line no-undef
                const linesearch = new AMap.LineSearch({
                    pageIndex: 1, // 页码，默认值为1
                    pageSize: 1, // 单页显示结果条数，默认值为20，最大值为50
                    city: '青岛', // 限定查询城市，可以是城市名（中文/中文全拼）、城市编码，默认值为『全国』
                    extensions: 'all' // 是否返回公交线路详细信息，默认值为『base』
                });

                // 执行公交路线关键字查询
                linesearch.search(bus.toString(), (status, result) => {
                    // 打印状态信息status和结果信息result
                    console.log(bus.toString());
                    console.log(result);
                    // eslint-disable-next-line camelcase
                    const { path, via_stops } = result.lineInfo[0];
                    const startPoint = [ path[0] ];
                    const endpoint = [ path[path.length - 1] ];
                    // eslint-disable-next-line camelcase
                    const budStopsData = via_stops.map(stop => ({
                        lng: stop.location.lng,
                        lat: stop.location.lat,
                        name: stop.name
                    }));
                    const data = [
                        {
                            id: '1',
                            coord: path.map(p => [ p.lng, p.lat ])
                        }
                    ];

                    const busLine = new LineLayer({ blend: 'normal' })
                        .source(data, {
                            parser: {
                                type: 'json',
                                coordinates: 'coord'
                            }
                        })
                        .size(5)
                        .shape('line')
                        .color('rgb(99, 166, 242)')
                        .texture('road')
                        .animate({
                            interval: 1, // 间隔
                            duration: 1, // 持续时间，延时
                            trailLength: 2 // 流线长度
                        })
                        .style({
                            lineTexture: true,
                            iconStep: 25
                        });

                    scene.addLayer(busLine);

                    const startPointLayer = new PointLayer({ zIndex: 1 })
                        .source(startPoint, {
                            parser: {
                                x: 'lng',
                                y: 'lat',
                                type: 'json'
                            }
                        })
                        .shape('start')
                        .size(20)
                        .style({
                            offsets: [ 0, 25 ]
                        });
                    scene.addLayer(startPointLayer);

                    const endPointLayer = new PointLayer({ zIndex: 1 })
                        .source(endpoint, {
                            parser: {
                                x: 'lng',
                                y: 'lat',
                                type: 'json'
                            }
                        })
                        .shape('end')
                        .size(25)
                        .style({
                            offsets: [ 0, 25 ]
                        });
                    scene.addLayer(endPointLayer);

                    const busStops = new PointLayer()
                        .source(budStopsData, {
                            parser: {
                                x: 'lng',
                                y: 'lat',
                                type: 'json'
                            }
                        })
                        .shape('busStop')
                        .size(13)
                        .style({
                            offsets: [ 20, 0 ]
                        });
                    scene.addLayer(busStops);

                    const busStopsName = new PointLayer()
                        .source(budStopsData, {
                            parser: {
                                x: 'lng',
                                y: 'lat',
                                type: 'json'
                            }
                        })
                        .shape('name', 'text')
                        .size(12)
                        .color('#000')
                        .style({
                            textAnchor: 'left',
                            textOffset: [ 80, 0 ],
                            stroke: '#fff',
                            strokeWidth: 1
                        });
                    scene.addLayer(busStopsName);

                    console.log(scene.getLayers());
                });
            });
        });
    }
    useEffect(()=>{
        const gpsRes = {R: 120.19247000000001, Q: 35.951667};
        showBus(gpsRes);
    },[]);
    return (
        <>
            <TextField onChange={(e)=> {
                setBus(e.target.value);
            }}/>
            <Button onClick={() => {
                // eslint-disable-next-line no-undef
                window.AMap.plugin([ 'AMap.ToolBar', 'AMap.LineSearch' ], () => {
                    // eslint-disable-next-line no-undef
                    scene.map.addControl(new AMap.ToolBar());

                    // eslint-disable-next-line no-undef
                    const linesearch = new AMap.LineSearch({
                        pageIndex: 1, // 页码，默认值为1
                        pageSize: 1, // 单页显示结果条数，默认值为20，最大值为50
                        city: '青岛', // 限定查询城市，可以是城市名（中文/中文全拼）、城市编码，默认值为『全国』
                        extensions: 'all' // 是否返回公交线路详细信息，默认值为『base』
                    });

                    // 执行公交路线关键字查询
                    linesearch.search(bus.toString(), (status, result) => {
                        // 打印状态信息status和结果信息result
                        // console.log(Math.round(result.lineInfo[0].path.length/2));
                        const gpsRes = {
                            R:result.lineInfo[0].path[Math.round(result.lineInfo[0].path.length/2)].R,
                            Q:result.lineInfo[0].path[Math.round(result.lineInfo[0].path.length/2)].Q
                        }
                        scene.removeAllLayer();
                        showBus(gpsRes);
                    });
                });
            }}>确定</Button>
            <Box sx={{ width: 800, height: 500, mt: 2}}>
                <div style={{height: '70vh',justifyContent: 'center', position: 'relative'}} id="map"/>
            </Box>
        </>
    );
}
