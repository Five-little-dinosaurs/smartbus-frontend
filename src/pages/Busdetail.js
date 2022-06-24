import { Scene, PointLayer, LineLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import MonochromePhotosIcon from '@mui/icons-material/MonochromePhotos';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
// import AMapLoader from '@amap/amap-jsapi-loader';
import {
    Box,
    Button,
    Card,
    Container,
    Stack,
    TextField,
    Typography,
    Autocomplete,
    DialogTitle,
    DialogContent, Grid, DialogActions, Dialog, DialogContentText
} from "@mui/material";
import {useEffect, useState} from "react";
import axios from "axios";
import Page from "../components/Page";
import {Address} from "../store/Address";
// import Iconify from "../components/Iconify";

// const bus = [
//     { id: '123', name: '38', number: '鲁B88888'},
//     { id: '123', name: '59', number: '鲁B66666'}
// ]
export default function Busdetail() {
    // const [bus, setBus] = useState(59);
    const [scene, setScene] = useState(null);
    const [busLists, setBusLists] = useState([]);
    const [detailDialog, setDetailDialog] = useState(false);
    const [peopleDialog, setPeopleDialog] = useState(false);
    const [photoDialog, setPhotoDialog] = useState(false);
    const [statusDialog, setStatusDialog] = useState(false);
    const [detail, setDetail]=useState({});

    // const [gps, setGps] = useState({R: 120.19247000000001, Q: 35.951667});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    function showBus(gps,number){
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
                linesearch.search(number.toString(), (status, result) => {
                    // 打印状态信息status和结果信息result
                    console.log(number.toString());
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
        axios.get(`${Address}/busroute`).then((res)=>{
            // console.log(res);
            setBusLists(res.data);
        }).catch((res)=>{
            console.log(res);
        })
        const gps = {R: 120.19247000000001, Q: 35.951667};
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
        axios.get(`${Address}/totaldetail`).then((res)=>{
            setDetail(res.data);
            console.log(res.data);
        })
    },[]);
    return (
        <Page title="BusDetail">
            <Dialog open={detailDialog} onClose={()=>{
                setDetailDialog(false);
            }}
                    fullWidth
            >
                <DialogTitle>车辆情况</DialogTitle>
                <DialogContent>
                    <Card>
                        <Grid container spacing={5} sx={{ justifyContent:'center' }}>
                            <Grid item xs={12} sx={{ml:8,mt:2}}>
                                <img width={400} src='data:image/jpeg;base64,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' alt={'11'} />
                            </Grid>
                            <Grid item xs={12} sx={{ml:8, mt: 1 }}>
                                <DialogContentText id="alert-dialog-description">
                                    温度为:{detail.temperature}℃
                                </DialogContentText>
                            </Grid>
                            <Grid item xs={12} sx={{ ml:8,mb: 1 }}>
                                <DialogContentText id="alert-dialog-description">
                                    湿度为:{detail.humidity}
                                </DialogContentText>
                            </Grid>
                        </Grid>
                    </Card>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>{
                        setDetailDialog(false);
                    }}>关闭</Button>
                    {/* eslint-disable-next-line react/jsx-no-bind */}

                </DialogActions>
            </Dialog>
            <Dialog open={peopleDialog} onClose={()=>{
                setPeopleDialog(false);
            }}
                    fullWidth
            >
                <DialogTitle>刷卡人数</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                                人数为:{detail.people}
                    </DialogContentText>
                </DialogContent>
            </Dialog>
            <Dialog open={photoDialog} onClose={()=>{
                setPhotoDialog(false);
            }}
                    fullWidth
            >
                <DialogTitle>车况图片</DialogTitle>
                <DialogContent>
                    <Box sx={{ ml:3 }}>
                        <img width={500} src={detail.detail} alt={'33'}/>
                    </Box>
                </DialogContent>
            </Dialog>
            <Dialog open={statusDialog} onClose={()=>{
                setStatusDialog(false);
            }}
                    fullWidth
            >
                <DialogTitle>司机状态</DialogTitle>
                <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            驾驶状态:{detail.status === 0 ? '疲惫' : '正常' }
                        </DialogContentText>
                </DialogContent>
            </Dialog>
            <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                    公交详细数据
                </Typography>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={busLists.map((option)=> `${option.name}:${option.number}`)}
                    onChange={(event, newValue) => {
                        if (newValue==null) {
                            scene.removeAllLayer();
                            return;
                        }
                        console.log(newValue);
                        const index = newValue.toString().indexOf('路');
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
                            linesearch.search(newValue.toString().substring(0,index), (status, result) => {
                                // 打印状态信息status和结果信息result
                                // console.log(Math.round(result.lineInfo[0].path.length/2));
                                const gpsRes = {
                                    R:result.lineInfo[0].path[Math.round(result.lineInfo[0].path.length/2)].R,
                                    Q:result.lineInfo[0].path[Math.round(result.lineInfo[0].path.length/2)].Q
                                }
                                scene.removeAllLayer();
                                showBus(gpsRes,newValue.toString().substring(0,index));
                            });
                        });
                    }}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="公交" />}
                />
            </Stack>
            <Box>

                {/* <TextField onChange={(e)=> { */}
                {/*    setBus(e.target.value); */}
                {/* }}/> */}
                {/* <Button onClick={() => { */}
                {/*    // eslint-disable-next-line no-undef */}
                {/*    window.AMap.plugin([ 'AMap.ToolBar', 'AMap.LineSearch' ], () => { */}
                {/*        // eslint-disable-next-line no-undef */}
                {/*        scene.map.addControl(new AMap.ToolBar()); */}

                {/*        // eslint-disable-next-line no-undef */}
                {/*        const linesearch = new AMap.LineSearch({ */}
                {/*            pageIndex: 1, // 页码，默认值为1 */}
                {/*            pageSize: 1, // 单页显示结果条数，默认值为20，最大值为50 */}
                {/*            city: '青岛', // 限定查询城市，可以是城市名（中文/中文全拼）、城市编码，默认值为『全国』 */}
                {/*            extensions: 'all' // 是否返回公交线路详细信息，默认值为『base』 */}
                {/*        }); */}

                {/*        // 执行公交路线关键字查询 */}
                {/*        linesearch.search(bus.toString(), (status, result) => { */}
                {/*            // 打印状态信息status和结果信息result */}
                {/*            // console.log(Math.round(result.lineInfo[0].path.length/2)); */}
                {/*            const gpsRes = { */}
                {/*                R:result.lineInfo[0].path[Math.round(result.lineInfo[0].path.length/2)].R, */}
                {/*                Q:result.lineInfo[0].path[Math.round(result.lineInfo[0].path.length/2)].Q */}
                {/*            } */}
                {/*            scene.removeAllLayer(); */}
                {/*            showBus(gpsRes); */}
                {/*        }); */}
                {/*    }); */}
                {/* }}>确定</Button> */}
                <Card sx={{ width: '100%', height: 500, mt: 2}}>
                    <Box sx={{display:'flex',flexDirection: 'row', height:'100%',width:'100%',position:'relative'}}>
                        <Card sx={{height: '93%', width:'80%', margin: 2}} id="map"/>
                        <Box sx={{ display:'flex', flexDirection:'column', margin: 2}}>
                            <Button startIcon={<DirectionsBusIcon />} sx={{ display:'flex', margin: 2}} variant="contained" onClick={()=>{
                                setDetailDialog(true);
                            }}>
                                车辆情况
                            </Button>
                            {/* <Button startIcon={<DeviceThermostatIcon />} sx={{ display:'flex', margin: 2}} variant="contained">温度</Button> */}
                            {/* <Button startIcon={<OpacityIcon />} sx={{ display:'flex', margin: 2}} variant="contained">湿度</Button> */}
                            <Button startIcon={<EmojiPeopleIcon />} sx={{ display:'flex', margin: 2}} variant="contained" onClick={()=>{
                                setPeopleDialog(true);
                            }}>刷卡人数</Button>
                            <Button startIcon={<MonochromePhotosIcon />} sx={{ display:'flex', margin: 2}} variant="contained" onClick={()=>{
                                setPhotoDialog(true);
                            }}>车况图片</Button>
                            <Button startIcon={<AssignmentIndIcon />} sx={{ display:'flex', margin: 2}} variant="contained" onClick={()=>{
                                setStatusDialog(true);
                            }}>司机状态</Button>
                        </Box>
                    </Box>
                </Card>
            </Box>
            </Container>
        </Page>
    );
}
