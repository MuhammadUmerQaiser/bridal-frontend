import React from 'react'
import Bride from '../assets/Images/bride.avif'
import { Col, Container, Row } from 'react-bootstrap'
import ProductItem from '../components/ProductItem'
import Header from '../components/Header'
import Footer from '../components/Footer'

const CatalogListing = () => {
    const products = Array(12).fill({
  imageSrc: "https://cdn.pixelbin.io/v2/black-bread-289bfa/t.resize(w:2500)/Manish_1/Evara_Part_5_(7_Styles)/MMN-LH-56200-BL-DP-HV-AC_C-XS/MMN-LH-56200-BL-DP-HV-AC_C-XS-1.jpg",
  imageAlt: "Red Raw Silk Embroidered Lehenga Set",
  link: "/product/red-raw-silk-embroidered-lehenga-set-MMN-LH-56200-BL-DP-HV-AC_C-XS",
  brand: "COUTURE",
  title: "Red Raw Silk Embroidered Lehenga Set"
});
    return (
        <>
        <Header/>
            <div className='catalog-section'>
                <div className='catalog-title'>Catalog Listing</div>
                <Row>
      {products.map((product, index) => (
        <ProductItem key={index} product={product} />
      ))}
    </Row>
            </div>
            <Footer/>
        </>
    )
}

export default CatalogListing