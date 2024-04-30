import {
  Box,
  Typography,
  Pagination,
  Stack,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TuneIcon from "@mui/icons-material/Tune";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Item from "../../components/Item";
import styled from "@emotion/styled";
import games from "../../assets/banner/games-banner.jpg";

const FlexBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const initialFilters = {
    platform: searchParams.get("platform") ? searchParams.get("platform") : "",
    rating: "",
    category: "",
  };

  const [filters, setFilters] = useState(initialFilters);

  const getPlatforms = async () => {
    const platformsResponse = await fetch(
      `${process.env.REACT_APP_PUBLIC_STRAPI_URL}/api/platforms`,
      { method: "GET" }
    );

    const platformsJson = await platformsResponse.json();

    setPlatforms(platformsJson.data);
  };

  const getProducts = async () => {
    const name = searchParams.get("name");
    const platform = filters.platform;
    const rating = filters.rating;
    const category = filters.category;

    let url = `${process.env.REACT_APP_PUBLIC_STRAPI_URL}/api/items?populate=image&pagination[page]=${pageIndex}&pagination[pageSize]=12&populate[0]=platform`;

    if (name) {
      url += `&filters[name][$contains]=${name}`;
    }

    if (platform) {
      url += `&filters[platform][name][$contains]=${platform}`;
    }

    if (rating) {
      url += `&filters[rating][$eq]=${rating}`;
    }

    if (category) {
      url += `&filters[category][$eq]=${category}`;
    }

    const productsResponse = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const productsJson = await productsResponse.json();

    setProducts(productsJson);
  };

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.value === "price") {
      value = Number(value);
    }

    setFilters({ ...filters, [e.target.name]: value });
  };

  useEffect(() => {
    getProducts();
  }, [pageIndex, searchParams, filters]);

  useEffect(() => {
    getPlatforms();
  }, []);

  return (
    <>
      <Box
        margin="0 0 20px 0"
        height="150px"
        overflow="hidden"
        sx={{ backgroundColor: "gray" }}
      >
        <img
          src={games}
          alt="products-banner"
          style={{
            width: "100%",
            objectFit: "contain",
            objectPosition: "center",
            backgroundAttachment: "fixed",
          }}
        />
      </Box>
      <Box width="80%" margin="40px auto">
        <Box mb="20px">
          <Box display="flex" gap="6px">
            <Typography variant="h6" sx={{ opacity: 0.7 }}>
              Search results for:{" "}
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {" "}
              "{searchParams.get("name")}"
            </Typography>
          </Box>
          <Box display="flex" gap="10px">
            <Button
              variant="outlined"
              sx={{ padding: "10px 30px", borderRadius: 0 }}
              startIcon={<TuneIcon />}
              onClick={() => setIsFiltersOpen(true)}
            >
              Filters
            </Button>
            {filters.platform && (
              <Box
                display="flex"
                alignContent="center"
                alignItems="center"
                gap="6px"
                sx={{
                  padding: "10px 20px",
                  borderRadius: 4,
                  backgroundColor: "black",
                  color: "white",
                }}
              >
                <Typography>{filters.platform}</Typography>
                <IconButton
                  sx={{ color: "white" }}
                  onClick={() => {
                    setFilters({ ...filters, platform: "" });
                    setPageIndex(1);
                    getProducts();
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            )}
            {filters.category && (
              <Box
                display="flex"
                alignContent="center"
                alignItems="center"
                gap="6px"
                sx={{
                  padding: "10px 20px",
                  borderRadius: 4,
                  backgroundColor: "black",
                  color: "white",
                }}
              >
                <Typography>{filters.category}</Typography>
                <IconButton
                  sx={{ color: "white" }}
                  onClick={() => {
                    setFilters({ ...filters, category: "" });
                    setPageIndex(1);
                    getProducts();
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            )}
            {filters.rating && (
              <Box
                display="flex"
                alignContent="center"
                alignItems="center"
                gap="6px"
                sx={{
                  padding: "10px 20px",
                  borderRadius: 4,
                  backgroundColor: "black",
                  color: "white",
                }}
              >
                <Typography>{filters.rating}</Typography>
                <IconButton
                  sx={{ color: "white" }}
                  onClick={() => {
                    setFilters({ ...filters, rating: "" });
                    setPageIndex(1);
                    getProducts();
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            )}
          </Box>
        </Box>
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fill, 300px)"
          justifyContent="space-around"
          rowGap="20px"
          columnGap="1.33%"
          margin="0 auto"
        >
          {products?.data?.length === 0 && <Typography>No Products</Typography>}
          {products?.data?.map((product) => (
            <Item key={product.id} item={product} />
          ))}
        </Box>
        <Box display="flex" margin="40px auto" justifyContent="center">
          <Stack spacing={2}>
            <Pagination
              count={products?.meta?.pagination.pageCount}
              page={pageIndex}
              shape="rounded"
              onChange={(e, value) => {
                setPageIndex(value);
              }}
            />
          </Stack>
        </Box>
      </Box>
      <Box
        display={isFiltersOpen ? "block" : "none"}
        backgroundColor="rgba(0, 0, 0, 0.4)"
        position="fixed"
        zIndex={10}
        width="100%"
        height="100%"
        left="0"
        top="0"
        overflow="auto"
      >
        <Box
          position="fixed"
          left="0"
          bottom="0"
          width="max(400px, 20%)"
          height="100%"
          backgroundColor="white"
        >
          <Box padding="30px" overflow="auto" height="100%">
            <FlexBox mb="15px">
              <Typography variant="h3" fontWeight="bold">
                FILTERS
              </Typography>
              <IconButton onClick={() => setIsFiltersOpen(false)}>
                <CloseIcon />
              </IconButton>
            </FlexBox>
            <Box display="flex" flexDirection="column" gap="20px">
              <FormControl fullWidth>
                <InputLabel>Platform</InputLabel>
                <Select
                  label="Platform"
                  name="platform"
                  value={filters.platform}
                  onChange={(e) => handleChange(e)}
                >
                  {platforms.map((platform) => (
                    <MenuItem value={platform?.attributes.name}>
                      {platform?.attributes.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  label="Category"
                  name="category"
                  value={filters.category}
                  onChange={(e) => handleChange(e)}
                >
                  <MenuItem value={"newArrivals"}>New Arrivals</MenuItem>
                  <MenuItem value={"bestSellers"}>Best Sellers</MenuItem>
                  <MenuItem value={"topRated"}>Top Rated</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Rating</InputLabel>
                <Select
                  label="Rating"
                  name="rating"
                  value={filters.rating}
                  onChange={(e) => handleChange(e)}
                >
                  <MenuItem value={"E"}>E - Everyone</MenuItem>
                  <MenuItem value={"E10"}>E - Everyone 10+</MenuItem>
                  <MenuItem value={"T"}>T - Teen</MenuItem>
                  <MenuItem value={"M"}>M - Mature</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box m="20px 0">
              <Button
                variant="outlined"
                color="error"
                sx={{
                  borderRadius: 0,
                  minWidth: "100%",
                  padding: "20px 40px",
                  m: "10px 0",
                }}
                onClick={() => {
                  setFilters(initialFilters);
                }}
              >
                CLEAR FILTERS
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Products;
