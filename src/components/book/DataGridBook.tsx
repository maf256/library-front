import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DataGrid,
  GridColDef,
  GridSlots,
  GridToolbarContainer,
} from "@mui/x-data-grid";

import ModalAddEditBook from "./ModalAddEditBook";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/material";
import ModalAuthor from "../author/ModalAuthor";
import ModalGenre from "../genre/ModalGenre";

interface Genre {
  id: number;
  name: string;
}

interface Author {
  id: number;
  name: string;
}
interface Book {
  id: number;
  title: string;
  publication_year: Number | null;
  copies_available: string;
  total_copies: string;
  genres: Genre[];
  authors: Author[];
  genreIds: number[] | null;
  authorIds: number[] | null;
  author_name?: string; // Optional for display
  genre_name?: string; // Optional for display
}

export default function DataGridBooks() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState<boolean>(false);
  const [openModalAuthor, setOpenModalAuthor] = React.useState<boolean>(false);
  const [openModalGenre, setOpenModalGenre] = React.useState(false);

  const [editMode, setEditMode] = useState<boolean>(false);
  const [book, setBook] = useState<Book>({
    id: 0, // Default id; adjust based on your needs
    title: "",
    genres: [],
    authors: [],
    publication_year: null,
    copies_available: "",
    total_copies: "",
    genreIds: null,
    authorIds: null,
  });

  const {
    data: books = [],
    error,
    isLoading,
  } = useQuery<Book[]>({
    queryKey: ["books"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/book");
      if (!response.ok) throw new Error("Failed to fetch books");
      return response.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleEdit = (event: any, cellValues: any) => {
    setBook(cellValues.row);
    setOpen(true);
    setEditMode(true);
  };

  const handleRemove = async (event: any, cellValues: any) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );
    if (!confirmDelete) return;

    try {
      await fetch(`http://localhost:3000/book/${cellValues.row.id}`, {
        method: "DELETE",
      });
      alert("Successfully deleted book");
      queryClient.invalidateQueries({
        queryKey: ["books"],
      }); // Refetch after deletion
    } catch (error) {
      console.error("Error:", error);
      alert("Error deleting book. Please try again.");
    }
  };

  const columns: GridColDef[] = [
    { field: "title", headerName: "Title", width: 200 },
    {
      field: "genres",
      headerName: "Genres",
      width: 200,
      valueGetter: (params: []) => {
        return (
          params?.map((genre: { name: string }) => genre.name).join(", ") ||
          "No genres"
        );
      },
    },
    {
      field: "authors",
      headerName: "Authors",
      width: 200,
      valueGetter: (params: []) => {
        return (
          params?.map((author: { name: string }) => author.name).join(", ") ||
          "No authors"
        );
      },
    },
    { field: "publication_year", headerName: "Publication Year", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (cellValues) => (
        <>
          <EditIcon
            sx={{ cursor: "pointer", m: 1 }}
            onClick={(event) => handleEdit(event, cellValues)}
          />
          <CloseIcon
            sx={{ cursor: "pointer", m: 1 }}
            onClick={(event) => handleRemove(event, cellValues)}
          />
        </>
      ),
    },
  ];
  // _______________________________________________________________________________

  function EditToolbar() {
    return (
      <GridToolbarContainer>
        <Button color="primary" onClick={() => setOpen(true)}>
          Add Book
        </Button>
        <Button color="primary" onClick={() => setOpenModalAuthor(true)}>
          Authors
        </Button>
        <Button color="primary" onClick={() => setOpenModalGenre(true)}>
          Genres
        </Button>
      </GridToolbarContainer>
    );
  }

  // _________________________

  return (
    <>
      <ModalAuthor
        openModalAuthor={openModalAuthor}
        setOpenModalAuthor={setOpenModalAuthor}
      />
      <ModalGenre
        openModalGenre={openModalGenre}
        setOpenModalGenre={setOpenModalGenre}
      />

      {/* <Button sx={{ mb: 2 }} variant="contained" onClick={() => setOpen(true)}>Add Book</Button> */}
      <ModalAddEditBook
        open={open}
        setOpen={setOpen}
        book={book}
        setBook={setBook}
        isEdit={editMode}
        setEdit={setEditMode}
      />
      <DataGrid
        rows={books} // Pass correctly formatted rows
        columns={columns}
        slots={{
          toolbar: EditToolbar as GridSlots["toolbar"],
        }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
      />
    </>
  );
}
