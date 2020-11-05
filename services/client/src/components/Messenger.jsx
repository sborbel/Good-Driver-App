
import React, {Component} from 'react';
import axios from "axios";
import MessageList from "./MessageList";
import MessageForm from './MessageForm'
import './App.css'
import PropTypes from "prop-types";

class Messenger extends Component {
    constructor(props) {
        super();
        this.state = {
            messages: [],
            thread: props.thisThread,
            myID: props.currentUser.id

        };
    }

    componentDidMount = () => {
        this.addMessages();

    }
    handleNewMessage = (text) => {
        
        let data = {
            thread_id: this.state.thread.id,
            sender_id: this.state.myID,
            recipient_id: parseInt(this.state.thread.recpID),
            subject: "new message",
            content: text
        };
        //////console.log(this.state);
        axios
            .post(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/messages`, data)
            .then(res => {
                this.setState({
                    messages: [...this.state.messages, { me: true, author: "Me", body: text }],
                  });
            })
            .catch(err => {
                //////console.log(err);
            });

      }
    addMessages = () => {
        //let messageToAdd = [{me: true, author: "Me", body: "hello world"}];
        let oldMessages = [];
        let newMessages = [];
        axios
            .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/messages/by_thread/${this.state.thread.id}`)
            .then(res => {
                oldMessages = res.data;
                //////console.log("messages by thread: ", res.data);
                //window.localStorage.setItem("eventlist", JSON.stringify(res.data));
                for(let idx in oldMessages){
                    const item = oldMessages[idx];
                    if(item.sender_id === this.state.myID){
                        newMessages.push({me: true, author: "Me", body: item.content});
                    }
                    else{
                        newMessages.push({me: false, author: this.props.currentThread.recpName, body: item.content});
                    }
                }
                this.setState({messages: newMessages});
            })
            .catch(err => {
                //////console.log(err);
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
    currentUser: PropTypes.object,
    currentThread: PropTypes.object
  
  };

export default Messenger;