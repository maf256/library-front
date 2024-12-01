import {
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Grid2,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid from "@mui/material/Grid2";

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

export default function ItemList({ items, onDelete, name }: AvatarListProps) {
  return (
    <Grid>
      <Typography variant="h6" component="div">
        List of {name}
      </Typography>
      <Demo>
        <List dense>
          {items.map((item) => (
            <ListItem
              sx={{ borderBottom: "1px solid #ccc" }}
              key={item.id}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => onDelete(item.id)}>
                  <DeleteIcon />
                </IconButton>
              }>
              <ListItemText primary={item.name} />
            </ListItem>
          ))}
        </List>
      </Demo>
    </Grid>
  );
}
