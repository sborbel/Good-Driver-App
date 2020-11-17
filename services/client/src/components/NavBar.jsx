import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import {Navbar, Nav, Button, NavDropdown} from 'react-bootstrap'

//import "./NavBar.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Field, Formik } from "formik";

const NavBar = props => {
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
    
      <Nav.Item as={Link} to="/about" bsPrefix='nav-link'>
          About
          </Nav.Item>
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
        <Nav.Item as={Link} to="/about" bsPrefix='nav-link'>
          About
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
        </Nav>

        <Nav>
        
        <Button variant="danger" size='sm' onClick={props.logoutUser}>Logout</Button> 
   
        </Nav>
      </>
      
    );
  }
  if (props.isAuthenticated() && props.role === "sponsor_mgr") {
    menu = (
      <>
        <Nav className="mr-auto">
        <Nav.Item as={Link} to="/about" bsPrefix='nav-link'>
          About
          </Nav.Item>
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
        <Nav.Item as={Link} to="/about" bsPrefix='nav-link'>
          About
          </Nav.Item>
          
          <Nav.Item as={Link} to="/eventstable" bsPrefix='nav-link'>
          Events
          </Nav.Item>
          <Nav.Item as={Link} to="/driverstore" bsPrefix='nav-link'>
          Store
          </Nav.Item>
          <Nav.Item as={Link} to="/messenger" bsPrefix='nav-link'>
          Help Desk
          </Nav.Item>
          
          
          <Nav.Item>
          {props.state.affiliations.length > 1 &&
           <Formik
        initialValues={{
          aff: props.state.current_affiliation
        }}
        onSubmit={(values, { setSubmitting }) => {
          //setCorrectID(values.user);
          //props.getUserDataByID(props.state.currentUser.id);
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
          role: props.state.currentUser.role
        }}
        onSubmit={(values, { setSubmitting }) => {
          //setCorrectID(values.user);
          //props.getUserDataByID(props.state.currentUser.id);
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

