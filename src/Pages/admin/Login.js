import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLoginForm = async (data) => {
    if (Object.keys(errors).length > 0) {
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    try {
      const response = await axios.post(
        "https://naqshzari.com/backend/public/api/login",
        formData,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      if (response.data.status == 200) {
        enqueueSnackbar("Login successful", {
          variant: "success",
          autoHideDuration: 2000,
        });
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);
        navigate("/admin");
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
    if(user){
      navigate('/admin');
    }
  }, [])
  return (
    <div className="login-container d-flex align-items-center justify-content-center">
      <div className="card login-card">
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Login</h3>
          <form onSubmit={handleSubmit(handleLoginForm)}>
            <div className={`form-group ${!errors.email ? "mb-3" : ""}`}>
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                {...register("email", { required: "Email is required" })}
              />
            </div>
            {errors.email && (
              <small className="text-danger mt-2">{errors.email.message}</small>
            )}
            <div className={`form-group ${!errors.password ? "mb-3" : ""}`}>
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                {...register("password", { required: "Password is required" })}
              />
            </div>
            {errors.password && (
              <small className="text-danger mt-2 mb-3">
                {errors.password.message}
              </small>
            )}
            <button
              type="submit"
              className="btn btn-dark btn-block"
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
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
