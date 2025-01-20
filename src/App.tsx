import { Typography, Box } from "@mui/material";
import DataGridBooks from "./components/book/DataGridBook";
import ModalLogin from "./components/login/ModalLogin";
import { useState } from "react";
import isLoggedin from "./util/isLoggedin";


function App() {
  const [openModalLogin, setOpenModalLogin] = useState(false);
  return (
    <>
      <ModalLogin openModalLogin={openModalLogin} setOpenModalLogin={setOpenModalLogin} />
      { isLoggedin() ? '' : <button onClick={() => setOpenModalLogin(true)}>Login</button> }
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



// import { useQuery } from "@tanstack/react-query";

// function App() {
//   const { data: user, isLoading } = useQuery(
//     "user",
//     async () => {
//       const token = localStorage.getItem("token");
//       if (!token) return null;
  
//       const response = await fetch("http://localhost:3000/auth", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!response.ok) throw new Error("Failed to fetch user");
//       return response.json(); // Assume the server returns user details
//     },
//     { retry: false } // options
//   );

//   const [openModalLogin, setOpenModalLogin] = useState(false);

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <>
//       <ModalLogin
//         openModalLogin={openModalLogin}
//         setOpenModalLogin={setOpenModalLogin}
//       />
//       <button onClick={() => setOpenModalLogin(true)}>Login</button>
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           flexDirection: "column",
//         }}
//         maxWidth="sm"
//       >
//         <Typography variant="h4" component="h1" gutterBottom>
//           Library
//         </Typography>
//         {user ? (
//           <Typography variant="body1">
//             Logged in as: {user.email}
//           </Typography>
//         ) : (
//           <Typography variant="body1">Not logged in</Typography>
//         )}
//       </Box>
//       <Box>
//         <DataGridBooks />
//       </Box>
//     </>
//   );
// }

// export default App;
