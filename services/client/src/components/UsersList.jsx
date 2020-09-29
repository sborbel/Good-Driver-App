import React from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import EditUser from "./EditUser";
import AddUser from "./AddUser";

Modal.setAppElement(document.getElementById("root"));



function UsersList(props) {
  
  const {users} = props;
  let sortedUsers = [];
  const [sortedField, setSortedField] = React.useState(null);
  for(let idx in users){
    const item = users[idx];
    if(props.my_user.role === "admin"){
      sortedUsers.push(item);
    }
    if(props.my_user.role === "sponsor_mgr"){
      if(item.sponsor_name === props.my_user.sponsor_name){
        if(item.role === "driver"){
          sortedUsers.push(item);
        }
      }
    }
    if(props.my_user.role === "driver"){
      if(item.email === props.my_user.email){
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
            <th>
              <button type="button" onClick={() => setSortedField('sponsor_name')}>
                Sponsor
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
                <td>{user.sponsor_name}</td>
                <td>
                  <button
                    onClick={props.handleOpenModal}
                    className="button is-primary"
                  >
                    Edit User
                          </button>
                  <Modal
                    isOpen={props.showModal} //
                    style={props.modalStyles}
                  >
                    <div className="modal is-active">
                      <div className="modal-background" />
                      <div className="modal-card">
                        <header className="modal-card-head">
                          <p className="modal-card-title">Edit User</p>
                          <button
                            className="delete"
                            aria-label="close"
                            onClick={props.handleCloseModal}
                          />
                        </header>
                        <section className="modal-card-body">
                          <EditUser
                            thisuser={user}
                            editUser={props.editUser}
                            getUsers={props.getUsers}
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

}

UsersList.propTypes = {
  users: PropTypes.array.isRequired,
  removeUser: PropTypes.func.isRequired,
  addUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.func.isRequired,
  role: PropTypes.string,
  my_user: PropTypes.array,
  handleOpenModal: PropTypes.func,
  handleCloseModal: PropTypes.func,
  showModal: PropTypes.bool,
  modalStyles: PropTypes.any,
  editUser: PropTypes.func.isRequired,
  getUsers: PropTypes.func
};

export default UsersList;
