import React from "react";
import PropTypes from "prop-types";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import { Redirect } from "react-router-dom";

import "./form.css";

const RegisterForm = props => {
  function getOptions(){
    let ret = [];
    if(props.state.currentUser.role==="sponsor_mgr"){
      ret.push(<option key="1" value={props.state.currentUser.sponsor_name}>{props.state.currentUser.sponsor_name}</option>)
      return ret;
    }
    else{
      
      for(let i in props.state.all_sponsors){
        ret.push(<option key={i} value={props.state.all_sponsors[i]}>{props.state.all_sponsors[i]}</option>);
      }
      return ret;
    }
  }
  if (props.isAuthenticated()) {
    //return <Redirect to="/" />;
  }
  return (
    <div>
      <h1 className="title is-1">Register</h1>
      <hr />
      <br />
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          sponsor: props.state.all_sponsors[0]
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          props.createMessage("success", "Creating User: Please Wait")
          //console.log(props.state)
          //console.log(values);
          if(props.state.currentUser.role === "sponsor_mgr"){
            values.sponsor = props.state.currentUser.sponsor_name
          }
          if(values.sponsor === undefined){
            values.sponsor = props.state.all_sponsors[0];
          }
          //console.log(values);
          //console.log(values.all_sponsorslist);
          props.handleRegisterFormSubmit(values);
          if(props.isAuthenticated() === true){
            props.getUserDataById(props.state.currentUser.id);
            props.closeModal();
          }
          
          resetForm();
          setSubmitting(false);
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string()
            .required("Username is required.")
            .min(6, "Username must be greater than 5 characters."),
          email: Yup.string()
            .email("Enter a valid email.")
            .required("Email is required.")
            .min(6, "Email must be greater than 5 characters."),
          password: Yup.string()
            .required("Password is required.")
            .min(11, "Password must be greater than 10 characters.")
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
                <label className="label" htmlFor="input-username">
                  Username
                </label>
                <input
                  name="username"
                  id="input-username"
                  className={
                    errors.username && touched.username
                      ? "input error"
                      : "input"
                  }
                  type="text"
                  placeholder="Enter a username"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.username && touched.username && (
                  <div className="input-feedback" data-testid="errors-username">
                    {errors.username}
                  </div>
                )}
              </div>
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
                  <div className="input-feedback" data-testid="errors-email">
                    {errors.email}
                  </div>
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
                  <div className="input-feedback" data-testid="errors-password">
                    {errors.password}
                  </div>
                )}
              </div>
              {/*props.state.currentUser.role !== "sponsor_mgr" &&*/ <div className="field">
              <Field as="select" name="sponsor" value={values.sponsor}>
                {getOptions()}
              </Field>
              </div>}
              <input
                type="submit"
                className="button is-primary"
                value="Submit"
                disabled={isSubmitting}
              />
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

RegisterForm.propTypes = {
  handleRegisterFormSubmit: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.func.isRequired
};

export default RegisterForm;
