import React from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import * as Yup from "yup";

import Modal from "react-modal";
import { Redirect } from "react-router-dom";

import "./form.css";
const modalStyles = {
  content: {
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    border: 0,
    background: "transparent"
  }
};

const LoginForm = props => {
  function openModal() {
    setIsOpen(true);

  }
  function closeModal(){
    setIsOpen(false);
  }
  const [modalIsOpen,setIsOpen] = React.useState(false);
  if (props.isAuthenticated()) {
    return <Redirect to="/home" />;
  }
  return (
    <div>
      <h1 className="title is-1">Log In</h1>
      <hr />
      <br />
      <Formik
        initialValues={{
          email: "",
          password: ""
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          props.handleLoginFormSubmit(values);
          resetForm();
          setSubmitting(false);
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Enter a valid email.")
            .required("Email is required."),
          password: Yup.string().required("Password is required.")
        })}
      >
        {props => {
          const {
            values,
            touched,
            errors,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit
          } = props;
          return (
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label className="label" htmlFor="input-email">
                  Email
                </label>
                <input
                  name="email"
                  id="input-email"
                  className={
                    errors.email && touched.email ? "input error" : "input"
                  }
                  type="email"
                  placeholder="Enter an email address"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.email && touched.email && (
                  <div className="input-feedback">{errors.email}</div>
                )}
              </div>
              <div className="field">
                <label className="label" htmlFor="input-password">
                  Password
                </label>
                <input
                  name="password"
                  id="input-password"
                  className={
                    errors.password && touched.password
                      ? "input error"
                      : "input"
                  }
                  type="password"
                  placeholder="Enter a password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.password && touched.password && (
                  <div className="input-feedback">{errors.password}</div>
                )}
              </div>
              <input
                type="submit"
                className="button is-primary"
                value="Submit"
                id="button1"
                disabled={isSubmitting}
              />
            </form>
          );
        }}
      </Formik>
      
    </div>
  );
}

LoginForm.propTypes = {
  handleLoginFormSubmit: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.func.isRequired
};

export default LoginForm;
