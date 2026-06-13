import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import ProductCard from "../components/ProductCard";
import PageLoader from "../components/PageLoader";
import { cachedGet } from "../utils/apiCache";
import { preloadImages } from "../utils/imageCache";
import { enqueueSnackbar } from "notistack";

const CategoryCatalogListing = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchCategoryBySlug = async () => {
      setLoading(true);
      try {
        const data = await cachedGet(
          `https://naqshzari.com/backend/public/api/get-category-by-slug/${slug}`,
          { headers: { Accept: "application/json" } }
        );

        if (data.status === 200) {
          setCategory(data.data);
          preloadImages((data.data.catalogs || []).map((item) => item.image), {
            first: 8,
            concurrency: 3,
          });
        } else {
          enqueueSnackbar("Category not found", {
            variant: "error",
            autoHideDuration: 2000,
          });
        }
      } catch (error) {
        enqueueSnackbar("Error fetching category", {
          variant: "error",
          autoHideDuration: 2000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryBySlug();
  }, [slug]);

  return (
    <div className="page-shell">
      <Header />
      <PageHeader title={category?.title || "Category"} />

      <div className="page-body">
        {loading && (
          <div className="page-loading">
            <PageLoader />
          </div>
        )}

        {!loading && category?.catalogs?.length > 0 && (
          <div className="product-grid">
            {category.catalogs.map((product, index) => (
              <ProductCard
                key={product.slug || index}
                product={product}
                priority={index < 8}
              />
            ))}
          </div>
        )}

        {!loading && (!category?.catalogs || category.catalogs.length === 0) && (
          <p className="page-empty">No catalogs available at the moment.</p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CategoryCatalogListing;
