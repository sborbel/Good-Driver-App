import React from "react";
import Announcement from 'react-announcement'
import Logo from './truck.jpeg'

const HomePage = (props) => (
  <div>
    <h1 className="title is-1">Home</h1>
<h3 className="title is-3">{props.state.currentUser.sponsor_name}: {props.state.currentUser.username}</h3>
    <hr />
    <br />
    {props.state.currentUser.role === "driver" && (
    <div>
      <h5 className="title is-5">{"Points: " + props.state.points}</h5>
    </div>
    )}
    {props.state.currentUser.role !== "admin" && props.state.affiliations.length > 0 && props.state.affiliations[props.state.current_affiliation].sponsor_name &&
    <Announcement
            title={props.state.affiliations[props.state.current_affiliation].sponsor_name}
            subtitle={props.state.announcement.content}
            imageSource={props.state.sponsor_data.sponsor_logo}
            daysToLive={0}
            secondsBeforeBannerShows={2}
            closeIconSize={30}
    />}
    </div>

);
export default HomePage;
