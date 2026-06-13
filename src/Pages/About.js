import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LazyImage from "../components/LazyImage";
import { Col, Container, Row } from "react-bootstrap";
import Naqsh from "../assets/naqshabout.jpeg";

const About = () => {
  return (
    <div>
      <Header />
      <div className="contact-section mb-5">
        <div className="contact-form-styling">
          <div className="contact-heading">About Us</div>
          {/* <p className='text-center'>As you explore the World of Manish Malhotra, our advisors would be pleased to assist you and provide tailored counsel.</p> */}
        </div>
        <Container>
          <Row>
            <Col md={6}>
              <div className="naqsh-about">
                <LazyImage src={Naqsh} alt="Naqshzari bridal craftsmanship" />
              </div>
            </Col>
            <Col md={6}>
              <div className="contact-form-styling">
                <p>
                  Welcome to Naqshzari, a name synonymous with the rich
                  traditions and artistry of Pakistani bridal wear. For
                  generations, long before the partition of India, our family
                  has been crafting exquisite bridal pieces that celebrate the
                  heritage and elegance of South Asian culture. Our journey
                  began as artisans behind some of the most esteemed bridal
                  brands, where we quietly dedicated ourselves to perfection and
                  quality.
                </p>
                <p>
                  Today, we proudly present Naqshzari, our family legacy brought
                  to life as a boutique brand. Each piece we create is a tribute
                  to the skill and passion passed down through generations. At
                  Naqshzari, we believe that a bridal dress is more than just
                  attire—it’s a story, a tradition, and a work of art. Join us
                  as we bring the timeless charm of traditional bridal wear to
                  the forefront, honoring our past and looking
                  forward to the future.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default About;
