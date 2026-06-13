import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { FadeLoader } from "react-spinners";

const CatalogIndex = () => {
  const [loading, setLoading] = useState(false);
  const [catalogs, setCatalogs] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const getAllCatalogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://naqshzari.com/backend/public/api/get-all-catalogs",
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      if (response.data.status === 200) {
        setCatalogs(response.data.data);
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

  const deleteCatalog = async (id) => {
    // setLoading(true);
    try {
      const response = await axios.delete(
        `https://naqshzari.com/backend/public/api/delete-catalog/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      if (response.data.status === 200) {
        enqueueSnackbar("Catalog deleted successfully.", {
          variant: "success",
          autoHideDuration: 2000,
        });
        // Remove the deleted catalog from the state
        getAllCatalogs();
      } else {
        enqueueSnackbar("Error deleting catalog", {
          variant: "error",
          autoHideDuration: 2000,
        });
      }
    } catch (error) {
      enqueueSnackbar("Error deleting catalog", {
        variant: "error",
        autoHideDuration: 2000,
      });
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      getAllCatalogs();
    }
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <header className="content-header">
          <h3>Catalogs</h3>
          <p>Manage your Catalogs.</p>
        </header>
        <button
          className="btn btn-secondary mb-3"
          style={{ float: "right" }}
          onClick={() => navigate("/admin/catalog/create")}
        >
          Add Catalog
        </button>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Fabric</th>
              <th>Color</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
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
            ) : catalogs.length > 0 ? (
              catalogs.map((catalog, index) => (
                <tr key={catalog.id}>
                  <td>{++index}</td>
                  <td>{catalog.title}</td>
                  <td>{catalog.fabric}</td>
                  <td>{catalog.color}</td>
                  <td>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() =>
                        window.open(
                          `/catalog-details/${catalog.slug}`,
                          "_blank"
                        )
                      }
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button
                      className="btn btn-primary btn-sm mx-2"
                      onClick={() => navigate(`/admin/catalog/edit/${catalog.slug}`)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteCatalog(catalog.id)}
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
                    No catalogs found. Please create a new catalog.
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

export default CatalogIndex;
