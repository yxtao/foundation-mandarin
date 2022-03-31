import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from "recoil";
import { storyPagestate, storyPageCountPerPageState } from '../../../store/storyWordsAtoms';
import TablePagination from '@material-ui/core/TablePagination';

const ReadingPagination = (props) => {
  const [pageNumState, setPageNumState] = useRecoilState(storyPagestate);
  const [options,setOptions] = useState([4])
  const [rowsPerPage, setRowsPerPage] = useRecoilState(storyPageCountPerPageState)
  useEffect(()=>{
      const temp = [4];
      let totalNum = props.wordsNum;
      let current = 4;
      while(current < totalNum/2){
         current = current*2;
         temp.push(current);
      }
     setOptions(temp);
  },[props.wordsNum])

  const handleChangePage = (event, newPage) => {
    setPageNumState(newPage);
    props.callbackCurrentPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    props.callbackRowsPerPage(event.target.value);
  };

  return (
    <TablePagination
      size="small"
      component="div"
      count={props.wordsNum}
      page={pageNumState}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      rowsPerPageOptions = {options}
      labelRowsPerPage =""
    />
  );
}
export default ReadingPagination