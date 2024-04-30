import React, { useEffect, useState } from "react";
import Logout from "../../components/Logout";
import {
  Box,
  Tab,
  Tabs,
  useMediaQuery,
  Typography,
  Button,
  Divider,
  IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Order from "../../components/Order";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Profile = () => {
  const [value, setValue] = useState("orders");
  const [orders, setOrders] = useState([]);
  const breakPoint = useMediaQuery("(min-width:600px)");

  const navigate = useNavigate();

  const { user, jwt, cartId } = JSON.parse(localStorage.getItem("user"));

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getOrders = async () => {
    const ordersResponse = await fetch(
      `${process.env.REACT_APP_PUBLIC_STRAPI_URL}/api/orders?filters[userId][$eq]=${user.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    let ordersJson = await ordersResponse.json();

    for (let i = 0; i < ordersJson.data.length; i++) {
      let items = [];

      for (let j = 0; j < ordersJson.data[i].attributes.products.length; j++) {
        const itemId = ordersJson.data[i].attributes.products[j].id;
        const count = ordersJson.data[i].attributes.products[j].count;

        const itemResponse = await fetch(
          `${process.env.REACT_APP_PUBLIC_STRAPI_URL}/api/items/${itemId}?populate=image`
        );

        let itemJson = await itemResponse.json();
        itemJson.count = count;

        console.log("itemJson", itemJson);

        items.push(itemJson);
      }

      ordersJson.data[i].attributes.products = items;
      console.log(ordersJson);
    }
    setOrders(ordersJson.data);
  };

  const addToCart = async (itemId) => {
    const requestBody = {
      data: {
        cartId: cartId.toString(),
        itemId: itemId.toString(),
        count: 1,
      },
    };

    await fetch(`${process.env.REACT_APP_PUBLIC_STRAPI_URL}/api/cart-items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(requestBody),
    });

    toast.success("Added item to cart!", {
      hideProgressBar: true,
    });

    navigate("/cart");
  };

  useEffect(() => {
    getOrders();
  }, []);

  console.log("orders", orders);

  return (
    <Box width={{ md: "70%", xs: "100%" }} m="40px auto">
      <Tabs
        textColor="primary"
        indicatorColor="primary"
        value={value}
        onChange={handleChange}
        centered
        TabIndicatorProps={{ sx: { display: breakPoint ? "block" : "none" } }}
        sx={{
          m: "25px",
          "& .MuiTabs-flexContainer": {
            flexWrap: "wrap",
          },
        }}
      >
        <Tab label="ORDER HISTORY" value="orders" />
        <Tab label="ACCOUNT DETAILS" value="account" />
      </Tabs>
      <Box width="90%" m="auto">
        <Box mb="30px">
          {value === "orders" && (
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Order History
              </Typography>
              <Typography color="gray">
                Check the status of recent orders, manage returns, and discover
                similar products.
              </Typography>
              {orders.length === 0 && (
                <Box mt="40px">
                  <Typography variant="h5">You have no orders</Typography>
                </Box>
              )}
            </Box>
          )}
          {value === "account" && (
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Account Details
              </Typography>
              <Typography color="gray">
                Review account information, log out of your account, and reset
                your password.
              </Typography>
            </Box>
          )}
        </Box>
        {value === "orders" &&
          orders?.map((order) => (
            <Box
              mb="40px"
              padding="16px"
              borderRadius="10px"
              border={1}
              borderColor="#d3d3d3"
            >
              <Box
                mb="20px"
                display="flex"
                justifyContent="space-between"
                gap="10px"
              >
                <Box>
                  <Typography fontWeight="bold">Order number </Typography>
                  <Typography color="gray">
                    {order.attributes.stripeSessionId.substr(8, 10)}
                  </Typography>
                </Box>
                <Box>
                  <Typography fontWeight="bold">Date placed </Typography>
                  <Typography color="gray">
                    {new Date(order.attributes.publishedAt).toDateString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography fontWeight="bold">Total amount</Typography>
                  <Typography>${order?.attributes.totalPrice}</Typography>
                </Box>
              </Box>

              <Divider />

              <Box mt="20px">
                {order?.attributes?.products.map((product, index) => {
                  return (
                    <Box key={product.data.id} mb="20px">
                      <Box>
                        <Box display="flex" justifyContent="space-between">
                          <Box display="flex" gap="16px">
                            <Box
                              width="150px"
                              height="150px"
                              padding="10px"
                              borderRadius="10px"
                              sx={{ backgroundColor: "#f9f9f9" }}
                            >
                              <img
                                alt={product.data.attributes.name}
                                src={`${process.env.REACT_APP_PUBLIC_STRAPI_URL}${product?.data.attributes?.image?.data?.attributes?.formats?.small?.url}`}
                                width="100%"
                                height="100%"
                                style={{
                                  objectFit: "contain",
                                  objectPosition: "center",
                                }}
                              />
                            </Box>
                            <Box>
                              <Typography fontWeight="bold">
                                {product.data.attributes.name}
                              </Typography>
                              <Typography color="gray">
                                Qty: {product.count}
                              </Typography>
                            </Box>
                          </Box>

                          <Box>
                            <Typography>
                              ${product?.data.attributes.price}
                            </Typography>
                          </Box>
                        </Box>

                        <Box
                          display="flex"
                          flexDirection={{ md: "row", xs: "column" }}
                          alignItems="center"
                          justifyContent="space-between"
                          mb="10px"
                        >
                          <Box
                            display="flex"
                            gap="6px"
                            alignContent="center"
                            alignItems="center"
                          >
                            <IconButton
                              color="success"
                              sx={{
                                cursor: "default",
                                backgroundColor: "white",
                              }}
                            >
                              <CheckCircleIcon />
                            </IconButton>
                            <Typography>Delivered</Typography>
                          </Box>
                          <Box display="flex" gap="10px">
                            <Button
                              variant="outlined"
                              color="primary"
                              sx={{
                                borderRadius: 0,
                              }}
                              onClick={() =>
                                navigate(`/item/${product?.data.id}`)
                              }
                            >
                              View product
                            </Button>
                            <Divider orientation="vertical" flexItem />
                            <Button
                              variant="outlined"
                              color="secondary"
                              sx={{ borderRadius: 0 }}
                              onClick={() => addToCart(product?.data.id)}
                            >
                              Buy again
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
            // <Order order={order} key={order.id} />
          ))}
        {value === "account" && (
          <Box>
            <Box>
              <Typography>
                <b>Email:</b> {user.email}
              </Typography>
              <Typography>
                <b>Username:</b> {user.username}
              </Typography>
              <Box mt="10px">
                <Button
                  variant="text"
                  sx={{ padding: "0" }}
                  onClick={() => navigate("/reset")}
                >
                  Reset Password
                </Button>
              </Box>
            </Box>
            <Logout />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Profile;
