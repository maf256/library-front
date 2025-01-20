import React, { useState } from "react";
import { Button } from "@mui/material";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import Stack from "@mui/joy/Stack";
import FormControl from '@mui/joy/FormControl';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function ModalLogin({
  openModalLogin,
  setOpenModalLogin,
}) {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLogin, setIsLogin] = React.useState('Login');
  const queryClient = useQueryClient();

  const loginOrRegisterMutation = useMutation(
    async ({ isLogin, user }) => {
      const response = await fetch(
        isLogin === "Login"
          ? "http://localhost:3000/login/login"
          : "http://localhost:3000/login/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );

      if (!response.ok) {
        const errorMessage = {
          400: "User already exists",
          404: "User not found",
          500: "Server error",
        }[response.status] || "Invalid credentials";
        throw new Error(errorMessage);
      }

      return response.json(); // Return data from the server
    },
    {
      onSuccess: (data) => {
        localStorage.setItem("token", data.token); // Store token
        queryClient.setQueryData("user", { email: data.user.email }); // Update user data
        alert(`${isLogin} successful`);
        handleClose();
      },
      onError: (error) => {
        alert(`Error: ${error.message}`);
      },
    }
  );

  const handleChangeRadio = (event) => {
    setIsLogin(event.target.value);
  };
  const handleLogin = (e) => {
    e.preventDefault();
    loginOrRegisterMutation.mutate({
      isLogin,
      user: { name: user.name, email: user.email, password: user.password },
    });
  };
  
  
  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleClose = () => {
    setOpenModalLogin(false);
    setUser({
      name: "",
      email: "",
      password: "",
    });
    setIsLogin('Login');
  };

  return (
    <Modal open={openModalLogin} onClose={handleClose}>
      <ModalDialog>
        <DialogTitle sx={{ ml: 3 }}>{isLogin}</DialogTitle>
        <form onSubmit={handleLogin}>
          <Stack spacing={2}>
          {isLogin === "Login" ? '' : <FormLabel>Name</FormLabel>}
          {isLogin === "Login" ? '' : 
            
            <Input
              required
              name="name"
              value={user.name}
              onChange={handleChange}
              {...(isLogin === "Login" ? {autoFocus: false} :{ autoFocus: true } )}

              />}
            <FormLabel>Email</FormLabel>
            <Input
              required
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              {...(isLogin === "Login" ? { autoFocus: true } : { autoFocus: false })}

            />
            <FormLabel>Password</FormLabel>
            <Input
              required
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
            />
            <Button type="submit" disabled={isLogin === "Login" ? false : !user.name || !user.email || !user.password}>
              {isLogin}
            </Button>
          </Stack>
        </form>
        <FormControl>
        <RadioGroup
          defaultValue="Login"
          name="controlled-radio-buttons-group"
          value={isLogin}
          onChange={handleChangeRadio}
          sx={{ my: 1 }}
        >
          <Radio value="Login" label="Login" />
          <Radio value="Register" label="Register" />
        </RadioGroup>
      </FormControl>
      </ModalDialog>


    </Modal>
  );
}
