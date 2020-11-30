import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import {Navbar, Nav, Button} from 'react-bootstrap'
import * as Yup from "yup";

import Modal from "react-modal";

//import "./NavBar.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Field, Formik } from "formik";
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
const NavBar = props => {
  const [modalIsOpen,setIsOpen] = React.useState(false);
  function openModal() {
    setIsOpen(true);

  }
  function closeModal(){
    setIsOpen(false);
  }
  let resetModal = <>
    <Modal
                    isOpen={modalIsOpen} //
                    style={modalStyles}k
                  >
                    <div className="modal is-active">
                      <div className="modal-background" />
                      <div className="modal-card">
                        <header className="modal-card-head">
                          <p className="modal-card-title">Password Reset</p>
                          <button
                            className="delete"
                            aria-label="close"
                            onClick={closeModal}
                          />
                        </header>
                        <section className="modal-card-body">
                            <div>
                            <hr />
                            <br />
                            <Formik
                                initialValues={{
                                  oldPass: "",
                                  newPass1: "",
                                  newPass2: ""
                                }}
                                onSubmit={(values, { setSubmitting, resetForm }) => {
                                  if(values.newPass1 === values.newPass2){
                                    let passProm = props.apiUpdatePassword(props.state.currentUser.id, values.oldPass, values.newPass1);
                                    passProm.then(res => {
                                      closeModal();
                                      resetForm();
                                      setSubmitting(false);
                                      props.createMessage("success", "Password Was Successfully Changed");
                                    }).catch(err => {
                                      closeModal();
                                      console.log(err);
                                      props.createMessage("danger", "Password Change was Unsuccessful");
                                      resetForm();
                                    });
                                  }
                                }}
                                validationSchema={Yup.object().shape({
                                  oldPass: Yup.string()
                                    .required("Password is required.")
                                    .min(1, "Password must be greater than 10 characters."),
                                  newPass1: Yup.string()
                                    .required("Password is required.")
                                    .min(1, "Password must be greater than 10 characters."),
                                  newPass2: Yup.string()
                                    .required("Password is required.")
                                    .min(1, "Password must be greater than 10 characters.")
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
                                        <label className="label" htmlFor="input-password">
                                          Old Password
                                        </label>
                                        <input
                                          name="oldPass"
                                          id="input-password"
                                          className={
                                            errors.oldPass && touched.oldPass
                                              ? "input error"
                                              : "input"
                                          }
                                          type="password"
                                          placeholder="Enter current password"
                                          value={values.oldPass}
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                        />
                                        {errors.oldPass && touched.oldPass && (
                                          <div className="input-feedback" data-testid="errors-password">
                                            {errors.oldPass}
                                          </div>
                                        )}
                                      </div>


                                      <div className="field">
                                        <label className="label" htmlFor="input-password">
                                          New Password
                                        </label>
                                        <input
                                          name="newPass1"
                                          id="input-password"
                                          className={
                                            errors.newPass1 && touched.newPass1
                                              ? "input error"
                                              : "input"
                                          }
                                          type="password"
                                          placeholder="Enter new password"
                                          value={values.newPass1}
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                        />
                                        {errors.newPass1 && touched.newPass1 && (
                                          <div className="input-feedback" data-testid="errors-password">
                                            {errors.newPass1}
                                          </div>
                                        )}
                                      </div>

                                      <div className="field">
                                        <label className="label" htmlFor="input-password">
                                          New Password
                                        </label>
                                        <input
                                          name="newPass2"
                                          id="input-password"
                                          className={
                                            errors.password && touched.password
                                              ? "input error"
                                              : "input"
                                          }
                                          type="password"
                                          placeholder="Re-Enter new password"
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
                        </section>
                      </div>
                    </div>

                  </Modal></>
  function getOptions(){
    let ret = [];
    for(let i in props.state.affiliations){
      ret.push(<option key={props.state.affiliations[i].id} value={i}>{props.state.affiliations[i].sponsor_name}</option>);
    }
    return ret;
  }
  let menu = (
    <>
    <Nav className="mr-auto">
    
      
      <Nav.Item as={Link} to="/register" bsPrefix='nav-link'>
      Register
          </Nav.Item>
      <Nav.Item as={Link} to="/login" bsPrefix='nav-link'>
      Login
          </Nav.Item>
      
      </Nav>
      
      </>
  );
  if (props.isAuthenticated() && props.role === "admin") {
    menu = (
      <>
        <Nav className="mr-auto">
        
          <Nav.Item as={Link} to="/userlist" bsPrefix='nav-link'>
          Users
          </Nav.Item>
          <Nav.Item as={Link} to="/userstatus" bsPrefix='nav-link'>
          User Status
          </Nav.Item>
          <Nav.Item as={Link} to="/eventstable" bsPrefix='nav-link'>
          Events
          </Nav.Item>
          <Nav.Item as={Link} to="/affiliations" bsPrefix='nav-link'>
          Affiliations
          </Nav.Item>
          <Nav.Item as={Link} to="/reports" bsPrefix='nav-link'>
          Reports
          </Nav.Item>
          <Nav.Item as={Link} to="/account" bsPrefix='nav-link'>
          My Account
          </Nav.Item>
        </Nav>
        {props.state.isDriver === false &&
          <Nav.Item>
          <Formik
        initialValues={{
          role: props.state.currentUser.role
        }}
        onSubmit={(values, { setSubmitting }) => {
          //setCorrectID(values.user);
          //props.getUserDataByID(props.state.currentUser.id);
          props.createMessage("success", "Entering "+values.role+" view");
          console.log(values.role);

          props.setCurrentRole(values.role);
          setSubmitting(false);
        }}
        
      >
        {props => {
          const {
            isSubmitting,
            handleSubmit
          } = props;
          return (
            <div>
            <form onSubmit={handleSubmit}>
            <Field as="select" name="role">
            <option value={"driver"}>Driver</option>
            <option value={"sponsor_mgr"}>Sponsor</option>
            <option value={"admin"}>Admin</option>
            </Field>
             
              <input
                type="submit"
                className="button is-primary"
                value="Submit"
                disabled={isSubmitting}
              />
            </form>
            </div>
          );
        }}
      </Formik>
          </Nav.Item>}

        <Nav>
        <input
                type="button"
                className="button is-secondary"
                value="Reset Password"
                id="button2"
                onClick={() => openModal()}
              />
      {resetModal}
        
        <Button variant="danger" size='sm' onClick={props.logoutUser}>Logout</Button> 
   
        </Nav>
      </>
      
    );
  }
  if (props.isAuthenticated() && props.role === "sponsor_mgr") {
    menu = (
      <>
        <Nav className="mr-auto">
        
          <Nav.Item as={Link} to="/messenger" bsPrefix='nav-link'>
          Messenger
          </Nav.Item>
          <Nav.Item as={Link} to="/userlist" bsPrefix='nav-link'>
          Users
          </Nav.Item>
          <Nav.Item as={Link} to="/userstatus" bsPrefix='nav-link'>
          User Status
          </Nav.Item>
          <Nav.Item as={Link} to="/eventstable" bsPrefix='nav-link'>
          Events
          </Nav.Item>
          <Nav.Item as={Link} to="/announcementform" bsPrefix='nav-link'>
          Announcement
          </Nav.Item>
          <Nav.Item as={Link} to="/driverstore" bsPrefix='nav-link'>
          Store
          </Nav.Item>
          <Nav.Item as={Link} to="/account" bsPrefix='nav-link'>
          My Account
          </Nav.Item>
        </Nav>

        {props.state.isDriver === false &&
          <Nav.Item>
          <Formik
        initialValues={{
          role: props.state.currentUser.role,
          myIsAdmin: props.state.is_admin
        }}
        onSubmit={(values, { setSubmitting }) => {
          //setCorrectID(values.user);
          //props.getUserDataByID(props.state.currentUser.id);
          console.log(values.role);
          props.createMessage("success", "Entering "+values.role+" view");
          props.setCurrentRole(values.role);
          setSubmitting(false);
        }}
        
      >
        {props => {
          const {values,
            isSubmitting,
            handleSubmit
          } = props;
          return (
            <div>
            <form onSubmit={handleSubmit}>
            <Field as="select" name="role">
            <option value={"driver"}>Driver</option>
            <option value={"sponsor_mgr"}>Sponsor</option>
            {values.myIsAdmin &&
            <option value={"admin"}>Admin</option>}
            </Field>
             
              <input
                type="submit"
                className="button is-primary"
                value="Submit"
                disabled={isSubmitting}
              />
            </form>
            </div>
          );
        }}
      </Formik>
          </Nav.Item>}

        <Nav>
        <input
                type="button"
                className="button is-secondary"
                value="Reset Password"
                id="button2"
                onClick={() => openModal()}
              />
      {resetModal}
        
        <Button variant="danger" size='sm' onClick={props.logoutUser}>Logout</Button> 
   
        </Nav>
      </>
      
    );
  }
  if (props.isAuthenticated() && props.role === "driver") {
    //console.log(props.state);
    menu = (

      <>
        <Nav className="mr-auto">
          
          <Nav.Item as={Link} to="/eventstable" bsPrefix='nav-link'>
          Events
          </Nav.Item>
          <Nav.Item as={Link} to="/driverstore" bsPrefix='nav-link'>
          Store
          </Nav.Item>
          <Nav.Item as={Link} to="/messenger" bsPrefix='nav-link'>
          Help Desk
          </Nav.Item>
          <Nav.Item as={Link} to="/affiliations" bsPrefix='nav-link'>
          Affiliations
          </Nav.Item>
          <Nav.Item as={Link} to="/account" bsPrefix='nav-link'>
          My Account
          </Nav.Item>
          
          
          <Nav.Item>
          {props.state.affiliations.length > 1 &&
           <Formik
        initialValues={{
          aff: props.state.current_affiliation
        }}
        onSubmit={(values, { setSubmitting }) => {
          console.log(values.aff);
          props.setCurrentAffiliation(values.aff);
          props.getUserDataById(props.state.currentUser.id)
          console.log(props.state.current_affiliation)
          setSubmitting(false);
        }}
        
      >
        {props => {
          const {
            isSubmitting,
            handleSubmit
          } = props;
          return (
            <div>
            <form onSubmit={handleSubmit}>
            <Field as="select" name="aff">
            {getOptions()}
            </Field>
             
              <input
                type="submit"
                className="button is-primary"
                value="Submit"
                disabled={isSubmitting}
              />
            </form>
            </div>
          );
        }}
      </Formik>}
          </Nav.Item>

          {props.state.isDriver === false &&
          <Nav.Item>
          <Formik
        initialValues={{
          role: props.state.currentUser.role,
          myIsAdmin: props.state.is_admin
        }}
        onSubmit={(values, { setSubmitting }) => {
          //setCorrectID(values.user);
          //props.getUserDataByID(props.state.currentUser.id);
          props.createMessage("success", "Entering "+values.role+" view");
          console.log(values.role);
          props.setCurrentRole(values.role);
          setSubmitting(false);
        }}
        
      >
        {props => {
          const {
            values,
            isSubmitting,
            handleSubmit
          } = props;
          return (
            <div>
            <form onSubmit={handleSubmit}>
            <Field as="select" name="role">
            <option value={"driver"}>Driver</option>
            <option value={"sponsor_mgr"}>Sponsor</option>
            {values.myIsAdmin === true &&
            <option value={"admin"}>Admin</option>}
            </Field>
             
              <input
                type="submit"
                className="button is-primary"
                value="Submit"
                disabled={isSubmitting}
              />
            </form>
            </div>
          );
        }}
      </Formik>
          </Nav.Item>}
          
          
        </Nav>
        <Nav>
        <input
                type="button"
                className="button is-secondary"
                value="Reset Password"
                id="button2"
                onClick={() => openModal()}
              />
      {resetModal}
        <Button variant="danger" size='sm' onClick={props.logoutUser}>Logout</Button> 
      </Nav>


      </>
    );
  }

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
  <Navbar.Brand as={Link} to="/">
    {props.title}
    </Navbar.Brand>
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav">
    
      {menu}
    
    
  </Navbar.Collapse>
</Navbar>
  );
};

NavBar.propTypes = {
  title: PropTypes.string.isRequired,
  logoutUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.func.isRequired,
  getUserDataById: PropTypes.func,
  setCurrentAffiliation: PropTypes.func,
  setCurrentRole: PropTypes.func
};

export default NavBar;

