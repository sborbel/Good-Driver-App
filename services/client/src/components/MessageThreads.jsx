
import React, {Component, ReactDOM} from 'react';
import axios from "axios";
import MessageList from "./MessageList";
import MessageForm from './MessageForm'
import PropTypes, { number } from "prop-types";
import Modal from "react-modal";
import Messenger from './Messenger'
import { Redirect} from "react-router-dom";

Modal.setAppElement(document.getElementById("root"));


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

function MessageThreads(props) {
      const [modalIsOpen,setIsOpen] = React.useState(false);
      const [userArr,setArr] = React.useState([]);
      let threads = [];
      let theRecpName = "";

      let newThreads = []; //placeholder for threads
      getThreads();
      
      function getThreads() {
            axios
                .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/threads`)
                .then(res => {
                    console.log(" res  : ", res);
                    for(let idx in res.data){
                        const item = res.data[idx];
                        if(item.creator_id === props.state.currentUser.id){
                            threads.push(res.data[idx]);
                        }
                    }
                    
                    for(let idx in threads){
                        const item = threads[idx];
                        getNameByID(item.id);
                        console.log("therecpname: ", theRecpName);
                        newThreads.push({id: threads[idx].id, status: threads[idx].status, creator_id: threads[idx].creator_id, created_date: threads[idx].created_date});
                        
                        
                    }
                    threads = newThreads;
                    console.log("Threads by user: ", newThreads);
                })
                .catch(err => {
                    console.log(err);
                })
        }
        
        function getNameByID(ID){
            let recpID = 0;
            let id1 = 0;
            let id2 = 0;
            axios
                .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/messages/by_thread/${ID}`)
                .then(res => {
                    id1 = res.data[0].sender_id;
                    
                    id2 = res.data[0].recipient_id;
                    if(id1 === props.state.currentUser.id){
                        recpID = id2;
                    }
                    if(id2 === props.state.currentUser.i){
                        recpID = id1;
                    }
                    axios
                    .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users/${recpID}`)
                    .then(res => {
                        theRecpName = res.data.username;
                        console.log("Here: ", theRecpName)
                    })
                    .catch(err => {
                        console.log(err);
                })
                    
                })
                .catch(err => {
                    console.log(err);
                })
            
        }
      

      function openModal(data) {
          setIsOpen(true);
          setArr(data);

      }
      function closeModal(){
          setIsOpen(false);
      }

    
    let modalOpen = false;
    
    
    
  
  console.log(threads[0].id);
  return (
    <div>
      <h1 className="title is-1">User Created Threads</h1>
      <h3 className="title is-3">{props.state.currentUser.sponsor_name}: {props.state.currentUser.role} view</h3>
      <table className="table is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            {props.isAuthenticated() && <th />}
          </tr>
        </thead>
        <tbody>
          {threads.map(thread => {
            return (
              <tr key={thread.id}>
                <td>{thread.id}</td>
                <td>{thread.status}</td>
                {/*
                <td>
                  <button
                    onClick={() => openModal([{id: thread.id, status: thread.status}])}
                    className="button is-primary"
                  >
                    Message User
                          </button>
                  <Modal
                    isOpen={modalIsOpen} //
                    style={modalStyles}
                  >
                    <div className="modal is-active">
                      <div className="modal-background" />
                      <div className="modal-card">
                        <header className="modal-card-head">
                          <p className="modal-card-title">Message User</p>
                          <button
                            className="delete"
                            aria-label="close"
                            onClick={closeModal}
                          />
                        </header>
                        <section className="modal-card-body">
                        <Messenger 
                            {...props} 
                            state={props.state} 
                            isAuthenticated={props.isAuthenticated} 
                            currentUser={props.state.currentUser}/> : <Redirect to="/login" 
                        />
                        </section>
                      </div>
                    </div>

                  </Modal>
                </td>*/}
                
                
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

}

MessageThreads.propTypes = {
  
  
  isAuthenticated: PropTypes.func.isRequired

};

export default MessageThreads;
