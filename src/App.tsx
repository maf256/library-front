import {Typography, Box } from '@mui/material';
import ModalGenre from "./components/genre/ModalGenre";
import ModalAuthor from "./components/author/ModalAuthor";
import DataGridBooks from "./components/book/DataGridBook";


function App() {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }} maxWidth="sm">
        <Typography variant="h4" component="h1" gutterBottom>Hello Vite + React!</Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {/* <ModalGenre/> */}
          {/* <ModalAuthor/> */}
      </Box>
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