import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import ProductCard from "../components/ProductCard";
import PageLoader from "../components/PageLoader";
import { cachedGet } from "../utils/apiCache";
import { preloadImages } from "../utils/imageCache";
import { enqueueSnackbar } from "notistack";

const CatalogListing = () => {
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchCatalogs = async () => {
      try {
        const data = await cachedGet(
          "https://naqshzari.com/backend/public/api/get-all-catalogs",
          { headers: { Accept: "application/json" } }
        );

        if (data.status === 200) {
          setCatalogs(data.data);
          preloadImages(
            data.data.map((item) => item.image),
            { first: 8, concurrency: 3, size: "card" }
          );
        } else {
          setError(true);
          enqueueSnackbar("Internal Server Error", {
            variant: "error",
            autoHideDuration: 2000,
          });
        }
      } catch (fetchError) {
        setError(true);
        enqueueSnackbar("Internal Server Error", {
          variant: "error",
          autoHideDuration: 2000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogs();
  }, []);

  return (
    <div className="page-shell">
      <Header />
      <PageHeader title="Catalog Listing" />

      <div className="page-body">
        {loading && (
          <div className="page-loading">
            <PageLoader />
          </div>
        )}

        {!loading && !error && catalogs.length > 0 && (
          <div className="product-grid">
            {catalogs.map((product, index) => (
              <ProductCard
                key={product.slug || index}
                product={product}
                priority={index < 8}
              />
            ))}
          </div>
        )}

        {!loading && (error || catalogs.length === 0) && (
          <p className="page-empty">No catalogs available at the moment.</p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CatalogListing;
