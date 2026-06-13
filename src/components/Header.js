import React, { useEffect, useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import LazyImage from "./LazyImage";
import { useNavigate } from "react-router-dom";
import { cachedGet } from "../utils/apiCache";
import { preloadImages } from "../utils/imageCache";
import { FadeLoader } from "react-spinners";

const LOADER_COLOR = "#B87F3F";

const Header = () => {
  const navigate = useNavigate();
  const [showCollectionsPreview, setShowCollectionsPreview] = useState(false);
  const [previewTop, setPreviewTop] = useState(0);
  const headerRef = useRef(null);
  const [collections, setCollections] = useState([]);
  const [isLoadingCollections, setIsLoadingCollections] = useState(false);
  const collectionsLoadedRef = useRef(false);
  const [showCollectionsMobile, setShowCollectionsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isPreview =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).has("preview");

  useEffect(() => {
    let ticking = false;

    const updateTop = () => {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        setPreviewTop(rect.bottom);
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 20);
        updateTop();
        ticking = false;
      });
    };

    updateTop();
    window.addEventListener("resize", updateTop, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", updateTop);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const fetchCollections = async () => {
      const shouldLoad = showCollectionsPreview || showCollectionsMobile;
      if (!shouldLoad || collectionsLoadedRef.current) return;
      collectionsLoadedRef.current = true;
      setIsLoadingCollections(true);
      try {
        const data = await cachedGet(
          "https://naqshzari.com/backend/public/api/get-all-categories",
          { headers: { Accept: "application/json" } }
        );
        if (data && data.status === 200) {
          const items = Array.isArray(data.data) ? data.data : [];
          setCollections(items);
          await preloadImages(items.map((item) => item.image));
        } else {
          setCollections([]);
        }
      } catch (e) {
        setCollections([]);
      } finally {
        setIsLoadingCollections(false);
      }
    };
    fetchCollections();
  }, [showCollectionsPreview, showCollectionsMobile]);

  const handleCollectionsClick = (e, isMobile) => {
    e.preventDefault();
    if (isMobile) {
      setShowCollectionsMobile(true);
      setShowCollectionsPreview(false);
    } else {
      navigate("/collections");
    }
  };

  const renderNavLinks = (isMobile = false) => (
    <>
      <Nav.Link href="/">Home</Nav.Link>
      <Nav.Link href="/about">About</Nav.Link>
      <Nav.Link href="/blog">Blogs</Nav.Link>
      <Nav.Link
        href="#"
        onClick={(e) =>
          handleCollectionsClick(
            e,
            isMobile ||
              (typeof window !== "undefined" && window.innerWidth < 992)
          )
        }
        onMouseEnter={() => {
          if (!isMobile && typeof window !== "undefined" && window.innerWidth >= 992) {
            setShowCollectionsPreview(true);
          }
        }}
        onMouseLeave={() => {
          if (!isMobile) setShowCollectionsPreview(false);
        }}
      >
        Collections
      </Nav.Link>
      <Nav.Link href="/contact">Contact</Nav.Link>
    </>
  );

  const renderMegaMenu = () => {
    const items = Array.isArray(collections) ? collections : [];

    return (
      <div
        className="collections-mega-menu"
        style={{ top: previewTop }}
        onMouseEnter={() => setShowCollectionsPreview(true)}
        onMouseLeave={() => setShowCollectionsPreview(false)}
      >
        <div className="mega-menu-inner">
          <div className="mega-menu-sidebar">
            <div className="mega-menu-title">Collection - Listing</div>
            <p className="mega-menu-desc">
              Explore our latest collections curated for special occasions.
              Hover to browse and click Collections to view all.
            </p>
          </div>
          <div>
            {isLoadingCollections ? (
              <div className="d-flex justify-content-center align-items-center py-5">
                <FadeLoader color={LOADER_COLOR} width={3} height={10} />
              </div>
            ) : (
              <div className="mega-menu-grid">
                {items.slice(0, 8).map((item, idx) => (
                  <div
                    key={item.slug || idx}
                    className="mega-menu-card"
                    onClick={() => navigate(`/categories/${item.slug}`)}
                  >
                    <LazyImage
                      src={item.image}
                      alt={item.title || "collection"}
                    />
                    <div className="mega-menu-card-label">
                      {item.title || "Collection"}
                    </div>
                  </div>
                ))}
                {items.length === 0 && (
                  <div
                    className="text-center py-5"
                    style={{ gridColumn: "1 / -1", color: "var(--color-text-muted)" }}
                  >
                    No collections found.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isPreview) return null;

  return (
    <header
      ref={headerRef}
      className={`site-header${isScrolled ? " is-scrolled" : ""}`}
    >
      <Navbar expand="lg" className="site-navbar">
        <Container fluid className="site-navbar-inner">
          <Navbar.Toggle
            aria-controls="site-offcanvas-nav"
            className="site-nav-toggle d-lg-none"
          />

          <div className="site-brand-block">
            <Navbar.Brand href="/" className="site-brand">
              <span className="site-brand-text">Naqshzari</span>
            </Navbar.Brand>
          </div>

          <Nav className="site-nav-desktop d-none d-lg-flex">{renderNavLinks()}</Nav>

          <Navbar.Offcanvas
            id="site-offcanvas-nav"
            aria-labelledby="site-offcanvas-label"
            placement="end"
            className="site-offcanvas d-lg-none"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="site-offcanvas-label" className="site-brand-text">
                Naqshzari
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              {!showCollectionsMobile ? (
                <Nav className="flex-column">{renderNavLinks(true)}</Nav>
              ) : (
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      className="mobile-collections-back"
                      onClick={() => setShowCollectionsMobile(false)}
                    >
                      ←
                    </button>
                    <div className="mobile-collections-title">Collections</div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="mobile-collections-title">
                      Collection - Listing
                    </div>
                    <button
                      type="button"
                      className="mobile-collections-viewall"
                      onClick={() => navigate("/collections")}
                    >
                      View all
                    </button>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: 12,
                    }}
                  >
                    {isLoadingCollections && (
                      <div
                        style={{ gridColumn: "1 / -1" }}
                        className="d-flex justify-content-center py-4"
                      >
                        <FadeLoader color={LOADER_COLOR} width={3} height={10} />
                      </div>
                    )}
                    {!isLoadingCollections &&
                      collections.slice(0, 10).map((item, idx) => (
                        <div
                          key={item.slug || idx}
                          onClick={() => navigate(`/categories/${item.slug}`)}
                          style={{ cursor: "pointer" }}
                        >
                          <div
                            style={{
                              borderRadius: 2,
                              overflow: "hidden",
                              boxShadow: "var(--shadow-soft)",
                            }}
                          >
                            <LazyImage
                              src={item.image}
                              alt={item.title || "collection"}
                              style={{
                                width: "100%",
                                height: 140,
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                          </div>
                          <div className="mobile-collection-item-title">
                            {item.title}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

      {showCollectionsPreview && renderMegaMenu()}
    </header>
  );
};

export default Header;
