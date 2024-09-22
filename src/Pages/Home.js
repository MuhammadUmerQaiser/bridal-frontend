import React from "react";
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import SliderOne from "../assets/Images/sliderimageone.avif";
import SliderTwo from "../assets/Images/sliderimagetwo.avif";
import SliderThree from "../assets/Images/sliderimagethree.avif";
import SliderFour from "../assets/Images/sliderimagefour.avif";
import Header from "../components/Header";
import { Row, Col } from "react-bootstrap";
import Lehnga from "../assets/Images/lehnga.avif";
import Alia from "../assets/Images/alia.avif";
import Kareena from "../assets/Images/kareena.avif";
import Kiara from "../assets/Images/kiara.avif";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Header />
      <div className="main-slider">
        <Swiper
          pagination={{
            clickable: true,
          }}
          navigation={true}
          loop={true}
          modules={[Pagination]}
          className="mySwiper"
        >
          <SwiperSlide>
            <img src={SliderOne} />
          </SwiperSlide>
          <SwiperSlide>
            <img src={SliderTwo} />
          </SwiperSlide>{" "}
          <SwiperSlide>
            <img src={SliderThree} />
          </SwiperSlide>{" "}
          <SwiperSlide>
            <img src={SliderFour} />
          </SwiperSlide>
        </Swiper>
      </div>
      {/* Main Card Section */}
      <div className="heading-text">Curated This Season</div>
      <div className="desc-text">
        A blend of classic silhouettes and our signature shine, embodied by
        enigmatic sequins.
      </div>
      <div className="cards-section mt-3">
        <Row>
          <Col md={3}>
            <div className="card-text-position">
              <div className="curated-card"></div>
              <div className="d-flex align-items-center justify-content-center card-body-text">
                <div className="lehnga-text">Lehngas</div>
                <hr />
              </div>
            </div>
          </Col>
          <Col md={3}>
            <div className="card-text-position">
              <div className="curated-card"></div>
              <div className="d-flex align-items-center justify-content-center card-body-text">
                <div className="lehnga-text">Lehngas</div>
                <hr />
              </div>
            </div>
          </Col>
          <Col md={3}>
            <div className="card-text-position">
              <div className="curated-card"></div>
              <div className="d-flex align-items-center justify-content-center card-body-text">
                <div className="lehnga-text">Lehngas</div>
                <hr />
              </div>
            </div>
          </Col>
          <Col md={3}>
            <div className="card-text-position">
              <div className="curated-card"></div>
              <div className="d-flex align-items-center justify-content-center card-body-text">
                <div className="lehnga-text">Lehngas</div>
                <hr />
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div className="girl-img">
        <img
          src="https://cdn.pixelbin.io/v2/black-bread-289bfa/81ub5U/original/manish-cms_images/1712663653HOME_PAGE_revised-_1531x731_VOWS.webp"
          class="dekshtop_only"
          alt=""
        ></img>
      </div>
      <div className="girl-img" style={{ marginTop: "0" }}>
        <img
          src="https://cdn.pixelbin.io/v2/black-bread-289bfa/81ub5U/original/manish-cms_images/1724055335JWL_banner_2.webp"
          width="4678"
          height="2234"
          alt="Fine Jewellery by Manish Malhotra"
        />
      </div>
      <div className="second-swiper">
        <Swiper
          slidesPerView={4.2}
          spaceBetween={30}
          loop={true}
          centeredSlides={true}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 3000, // 3 seconds between each slide
            disableOnInteraction: false, // Continue autoplay after user interaction
          }}
          className="mySwiper"
          modules={[Autoplay]}
        >
          <SwiperSlide>
            <img src={Alia} />
          </SwiperSlide>
          <SwiperSlide>
            <img src={Kareena} />
          </SwiperSlide>
          <SwiperSlide>
            <img src={Kiara} />
          </SwiperSlide>
          <SwiperSlide>
            <img src={Alia} />
          </SwiperSlide>
          <SwiperSlide>
            <img src={Kareena} />
          </SwiperSlide>
          <SwiperSlide>
            <img src={Kiara} />
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="video-section">
        <video
          src="https://admin.manishmalhotra.in/videos/2%202%201.MP4"
          type="video/mp4"
          width="100%"
          height="auto"
          playsinline=""
          loop="loop"
          muted=""
          autoplay="autoplay"
          controls="controls"
        ></video>
        <div className="video-section-text">
          <div className="video-heading">Summer 2024 Collection</div>
          <div className="video-btn">View the Collection</div>
        </div>
      </div>
      <div className="gray-video-section">
        <video
          src="https://admin.manishmalhotra.in/videos/couture_processd.mp4"
          type="video/mp4"
          width="100%"
          height="auto"
          class="dekshtop_only"
          playsinline=""
          loop="loop"
          muted=""
          autoplay="autoplay"
          controls="controls"
        ></video>
      </div>
      <Footer />
    </>
  );
};

export default Home;
