import { Box, Button, Rating, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Review = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { user, jwt, cartId } = JSON.parse(localStorage.getItem("user"));

  const [item, setItem] = useState(null);
  const [review, setReview] = useState({
    title: "",
    content: "",
    rating: null,
    author: user.username,
    itemId: itemId,
  });

  const getItem = async () => {
    const itemResponse = await fetch(
      `${process.env.REACT_APP_PUBLIC_STRAPI_URL}/api/items/${itemId}?populate=image`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const itemJson = await itemResponse.json();

    setItem(itemJson.data);
  };

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === "rating") {
      value = Number(value);
    }
    setReview({ ...review, [e.target.name]: value });
  };

  const submitReview = async () => {
    const reviewResponse = await fetch(
      `${process.env.REACT_APP_PUBLIC_STRAPI_URL}/api/reviews`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ data: { ...review } }),
      }
    );

    const itemResponse = await fetch(
      `${process.env.REACT_APP_PUBLIC_STRAPI_URL}/api/items/${itemId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          data: {
            numReviews: item.attributes.numReviews + 1,
            stars: item.attributes.stars + review.rating,
          },
        }),
      }
    );

    navigate(`/item/${itemId}`);
  };

  useEffect(() => {
    getItem();
  }, []);

  return (
    <Box width="80%" m="80px auto">
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}>
        {/* LEFT SIDE */}
        <Box>
          <Typography fontWeight="bold" variant="h4">
            Leave a Review
          </Typography>
          <Box m="20px auto">
            <Typography>Overall rating</Typography>
            <Rating
              name="rating"
              defaultValue={null}
              onChange={(e) => handleChange(e)}
            />
          </Box>
          <Box m="30px auto">
            <Typography>Add a title</Typography>
            <TextField name="title" onChange={(e) => handleChange(e)} />
          </Box>

          <Box>
            <Typography>Your Review</Typography>
            <TextField
              name="content"
              multiline
              rows={2}
              fullWidth
              onChange={(e) => handleChange(e)}
            />
          </Box>

          <Box m="30px auto">
            <Button
              variant="contained"
              m="auto"
              fullWidth
              sx={{
                padding: "20px 40px",
              }}
              onClick={submitReview}
            >
              Submit Review
            </Button>
          </Box>
        </Box>
        <Box
          m="auto"
          onClick={() => navigate(`/item/${itemId}`)}
          sx={{ cursor: "pointer" }}
        >
          <Box
            padding="10px"
            overflow="hidden"
            flexShrink="0"
            sx={{ width: "400px", height: "400px" }}
          >
            <img
              alt={item?.attributes.name}
              src={`${process.env.REACT_APP_PUBLIC_STRAPI_URL}${item?.attributes.image.data.attributes.formats.small.url}`}
              width="100%"
              height="100%"
              style={{
                objectFit: "contain",
                objectPosition: "center",
              }}
            />
          </Box>
          <Typography
            textAlign="center"
            fontWeight="bold"
            variant="h6"
            sx={{ textDecoration: "underline" }}
          >
            {item?.attributes.name}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Review;
