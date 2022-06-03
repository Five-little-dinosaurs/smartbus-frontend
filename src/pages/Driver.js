import {filter} from 'lodash';
// import { sentenceCase } from 'change-case';
import {useEffect, useState} from 'react';
// import { Link as RouterLink } from 'react-router-dom';
// material
import axios from "axios";
import {
    Card,
    Table,
    Stack,
    Avatar,
    Button,
    Checkbox,
    TableRow,
    TableBody,
    TableCell,
    Container,
    Typography,
    TableContainer,
    TablePagination, Dialog, DialogTitle, Box, DialogContent, TextField, DialogActions,
} from '@mui/material';
// components
// import {faker} from "@faker-js/faker";
// import Label from '../components/Label';
// mock
// import USERLIST from '../_mock/user';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
import SearchNotFound from '../components/SearchNotFound';
import Scrollbar from '../components/Scrollbar';
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import {Address} from "../store/Address";

registerPlugin(
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    FilePondPluginFileValidateSize,
    FilePondPluginFileValidateType,
    FilePondPluginFileEncode,
    FilePondPluginImageResize,
    FilePondPluginImageCrop,
    FilePondPluginImageTransform
);

// ----------------------------------------------------------------------
// const USERLIST = [...Array(24)].map((_, index) => ({
//     id: faker.datatype.uuid(),
//     avatarUrl: `/static/mock-images/avatars/avatar_${index + 1}.jpg`,
//     name: faker.name.findName(),
//     company: faker.company.companyName(),
//     // isVerified: faker.datatype.boolean(),
//     // status: sample(['active', 'banned']),
//     role: sample([
//         'Leader',
//         'Hr Manager',
//         'UI Designer',
//         'UX Designer',
//         'UI/UX Designer',
//         'Project Manager',
//         'Backend Developer',
//         'Full Stack Designer',
//         'Front End Developer',
//         'Full Stack Developer',
//     ]),
// }));
const TABLE_HEAD = [
    { id: '司机', label: '司机', alignRight: false },
    { id: '身份证', label: '身份证', alignRight: false },
    { id: '驾驶车辆车牌', label: '驾驶车辆车牌', alignRight: false },
    // { id: 'isVerified', label: 'Verified', alignRight: false },
    // { id: 'status', label: 'Status', alignRight: false },
    // { id: '' },
];

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

export default function Driver() {
    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [driverInfoDialog, setDriverInfoDialog] = useState(false);

    const [files, setFiles] = useState([]);
    const [base64, setBase64] = useState('');

    const [driverList, setDriverList] = useState([]);

    const [driver, setDriver] = useState({
        name: '',
        cardNum: ''
    })
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = driverList.map((n) => n.id);
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

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - driverList.length) : 0;

    const filteredUsers = applySortFilter(driverList, getComparator(order, orderBy), filterName);

    const isUserNotFound = filteredUsers.length === 0;

    const handleAddFile = (err, file) => {
        console.log(file?.getFileEncodeDataURL());
        setBase64(file?.getFileEncodeDataURL());
        // console.log(base64);
    };
    const insertDriver = () => {
        console.log(driver);
        console.log(base64);
        const tmp={
            name:driver.name,
            cardNum:driver.cardNum,
            photo:base64
        }
        axios.post(`${Address}/driver`,tmp).then((res)=>{
            console.log(res);
            axios.get(`${Address}/driver`).then((res)=>{
                // console.log(res.data);
                setDriverList(res.data);
                setDriverInfoDialog(false);
            })
        })
        // event.preventDefault();
        // const data = new FormData(event.currentTarget);
        // eslint-disable-next-line no-console,camelcase
    };
    useEffect(()=>{
        axios.get(`${Address}/driver`).then((res)=>{
            console.log(res.data);
            setDriverList(res.data);
        })
    },[]);
    return (
        <Page title="User">
            <Dialog open={driverInfoDialog} onClose={()=>{
                setDriverInfoDialog(false);
                setFiles([]);
            }}
            >
                <DialogTitle>填写信息</DialogTitle>
                {/* eslint-disable-next-line react/jsx-no-bind */}
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection:'row'}} >
                            <Box sx={{ width:130, height: 130}}>
                                <Box sx={{ mt: 6}}>
                                    <FilePond
                                        files={files}
                                        onaddfile={handleAddFile}
                                        onupdatefiles={setFiles}
                                        allowMultiple={false}
                                        stylePanelLayout="compact circle"
                                        imageResizeTargetWidth={120}
                                        imageResizeTargetHeight={120}
                                        imagePreviewHeight={70}
                                        imageCropAspectRatio="1:1"
                                        maxFileSize="5MB"
                                        acceptedFileTypes={['image/png', 'image/jpeg']}
                                        maxFiles={1}
                                        name="avatar"
                                        labelIdle='上传证件照'
                                    />
                                </Box>

                            </Box>
                            <Box sx={{ margin: 5, display:'flex', flexDirection:'column'}}>
                                <Box>
                                    <TextField
                                        margin="dense"
                                        id="name"
                                        label="姓名"
                                        name="productName"
                                        fullWidth
                                        variant="standard"
                                        onChange={(event)=>{
                                            const tmp = driver;
                                            tmp.name = event.target.value;
                                            setDriver(tmp);
                                        }}
                                    />
                                </Box>
                                <Box>
                                    <TextField
                                        margin="dense"
                                        id="name"
                                        label="身份证"
                                        name="productName"
                                        fullWidth
                                        variant="standard"
                                        onChange={(event)=>{
                                            const tmp = driver;
                                            tmp.cardNum = event.target.value;
                                            setDriver(tmp);
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>{
                            setDriverInfoDialog(false);
                            setFiles([]);
                        }}>取消</Button>
                        {/* eslint-disable-next-line react/jsx-no-bind */}
                        <Button type="submit" onClick={()=>insertDriver()}>确认</Button>
                    </DialogActions>
            </Dialog>
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        司机信息
                    </Typography>
                    <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}
                            onClick={()=>{
                                setDriverInfoDialog(true);
                            }}
                    >
                        添加司机
                    </Button>
                </Stack>

                <Card>
                    <UserListToolbar name='driver' setListInfo={setDriverList} selected={selected} setSelected={setSelected} filterName={filterName} onFilterName={handleFilterByName} />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <UserListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={driverList.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        const { id, name, cardNum, photo, busNum } = row;
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
                                                    <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, id)} />
                                                </TableCell>
                                                <TableCell component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={2}>
                                                        <Avatar alt={name} src={photo} />
                                                        <Typography variant="subtitle2" noWrap>
                                                            {name}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell align="left">{cardNum}</TableCell>
                                                <TableCell align="left">{busNum}</TableCell>
                                                {/* <TableCell align="left">{role}</TableCell> */}

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
