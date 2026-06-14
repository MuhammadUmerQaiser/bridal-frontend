import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import ProductCard from "../components/ProductCard";
import PageLoader from "../components/PageLoader";
import { cachedGet } from "../utils/apiCache";
import { preloadImages } from "../utils/imageCache";
import { enqueueSnackbar } from "notistack";

const Collections = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchCategories = async () => {
      try {
        const data = await cachedGet(
          "https://naqshzari.com/backend/public/api/get-all-categories",
          { headers: { Accept: "application/json" } }
        );

        if (data.status === 200) {
          setCategories(data.data);
          preloadImages(data.data.map((item) => item.image), {
            first: 8,
            concurrency: 3,
            size: "card",
          });
        } else {
          enqueueSnackbar("Collection not found", {
            variant: "error",
            autoHideDuration: 2000,
          });
        }
      } catch (error) {
        enqueueSnackbar("Error fetching Collection", {
          variant: "error",
          autoHideDuration: 2000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="page-shell">
      <Header />
      <PageHeader
        title="Collections"
        subtitle="Explore our curated categories and discover signature Naqshzari pieces."
      />

      <div className="page-body">
        {loading && (
          <div className="page-loading">
            <PageLoader />
          </div>
        )}

        {!loading && categories.length > 0 && (
          <div className="product-grid">
            {categories.map((product, index) => (
              <ProductCard
                key={product.slug || index}
                product={product}
                variant="collection"
                priority={index < 8}
              />
            ))}
          </div>
        )}

        {!loading && categories.length === 0 && (
          <p className="page-empty">No collection available at the moment.</p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Collections;
