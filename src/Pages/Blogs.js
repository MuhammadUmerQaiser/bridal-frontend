import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LazyImage from "../components/LazyImage";
import { Col, Container, Row } from "react-bootstrap";
import { cachedGet } from "../utils/apiCache";
import { preloadImages } from "../utils/imageCache";
import { useNavigate } from "react-router-dom";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // BlogCard Component
  const BlogCard = ({ title, image, description, author, date, slug }) => {
    return (
      <div className="blog-card">
        <LazyImage
          src={image}
          alt={title}
          className="blog-image"
          onClick={() => navigate(`/blog-details/${slug}`)}
        />
        <div className="blog-content">
          <h3 className="blog-title">{title}</h3>
          {/* <p className="blog-description">{description}</p> */}
          <div className="blog-info">
            <span className="blog-author"></span>
            <span className="blog-date">{date}</span>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    cachedGet("https://naqshzari.com/backend/public/api/get-all-blogs", {
      headers: { Accept: "application/json" },
    })
      .then(async (data) => {
        if (data.status === 200) {
          let blogsData = data.data;
          blogsData = blogsData.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          setBlogs(blogsData);
          const images = blogsData.flatMap((post) => {
            const sectionImage = post.sections?.[0]?.image;
            return [sectionImage, post.image].filter(Boolean);
          });
          await preloadImages(images, { size: "card" });
        }
      })
      .catch((error) => {
        console.error("Error fetching blogs", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Header />
      <div className="contact-section mb-5">
        <div className="contact-form-styling">
          <div className="contact-heading">Blogs</div>
        </div>
      </div>
      <div className="blog-list">
        <Container>
          <Row>
            {loading ? (
              <p>Loading...</p>
            ) : blogs.length === 0 ? (
              <h3 className="font-weight-bold mb-5">No blogs found.</h3>
            ) : (
              blogs.map((post, index) => {
                let sectionImage = "";
                if (post.sections && post.sections.length > 0) {
                  sectionImage = post.sections[0].image;
                }
                const image = sectionImage || post.image || "default-image.jpg";
                const author =
                  post.user && post.user.name ? post.user.name : "Unknown";
                const date = post.created_at
                  ? new Date(post.created_at).toLocaleDateString()
                  : "";
                return (
                  <Col md={4} key={index}>
                    <BlogCard
                      title={post.title}
                      image={image}
                      description={post.description}
                      author={author}
                      date={date}
                      slug={post.slug}
                    />
                  </Col>
                );
              })
            )}
          </Row>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Blogs;
