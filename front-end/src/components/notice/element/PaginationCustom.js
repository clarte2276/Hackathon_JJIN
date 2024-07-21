import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import './ElementNotice.css';

const PaginationCustom = ({ currentPage, totalPages, onPageChange }) => {
  const handleChange = (event, value) => {
    onPageChange(value);
  };

  return (
    <Stack spacing={2}>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handleChange}
        shape="rounded"
        variant="outlined"
        prevIcon={<span>&lt; Previous</span>}
        nextIcon={<span>Next &gt;</span>}
      />
    </Stack>
  );
};

export default PaginationCustom;
