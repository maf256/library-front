import { Typography, IconButton, List, ListItem, ListItemAvatar, Avatar, ListItemText, Grid2 } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid from '@mui/material/Grid2';

import { styled } from "@mui/system";

// Styled container
const Demo = styled("div")(({ theme }) => ({
  // backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
}));

interface Props {
    items: { id: number; name: string }[];
    name: string;
    onDelete: (id: number) => void;
  }
interface AvatarListProps {
items: { id: number; name: string }[];
name: string;
onDelete: (id: number) => void;
}

export default function AvatarList({ items, onDelete, name }: AvatarListProps) {
  
  return (
    <Grid xs={12} md={6}>
      <Typography  variant="h7" component="div">
        List of {name}
      </Typography>
      <Demo>
        <List dense>
          {items.map((item) => (
            <ListItem
              key={item.id}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => onDelete(item.id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={item.name} />
            </ListItem>
          ))}
        </List>
      </Demo>
    </Grid>
  );
};

// Example usage
// const App = () => {
//   const handleDelete = (id: number) => {
//     console.log("Deleted item with ID:", id);
//     // Implement delete logic here
//   };

//   return (
//     <Grid container spacing={2}>
//       <AvatarList items={data} onDelete={handleDelete} />
//     </Grid>
//   );
// };
