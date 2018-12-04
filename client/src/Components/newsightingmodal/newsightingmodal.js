import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
import styles from './newsightingmodal.css';

class NewSightingModal extends Component {
    constructor(props) {
        super(props);
        this.state = { show: false };
    }

    handleShow = () => {
        this.setState({ show: true });
    }

    handleClose = () => {
        this.setState({ show: false });
    }

    render() {

        return (
            <div>
                <Button className={styles.newButton} bsStyle='primary' onClick={() => this.setState({ show: true })}>+ Add New Sighting</Button>
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add a new flower sighting</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => this.setState({ show: false })}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
            
        );
    }
}

export default NewSightingModal;