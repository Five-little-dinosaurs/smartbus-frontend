import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from "axios";
// material
import {
    Menu,
    MenuItem,
    IconButton,
    ListItemIcon,
    ListItemText,
    DialogTitle,
    Box,
    DialogContent,
    Button, Grid, TextField, DialogActions, Dialog
} from '@mui/material';
// component
import Iconify from '../../../components/Iconify';
import {Address} from "../../../store/Address";

// ----------------------------------------------------------------------

// eslint-disable-next-line react/prop-types
export default function UserMoreAction({id}) {
    const ref = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [accept, setAccept] = useState(false);
    const handleSubmit = () => {
        console.log(id);
        axios.put(`${Address}/feedback`,{userId: id, status: 1}).then();
        setAccept(false);
    };

    return (
        <>
            <IconButton ref={ref} onClick={() => setIsOpen(true)}>
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
                    <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
                </MenuItem>

                <MenuItem component={RouterLink} to="#" sx={{ color: 'text.secondary' }} onClick={()=> setAccept(true)}>
                    <ListItemIcon>
                        <Iconify icon="eva:edit-fill" width={24} height={24} />
                    </ListItemIcon>
                    <ListItemText primary="确认受理" primaryTypographyProps={{ variant: 'body2' }} />
                </MenuItem>
            </Menu>

            <Dialog open={accept} onClose={()=>{
                setAccept(false);
                // setRoad([1]);
            }}
                    fullWidth
                    scroll='paper'
            >
                <DialogTitle>填写信息</DialogTitle>
                {/* eslint-disable-next-line react/jsx-no-bind */}
                <Box component="form" onSubmit={handleSubmit}>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            {/* <DataGrid checkboxSelection hideFooter rows={rows} columns={columns} /> */}
                            {<Grid item xs={12}>
                                <TextField
                                    // autoFocus
                                    // eslint-disable-next-line no-nested-ternary,react/prop-types
                                    margin="dense"
                                    label="说出你的解决方式"
                                    fullWidth
                                    variant="standard"
                                />
                            </Grid>

                            }
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>{
                            setAccept(false);
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
