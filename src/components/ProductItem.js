import React, { useEffect, useState } from "react";
import { Row, Col, Spinner } from "react-bootstrap"; // Import Spinner for loading state
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack"; // Ensure notistack is imported for notifications
import { FadeLoader } from "react-spinners";
import LazyImage from "./LazyImage";
import { cachedGet } from "../utils/apiCache";
import { preloadImages } from "../utils/imageCache";

const ProductItem = ({ product }) => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  return (
    <Col className="sm-text-center" md={6} lg={3}>
      <div
        className="catalog-card"
        onClick={() => navigate(`/catalog-details/${product.slug}`)}
        style={{ cursor: "pointer" }}
      >
        <div className="product-item">
          <div className="product-img">
            <a>
              <LazyImage src={product.image} alt={product.title || "catalog image"} />
            </a>
          </div>

          <div className="product-detail">
            <h4>
              <a href="#">{product.title}</a>
            </h4>
          </div>
        </div>
      </div>
    </Col>
  );
};

const ProductList = () => {
  const [catalogs, setCatalogs] = useState([]); // State to store fetched catalogs
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(false); // State to manage error state

  const getAllCatalogs = async () => {
    setLoading(true);
    try {
      const data = await cachedGet(
        "https://naqshzari.com/backend/public/api/get-all-catalogs",
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      if (data.status === 200) {
        setCatalogs(data.data);
        await preloadImages(data.data.map((item) => item.image));
      } else {
        enqueueSnackbar("Internal Server Error", {
          variant: "error",
          autoHideDuration: 2000,
        });
        setError(true);
      }
    } catch (error) {
      enqueueSnackbar("Internal Server Error", {
        variant: "error",
        autoHideDuration: 2000,
      });
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getAllCatalogs(); // Fetch catalogs on component mount
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FadeLoader color="#B87F3F" loading={loading} width={3} height={10} />
      </div>
    );
  }

  if (error || catalogs.length === 0) {
    return (
      <h3
        className="text-center font-weight-bold"
      >
        No catalogs available at the moment.
      </h3>
    );
  }

  return (
    <Row>
      {catalogs.map((product, index) => (
        <ProductItem key={index} product={product} />
      ))}
    </Row>
  );
};

export default ProductList;
