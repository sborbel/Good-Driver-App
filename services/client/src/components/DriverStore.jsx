import React from "react";
import Announcement from 'react-announcement'
import App from "../App";
import Logo from './truck.jpeg'
import { Field, Formik } from "formik";
import {CardColumns, Card, CardGroup} from 'react-bootstrap';
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css';
import CatalogueItem from "./CatalogueItem";
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";
//import "./TestPage.css";
import "./TestPage.scss";
let arr = [{ti: "Hello1", te: "This is a test"}, {ti: "Goodbye1", te: "This is not a test"}, {ti: "Hello2", te: "This is a test"}, {ti: "Goodbye2", te: "This is not a test"}, {ti: "Hello3", te: "This is a test"}, {ti: "Goodbye3", te: "This is not a test"}, {ti: "Hello4", te: "This is a test"}, {ti: "Goodbye4", te: "This is not a test"}, {ti: "Hello5", te: "This is a test"}, {ti: "Goodbye5", te: "This is not a test"}, {ti: "Hello6", te: "This is a test"}, {ti: "Goodbye6", te: "This is not a test"}];



const DriverStore = props => {
    const {catalog_items} = props.state;
    let searchedItems = [];
    const [criteria,setCriteria] = React.useState(" ");
    let re = new RegExp('^(.*?(' + criteria + ')[^$]*)$');
    console.log("re: ", re)
    for(let i = 0; i < props.state.catalog_items.length; i++){
        if(props.state.catalog_items[i].name.search(re) >= 0){
            searchedItems.push(props.state.catalog_items[i]);
        }

        
    }


return(
<>
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
        touched,
        errors,
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
</Formik>
       
          
       
    <MDBContainer>  
       
  <MDBRow>
      
  {searchedItems.map(item => {
            return(
                <CatalogueItem
                    title={item.name}
                    text={item.description}
                    src={item.image_url}
                    pts={item.points_cost}
                    cst={item.actual_cost}
                    state={props.state}
                />
            );
        })}



        {/*
        <MDBCol size="3">
        <Card boarder="secondary" style={{ width: '18rem' }}>
      <Card.Img variant="top" src={Logo} />
  <Card.Body>
<Card.Title>title</Card.Title>
    <Card.Text>
    text
      </Card.Text>
      <Button variant="primary">Purchase</Button>
  </Card.Body>
  </Card>
  </MDBCol>
  <MDBCol size="3">
  <Card boarder="secondary" style={{ width: '18rem' }}>
      <Card.Img variant="top" src={Logo} />
  <Card.Body>
<Card.Title>title</Card.Title>
    <Card.Text>
    text
      </Card.Text>
      <Button variant="primary">Purchase</Button>
  </Card.Body>
  </Card>
  </MDBCol>

  <MDBCol size="3">
        <Card boarder="secondary" style={{ width: '18rem' }}>
      <Card.Img variant="top" src={Logo} />
  <Card.Body>
<Card.Title>title</Card.Title>
    <Card.Text>
    text
      </Card.Text>
      <Button variant="primary">Purchase</Button>
  </Card.Body>
  </Card>
  </MDBCol>

  <MDBCol size="3">
  <Card boarder="secondary" style={{ width: '18rem' }}>
      <Card.Img variant="top" src={Logo} />
  <Card.Body>
<Card.Title>title</Card.Title>
    <Card.Text>
    text
      </Card.Text>
      <Button variant="primary">Purchase</Button>
  </Card.Body>
  </Card>
  </MDBCol>

  <MDBCol size="3">
        <Card boarder="secondary" style={{ width: '18rem' }}>
      <Card.Img variant="top" src={Logo} />
  <Card.Body>
<Card.Title>title</Card.Title>
    <Card.Text>
    text
      </Card.Text>
      <Button variant="primary">Purchase</Button>
  </Card.Body>
  </Card>
  </MDBCol>

  <MDBCol size="3">
  <Card boarder="secondary" style={{ width: '18rem' }}>
      <Card.Img variant="top" src={Logo} />
  <Card.Body>
<Card.Title>title</Card.Title>
    <Card.Text>
    text
      </Card.Text>
      <Button variant="primary">Purchase</Button>
  </Card.Body>
  </Card>
        </MDBCol>*/}
        
  </MDBRow>

  </MDBContainer>
    </>
)
};
export default DriverStore;
