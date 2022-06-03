import PropTypes from 'prop-types';
// material
import { Paper, Typography } from '@mui/material';

// ----------------------------------------------------------------------

SearchNotFound.propTypes = {
  searchQuery: PropTypes.string,
};

export default function SearchNotFound({ searchQuery = '', ...other }) {
  return (
    <Paper {...other}>
      <Typography gutterBottom align="center" variant="subtitle1">
        查找失败
      </Typography>
      <Typography variant="body2" align="center">
        找不到包含 &nbsp;
        <strong>&quot;{searchQuery}&quot;</strong> 的结果. 请检查或查询别的关键字
      </Typography>
    </Paper>
  );
}
