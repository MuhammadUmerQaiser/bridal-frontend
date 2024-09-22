import React from 'react';
import { Row, Col } from 'react-bootstrap'; // Assuming you're using react-bootstrap for layout

const products = Array(12).fill({
  imageSrc: "https://cdn.pixelbin.io/v2/black-bread-289bfa/t.resize(w:2500)/Manish_1/Evara_Part_5_(7_Styles)/MMN-LH-56200-BL-DP-HV-AC_C-XS/MMN-LH-56200-BL-DP-HV-AC_C-XS-1.jpg",
  imageAlt: "Red Raw Silk Embroidered Lehenga Set",
  link: "/product/red-raw-silk-embroidered-lehenga-set-MMN-LH-56200-BL-DP-HV-AC_C-XS",
  brand: "COUTURE",
  title: "Red Raw Silk Embroidered Lehenga Set"
});

const ProductItem = ({ product }) => {
  return (
    <Col md={3}>
      <div className="catalog-card">
        <div className="product-item">
          <div className="product-img">
            <a href={product.link}>
              <img
                src={product.imageSrc}
                alt={product.imageAlt}
              />
            </a>
            <div className="wishlist-icon">
              <span className="icon wishlist-ico add">
                <img
                  src="https://manishmalhotra.in/_nuxt/img/wishlist-icon.ee75025.svg"
                  alt="Add to Wishlist"
                  className="wishlist-empty"
                />
                <img
                  src="https://manishmalhotra.in/_nuxt/img/wishlist-fill-icon.3bf88cf.svg"
                  alt="Wishlist Filled"
                  className="wishlist-fill-icon"
                />
              </span>
              <span className="icon gallery-icon">
                <img
                  src="https://manishmalhotra.in/_nuxt/img/slider-icon.46ada53.svg"
                  alt="Gallery Icon"
                />
              </span>
            </div>
          </div>

          <div className="product-detail">
            <div className="brand-name">{product.brand}</div>
            <h4>
              <a href={product.link}>{product.title}</a>
            </h4>
            <p className="price-request">
              <a href={product.link}>Price on Request</a>
            </p>
          </div>
        </div>
      </div>
    </Col>
  );
};

const ProductList = () => {
  return (
    <Row>
      {products.map((product, index) => (
        <ProductItem key={index} product={product} />
      ))}
    </Row>
  );
};

export default ProductList;