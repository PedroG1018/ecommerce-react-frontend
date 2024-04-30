import { Box, Button, TextField, Typography, Link } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignUp = () => {
  const [userData, setUserData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  /*
    1. Create new user
    2. Create cart for new user
    3. Automatically log in the new user
    4. Save credentials to local storage (ID, username, cart ID)
  */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const authResponse = await fetch(
        `${process.env.REACT_APP_PUBLIC_STRAPI_URL}/api/auth/local/register`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userData.email,
            username: userData.username,
            password: userData.password,
          }),
          method: "POST",
        }
      );

      const authJson = await authResponse.json();

      const cartBody = {
        data: {
          identifier: userData.username,
        },
      };

      const cartResponse = await fetch(
        `${process.env.REACT_APP_PUBLIC_STRAPI_URL}/api/carts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authJson.jwt}`,
          },
          body: JSON.stringify(cartBody),
        }
      );

      const cartJson = await cartResponse.json();
      const cartId = cartJson.data.id;

      // Merge local cart with server cart
      if (localStorage.getItem("cart")) {
        const cart = JSON.parse(localStorage.getItem("cart"));

        cart.map(async (item) => {
          const cartItemResponse = await fetch(
            `${process.env.REACT_APP_PUBLIC_STRAPI_URL}/api/cart-items?filters[itemId][$eq]=${item.item.id}&filters[cartId][$eq]=${cartId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authJson.jwt}`,
              },
            }
          );

          const cartItemJson = await cartItemResponse.json();

          // Add to user's cart if not already in cart
          if (cartItemJson.data.length === 0) {
            const cartItemBody = {
              data: {
                cartId: cartId.toString(),
                itemId: item.item.id.toString(),
                count: item.count,
              },
            };
            await fetch(
              `${process.env.REACT_APP_PUBLIC_STRAPI_URL}/api/cart-items`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${authJson.jwt}`,
                },
                body: JSON.stringify(cartItemBody),
              }
            );
          }
        });
      }

      localStorage.setItem("cart", JSON.stringify([]));

      localStorage.setItem(
        "user",
        JSON.stringify({
          user: authJson.user,
          jwt: authJson.jwt,
          cartId: cartId,
        })
      );

      toast.success("Registered and logged in successfully!", {
        hideProgressBar: true,
      });

      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <Box width="25em" m="40px auto" gap="16px">
      <Typography variant="h4" fontWeight="bold">
        Sign Up
      </Typography>
      <Box m="15px auto">
        <Box mb="15px">
          <TextField
            fullWidth
            type="email"
            label="Email"
            name="email"
            onChange={(e) => handleChange(e)}
          ></TextField>
        </Box>
        <Box mb="15px">
          <TextField
            fullWidth
            type="text"
            label="Username"
            name="username"
            onChange={(e) => handleChange(e)}
          ></TextField>
        </Box>
        <Box mb="15px">
          <TextField
            fullWidth
            type="password"
            label="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          ></TextField>
        </Box>
        <Button
          onClick={(e) => handleSubmit(e)}
          type="submit"
          color="primary"
          variant="contained"
          sx={{
            boxShadow: "none",
            color: "white",
            padding: "15px 40px",
          }}
        >
          Confirm
        </Button>
      </Box>
      <Link href="/login" underline="none">
        Already have an account? Sign in
      </Link>
    </Box>
  );
};

export default SignUp;
