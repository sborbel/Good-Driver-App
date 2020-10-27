import React from "react";
import Announcement from 'react-announcement'
import App from "../App";
import Logo from './truck.jpeg'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'
//import 'bootstrap/dist/css/bootstrap.min.css';
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";
import Modal from "react-modal";

import PropTypes from "prop-types";

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

const CatalogueItem = props => {
    const [modalIsOpen,setIsOpen] = React.useState(false);

    function openModal() {
        setIsOpen(true);
    
      }
      function closeModal(){
        setIsOpen(false);
      }



    let myText = props.text;
    let fullText = props.text;
    console.log(myText.length);
    if(myText.length > 100){
        myText = (myText.slice(0, 99)+'...');
    }

return (
    <>
    
    <Card boarder="secondary" style={{ width: '18rem' }}>
    <Card.Img variant="top" src={props.src} style={{width: "100%", height: "20vh", objectFit: "contain"}}/>
    <Card.Title>{props.title}</Card.Title>
    <Card.Body>
        <Card.Text>
            {myText}
        </Card.Text>
    </Card.Body>
    <Card.Body>
        <Card.Text>
            {props.pts} pts : ${props.cst}
        </Card.Text>
    </Card.Body>
    <Card.Footer>
        {props.state.points >= props.pts &&
        <Button variant="primary" align="left">Purchase</Button>}
        {props.state.points < props.pts &&
        <h6>Sorry, you do not have enough points.</h6>}
        
        <Button variant="secondary" align="right" onClick={openModal}>View</Button>
        <Modal
                    isOpen={modalIsOpen} //
                    style={modalStyles}
                  >
                      <div className="modal is-active">
                        <div className="modal-background" />
                            <div className="modal-card">
                                <header className="modal-card-head">
                                    <p className="modal-card-title">Item View</p>
                                    <button
                                        className="delete"
                                        aria-label="close"
                                        onClick={closeModal}
                                    />
                                </header>
                                <section className="modal-card-body"></section>
                                <Card boarder="secondary" style={{ objectFit: 'contain' }}>
                                    <Card.Img variant="top" src={props.src} style={{width: "100%", height: "20vh", objectFit: "contain"}}/>
                                    <Card.Title>{props.title}</Card.Title>
                                    <Card.Body>
                                        <Card.Text>
                                            {fullText}
                                        </Card.Text>
                                    </Card.Body>
                                    <Card.Body>
                                        <Card.Text>
                                            {props.pts} pts : ${props.cst}
                                        </Card.Text>
                                    </Card.Body>

                                    <Card.Footer>
                                        <Button variant="primary" align="left">Purchase</Button>
                                    </Card.Footer>
                    
                                </Card>
                            </div>
                        </div>

                  </Modal>
        
    </Card.Footer>
        
  </Card>
  
  </>
  );

};

CatalogueItem.propTypes = {
    state: PropTypes.object,
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    src: PropTypes.string,
    pts: PropTypes.number,
    cst: PropTypes.string
  };
export default CatalogueItem;
