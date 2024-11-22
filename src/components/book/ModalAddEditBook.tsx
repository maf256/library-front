import React, { useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ModalDialog } from '@mui/joy';
import AvatarList from "./AvatarList";


import { 
  Modal,
  Button,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField, 
} from "@mui/material";
import { set } from "date-fns";

interface Genre {
  id: number;
  name: string;
}

interface Author {
  id: number;
  name: string;
}

interface Book {
  id?: number;
  title: string;
  publication_year: string;
  copies_available: string;
  total_copies: string;
  genres: Genre[];
  authors: Author[];
  genreIds: number[] | null;
  authorIds: number[] | null;
  genre_name?: string;
  author_name?: string;
}


interface ModalBookProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // book: Book;
  // setBook: React.Dispatch<React.SetStateAction<Book>>;
  book: Book;
  setBook: any;
  isEdit?: boolean;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ModalAddEditBook({ open, setOpen, book, setBook, isEdit, setEdit }: ModalBookProps) {
  const queryClient = useQueryClient();

  const [genresFilter, setGenresFilter] = React.useState<Genre[]>([]);
  const [authorsFilter, setAuthorsFilter] = React.useState<Author[]>([]);
  
  const { data: genres = [], error: genreError, isLoading: genreLoading } = useQuery<Genre[]>({
    queryKey: ["genres"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/genre");
      if (!response.ok) throw new Error("Failed to fetch genres");
      return response.json();
    },
  });

  const { data: authors = [], error: authorError, isLoading: authorLoading } = useQuery<Author[]>({
    queryKey: ["authors"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/author");
      if (!response.ok) throw new Error("Failed to fetch authors");
      return response.json();
    },
  });

  // Set initial state when opening modal for a new book
  useEffect(() => {
    if (open && !isEdit && genres.length && authors.length) {
      setBook({
        title: '',
        publication_year: '',
        copies_available: '',
        total_copies: '',
        genres: [],
        authors: [],
        // author_id: authors[0].id,
        // genre_id: genres[0].id,
      });
    }
  }, [open, isEdit, genres, authors, setBook]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setEdit(false);
    setBook({
      title: '',
      publication_year: '',
      copies_available: '',
      total_copies: '',
      genres: [],
      authors: [],
      // author_id: authors[0]?.id || 0,
      // genre_id: genres[0]?.id || 0,
    });

  }, [setOpen, setEdit, setBook, authors, genres]);

  useEffect(() => {
    
    if (book.genres.length==0) setGenresFilter(genres);
    else setGenresFilter(filterGenres);
    if (book.authors.length==0) setAuthorsFilter(authors);
    else setAuthorsFilter(filterAuthors);
  }, [book.genres, book.authors]);

  function filterGenres() {
    const bIds = book.genres.map(item => item.id); // Extract the IDs from array b
    return genres.filter(genre => !bIds.includes(genre.id)); // Filter genres not in b
}

function filterAuthors() {
  const bIds = book.authors.map(item => item.id); // Extract the IDs from array b
  return authors.filter(author => !bIds.includes(author.id)); // Filter genres not in b
}
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  alert(JSON.stringify(book));
  console.log("book before submit",book);
  function extractIds(items: { id: number }[]): number[] {
    return items.map((item) => item.id);
  }
  const genreIds = extractIds(book.genres)
  const authorIds = extractIds(book.authors)
  console.log("genreIds",genreIds);
  console.log("authorIds",authorIds);
  

  const returnedTarget = Object.assign(book,{genreIds},{authorIds});
  // returnedTarget = Object.assign(book,{authorIds});
  console.log("returnedTarget",returnedTarget);
  

    

    try {
      const url = isEdit ? `http://localhost:3000/book/${book.id}` : "http://localhost:3000/book";
      const method = isEdit ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
      });
      if (!response.ok) throw new Error(`Failed to ${isEdit ? 'update' : 'add'} book`);
      
      alert(`Book ${isEdit ? 'updated' : 'added'} successfully`);
      await queryClient.invalidateQueries({
        queryKey: ["books"],
        refetchType: "active",
      });
      handleClose();
    } catch (error) {
      console.error(error);
      alert(`Error ${isEdit ? 'updating' : 'adding'} book`);
    }
  };

  if (genreLoading || authorLoading) return <div>Loading...</div>;
  if (genreError || authorError) return <div>Error loading genres or authors.</div>;

  const handleSelectChange = (
    selectedId: number,
    type: "genres" | "authors",
    allItems: Genre[] | Author[],
    setFilter: React.Dispatch<React.SetStateAction<Genre[] | Author[]>>,
    setBook: React.Dispatch<React.SetStateAction<Book>>
  ) => {
    const selectedItem = allItems.find((item) => item.id === selectedId);
    if (selectedItem) {
      setBook((prevBook) => ({
        ...prevBook,
        [type]: [...prevBook[type], selectedItem],
      }));
      setFilter((prevFilter) => prevFilter.filter((item) => item.id !== selectedId));
    }
  };
  

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalDialog>
        <DialogTitle>Book</DialogTitle>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              required
              label="Title"
              variant="filled"
              size="small"
              value={book.title}
              onChange={(e) => setBook({ ...book, title: e.target.value })}
            />
            <FormControl fullWidth variant="filled" size="small">
              <InputLabel>Genre</InputLabel>
              <Select
                value=""
                onChange={(e) =>
                  handleSelectChange(
                    Number(e.target.value),
                    "genres",
                    genresFilter,
                    setGenresFilter,
                    setBook
                  )
                }
              >
                {genresFilter.map((genre) => (
                  <MenuItem key={genre.id} value={genre.id}>
                    {genre.name}
                  </MenuItem>
                ))}
              </Select>

            </FormControl>
            <AvatarList
              items={book.genres}
              name="Genres"
              onDelete={(id: number) =>
                setBook({
                  ...book,
                  genres: book.genres.filter((author: { id: number; }) => author.id !== id),
                })
              }
            />
            <FormControl fullWidth variant="filled" size="small">
              <InputLabel>Author</InputLabel>
              <Select
                value=""
                onChange={(e) =>
                  handleSelectChange(
                    Number(e.target.value),
                    "authors",
                    authorsFilter,
                    setAuthorsFilter,
                    setBook
                  )
                }
              >
                {authorsFilter.map((author) => (
                  <MenuItem key={author.id} value={author.id}>
                    {author.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <AvatarList
              items={book.authors}
              name="Authors"
              onDelete={(id: number) =>
                setBook({
                  ...book,
                  authors: book.authors.filter((author: { id: number; }) => author.id !== id),
                })
              }
            />
            <TextField
              required
              label="Copies Available"
              variant="filled"
              size="small"
              value={book.copies_available}
              onChange={(e) => setBook({ ...book, copies_available: e.target.value })}
            />
            <TextField
              required
              label="Total Copies"
              variant="filled"
              size="small"
              value={book.total_copies}
              onChange={(e) => setBook({ ...book, total_copies: e.target.value })}
            />
            <TextField
              required
              label="Publication Year"
              variant="filled"
              size="small"
              value={book.publication_year}
              onChange={(e) => setBook({ ...book, publication_year: e.target.value })}
            />
            <Button
              type="submit"
              disabled={
                !book.title || 
                !book.copies_available || 
                !book.total_copies || 
                !book.publication_year ||
                !book.genres.length ||
                !book.authors.length
              }
            >
              {isEdit ? "Update" : "Add"} Book
            </Button>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );
}