import * as React from "react";
import { Button } from "@mui/material";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import Stack from "@mui/joy/Stack";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DataGridGenres from "./DataGridGenres";

interface Genre {
  id?: number;
  name: string;
}

interface ModalGenreProps {
  openModalGenre: boolean;
  setOpenModalGenre: (value: boolean) => void;
}
export default function ModalGenre({
  openModalGenre,
  setOpenModalGenre,
}: ModalGenreProps) {
  const initialGenre: Genre = {id: -1 ,name: "" };
  const [genreName, setGenreName] = React.useState<Genre>(initialGenre);
  const [onEdit, setOnEdit] = React.useState<number>(-1);
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery<Genre[]>({
    queryKey: ["genres"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/genre");
      if (!response.ok) throw new Error("Failed to fetch genres");
      return response.json();
    },
  });

  React.useEffect(() => {
    if (onEdit === -1) {
      setGenreName(initialGenre);
    } else {
      const foundGenre = data?.find((genre) => genre.id === onEdit);
      if (foundGenre) setGenreName(foundGenre);
    }

  }, [onEdit, data]);

  const handleSubmit = React.useCallback(async () => {
    try {
      const method = onEdit === -1 ? "POST" : "PUT";
      const url =
        onEdit === -1
          ? "http://localhost:3000/genre"
          : `http://localhost:3000/genre/${onEdit}`;
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(genreName),
      });
      if (!response.ok)
        throw new Error(`Failed to ${onEdit === -1 ? "add" : "update"} genre`);

      await queryClient.invalidateQueries(
        { queryKey: ["genres"] },
        { throwOnError: true }
      );
      setGenreName({id: -1 ,name: "" });
      setOnEdit(-1);
      alert(`Genre ${onEdit === -1 ? "added" : "updated"} successfully`);
    } catch (error) {
      console.error(error);
      alert(`Error ${onEdit === -1 ? "adding" : "updating"} genre: ${error}`);
    }
  }, [genreName, onEdit, queryClient]);

  const handleClose = React.useCallback(() => {
    setOpenModalGenre(false);
    setOnEdit(-1);
    setGenreName(initialGenre);
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading genres</div>;

  return (
    <>
      <Modal open={openModalGenre} onClose={handleClose}>
        <ModalDialog>
          <DialogTitle sx={{ ml: 3 }}>Genre</DialogTitle>
          <form
            onSubmit={(event: React.FormEvent) => {
              event.preventDefault();
              handleSubmit();
            }}>
            <Stack spacing={2}>
              {/* <FormControl> */}
                <FormLabel>Name</FormLabel>
                <Input
                  autoFocus
                  required
                  value={genreName.name}
                  onChange={(e) =>
                    setGenreName({ ...genreName, name: e.target.value })
                  }
                />
              {/* </FormControl> */}
              <Button disabled={!genreName.name} type="submit">
                {onEdit === -1 ? "Add" : "Update"} Genre
              </Button>
            </Stack>
          </form>
          <DataGridGenres data={data || []} setOnEdit={setOnEdit} />
        </ModalDialog>
      </Modal>
    </>
  );
}
