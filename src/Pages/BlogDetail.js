import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LazyImage from "../components/LazyImage";
import { Col, Container, Row } from "react-bootstrap";
import { cachedGet } from "../utils/apiCache";
import { preloadImages } from "../utils/imageCache";
import { useParams } from "react-router-dom";
import { FadeLoader } from "react-spinners";

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        const data = await cachedGet(
          `https://naqshzari.com/backend/public/api/get-blog-by-slug/${slug}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
        if (data.status === 200) {
          setBlog(data.data);
          await preloadImages(
            (data.data.sections || []).map((section) => section.image),
            { size: "large" }
          );
        }
      } catch (error) {
        console.error("Error fetching blog detail", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetail();
  }, [slug]);

  if (loading) {
    return (
      <div>
        <Header />
        <Container
          className="my-5"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "70vh",
          }}
        >
          <FadeLoader color="#B87F3F" loading={loading} />
        </Container>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return (
      <div>
        <Header />
        <Container className="my-5">
          <p>Blog not found.</p>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="contact-section mb-5">
        <div className="contact-form-styling">
          <div className="contact-heading">{blog.title}</div>
        </div>
        <Container>
          {blog.sections &&
            blog.sections.length > 0 &&
            blog.sections.map((section, index) => (
              <Row key={index} className="mb-5">
                {index % 2 === 0 ? (
                  <>
                    <Col md={8} className="mx-auto">
                      <div className="naqsh-about">
                        <LazyImage
                          src={section.image}
                          style={{ width: "100%" }}
                          alt={`Section ${index + 1}`}
                          size="large"
                          eager={index === 0}
                        />
                      </div>
                    </Col>
                    <Col md={8} className="mx-auto">
                      <div
                        className="contact-form-styling"
                        dangerouslySetInnerHTML={{
                          __html: section.description,
                        }}
                      />
                    </Col>
                  </>
                ) : (
                  <>
                    <Col md={8} className="mx-auto">
                      <div className="naqsh-about">
                        <LazyImage
                          src={section.image}
                          alt={`Section ${index + 1}`}
                          style={{ width: "100%" }}
                          size="large"
                        />
                      </div>
                    </Col>
                    <Col md={8} className="mx-auto">
                      <div
                        className="contact-form-styling"
                        dangerouslySetInnerHTML={{
                          __html: section.description,
                        }}
                      />
                    </Col>
                  </>
                )}
              </Row>
            ))}
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default BlogDetail;
