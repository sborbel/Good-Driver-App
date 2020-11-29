import React from "react";
import PropTypes from "prop-types";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import Modal from "react-modal";

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

  

const Affiliations = props => {
    function getOptions(){
        let ret = [];
        for(let i in props.state.all_sponsors){
          ret.push(<option key={i} value={props.state.all_sponsors[i]}>{props.state.all_sponsors[i]}</option>);
        }
        return ret;
      }
      function getUsers(){
        let ret = [];
        for(let i = 0; i < props.state.users.length; i++){
          if(props.state.currentUser.id !== props.state.users[i].id && props.state.users[i].role === "driver"){
            ret.push(<option key={props.state.users[i].id} value={props.state.users[i].id}>{props.state.users[i].id}: {props.state.users[i].username}</option>);
          }
        }
        return ret;
      }

    const [modalIsOpen,setIsOpen] = React.useState(false);

  const {affiliations} = props.state;
  const {users} = props.state;
  console.log(users);
  let sortedAffs = [];
  const [correctID, setCorrectID] = React.useState(props.state.currentUser.id);
  for(let idx in affiliations){
    const item = affiliations[idx];
    if(item.user_id === parseInt(correctID)){
      sortedAffs.push(item);
    }
  }
  
  
  function openModal() {
    setIsOpen(true);

  }
  function closeModal(){
    setIsOpen(false);
  }
    
  return (
    <div>
    <h1 className="title is-1">Affiliations List</h1>
    <hr />
    <br />
      {props.state.currentUser.role === "admin" && 
        <Formik
        initialValues={{
          user: props.state.users[0].id
        }}
        onSubmit={(values, { setSubmitting }) => {
          setCorrectID(values.user);
          //props.getUserDataByID(props.state.currentUser.id);
          setSubmitting(false);
        }}
        validationSchema={Yup.object().shape({
          
        })}
        
      >
        {props => {
          const {
            isSubmitting,
            handleSubmit
          } = props;
          return (
            <div>
            <form onSubmit={handleSubmit}>
            <Field as="select" name="user">
            <option value={0}> </option>
              {getUsers()}
            </Field>
             
              <input
                type="submit"
                className="button is-primary"
                value="Submit"
                disabled={isSubmitting}
              />
            </form>
            </div>
          );
        }}
      </Formik>
      }
      <table className="table is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>User</th>
            <th>Sponsor</th>
            <th>
              <button
                onClick={() => openModal()}
                className="button is-primary"
              >
                New Affiliation
              </button>
              <Modal
                    isOpen={modalIsOpen} //
                    style={modalStyles}
                  >
                    <div className="modal is-active">
                      <div className="modal-background" />
                      <div className="modal-card">
                        <header className="modal-card-head">
                          <p className="modal-card-title">Create New Event</p>
                          <button
                            className="delete"
                            aria-label="close"
                            onClick={closeModal}
                          />
                        </header>
                        <section className="modal-card-body">
                            <div>
                            <hr />
                            <br />
                            <Formik
                                initialValues={{
                                    sponsor: props.state.all_sponsors[0],
                                    points: 0,
                                    role: props.state.currentUser.role
                                }}
                                onSubmit={(values, { setSubmitting, resetForm }) => {
                                let promise = props.apiCreateNewAffiliation(parseInt(correctID), values.sponsor, "active", values.points);///////////
                                promise.then(res=>{
                                    props.getAuthorizedData(props.state.currentUser.id);
                                    closeModal();
                                    resetForm();
                                    setSubmitting(false);
                                    props.createMessage("success", `Created Affiliation`);
                                }).catch(err => {
                                    props.createMessage("danger", `Error creating Affiliation`);
                                });
                                }}
                                validationSchema={Yup.object().shape({
                                
                                })}
                            >
                                {props => {
                                const {
                                    values,
                                    isSubmitting,
                                    handleChange,
                                    handleBlur,
                                    handleSubmit
                                } = props;
                                return (
                                    <form onSubmit={handleSubmit}>
                                        <div className="field">
                                            <Field as="select" name="sponsor">
                                                {getOptions()}
                                            </Field>
                                        </div>
                                        {values.role === "admin" &&
                                            <div className="field">
                                                <label className="label" htmlFor="input-username">
                                                    Points
                                                    </label>
                                                    <input
                                                    name="points"
                                                    id="input-username"
                                                    type="number"
                                                    placeholder="Enter points to add"
                                                    value={values.points}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    />
                                            </div>}
                                        
                                        <input
                                            type="submit"
                                            className="button is-primary"
                                            value="Submit"
                                            disabled={isSubmitting}
                                        />
                                    </form>
                                );
                                }}
                            </Formik>
                            </div>
                        </section>
                      </div>
                    </div>

                  </Modal>
            </th>
            {props.isAuthenticated() && <th />}
          </tr>
        </thead>
        <tbody>
          {sortedAffs.map(aff => {
            if(props.state.currentUser.role === "admin"){
              return (
                <tr key={aff.id}>
                  <td>{aff.userName}</td>  
                  <td>{aff.sponsor_name}</td>
                </tr>
              );
            }
            else{
              return (
                <tr key={aff.id}>
                  <td>{props.state.currentUser.username}</td>  
                  <td>{aff.sponsor_name}</td>
                </tr>
              );
            }
            
          })}
        </tbody>
      </table>
    </div>
  );
};

Affiliations.propTypes = {
  isAuthenticated: PropTypes.func.isRequired,
  getEventsByUser: PropTypes.func,
  getEventsBySponsor: PropTypes.func,
  createNewEvent: PropTypes.func,
  getUserDataByID: PropTypes.func
};

export default Affiliations;
