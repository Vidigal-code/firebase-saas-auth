import { Box, Pagination } from '@mui/material';

interface Props {
  page: number;
  pageCount: number;
  visible: boolean;
  onChange: (event: unknown, value: number) => void;
}

export const PaginationBar = ({ page, pageCount, visible, onChange }: Props) => {
  if (!visible) return null;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, px: 1 }}>
      <Pagination
        count={pageCount}
        page={page}
        onChange={onChange}
        color="primary"
        shape="rounded"
        size="small"
        showFirstButton
        showLastButton
        sx={{
          '& .MuiPagination-ul': {
            flexWrap: 'nowrap',
          },
        }}
      />
    </Box>
  );
};
