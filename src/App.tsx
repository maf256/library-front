import { Typography, Box } from "@mui/material";
import DataGridBooks from "./components/book/DataGridBook";

function App() {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
        maxWidth="sm">
        <Typography variant="h4" component="h1" gutterBottom>
          Library
        </Typography>
      </Box>
      <Box>
        <DataGridBooks />
      </Box>
    </>
  );
}

export default App;

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
