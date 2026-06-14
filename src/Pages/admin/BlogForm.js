import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { compressImageFile } from "../../utils/compressImage";

const BlogForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      sections: [
        { image: null, description: "" }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sections",
  });

  const blogFormSubmit = async (data) => {
    // Validate main title
    if (!data.title || data.title.trim() === "") {
      enqueueSnackbar("Fill the form", {
        variant: "error",
        autoHideDuration: 2000,
      });
      return;
    }
    // Validate each dynamic section (must have an image and a description)
    for (let i = 0; i < data.sections.length; i++) {
      const section = data.sections[i];
      if (
        !section.image ||
        section.image.length === 0 ||
        !section.description ||
        section.description.trim() === ""
      ) {
        enqueueSnackbar("Fill the form", {
          variant: "error",
          autoHideDuration: 2000,
        });
        return;
      }
    }

    // Create a FormData instance for file uploads
    const formData = new FormData();
    formData.append("title", data.title);
    for (const [index, section] of data.sections.entries()) {
      formData.append(
        `sections[${index}][image]`,
        await compressImageFile(section.image[0])
      );
      formData.append(`sections[${index}][description]`, section.description);
    }

    setLoading(true);
    try {
      // Replace the API endpoint with your actual API endpoint for creating a blog
      const response = await axios.post(
        "https://naqshzari.com/backend/public/api/create-blog",
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
        navigate("/admin/blogs");
      } else {
        if (response.data.errors) {
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
    }
  }, [token, navigate]);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <header className="content-header">
          <h3>Create Blog</h3>
        </header>
        <div className="row">
          <form onSubmit={handleSubmit(blogFormSubmit)}>
            <div className="col-md-12">
              {/* Main Title */}
              <div className="form-group mb-3">
                <label htmlFor="title">Main Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  placeholder="Enter blog title"
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                  <small className="text-danger mt-2">
                    {errors.title.message}
                  </small>
                )}
              </div>

              {/* Dynamic Sections: Each with an image and rich text editor for description */}
              {fields.map((field, index) => (
                <div key={field.id} className="border p-3 mb-3">
                  <h5>Section {index + 1}</h5>
                  <div className="form-group mb-3">
                    <label htmlFor={`sections.${index}.image`}>Image</label>
                    <input
                      type="file"
                      className="form-control"
                      id={`sections.${index}.image`}
                      {...register(`sections.${index}.image`, {
                        required: "Image is required",
                      })}
                      accept="image/*"
                    />
                    {errors.sections &&
                      errors.sections[index] &&
                      errors.sections[index].image && (
                        <small className="text-danger mt-2">
                          {errors.sections[index].image.message}
                        </small>
                      )}
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor={`sections.${index}.description`}>
                      Description
                    </label>
                    <Controller
                      control={control}
                      name={`sections.${index}.description`}
                      rules={{ required: "Description is required" }}
                      render={({ field: { onChange, value } }) => (
                        <ReactQuill
                          theme="snow"
                          value={value || ""}
                          onChange={onChange}
                        />
                      )}
                    />
                    {errors.sections &&
                      errors.sections[index] &&
                      errors.sections[index].description && (
                        <small className="text-danger mt-2">
                          {errors.sections[index].description.message}
                        </small>
                      )}
                  </div>

                  {/* Remove button available for sections beyond the first */}
                  {index > 0 && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => remove(index)}
                    >
                      Remove Section
                    </button>
                  )}
                </div>
              ))}

              {/* Add More button */}
              <div className="form-group mb-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => append({ image: null, description: "" })}
                >
                  Add More
                </button>
              </div>

              {/* Submit Button */}
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
        </div>
      </main>
    </div>
  );
};

export default BlogForm;
