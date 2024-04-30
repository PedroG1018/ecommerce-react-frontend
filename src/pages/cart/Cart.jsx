import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  DialogContent,
  DialogContentText,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import CartItem from "../../components/CartItem";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
const { user, jwt, cartId } =
  localStorage.getItem("user") !== ""
    ? JSON.parse(localStorage.getItem("user"))
    : "";
const initialCheckoutInfo = { email: user ? user.email : "" };

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [checkoutInfo, setCheckoutInfo] = useState(initialCheckoutInfo);
  const [removeCartItemId, setRemoveCartItemId] = useState(null);
  const [removeItemId, setRemoveItemId] = useState(null);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);

  const navigate = useNavigate();

  // Get the user's cart
  const getCart = async () => {
    const cartItemsResponse = await fetch(
      `${process.env.REACT_APP_PUBLIC_STRAPI_URL}/api/cart-items?filters[cartId][$eq]=${cartId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    const cartItemsJson = await cartItemsResponse.json();
    let items = [];

    for (let i = 0; i < cartItemsJson.data.length; i++) {
      const itemId = cartItemsJson.data[i].attributes.itemId;
      const cartItemId = cartItemsJson.data[i].id;
      const count = cartItemsJson.data[i].attributes.count;

      const itemResponse = await fetch(
        `${process.env.REACT_APP_PUBLIC_STRAPI_URL}/api/items/${itemId}?populate=image&populate[0]=platform`,
        {
          method: "GET",
        }
      );

      const itemJson = await itemResponse.json();
      items.push({
        item: itemJson.data,
        count: count,
        cartItemId: cartItemId,
        cartId: cartId,
      });
    }

    setCart(items);
  };

  // Change selected cart item quantity and price
  const changeQuantity = async (e, index) => {
    const count = e.target.value;
    let tempCart = [...cart];
    tempCart[index].count = count;

    if (user) {
      const requestBody = {
        data: {
          count: count,
        },
      };

      await fetch(
        `${process.env.REACT_APP_PUBLIC_STRAPI_URL}/api/cart-items/${cart[index].cartItemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify(requestBody),
        }
      );
    } else {
      localStorage.setItem("cart", JSON.stringify(tempCart));
    }

    setCart(tempCart);
  };

  // Handle remove action
  const handleRemove = (cartItemId, itemId) => {
    setRemoveCartItemId(cartItemId);
    setRemoveItemId(itemId);
    setIsRemoveDialogOpen(true);
  };

  // Removes item from user's cart
  const removeFromCart = async (cartItemId, itemId) => {
    let tempCart = [];

    if (user) {
      await fetch(
        `${process.env.REACT_APP_PUBLIC_STRAPI_URL}/api/cart-items/${cartItemId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      tempCart = cart.filter((item) => item.cartItemId !== cartItemId);
      setRemoveCartItemId(null);
    } else {
      tempCart = cart.filter((item) => item.item.id !== itemId);
      localStorage.setItem("cart", JSON.stringify(tempCart));
      setRemoveItemId(null);
    }

    setCart(tempCart);
    setIsRemoveDialogOpen(false);
  };

  const handleCheckoutFormChange = ({ target }) => {
    const { name, value } = target;

    setCheckoutInfo((currentCheckoutInfo) => ({
      ...currentCheckoutInfo,
      [name]: value,
    }));
  };

  // Takes user to checkout page for payment
  const makePayment = async () => {
    const stripe = await stripePromise;
    const requestBody = {
      userId: user.id.toString(),
      email: checkoutInfo.email,
      totalPrice: totalPrice,
      products: cart.map(({ item, count }) => ({
        id: item.id,
        count,
      })),
    };

    const response = await fetch(
      `${process.env.REACT_APP_PUBLIC_STRAPI_URL}/api/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(requestBody),
      }
    );

    const session = await response.json();

    await stripe.redirectToCheckout({
      sessionId: session.id,
    });
  };

  // Calculates total price of the user's cart
  const totalPrice = cart.reduce((total, item) => {
    return total + item?.count * item?.item?.attributes?.price;
  }, 0);

  useEffect(() => {
    if (user) {
      getCart();
    } else {
      if (
        localStorage.getItem("cart") === "" ||
        localStorage.getItem("cart") === null
      ) {
        localStorage.setItem("cart", JSON.stringify([]));
      }

      const localCart = JSON.parse(localStorage.getItem("cart"));
      setCart(localCart);
    }
  }, []);

  return (
    <Box width="90%" m="40px auto">
      <Typography variant="h4" fontWeight="bold" textAlign="center" m="20px 0">
        Shopping Cart
      </Typography>

      <Box
        sx={{ width: { md: "44em", xs: "22em" } }}
        m="auto"
        display="flex"
        flexDirection="column"
        gap="10px"
      >
        {cart.length === 0 && (
          <Box m="auto">
            <Typography textAlign="center" variant="h5" color="gray">
              There are no items in your cart
            </Typography>
            <Button fullWidth onClick={() => navigate("/products")}>
              Start Shopping
            </Button>
          </Box>
        )}
        {cart.map((item, index) => (
          <CartItem
            item={item}
            changeQuantity={(e) => changeQuantity(e, index)}
            handleRemove={() => handleRemove(item.cartItemId, item.item.id)}
          />
        ))}

        <Box mt="30px" display="flex" justifyContent="space-between">
          <Box>
            <Typography fontWeight="bold">Subtotal</Typography>
          </Box>
          <Box>
            <Typography fontWeight="bold">${totalPrice.toFixed(2)}</Typography>
          </Box>
        </Box>
        <Box textAlign="center">
          <Button
            onClick={() => setIsCheckoutDialogOpen(true)}
            fullWidth
            variant="contained"
            color="secondary"
            disabled={cart.length === 0}
            sx={{
              padding: "20px 40px",
              borderRadius: 0,
              m: "20px 0",
            }}
          >
            Checkout
          </Button>
        </Box>
      </Box>

      {/* REMOVE FROM CART ALERT DIALOG */}
      <Dialog
        open={isRemoveDialogOpen}
        onClose={() => setIsRemoveDialogOpen(false)}
      >
        <DialogTitle>{"Remove item from cart?"}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setIsRemoveDialogOpen(false)}>No</Button>
          <Button
            onClick={() => removeFromCart(removeCartItemId, removeItemId)}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isCheckoutDialogOpen}
        onClose={() => setIsCheckoutDialogOpen(false)}
      >
        <DialogTitle>Checkout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            name="email"
            label="Email Address"
            type="email"
            value={checkoutInfo.email}
            fullWidth
            variant="standard"
            onChange={handleCheckoutFormChange}
          />
          <Box mt="20px">
            <Button
              fullWidth
              variant="contained"
              sx={{ borderRadius: 0, padding: "10px 30px" }}
              onClick={makePayment}
            >
              Submit
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Cart;
