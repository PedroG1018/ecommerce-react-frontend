import { Box, TextField, Typography, Button, Link } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const initialUser = { identifier: "", password: "" };

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(initialUser);

  const handleChange = ({ target }) => {
    const { name, value } = target;

    setUser((currentUser) => ({
      ...currentUser,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    if (user.identifier && user.password) {
      await fetch(`${process.env.REACT_APP_PUBLIC_STRAPI_URL}/api/auth/local`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })
        .then(async (response) => {
          if (response.ok) {
            return await response.json();
          }

          console.log(response);
          throw new Error("User identifier or password is incorrect");
        })
        .then(async (authJson) => {
          if (authJson.jwt) {
            const cartResponse = await fetch(
              `${process.env.REACT_APP_PUBLIC_STRAPI_URL}/api/carts?filters[identifier][$eq]=${authJson.user.username}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${authJson.jwt}`,
                },
              }
            );

            const cartJson = await cartResponse.json();
            const cartId = cartJson.data[0].id;

            localStorage.setItem(
              "user",
              JSON.stringify({
                user: authJson.user,
                jwt: authJson.jwt,
                cartId: cartId,
              })
            );

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

            toast.success("Logged in successfully!", {
              hideProgressBar: true,
            });

            setUser(initialUser);
            navigate("/");
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.message, {
            hideProgressBar: true,
          });
        });
    }
  };

  return (
    <Box width="25em" m="40px auto" gap="16px">
      <Typography variant="h4" fontWeight="bold">
        Sign In
      </Typography>
      <Box m="15px auto">
        <Box mb="15px">
          <TextField
            fullWidth
            type="email"
            label="Email/Username"
            name="identifier"
            value={user.identifier}
            onChange={handleChange}
          ></TextField>
        </Box>
        <Box mb="15px">
          <TextField
            fullWidth
            type="password"
            label="Password"
            name="password"
            value={user.password}
            onChange={handleChange}
          ></TextField>
        </Box>
        <Button
          onClick={handleLogin}
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
      <Link href="/signup" underline="none">
        Don't have an account? Sign up
      </Link>
    </Box>
  );
};

export default Login;
