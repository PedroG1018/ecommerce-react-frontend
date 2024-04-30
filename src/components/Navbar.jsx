import React, { useState } from "react";
import { Box, Badge, IconButton, TextField } from "@mui/material";
import {
  PersonOutline,
  ShoppingBagOutlined,
  MenuOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Navbar = ({ count }) => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState(null);

  return (
    <Box display="flex" flexDirection="column">
      <Box
        padding="10px 0"
        display="flex"
        alignItems="center"
        width="100%"
        height="60px"
        color="black"
        top="0"
        left="0"
        backgroundColor="rgba(250, 240, 230, 0.95)"
        zIndex="1"
      >
        <Box
          width="80%"
          margin="auto"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap="10px"
        >
          <Box
            onClick={() => navigate("/")}
            sx={{
              cursor: "pointer",
              fontWeight: "bold",
              "&:hover": {
                opacity: "0.7",
              },
            }}
          >
            1-UP STORE
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            columnGap="20px"
            zIndex="2"
          >
            <Box>
              <TextField
                sx={{
                  backgroundColor: "#f9f9f9",
                  borderRadius: 0,
                  width: "400px",
                  display: { md: "flex", xs: "none" },
                }}
                placeholder="Search for products"
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => {
                        if (query) {
                          navigate(`/products?name=${query}`);
                        }
                      }}
                    >
                      <SearchOutlined />
                    </IconButton>
                  ),
                }}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && query) {
                    navigate(`/products?name=${query}`);
                  }
                }}
              />
            </Box>

            <IconButton
              sx={{ color: "black" }}
              onClick={() => {
                const user = localStorage.getItem("user");

                if (user) {
                  navigate("/profile");
                } else {
                  navigate("/login");
                }
              }}
            >
              <PersonOutline />
            </IconButton>
            <Badge
              badgeContent={count}
              color="secondary"
              invisible={count === 0}
              sx={{
                "& .MuiBadge-badge": {
                  right: 5,
                  top: 5,
                  padding: "0 4px",
                  height: "14px",
                  minWidth: "13px",
                },
              }}
            >
              <IconButton
                onClick={() => navigate("/cart")}
                sx={{ color: "black" }}
              >
                <ShoppingBagOutlined />
              </IconButton>
            </Badge>
          </Box>
        </Box>
      </Box>
      <Box
        padding="10px 30px"
        sx={{ display: { md: "none", xs: "flex" } }}
        backgroundColor="rgba(250, 240, 230, 0.95)"
      >
        <TextField
          fullWidth
          sx={{
            backgroundColor: "#f9f9f9",
            borderRadius: 0,
          }}
          placeholder="Search for products"
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={() => {
                  if (query) {
                    navigate(`/products?name=${query}`);
                  }
                }}
              >
                <SearchOutlined />
              </IconButton>
            ),
          }}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && query) {
              navigate(`/products?name=${query}`);
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default Navbar;
