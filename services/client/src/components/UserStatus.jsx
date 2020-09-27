import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Redirect } from "react-router-dom";
import Modal from "react-modal";
import UsersList from "./UsersList";

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

Modal.setAppElement(document.getElementById("root"));

class UserStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      role: ""
    };
  }
  componentDidMount() {
    this.getUserStatus();
  }
  handleOpenModal = () => {
    this.setState({ showModal: true });
  };
  getUserStatus(event) {
    const options = {
      url: `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/status`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${this.props.accessToken}`
      }
    };
    return axios(options)
      .then(res => {
        this.setState({
          email: res.data.email,
          username: res.data.username,
          role: res.data.role
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
  render() {
    if (!this.props.isAuthenticated()) {
      return <Redirect to="/login" />;
    }
    return (
      <div>
        <h1 className="title is-1">Users</h1>
        <hr />
        <br />
        
        <br />
        <br />
        <Modal
          isOpen={this.props.showModal}
          style={modalStyles}
        >
          
        </Modal>
        <UsersList
          users={this.props.users}
          removeUser={this.props.removeUser}
          isAuthenticated={this.props.isAuthenticated}
          myUser={this.props.myUser}
          role={this.props.role}
        />
      </div>
    );
  }
}

UserStatus.propTypes = {
  accessToken: PropTypes.string,
  isAuthenticated: PropTypes.func.isRequired,
  users: PropTypes.array,
  role: PropTypes.string,
  myUser: PropTypes.string
};

export default UserStatus;
