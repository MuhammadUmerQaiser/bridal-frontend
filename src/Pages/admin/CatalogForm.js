// import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useForm } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { compressImageFile, compressImageFiles } from "../../utils/compressImage";

const CatalogForm = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Fetch categories from API and populate dropdown
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

  // Submit Catalog Form with the new category_id
  const catalogFormSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("color", data.color);
    formData.append("fabric", data.fabric);
    formData.append("category_id", data.category_id); // New field

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
        "https://naqshzari.com/backend/public/api/create-catalog",
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
        if (response && response.data && response.data.errors) {
          const errorMessage = response.data.errors[0];
          enqueueSnackbar(errorMessage, {
            variant: "error",
            autoHideDuration: 2000,
          });
        } else {
          enqueueSnackbar("Internal Server Error", {
            variant: "error",
            autoHideDuration: 2000,
          });
        }
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

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchCategories();
    }
  }, [token, navigate]);

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="main-content">
        <header className="content-header">
          <h3>Create Catalog</h3>
        </header>

        <div className="row">
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
                  {...register("image", { required: "Image is required" })}
                  accept="image/*"
                />
                {errors.image && (
                  <small className="text-danger mt-2">
                    {errors.image.message}
                  </small>
                )}
              </div>

              <div className="form-group mb-3">
                <label htmlFor="formFile2" className="form-label">
                  Images
                </label>
                <input
                  className="form-control"
                  type="file"
                  id="formFile2"
                  {...register("images")}
                  accept="image/*"
                  multiple
                />
              </div>

              <div className="d-grid gap-2 mt-3">
                <button type="submit" className="btn btn-primary" disabled={loading}>
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
        </div>
      </main>
    </div>
  );
};

export default CatalogForm;
