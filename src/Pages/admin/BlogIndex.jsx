import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { FadeLoader } from "react-spinners";

const BlogIndex = () => {
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const getAllBlogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://naqshzari.com/backend/public/api/get-all-blogs",
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      if (response.data.status === 200) {
        setBlogs(response.data.data);
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

  const deleteBlog = async (id) => {
    try {
      const response = await axios.delete(
        `https://naqshzari.com/backend/public/api/delete-blog/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      if (response.data.status === 200) {
        enqueueSnackbar("Blog deleted successfully.", {
          variant: "success",
          autoHideDuration: 2000,
        });
        // Refresh the blogs list after deletion
        getAllBlogs();
      } else {
        enqueueSnackbar("Error deleting blog", {
          variant: "error",
          autoHideDuration: 2000,
        });
      }
    } catch (error) {
      enqueueSnackbar("Error deleting blog", {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      getAllBlogs();
    }
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <header className="content-header">
          <h3>Blogs</h3>
          <p>Manage your Blogs.</p>
        </header>
        <button
          className="btn btn-secondary mb-3"
          style={{ float: "right" }}
          onClick={() => navigate("/admin/blog/create")}
        >
          Add Blog
        </button>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center">
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
            ) : blogs.length > 0 ? (
              blogs.map((blog, index) => (
                <tr key={blog.id}>
                  <td>{index + 1}</td>
                  <td>{blog.title}</td>
                  <td>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() =>
                        window.open(`/blog-details/${blog.slug}`, "_blank")
                      }
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button
                      className="btn btn-primary btn-sm mx-2"
                      onClick={() => navigate(`/admin/blog/edit/${blog.slug}`)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteBlog(blog.id)}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center">
                  <div className="alert alert-warning" role="alert">
                    No blogs found. Please create a new blog.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default BlogIndex;
