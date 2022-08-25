import {filter, sample} from 'lodash';
// import { sentenceCase } from 'change-case';
import {useEffect, useState} from 'react';
// import { Link as RouterLink } from 'react-router-dom';
// material
import {
    Card,
    Table,
    Stack,
    // Avatar,
    Button,
    Checkbox,
    TableRow,
    TableBody,
    TableCell,
    Container,
    Typography,
    TableContainer,
    TablePagination, Dialog, DialogTitle, DialogContent, Grid, DialogActions, TextField,Autocomplete
} from '@mui/material';
// components
// import {faker} from "@faker-js/faker";
import axios from "axios";
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';
import BusMoreMenu from "../sections/@dashboard/bus/BusMoreMenu";
import {Address} from "../store/Address";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: '公交线路', label: '公交线路', alignRight: false },
    { id: '车牌', label: '车牌', alignRight: false },
    { id: '司机', label: '司机', alignRight: false },
    { id: '司机编号', label: '司机编号', alignRight: false },
    { id: '状态', label: '状态', alignRight: false },
    { id: '' },
];

// const busLists = [...Array(24)].map(() => ({
//     id: faker.datatype.uuid(),
//     // avatarUrl: `/static/mock-images/avatars/avatar_${index + 1}.jpg`,
//     name: sample(['59路','38路','3路']),
//     company: sample(['鲁B88888','鲁B66666','鲁B55555']),
//     isVerified: sample([4124,12313,123]),
//     status: sample(['正常', '异常']),
//     role: sample([
//         '张三',
//         '李四',
//         '王五',
//         // 'UX Designer',
//         // 'UI/UX Designer',
//         // 'Project Manager',
//         // 'Backend Developer',
//         // 'Full Stack Designer',
//         // 'Front End Developer',
//         // 'Full Stack Developer',
//     ]),
// }));
// ----------------------------------------------------------------------
function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function Bus() {
    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [busInfoDialog, setBusInfoDialog] = useState(false);

    const [driverList, setDriverList] = useState([]);
    const [busLists, setBusLists] = useState([]);
    const [busInfo, setBusInfo] = useState({
        name:'',
        number:'',
        driverId:''
    })

    const [editState, setEditState] = useState(true);
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = USERLIST.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterByName = (event) => {
        setFilterName(event.target.value);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - busLists.length) : 0;

    const filteredUsers = applySortFilter(busLists, getComparator(order, orderBy), filterName);

    const isUserNotFound = filteredUsers.length === 0;

    function insertBus(){
        // console.log(busInfo);
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < driverList.length; i++) {
            if(driverList[i].name === busInfo.driverId){
                busInfo.driverId=driverList[i].id;
            }
        }
        if (editState){
            axios.post(`${Address}/busroute`,busInfo).then(()=>{
                axios.get(`${Address}/busroute`).then((res)=>{
                    // eslint-disable-next-line no-plusplus
                    for (let i = 0; i < res.data.length; i++) {
                        res.data[i].status = sample(['正常','异常']);
                    }
                    setBusLists(res.data);
                })
            })
            axios.put(`${Address}/driver`,{id:busInfo.driverId,busNum:busInfo.number}).then(()=>{
                // console.log(res);
                axios.get(`${Address}/driver`).then((res)=>{
                    console.log(res);
                    const tmp = [];
                    // eslint-disable-next-line no-plusplus
                    for (let i = 0; i < res.data.length; i++) {
                        if (res.data[i].busNum===null || res.data[i].busNum.length===0){
                            tmp.push(res.data[i]);
                        }
                    }
                    console.log(tmp);
                    setDriverList(tmp);
                })
            });
        }
        else {
            axios.put(`${Address}/driver/updateByBusNum`,{busNum: busInfo.number}).then(()=>{
                axios.put(`${Address}/busroute`,busInfo).then(()=>{
                    axios.get(`${Address}/busroute`).then((res)=>{
                        // eslint-disable-next-line no-plusplus
                        for (let i = 0; i < res.data.length; i++) {
                            res.data[i].status = sample(['正常','异常']);
                        }
                        setBusLists(res.data);
                    })
                })
                axios.put(`${Address}/driver`,{id:busInfo.driverId,busNum:busInfo.number}).then(()=>{
                    // console.log(res);
                    axios.get(`${Address}/driver`).then((res)=>{
                        console.log(res);
                        const tmp = [];
                        // eslint-disable-next-line no-plusplus
                        for (let i = 0; i < res.data.length; i++) {
                            if (res.data[i].busNum===null || res.data[i].busNum.length===0){
                                tmp.push(res.data[i]);
                            }
                        }
                        console.log(tmp);
                        setDriverList(tmp);
                    })
                });
            });
            // console.log(busInfo);

        }

        setBusInfoDialog(false);
        setBusInfo({});

    }
    function overwriteBusInfo(busId) {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < busLists.length; i++) {
            if(busLists[i].id === busId){
                busInfo.id=busLists[i].id;
                busInfo.name=busLists[i].name;
                busInfo.driverId=busLists[i].driverName;
                busInfo.number=busLists[i].number;
                busInfo.stateList=busLists[i].stateList;
                // console.log(busInfo);
                setBusInfo(busInfo);
                break;
            }
        }
        setEditState(false);
        setBusInfoDialog(true);
    }
    useEffect(()=>{
        axios.get(`${Address}/driver`).then((res)=>{
            // console.log(res);
            const tmp = [];
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < res.data.length; i++) {
                if (res.data[i].busNum===null || res.data[i].busNum.length===0){
                    tmp.push(res.data[i]);
                }
            }
            // console.log(res.data);
            setDriverList(tmp);
        })
        axios.get(`${Address}/busroute`).then((res)=>{
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < res.data.length; i++) {
                res.data[i].status = sample(['正常','异常']);
                // if (res.data[i].driverId===0){
                //     res.data[i].driverName=null;
                // } else {
                //     axios.get(`${Address}/driver/${res.data[i].driverId}`).then((re)=>{
                //         res.data[i].driverName=re.data[0].name;
                //     })
                // }
            }
            // console.log(res.data);
            setBusLists(res.data);
        })
    },[]);
    return (
        <Page title="Bus">
            <Dialog open={busInfoDialog} onClose={()=>{
                setBusInfoDialog(false);
                setBusInfo({});
            }}
                fullWidth
            >
                <DialogTitle>填写信息</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={5} sx={{ justifyContent:'center' }}>
                            <Grid item xs={6.7}>
                                <TextField
                                    margin="dense"
                                    id="name"
                                    label="公交线路"
                                    name="productName"
                                    defaultValue={busInfo.name}
                                    fullWidth
                                    variant="standard"
                                    onChange={(event)=>{
                                        const tmp = busInfo;
                                        tmp.name = event.target.value;
                                        setBusInfo(tmp);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6.7}>
                                <TextField
                                    margin="dense"
                                    id="name"
                                    label="公交车车牌"
                                    name="productName"
                                    fullWidth
                                    defaultValue={busInfo.number}
                                    variant="standard"
                                    onChange={(event)=>{
                                        const tmp = busInfo;
                                        tmp.number = event.target.value;
                                        setBusInfo(tmp);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6.7} sx={{ mt: 2 }}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={driverList.map((option)=> option.name)}
                                    defaultValue={busInfo.driverId}
                                    onChange={(event, newValue) => {
                                        const tmp = busInfo;
                                        tmp.driverId = newValue;
                                        setBusInfo(tmp);
                                    }}
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField {...params} label="公交车司机" />}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>{
                            setBusInfoDialog(false);
                            setBusInfo({});
                        }}>取消</Button>
                        {/* eslint-disable-next-line react/jsx-no-bind */}
                        <Button type="submit" onClick={()=>insertBus()}>确认</Button>
                    </DialogActions>
            </Dialog>
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        公交信息
                    </Typography>
                    <Button variant="contained"  startIcon={<Iconify icon="eva:plus-fill" />} onClick={()=>{
                        setBusInfoDialog(true);
                        setEditState(true);
                    }}>
                        添加公交
                    </Button>
                </Stack>

                <Card>
                    <UserListToolbar setListInfo={setBusLists} name='busroute' selected={selected} setSelected={setSelected} filterName={filterName} onFilterName={handleFilterByName} />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <UserListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={busLists.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        const { id, name, number, status, driverName, driverId, stateList } = row;
                                        const isItemSelected = selected.indexOf(id) !== -1;

                                        return (
                                            <TableRow
                                                hover
                                                key={id}
                                                tabIndex={-1}
                                                role="checkbox"
                                                selected={isItemSelected}
                                                aria-checked={isItemSelected}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox checked={isItemSelected}
                                                              onChange={(event) => handleClick(event, id)}/>
                                                </TableCell>
                                                {/* <TableCell component="th" scope="row" padding="none"> */}
                                                {/*    <Stack direction="row" alignItems="center" spacing={2}> */}
                                                {/*        /!* <Avatar alt={name} src={avatarUrl} /> *!/ */}
                                                {/*        <Typography variant="subtitle2" noWrap> */}
                                                {/*            {name} */}
                                                {/*        </Typography> */}
                                                {/*    </Stack> */}
                                                {/* </TableCell> */}
                                                <TableCell align="left">{name}</TableCell>
                                                <TableCell align="left">{number}</TableCell>
                                                <TableCell align="left">{driverName}</TableCell>
                                                <TableCell align="left">{driverId===0? '' : driverId}</TableCell>
                                                <TableCell align="left">
                                                    <Label variant="ghost"
                                                           color={(status === '异常' && 'error') || 'success'}>
                                                        {status}
                                                    </Label>
                                                </TableCell>

                                                <TableCell align="right">
                                                    {/* eslint-disable-next-line react/jsx-no-bind */}
                                                    <BusMoreMenu overwriteBusInfo={overwriteBusInfo} busId={id} stateList={stateList} setBusLists={setBusLists} busLists={busLists}/>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 53 * emptyRows }}>
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>

                                {isUserNotFound && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                <SearchNotFound searchQuery={filterName} />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                )}
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={driverList.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Container>
        </Page>
    );
}
