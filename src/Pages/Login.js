const Login = () => {
  return (
    <div className="login-container d-flex align-items-center justify-content-center">
      <div className="card login-card">
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Login</h3>
          <form>
            <div className="form-group">
              <input
                type="email"
                className="form-control mb-3"
                placeholder="Email"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control mb-3"
                placeholder="Password"
                required
              />
            </div>
            <button type="submit" className="btn btn-dark btn-block">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
