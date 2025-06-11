import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TableSortLabel, Box} from '@mui/material';
import { grey } from "@mui/material/colors";

const Tabla2 = ({
  columns,
  data,
  sortDirection,
  sortBy,
  onSort
}) => {
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={sortBy === column.id}
                      direction={sortBy === column.id ? sortDirection : 'asc'}
                      onClick={() => onSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody sx={{ 
            borderCollapse: 'collapse',
            '& td, & th': {
              border: '1px solid',
              borderColor: 'divider' 
            }
          }}>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex} sx={rowIndex % 2? { background : grey[300] }:{ background : "white"}}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align || 'left'}>
                        {column.render ? column.render(value, row) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  {/* <Box py={3}>No hay informacion disponible</Box> */}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default Tabla2;