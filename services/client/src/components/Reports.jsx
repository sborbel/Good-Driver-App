import React from "react";
import PropTypes from "prop-types";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Reports(props) {

    const nostyle = {
        backgroundColor: '#fff'
    }

  return (
    <div>
      <h1 className="title is-1">Create Reports</h1>
      <h3 className="title is-3">{props.state.currentUser.sponsor_name}: {props.state.currentUser.role} view</h3>
        <Row style={nostyle}>
            <Col md={4}>
                <Card>
                    <Card.Header>Users Report</Card.Header>
                    <Card.Body>
                        <Card.Title>Export Users File</Card.Title>
                        <Card.Text>
                        Click the button below to export a `.csv` file of all users.
                        </Card.Text>
                        <Button variant="primary" onClick={() => props.getUserReport()}>Create Users Report</Button>
                    </Card.Body>
                </Card>
            </Col>

            <Col md={4}>
                <Card>
                    <Card.Header>Affiliations Report</Card.Header>
                    <Card.Body>
                        <Card.Title>Export Affiliations File</Card.Title>
                        <Card.Text>
                        Click the button below to export a `.csv` file of all user affiliations.
                        </Card.Text>
                        <Button variant="primary" onClick={() => props.getAffiliationsReport()}>Create Affiliations Report</Button>
                    </Card.Body>
                </Card>
            </Col>

            <Col md={4}>
                <Card>
                    <Card.Header>Fees Report</Card.Header>
                    <Card.Body>
                        <Card.Title>Export Fees Data File</Card.Title>
                        <Card.Text>
                        Click the button below to export a `.csv` file of all orders and their order items.
                        </Card.Text>
                        <Button variant="primary" onClick={() => props.getFeesReport()}>Create Fees Report</Button>
                    </Card.Body>
                </Card>
            </Col>
        </Row>

    </div>
  );

}

Reports.propTypes = { 
  isAuthenticated: PropTypes.func.isRequired,
};

export default Reports;
