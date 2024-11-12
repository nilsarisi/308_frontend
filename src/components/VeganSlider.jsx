import React from 'react';
import Slider from 'react-slick';
import './VeganSlider.css'; 
import sliderImage1 from '../assets/veganslider1.png';  
import sliderImage2 from '../assets/veganslider2.jpg';  
import sliderImage4 from '../assets/veganslider4.png';  
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 

const VeganSlider = () => {
  const settings = {
    dots: true,       
    infinite: true,     
    speed: 500,         
    slidesToShow: 1,    
    slidesToScroll: 1,  
    arrows: true,       
    autoplay: true,     
    autoplaySpeed: 5000, 
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        <div>
          <img src={sliderImage1} alt="Vegan Burger" className="slider-image" />
        </div>
        <div>
          <img src={sliderImage2} alt="Vegan Beauty" className="slider-image" />
        </div>
        <div>
          <img src={sliderImage4} alt="Vegan Products" className="slider-image" />
        </div>
      </Slider>
    </div>
  );
};

export default VeganSlider;
