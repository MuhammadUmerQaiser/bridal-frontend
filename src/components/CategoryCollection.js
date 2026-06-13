import React, { useEffect, useState } from "react";
import { Row, Col, Spinner } from "react-bootstrap"; // Import Spinner for loading state
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Ensure axios is imported
import { enqueueSnackbar } from "notistack"; // Ensure notistack is imported for notifications
import { FadeLoader } from "react-spinners";
import LazyImage from "./LazyImage";

const CategoryCollection = ({ product }) => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  return (
    <Col className="sm-text-center" md={6} lg={3}>
      <div
        className="catalog-card"
        onClick={() => navigate(`/categories/${product.slug}`)}
        style={{ cursor: "pointer" }}
      >
        <div className="product-item">
          <div className="product-img">
            <a>
              <LazyImage src={product.image} alt={product.title || "collection image"} />
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

export default CategoryCollection;
