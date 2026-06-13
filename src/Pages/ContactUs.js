import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LazyImage from "../components/LazyImage";
import { Col, Container, Form, Row } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import { useState } from "react";
import "react-phone-input-2/lib/bootstrap.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useForm } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import axios from "axios";

const ContactUs = () => {
  const [phone, setPhone] = useState(""); // State to store phone number
  const [selectedDate, setSelectedDate] = useState(null); // State to store selected date
  const [selectedTime, setSelectedTime] = useState(null); // State to store selected time
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const bookAppointment = async (data) => {
    const formattedDate = selectedDate ? selectedDate.toDate() : null;
    const formattedTime = selectedTime ? selectedTime.toDate() : null;

    const formattedDateString = formattedDate
      ? formattedDate.toLocaleDateString("en-GB")
      : "";
    const formattedTimeString = formattedTime
      ? formattedTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "";

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", phone); // Phone number from state
    formData.append("date", formattedDateString); // Selected date
    formData.append("time", formattedTimeString); // Selected time

    setLoading(true);
    try {
      const response = await axios.post(
        "https://naqshzari.com/backend/public/api/book-appointment",
        formData,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      if (response.data.status == 200) {
        enqueueSnackbar("Admin will contact you, thanks for your time.", {
          variant: "success",
          autoHideDuration: 2000,
        });
        reset(); // Reset the form fields
        setPhone(""); // Clear the phone state
        setSelectedDate(null); // Clear the selected date state
        setSelectedTime(null); // Clear the selected time state
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
  const openWhatsapp = () => {
    const phoneNumber = "+923008220544";
    const message = "Hello, I would like to get in touch with you!";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };
  return (
    <>
      <Header />
      <div className="contact-section">
        <div className="contact-banner">
          <LazyImage
            style={{ height: "400px", width: "100%", objectFit: "cover" }}
            src="https://cdn.pixelspray.io/v2/black-bread-289bfa/81ub5U/t.resize(w:2000)/manish-cms_images/16899321471686213859contactUs-desktop-banner.webp"
            alt="Contact Naqshzari"
            eager
          />
        </div>
        <div className="contact-form-styling">
          <div className="contact-heading">Let's Connect</div>
          {/* <p className="text-center">
            As you explore the World of Manish Malhotra, our advisors would be
            pleased to assist you and provide tailored counsel.
          </p> */}
          <div className="form-body">
            <Container>
              <Row>
                <Col md={5}>
                  <div style={{ width: "100%", height: "400px" }}>
                    {/* <iframe
                      title="Google Map"
                      src="https://maps.google.com/maps?q=24.8616,67.0291&z=13&output=embed"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      aria-hidden="false"
                      tabIndex="0"
                    /> */}
                    <iframe
                      title="Google Map"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.363635855172!2d67.03759177515056!3d24.817235077957502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33dae0b22b061%3A0xb491e37d45a2fe2a!2sZamzama%20Mall%20Shopping%20Centre!5e0!3m2!1sen!2s!4v1739708161067!5m2!1sen!2s"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowfullscreen=""
                      aria-hidden="false"
                      tabIndex="0"
                    />
                  </div>
                </Col>
                <Col md={7}>
                  <Form onSubmit={handleSubmit(bookAppointment)}>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your full name"
                        {...register("name")}
                      />
                    </Form.Group>
                    <Row>
                      <Col md={6}>
                        <div>
                          <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlInput1"
                          >
                            <Form.Label>Email ID</Form.Label>
                            <Form.Control
                              type="email"
                              placeholder="name@example.com"
                              {...register("email")}
                            />
                          </Form.Group>
                        </div>
                      </Col>
                      <Col md={6}>
                        <Form.Label>Mobile number</Form.Label>
                        <PhoneInput
                          country={"pk"} // Set default country to Pakistan
                          onlyCountries={["pk"]} // Restrict to Pakistan
                          enableSearch={false} // Disable search for other countries
                          value={phone}
                          onChange={(phone) => setPhone(phone)} // Handle phone input
                        />
                      </Col>
                    </Row>
                    <div>
                      <div>
                        <div className="enquire">
                          <Row>
                            <Form.Label>PREFERRED DATE AND TIME</Form.Label>
                            <Col md={6}>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                  value={selectedDate}
                                  onChange={(newValue) =>
                                    setSelectedDate(newValue)
                                  } // Handle date input
                                  renderInput={(params) => (
                                    <Form.Control {...params} />
                                  )}
                                />
                              </LocalizationProvider>
                            </Col>
                            <Col md={6}>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={["TimePicker"]}>
                                  <TimePicker
                                    value={selectedTime}
                                    onChange={(newValue) =>
                                      setSelectedTime(newValue)
                                    } // Handle time input
                                    renderInput={(params) => (
                                      <Form.Control {...params} />
                                    )}
                                  />
                                </DemoContainer>
                              </LocalizationProvider>
                            </Col>
                          </Row>
                        </div>
                      </div>

                      {/* Condition Ends */}

                      <div className="btns-sections">
                        <button
                          className="submit-buttons"
                          style={{ cursor: "pointer" }}
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
                            "Email"
                          )}
                        </button>
                        <div
                          className="submit-buttons"
                          style={{
                            cursor: "pointer",
                            backgroundColor: "#25D366", // WhatsApp green
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Soft shadow to make it pop
                            color: "white", // White text for contrast
                            transition: "transform 0.2s, background-color 0.2s", // Smooth hover effects
                          }}
                          onClick={() => openWhatsapp()}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#22b860")
                          } // Darker green on hover
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#25D366")
                          }
                        >
                          <div className=" d-flex align-items-center justify-content-center gap-2">
                            <div>
                              <svg
                                width="19"
                                height="20"
                                viewBox="0 0 19 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clip-path="url(#clip0_110_33143)">
                                  <path
                                    d="M0.560762 9.70189C0.560328 11.2562 0.969641 12.774 1.74794 14.1117L0.486328 18.6824L5.20036 17.4559C6.5042 18.1602 7.96505 18.5292 9.44958 18.5293H9.45348C14.3542 18.5293 18.3435 14.5724 18.3456 9.70885C18.3465 7.3521 17.4224 5.13598 15.7433 3.46868C14.0646 1.80153 11.832 0.882912 9.45312 0.881836C4.55185 0.881836 0.562857 4.83854 0.560834 9.70189"
                                    fill="#25D366"
                                  />
                                  <path
                                    d="M0.24334 9.69794C0.242834 11.3082 0.666816 12.8802 1.47287 14.2659L0.166016 19.0004L5.04908 17.7299C6.39452 18.4578 7.90935 18.8416 9.45078 18.8422H9.45475C14.5313 18.8422 18.6638 14.7429 18.666 9.70525C18.6669 7.26383 17.7095 4.96804 15.9705 3.24101C14.2313 1.5142 11.9188 0.562527 9.45475 0.561523C4.37737 0.561523 0.245436 4.66021 0.243412 9.69794H0.24334ZM3.15131 14.0272L2.96898 13.74C2.20253 12.5308 1.79799 11.1334 1.79857 9.69851C1.80023 5.51128 5.23458 2.10462 9.45764 2.10462C11.5028 2.10548 13.4247 2.89654 14.8703 4.33179C16.3159 5.76719 17.1113 7.67527 17.1108 9.70468C17.1089 13.8919 13.6745 17.299 9.45475 17.299H9.45172C8.07773 17.2983 6.73019 16.9322 5.55501 16.2403L5.27534 16.0757L2.37763 16.8295L3.15131 14.0272V14.0272Z"
                                    fill="white"
                                  />
                                  <path
                                    d="M7.15561 5.87745C6.98318 5.49719 6.80172 5.48952 6.63775 5.48285C6.50348 5.47712 6.34999 5.47755 6.19664 5.47755C6.04315 5.47755 5.79376 5.53484 5.58296 5.76322C5.37195 5.99182 4.77734 6.54424 4.77734 7.66779C4.77734 8.79141 5.60211 9.87725 5.71709 10.0298C5.83221 10.182 7.30931 12.5615 9.6487 13.4769C11.5929 14.2376 11.9886 14.0863 12.4105 14.0481C12.8326 14.0101 13.7723 13.4959 13.964 12.9626C14.1559 12.4294 14.1559 11.9723 14.0984 11.8768C14.0409 11.7817 13.8874 11.7245 13.6572 11.6104C13.427 11.4961 12.2954 10.9437 12.0845 10.8674C11.8735 10.7913 11.72 10.7533 11.5666 10.9819C11.4131 11.2103 10.9723 11.7245 10.838 11.8768C10.7038 12.0295 10.5694 12.0485 10.3393 11.9343C10.109 11.8197 9.3678 11.5788 8.4884 10.8009C7.80419 10.1955 7.34227 9.44802 7.208 9.21935C7.07373 8.99104 7.19362 8.86728 7.30903 8.75348C7.41244 8.65116 7.53926 8.48681 7.65446 8.35351C7.76921 8.22014 7.80751 8.12498 7.88426 7.97268C7.96108 7.82023 7.92263 7.68686 7.86518 7.57264C7.80751 7.45841 7.36026 6.32898 7.15561 5.87745Z"
                                    fill="white"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_110_33143">
                                    <rect
                                      width="18.5"
                                      height="18.5"
                                      fill="white"
                                      transform="translate(0.166016 0.561523)"
                                    />
                                  </clipPath>
                                </defs>
                              </svg>
                            </div>
                            <div>chat</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Form>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;
