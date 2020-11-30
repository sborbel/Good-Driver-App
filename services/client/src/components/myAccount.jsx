import React from "react";
import PropTypes from "prop-types";
import * as Yup from "yup";
import  render  from 'react-dom';
import ReactDOM from "react-dom";
import { Formik, Field, Form } from 'formik';

import "./form.css";

const MyAccount = props => (
  
    <Formik
      initialValues={{
        username: props.thisuser.username, //add thisuser in userlist and everything else
        role: props.thisuser.role,
        sponsor_name: props.state.affiliations[props.state.current_affiliation].sponsor_name,
        myRole: props.state.currentUser.role,
        getPointsAlert: false,
        getOrderAlert: false,
        getProblemAlert: false
      }}
      onSubmit={
        (values, { setSubmitting, resetForm }) => {
          console.log(values)
          let res = {role: values.role, get_points_alert: values.getPointsAlert, get_order_alert: values.getOrderAlert, get_problem_alert: values.getProblemAlert, sponsor_name: values.sponsor_name, username: values.username};
        
          console.log(res);
          props.editUser(res, props.thisuser.id);
        
          resetForm();
          setSubmitting(false);
          //props.getAuthorizedData();
        }
      }
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
                  {(values.role === "admin" || values.role === "sponsor_mgr") && <option value="sponsor_mgr">Sponsor</option>}
                  {values.role === "admin" && <option value="admin">Admin</option>}
              </Field>
            </div>
            <div className="field">
              <Field
                name="getPointsAlert"
                id="input-points-alert"
                type="checkbox"
                value="true"
                checked={values.getPointsAlert}></Field>
              <label htmlFor="input-points-alert">Subscribe to points alerts?</label>
            </div>
            <div className="field">
            <Field
                name="getOrderAlert"
                id="input-order-alert"
                type="checkbox"
                value="true"
                checked={values.getOrderAlert}></Field>
              
              <label htmlFor="input-order-alert">Subscribe to order alerts?</label>
              
            </div>
            <div className="field">
              <Field
                name="getProblemAlert"
                id="input-problem-alert"
                type="checkbox"
                value="true"
                checked={values.getProblemAlert}></Field>
              
              <label htmlFor="input-problem-alert">Subscribe to problem alerts?</label>
              
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
  
  MyAccount.propTypes = {
    thisuser: PropTypes.object,
    editUser: PropTypes.func.isRequired,
    getAuthorizedData: PropTypes.func.isRequired
  }
  export default MyAccount;
  