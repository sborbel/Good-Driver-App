import React from "react";
import { Formik } from "formik";
import 'bootstrap/dist/css/bootstrap.min.css';
import CatalogueItem from "./CatalogueItem";
import { MDBContainer, MDBRow } from "mdbreact";
import {Navbar, Nav} from 'react-bootstrap'

import { Link } from "react-router-dom";
import "./TestPage.css";
// import "./TestPage.scss";
let pageType = 1;

const DriverStore = props => {
    console.log(props.state);
    let searchedItems = [];
    const [criteria,setCriteria] = React.useState(" ");
    const [returnedItems,setReturnedItems] = React.useState([]);
    let re = new RegExp('^(.*?(' + criteria + ')[^$]*)$');
    console.log("re: ", re)
    for(let i = 0; i < props.state.catalog_items.length; i++){
        if(props.state.catalog_items[i].name.search(re) >= 0){
            searchedItems.push(props.state.catalog_items[i]);
        }
    }


    let navbar = (<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
  
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      
      <Nav className="mr-auto">
      
          <Nav.Item as={Link} to="/driverstore" onClick={() => {
              pageType = 1;
          }} bsPrefix='nav-link'>
              Store
          </Nav.Item>
          <Nav.Item as={Link} to="/driverstore" onClick={() => {
              pageType = 2;
          }} bsPrefix='nav-link'>
              Orders
          </Nav.Item>
          {props.state.currentUser.role !== "driver" &&
          <Nav.Item as={Link} to="/driverstore" onClick={() => {
              pageType = 3;
          }} bsPrefix='nav-link'>
              Edit Store
          </Nav.Item>}
      
      </Nav>
      
      
    </Navbar.Collapse>
    
  </Navbar>);
return(
    <>
{navbar}


    {props.state.currentUser.role === "driver" &&(
    <div>
      <h5 className="title is-5">{"Points: " + props.state.points}</h5>
    </div>
    )}
    {pageType === 1 &&
    <Formik
    initialValues={{
        description: ""
    }}
    onSubmit={(values, { setSubmitting, resetForm }) => {
        console.log("Submitted: ", values);
    //resetForm();
    setCriteria(values.description);
    setSubmitting(false);
    }}
>
    {props => {
    const {
        values,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        resetForm
    } = props;
    return (
        <form onSubmit={handleSubmit} onReset={handleSubmit}>
        <div className="field">
            <label className="label" htmlFor="input-username">
                Search
                </label>
                <input
                name="description"
                id="input-username"
                type="text"
                placeholder="Search"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                />
                <button type="reset" className="button is-primary" onClick={resetForm}>
                Reset
              </button>
              
                <input
                    type="submit"
                    className="button is-primary"
                    value="Submit"
                    disabled={isSubmitting}
                />
                
        </div>
        
       
        </form>
    );
    }}
</Formik>}
       
          
       
    {pageType === 1 && 
    <MDBContainer>  
       
  <MDBRow>
      
  {searchedItems.map(item => {
      return(
      <li key={item.id}>
            
                <CatalogueItem
                    title={item.name}
                    text={item.description}
                    src={item.image_url}
                    pts={item.points_cost}
                    cst={item.actual_cost}
                    catalog={item.catalog_id}
                    item_id={item.id}
                    pageType={pageType}
                    apiCreateEvent={props.apiCreateEvent}
                    createMessage={props.createMessage}
                    apiCreateOrderItem={props.apiCreateOrderItem}
                    apiCreateOrder={props.apiCreateOrder}
                    getUserDataByID={props.getUserDataByID}
                    state={props.state}
                />
            
            </li>
      )
        })}
         </MDBRow>

</MDBContainer>}

        {pageType === 2 &&
        <>
        <h4>Your orders</h4>
        
        <table className="table is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>Order ID</th>  
            <th>Sponsor Name</th>
            <th>Quantity</th>
            <th>Actual Cost</th>  
            <th>Points Cost</th>
            <th>Date Ordered</th>
            <th>Status</th>
          </tr>
          </thead>
        <tbody>
         {props.state.order_items.map(order => {
             let orderDate = order.dateOrdered.substr(5,5).concat("-").concat(order.dateOrdered.substr(0,4));
             return (
               <tr key={order.orderID}>
                 <td>{order.orderID}</td>  
                 <td>{order.sponsor}</td>
                 <td>{order.quantity}</td>
                 <td>{order.aCost}</td>
                 <td>{order.pCost}</td>
                 <td>{orderDate}</td>
                 <td>{order.status}</td>
               </tr>
             );
         })}
        </tbody>
      </table>
      </>

            }
            {pageType === 3 &&
            <>
            <h4>Add Store Items</h4>
            <Formik initialValues={{description: ""}}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    console.log("Submitted: ", values);
                    let prom = props.apiSendItemRequest("ebay", [values.description]);
                    prom.then(res => {
                        setReturnedItems(res.data);
                        props.createMessage("success", "Added item to catalog");
                        setSubmitting(false);
                        
                    }).catch(err =>{
                        props.createMessage("danger", "Error: Could not add item to catalog");
                    });
                }}
            >
            {props => {
            const {
                values,
                isSubmitting,
                handleChange,
                handleBlur,
                handleSubmit,
                handleReset
            } = props;
            return (
                <form onSubmit={handleSubmit} onReset={handleSubmit}>
                <div className="field">
                    <label className="label" htmlFor="input-username">
                        Search
                        </label>
                        <input
                        name="description"
                        id="input-username"
                        type="text"
                        placeholder="Search"
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        />
                        <button type="reset" className="button is-primary" onClick={handleReset}>
                        Reset
                    </button>
                    
                        <input
                            type="submit"
                            className="button is-primary"
                            value="Submit"
                            disabled={isSubmitting}
                        />
                        
                </div>
                
            
                </form>
            );
            }}
            </Formik>

            <MDBContainer>  
       
                <MDBRow>
      
                {returnedItems.map(item => {
                    return(
                    <li key={item.name + item.catalog_id}>
                            
                                <CatalogueItem
                                    title={item.name[0]}
                                    text={item.description[0]}
                                    src={item.image_url[0]}
                                    pts={item.points_cost[0]}
                                    cst={parseFloat(item.actual_cost[0])}
                                    catalog={item.catalog_id}
                                    item_id={item.id}
                                    apiCreateEvent={props.apiCreateEvent}
                                    createMessage={props.createMessage}
                                    apiCreateCatalogItem={props.apiCreateCatalogItem}
                                    apiCreateOrderItem={props.apiCreateOrderItem}
                                    apiCreateOrder={props.apiCreateOrder}
                                    getUserDataByID={props.getUserDataByID}
                                    pageType={pageType}
                                    state={props.state}
                                />
                            
                            </li>
                    )
                        })}
                        </MDBRow>

            </MDBContainer>
</>
            
            
            }




        
        
 
    </>

)
};
export default DriverStore;
