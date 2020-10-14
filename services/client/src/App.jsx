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
import UserStatus from "./components/UserStatus";
import Messenger from "./components/Messenger";
import MessageThreads from "./components/MessageThreads";
import MessageList from "./components/MessageList";
import { date, object } from "yup";

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
      points: 0,
      currentUserId: "",
      title: "Good Driver App",
      accessToken: null,
      messageType: null,
      messageText: null,
      showModal: false,
      announcementTitle: "",
      messages: [],
      threads: []
    };
  }

  componentDidMount = () => {

    let userstate = localStorage.getItem("userstate");
    let userslist = localStorage.getItem("userslist");
    if (userstate) {
      userstate = JSON.parse(userstate);
      this.setState({ currentUser: userstate });
      this.setState({ currentUserId: userstate.id})
    }
    if (userslist) {
      userslist = JSON.parse(userslist);
      this.setState({ users: userslist });
    }
    
  };

  
  editUser = (data, id) => {
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/users/${id}`;
    axios
      .put(url, data)
      .then(res => {
        this.createMessage("success", "User updated.");
        this.getAuthorizedData();
      })
      .catch(err => {
        console.log(err);
        this.createMessage("danger", `${id}`);
      });
  };
  
  getThreads = (id) => {
    let id1 = 0;
    let id2 = 0;
    let recpID = "";
    let theRecpName = "";
    let newThreads = [];
    //console.log(this.props.state.users);
    console.log(`${process.env.REACT_APP_USERS_SERVICE_URL}/threads/by_user/${id}`);
    
    axios
        .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/threads/by_user/${id}`)
        .then(res => {
            //console.log(" res  : ", res.data[0].status);
            
            //this.setState({threads: res.data});
                
            
            //console.log(this.state.threads);
            let a = res.data;
            this.setState({threads: this.finishThreads(a)});
            console.log(this.state.threads);
          })
          
          .catch(err => {
              console.log("Error in outer", err);
          })
          
        }

  finishThreads = (myThreads) => {
    

    console.log(myThreads);

    
    let newThreads = [];
    let item = myThreads[0];

    for (let i = 0; i < myThreads.length; i++) {

      console.log("this index: ", myThreads);

      
      axios
        .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/messages/by_thread/${myThreads[i].id}`)
        .then(res1 => {
          let recpID = "";
          let senderID = 0;
          let recverID = 0;
          item = myThreads[i];
          console.log("Set threads", res1);

          senderID = res1.data[0].sender_id;

          recverID = res1.data[0].recipient_id;
          if (senderID === this.state.currentUser.id) {
            recpID = recverID;
          }
          if (recverID === this.state.currentUser.id) {
            recpID = senderID;
          }
          
          let newThread = ({ 
            id: item.id, 
            status: item.status, 
            creator_id: item.creator_id, 
            created_date: item.created_date,
            recpID: recpID
          });

          console.log(newThread);
          newThread.newVal = "myVal";
          console.log(newThread);
          
          newThreads.push(newThread);
          console.log("New threads: ", newThreads);
          //this.setState({ threads: newThreads });
          //console.log("Threads by user: ", myThreads);

        })
        .catch(err => {
          console.log("Error in /messages/by", err);
        })

      
    }
    //this.state.threads = newThreads;
    //console.log(newThreads);
    //console.log(this.state.threads);
    return newThreads;
    
  }
  
  createNewThread = (recpID) => {
    let data = {
      status: "active",
      creator_id: this.state.currentUser.id
    }
    console.log(data);
    console.log(recpID);
    
    axios
        .post(`${process.env.REACT_APP_USERS_SERVICE_URL}/threads`, data)
        .then(res => {
            console.log(" res  : ", res);
            this.sendFirstMessage(res.data.id, recpID);
          })
          
          .catch(err => {
              console.log("Error in outer", err);
          })
  }

  sendFirstMessage = (threadID, recpID) => {
    let data = {
      thread_id: threadID,
      sender_id: this.state.currentUser.id,
      recipient_id: parseInt(recpID.recpID, 10),
      subject: "create thread",
      content: "Hi, I'd like to start a chat.",
    }
    console.log(data);
    
    axios
        .post(`${process.env.REACT_APP_USERS_SERVICE_URL}/messages`, data)
        .then(res => {
            
          })
          
          .catch(err => {
              console.log("Error in outer", err);
          })
  }

getName = (id) => {
  axios
    .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users/${id}`)
    .then(res => {
        
        
    })
    .catch(err => {
        console.log(err);
    });
}

  
  getUsers = () => {
    axios
    .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`)
    .then(res => {
      console.log("All Users: ", res.data);
      this.setState({ users: res.data });
      window.localStorage.setItem("userslist", JSON.stringify(res.data));
      return res.data;
    })
    .catch(err => {
      console.log(err);
    });
  };

  getPointsbyID = (id) => {
    let events = [];
    let eventPoints = 0;
    axios
    .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/events/by_user/${this.state.currentUserId}`)
    .then(res => {
      events = res.data;
      console.log("events by User ID: ", res.data);
      //window.localStorage.setItem("eventlist", JSON.stringify(res.data));
      for(let idx in events){
        const item = events[idx];
        eventPoints += item.points;
      }
      this.setState({points: eventPoints});
    })
    .catch(err => {
      console.log(err);
    });
  }
  
  getUsersBySponsorName = (sponsor_name) => {

    axios
    .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users/by_sponsor/${this.state.currentUser.sponsor_name}`)
    .then(res => {
      this.setState({ users: res.data });
      console.log("Users by Sponsor Name: ", res.data);
      window.localStorage.setItem("userslist", JSON.stringify(res.data));
    })
    .catch(err => {
      console.log(err);
    });
  };
  
  getAuthorizedData = () => {
    if (this.state.currentUser.role === "admin"){
      this.getUsers();
    }else if (this.state.currentUser.role === "sponsor_mgr"){
      this.getUsersBySponsorName(this.state.currentUser.sponsor_name);
    }else {
      // Only get personal data - no other users
      this.getUsersBySponsorName(this.state.currentUser.sponsor_name);
    }
  };

  getUserDataById = (id) => {
    axios
      .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users/${id}`)
      .then(res => {
        console.log("This user: ", res.data);
        this.setState({ currentUser: res.data });
        this.getAuthorizedData();

        this.setannouncement();
        window.localStorage.setItem("userstate", JSON.stringify(res.data));
      })
      .catch(err => {
        console.log(err);
      });
  };

  

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
      this.getUserDataById(res.data.user_id);
      this.setState({ accessToken: res.data.access_token, 
                      currentUserId: res.data.user_id });

      this.getThreads(res.data.user_id);
      window.localStorage.setItem("refreshToken", res.data.refresh_token);
      this.getPointsbyID(res.data.user_id);
      this.createMessage("success", "You have logged in successfully.");
    })
    .catch(err => {
      console.log(err);
      this.createMessage("danger", "Incorrect email and/or password.");
    });
  };

 
  setannouncement = () => {
    let sponsor = 0;
    if(this.state.currentUser.sponsor_name === "Yellow Freight"){
      sponsor = 1;
    }
    if(this.state.currentUser.sponsor_name === "Great Big Freight"){
      sponsor = 2;
    }
    console.log(this.state.currentUser);
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/announcements/by_sponsor/${sponsor}`;
    
    axios
      .get(url)
      .then(res => {
        console.log(res.data[0].content);
        this.setState({
          announcementTitle: res.data[0].content
        });
      })
      .catch(err => {
        this.setState({
          announcementTitle: "noSponsor"
        });
      });
  };
  logoutUser = () => {
    window.localStorage.removeItem("refreshToken");
    window.localStorage.removeItem("userstate");
    window.localStorage.removeItem("userslist");
    this.setState({ accessToken: null, users: [], currentUser: {}, currentUserId: null, threads: []});
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
          role = {this.state.currentUser.role}
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
                  <Route exact path="/messenger" 
                      render = {(props) => (
                        this.isAuthenticated()  ? <MessageThreads {...props} state={this.state} createNewThread={this.createNewThread} isAuthenticated={this.isAuthenticated} getThreads={this.getThreads} currentUser={this.state.currentUser}/> : <Redirect to="/login" />
                      )}
                  />
                  <Route exact path="/userlist" 
                      render = {(props) => (
                        this.isAuthenticated()  ? <UsersList {...props} state={this.state} isAuthenticated={this.isAuthenticated}/> : <Redirect to="/login" />
                      )}
                  />

                  <Route exact path="/userstatus" 
                      render = {(props) => (
                        this.isAuthenticated()  ? <UserStatus {...props} state={this.state} isAuthenticated={this.isAuthenticated} getUserDataById={this.getUserDataById} editUser={this.editUser} getAuthorizedData={this.getAuthorizedData}/> : <Redirect to="/login" />
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
