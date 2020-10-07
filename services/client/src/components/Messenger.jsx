
import React, {Component, ReactDOM} from 'react';
import axios from "axios";
import MessageList from "./MessageList";
import MessageForm from './MessageForm'
import './App.css'
import PropTypes, { number } from "prop-types";

class Messenger extends Component {
    constructor() {
        super();
        this.state = {
            messages: [],
            threadID: 1,
            myID: 0

        };
    }

    componentDidMount = () => {
        this.addMessages();
        this.setState({myID: this.props.state.currentUser.id});
    }
    handleNewMessage = (text) => {
        this.setState({
          messages: [...this.state.messages, { me: true, author: "Me", body: text }],
        })
      }
    addMessages = () => {
        //let messageToAdd = [{me: true, author: "Me", body: "hello world"}];
        let oldMessages = [];
        let newMessages = [];
        axios
            .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/messages/by_thread/${this.state.threadID}`)
            .then(res => {
                oldMessages = res.data;
                console.log("messages by thread: ", res.data);
                //window.localStorage.setItem("eventlist", JSON.stringify(res.data));
                for(let idx in oldMessages){
                    const item = oldMessages[idx];
                    if(item.sender_id === this.state.myID){
                        newMessages.push({me: true, author: "Me", body: item.content});
                    }
                    else{
                        newMessages.push({me: false, author: "Other person", body: item.content});
                    }
                }
                this.setState({messages: newMessages});
            })
            .catch(err => {
                console.log(err);
            });
    }
    
    render(){
        return(
            <div>
                <MessageList messages={this.state.messages} />
                <MessageForm onMessageSend={this.handleNewMessage} />

            </div>
        );
    }
}

Messenger.propTypes = {
  
  
    isAuthenticated: PropTypes.func.isRequired,
    currentUser: PropTypes.array
  
  };

export default Messenger;