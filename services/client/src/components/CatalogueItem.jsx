import React from "react";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'
//import 'bootstrap/dist/css/bootstrap.min.css';
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
    //Item View Modal
    function createNewOrder(){
        let prom = props.apiCreateOrder("active", props.state.currentUser.id, props.state.currentUser.sponsor_name);
        prom.then(res => {
            
            let orderProm = props.apiCreateOrderItem(res.data.id, props.catalog, props.item_id, 1, parseFloat(props.cst), parseInt(props.pts));
            orderProm.then(newOrder => {
                
                let changeOrderProm = props.apiUpdateOrder(res.data.id, "submitted", props.state.currentUser.id, props.state.currentUser.sponsor_name);
                changeOrderProm.then(res => {
                    props.getUserDataByID(props.state.currentUser.id);
                    props.createMessage("success", "Item Ordered");
                }).catch(err => {
                    props.createMessage("danger", "Error: Could not add item to order");
                });
            }).catch(err =>{
                console.log(err);
                props.createMessage("danger", "Error: Could not add item to order");
            });
        }).catch(err =>{
            props.createMessage("danger", "Error: Could not create order");
        });
    }
    const [modalIsOpen,setIsOpen] = React.useState(false);

    function openModal() {
        setIsOpen(true);
    
      }
      function closeModal(){
        setIsOpen(false);
      }

    //Purchase conformation modal
    const [buyModalIsOpen,buySetIsOpen] = React.useState(false);

    function openBuyModal() {
        buySetIsOpen(true);
    
      }
      function closeBuyModal(){
        buySetIsOpen(false);
      }



    let myText = props.text;
    let fullText = props.text;
    if(myText.length > 100){
        myText = (myText.slice(0, 99)+'...');
    }
if(props.pageType  === 1){
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
        <Button variant="primary" align="left" onClick={openBuyModal}>Purchase</Button>}
        {props.state.points >= props.pts && <Modal
                    isOpen={buyModalIsOpen} //
                    style={modalStyles}
                  >
                      <div className="modal is-active">
                        <div className="modal-background" />
                            <div className="modal-card">
                                <header className="modal-card-head">
                                    <p className="modal-card-title">Confirmation</p>
                                    <button
                                        className="delete"
                                        aria-label="close"
                                        onClick={closeBuyModal}
                                    />
                                </header>
                                <section className="modal-card-body">
                                    <h4>Are you sure you want to purchase?</h4>
                                    
                                    <Button variant="primary" align="left" onClick={() => {
                                        createNewOrder();
                                        closeBuyModal();
                                    }}>Yes</Button>
                                    <Button variant="secondary" align="right" onClick={closeBuyModal}>No</Button>
                                    </section>
                            </div>
                        </div>

                  </Modal>}
        
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
                                        <Button variant="primary" align="left" onClick={openBuyModal}>Purchase</Button>
                                    </Card.Footer>
                    
                                </Card>
                            </div>
                        </div>

                  </Modal>
        
    </Card.Footer>
        
  </Card>
  
  </>
  );

}
else{
    return(
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
        
        <Button variant="secondary" align="right" onClick={ res => {
            let addProm = props.apiCreateCatalogItem(props.title, props.text, props.src, props.pts, props.cst, props.state.catalogs[0].id);
            addProm.then(res => {
                props.getUserDataByID(props.state.currentUser.id);
                props.createMessage("success", "Added item to catalog")
            }).catch(err => {
                props.createMessage("error", "Error: Could not add item to catalog")
            })
        }}>Add</Button>
        
        
    </Card.Footer>
        
  </Card>
  
  </>
    )
}
};

CatalogueItem.propTypes = {
    state: PropTypes.object,
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    src: PropTypes.string,
    catalog: PropTypes.number,
    pts: PropTypes.number,
    item_id: PropTypes.number,
    cst: PropTypes.string,
    apiCreateOrder: PropTypes.func,
    apiCreateOrderItem: PropTypes.func,
    pageType: PropTypes.number
  };
export default CatalogueItem;
