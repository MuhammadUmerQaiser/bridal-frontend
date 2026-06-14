import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { compressImageFile } from "../../utils/compressImage";

const BlogEdit = () => {
  const [loading, setLoading] = useState(false);
  const [dataFetchLoader, setDataFetchLoader] = useState(false);
  const [blogData, setBlogData] = useState(null);
  const [sectionsPreview, setSectionsPreview] = useState([]);
  const { slug } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      sections: [{ id: "", image: null, description: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sections",
  });

  // Fetch blog data by slug and prefill form values
  const fetchBlogBySlug = async () => {
    setDataFetchLoader(true);
    try {
      const response = await axios.get(
        `https://naqshzari.com/backend/public/api/get-blog-by-slug/${slug}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === 200) {
        const data = response.data.data;
        setBlogData(data);
        // Reset form with fetched title and sections.
        // Each section includes its existing id so that it can be updated.
        reset({
          title: data.title,
          sections: data.sections.map((section) => ({
            id: section.id, // include section id
            description: section.description,
            image: null, // file inputs cannot be prefilled
          })),
        });
        if (data.sections) {
          // Set preview images from API response
          setSectionsPreview(data.sections.map((section) => section.image));
        }
      } else {
        enqueueSnackbar("Blog not found", {
          variant: "error",
          autoHideDuration: 2000,
        });
        navigate("/admin/blogs");
      }
    } catch (error) {
      enqueueSnackbar("Failed to fetch blog data", {
        variant: "error",
        autoHideDuration: 2000,
      });
    } finally {
      setDataFetchLoader(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchBlogBySlug();
    }
  }, [slug, token, navigate]);

  // Handle file change for blog section images
  const handleSectionImageChange = (e, index) => {
    if (e.target.files && e.target.files[0]) {
      const updatedPreviews = [...sectionsPreview];
      updatedPreviews[index] = URL.createObjectURL(e.target.files[0]);
      setSectionsPreview(updatedPreviews);
    }
  };

  // Submit updated blog data to the API
  const blogFormSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    if (data.sections && data.sections.length > 0) {
      for (const [index, section] of data.sections.entries()) {
        if (section.id) {
          formData.append(`sections[${index}][id]`, section.id);
        }
        formData.append(`sections[${index}][description]`, section.description);
        if (section.image && section.image[0]) {
          formData.append(
            `sections[${index}][image]`,
            await compressImageFile(section.image[0])
          );
        }
      }
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `https://naqshzari.com/backend/public/api/update-blog/${blogData.id}`,
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
          <h3>Edit Blog</h3>
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
            <form onSubmit={handleSubmit(blogFormSubmit)}>
              <div className="col-md-12">
                {/* Blog Title */}
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

                {/* Blog Sections */}
                <div className="form-group mb-3">
                  <label>Blog Sections</label>
                  {fields.map((field, index) => (
                    <div key={field.id} className="border p-3 mb-3">
                      <h5>Section {index + 1}</h5>
                      {/* Hidden input for section ID */}
                      <input
                        type="hidden"
                        {...register(`sections.${index}.id`)}
                      />
                      <div className="form-group mb-3">
                        <label htmlFor={`sections.${index}.image`}>
                          Section Image
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          id={`sections.${index}.image`}
                          {...register(`sections.${index}.image`)}
                          accept="image/*"
                          onChange={(e) => handleSectionImageChange(e, index)}
                        />
                        {sectionsPreview[index] && (
                          <div className="mt-3">
                            <img
                              src={sectionsPreview[index]}
                              alt={`Section ${index + 1}`}
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
                        <label htmlFor={`sections.${index}.description`}>
                          Section Description
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
                      {index > 0 && (
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => {
                            remove(index);
                            const updatedPreviews = [...sectionsPreview];
                            updatedPreviews.splice(index, 1);
                            setSectionsPreview(updatedPreviews);
                          }}
                        >
                          Remove Section
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() =>
                      append({ id: "", description: "", image: null })
                    }
                  >
                    Add Section
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
          )}
        </div>
      </main>
    </div>
  );
};

export default BlogEdit;
