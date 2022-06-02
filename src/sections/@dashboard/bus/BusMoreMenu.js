import {useEffect, useRef, useState} from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
    Grid, DialogTitle, Dialog, Box, DialogContent, Stack, Typography
} from '@mui/material';
// component
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

export default function BusMoreMenu() {
    const ref = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [roadOpen, setRoadOpen] = useState(false);
    const [road, setRoad] = useState([1]);
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        // eslint-disable-next-line no-plusplus
        for(let i = 1;i<=road.length;i++){
            console.log(data.get(i.toString()));
        }

        console.log(road);
        setRoad([1]);
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
                    <ListItemText primary="添加" primaryTypographyProps={{ variant: 'body2' }} />
                </MenuItem>
            </Menu>
            <Dialog open={roadOpen} onClose={()=>{
                setRoadOpen(false);
                setRoad([1]);
            }}
                    fullWidth
                    scroll='paper'
            >
                <DialogTitle>填写信息</DialogTitle>
                {/* eslint-disable-next-line react/jsx-no-bind */}
                <Box component="form" onSubmit={handleSubmit}>
                    <DialogContent>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                            <Typography variant="h4" gutterBottom>
                                公交
                            </Typography>
                            <Button variant="contained"  startIcon={<Iconify icon="eva:plus-fill" />} onClick={()=>{
                                setRoad((road) => [...road, road.length + 1]);
                            }
                            }>
                                添加
                            </Button>
                        </Stack>
                        <Grid container spacing={2}>
                            {road.map((index)=>(
                                    <Grid item xs={12} key={index}>
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id={index.toString()}
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
                            setRoad([1]);
                        }}>取消</Button>
                        {/* eslint-disable-next-line react/jsx-no-bind */}
                        <Button type="submit">确认</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    );
}
