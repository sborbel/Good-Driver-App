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
      role: "",
      showModal: false
    };
  }
  getIDfromemail = email => {
    for(let idx in this.props.users){
      const item = this.props.users[idx];
      if(item.email === email){
        return item.id;
      }

    }
    return -1;
  }
  handleOpenModal = () => {
    this.setState({ showModal: true });
  };
  handleCloseModal = () => {
    this.setState({ showModal: false });
  };
  editUser = (data, id) => {
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/users/${id}`;
    axios
      .put(url, data)
      .then(res => {
        this.handleCloseModal();
        this.props.createMessage("success", "User updated.");
      })
      .catch(err => {
        console.log(err);
        this.handleCloseModal();
        this.props.createMessage("danger", `${id}`);
      });
  };
  componentDidMount() {
    this.getUserStatus();
  }
  
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
          my_user={this.props.my_user}
          role={this.props.role}
          handleOpenModal={this.handleOpenModal}
          handleCloseModal={this.handleCloseModal}
          modalStyles={modalStyles}
          showModal={this.state.showModal}
          editUser={this.editUser}
          addUser={this.props.addUser}
          getUsers={this.props.getUsers}
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
  my_user: PropTypes.array,
  addUser: PropTypes.func.isRequired,
  createMessage: PropTypes.func,
  removeUser: PropTypes.func,
  getUsers: PropTypes.func
};

export default UserStatus;
