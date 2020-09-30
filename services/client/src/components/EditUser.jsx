import React from "react";
import PropTypes from "prop-types";
import { Field, Form, Formik, FormikProps } from "formik";
import * as Yup from "yup";
import axios from "axios";

import "./form.css";


const EditUser = props => (
  <Formik
    initialValues={{
      username: props.thisuser.username, //add thisuser in userlist and everything else
      role: props.thisuser.role,
      sponsor_name: props.thisuser.sponsor_name
    }}
    onSubmit={(values, { setSubmitting, resetForm }) => {
        let res = {role: values.role, sponsor_name: values.sponsor_name, username: values.username};
      props.editUser(res, props.thisuser.id);//add in app.jsx
      props.getUsers();
      resetForm();
      setSubmitting(false);
    }}
    // Edit this for production
    validationSchema={Yup.object().shape({
      username: Yup.string()
        .required("Username is required.")
        .min(1, "Username must be greater than 0 characters.")
      
      
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
                errors.username && touched.username ? "input error" : "input"
              }
              type="text"
              placeholder="Enter a username"
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.username && touched.username && (
              <div className="input-feedback">{errors.username}</div>
            )}
          </div>
          <div className="field">
            <Field as="select" name="role">
                <option value="driver">Driver</option>
                <option value="sponsor_mgr">Sponsor</option>
                <option value="admin">Admin</option>
            </Field>
          </div>
          <div className="field">
            <Field as="select" name="sponsor_name">
                <option value="Great Big Freight">Great Big Freight</option>
                <option value="Yellow Freight">Yellow Freight</option>
            </Field>
          </div>
          
          
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
);

EditUser.propTypes = {
  thisuser: PropTypes.array,
  editUser: PropTypes.func.isRequired,
  getUsers: PropTypes.func
}
export default EditUser;
