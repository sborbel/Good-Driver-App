import React from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import EditUser from "./EditUser";

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

function UserStatus(props) {
      const [modalIsOpen,setIsOpen] = React.useState(false);
      const [userArr,setArr] = React.useState([]);
      
      function openModal(data) {
          setIsOpen(true);
          setArr(data);

      }
      function closeModal(){
          setIsOpen(false);
      }

    let sortedUsers = [];
    const [sortedField, setSortedField] = React.useState(null);
    console.log(props.state.users);
    
    for(let idx in props.state.users){
      const item = props.state.users[idx];
      if(props.state.currentUser.role === "admin"){
        sortedUsers.push(item);
      }
      if(props.state.currentUser.role === "sponsor_mgr"){
        if(item.sponsor_name === props.state.currentUser.sponsor_name){
          if(item.role === "driver" || item.role === "sponsor_mgr"){
            sortedUsers.push(item);
          }
        }
      }
      if(props.state.currentUser.role === "driver"){
        if(item.id === props.state.currentUser.id){
          sortedUsers.push(item);
        }
      }
    }
    if(sortedField !== null) {
      sortedUsers.sort((a, b) => {
        if (a[sortedField] < b[sortedField]){
          return -1;
        }
        if (a[sortedField] > b[sortedField]){
          return 1;
        }
        return 0;
      });
  }
  
  return (
    <div>
      <h1 className="title is-1">User Status</h1>
      <h3 className="title is-3">{props.state.currentUser.sponsor_name}: {props.state.currentUser.role} view</h3>
      <table className="table is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>ID</th>
            <th>
              <button type="button" onClick={() => setSortedField('role')}>
                Role
              </button>
            </th>
            <th>
              <button type="button" onClick={() => setSortedField('email')}>
                Email
              </button>
            </th>
            
            <th>
              <button type="button" onClick={() => setSortedField('username')}>
                Username
              </button>
            </th>
            
            {props.isAuthenticated() && <th />}
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map(user => {
            return (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.role}</td>
                <td>{user.email}</td>
                <td className="username">{user.username}</td>
                {/*<td>{user.sponsor_name}</td>*/}
                <td>
                  <button
                    onClick={() => openModal([{id: user.id, role: user.role, email: user.email, username: user.username/*, sponsor_name: user.sponsor_name*/}])}
                    className="button is-primary"
                  >
                    Edit User
                          </button>
                  <Modal
                    isOpen={modalIsOpen} //
                    style={modalStyles}
                  >
                    <div className="modal is-active">
                      <div className="modal-background" />
                      <div className="modal-card">
                        <header className="modal-card-head">
                          <p className="modal-card-title">Edit User</p>
                          <button
                            className="delete"
                            aria-label="close"
                            onClick={closeModal}
                          />
                        </header>
                        <section className="modal-card-body">
                          <EditUser
                          {...props} state={props.state}
                          isAuthenticated={props.isAuthenticated}
                          thisuser={userArr[0]}
                          editUser={props.editUser}
                          closeModal={closeModal}
                          getAuthorizedData={props.getAuthorizedData}
                            
                          />
                        </section>
                      </div>
                    </div>

                  </Modal>
                </td>
                
                {props.isAuthenticated() && (
                  <td>
                    <button
                      className="button is-danger is-small"
                      onClick={() => props.state.removeUser(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

}

UserStatus.propTypes = {
  
  
  isAuthenticated: PropTypes.func.isRequired,
  editUser: PropTypes.func.isRequired,
  getAuthorizedData: PropTypes.func.isRequired

};

export default UserStatus;
