import React from "react";
import PropTypes, { number } from "prop-types";
import { Formik } from "formik";
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

let name = "a";
const EventsTable = props => {
    //let events = props.getEventsByUser()
    //console.log(props.getEventsByUser());
    //props.getEventsByUser(8);
    //props.getEventsBySponsor();
    console.log(props.state.events);

    const [modalIsOpen,setIsOpen] = React.useState(false);
    const [threadArr,setArr] = React.useState([]);

  const {events} = props.state;
  let sortedEvents = [];
  const [correctID, setCorrectID] = React.useState(0);
  const [sortedField, setSortedField] = React.useState(null);
  for(let idx in events){
    const item = events[idx];
    console.log(item.user_id);
    console.log(parseInt(correctID));
    if(item.user_id === parseInt(correctID)){
      sortedEvents.push(item);
      console.log(sortedEvents);
    }
  }
  if(sortedField !== null) {
    sortedEvents.sort((a, b) => {
      if (a[sortedField] < b[sortedField]){
        return -1;
      }
      if (a[sortedField] > b[sortedField]){
        return 1;
      }
      return 0;
    });
  }
  function openModal() {
    setIsOpen(true);

  }
  function closeModal(){
    setIsOpen(false);
  }
    
  return (
    <div>
    <h1 className="title is-1">Events List</h1>
    <h3 className="title is-3">{props.state.currentUser.sponsor_name}: {props.state.currentUser.role} view</h3>
    <hr />
    <br />
      {props.state.currentUser.role != "driver" && 
        <Formik
        initialValues={{
          userName: ""
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setCorrectID(values.userName);
          setSubmitting(false);
        }}
        validationSchema={Yup.object().shape({
          
        })}
      >
        {props => {
          const {
            values,
            touched,
            errors,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit
          } = props;
          return (
            <form onSubmit={handleSubmit}>
            <div className="field">
                <label className="label" htmlFor="input-username">
                    User
                    </label>
                    <input
                    name="userName"
                    id="input-username"
                    type="text"
                    placeholder="Enter a username"
                    value={values.userName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    />
            </div>
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
      }
      <table className="table is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>User</th>  
            <th>Points</th>
            <th>Description</th>  
            <th>Date</th>
            <th>
              <button
                onClick={() => openModal()}
                className="button is-primary"
              >
                New Event
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
                            <h1 className="title is-1">Add Thread</h1>
                            <hr />
                            <br />
                            <Formik
                                initialValues={{
                                    description: "",
                                    points: 0,
                                    user_id: parseInt(correctID)
                                }}
                                onSubmit={(values, { setSubmitting, resetForm }) => {
                                    console.log("Submitted: ", values);
                                props.createNewEvent(values);//Make this
                                props.getEventsBySponsor();
                                closeModal();
                                resetForm();
                                setSubmitting(false);
                                }}
                                validationSchema={Yup.object().shape({
                                
                                })}
                            >
                                {props => {
                                const {
                                    values,
                                    touched,
                                    errors,
                                    isSubmitting,
                                    handleChange,
                                    handleBlur,
                                    handleSubmit
                                } = props;
                                return (
                                    <form onSubmit={handleSubmit}>
                                    <div className="field">
                                        <label className="label" htmlFor="input-username">
                                            Description
                                            </label>
                                            <input
                                            name="description"
                                            id="input-username"
                                            type="text"
                                            placeholder="Enter a description"
                                            value={values.description}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            />
                                    </div>
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
                                    </div>
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
          {sortedEvents.map(event => {
            return (
              <tr key={event.id}>
                <td>{event.user_id}</td>  
                <td>{event.points}</td>
                <td>{event.description}</td>
                <td>{event.created_date}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

EventsTable.propTypes = {
  isAuthenticated: PropTypes.func.isRequired,
  getEventsByUser: PropTypes.func,
  getEventsBySponsor: PropTypes.func,
  createNewEvent: PropTypes.func
};

export default EventsTable;
