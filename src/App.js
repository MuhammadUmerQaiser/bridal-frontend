import "./App.css";
import "./theme.css";
import "./styles/pages.css";
import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PageLoader from "./components/PageLoader";

const Home = React.lazy(() => import("./Pages/Home"));
const CatalogListing = React.lazy(() => import("./Pages/CatalogListing"));
const CategoryCatalogListing = React.lazy(() =>
  import("./Pages/CategoryCatalogListing")
);
const CatalogDetails = React.lazy(() => import("./Pages/CatalogDetails"));
const Footer = React.lazy(() => import("./components/Footer"));
const ContactUs = React.lazy(() => import("./Pages/ContactUs"));
const About = React.lazy(() => import("./Pages/About"));
const Blogs = React.lazy(() => import("./Pages/Blogs"));
const Login = React.lazy(() => import("./Pages/admin/Login"));
const Dashboard = React.lazy(() => import("./Pages/admin/Dashboard"));
const Appointment = React.lazy(() => import("./Pages/admin/Appointment"));
const CatalogForm = React.lazy(() => import("./Pages/admin/CatalogForm"));
const BlogForm = React.lazy(() => import("./Pages/admin/BlogForm"));
const CatalogIndex = React.lazy(() => import("./Pages/admin/CatalogIndex"));
const CategoryIndex = React.lazy(() => import("./Pages/admin/CategoryIndex"));
const BlogIndex = React.lazy(() => import("./Pages/admin/BlogIndex"));
const CatalogEdit = React.lazy(() => import("./Pages/admin/CatalogEdit"));
const BlogEdit = React.lazy(() => import("./Pages/admin/BlogEdit"));
const BlogDetail = React.lazy(() => import("./Pages/BlogDetail"));
const Collections = React.lazy(() => import("./Pages/Collections"));

function App() {
  return (
    <div className="App">
      <Router>
        <div className="App">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog-listing" element={<CatalogListing />} />
              <Route path="/collections" element={<Collections />} />
              <Route
                path="/categories/:slug"
                element={<CategoryCatalogListing />}
              />
              <Route path="/catalog-details/:slug" element={<CatalogDetails />} />
              <Route path="/footer" element={<Footer />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blogs />} />
              <Route path="/blog-details/:slug" element={<BlogDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/appointments" element={<Appointment />} />
              <Route path="/admin/catalog/create" element={<CatalogForm />} />
              <Route path="/admin/catalog/edit/:slug" element={<CatalogEdit />} />
              <Route path="/admin/catalogs" element={<CatalogIndex />} />
              <Route path="/admin/blogs" element={<BlogIndex />} />
              <Route path="/admin/blog/create" element={<BlogForm />} />
              <Route path="/admin/blog/edit/:slug" element={<BlogEdit />} />
              <Route path="/admin/categories" element={<CategoryIndex />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </div>
  );
}

export default App;
