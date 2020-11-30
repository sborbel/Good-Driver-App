import React from "react";
import PropTypes from "prop-types";

import Modal from "react-modal";
import RegisterForm from "./RegisterForm";


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
const UsersList = props => {
  const [modalIsOpen,setIsOpen] = React.useState(false);
  function openModal() {
    setIsOpen(true);

}
function closeModal(){
    setIsOpen(false);
    console.log("closed")
}


  return (
    <div>
    <h1 className="title is-1">Users List</h1>
    <h3 className="title is-3">{props.state.affiliations[props.state.current_affiliation].sponsor_name}: {props.state.currentUser.role} view</h3>
    <hr />
    <br />
      <table className="table is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Role</th>            
            <th>Username</th>
            <th><button
            onClick={() => openModal()}
                    className="button is-primary">
                      Add User</button></th>
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
                          <RegisterForm
                          {...props} state={props.state}
                          isAuthenticated={props.isAuthenticated}
                          closeModal={closeModal}
                          getUserDataById={props.getUserDataById}
                          createMessage={props.createMessage}
                          handleRegisterFormSubmit={props.handleRegisterFormSubmit}
                          getAuthorizedData={props.getAuthorizedData}
                            
                          />
                        </section>
                      </div>
                    </div>

                  </Modal>
            {props.isAuthenticated() && <th />}
          </tr>
        </thead>
        <tbody>
          {props.state.users.map(user => {
            return (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td className="username">{user.username}</td>
                {props.isAuthenticated() && (
                  <td>
                    <button
                      className="button is-danger is-small"
                      onClick={() => props.removeUser(user.id)}
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
};

UsersList.propTypes = {
  removeUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.func.isRequired
};

export default UsersList;
