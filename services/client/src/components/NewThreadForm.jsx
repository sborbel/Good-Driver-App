import React from "react";
import PropTypes from "prop-types";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import { Redirect } from "react-router-dom";

import "./form.css";



const NewThreadForm = props => {
    function createSelectItems() {
        
        let users = props.users;
        console.log(users);
        let items = [];         
        for (let i = 0; i < users.length; i++) {             
             items.push(<option value={users[i].id}>{`${users[i].username}, ${users[i].role}`}</option>);  
             console.log(users[i]); 
             
        }
        return items;
    };
  if (props.isAuthenticated() === false) {
    return <Redirect to="/" />;
  }
  return (
    <div>
      <h1 className="title is-1">Add Thread</h1>
      <hr />
      <br />
      <Formik
        initialValues={{
          recpID: props.users[0].id
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          props.createNewThread(values);
          props.getUserDataByID(props.state.currentUser.id);
          props.NewMessageCloseModal();
          resetForm();
          setSubmitting(false);
        }}
        validationSchema={Yup.object().shape({
          
        })}
      >
        {props => {
          const {
            isSubmitting,
            handleSubmit
          } = props;
          return (
            <form onSubmit={handleSubmit}>
            <div className="field">
                <Field as="select" name="recpID">
                    {createSelectItems()}
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
    </div>
  );
};

NewThreadForm.propTypes = {
  user: PropTypes.object,
  createNewThread: PropTypes.func,
  users: PropTypes.array,
  NewMessageCloseModal: PropTypes.func,
  getUserDataByID: PropTypes.func
};

export default NewThreadForm;
