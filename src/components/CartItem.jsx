import {
  Box,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import { useNavigate } from "react-router-dom";

const CartItem = ({ item, changeQuantity, handleRemove }) => {
  const navigate = useNavigate();
  return (
    <Box
      padding="15px"
      borderRadius="10px"
      key={item.cartItemId}
      border={1}
      borderColor="#e0e0e0"
      mb="20px"
    >
      <Box
        display="flex"
        sx={{ flexDirection: { md: "row", sx: "column" } }}
        justifyContent="space-between"
        height="12em"
        my="10px"
      >
        {/* LEFT SIDE */}
        <Box display="flex" gap="20px">
          <Box
            sx={{
              width: { md: "180px", xs: "130px" },
              height: { md: "180px", xs: "130px" },
              backgroundColor: "#f9f9f9",
            }}
            overflow="hidden"
            borderRadius="10px"
            flexShrink="0"
            padding="10px"
          >
            <img
              alt={item?.item.attributes.name}
              src={`${process.env.REACT_APP_PUBLIC_STRAPI_URL}${item?.item?.attributes?.image?.data?.attributes?.formats?.small?.url}`}
              width="100%"
              height="100%"
              style={{
                objectFit: "contain",
                objectPosition: "center",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/item/${item?.item.id}`)}
            />
          </Box>

          <Box>
            <Typography fontWeight="bold">
              {item?.item.attributes.name}
            </Typography>
            <Typography color="gray">
              {item?.item.attributes.platform.data.attributes.name}
            </Typography>
            <Typography mb="10px">
              Rated <b>{item?.item.attributes.rating}</b>
            </Typography>
            <FormControl>
              <Select
                displayEmpty
                defaultValue={item?.count}
                onChange={changeQuantity}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={7}>7</MenuItem>
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={9}>9</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        {/* RIGHT SIDE */}
        <Box>
          <Typography>
            ${(item?.item.attributes.price * item?.count).toFixed(2)}
          </Typography>
          <Box>
            <IconButton color="error" onClick={handleRemove}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CartItem;
