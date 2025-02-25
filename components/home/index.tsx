import React from "react";
import HeroSection from "./hero-section";
import FeatureCategory from "./feature-category";
import TrendingProducts from "./trending-products";

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <FeatureCategory />
      <TrendingProducts />
    </div>
  );
};

export default HomePage;
