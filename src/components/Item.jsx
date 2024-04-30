import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, Typography, Button } from "@mui/material";

const Item = ({ item }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const { category, price, name, image } = item.attributes;

  const {
    data: {
      attributes: {
        formats: {
          small: { url },
        },
      },
    },
  } = image;

  return (
    <Box
      border={1}
      borderColor="#e0e0e0"
      borderRadius={0}
      paddingBottom="10px"
      boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.1)"
      onClick={() => navigate(`/item/${item.id}`)}
      sx={{
        cursor: "pointer",
        "&:hover": {
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2)",
          transition: "box-shadow .5s",
        },
      }}
    >
      <Box
        position="relative"
        onMouseOver={() => setIsHovered(true)}
        onMouseOut={() => setIsHovered(false)}
        padding="20px"
      >
        <Box height="300px" m="auto" display="flex">
          <img
            alt={item.name}
            width="100%"
            height="100%"
            src={`${process.env.REACT_APP_PUBLIC_STRAPI_URL}${url}`}
            style={{
              objectFit: "contain",
              objectPosition: "center",
            }}
          />
        </Box>
      </Box>

      <Box padding="10px">
        <Typography variant="subtitle2" color="black">
          {category
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())}
        </Typography>
        <Typography>{name}</Typography>
        <Typography fontWeight="bold">${price}</Typography>
      </Box>
    </Box>
  );
};

export default Item;
