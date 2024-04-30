import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PlatformList = () => {
  const [platforms, setPlatforms] = useState([]);

  const navigate = useNavigate();

  const getPlatforms = async () => {
    const platformsResponse = await fetch(
      `${process.env.REACT_APP_PUBLIC_STRAPI_URL}/api/platforms?populate=image`,
      {
        method: "GET",
      }
    );

    const platformsJson = await platformsResponse.json();

    setPlatforms(platformsJson.data);
  };

  useEffect(() => {
    getPlatforms();
  }, []);

  return (
    <Box width="80%" margin="auto">
      <Typography variant="h3" textAlign="center">
        Browse by <b>Platform</b>
      </Typography>
      <Box
        margin="40px auto"
        display="grid"
        gridTemplateColumns="repeat(auto-fill, 200px)"
        justifyContent="space-around"
        rowGap="20px"
        columnGap="1.33%"
      >
        {platforms.map((platform, index) => (
          <Box
            margin="auto"
            onClick={() =>
              navigate(`/products?platform=${platform?.attributes.name}`)
            }
            sx={{ cursor: "pointer" }}
          >
            <Box
              key={index}
              borderRadius={100}
              height="200px"
              width="200px"
              sx={{
                backgroundColor: "#f9f9f9",
                "&:hover": {
                  opacity: "0.8",
                  transition: "opacity .5s",
                },
              }}
              mb="10px"
              overflow="hidden"
            >
              <img
                alt={platform?.attributes.name}
                src={`${process.env.REACT_APP_PUBLIC_STRAPI_URL}${platform?.attributes?.image?.data?.attributes?.formats?.small?.url}`}
                height="100%"
                width="100%"
                style={{
                  objectFit: "contain",
                  objectPosition: "center",
                }}
              />
            </Box>
            <Typography textAlign="center" fontWeight="bold">
              {platform?.attributes.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PlatformList;
