import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { FadeLoader } from "react-spinners";
import { compressImageFile } from "../../utils/compressImage";

const CategoryIndex = () => {
  // Page loading for fetching list
  const [loading, setLoading] = useState(false);
  // Form loading for modal submissions (add/edit)
  const [formLoading, setFormLoading] = useState(false);

  const [categories, setCategories] = useState([]);

  // For Add Category modal
  const [showModal, setShowModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState(null);

  // For Edit Category modal
  const [isEditModal, setIsEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryImage, setEditCategoryImage] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch all categories from the API
  const getAllCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://naqshzari.com/backend/public/api/get-all-categories",
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      if (response.data.status === 200) {
        setCategories(response.data.data);
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

  // Delete a category using its ID
  const deleteCategory = async (id) => {
    try {
      const response = await axios.delete(
        `https://naqshzari.com/backend/public/api/delete-category/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      if (response.data.status === 200) {
        enqueueSnackbar("Category deleted successfully.", {
          variant: "success",
          autoHideDuration: 2000,
        });
        // Refresh the category list
        getAllCategories();
      } else {
        enqueueSnackbar("Error deleting category", {
          variant: "error",
          autoHideDuration: 2000,
        });
      }
    } catch (error) {
      enqueueSnackbar("Error deleting category", {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  // Handle form submission to add a new category
  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (!newCategoryName || !newCategoryImage) {
      enqueueSnackbar("Please fill in all fields", {
        variant: "warning",
        autoHideDuration: 2000,
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", newCategoryName);
    formData.append("image", await compressImageFile(newCategoryImage));

    try {
      setFormLoading(true);
      const response = await axios.post(
        "https://naqshzari.com/backend/public/api/create-category",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      if (response.data.status === 200) {
        enqueueSnackbar("Category added successfully.", {
          variant: "success",
          autoHideDuration: 2000,
        });
        getAllCategories();
        closeAddModal();
      } else {
        enqueueSnackbar("Error adding category", {
          variant: "error",
          autoHideDuration: 2000,
        });
      }
    } catch (error) {
      enqueueSnackbar("Error adding category", {
        variant: "error",
        autoHideDuration: 2000,
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Handle form submission to update an existing category
  const handleEditCategory = async (e) => {
    e.preventDefault();

    if (!editCategoryName) {
      enqueueSnackbar("Category name is required", {
        variant: "warning",
        autoHideDuration: 2000,
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", editCategoryName);
    if (editCategoryImage) {
      formData.append("image", await compressImageFile(editCategoryImage));
    }

    try {
      setFormLoading(true);
      const response = await axios.post(
        `https://naqshzari.com/backend/public/api/update-category/${selectedCategory.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      if (response.data.status === 200) {
        enqueueSnackbar("Category updated successfully.", {
          variant: "success",
          autoHideDuration: 2000,
        });
        getAllCategories();
        closeEditModal();
      } else {
        enqueueSnackbar("Error updating category", {
          variant: "error",
          autoHideDuration: 2000,
        });
      }
    } catch (error) {
      enqueueSnackbar("Error updating category", {
        variant: "error",
        autoHideDuration: 2000,
      });
    } finally {
      setFormLoading(false);
    }
  };

  const openAddModal = () => {
    setShowModal(true);
  };

  const closeAddModal = () => {
    setShowModal(false);
    setNewCategoryName("");
    setNewCategoryImage(null);
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setEditCategoryName(category.title);
    setEditCategoryImage(null);
    setIsEditModal(true);
  };

  const closeEditModal = () => {
    setIsEditModal(false);
    setSelectedCategory(null);
    setEditCategoryName("");
    setEditCategoryImage(null);
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      getAllCategories();
    }
  }, [token, navigate]);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <header className="content-header">
          <h3>Categories</h3>
          <p>Manage your Categories.</p>
        </header>
        <button
          className="btn btn-secondary mb-3"
          style={{ float: "right" }}
          onClick={openAddModal}
        >
          Add Category
        </button>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FadeLoader
                      color={"#000000"}
                      loading={loading}
                      width={3}
                      height={10}
                    />
                  </div>
                </td>
              </tr>
            ) : categories.length > 0 ? (
              categories.map((category, index) => (
                <tr key={category.id}>
                  <td>{index + 1}</td>
                  <td>{category.title}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm mx-2"
                      onClick={() => openEditModal(category)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteCategory(category.id)}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">
                  <div className="alert alert-warning" role="alert">
                    No categories found. Please create a new category.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Add Category Modal */}
        {showModal && (
          <>
            <div className="modal-backdrop fade show"></div>
            <div
              className="modal fade show d-block"
              tabIndex="-1"
              role="dialog"
            >
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Add Category</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={closeAddModal}
                    ></button>
                  </div>
                  <form onSubmit={handleAddCategory}>
                    <div className="modal-body">
                      <div className="mb-3">
                        <label className="form-label">Category Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Category Image</label>
                        <input
                          type="file"
                          className="form-control"
                          onChange={(e) =>
                            setNewCategoryImage(e.target.files[0])
                          }
                          required
                          accept="image/*"
                        />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={closeAddModal}
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={formLoading}
                      >
                        {formLoading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            <span className="ms-2">Adding...</span>
                          </>
                        ) : (
                          "Add Category"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Edit Category Modal */}
        {isEditModal && (
          <>
            <div className="modal-backdrop fade show"></div>
            <div
              className="modal fade show d-block"
              tabIndex="-1"
              role="dialog"
            >
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Category</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={closeEditModal}
                    ></button>
                  </div>
                  <form onSubmit={handleEditCategory}>
                    <div className="modal-body">
                      <div className="mb-3">
                        <label className="form-label">Category Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editCategoryName}
                          onChange={(e) => setEditCategoryName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                          Category Image (optional)
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          onChange={(e) =>
                            setEditCategoryImage(e.target.files[0])
                          }
                          accept="image/*"
                        />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={closeEditModal}
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={formLoading}
                      >
                        {formLoading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            <span className="ms-2">Updating...</span>
                          </>
                        ) : (
                          "Update Category"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default CategoryIndex;
