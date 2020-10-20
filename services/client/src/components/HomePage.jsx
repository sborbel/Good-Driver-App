import React from "react";
import Announcement from 'react-announcement'
import Logo from './truck.jpeg'

const HomePage = (props) => (
  <div>
    <h1 className="title is-1">Home</h1>
    <h3 className="title is-3">{props.state.currentUser.username}</h3>
    <hr />
    <br />
    {props.state.currentUser.role === "driver" && (
    <div>
      <h5 className="title is-5">{"Points: " + props.state.points}</h5>
    </div>
    )}
    <Announcement
            title={props.state.currentUser.sponsor_name}
            subtitle={props.state.announcement.content}
            imageSource={Logo}
            daysToLive={0}
            secondsBeforeBannerShows={2}
            closeIconSize={30}
      />
    </div>

);
export default HomePage;
