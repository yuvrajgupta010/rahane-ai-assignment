import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

import style from "./login.module.css";
import { useFormik } from "formik";
import { loginFormValidation } from "@/helpers/validation";
import { apiInterceptor } from "@/service/axiosClient";
import restfulUrls from "@/service/restfulUrls";
import { useAuthCTX } from "@/store/AuthCTX";
import toast from "react-hot-toast";

const Login = () => {
  const { isAuthenticated, _login } = useAuthCTX();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { handleChange, handleBlur, handleSubmit, values, errors, touched } =
    useFormik({
      validationSchema: loginFormValidation,
      initialValues: {
        email: "",
        password: "",
      },
      onSubmit: async (values) => {
        setIsSubmitting(true);

        try {
          const response = await apiInterceptor.post(restfulUrls.LOGIN, {
            email: values.email,
            password: values.password,
          });

          const responseData = response?.data;
          if (response.status === 200) {
            const { accessToken, userDetails } = responseData?.data;
            _login({
              token: accessToken,
              userDetails: userDetails,
            });
            toast.success(responseData.message);
          }
        } catch (error) {
          console.error("Login failed", error);
          toast.error(
            error?.data?.message || "Login failed. Please try again."
          );
        } finally {
          setIsSubmitting(false);
        }
      },
    });

  return (
    <div
      className={style["sign-in__wrapper"]}
      // style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      {/* Overlay */}
      <div className={style["sign-in__backdrop"]}></div>
      {/* Form */}
      <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
        {/* Header */}
        <span className="text-center d-flex justify-content-center mb-2">
          <svg
            className="h-8 w-8 text-blue-600 text-center"
            fill="none"
            width={40}
            height={40}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </span>

        <div className="h4 mb-2 text-center">Sign In</div>

        <Form.Group className="mb-2" controlId="username">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
            name="email"
            value={values.email}
            placeholder="admin@rahaneai.com"
            onBlur={handleBlur}
            onChange={handleChange}
            required
          />
          {errors.email && touched.email && (
            <p className="text-danger mt-2">{errors.email}</p>
          )}
        </Form.Group>
        <Form.Group className="mb-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={values.password}
            placeholder="Password"
            onBlur={handleBlur}
            onChange={handleChange}
            required
          />
          {errors.password && touched.password && (
            <p className="text-danger mt-2">{errors.password}</p>
          )}
        </Form.Group>

        {!isSubmitting ? (
          <Button className="w-100" variant="primary" type="submit">
            Log In
          </Button>
        ) : (
          <Button className="w-100" variant="primary" type="submit" disabled>
            Logging In...
          </Button>
        )}
      </Form>
    </div>
  );
};

export default Login;
