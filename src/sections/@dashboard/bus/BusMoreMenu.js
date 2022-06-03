import {useRef, useState} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from "axios";
// material
import {
    Menu,
    MenuItem,
    IconButton,
    ListItemIcon,
    ListItemText,
    DialogActions,
    Button,
    TextField,
    Grid, DialogTitle, Dialog, Box, DialogContent
} from '@mui/material';
// import { DataGrid } from '@mui/x-data-grid';
// component
import Iconify from '../../../components/Iconify';
import {Address} from "../../../store/Address";


// ----------------------------------------------------------------------

// eslint-disable-next-line react/prop-types
export default function BusMoreMenu({busId, stateList, setBusLists, busLists}) {
    const ref = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [roadOpen, setRoadOpen] = useState(false);
    // eslint-disable-next-line react/prop-types
    const [road, setRoad] = useState(stateList===null? [1] : stateList.split(','));

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const state = [];
        // eslint-disable-next-line no-plusplus
        for(let i = 1;i<=road.length;i++){
            state.push(data.get(i.toString()));
        }
        console.log(state.toString());
        axios.put(`${Address}/busroute`,{id: busId, stateList: state.toString()}).then();
        setRoadOpen(false);
        // eslint-disable-next-line no-plusplus,react/prop-types
        for (let i = 0; i < busLists.length; i++) {
            // eslint-disable-next-line react/prop-types
            if (busLists[i].id===busId) {
                // eslint-disable-next-line react/prop-types
                busLists[i].stateList=state.toString();
                setBusLists(busLists);
                break;
            }
        }
        // setRoad([1]);

    };
    // useEffect(() => {
    //
    //     return () => {
    //         setRoad([1]);
    //     }
    // },[]);
    return (
        <>
            <IconButton ref={ref} onClick={() => {
                setIsOpen(true);
            }}>
                <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
            </IconButton>

            <Menu
                open={isOpen}
                anchorEl={ref.current}
                onClose={() => setIsOpen(false)}
                PaperProps={{
                    sx: { width: 200, maxWidth: '100%' },
                }}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem sx={{ color: 'text.secondary' }}>
                    <ListItemIcon>
                        <Iconify icon="eva:trash-2-outline" width={24} height={24} />
                    </ListItemIcon>
                    <ListItemText primary="删除" primaryTypographyProps={{ variant: 'body2' }} />
                </MenuItem>

                <MenuItem component={RouterLink} to="#" sx={{ color: 'text.secondary' }} onClick={()=> setRoadOpen(true)}>
                    <ListItemIcon>
                        <Iconify icon="eva:edit-fill" width={24} height={24} />
                    </ListItemIcon>
                    <ListItemText primary="添加站点" primaryTypographyProps={{ variant: 'body2' }} />
                </MenuItem>
            </Menu>
            <Dialog open={roadOpen} onClose={()=>{
                setRoadOpen(false);
                // setRoad([1]);
            }}
                    fullWidth
                    scroll='paper'
            >
                <DialogTitle>填写信息</DialogTitle>
                {/* eslint-disable-next-line react/jsx-no-bind */}
                <Box component="form" onSubmit={handleSubmit}>
                    <DialogContent>
                        <Box sx={{ display:'flex', flexDirection:'row'}} >
                            {/* <Typography variant="h4" gutterBottom> */}
                            {/*    公交 */}
                            {/* </Typography> */}
                            <Button variant="contained"  startIcon={<Iconify icon="eva:plus-fill" />} onClick={()=>{
                                setRoad((road) => [...road, road.length + 1]);
                            }
                            }>
                                添加
                            </Button>
                            <Button variant="contained"
                                    disabled={road.length===1}
                                    sx={{ ml: 2 }}
                                    startIcon={<Iconify icon="eva:minus-fill" />} onClick={()=>{
                                setRoad(road.slice(0,road.length-1));
                            }
                            }>
                                删除
                            </Button>
                        </Box>
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            {/* <DataGrid checkboxSelection hideFooter rows={rows} columns={columns} /> */}
                            {road.map((index)=>(
                                    <Grid item xs={12} key={index}>
                                        <TextField
                                            // autoFocus
                                            // eslint-disable-next-line no-nested-ternary,react/prop-types
                                            defaultValue={stateList===null? '' : (stateList.split(',').length>=index ? stateList.split(',')[index-1] : '')}
                                            margin="dense"
                                            // id={index.toString()}
                                            label="站点名"
                                            name={index.toString()}
                                            fullWidth
                                            variant="standard"
                                        />
                                    </Grid>
                            ))
                            }
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>{
                            setRoadOpen(false);
                            // setRoad([1]);
                        }}>取消</Button>
                        {/* eslint-disable-next-line react/jsx-no-bind */}
                        <Button type="submit">确认</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    );
}
