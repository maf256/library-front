import { Typography, Box } from "@mui/material";
import DataGridBooks from "./components/book/DataGridBook";
// import Login from "./components/login/Login";
import ModalLogin from "./components/login/ModalLogin";
import { useState } from "react";

function App() {
  const [openModalLogin, setOpenModalLogin] = useState(false);
  return (
    <>
      <ModalLogin openModalLogin={openModalLogin} setOpenModalLogin={setOpenModalLogin} />
      <button onClick={() => setOpenModalLogin(true)}>Login</button>
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
      {/* <Login /> */}
    </>
  );
}

export default App;

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
