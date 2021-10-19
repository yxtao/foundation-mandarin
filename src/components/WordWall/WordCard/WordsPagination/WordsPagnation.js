import React from 'react';
import TablePagination from '@material-ui/core/TablePagination';

const WordsPagination = (props) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(4);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    props.callbackCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    props.callbackRowsPerPage(event.target.value);
  };

  return (
    <TablePagination
      component="div"
      count={props.wordsNum}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      rowsPerPageOptions = {[8,16,32,64]}
    />
  );
}
export default WordsPagination
