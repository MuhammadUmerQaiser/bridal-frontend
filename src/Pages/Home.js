import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation, EffectFade } from "swiper/modules";
import Header from "../components/Header";
import LazyImage from "../components/LazyImage";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { cachedGet } from "../utils/apiCache";
import { preloadImages } from "../utils/imageCache";
import { enqueueSnackbar } from "notistack";
import "swiper/css/effect-fade";
import "./Home.css";

const SLIDER_IMAGES = [
  () => import("../assets/1.jpg"),
  () => import("../assets/2.jpg"),
  () => import("../assets/3.jpg"),
  () => import("../assets/4.jpg"),
];

const BANNER_IMAGES = {
  five: () => import("../assets/5.jpg"),
  six: () => import("../assets/6.jpg"),
};

const Home = () => {
  const navigate = useNavigate();
  const [catalogs, setCatalogs] = useState([]);
  const [catalogsLoading, setCatalogsLoading] = useState(true);
  const [slideUrls, setSlideUrls] = useState([]);
  const [bannerUrls, setBannerUrls] = useState({});
  const [activeSlide, setActiveSlide] = useState(1);
  const bannersLoadedRef = useRef(false);
  const slideCount = slideUrls.length || SLIDER_IMAGES.length;

  useEffect(() => {
    Promise.all(SLIDER_IMAGES.map((loader) => loader())).then((modules) => {
      setSlideUrls(modules.map((module) => module.default));
    });
  }, []);

  useEffect(() => {
    setCatalogsLoading(true);
    cachedGet(
      "https://naqshzari.com/backend/public/api/get-all-catalogs?take=4",
      { headers: { Accept: "application/json" } }
    )
      .then((data) => {
        if (data.status === 200) {
          setCatalogs(data.data || []);
          preloadImages((data.data || []).map((item) => item.image), {
            first: 4,
            concurrency: 2,
          });
        }
      })
      .catch(() => {
        enqueueSnackbar("Internal Server Error", {
          variant: "error",
          autoHideDuration: 2000,
        });
      })
      .finally(() => setCatalogsLoading(false));
  }, []);

  useEffect(() => {
    const loadBanners = async () => {
      if (bannersLoadedRef.current) return;
      bannersLoadedRef.current = true;

      const entries = await Promise.all(
        Object.entries(BANNER_IMAGES).map(async ([key, loader]) => {
          const module = await loader();
          return [key, module.default];
        })
      );

      setBannerUrls(Object.fromEntries(entries));
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(loadBanners);
    } else {
      setTimeout(loadBanners, 800);
    }
  }, []);

  return (
    <div className="home-page">
      <Header />

      <section className="home-hero">
        <div className="home-hero-slider main-slider">
          <Swiper
            pagination={{ clickable: true }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            navigation={true}
            loop={slideUrls.length > 1}
            speed={900}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            modules={[Pagination, Navigation, Autoplay, EffectFade]}
            className="mySwiper"
            onSlideChange={(swiper) =>
              setActiveSlide((swiper.realIndex % slideCount) + 1)
            }
          >
            {(slideUrls.length ? slideUrls : SLIDER_IMAGES).map((_, index) => (
              <SwiperSlide key={index}>
                <div className="home-hero-slide">
                  {slideUrls[index] ? (
                    <LazyImage
                      src={slideUrls[index]}
                      alt={`Naqshzari collection slide ${index + 1}`}
                      className="main-slider-image"
                      eager={index === 0}
                      fetchPriority={index === 0 ? "high" : "auto"}
                    />
                  ) : (
                    <div className="slider-placeholder" aria-hidden="true" />
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="home-hero-counter" aria-live="polite">
            <span className="home-hero-counter__current">
              {String(activeSlide).padStart(2, "0")}
            </span>
            <span className="home-hero-counter__sep">/</span>
            <span className="home-hero-counter__total">
              {String(slideCount).padStart(2, "0")}
            </span>
          </div>
        </div>
      </section>

      <section className="home-arrivals" id="home-curated">
        <div className="home-arrivals__head">
          <div className="home-arrivals__titles">
            <h2 className="home-arrivals__title">Curated This Season</h2>
            <p className="home-arrivals__desc">
              A blend of classic silhouettes and our signature shine, embodied
              by enigmatic sequins.
            </p>
          </div>
          <button
            type="button"
            className="home-arrivals__viewall"
            onClick={() => navigate("/collections")}
          >
            View All
          </button>
        </div>

        <div className="home-arrivals__grid">
          {catalogsLoading &&
            Array.from({ length: 4 }).map((_, index) => (
              <div key={`loading-${index}`} className="home-arrival-card home-arrival-card--loading">
                <div className="home-arrival-card__img home-arrival-card__img--shimmer" />
                <div className="home-arrival-card__name home-arrival-card__name--shimmer" />
              </div>
            ))}

          {!catalogsLoading &&
            catalogs.map((catalog, index) => (
              <article
                key={catalog.slug || index}
                className="home-arrival-card"
                onClick={() => navigate(`/catalog-details/${catalog.slug}`)}
              >
                <div className="home-arrival-card__img">
                  <LazyImage src={catalog.image} alt={catalog.title} />
                </div>
                <h3 className="home-arrival-card__name">{catalog.title}</h3>
              </article>
            ))}
        </div>
      </section>

      <section className="home-diptych" aria-label="Collection highlights">
        <button
          type="button"
          className="home-diptych__panel"
          onClick={() => navigate("/collections")}
        >
          <div className="home-diptych__media">
            {bannerUrls.five ? (
              <LazyImage
                src={bannerUrls.five}
                alt="Naqshzari bridal collection"
              />
            ) : (
              <div className="home-diptych__placeholder" />
            )}
          </div>
          <span className="home-diptych__hover-line" aria-hidden="true" />
        </button>

        <div className="home-diptych__divider" aria-hidden="true">
          <span className="home-diptych__diamond" />
        </div>

        <button
          type="button"
          className="home-diptych__panel"
          onClick={() => navigate("/collections")}
        >
          <div className="home-diptych__media">
            {bannerUrls.six ? (
              <LazyImage src={bannerUrls.six} alt="Naqshzari couture" />
            ) : (
              <div className="home-diptych__placeholder" />
            )}
          </div>
          <span className="home-diptych__hover-line" aria-hidden="true" />
        </button>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
