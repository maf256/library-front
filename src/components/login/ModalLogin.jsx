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

  const handleChangeRadio = (event) => {
    setIsLogin(event.target.value);
  };
  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(
        isLogin === "Login"
          ? 'http://localhost:3000/login/login'
          : 'http://localhost:3000/login/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            password: user.password,
          }),
        }
      );
  
      console.log(response);
  
      if (!response.ok) {
        // Handle specific error responses
        let errorMessage = 'Invalid credentials';
        if (response.status === 400) errorMessage = 'User already exists';
        if (response.status === 404) errorMessage = 'User not found';
        if (response.status === 500) errorMessage = 'Server error. Please try again later.';
  
        throw new Error(errorMessage);
      }
  
      const data = await response.json();
      localStorage.setItem('token', data.token); // Store the token
      alert(`${isLogin} successful`);
      handleClose();
    } catch (error) {
      console.error('Login error:', error);
      alert(`Error: ${error.message}`); // Display correct error message
    }
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
