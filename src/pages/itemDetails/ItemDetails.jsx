import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Tab,
  Tabs,
  Rating,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useParams, useNavigate } from "react-router-dom";
import Item from "../../components/Item";
import { toast } from "react-toastify";

const ItemDetails = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const [value, setValue] = useState("relatedProducts");
  const [count, setCount] = useState(1);
  const [item, setItem] = useState(null);
  const [items, setItems] = useState([]);
  const [reviews, setReviews] = useState([]);

  const { user, jwt, cartId } =
    localStorage.getItem("user") !== ""
      ? JSON.parse(localStorage.getItem("user"))
      : "";

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getItem = async () => {
    const item = await fetch(
      `${process.env.REACT_APP_PUBLIC_STRAPI_URL}/api/items/${itemId}?populate=image&populate[0]=platform`,
      {
        method: "GET",
      }
    );
    const itemJson = await item.json();
    setItem(itemJson.data);
    getItems(itemJson.data);
  };

  const getItems = async (item) => {
    const itemsResponse = await fetch(
      `${process.env.REACT_APP_PUBLIC_STRAPI_URL}/api/items?populate=image&filters[platform][name][$eq]=${item?.attributes.platform.data.attributes.name}&filters[name][$ne]=${item?.attributes.name}&pagination[pageSize]=5`,
      {
        method: "GET",
      }
    );

    console.log(itemsResponse);

    const itemsJson = await itemsResponse.json();
    setItems(itemsJson.data);
  };

  const getReviews = async () => {
    const reviewResponse = await fetch(
      `${process.env.REACT_APP_PUBLIC_STRAPI_URL}/api/reviews?filters[itemId][$eq]=${itemId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const reviewJson = await reviewResponse.json();
    setReviews(reviewJson.data);
  };

  const addToCart = async () => {
    if (user) {
      const requestBody = {
        data: {
          cartId: cartId.toString(),
          itemId: itemId,
          count: count,
        },
      };

      try {
        await fetch(
          `${process.env.REACT_APP_PUBLIC_STRAPI_URL}/api/cart-items`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`,
            },
            body: JSON.stringify(requestBody),
          }
        );

        toast.success("Added item to cart!", {
          hideProgressBar: true,
        });
      } catch (error) {
        toast.error(error.message, {
          hideProgressBar: true,
        });
      }
    } else {
      // add to local cart
      if (
        localStorage.getItem("cart") === "" ||
        localStorage.getItem("cart") === null
      ) {
        localStorage.setItem("cart", JSON.stringify([]));
      }

      let tempCart = JSON.parse(localStorage.getItem("cart"));

      tempCart.push({
        item: item,
        count: count,
      });

      localStorage.setItem("cart", JSON.stringify(tempCart));

      toast.success("Added item to cart!", { hideProgressBar: true });
    }
  };

  useEffect(() => {
    getItem();
    getReviews();
  }, [itemId]);

  console.log(item);

  return (
    <Box width={{ md: "60%", xs: "80%" }} m="40px auto">
      <Box display="flex" flexWrap="wrap" columnGap="40px">
        {/* Images */}
        <Box
          flex="1 1 40%"
          sx={{ width: "700px", height: { md: "500px", xs: "300px" } }}
          mb="40px"
        >
          <img
            alt={item?.name}
            width="100%"
            height="100%"
            src={`${process.env.REACT_APP_PUBLIC_STRAPI_URL}${item?.attributes?.image?.data?.attributes?.formats?.small?.url}`}
            style={{ objectFit: "contain", objectPosition: "center" }}
          />
        </Box>

        <Box flex="1 1 50%">
          <Box display="flex" justifyContent="space-between">
            <Box>Home/Item</Box>
            <Box>Prev Next</Box>
          </Box>

          <Box m="40px 0 25px 0">
            <Typography variant="h4" fontWeight="bold">
              {item?.attributes.name}
            </Typography>
            <Box display="flex">
              <Rating
                value={item?.attributes.stars / item?.attributes.numReviews}
                readOnly
              />
              <Typography fontWeight="bold" padding="0 5px">
                {item?.attributes.stars
                  ? item?.attributes.stars / item?.attributes.numReviews
                  : 0}
              </Typography>
              <Typography padding="0 5px">
                ({item?.attributes.numReviews} Reviews)
              </Typography>
            </Box>
            <Typography padding="10px 0">${item?.attributes?.price}</Typography>
            <Typography color="gray" sx={{ mt: "20px" }}>
              {item?.attributes?.longDescription}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" minHeight="50px">
            <Box
              display="flex"
              alignItems="center"
              border={`1.5px solid black`}
              mr="20px"
              p="2px 5px"
            >
              <IconButton onClick={() => setCount(Math.max(count - 1, 1))}>
                <RemoveIcon />
              </IconButton>
              <Typography sx={{ p: "0 5px" }}>{count}</Typography>
              <IconButton onClick={() => setCount(Math.max(count + 1))}>
                <AddIcon />
              </IconButton>
            </Box>

            <Button
              variant="contained"
              sx={{
                borderRadius: 0,
                minWidth: "150px",
                padding: "10px 40px",
              }}
              onClick={() => addToCart()}
            >
              ADD TO CART
            </Button>
          </Box>

          <Box m="20px 0 5px 0">
            <Typography>CATEGORIES: {item?.attributes?.category}</Typography>
            <Typography>RATED: {item?.attributes?.rating}</Typography>
          </Box>
        </Box>
      </Box>

      {/* INFORMATION */}
      <Box m="20px 0">
        <Tabs value={value} onChange={handleChange}>
          <Tab label="RELATED PRODUCTS" value="relatedProducts" />
          <Tab label="REVIEWS" value="reviews" />
        </Tabs>
      </Box>

      <Box display="flex" flexWrap="wrap" gap="15px">
        {/* RELATED ITEMS TAB */}
        {value === "relatedProducts" && (
          <Box mt="10px" width="100%">
            <Typography variant="h4" fontWeight="bold">
              Related Products
            </Typography>
            <Box
              display="grid"
              gridTemplateColumns="repeat(auto-fill, 300px)"
              justifyContent="space-around"
              rowGap="20px"
              columnGap="1.33%"
              margin="0 auto"
              mt="20px"
            >
              {items.map((item, i) => (
                <Item key={`${item.name}-${i}`} item={item} />
              ))}
            </Box>
          </Box>
        )}
        {value === "reviews" && (
          <Box width="100%">
            <Button
              sx={{
                backgroundColor: "navy",
                color: "white",
                borderRadius: 0,
                padding: "10px 40px",
              }}
              onClick={() => navigate(`/review/${itemId}`)}
            >
              Write a Review
            </Button>
            {/* REVIEWS TAB */}
            {reviews.map((review) => (
              <Box key={review.id}>
                <Box
                  mt="40px"
                  mb="40px"
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                  }}
                >
                  <Box>
                    {/* REVIEW AUTHOR */}
                    <Typography fontWeight="bold">
                      {review.attributes.author}
                    </Typography>
                    <Typography sx={{ opacity: ".7" }}>
                      {new Date(review.attributes.createdAt).toDateString()}
                    </Typography>
                  </Box>
                  {/* REVIEW RATING */}
                  <Box display="flex">
                    <Rating value={review.attributes.rating} />
                    <Typography paddingLeft="10px">
                      {review.attributes.rating}
                    </Typography>
                  </Box>
                  {/* REVIEW CONTENT */}
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {review.attributes.title}
                    </Typography>
                    <Typography sx={{ opacity: ".7" }}>
                      {review.attributes.content}
                    </Typography>
                  </Box>
                </Box>
                <Divider />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ItemDetails;
