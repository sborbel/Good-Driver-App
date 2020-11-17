import React from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import * as Yup from "yup";
import { Redirect } from "react-router-dom";

import "./form.css";

const AnnouncementForm = props => {
  if (!(props.isAuthenticated())) {
    return <Redirect to="/" />;
  }
  return (
    <div>
      <h1 className="title is-1">Change Announcement</h1>
      <hr />
      <br />
      <Formik
        initialValues={{
          content: "",
          sponsor_name: props.state.currentUser.sponsor_name //
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          props.editAnnouncement(values);
          resetForm();
          setSubmitting(false);
          props.createMessage("success", "You have successfully created a new announcement.");
        }}
        validationSchema={Yup.object().shape({
          
        })}
      >
        {props => {
          const {
            values,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit
          } = props;
          return (
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label className="label" htmlFor="input-username">
                  Content
                </label>
                <input
                  name="content"
                  id="input-username"
                  type="text"
                  placeholder="Enter a message"
                  value={values.content}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
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
    </div>
  );
};

AnnouncementForm.propTypes = {
  isAuthenticated: PropTypes.func.isRequired,
  editAnnouncement: PropTypes.func
};

export default AnnouncementForm;
