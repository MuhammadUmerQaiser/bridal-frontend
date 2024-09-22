import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Row, Col, Container } from 'react-bootstrap'
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from "swiper/react";
import LikeGirl from '../assets/Images/maylikegirl.avif';
import Form from 'react-bootstrap/Form';
import Arrow from '../assets/Images/arrow.png';
import MainBride from '../assets/Images/mainbride.avif';
import Header from '../components/Header';
import Footer from '../components/Footer';




const CatalogDetails = () => {
  const DetailsComponent = () => <div className='right-text'>
    This is a three piece look.
    Kindly note, product tones may vary due to lighting.
    For queries or customisations, please mail us at: orders@manishmalhotra.in
  </div>;
  const CareInstructionComponent = () => <div className='right-text'>Dry Clean Only</div>;
  const FitComponent = () => <div className='right-text'>Tailored  </div>;
  const LegalComponent = () => <div className='right-text'>This is a three piece look.
    Kindly note, product tones may vary due to lighting.
    For queries or customisations, please mail us at: orders@manishmalhotra.in</div>;
  const [activeComponent, setActiveComponent] = useState(null);

  const renderComponent = () => {
    switch (activeComponent) {
      case 'details':
        return <DetailsComponent />;
      case 'care':
        return <CareInstructionComponent />;
      case 'fit':
        return <FitComponent />;
      case 'legal':
        return <LegalComponent />;
      default:
        return <div></div>;
    }
  };

  return (
    <>
    <Header/>
      <div className='catalog-details-section'>
        <Container>
          <Row>
            <Col md={5}>
            <div className='main-bride'>
              <img src={MainBride}/>
              </div>
            </Col>
            <Col md={7}>
              <div className='product-data'>
                <div className='share-icon-line'>
                  <div className='product-name'>Lotus Bloom Ivory Embroidered Lehenga Set</div>
                  <div>
                    <svg width="17" height="21" viewBox="0 0 17 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.6133 2.96875L3.53719 10.5836L14.6133 18.1984" stroke="black" stroke-width="1.45455" />
                      <circle cx="2.07677" cy="2.07677" r="2.07677" transform="matrix(-1 0 0 1 4.92383 8.50781)" fill="white" stroke="black" stroke-width="1.45455" />
                      <circle cx="2.07677" cy="2.07677" r="2.07677" transform="matrix(-1 0 0 1 16 15.4336)" fill="white" stroke="black" stroke-width="1.45455" />
                      <circle cx="2.07677" cy="2.07677" r="2.07677" transform="matrix(-1 0 0 1 16 1.58594)" fill="white" stroke="black" stroke-width="1.45455" />
                    </svg>
                  </div>
                </div>
                <div className='product-desc'>
                  Lotus Bloom Ivory embroidered silk lehenga, paired with a matching gold blouse and ivory embroidered dupatta.<br /><br />
                  Fabric: Silk.
                  <br />
                  Color: Ivory.
                  <br />
                  Set Includes: Lehenga, Blouse & Dupatta.
                  <br /><br />
                  The ensemble is complemented by Manish Malhotra High Jewellery. For enquiries, please contact orders@manishmalhotra.in or call +91 93219 92634.
                </div>
              </div>
              <div className='price-line product-desc' style={{ marginTop: "20px", marginBottom: "20px" }}>
                <div className='product-amount' style={{ color: "black", fontWeight: "500", fontSize: "20px" }}>
                  MRP: $ 5367
                </div>
                <div className='us-dropdown'>
                  <Form.Select aria-label="Select Country">
                    <option>US</option>
                    <option value="1">Pakistan</option>
                    <option value="2">India</option>
                    <option value="3">Dubai</option>
                  </Form.Select>
                </div>
              </div>
              <div className='size-line product-desc'>
                <div>
                  <div>Size</div>
                  <div className='size-box-line'>
                    <div className='size-box'>S</div>
                    <div className='size-box'>M</div>
                    <div className='size-box'>L</div>
                    <div className='size-box'>XL</div>
                    <div className='size-box'>Custom Size</div>
                  </div>
                </div>
                <div style={{cursor:"pointer"}}>Size Guide</div>
              </div>
              <div className='product-data product-desc' style={{ color: "rgb(0 128 0)" }}>
                Made to order: 7 - 8 Weeks
              </div>
              <div className='btn-lines product-data product-desc'>
                <div className='enquire-btn'>Enquire</div>
              </div>


            </Col>
          </Row>
          <div className='left-section-accordion'>
            <Row>
              <Col md={4}>
                <div className='accordion-left' onClick={() => setActiveComponent('details')}>
                  <div>Details</div>
                  <div>
                    <img className='img-fluid' src={Arrow} />
                  </div>
                </div>
                <div className='accordion-left' onClick={() => setActiveComponent('care')}>
                  <div>Care Instruction</div>
                  <div>
                    <img className='img-fluid' src={Arrow} />
                  </div>                </div>
                <div className='accordion-left' onClick={() => setActiveComponent('fit')}>
                  <div>Fit</div>
                  <div>
                    <img className='img-fluid' src={Arrow} />
                  </div>                </div>
                <div className='accordion-left' onClick={() => setActiveComponent('legal')}>
                  <div>Legal</div>
                  <div>
                    <img className='img-fluid' src={Arrow} />
                  </div>                </div>
              </Col>
              <Col md={8}>
                <div>
                  {renderComponent()}
                </div>
              </Col>
            </Row>
          </div>
          <div className='you-also-like'>
            <div className='heading'>You May Also Like</div>
            <Swiper className="mySwiper" slidesPerView={4.5} loop={true} spaceBetween={20}>
              <SwiperSlide>
                <div className='img-size-like'>
                  <img src={LikeGirl} />
                  <div className='dress-title'>
                    Hazy Lavender Embroidered Lehenga Set
                  </div>
                  <div className='dress-title' style={{ fontSize: "14px", paddingTop: "10px" }}>
                    PKR 50,000
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className='img-size-like'>
                  <img src={LikeGirl} />
                  <div className='dress-title'>
                    Hazy Lavender Embroidered Lehenga Set
                  </div>
                  <div className='dress-title' style={{ fontSize: "14px", paddingTop: "10px" }}>
                    PKR 50,000
                  </div>
                </div>
              </SwiperSlide>              <SwiperSlide>
                <div className='img-size-like'>
                  <img src={LikeGirl} />
                  <div className='dress-title'>
                    Hazy Lavender Embroidered Lehenga Set
                  </div>
                  <div className='dress-title' style={{ fontSize: "14px", paddingTop: "10px" }}>
                    PKR 50,000
                  </div>
                </div>
              </SwiperSlide>              <SwiperSlide>
                <div className='img-size-like'>
                  <img src={LikeGirl} />
                  <div className='dress-title'>
                    Hazy Lavender Embroidered Lehenga Set
                  </div>
                  <div className='dress-title' style={{ fontSize: "14px", paddingTop: "10px" }}>
                    PKR 50,000
                  </div>
                </div>
              </SwiperSlide>              <SwiperSlide>
                <div className='img-size-like'>
                  <img src={LikeGirl} />
                  <div className='dress-title'>
                    Hazy Lavender Embroidered Lehenga Set
                  </div>
                  <div className='dress-title' style={{ fontSize: "14px", paddingTop: "10px" }}>
                    PKR 50,000
                  </div>
                </div>
              </SwiperSlide>              <SwiperSlide>
                <div className='img-size-like'>
                  <img src={LikeGirl} />
                  <div className='dress-title'>
                    Hazy Lavender Embroidered Lehenga Set
                  </div>
                  <div className='dress-title' style={{ fontSize: "14px", paddingTop: "10px" }}>
                    PKR 50,000
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </Container>
        <Footer/>
      </div>
    </>
  )
}

export default CatalogDetails