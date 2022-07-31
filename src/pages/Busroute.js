
// material
import {
    Card,
    Stack,
    Container,
    Typography,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Pagination,
    Slide,
    TableContainer,
    Table,
    TableBody, TableRow, TableCell, Checkbox, TablePagination, Grid, TextField
} from '@mui/material';
// components
// import axios from "axios";
// import {faker} from "@faker-js/faker";

import {
    DataGrid,
    GridActionsCellItem, gridPageCountSelector,
    gridPageSelector,
    GridToolbar,
    useGridApiContext,
    useGridSelector
} from "@mui/x-data-grid";
import {Edit} from "@mui/icons-material";
import {forwardRef, useEffect, useState} from "react";
import {LineLayer, PointLayer, Scene} from "@antv/l7";
import {GaodeMap} from "@antv/l7-maps";
import Page from '../components/Page';
import {UserListHead} from "../sections/@dashboard/user";
import Scrollbar from "../components/Scrollbar";

// ----------------------------------------------------------------------

// const TABLE_HEAD = [
//     { id: 'name', label: '序号', alignRight: false },
//     { id: 'region', label: '推荐原因', alignRight: false },
//     // { id: 'thing', label: '反馈信息', alignRight: false },
//     // { id: 'punishment', label: '违规记录', alignRight: false },
//     { id: 'status', label: '受理状态', alignRight: false },
//     { id: '' },
// ];

// const USERLIST = [...Array(24)].map((_, index) => ({
//     id: faker.datatype.uuid(),
//     avatarUrl: `/static/mock-images/avatars/avatar_${index + 1}.jpg`,
//     name: faker.name.findName(),
//     company: faker.company.companyName(),
//     // isVerified: faker.datatype.boolean(),
//     // status: sample(['active', 'banned']),
// }));
// ----------------------------------------------------------------------

function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return <Pagination color="primary" count={pageCount} page={page + 1} onChange={(event, value) => apiRef.current.setPage(value - 1)} />;
}


