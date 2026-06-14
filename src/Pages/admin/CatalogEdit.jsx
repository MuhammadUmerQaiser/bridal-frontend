import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useForm } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import { compressImageFile, compressImageFiles } from "../../utils/compressImage";

const CatalogEdit = () => {
  const [loading, setLoading] = useState(false);
  const [dataFetchLoader, setDataFetchLoader] = useState(false);
  const [catalogData, setCatalogData] = useState(null);
  const [categories, setCategories] = useState([]);
  const { slug } = useParams(); // Get slug from URL parameters
  const [featuredImagePreview, setFeaturedImagePreview] = useState(null);
  const [catalogImagesPreview, setCatalogImagesPreview] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Fetch catalog data by slug
  const fetchCatalogBySlug = async () => {
    setDataFetchLoader(true);
    try {
      const response = await axios.get(
        `https://naqshzari.com/backend/public/api/get-catalog-by-slug/${slug}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === 200) {
        const data = response.data.data;
        setCatalogData(data);

        // Set form default values
        setValue("title", data.title);
        setValue("description", data.description);
        setValue("color", data.color);
        setValue("fabric", data.fabric);
        // Set category dropdown value
        if (data.category && data.category.id) {
          setValue("category_id", data.category.id);
        }
        if (data.image) {
          setFeaturedImagePreview(data.image);
        }
        if (data.catalog_images) {
          setCatalogImagesPreview(data.catalog_images);
        }
      } else {
        enqueueSnackbar("Catalog not found", {
          variant: "error",
          autoHideDuration: 2000,
        });
        navigate("/admin/catalogs");
      }
    } catch (error) {
      enqueueSnackbar("Failed to fetch catalog data", {
        variant: "error",
        autoHideDuration: 2000,
      });
    } finally {
      setDataFetchLoader(false);
    }
  };

  // Fetch all categories for the dropdown
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://naqshzari.com/backend/public/api/get-all-categories",
        {
          headers: { Accept: "application/json" },
        }
      );
      if (response.data.status === 200) {
        setCategories(response.data.data);
      } else {
        enqueueSnackbar("Error fetching categories", {
          variant: "error",
          autoHideDuration: 2000,
        });
      }
    } catch (error) {
      enqueueSnackbar("Error fetching categories", {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchCatalogBySlug();
      fetchCategories();
    }
  }, [slug, token, navigate]);

  const catalogFormSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("color", data.color);
    formData.append("fabric", data.fabric);
    formData.append("category_id", data.category_id); // Send category_id

    if (data.image && data.image[0]) {
      formData.append("image", await compressImageFile(data.image[0]));
    }

    if (data.images && data.images.length > 0) {
      const compressedImages = await compressImageFiles(data.images);
      compressedImages.forEach((file) => formData.append("images[]", file));
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `https://naqshzari.com/backend/public/api/update-catalog/${catalogData.id}`,
        formData,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === 200) {
        enqueueSnackbar(response.data.message, {
          variant: "success",
          autoHideDuration: 2000,
        });
        navigate("/admin/catalogs");
      } else {
        enqueueSnackbar("Update failed", {
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

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <header className="content-header">
          <h3>Edit Catalog</h3>
        </header>
        <div className="row">
          {dataFetchLoader ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FadeLoader
                color={"#000000"}
                loading={dataFetchLoader}
                width={3}
                height={10}
              />
            </div>
          ) : (
            <form onSubmit={handleSubmit(catalogFormSubmit)}>
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    placeholder="Enter title"
                    {...register("title", { required: "Title is required" })}
                  />
                  {errors.title && (
                    <small className="text-danger mt-2">
                      {errors.title.message}
                    </small>
                  )}
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="description">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    rows="4"
                    style={{ resize: "none" }}
                    placeholder="Enter description"
                    {...register("description", {
                      required: "Description is required",
                    })}
                  ></textarea>
                  {errors.description && (
                    <small className="text-danger mt-2">
                      {errors.description.message}
                    </small>
                  )}
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="color">Color</label>
                  <input
                    type="text"
                    className="form-control"
                    id="color"
                    placeholder="Enter color"
                    {...register("color", { required: "Color is required" })}
                  />
                  {errors.color && (
                    <small className="text-danger mt-2">
                      {errors.color.message}
                    </small>
                  )}
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="fabric">Fabric</label>
                  <input
                    type="text"
                    className="form-control"
                    id="fabric"
                    placeholder="Enter fabric"
                    {...register("fabric", { required: "Fabric is required" })}
                  />
                  {errors.fabric && (
                    <small className="text-danger mt-2">
                      {errors.fabric.message}
                    </small>
                  )}
                </div>

                {/* Category Dropdown */}
                <div className="form-group mb-3">
                  <label htmlFor="category_id">Category</label>
                  <select
                    className="form-control"
                    id="category_id"
                    {...register("category_id", {
                      required: "Category is required",
                    })}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.title}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <small className="text-danger mt-2">
                      {errors.category_id.message}
                    </small>
                  )}
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="formFile" className="form-label">
                    Featured Image
                  </label>
                  <input
                    className="form-control"
                    type="file"
                    id="formFile"
                    {...register("image")}
                    accept="image/*"
                  />
                  {featuredImagePreview && (
                    <div className="mt-3">
                      <img
                        src={featuredImagePreview}
                        alt="Featured"
                        className="img-thumbnail"
                        style={{
                          width: "150px",
                          height: "150px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="formFileMultiple" className="form-label">
                    Additional Images
                  </label>
                  <input
                    className="form-control"
                    type="file"
                    id="formFileMultiple"
                    {...register("images")}
                    accept="image/*"
                    multiple
                  />
                  <div className="row mt-2">
                    {catalogImagesPreview.length > 0 &&
                      catalogImagesPreview.map((image, index) => (
                        <div
                          key={index}
                          className="col-md-4 col-sm-6 col-12 mb-3"
                        >
                          <img
                            src={image.img}
                            alt={`Catalog Image ${index + 1}`}
                            className="img-thumbnail"
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      ))}
                  </div>
                </div>

                <div className="d-grid gap-2 mt-3">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-grow spinner-grow-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        <span className="sr-only">Loading...</span>
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default CatalogEdit;
