import React, { Component } from "react";
import axios from "axios";
import { Route, Switch, withRouter } from "react-router-dom";
import Modal from "react-modal";

import UsersList from "./components/UsersList";
import About from "./components/About";
import NavBar from "./components/NavBar";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import UserStatus from "./components/UserStatus";
import Message from "./components/Message";
import AddUser from "./components/AddUser";
import DriverHome from "./components/DriverHome";
import AdminHome from "./components/AdminHome";
import SponsorHome from "./components/SponsorHome";

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

class App extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      myID: "Init",
      email: "",
      title: "Good Driver Rewards Program",
      accessToken: null,
      messageType: null,
      messageText: null,
      showModal: false,
      role: ""
    };
  }

  componentDidMount = () => {
    this.getUsers();
  };

  getUsers = () => {
    axios
      .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`)
      .then(res => {
        this.setState({ users: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  };

  addUser = data => {
    axios
      .post(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`, data)
      .then(res => {
        this.getUsers();
        this.setState({ username: "", email: "" });
        this.handleCloseModal();
        this.createMessage("success", "User added.");
      })
      .catch(err => {
        console.log(err);
        this.handleCloseModal();
        this.createMessage("danger", "That user already exists.");
      });
  };

  handleRegisterFormSubmit = data => {
    const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/register`;
    axios
      .post(url, data)
      .then(res => {
        console.log(res.data);
        this.createMessage("success", "You have registered successfully.");
      })
      .catch(err => {
        console.log(err);
        this.createMessage("danger", "That user already exists.");
      });
  };

  setrole = () => {
    const options = {
      url: `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/status`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.state.accessToken
      }
    };
    axios(options)
      .then(res => {
        this.setState({
          role: res.data.role
        });
      })
      .catch(error => {
        console.log(error);
      });
  };
  setid = () => {
    const options = {
      url: `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/status`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.state.accessToken
      }
    };
    axios(options)
      .then(res => {
        this.setState({
          myID: res.data.id
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleLoginFormSubmit = data => {
    const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/login`;
    axios
      .post(url, data)
      .then(res => {
        this.setState({ accessToken: res.data.access_token });
        this.setState({ email: data.email });
        this.getUsers();
        this.setrole();
        window.localStorage.setItem("refreshToken", res.data.refresh_token);
        this.createMessage("success", "You have logged in successfully.");
      })
      .catch(err => {
        console.log(err);
        this.createMessage("danger", "Incorrect email and/or password.");
      });
  };

  

  logoutUser = () => {
    window.localStorage.removeItem("refreshToken");
    this.setState({ accessToken: null });
    this.setState({ role: "" });
    this.props.history.push('/login')
    
    this.createMessage("success", "You have logged out.");
  };

  isAuthenticated = () => {
    if (this.state.accessToken || this.validRefresh()) {
      return true;
    }
    return false;
  };
  

  validRefresh = () => {
    const token = window.localStorage.getItem("refreshToken");
    if (token) {
      axios
        .post(`${process.env.REACT_APP_USERS_SERVICE_URL}/auth/refresh`, {
          refresh_token: token
        })
        .then(res => {
          this.setState({ accessToken: res.data.access_token });
          this.getUsers();

          this.setrole();
          window.localStorage.setItem("refreshToken", res.data.refresh_token);
          return true;
        })
        .catch(err => {
          return false;
        });
    }
    return false;
  };

  createMessage = (type, text) => {
    this.setState({
      messageType: type,
      messageText: text
    });
    setTimeout(() => {
      this.removeMessage();
    }, 3000);
  };

  getRole = () => {
    return this.state.role;
  }

  removeMessage = () => {
    this.setState({
      messageType: null,
      messageText: null
    });
  };

  handleOpenModal = () => {
    this.setState({ showModal: true });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  removeUser = user_id => {
    axios
      .delete(`${process.env.REACT_APP_USERS_SERVICE_URL}/users/${user_id}`)
      .then(res => {
        this.getUsers();
        this.createMessage("success", "User removed.");
      })
      .catch(err => {
        console.log(err);
        this.createMessage("danger", "Something went wrong.");
      });
  };

  render() {
    let homePage = <Route exact path="/about" component={About} />;
    if(this.state.role === "driver"){
      homePage = <Route exact path="/"
      render={() => (
        <div>
          <h1 className="title is-1">Driver Home</h1>
          <hr />
          
        </div>
      )}
    />;
    }
    else if(this.state.role === "admin"){
      homePage = <Route exact path="/"
      render={() => (
        <div>
          <h1 className="title is-1">Admin Home</h1>
          <hr />
          
        </div>
      )}
    />;
    }
    else if(this.state.role === "sponsor_mgr"){
      homePage = <Route exact path="/"
                    render={() => (
                      <div>
                        <h1 className="title is-1">Sponsor Home</h1>
                        <hr />
                        
                      </div>
                    )}
                  />;
    }
    
    return (
      <div>
        <NavBar
          title={this.state.title}
          logoutUser={this.logoutUser}
          isAuthenticated={this.isAuthenticated}
          getRole={this.getRole}

        />
        <section className="section">
          <div className="container">
            {this.state.messageType && this.state.messageText && (
              <Message
                messageType={this.state.messageType}
                messageText={this.state.messageText}
                removeMessage={this.removeMessage}
              />
            )}
            <div className="columns">
              <div className="column is-half">
                <br />
                <Switch>
                  {homePage}
                  <Route exact path="/addUser"
                    render={() => (
                      <div>
                        <h1 className="title is-1">Users</h1>
                        <hr />
                        <br />
                        {this.isAuthenticated() && (
                          <button
                            onClick={this.handleOpenModal}
                            className="button is-primary"
                          >
                            Add User
                          </button>
                        )}
                        <br />
                        <br />
                        <Modal
                          isOpen={this.state.showModal}
                          style={modalStyles}
                        >
                          <div className="modal is-active">
                            <div className="modal-background" />
                            <div className="modal-card">
                              <header className="modal-card-head">
                                <p className="modal-card-title">Add User</p>
                                <button
                                  className="delete"
                                  aria-label="close"
                                  onClick={this.handleCloseModal}
                                />
                              </header>
                              <section className="modal-card-body">
                                <AddUser addUser={this.addUser} />
                              </section>
                            </div>
                          </div>
                        </Modal>
                        <UsersList
                          users={this.state.users}
                          removeUser={this.removeUser}
                          isAuthenticated={this.isAuthenticated}
                        />
                      </div>
                    )}
                  />
                  
                  <Route
                    exact
                    path="/register"
                    render={() => (
                      <RegisterForm
                        // eslint-disable-next-line react/jsx-handler-names
                        handleRegisterFormSubmit={this.handleRegisterFormSubmit}
                        isAuthenticated={this.isAuthenticated}
                        isDriver={this.isDriver}
                        isSponsor={this.isSponsor}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/login"
                    render={() => (
                      <LoginForm
                        // eslint-disable-next-line react/jsx-handler-names
                        handleLoginFormSubmit={this.handleLoginFormSubmit}
                        isAuthenticated={this.isAuthenticated}
                        isDriver={this.isDriver}
                        isSponsor={this.isSponsor}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/status"
                    render={() => (
                      <UserStatus
                        accessToken={this.state.accessToken}
                        isAuthenticated={this.isAuthenticated}
                        
                      />
                    )}
                  />
                </Switch>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default withRouter(App);
