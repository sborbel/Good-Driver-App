import React from "react";
import PropTypes from "prop-types";

const UsersList = props => {
  return (
    <div>
    <h1 className="title is-1">Users List</h1>
    <h3 className="title is-3">{props.state.currentUser.sponsor_name}: {props.state.currentUser.role} view</h3>
    <hr />
    <br />
      <table className="table is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Role</th>            
            <th>Username</th>
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
  users: PropTypes.array.isRequired,
  removeUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.func.isRequired
};

export default UsersList;
