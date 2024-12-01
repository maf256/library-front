import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { GridValueFormatter } from '@mui/x-data-grid/models';
import { useQueryClient } from "@tanstack/react-query";
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { format } from 'date-fns';

interface Author {
  id: number;
  name: string;
  biography: string;
  birthday: string;
}

interface ChildComponentProps {
  data: any;
  setOnEdit: (value: number) => void;
}

export default function DataGridAuthor({ data, setOnEdit }: ChildComponentProps) {
  const queryClient = useQueryClient();

  const handleSave = (event: React.MouseEvent, cellValues: { row: Author }) => {
    setOnEdit(cellValues.row.id);
  };

  const handleRemove = async (event: React.MouseEvent, cellValues: { row: Author }) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this author?');
    if (!confirmDelete) return;
    try {
      const response = await fetch(`http://localhost:3000/author/${cellValues.row.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(errorDetails.message || 'Failed to delete author');
      }
      await queryClient.invalidateQueries({
        queryKey: ['authors'],
        refetchType: 'active',
      });
      alert('Author deleted successfully');
    } catch (error) {
      console.error(error);
      alert('Error deleting author: ' + error);
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      editable: false,
    },
    {
      field: 'biography',
      headerName: 'Biography',
      width: 200,
      editable: false,
    },
    {
      field: 'birthday',
      headerName: 'Birthday',
      width: 300,
      editable: false,
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 100,
      renderCell: (cellValues) => (
        <>
          <EditIcon sx={{ cursor: 'pointer', m: 1 }} onClick={(event) => handleSave(event, cellValues)} />
          <CloseIcon sx={{ cursor: 'pointer', m: 1 }} onClick={(event) => handleRemove(event, cellValues)} />
        </>
      ),
    },
  ];

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
      />
    </Box>
  );
}
