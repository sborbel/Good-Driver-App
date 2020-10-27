import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import {Navbar, Nav, NavDropdown, Button} from 'react-bootstrap'

//import "./NavBar.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const titleStyle = {
  fontWeight: "bold"
};

const NavBar = props => {
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
  if (props.isAuthenticated() && props.role == "admin") {
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
        </Nav>

        <Nav>
        
        <Button variant="danger" size='sm' onClick={props.logoutUser}>Logout</Button> 
   
        </Nav>
      </>
      
    );
  }
  if (props.isAuthenticated() && props.role == "sponsor_mgr") {
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

        <Nav>
        
        <Button variant="danger" size='sm' onClick={props.logoutUser}>Logout</Button> 
   
        </Nav>
      </>
      
    );
  }
  if (props.isAuthenticated() && props.role === "driver") {
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
          
        </Nav>
        <Nav>
        <Button variant="danger" size='sm' onClick={props.logoutUser}>Logout</Button> 
      </Nav>
      </>
    );
  }

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
  <Navbar.Brand href="/">{props.title}</Navbar.Brand>
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
  isAuthenticated: PropTypes.func.isRequired
};

export default NavBar;

