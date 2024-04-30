import { Box, Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  // TODO: Erase user and jwt from local storage
  const handleLogout = () => {
    localStorage.setItem("user", "");
    navigate("/login");
  };

  return (
    <Box display="flex" justifyContent="center" m="80px auto">
      <Button
        variant="contained"
        color="error"
        type="submit"
        sx={{
          padding: "10px 30px",
          borderRadius: 0,
        }}
        onClick={() => handleLogout()}
      >
        Logout
      </Button>
    </Box>
  );
};

export default Logout;
