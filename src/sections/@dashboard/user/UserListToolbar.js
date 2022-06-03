import PropTypes from 'prop-types';
// material
import { styled } from '@mui/material/styles';
import { Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment } from '@mui/material';
// component
import axios from "axios";
import Iconify from '../../../components/Iconify';
import {Address} from "../../../store/Address";

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
}));

// ----------------------------------------------------------------------

UserListToolbar.propTypes = {
  selected: PropTypes.array,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  setSelected: PropTypes.func,
  name: PropTypes.string,
  setListInfo: PropTypes.func
};

export default function UserListToolbar({ selected, filterName, onFilterName, setSelected, name, setListInfo }) {

  function deleteInfo() {
    const queue = [];
    console.log(name);
    console.log(selected);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < selected.length; i++) {
      queue.push(axios.delete(`${Address}/${name}/${selected[i]}`));
    }
    Promise.all(queue).then((res)=>{
        console.log(res);
        setSelected([]);
        axios.get(`${Address}/${name}`).then((res)=>{
          setListInfo(res.data);
        })
    })
  }

  return (
    <RootStyle
      sx={{
        ...(selected.length > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {selected.length > 0 ? (
        <Typography component="div" variant="subtitle1">
          {selected.length} selected
        </Typography>
      ) : (
        <SearchStyle
          value={filterName}
          onChange={onFilterName}
          placeholder="搜索"
          startAdornment={
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          }
        />
      )}

      {selected.length > 0 ? (
        <Tooltip title="Delete" onClick={()=>{deleteInfo();}}>
          <IconButton>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <Iconify icon="ic:round-filter-list" />
          </IconButton>
        </Tooltip>
      )}
    </RootStyle>
  );
}
