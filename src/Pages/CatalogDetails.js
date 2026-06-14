import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import ProductCard from "../components/ProductCard";
import { cachedGet } from "../utils/apiCache";
import { markImageCached, preloadImages } from "../utils/imageCache";
import { optimizeImageUrl } from "../utils/optimizeImage";
import { enqueueSnackbar } from "notistack";
import PageLoader from "../components/PageLoader";

const CatalogDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [catalog, setCatalog] = useState(null);
  const [relatedCatalogs, setRelatedCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlide, setSelectedSlide] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const data = await cachedGet(
          `https://naqshzari.com/backend/public/api/get-catalog-by-slug/${slug}`,
          { headers: { Accept: "application/json" } }
        );

        if (data.status === 200) {
          const catalogData = data.data;
          setCatalog(catalogData);
          setSelectedSlide(catalogData.image);
          setRelatedCatalogs(data.related_products || []);

          const galleryUrls = [
            catalogData.image,
            ...(catalogData.catalog_images || []).map((img) => img.img),
          ].filter(Boolean);

          preloadImages([...new Set(galleryUrls)], { concurrency: 4, size: "large" });
          preloadImages(
            (data.related_products || []).map((item) => item.image),
            { first: 4, concurrency: 2, size: "card" }
          );
        } else {
          enqueueSnackbar("Internal Server Error", {
            variant: "error",
            autoHideDuration: 2000,
          });
        }
      } catch (error) {
        enqueueSnackbar("Internal Server Error", {
          variant: "error",
          autoHideDuration: 2000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [slug]);

  const galleryImages = useMemo(() => {
    if (!catalog) return [];
    const urls = [
      catalog.image,
      ...(catalog.catalog_images || []).map((image) => image.img),
    ].filter(Boolean);
    return [...new Set(urls)];
  }, [catalog]);

  const activeImage = selectedSlide || catalog?.image;
  const mainImageSrc = activeImage ? optimizeImageUrl(activeImage, "large") : null;

  return (
    <div className="page-shell">
      <Header />

      {loading && (
        <div className="page-loading">
          <PageLoader />
        </div>
      )}

      {!loading && catalog && (
        <>
          <PageHeader title={catalog.title} />
          <Container className="detail-section">
            <div className="detail-layout">
              <div className="detail-gallery">
                <div className="detail-main-image">
                  {mainImageSrc && (
                    <img
                      src={mainImageSrc}
                      alt={catalog.title}
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                      onLoad={() => {
                        markImageCached(activeImage);
                        markImageCached(mainImageSrc);
                      }}
                    />
                  )}
                </div>

                {galleryImages.length > 1 && (
                  <div className="detail-thumbs">
                    {galleryImages.map((image, index) => {
                      const thumbSrc = optimizeImageUrl(image, "detailThumb");
                      return (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        className={`detail-thumb${
                          activeImage === image ? " is-active" : ""
                        }`}
                        onClick={() => setSelectedSlide(image)}
                      >
                        <img
                          src={thumbSrc}
                          alt={`View ${index + 1}`}
                          loading={index < 8 ? "eager" : "lazy"}
                          decoding="async"
                          onLoad={() => {
                            markImageCached(image);
                            markImageCached(thumbSrc);
                          }}
                        />
                      </button>
                    );
                    })}
                  </div>
                )}
              </div>

              <div className="detail-info">
                <div className="detail-meta">
                  {catalog.fabric && (
                    <div className="detail-meta-row">
                      <span className="detail-meta-label">Fabric</span>
                      <span className="detail-meta-value">{catalog.fabric}</span>
                    </div>
                  )}
                  {catalog.color && (
                    <div className="detail-meta-row">
                      <span className="detail-meta-label">Color</span>
                      <span className="detail-meta-value">{catalog.color}</span>
                    </div>
                  )}
                  {catalog.category?.title && (
                    <div className="detail-meta-row">
                      <span className="detail-meta-label">Category</span>
                      <span className="detail-meta-value">
                        {catalog.category.title}
                      </span>
                    </div>
                  )}
                </div>

                {catalog.description && (
                  <div className="detail-description">
                    {catalog.description
                      .replace(
                        /The ensemble is complemented by Naqshzari\.[\s\S]*?(orders@naqshzari\.com|support@naqshzari\.com)[^\n]*/gi,
                        ""
                      )
                      .trim()}
                  </div>
                )}

                <div className="detail-description">
                  The ensemble is complemented by Naqshzari. For enquiries,
                  please contact orders@naqshzari.com or call +923008220544.
                </div>

                <div className="detail-leadtime">Made to order: 7 - 8 Weeks</div>

                <div className="enquire-btn" onClick={() => navigate("/contact")}>
                  Enquire
                </div>
              </div>
            </div>

            {relatedCatalogs.length > 0 && (
              <section className="detail-related">
                <h3 className="detail-related__title">You May Also Like</h3>
                <div className="product-grid">
                  {relatedCatalogs.slice(0, 4).map((item, index) => (
                    <ProductCard key={item.slug || index} product={item} />
                  ))}
                </div>
              </section>
            )}
          </Container>
        </>
      )}

      <Footer />
    </div>
  );
};

export default CatalogDetails;
