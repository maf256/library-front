import * as React from "react";
import { Button } from "@mui/material";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import Stack from "@mui/joy/Stack";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TextField } from "@mui/material";
import DataGridAuthor from "./DataGridAuthor";

interface Author {
  id?: number;
  name: string;
  biography: string;
  birthday: string | null; // ISO 8601 format is a string
}

function convertToISO8601(input: string | Date): string {
  const date = input instanceof Date ? input : new Date(input);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date provided");
  }
  return date.toISOString().split("T")[0];
}

const fetchAuthors = async (): Promise<Author[]> => {
  const response = await fetch("http://localhost:3000/author");
  if (!response.ok) throw new Error("Failed to fetch authors");
  return response.json();
};

const addOrUpdateAuthor = async (author: Author, onEdit: number) => {
  const response = await fetch(
    onEdit === -1
      ? "http://localhost:3000/author"
      : `http://localhost:3000/author/${onEdit}`,
    {
      method: onEdit === -1 ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(author),
    }
  );
  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || "Failed to update author");
  }
};
interface ModalAuthorProps {
  openModalAuthor: boolean;
  setOpenModalAuthor: (value: boolean) => void;
}
export default function ModalAuthor({
  openModalAuthor,
  setOpenModalAuthor,
}: ModalAuthorProps) {
  const [author, setAuthor] = React.useState<Author>({
    name: "",
    biography: "",
    birthday: null,
  });
  const [onEdit, setOnEdit] = React.useState<number>(-1);
  const [filter, setFilter] = React.useState<string>("");
  const [filterData, setFilterData] = React.useState<Author[] | null>(null);
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery<Author[]>({
    queryKey: ["authors"],
    queryFn: fetchAuthors,
  });

  React.useEffect(() => {
    if (onEdit === -1) {
      setAuthor({ name: "", biography: "", birthday: null });
    } else {
      const foundAuthor = data?.find((obj) => obj.id === onEdit);
      if (foundAuthor) setAuthor(foundAuthor);
    }
  }, [onEdit, data]);

  const handleClose = () => {
    setOpenModalAuthor(false);
    setOnEdit(-1);
    setFilter("");
    setFilterData(null);
  };

  const handleSubmit = async () => {
    try {
      await addOrUpdateAuthor(author, onEdit);
      queryClient.invalidateQueries(
        {
          queryKey: ["authors"],
          refetchType: "active",
        },
        { throwOnError: true }
      );
      alert(`Author ${onEdit === -1 ? "added" : "updated"} successfully.`);
    } catch (error: any) {
      console.error(error);
      alert(
        `Failed to ${onEdit === -1 ? "add" : "update"} author: ${
          error.message || "Unknown error"
        }`
      );
    }
    setOnEdit(-1);
    setAuthor({ name: "", biography: "", birthday: null });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (!filter.trim()) {
        setFilterData(null);
      } else {
        const filteredNames = data?.filter((author) =>
          author.name.toLowerCase().startsWith(filter.toLowerCase())
        );
        setFilterData(filteredNames || null);
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  function isValidBirthday(birthday: string | number | Date) {
    // Check if it matches the ISO 8601 format (YYYY-MM-DD)
    console.log("birthday=", birthday);
    console.log(author);

    const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!isoDateRegex.test(birthday)) {
      return false;
    }

    // Parse the date and check if it's valid
    const date = new Date(birthday);
    const isValidDate = !isNaN(date.getTime()); // Check if it’s a valid date

    // Ensure the date matches the input (to avoid issues like `2024-02-30`)
    const [year, month, day] = birthday.split("-").map(Number);
    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() + 1 !== month || // Month is 0-indexed
      date.getUTCDate() !== day
    ) {
      return false;
    }

    // Optionally, ensure the date is not in the future
    const today = new Date();
    if (date > today) {
      return false;
    }

    return true;
  }
  return (
    <React.Fragment>
      {/* <Button variant="contained" onClick={() => setOpenModalAuthor(true)}>Author</Button> */}
      <Modal open={openModalAuthor} onClose={handleClose}>
        <ModalDialog>
          <DialogTitle sx={{ ml: 3 }}>Author</DialogTitle>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit();
            }}>
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  name=""
                  autoFocus
                  required
                  value={author.name}
                  onChange={(e) =>
                    setAuthor({ ...author, name: e.target.value })
                  }
                />
                <FormLabel>Biography</FormLabel>
                <TextField
                  required
                  value={author.biography}
                  multiline
                  rows={4}
                  onChange={(e) =>
                    setAuthor({ ...author, biography: e.target.value })
                  }
                />
                <FormLabel>Birthday</FormLabel>
                <Input
                  required
                  type="date"
                  value={author.birthday ? author.birthday.split("T")[0] : ""} // Format to YYYY-MM-DD
                  onChange={(e) => {
                    const inputDate = e.target.value; // Already in YYYY-MM-DD format
                    if (isValidBirthday(inputDate)) {
                      setAuthor({ ...author, birthday: inputDate });
                    } else {
                      alert("Invalid birthday format or date in the future.");
                    }
                  }}
                />
              </FormControl>
              <Button
                disabled={!author.name || !author.biography || !author.birthday}
                type="submit">
                {onEdit === -1 ? "Add" : "Update"}
              </Button>
            </Stack>
          </form>
          <FormLabel>Filter by name</FormLabel>
          <Input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <DataGridAuthor data={filterData || data} setOnEdit={setOnEdit} />
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
