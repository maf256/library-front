import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useQueryClient } from "@tanstack/react-query";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

interface Genre {
  id: number;
  name: string;
}

interface DataGridCProps {
  data: any;
  // data: Genre[];
  setOnEdit: (value: number) => void;
}

export default function DataGridGenres({ data, setOnEdit }: DataGridCProps) {
  const queryClient = useQueryClient();

  const handleEdit = React.useCallback(
    async (id: number) => {
      setOnEdit(id);
    },
    [setOnEdit]
  );

  const handleRemove = React.useCallback(
    async (id: number) => {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this genre?"
      );
      if (!confirmDelete) return;
      try {
        const response = await fetch(`http://localhost:3000/genre/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete genre");

        await queryClient.invalidateQueries({
          queryKey: ["genres"],
          refetchType: "active",
        });
        alert("Genre deleted successfully");
      } catch (error) {
        console.error(error);
        alert("Error deleting genre: " + error);
      }
    },
    [queryClient]
  );

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      width: 200,
      editable: true,
    },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <>
          <EditIcon
            sx={{ cursor: "pointer", m: 1 }}
            onClick={() => handleEdit(params.row.id)}
          />
          <CloseIcon
            sx={{ cursor: "pointer", m: 1 }}
            onClick={() => handleRemove(params.row.id)}
          />
        </>
      ),
    },
  ];

  const rows = data.map((genre: { id: any; name: any }) => ({
    id: genre.id,
    name: genre.name,
  }));

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}
