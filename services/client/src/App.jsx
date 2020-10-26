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
import EventsTable from "./components/EventsTable";
import AnnouncementForm from "./components/AnnouncementForm";

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
      announcement: {},
      messages: [],
      threads: [],
      events: []
    };
  }

  componentDidMount = () => {

    let userstate = localStorage.getItem("userstate");
    let userslist = localStorage.getItem("userslist");
    if (userstate) {
      userstate = JSON.parse(userstate);
      this.setState({ currentUser: userstate });
      this.setState({ currentUserId: userstate.id});
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
      console.log(eventPoints);
      this.setState({points: eventPoints});
    })
    .catch(err => {
      console.log(err);
    });
  }
  
  getUsersBySponsorName = () => {

    axios
    .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users/by_sponsor/${this.state.currentUser.sponsor_name}`)
    .then(res => {
      this.setState({ users: res.data });
      console.log("Users by Sponsor Name: ", this.state.users);
      window.localStorage.setItem("userslist", JSON.stringify(res.data));
      this.getEventsBySponsor();
    })
    .catch(err => {
      console.log(err);
    });
  };

  getAllEvents = () => {
    axios
    .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/events`)
    .then(res => {
      console.log("Events: ", res.data);
      this.setState({events: res.data});
    })
    .catch(err => {
      console.log(err);
    });
  }
  
  getAuthorizedData = () => {
    if (this.state.currentUser.role === "admin"){
      this.getUsers();
      this.getAllEvents();
    }else if (this.state.currentUser.role === "sponsor_mgr"){
      this.getUsersBySponsorName(this.state.currentUser.sponsor_name);
      this.getEventsBySponsor();
    }else {
      // Only get personal data - no other users
      this.getUsersBySponsorName(this.state.currentUser.sponsor_name);
      this.getEventsByUser(this.state.currentUser.id);
      this.getPointsbyID(this.state.currentUser.id);
    }
  };

  getUserDataById = (id) => {
    axios
      .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users/${id}`)
      .then(res => {
        console.log("This user: ", res.data);
        this.setState({ currentUser: res.data });
        this.getAuthorizedData();
        if(this.state.currentUser.role === "driver" || this.state.currentUser.role === "sponsor_mgr"){
          this.setannouncement();
        }
        window.localStorage.setItem("userstate", JSON.stringify(res.data));
      })
      .catch(err => {
        console.log(err);
      });
  };

  getEventsByUser = (uid) => {
    
    axios
    .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/events/by_user/${uid}`)
    .then(res => {
      console.log("Events: ", res.data);
      this.setState({events: res.data});
    })
    .catch(err => {
      console.log(err);
    });
    
  }

  getEventsBySponsor = () => {
    this.setState({events: []});
    let url = ``;
    let i = 0;
    console.log(this.state.users);
    for(i = 0; i < this.state.users.length; i++){
      url = `${process.env.REACT_APP_USERS_SERVICE_URL}/events/by_user/${this.state.users[i].id}`
      console.log(url);
      axios
      .get(url)
      .then(res => {
        let j = 0;
        for(j = 0; j < res.data.length; j++){
          this.setState({events: [...this.state.events, res.data[j]]})
        }
        
        console.log(this.state.events);
      })
      .catch(err => {
        console.log(err);
      });
    }
    console.log(this.state.events);
  }
  
  returnEventsByUser = (uid) => {
    axios
    .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/events/by_user/${uid}`)
    .then(res => {
      console.log("Events: ", res.data);
      return res.data;
    })
    .catch(err => {
      console.log(err);
    });
  }

  createNewEvent = (data) => {
    axios
    .post(`${process.env.REACT_APP_USERS_SERVICE_URL}/events/`, data)
    .then(res => {
      console.log("Event created: ", res);
    })
    .catch(err => {
      console.log(err);
    });
  }
  

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
      this.getUserDataById(res.data.user_id); //Current User, all users, events for sponsor and admin, and announcement for driver and sponsor
      this.setState({ accessToken: res.data.access_token, 
                      currentUserId: res.data.user_id }); 

      this.getThreads(res.data.user_id); //Gets all threads a user is apart of
      window.localStorage.setItem("refreshToken", res.data.refresh_token);
      this.createMessage("success", "You have logged in successfully.");
    })
    .catch(err => {
      console.log(err);
      this.createMessage("danger", "Incorrect email and/or password.");
    });
  };

 
  setannouncement = () => {
    
    
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/announcements/by_sponsor/${this.state.currentUser.sponsor_name}`;
    
    axios
      .get(url)
      .then(res => {
        this.setState({
          announcement: res.data[0]
        });
      })
      .catch(err => {
        console.log("Error: ", err);
        this.setState({
          announcement: "noSponsor"
        });
      });
  };

  editAnnouncement = (data) => {
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/announcements/${this.state.announcement.id}`;
    
    axios
      .put(url, data)
      .then(res => {
        this.setannouncement();
      })
      .catch(err => {
        console.log("Error: ", err);
        this.createMessage("error", "Announcement could not be edited. Please try again.");
      });
  }

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
          console.log(this.state);
          this.getUserDataByID(this.state.currentUser.id);
          window.localStorage.setItem("refreshToken", res.data.refresh_token);
          if(this.state.currentUser === "driver" || this.state.currentUser === "sponsor_mgr"){
            this.setannouncement();
            console.log(this.state);
          }
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
                        this.isAuthenticated()  ?  <HomePage {...props} state={this.state} getEventsByUser={this.getEventsByUser}/> : <Redirect to="/login" />
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

                  <Route exact path="/eventstable" 
                      render = {(props) => (
                        this.isAuthenticated()  ? <EventsTable {...props} state={this.state} isAuthenticated={this.isAuthenticated} createNewEvent={this.createNewEvent} getEventsByUser={this.getEventsByUser} getUserDataByID={this.getUserDataById} getEventsBySponsor={this.getEventsBySponsor} /> : <Redirect to="/login" />
                      )}
                  />

                  <Route exact path="/announcementform" 
                      render = {(props) => (
                        this.isAuthenticated() && (this.state.currentUser.role != "driver") ? <AnnouncementForm {...props} state={this.state} isAuthenticated={this.isAuthenticated} editAnnouncement={this.editAnnouncement} /> : <Redirect to="/login" />
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