const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function Busroute() {

    const [routeDialog, setRouteDialog] = useState(false);

    const [gapDialog, setGapDialog] = useState(false);

    const [modeDialog, setModeDialog] = useState(false);

    const [order, setOrder] = useState('asc');

    const [orderBy, setOrderBy] = useState('name');

    const [gap, setGap] = useState(10);

    const [gap1, setGap1] = useState(20);

    const [gap2, setGap2] = useState(15);

    const [mode, setMode] = useState(0);

    const [mode1, setMode1] = useState(1);

    const [mode2, setMode2] = useState(2);

    const [current, setCurrent]=useState(0);

    const TABLE_HEAD = [
        { id: 'busNo', label: '公交车牌号', alignRight: false },
        { id: 'cardCount', label: '刷卡人数', alignRight: false },
        { id: 'wifiCount', label: '近一小时连WIFI人数', alignRight: false },
        { id: 'reserveCount', label: '预约人数', alignRight: false },
        { id: 'busy', label: '拥塞程度', alignRight: false },
        { id: 'gap', label: '所在线路间隔', alignRight: false },
        { id: 'useful', label: '节能', alignRight: false },
    ];

    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
    // const [scene, setScene] = useState(null);
    function searchBus(scene,num) {
        // eslint-disable-next-line no-undef
        const linesearch = new AMap.LineSearch({
            pageIndex: 1, // 页码，默认值为1
            pageSize: 1, // 单页显示结果条数，默认值为20，最大值为50
            city: '济南', // 限定查询城市，可以是城市名（中文/中文全拼）、城市编码，默认值为『全国』
            extensions: 'all' // 是否返回公交线路详细信息，默认值为『base』
        });

        linesearch.search(num, (status, result) => {
            // 打印状态信息status和结果信息result
            // console.log(number.toString());
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
    }
    const columns = [
        { field: 'name', headerName: '推荐线路', flex: 1, minWidth: 250 },
        { field: 'description', headerName: '详细描述', flex: 2.3, minWidth: 580 },
        {
            field: 'actions',
            headerName: '修改操作',
            type: 'actions',
            flex: 0.65,
            minWidth: 150,
            getActions: (index) => [
                <GridActionsCellItem
                    key={index}
                    icon={<Edit />}
                    label="Toggle Admin"
                    onClick={() => {
                        setRouteDialog(true);
                        sleep(100).then(() => {
                            const gps = {R: 116.990631000003, Q: 36.662};
                            const scene = new Scene({
                                id: 'map',
                                map: new GaodeMap({
                                    center: [ gps.R, gps.Q ],
                                    pitch: 0,
                                    zoom: 12,
                                    plugin: [ 'AMap.ToolBar', 'AMap.LineSearch' ]
                                }),
                                logoVisible: false
                            });
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
                                    searchBus(scene,'K83');
                                    searchBus(scene,'K33');
                                    // eslint-disable-next-line no-undef

                                    // 执行公交路线关键字查询
                                });
                            });
                        })
                    }}
                 showInMenu={false}/>
            ]
        }
    ];

    const busRouteInfo = [
        {
            id: 1,
            name: 'K83路和K33路',
            description: 'K83与K33线路重合度较高，客流量较少。'
        },
        {
            id: 2,
            name: '38路和59路',
            description: '将38路公交的起点和59路公交的终点改为第二人民医院站。'
        }
        // {
        //     id: 3,
        //     name: '38路和59路',
        //     description: 'xxx'
        // },
        // {
        //     id: 4,
        //     name: '38路和59路',
        //     description: 'xxx'
        // }
    ]

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };


    useEffect(()=>{
    },[]);
    return (
        <Page title="Route">
            <Dialog open={routeDialog} onClose={()=>{
                setRouteDialog(false);
            }}
                    fullScreen
                    TransitionComponent={Transition}
            >
                <DialogTitle>详情（K83与K33）</DialogTitle>
                <DialogContent>
                    <Card sx={{ width: '100%', height: 550, mt: 2}}>
                        <Box sx={{display:'flex',flexDirection: 'row', height:'100%',width:'100%',position:'relative'}}>
                            <Box sx={{ display:'flex', flexDirection:'column', margin: 2, width:'15%'}}>
                                <Typography variant='h6'>
                                    原因：K83与K33线路重合度较高，客流量较少。
                                </Typography>
                                <Typography variant='h6'>
                                    建议将K83的终点从北圆站的改为茂新街站，或将K33的终点站从解放桥站改为茂新界街站。
                                </Typography>
                            </Box>
                            <Card sx={{height: '93%', width:'85%', margin: 2}} id="map"/>
                        </Box>
                    </Card>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>{
                        setRouteDialog(false);
                    }}>取消</Button>
                    {/* eslint-disable-next-line react/jsx-no-bind */}
                    <Button type="submit" onClick={()=>setRouteDialog(false)}>确认</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={gapDialog} onClose={()=>{
                setGapDialog(false);
                // setRoad([1]);
            }}
                    fullWidth
                    scroll='paper'
            >
                <DialogTitle>修改间距</DialogTitle>
                {/* eslint-disable-next-line react/jsx-no-bind */}
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        {/* <DataGrid checkboxSelection hideFooter rows={rows} columns={columns} /> */}
                        {<Grid item xs={12}>
                            <TextField
                                // autoFocus
                                // eslint-disable-next-line no-nested-ternary,react/prop-types
                                margin="dense"
                                label="请设置你要调整的线路间距"
                                fullWidth
                                variant="standard"
                                onChange={(event)=>{
                                    if(current === 0)
                                        setGap(event.target.value);
                                    else if(current === 1)
                                        setGap1(event.target.value);
                                    else
                                        setGap2(event.target.value);
                                }}
                            />
                        </Grid>

                        }
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>{
                        setGapDialog(false);
                        // setRoad([1]);
                    }}>取消</Button>
                    {/* eslint-disable-next-line react/jsx-no-bind */}
                    <Button onClick={()=>{
                        setGapDialog(false);
                    }}>确认</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={modeDialog} onClose={()=>{
                setModeDialog(false);
                // setRoad([1]);
            }}
                    fullWidth
                    scroll='paper'
            >
                <DialogTitle>请设置你要调整成的目标模式</DialogTitle>
                {/* eslint-disable-next-line react/jsx-no-bind */}
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        {/* <DataGrid checkboxSelection hideFooter rows={rows} columns={columns} /> */}
                        {<Grid item xs={12}>
                            <Stack direction="row" spacing={2}>
                            <Button sx={{ display:'flex', color:'blue'}} variant="outlined" onClick={()=>{
                                if(current === 0)
                                    setMode(0);
                                else if(current === 1)
                                    setMode1(0);
                                else
                                    setMode2(0);
                            }}>
                                正常
                            </Button>
                            <Button sx={{ display:'flex', color:'green'}} variant="outlined" onClick={()=>{
                                if(current === 0)
                                    setMode(1);
                                else if(current === 1)
                                    setMode1(1);
                                else
                                    setMode2(1);
                            }}>
                                节能模式
                            </Button>
                            <Button sx={{ display:'flex', color:'orange'}} variant="outlined" onClick={()=>{
                                if(current === 0)
                                    setMode(2);
                                else if(current === 1)
                                    setMode1(2);
                                else
                                    setMode2(2);
                            }}>
                                高效能模式
                            </Button>
                            </Stack>
                        </Grid>

                        }
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>{
                        setModeDialog(false);
                        // setRoad([1]);
                    }}>取消</Button>
                    {/* eslint-disable-next-line react/jsx-no-bind */}
                    <Button onClick={()=>{
                        setModeDialog(false);
                    }}>确认</Button>
                </DialogActions>
            </Dialog>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        路线优化推荐信息
                    </Typography>
                    {/* <Button variant="contained" component={RouterLink} to="#" startIcon={<Iconify icon="eva:plus-fill" />}> */}
                    {/*    添加乘客 */}
                    {/* </Button> */}
                </Stack>

                <Card sx={{height: `calc(100vh - 400px)`, width: '100%', marginBottom: 2}}>
                    <Box sx={{ margin: 2, height: '90%'}}>
                        <DataGrid
                            // autoHeight
                            autoPageSize
                            rows={busRouteInfo}
                            columns={columns}
                            // pageSize={5}
                            components={{
                                Pagination: CustomPagination,
                                Toolbar: GridToolbar
                            }}
                        />
                    </Box>
                </Card>
                <Card>
                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800}}>
                            <Table>
                                <UserListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={3}
                                    onRequestSort={handleRequestSort}
                                />
                                <TableBody>


                                    <TableRow
                                        hover
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox />
                                        </TableCell>
                                        <TableCell align="left">川A13345</TableCell>
                                        <TableCell align="left">28</TableCell>
                                        <TableCell align="left">16</TableCell>
                                        <TableCell align="left">3</TableCell>
                                        <TableCell align="left">正常</TableCell>
                                        <TableCell align="left" onClick={() => {setGapDialog(true);setCurrent(0);}}>{gap}</TableCell>
                                        <TableCell align="left">
                                            {mode === 0 && (<Button sx={{ display:'flex', color:'blue'}} variant="outlined" onClick={()=>{setModeDialog(true);setCurrent(0);
                                                }}>
                                                    正常
                                                </Button>
                                            )}
                                            {mode === 1 && (<Button sx={{ display:'flex', color:'green'}} variant="outlined" onClick={()=>{setModeDialog(true);setCurrent(0);
                                                }}>
                                                    节能模式
                                                </Button>
                                            )}
                                            {mode === 2 && (<Button sx={{ display:'flex', color:'orange'}} variant="outlined" onClick={()=>{setModeDialog(true);setCurrent(0);
                                                }}>
                                                    高效能模式
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow
                                        hover
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox />
                                        </TableCell>
                                        <TableCell align="left">川B13456</TableCell>
                                        <TableCell align="left">12</TableCell>
                                        <TableCell align="left">8</TableCell>
                                        <TableCell align="left">4</TableCell>
                                        <TableCell align="left">低</TableCell>
                                        <TableCell align="left" onClick={() => {setGapDialog(true);setCurrent(1);}}>{gap1}</TableCell>
                                        <TableCell align="left">
                                            {mode1 === 0 && (<Button sx={{ display:'flex', color:'blue'}} variant="outlined" onClick={()=>{setModeDialog(true);setCurrent(1);
                                                }}>
                                                    正常
                                                </Button>
                                            )}
                                            {mode1 === 1 && (<Button sx={{ display:'flex', color:'green'}} variant="outlined" onClick={()=>{setModeDialog(true);setCurrent(1);
                                                }}>
                                                    节能模式
                                                </Button>
                                            )}
                                            {mode1 === 2 && (<Button sx={{ display:'flex', color:'orange'}} variant="outlined" onClick={()=>{setModeDialog(true);setCurrent(1);
                                                }}>
                                                    高效能模式
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow
                                        hover
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox />
                                        </TableCell>
                                        <TableCell align="left">川C8659K</TableCell>
                                        <TableCell align="left">30</TableCell>
                                        <TableCell align="left">25</TableCell>
                                        <TableCell align="left">8</TableCell>
                                        <TableCell align="left">高</TableCell>
                                        <TableCell align="left" onClick={() => {setGapDialog(true);setCurrent(2);}}>{gap2}</TableCell>
                                        <TableCell align="left">
                                            {mode2 === 0 && (<Button sx={{ display:'flex', color:'blue'}} variant="outlined" onClick={()=>{setModeDialog(true);setCurrent(2);
                                                }}>
                                                    正常
                                                </Button>
                                            )}
                                            {mode2 === 1 && (<Button sx={{ display:'flex', color:'green'}} variant="outlined" onClick={()=>{setModeDialog(true);setCurrent(2);
                                                }}>
                                                    节能模式
                                                </Button>
                                            )}
                                            {mode2 === 2 && (<Button sx={{ display:'flex', color:'orange'}} variant="outlined" onClick={()=>{setModeDialog(true);setCurrent(2);
                                            }}>
                                                高效能模式
                                            </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                            </TableBody>
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={3}
                        rowsPerPage={5}
                        page={0}
                        onPageChange={1}
                        onRowsPerPageChange={5}
                    />
                </Card>
            </Container>
        </Page>
    );
}
