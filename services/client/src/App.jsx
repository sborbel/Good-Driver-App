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
import HomePage from "./components/HomePage";
import UserStatus from "./components/UserStatus";
import MessageThreads from "./components/MessageThreads";
import EventsTable from "./components/EventsTable";
import AnnouncementForm from "./components/AnnouncementForm";
import DriverStore from "./components/DriverStore";


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
      events: [],
      catalog_items: [],
      catalogs: [],
      affiliations: [],
      current_affiliation: 0,
      isDriver: true
    };
  }

  componentDidMount = () => {
    

    let userstate = localStorage.getItem("userstate");
    let userslist = localStorage.getItem("userslist");
    if (userstate) {
      
      userstate = JSON.parse(userstate);
      this.setState({ currentUser: userstate });
      this.setState({ currentUserId: userstate.id});
      //this.getUserDataById(userstate.id);
    }
    if (userslist) {
      userslist = JSON.parse(userslist);
      this.setState({ users: userslist });
      
    }
    
    
  };

  apiReturnAllUsers = () => {
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/users`;
    let prom = axios
    .get(url)
    return prom;
  }

  apiReturnUser = (id) => {
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/users/${id}`;
    let prom = axios
    .get(url)
    return prom;
  }

  apiCreateNewAffiliation = (user, sponsor, status, points) => {
    let data = {
      user_id: user,
      sponsor_name: sponsor,
      status: status,
      current_points: points
    }
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/affiliations/affiliations`;
    let prom = axios
    .post(url, data)
    return prom;
  }

  apiReturnAllAffiliations = () => {
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/affiliations/affiliations`;
    let prom = axios
    .get(url)
    return prom;
  }

  apiReturnAffiliationsBySponsor = (sponsor) => {
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/affiliations/affiliations/by_sponsor/${sponsor}`;
    let prom = axios
    .get(url)
    return prom;
  }

  apiReturnAffiliationsByUser = (user) => {
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/affiliations/affiliations/by_user/${user}`;
    let prom = axios
    .get(url)
    return prom;
  }

  apiCreateEvent = (desc, points, user, sponsor) => {
    let data = {
      description: desc,
      points: points,
      user_id: user,
      sponsor_name: sponsor
    }
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/events/`;
    let prom = axios
    .post(url, data)
    return prom;
  }

  apiReturnAllEvents = () => {
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/events/`;
    let prom = axios
    .get(url)
    return prom;
  }

  apiReturnAllAuthorizedEventsForUser = (user, caller) => {
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/events/by_user/${user}/by_caller/${caller}`;
    let prom = axios
    .get(url)
    return prom;
  }

  apiCreateNewAnnouncement = (body, sponsor) => {
    let data = {
      content: body,
      sponsor_name: sponsor
    }
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/announcements/`;
    let prom = axios
    .post(url, data)
    return prom;
  }

  apiReturnAllAnnouncements = () => {
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/announcements/`;
    let prom = axios
    .get(url)
    return prom;
  }

  apiGetAnnouncementsBySponsor = (sponsor) => {
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/announcements/by_sponsor/${sponsor}`;
    let prom = axios
    .get(url)
    return prom;
  }

  apiUpdateAnnouncement = (body, sponsor, announcementID) => {
    let data = {
      content: body,
      sponsor_name: sponsor
    }
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/announcements/${announcementID}`;
    let prom = axios
    .put(url, data)
    return prom;
  }

  apiCreateCatalog = (title, supplier, sponsor) => {
    let data = {
      name: title,
      supplier: supplier,
      sponsor_name: sponsor
    }
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/catalogs`;
    let prom = axios
    .post(url, data)
    return prom;
  }

  apiReturnAllCatalogs = () => {
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/catalogs`;
    let prom = axios
    .get(url)
    return prom;
  }

  apiReturnCatalogsBySponsor = (sponsor) => {
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/catalogs/by_sponsor/${sponsor}`;
    let prom = axios
    .get(url)
    return prom;
  }

  apiUpdateCatalog = (title, supplier_name, sponsor, catalog) => {
    let data = {
      name: title,
      supplier: supplier_name,
      sponsor_name: sponsor
    }
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/catalogs/${catalog}`;
    let prom = axios
    .put(url, data)
    return prom;
  }

  apiCreateCatalogItem = (title, desc, img, points, actCost, catalog) => {
    let data = {
      name: title,
      description: desc,
      image_url: img,
      points_cost: points,
      actual_cost: actCost,
      catalog_id: catalog
    }
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/catalog_items`;
    let prom = axios
    .post(url, data)
    return prom;
  }

  apiReturnAllCatalogItems = () => {
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/catalog_items`;
    let prom = axios
    .get(url)
    return prom;
  }

  apiReturnCatalogItemsByCatalog = (catalog) => {
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/catalog_items/by_catalog/${catalog}`;
    let prom = axios
    .get(url)
    return prom;
  }

  apiUpdateCatalogItem = (title, desc, img, points, actCost, catalog, item) => {
    let data = {
      name: title,
      description: desc,
      image_url: img,
      points_cost: points,
      actual_cost: actCost,
      catalog_id: catalog
    }
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/catalog_items/${item}`;
    let prom = axios
    .put(url, data)
    return prom;
  }

  apiGetDetailsForCatalogItem = (item) => {
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/catalog_items/${item}`;
    let prom = axios
    .get(url)
    return prom;
  }

  apiReturnAllSourceVendors = () => {
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/sources`;
    let prom = axios
    .get(url)
    return prom;
  }

  apiSendItemRequest = (sourceVendor, keywordArr) => {
    let data = {
      source: sourceVendor,
      keywords: keywordArr
    }
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/itemreqs`;
    let prom = axios
    .post(url, data)
    return prom;
  }

  apiCreateOrder = (orderStatus, userID, sponsor) => {
    let data = {
      status: orderStatus,
      user_id: userID,
      sponsor_name: sponsor
    }
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/orders`;
    let prom = axios
    .post(url, data)
    return prom;
  }

  apiReturnAllOrders = () => {
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/orders`;
    let prom = axios
    .get(url)
    return prom;
  }

  apiReturnOrdersForUserByCaller = (user, caller) => {
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/orders/by_user/${user}/by_caller/${caller}`;
    let prom = axios
    .get(url)
    return prom;
  }

  apiUpdateOrder = (order, orderStatus, userID, sponsor) => {
    let data = {
      status: orderStatus,
      user_id: userID,
      sponsor_name: sponsor
    }
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/orders/${order}`;
    let prom = axios
    .put(url, data)
    return prom;
  }
  
  apiCreateOrderItem = (order, catalog, catalogItem, itemQuantity, actCost, pCost) => {
    let data = {
      order_id: order,
      catalog_id: catalog,
      catalog_item_id: catalogItem,
      quantity: itemQuantity,
      actual_cost: actCost,
      points_cost: pCost
    }
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/order_items`;
    let prom = axios
    .post(url, data)
    return prom;
  }

  apiReturnAllOrderItemsByOrder = (order) => {
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/order_items/by_order/${order}`;
    let prom = axios
    .get(url)
    return prom;
  }

  apiUpdateOrderItem = (order, catalog, catalogItem, itemQuantity, actCost, pCost) => {
    let data = {
      order_id: order,
      catalog_id: catalog,
      catalog_item_id: catalogItem,
      quantity: itemQuantity,
      actual_cost: actCost,
      points_cost: pCost
    }
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/order_items/${order}`;
    let prom = axios
    .put(url, data)
    return prom;
  }

  apiCreateNewThread = (threadStatus, creator) => {
    let data = {
      status: threadStatus,
      creator_id: creator
    }
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/threads`;
    let prom = axios
    .post(url, data)
    return prom;
  }

  apiReturnAllThreads = () => {
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/threads`;
    let prom = axios
    .get(url)
    return prom;
  }

  apiReturnAllThreadsByUser = (user) => {
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/threads/by_user/${user}`;
    let prom = axios
    .get(url)
    return prom;
  }

  apiReturnThreadDetails = (thread) => {
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/threads/${thread}`;
    let prom = axios
    .get(url)
    return prom;
  }
  
  apiCreateNewMessage = (thread, sender, recp, sub, body) => {
    let data = {
      thread_id: thread,
      sender_id: sender,
      recipient_id: recp,
      subject: sub,
      content: body
    }
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/messages`;
    let prom = axios
    .post(url, data)
    return prom;
  }

  apiReturnAllMessages = () => {
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/messages`;
    let prom = axios
    .get(url)
    return prom;
  }

  apiReturnAllMessagesByThread = (thread) => {
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/messages/by_thread/${thread}`;
    let prom = axios
    .get(url)
    return prom;
  }

  apiReturnAllMessageDetails = (message) => {
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/messages/${message}`;
    let prom = axios
    .get(url)
    return prom;
  }

testAllRoutes = () => {
  let a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, aa, bb, cc, dd, ee, ff, gg, hh, ii, jj, kk, ll, mm
  a = this.apiReturnAllUsers()
  a.then(res => console.log(res)).catch(err => console.log(err))
  b = this.apiReturnUser(5)
  b.then(res => console.log(res)).catch(err => console.log(err))
  c = this.apiCreateNewAffiliation(7, "Great Big Freight", "active",  200)
  c.then(res => console.log(res)).catch(err => console.log(err))
  d = this.apiReturnAllAffiliations()
  d.then(res => console.log(res)).catch(err => console.log(err))
  e = this.apiReturnAffiliationsBySponsor("Great Big Freight")
  e.then(res => console.log(res)).catch(err => console.log(err))
  f = this.apiReturnAffiliationsByUser(7)
  f.then(res => console.log(res)).catch(err => console.log(err))
  g = this.apiCreateEvent("Great driving", 50, 7, "Great Big Freight")
  g.then(res => console.log(res)).catch(err => console.log(err))
  h = this.apiReturnAllEvents()
  h.then(res => console.log(res)).catch(err => console.log(err))
  i = this.apiReturnAllAuthorizedEventsForUser(7, 5)
  i.then(res => console.log(res)).catch(err => console.log(err))
  j = this.apiCreateNewAnnouncement("New Announcement", "Great Big Freight")
  j.then(res => console.log(res)).catch(err => console.log(err))
  k = this.apiReturnAllAnnouncements()
  k.then(res => console.log(res)).catch(err => console.log(err))
  l = this.apiGetAnnouncementsBySponsor("Great Big Freight")
  l.then(res => console.log(res)).catch(err => console.log(err))
  m = this.apiUpdateAnnouncement("New Body", "Great Big Freight", 2)
  m.then(res => console.log(res)).catch(err => console.log(err))
  n = this.apiCreateCatalog("New Catalog", "ebay", "Great Big Freight")
  n.then(res => console.log(res)).catch(err => console.log(err))//
  o = this.apiReturnAllCatalogs()
  o.then(res => console.log(res)).catch(err => console.log(err))
  p = this.apiReturnCatalogsBySponsor("Great Big Freight")
  p.then(res => console.log(res)).catch(err => console.log(err))
  q = this.apiUpdateCatalog("New Title", "ebay", "Great Big Freight", 1)
  q.then(res => console.log(res)).catch(err => console.log(err))
  r = this.apiCreateCatalogItem("Dog", "Newest", "https://i.insider.com/5df126b679d7570ad2044f3e?width=1100&format=jpeg&auto=webp", 20, 100, 1)
  r.then(res => console.log(res)).catch(err => console.log(err))
  s = this.apiReturnAllCatalogItems()
  s.then(res => console.log(res)).catch(err => console.log(err))
  t = this.apiReturnCatalogItemsByCatalog(1)
  t.then(res => console.log(res)).catch(err => console.log(err))
  u = this.apiUpdateCatalogItem("Dog", "Bestest", "https://i.insider.com/5df126b679d7570ad2044f3e?width=1100&format=jpeg&auto=webp", 20, 100, 1)
  u.then(res => console.log(res)).catch(err => console.log(err))//
  v = this.apiGetDetailsForCatalogItem(4)
  v.then(res => console.log(res)).catch(err => console.log(err))
  w = this.apiReturnAllSourceVendors()
  w.then(res => console.log(res)).catch(err => console.log(err))
  x = this.apiSendItemRequest("ebay", ["Pencils"])
  x.then(res => console.log(res)).catch(err => console.log(err))
  y = this.apiCreateOrder("active", 7, "Great Big Freight")
  y.then(res => console.log(res)).catch(err => console.log(err))
  z = this.apiReturnAllOrders()
  z.then(res => console.log(res)).catch(err => console.log(err))
  aa = this.apiReturnOrdersForUserByCaller(7, 5)
  aa.then(res => console.log(res)).catch(err => console.log(err))
  bb = this.apiUpdateOrder(1, "missing", 6, "Yellow Freight")
  bb.then(res => console.log(res)).catch(err => console.log(err))
  cc = this.apiCreateOrderItem(2, 1, 1, 1, 20, 10)
  cc.then(res => console.log(res)).catch(err => console.log(err))
  dd = this.apiReturnAllOrderItemsByOrder(2)
  dd.then(res => console.log(res)).catch(err => console.log(err))
  ee = this.apiUpdateOrderItem(2, 1, 1, 1, 20, 15)
  ee.then(res => console.log(res)).catch(err => console.log(err))
  ff = this.apiCreateNewThread("active", 7)
  ff.then(res => console.log(res)).catch(err => console.log(err))
  gg = this.apiReturnAllThreads()
  gg.then(res => console.log(res)).catch(err => console.log(err))
  hh = this.apiReturnAllThreadsByUser(7)
  hh.then(res => console.log(res)).catch(err => console.log(err))
  ii = this.apiReturnThreadDetails(2)
  ii.then(res => console.log(res)).catch(err => console.log(err))
  jj = this.apiCreateNewMessage(2, 6, 5, "Sub", "Test")
  jj.then(res => console.log(res)).catch(err => console.log(err))
  kk = this.apiReturnAllMessages().catch(err => console.log(err))
  kk.then(res => console.log(res)).catch(err => console.log(err))
  ll = this.apiReturnAllMessagesByThread(2)
  ll.then(res => console.log(res)).catch(err => console.log(err))
  mm = this.apiReturnAllMessageDetails(4)
  mm.then(res => console.log(res)).catch(err => console.log(err))

}





  getCatalogueItems = (id) => {
    ////console.log("Here");
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/catalog_items/by_catalog/${id}`;
    axios
      .get(url)
      .then(res => {
        this.setState({catalog_items: res.data});
        ////console.log("Items: ", this.state.catalog_items);
      })
      .catch(err => {
        ////console.log(err);
        this.createMessage("danger", `Cannot get items for catalog ${id}`);
      });
  };
  
  

  getcatalogs = () => {

    let prom = this.apiReturnCatalogsBySponsor(this.state.affiliations[this.state.current_affiliation].sponsor_name);
    prom.then(res => {
      this.setState({catalogs: res.data});
      console.log("Catalogs: ", this.state.catalogs)
      this.getCatalogueItems(res.data[0].id);
    }).catch(err => {
      ////console.log(err);
      this.createMessage("danger", `Cannot get catalogs for sponsor ${this.state.affiliations[this.state.current_affiliation].sponsor_name}`);
    });
    
  };
  
  setCurrentAffiliation = (aff) => {
    this.setState({current_affiliation: aff});

  }

  setCurrentRole = (newRole) => {
    let newUser = this.state.currentUser;
    newUser.role = newRole;
    this.setState({currentUser: newUser})
  }

  
  editUser = (data, id) => {
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/users/${id}`;
    axios
      .put(url, data)
      .then(res => {
        this.createMessage("success", "User updated.");
        this.getUserDataById(this.state.currentUser.id);
      })
      .catch(err => {
        ////console.log(err);
        this.createMessage("danger", `${id}`);
      });
  };
  
  getThreads = (id) => {

    //////console.log(this.props.state.users);
    ////console.log(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/threads/by_user/${id}`);
    let promises = [];
    let newThreads = [];
    let prom = this.apiReturnAllThreadsByUser(id);
    prom.then(res => {
      for(let idx in res.data){
        promises.push(this.apiReturnAllMessagesByThread(res.data[idx].id).then(mess => {
          let recpID = 0;
          let senderID = 0;
          let recverID = 0;
          //console.log(myThreads[i]);
          
          let recpNAME = "";
          ////console.log("Set threads", res1);

          if(mess.data.length > 0){

            senderID = mess.data[0].sender_id;

            recverID = mess.data[0].recipient_id;
            if (senderID === this.state.currentUser.id) {
              recpID = recverID;
            }
            if (recverID === this.state.currentUser.id) {
              recpID = senderID;
            }
            for(let idx in this.state.users){
              console.log(`${idx}: ${this.state.users[idx].id}, ${recpID}`)
              if(this.state.users[idx].id === recpID){
                recpNAME = this.state.users[idx].username;
              }
            }
            
            let newThread = ({ 
              id: res.data[idx].id, 
              status: res.data[idx].status, 
              creator_id: res.data[idx].creator_id, 
              created_date: res.data[idx].created_date,
              recpID: recpID,
              recpName: recpNAME
            });

            ////console.log(newThread);
            ////console.log(newThread);
            if(recpNAME !== ""){
              newThreads.push(newThread);
            }
          }
        }))

      }
      Promise.all(promises).then(responses => {
        this.setState({threads: newThreads});
        console.log(this.state.threads);
      });
    })
  }
    /*
    axios
        .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/threads/by_user/${id}`)
        .then(res => {
            //////console.log(" res  : ", res.data[0].status);
            
            //this.setState({threads: res.data});
                
            
            ////console.log("this.state.threads: ", this.state.threads);
            ////console.log("getThreads.res: ", res);

            // ////console.log(this.state.threads);
            return res;
          })
          .then(res =>  {
            let a = res.data;
            this.setState({threads: this.finishThreads(a)});
            //console.log(this.state.threads)
          })

          
          .catch(err => {
              ////console.log("Error in outer", err);
          })
          */
        

  finishThreads = (myThreads) => {
    

    //console.log(myThreads);

    
    let newThreads = [];
    let item;

    for (let i = 0; i < myThreads.length; i++) {

      ////console.log("myThreads.length: ", myThreads.length);
      ////console.log("this index: ", myThreads);
      item = myThreads[i];
      //console.log(item);

      
      axios
        .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/messages/by_thread/${myThreads[i].id}`)
        .then(res1 => {
          let recpID = 0;
          let senderID = 0;
          let recverID = 0;
          //console.log(myThreads[i]);
          
          let recpNAME = "";
          ////console.log("Set threads", res1);

          if(res1.data.length > 0){

          senderID = res1.data[0].sender_id;

          recverID = res1.data[0].recipient_id;
          if (senderID === this.state.currentUser.id) {
            recpID = recverID;
          }
          if (recverID === this.state.currentUser.id) {
            recpID = senderID;
          }

          for(let i = 0; i < this.state.users.length; i++){
            if(this.state.users[i].id === recpID){
              recpNAME = this.state.users[i].username;
            }
          }
          
          let newThread = ({ 
            id: myThreads[i].id, 
            status: myThreads[i].status, 
            creator_id: myThreads[i].creator_id, 
            created_date: myThreads[i].created_date,
            recpID: recpID,
            recpName: recpNAME
          });

          ////console.log(newThread);
          newThread.newVal = "myVal";
          ////console.log(newThread);
          
          newThreads.push(newThread);
          //console.log({sendID: senderID, recvID: recverID, CUID: this.state.currentUser.id, recp: recpID, newTh: newThread})
          ////console.log("New threads: ", newThreads);
          //this.setState({ threads: newThreads });
          //////console.log("Threads by user: ", myThreads);
        }

        })
        .catch(err => {
          ////console.log("Error in /api/messages/by", err);
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
    ////console.log(data);
    ////console.log(recpID);
    
    axios
        .post(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/threads`, data)
        .then(res => {
            ////console.log(" res  : ", res);
            this.sendFirstMessage(res.data.id, recpID);
          })
          
          .catch(err => {
              ////console.log("Error in outer", err);
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
    ////console.log(data);
    ////console.log("ThreadID: ", threadID);
    ////console.log("recpID: ", recpID);

    
    axios
        .post(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/messages`, data)
        .then(res => {
            
          })
          
          .catch(err => {
              ////console.log("Error in outer", err);
          })
  }

getName = (id) => {
  axios
    .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/users/${id}`)
    .then(res => {
        
        
    })
    .catch(err => {
        ////console.log(err);
    });
}

  
  

  getPointsbyID = (id) => {
    let eventPoints = 0;
    
      for(let idx in this.state.events){
        const item = this.state.events[idx];
        if(item.sponsor_name === this.state.currentUser.sponsor_name){
          eventPoints += item.points;
        }
      }
      console.log(eventPoints)
      this.setState({points: eventPoints});
   
  };

  getAffiliations = () => {
    axios
    .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/affiliations/affiliations/by_user/${this.state.currentUser.id}`)
    .then(res => {
      
      this.setState({ affiliations: res.data });
      //console.log("Affiliations: ", this.state.affiliations)
      ////console.log("Users by Sponsor Name: ", this.state.users);
      //this.getEventsBySponsor();
    })
    .catch(err => {
      //console.log(err);
    });
  };
  
  getUsersAndEventsBySponsorName = () => {
    this.setState({events: []});
    let fullUsers = [];
    let promises = [];
    let events = [];
    let aff = [];
    console.log(this.state.affiliations[this.state.current_affiliation].sponsor_name);
    let prom = this.apiReturnAffiliationsBySponsor(this.state.affiliations[this.state.current_affiliation].sponsor_name);
    let aProm = prom.then(affs => {
      aff = affs.data;

      for(let idx in aff){
        promises.push(this.apiReturnUser(aff[idx].user_id).then(user => {
            user.data.sponsor_name = this.state.affiliations[this.state.current_affiliation].sponsor_name;
            fullUsers.push(user.data);
        }));
      }
      return Promise.all(promises).then(responses => {
        /*
        if(this.state.currentUser.role !== "driver"){
          for(let idx in fullUsers){
            this.apiReturnAllAuthorizedEventsForUser(fullUsers[idx].id, this.state.currentUser.id).then(even => {
              for(let idx in even.data){
                events.push(even.data[idx]);
              }
              this.setState({events: events});
            });
          }
          
        }*/
        this.setState({users: fullUsers});
        console.log(this.state.users);
      });
    });
    return aProm;
  }
    
  

  getAllEvents = () => {
    let prom = this.apiReturnAllEvents();
    prom.then(res => {
      // console.log("Events: ", res.data);
      this.setState({events: res.data});
    })
    .catch(err => {
    });
    return prom;
  }
  
  getAuthorizedData = () => {
    
    if (this.state.currentUser.role === "admin"){
      this.setState({isDriver: false});
      let prom = this.apiReturnAllUsers();
      let finalProm = prom.then(res => {
        this.setState({users: res.data});
        return this.getAllEvents();
      })
      return finalProm;
    }
    else if (this.state.currentUser.role === "sponsor_mgr"){
        this.setState({isDriver: false});
      
        let prom = this.getUsersAndEventsBySponsorName();
        let finalProm = prom.then(res => {
          console.log(this.state.events)
          console.log(this.state.users)
          this.getThreads(this.state.currentUser.id);
          return this.getEventsBySponsor();
        });

        return finalProm;
        
   
    }
    else {
      // Only get personal data - no other users
      //console.log("Affiliations: ", this.state.affiliations);
      this.setState({events: []});
      let prom = this.getUsersAndEventsBySponsorName();
      let finalProm = prom.then(res => {
        console.log(this.state.events)
        console.log(this.state.users)
        let evenProm = this.getEventsByUser(this.state.currentUser.id);
        evenProm.then(res => {
          let sortedEvents = [];
          for(let idx in res.data){
            if(res.data[idx].sponsor_name === this.state.currentUser.sponsor_name){
              sortedEvents.push(res.data[idx]);
            }
          }
          this.setState({events: sortedEvents})
          this.getPointsbyID(this.state.currentUser.id);
          this.getThreads(this.state.currentUser.id);
        })
        
      });
      return finalProm;
    }
  };
  testFunc = () => {
    let p = axios
    .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/users/5`)
    
    return p;
  }

  getUserDataById = (id) => {
    this.setState({events: []});

    let userProm = this.apiReturnUser(id);
      userProm.then(res => {
        let affProm = this.apiReturnAffiliationsByUser(id);
          affProm.then(affs => {
            let newUser = res.data;
            newUser.sponsor_name = affs.data[this.state.current_affiliation].sponsor_name;
            this.setState({currentUser: newUser});
            this.setState({affiliations: affs.data})
            let prom = this.getAuthorizedData();
            prom.then(res => {
              if(this.state.currentUser.role === "driver" || this.state.currentUser.role === "sponsor_mgr"){
                this.setannouncement();
                this.getcatalogs();
              }
            })
          })
          window.localStorage.setItem("userstate", JSON.stringify(res.data));
      })
  };

  getEventsByUser = (uid) => {
    this.setState({events: []});

    let prom = this.apiReturnAllAuthorizedEventsForUser(uid, uid);
    return prom;
    
    
  }

  getEventsBySponsor = () => {
    this.setState({events: []});
    let url = ``;
    let i = 0;
    let promises = [];
    for(i = 0; i < this.state.users.length; i++){
      promises.push(this.apiReturnAllAuthorizedEventsForUser(this.state.users[i].id, this.state.currentUser.id).then(res => {
        let j = 0;
        for(j = 0; j < res.data.length; j++){
          this.setState({events: [...this.state.events, res.data[j]]})
        }
      }));
    }
    return Promise.all(promises).then(responses => {
      console.log(this.state.events);
    });
    ////console.log(this.state.events);
  }
  
  returnEventsByUser = (uid) => {
    axios
    .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/events/by_user/${uid}`)
    .then(res => {
      ////console.log("Events: ", res.data);
      return res.data;
    })
    .catch(err => {
      ////console.log(err);
    });
  }

  createNewEvent = (data) => {
    axios
    .post(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/events/`, data)
    .then(res => {
      ////console.log("Event created: ", res);
    })
    .catch(err => {
      ////console.log(err);
    });
  }
  

  addUser = data => {
    axios
      .post(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/users`, data)
      .then(res => {
        this.setState({ username: "", email: "" });
        this.handleCloseModal();
        this.createMessage("success", "User added.");
      })
      .catch(err => {
        ////console.log(err);
        this.handleCloseModal();
        this.createMessage("danger", "That user already exists.");
      });
  };

  handleRegisterFormSubmit = data => {
    const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/register`;
    axios
      .post(url, data)
      .then(res => {
        ////console.log(res.data);
        this.createMessage("success", "You have registered successfully.");
      })
      .catch(err => {
        ////console.log(err);
        this.createMessage("danger", "That user already exists.");
      });
  };

  handleLoginFormSubmit = data => {

    const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/login`;
    axios
    .post(url, data)
    .then(res => {
      //this.testAllRoutes();
      let p = this.testFunc();
      p.then(res => {
        //console.log(p, res);
      })

      //console.log("Login processing for: ", res.data);
      this.getUserDataById(res.data.user_id); //Current User, all users, events for sponsor and admin, and announcement for driver and sponsor
      this.setState({ accessToken: res.data.access_token, 
                      currentUserId: res.data.user_id }); 

       //Gets all threads a user is apart of
      window.localStorage.setItem("refreshToken", res.data.refresh_token);
      this.createMessage("success", "You have logged in successfully.");
    })


    .catch(err => {
      ////console.log(err);
      this.createMessage("danger", "Incorrect email and/or password.");
    });
  };

 
  setannouncement = () => {
    
    //console.log("Here");
    //console.log(this.state);
    ////console.log(this.state.affiliations[this.state.current_affiliation].sponsor_name);
    
    let prom = this.apiGetAnnouncementsBySponsor(this.state.affiliations[this.state.current_affiliation].sponsor_name);
    prom.then(res => {
      this.setState({
        announcement: res.data[0] || ""
      });
      console.log("Announcement: ", this.state.announcement);
    }).catch(err => {
      this.setState({
        announcement: "noSponsor"
      });
    });
  };

  editAnnouncement = (data) => {
    let url = `${process.env.REACT_APP_USERS_SERVICE_URL}/api/announcements/${this.state.announcement.id}`;
    
    axios
      .put(url, data)
      .then(res => {
        this.setannouncement();
      })
      .catch(err => {
        ////console.log("Error: ", err);
        this.createMessage("error", "Announcement could not be edited. Please try again.");
      });
  }

  logoutUser = () => {
    window.localStorage.removeItem("refreshToken");
    window.localStorage.removeItem("userstate");
    window.localStorage.removeItem("userslist");
    this.setState({ accessToken: null, users: [], currentUser: {}, currentUserId: null, threads: [], isDriver: true});
    this.createMessage("success", "You have logged out.");
  };

  isAuthenticated = () => {
    if (this.state.accessToken) {
      return true;
    } else if(this.validRefresh()){
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
          this.setState({ accessToken: res.data.access_token});
          this.getUserDataById(this.state.currentUser.id);
          window.localStorage.setItem("refreshToken", res.data.refresh_token);
          if(this.state.currentUser === "driver" || this.state.currentUser === "sponsor_mgr"){
            this.setannouncement();
          }
          return true;
        })
        .catch(err => {
          ////console.log("Refresh error", err)
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

  removeUser = (user_id) => {
    axios
      .delete(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/users/${user_id}`)
      .then(res => {
        // this.getUsers();
        this.createMessage("success", "User removed.");
      })
      .catch(err => {
        ////console.log(err);
        this.createMessage("danger", "Something went wrong.");
      });
  };

  render() {
    return (
      <div>
        <NavBar
          state={this.state}
          title={this.state.title}
          role = {this.state.currentUser.role}
          logoutUser={this.logoutUser}
          isAuthenticated={this.isAuthenticated}
          getUserDataById={this.getUserDataById}
          setCurrentAffiliation={this.setCurrentAffiliation}
          setCurrentRole={this.setCurrentRole}
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
            <div > {/* <div className="columns">*/}
              <div > {/* <div className="column is-half">*/}
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
                        this.isAuthenticated()  ?  <HomePage {...props} state={this.state}/> : <Redirect to="/login" />
                      )} 
                  />

                  <Route exact path="/about" 
                      render = {() => (
                        this.isAuthenticated()  ? <About/> : <Redirect to="/login" />
                      )}
                  />
                  <Route exact path="/messenger" 
                      render = {(props) => (
                        this.isAuthenticated()  ? <MessageThreads {...props} state={this.state} createNewThread={this.createNewThread} isAuthenticated={this.isAuthenticated} getThreads={this.getThreads} getUserDataByID={this.getUserDataById} currentUser={this.state.currentUser}/> : <Redirect to="/login" />
                      )}
                  />
                  <Route exact path="/userlist" 
                      render = {(props) => (
                        this.isAuthenticated()  ? <UsersList {...props} state={this.state} isAuthenticated={this.isAuthenticated} removeUser={this.removeUser}/> : <Redirect to="/login" />
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
                  <Route exact path="/driverstore" 
                      render = {(props) => (
                        this.isAuthenticated()  ? <DriverStore {...props} state={this.state} isAuthenticated={this.isAuthenticated} createNewEvent={this.createNewEvent} getUserDataByID={this.getUserDataById} getEventsBySponsor={this.getEventsBySponsor} /> : <Redirect to="/login" />
                      )}
                  />

                  <Route exact path="/announcementform" 
                      render = {(props) => (
                        this.isAuthenticated() && (this.state.currentUser.role !== "driver") ? <AnnouncementForm {...props} state={this.state} isAuthenticated={this.isAuthenticated} editAnnouncement={this.editAnnouncement} /> : <Redirect to="/login" />
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
