import {filter, sample} from 'lodash';
// import { sentenceCase } from 'change-case';
import { useState } from 'react';
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
    TablePagination, Dialog, DialogTitle, Box, DialogContent, Grid, DialogActions, TextField,
} from '@mui/material';
// components
import {faker} from "@faker-js/faker";
import {Autocomplete} from "@mui/lab";
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';
import BusMoreMenu from "../sections/@dashboard/bus/BusMoreMenu";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: '公交线路', label: '公交线路', alignRight: false },
    { id: '车牌', label: '车牌', alignRight: false },
    { id: '司机', label: '司机', alignRight: false },
    { id: '司机编号', label: '司机编号', alignRight: false },
    { id: '状态', label: '状态', alignRight: false },
    { id: '' },
];

const busLists = [...Array(24)].map(() => ({
    id: faker.datatype.uuid(),
    // avatarUrl: `/static/mock-images/avatars/avatar_${index + 1}.jpg`,
    name: sample(['59路','38路','3路']),
    company: sample(['鲁B88888','鲁B66666','鲁B55555']),
    isVerified: sample([4124,12313,123]),
    status: sample(['正常', '异常']),
    role: sample([
        '张三',
        '李四',
        '王五',
        // 'UX Designer',
        // 'UI/UX Designer',
        // 'Project Manager',
        // 'Backend Developer',
        // 'Full Stack Designer',
        // 'Front End Developer',
        // 'Full Stack Developer',
    ]),
}));
// ----------------------------------------------------------------------
const driver = [
    { id: '123', name: '张三'}
]
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
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = USERLIST.map((n) => n.name);
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
    const handleSubmit = (event) => {
        event.preventDefault();
        // const data = new FormData(event.currentTarget);
        // eslint-disable-next-line no-console,camelcase
    };

    return (
        <Page title="Bus">
            <Dialog open={busInfoDialog} onClose={()=>{
                setBusInfoDialog(false);
            }}
                fullWidth
            >
                <DialogTitle>填写信息</DialogTitle>
                {/* eslint-disable-next-line react/jsx-no-bind */}
                <Box component="form" onSubmit={handleSubmit}>
                    <DialogContent>
                        <Grid container spacing={5} sx={{ justifyContent:'center' }}>
                            <Grid item xs={6.7}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="公交线路"
                                    name="productName"
                                    fullWidth
                                    variant="standard"
                                />
                            </Grid>
                            <Grid item xs={6.7}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="公交车车牌"
                                    name="productName"
                                    fullWidth
                                    variant="standard"
                                />
                            </Grid>
                            <Grid item xs={6.7} sx={{ mt: 2 }}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={driver.map((option)=> option.name)}
                                    onChange={(event, newValue) => {
                                        console.log(newValue);
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
                        }}>取消</Button>
                        {/* eslint-disable-next-line react/jsx-no-bind */}
                        <Button type="submit">确认</Button>
                    </DialogActions>
                </Box>
            </Dialog>
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        公交信息
                    </Typography>
                    <Button variant="contained"  startIcon={<Iconify icon="eva:plus-fill" />} onClick={()=>{
                        setBusInfoDialog(true);
                    }}>
                        添加公交
                    </Button>
                </Stack>

                <Card>
                    <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

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
                                        const { id, name, role, status, company, isVerified } = row;
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
                                                <TableCell align="left">{company}</TableCell>
                                                <TableCell align="left">{role}</TableCell>
                                                <TableCell align="left">{isVerified}</TableCell>
                                                <TableCell align="left">
                                                    <Label variant="ghost"
                                                           color={(status === '异常' && 'error') || 'success'}>
                                                        {status}
                                                    </Label>
                                                </TableCell>

                                                <TableCell align="right">
                                                    <BusMoreMenu />
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
                        count={USERLIST.length}
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
