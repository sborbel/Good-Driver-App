import React from "react";
import PropTypes from "prop-types";

function UsersList(props) {
  const {users} = props;
  let sortedUsers = [];
  const [sortedField, setSortedField] = React.useState(null);
  for(let idx in users){
    const item = users[idx];
    if(props.role === "admin"){
      sortedUsers.push(item);
    }
    if(props.role === "sponsor_mgr"){
      if(item.role === "driver"){
        sortedUsers.push(item);
      }
    }
    if(props.role === "driver"){
      if(item.email === props.myUser){
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
  isAuthenticated: PropTypes.func.isRequired,
  role: PropTypes.string,
  myUser: PropTypes.string
};

export default UsersList;
