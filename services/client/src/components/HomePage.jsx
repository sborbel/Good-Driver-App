import React from "react";


const HomePage = (props) => (
  <div>
    <h1 className="title is-1">Home</h1>
    <h3 className="title is-3">{props.state.currentUser.username}</h3>
    <hr />
    <br />

    </div>

);
export default HomePage;
