import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const initialPasswords = { oldPassword: "", newPassword: "" };

const Reset = () => {
  const [passwords, setPasswords] = useState(initialPasswords);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const navigate = useNavigate();

  const { user, jwt, cartId } = JSON.parse(localStorage.getItem("user"));

  const handleChange = ({ target }) => {
    const { name, value } = target;

    setPasswords((currentPasswords) => ({
      ...currentPasswords,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const requestBody = {
      currentPassword: passwords.oldPassword,
      password: passwords.newPassword,
      passwordConfirmation: passwords.newPassword,
    };

    await fetch(
      `${process.env.REACT_APP_PUBLIC_STRAPI_URL}/api/auth/change-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(requestBody),
      }
    );

    toast.success("Password successfully reset!", { hideProgressBar: true });
    navigate("/profile");
  };

  return (
    <Box width="25em" m="40px auto" gap="16px">
      <Typography variant="h4" fontWeight="bold">
        Reset your password
      </Typography>
      <Box m="16px auto">
        <Box mb="16px">
          <TextField
            fullWidth
            type={showOldPassword ? "text" : "password"}
            label="Current Password"
            name="oldPassword"
            value={passwords.oldPassword}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowOldPassword((showOldPassword) => !showOldPassword)
                    }
                  >
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box mb="16px">
          <TextField
            fullWidth
            type={showNewPassword ? "text" : "password"}
            label="New Password"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowNewPassword((showNewPassword) => !showNewPassword)
                    }
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Button
          onClick={handleSubmit}
          type="submit"
          color="error"
          variant="contained"
          sx={{
            boxShadow: "none",
            color: "white",
            padding: "15px 40px",
          }}
        >
          Reset
        </Button>
      </Box>
      <Link href="/profile" underline="none">
        Changed your mind? Go back
      </Link>
    </Box>
  );
};

export default Reset;
