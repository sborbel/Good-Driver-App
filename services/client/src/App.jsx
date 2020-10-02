import React, { Component } from "react";
import axios from "axios";
import { Route, Switch, Redirect} from "react-router-dom";
import Modal from "react-modal";

import UsersList from "./components/UsersList";
import About from "./components/About";
import NavBar from "./components/NavBar";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Message from "./components/Message";
import AddUser from "./components/AddUser";
import HomePage from "./components/HomePage";

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
      currentUser: {},
      currentUserId: "",
      title: "Good Driver App",
      accessToken: null,
      messageType: null,
      messageText: null,
      showModal: false
    };
  }

  componentDidMount = () => {
    let userstate = localStorage.getItem("userstate");
    if (userstate) {
      userstate = JSON.parse(userstate);
      console.log("We have data");
      this.setState({ currentUser: userstate });
    }else{
      console.log("NO data");
    }
    
    
  };


  // getUsers = () => {
  //   axios
  //     .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`)
  //     .then(res => {
  //       console.log("Users: ", res.data);
  //       this.setState({ users: res.data });
  //       window.localStorage.setItem("userslist", JSON.stringify(res.data));
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // };

  getUserById = (id) => {
    axios
      .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users/${id}`)
      .then(res => {
        console.log("This user: ", res.data);
        this.setState({ currentUser: res.data });
        window.localStorage.setItem("userstate", JSON.stringify(res.data));
      })
      .catch(err => {
        console.log(err);
      });
  };

  // getUsersBySponsorName = (sponsor_name) => {
  //   axios
  //     .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users/by_sponsor/${this.state.currentUser}`)
  //     .then(res => {
  //       this.setState({ users: res.data });
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // };


  addUser = data => {
    axios
      .post(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`, data)
      .then(res => {
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

  handleLoginFormSubmit = data => {

    const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/login`;
    axios
    .post(url, data)
    .then(res => {
      console.log("Login processing for: ", res.data);
      this.getUserById(res.data.user_id);
      this.setState({ accessToken: res.data.access_token, 
                      currentUserId: res.data.user_id });

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
    window.localStorage.removeItem("userstate");
    this.setState({ accessToken: null, users: [], currentUser: {}, currentUserId: null});
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
          // this.getUsers();
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
        // this.getUsers();
        this.createMessage("success", "User removed.");
      })
      .catch(err => {
        console.log(err);
        this.createMessage("danger", "Something went wrong.");
      });
  };

  render() {
    return (
      <div>
        <NavBar
          title={this.state.title}
          logoutUser={this.logoutUser}
          isAuthenticated={this.isAuthenticated}
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
                  <Route
                    exact
                    path="/login"
                    render={() => (
                      <LoginForm
                        // eslint-disable-next-line react/jsx-handler-names
                        handleLoginFormSubmit={this.handleLoginFormSubmit}
                        isAuthenticated={this.isAuthenticated}
                      />
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
                      />
                    )}
                  />
                  
                  <Route exact path="/"
                      render = {() => (
                        this.isAuthenticated()  ? <h1><Redirect to="/home" /></h1> : <Redirect to="/login" />
                      )}
                  />
                  <Route exact path="/home" 
                      render = { (props) => (
                        this.isAuthenticated()  ?  <HomePage {...props} state={this.state} /> : <Redirect to="/login" />
                      )} 
                  />

                  <Route exact path="/about" 
                      render = {() => (
                        this.isAuthenticated()  ? <About/> : <Redirect to="/login" />
                      )}
                  />
                    
                  <Route path="/*" render={() => <Redirect to="/login" /> }  />

                </Switch>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default App;
