
// material
import {
    Card,
    Stack,
    Container,
    Typography, Box, Pagination
} from '@mui/material';
// components
// import axios from "axios";
// import {faker} from "@faker-js/faker";

import {
    DataGrid,
    gridPageCountSelector,
    gridPageSelector,
    GridToolbar,
    useGridApiContext,
    useGridSelector
} from "@mui/x-data-grid";
import {useEffect} from "react";
import Page from '../components/Page';

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


// const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function UserLogInfo() {


    // const [scene, setScene] = useState(null);
    const columns = [
        { field: 'name', headerName: '用户', flex: 1, minWidth: 100 },
        { field: 'onlineTime', headerName: '上线时间', flex: 1.5, minWidth: 100 },
        { field: 'offlineTime', headerName: '下线时间', flex: 1.5, minWidth: 100 },
        { field: 'terminalIP', headerName: '终端IP', flex: 1, minWidth: 100 },
        { field: 'terminalMac', headerName: '终端MAC', flex: 2, minWidth: 100 },
    ];

    const logInfo = [
        {
            id: 1,
            name: 'user1',
            onlineTime: '2022-5-23 18:03',
            offlineTime: '2022-5-23 18:21',
            terminalIP:'192.168.1.2',
            terminalMac:'75f8ed0f-810a-4ff5-8e64-67c81312d01c'
        },
        {
            id: 2,
            name: 'user2',
            onlineTime: '2022-5-25 11:03',
            offlineTime: '2022-5-25 12:11',
            terminalIP:'192.168.3.2',
            terminalMac:'52f8870f-8daa-4f15-8e64-67c81s12d01c'
        },
        {
            id: 3,
            name: 'user3',
            onlineTime: '2022-6-21 15:03',
            offlineTime: '2022-5-21 15:08',
            terminalIP:'192.168.10.2',
            terminalMac:'92fa870f-8dda-bf15-8e64-67213s12dfdc'
        },
    ]

    useEffect(()=>{
    },[]);
    return (
        <Page title="Route">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        用户日志信息
                    </Typography>
                    {/* <Button variant="contained" component={RouterLink} to="#" startIcon={<Iconify icon="eva:plus-fill" />}> */}
                    {/*    添加乘客 */}
                    {/* </Button> */}
                </Stack>

                <Card sx={{height: `calc(100vh - 250px)`, width: '100%'}}>
                    <Box sx={{ margin: 2,height: '90%' }}>
                        <DataGrid
                            // autoHeight
                            autoPageSize
                            rows={logInfo}
                            columns={columns}
                            // pageSize={5}
                            components={{
                                Pagination: CustomPagination,
                                Toolbar: GridToolbar
                            }}
                        />
                    </Box>
                </Card>
            </Container>
        </Page>
    );
}
