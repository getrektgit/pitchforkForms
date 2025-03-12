import React from "react";
import Slider from "react-slick";
import { Box } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import image1 from "../images/carouselpic1.jpg";
import image2 from "../images/carouselpic2.jpg";
import image3 from "../images/carouselpic3.jpg";

const images = [image1, image2, image3];

const Carousel = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
    };

    return (
        <Box
            sx={{
                width: { xs: "100%", sm: "90%", md: "80%", lg: "80%", xl: "80%" },
                maxWidth: "1200px",
                margin: "auto",
                textAlign: "center",
            }}
        >
            <Slider {...settings}>
                {images.map((img, index) => (
                    <Box key={index} sx={{ display: "flex", justifyContent: "center" }}>
                        <img
                            src={img}
                            alt={`Slide ${index + 1}`}
                            style={{
                                width: "100%",
                                height: "auto", // Keeps the aspect ratio
                                borderRadius: "10px",
                                maxHeight: "400px",
                                objectFit: "cover",
                            }}
                        />
                    </Box>
                ))}
            </Slider>
        </Box>
    );
};

export default Carousel;
