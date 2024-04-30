import React from "react";
import MainCarousel from "../../components/MainCarousel";
import ItemList from "../../components/ItemList";
import { Box } from "@mui/material";
import PlatformList from "../../components/PlatformList";

const Home = () => {
  return (
    <div className="home">
      <MainCarousel />
      <ItemList />
      <PlatformList />
    </div>
  );
};

export default Home;
