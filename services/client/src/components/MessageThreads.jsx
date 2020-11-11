
import React from 'react';
import PropTypes from "prop-types";
import Modal from "react-modal";
import Messenger from './Messenger'
import NewThreadForm from './NewThreadForm';

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
      const [threadArr,setArr] = React.useState([]);

      const [NewMessageModalIsOpen,NewMessageSetIsOpen] = React.useState(false);
      const [userData,NewMessageSetArr] = React.useState([]);
      

      

      function openModal(data) {
          setIsOpen(true);
          setArr(data);

      }
      function closeModal(){
          setIsOpen(false);
      }
      function openNewMessageModal(data){
        NewMessageSetIsOpen(true);
        NewMessageSetArr(data);
      }
      function NewMessageCloseModal(){
        NewMessageSetIsOpen(false);
    }

    
    
    console.log(props.state.threads);

    let title = "";
    if(props.state.currentUser.role === "driver"){
      title = "Help Desk";
    }
    else{
      title = "Messenger";
    }

    let usersNotincludingme = [];
    for(let i = 0; i < props.state.users.length; i++){
      if(props.state.users[i].id !== props.state.currentUser.id){
        usersNotincludingme.push(props.state.users[i]);
      }
    }
    
  return (
    <div>
      <h1 className="title is-1">{title}</h1>
      <h3 className="title is-3">{props.state.affiliations[props.state.current_affiliation].sponsor_name}: {props.state.currentUser.role} view</h3>
      <table className="table is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Reciepient</th>
            <th>
              <button
                onClick={() => openNewMessageModal([{currentUser: props.state.users}])}
                className="button is-primary"
              >
                New Message
              </button>
              <Modal
                    isOpen={NewMessageModalIsOpen} //
                    style={modalStyles}
                  >
                    <div className="modal is-active">
                      <div className="modal-background" />
                      <div className="modal-card">
                        <header className="modal-card-head">
                          <p className="modal-card-title">Create New Thread</p>
                          <button
                            className="delete"
                            aria-label="close"
                            onClick={NewMessageCloseModal}
                          />
                        </header>
                        <section className="modal-card-body">
                        <NewThreadForm 
                            {...props} 
                            state={props.state} 
                            users={usersNotincludingme}
                            isAuthenticated={props.isAuthenticated} 
                            currentUser={props.state.currentUser}
                            userData={userData}
                            createNewThread={props.createNewThread}
                            NewMessageCloseModal={NewMessageCloseModal}
                            getUserDataByID={props.getUserDataByID}
                        />
                        </section>
                      </div>
                    </div>

                  </Modal>
            </th>
            {props.isAuthenticated() && <th />}
          </tr>
        </thead>
        <tbody>
          {props.state.threads.map(thread => {
            return (
              <tr key={thread.id}>
                <td>{thread.id}</td>
                <td>{thread.status}</td>
                <td>{thread.recpName}</td>
                
                <td>
                  <button
                    onClick={() => openModal([{id: thread.id, recpID: thread.recpID, status: thread.status, recpName: thread.recpName}])}
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
                            currentUser={props.state.currentUser}
                            thisThread={threadArr[0]}
                            currentThread={threadArr[0]}
                          
                        />
                        </section>
                      </div>
                    </div>

                  </Modal>
                </td>
                
                
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

}

MessageThreads.propTypes = {
  
  
  isAuthenticated: PropTypes.func.isRequired,
  createNewThread: PropTypes.func.isRequired,
  getUserDataByID: PropTypes.func

};

export default MessageThreads;
