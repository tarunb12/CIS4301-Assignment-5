import React, { Component } from 'react';
import axios from 'axios';

import { Button, ControlLabel, FormControl, FormGroup, Modal, HelpBlock } from 'react-bootstrap';
import DatePicker from 'react-16-bootstrap-date-picker';
import styles from './newsightingmodal.css';

class NewSightingModal extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            addFlower: false, 
            addLocation: false,
            flowerLocations: [],
            flowerNames: [],
            show: false,
            newSightingValidity: new Array(4).fill(false),
            fieldValues: new Map()
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ show: nextProps.show })
    }

    componentDidMount() {
        this.getFlowersFromDb();
        this.getFlowerLocationsFromDb();
    }

    getFlowersFromDb = () => {
        axios.get('/api/getFlowers')
        .then(res => this.setState({ flowerNames: res.data.data.map(flowerName => flowerName.NAME.toLowerCase()) }));
    };

    getFlowerLocationsFromDb = () => {
        axios.get('/api/getFlowerLocations')
        .then(res => this.setState({ flowerLocations: res.data.data.map(location => location.LOCATION.toLowerCase()) }));
    }

    postToDb = () => {

    }

    handleShow = () => {
        this.setState({ show: true });
    }

    handleClose = () => {
        this.setState({ show: false });
    }

    handleFlowerNameChange = event => {
        let { fieldValues } = this.state;
        fieldValues.set('flowerName', event.target.value);
        this.setState({ fieldValues });
        if (this.getFlowerNameValidationState() !== 'error' && this.state.addFlower) {
            this.setState({ addFlower: false });
        }
    }

    handleGenusChange = event => {
        let { fieldValues } = this.state;
        fieldValues.set('genus', event.target.value);
        this.setState({ fieldValues });
    }

    handlespeciesChange = event => {
        let { fieldValues } = this.state;
        fieldValues.set('species', event.target.value);
        this.setState({ fieldValues });    }

    handleSighterNameChange = event => {
        let { fieldValues } = this.state;
        fieldValues.set('sighter', event.target.value);
        this.setState({ fieldValues });
    }

    handleLocationNameChange = event => {
        let { fieldValues } = this.state;
        fieldValues.set('locationName', event.target.value);
        this.setState({ fieldValues });
        if (this.getLocationNameValidationState() !== 'error' && this.state.addLocation) {
            this.setState({ addLocation: false });
        }
    }

    handleClassChange = event => {
        let { fieldValues } = this.state;
        fieldValues.set('class', event.target.value);
        this.setState({ fieldValues });
    }

    handleLatitudeChange = event => {
        let { fieldValues } = this.state;
        fieldValues.set('latitude', event.target.value);
        this.setState({ fieldValues });
    }

    handleLongitudeChange = event => {
        let { fieldValues } = this.state;
        fieldValues.set('longitude', event.target.value);
        this.setState({ fieldValues });
    }

    handleMapChange = event => {
        let { fieldValues } = this.state;
        fieldValues.set('map', event.target.value);
        this.setState({ fieldValues });
    }

    handleElevationChange = event => {
        let { fieldValues } = this.state;
        fieldValues.set('elevation', event.target.value);
        this.setState({ fieldValues });
    }

    handleDateChange = event => {
        if (event != null) {
            let { fieldValues } = this.state;
            fieldValues.set('date', event.substring(0, 10));
            this.setState({ fieldValues });
        }
    }

    getDateValue = () => {
        const date = this.state.fieldValues.get('date');
        if (date !== null && date !== undefined) {
            let dateArr = date.split('-');
            dateArr.push(dateArr.pop());
            dateArr.push(dateArr.pop());
            return dateArr.join('-');
        }
    }

    addFlowerTrigger = () => {
        this.setState({ addFlower: true })
    }

    addLocationTrigger = () => {
        this.setState({ addLocation: true });
    }

    checkFormValidation = () => {
        let validation = false;
        if (this.getFlowerNameValidationState() === 'success' && this.getSighterNameValidationState() === 'success' && this.getLocationNameValidationState() === 'success' && this.getDateValidationState() === 'success') {
            if (this.state.addFlower) {
                if (this.getGenusValidationState() === 'success' && this.getSpeciesValidationState() === 'success') {
                    validation = true;
                }
                else {
                    return false;
                }
            }
            if (this.state.addLocation) {
                if (this.state.getClassValidationState() === 'success' && this.getLatitudeValidationState() === 'success' && this.getLongitudeValidationState() === 'success' && this.getMapValidationState() === 'success' && this.getElevationValidationState() === 'success') {
                    validation = true;
                }
                else {
                    return false;
                }
            }
        }
        return validation;
    }

    getFlowerNameValidationState = () => {
        const flowerNameValue = (this.state.fieldValues.get('flowerName') || '').toLowerCase();
        if (this.state.flowerNames.includes(flowerNameValue) || this.state.addFlower) {
            return 'success';
        }
        else if (flowerNameValue === '') {
            return null;
        }
        return 'error';
    }

    getGenusValidationState = () => {
        const genusValue = this.state.fieldValues.get('genus') || '';
        if (genusValue !== '') {
            return 'success';
        }
        return null;
    }

    getSpeciesValidationState = () => {
        const speciesValue = this.state.fieldValues.get('species') || '';
        if (speciesValue !== '') {
            return 'success';
        }
        return null;
    }

    getSighterNameValidationState = () => {
        const sighterNameValue = this.state.fieldValues.get('sighter') || '';
        if (sighterNameValue !== '') {
            return 'success';
        }
        return null;
    }

    getLocationNameValidationState = () => {
        const locationNameValue = (this.state.fieldValues.get('locationName') || '').toLowerCase();
        if (this.state.flowerLocations.includes(locationNameValue) || this.state.addLocation) {
            return 'success';
        }
        else if (locationNameValue === '') {
            return null;
        }
        return 'error';
    }

    getClassValidationState = () => {
        const classValue = this.state.fieldValues.get('class') || '';
        if (classValue !== '') {
            return 'success';
        }
        return null;
    }

    getLatitudeValidationState = () => {
        const latitudeValue = this.state.fieldValues.get('latitude') || null;
        if (latitudeValue !== null) {
            const latitudeNum = parseInt(latitudeValue);
            if(!isNaN(latitudeNum) && isFinite(latitudeNum) && latitudeNum > 0 && latitudeNum % 1 === 0) {
                return 'success';
            }
            return 'error';
        }
        return null;
    }

    getLongitudeValidationState = () => {
        const longitudeValue = this.state.fieldValues.get('longitude') || null;
        if (longitudeValue !== null) {
            const longitudeNum = parseInt(longitudeValue);
            if(!isNaN(longitudeNum) && isFinite(longitudeNum) && longitudeNum > 0 && longitudeNum % 1 === 0) {
                return 'success';
            }
            return 'error'
        }
        return null;
    }

    getMapValidationState = () => {
        const mapValue = this.state.fieldValues.get('longitude') || '';
        if (mapValue !== '') {
            return 'success';
        }
        return null;
    }

    getElevationValidationState = () => {
        const elevationValue = this.state.fieldValues.get('elevation') || null;
        if (elevationValue !== null) {
            const elevationNum = parseInt(elevationValue);
            if(!isNaN(elevationNum) && isFinite(elevationNum) && elevationNum > 0 && elevationNum % 1 === 0) {
                return 'success';
            }
            return 'error';
        }
        return null;
    }

    getDateValidationState = () => {
        const date =  new Date(this.state.fieldValues.get('date') || '');
        if (Object.prototype.toString.call(date) === '[object Date]') {
            if(!isNaN(date.getTime())) {
                return 'success';
            }
            else if (!this.state.fieldValues.get('date')) {
                return null;
            }
            else {
                return 'error';
            }
        }
        else {
            return 'error';
        }
    }

    render() {
        const newFlowerForm = 
            <div className={styles.newFlowerForm}>
                <FormGroup controlId='genus' validationState={this.getGenusValidationState()}>
                    <ControlLabel>Genus</ControlLabel>
                    <FormControl type='text' value={this.state.fieldValues.get('genus') || ''} placeholder='Enter genus' onChange={this.handleGenusChange} />
                </FormGroup>
                <FormGroup controlId='species' validationState={this.getSpeciesValidationState()}>
                    <ControlLabel>Species</ControlLabel>
                    <FormControl type='text' value={this.state.fieldValues.get('species') || ''} placeholder='Enter species' onChange={this.handlespeciesChange} />
                </FormGroup>
            </div>
        const newLocationForm = 
            <div className={styles.newLocationForm}>
                <FormGroup controlId='class' validationState={this.getClassValidationState()}>
                    <ControlLabel>Class</ControlLabel>
                    <FormControl type='text' value={this.state.fieldValues.get('class') || ''} placeholder='Enter class' onChange={this.handleClassChange} />
                </FormGroup>
                <FormGroup controlId='latitude' validationState={this.getLatitudeValidationState()}>
                    <ControlLabel>Latitude</ControlLabel>
                    <FormControl type='number' value={this.state.fieldValues.get('latitude') || ''} placeholder='Enter latitude' onChange={this.handleLatitudeChange} />
                </FormGroup>
                <FormGroup controlId='longitude' validationState={this.getLongitudeValidationState()}>
                    <ControlLabel>Longitude</ControlLabel>
                    <FormControl type='number' value={this.state.fieldValues.get('longitude') || ''} placeholder='Enter longitude' onChange={this.handleLongitudeChange} />
                </FormGroup>
                <FormGroup controlId='map' validationState={this.getMapValidationState()}>
                    <ControlLabel>Map</ControlLabel>
                    <FormControl type='text' value={this.state.fieldValues.get('map') || ''} placeholder='Enter map' onChange={this.handleMapChange} />
                </FormGroup>
                <FormGroup controlId='elevation' validationState={this.getElevationValidationState()}>
                    <ControlLabel>Elevation</ControlLabel>
                    <FormControl type='number' value={this.state.fieldValues.get('elevation') || ''} placeholder='Enter elevation' onChange={this.handleElevationChange} />
                </FormGroup>
            </div>
        return (
            <Modal show={this.state.show} onHide={this.handleClose} className={styles.modal}>
                <Modal.Header closeButton>
                        <Modal.Title>Add a new flower sighting</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <FormGroup controlId='flowerName' validationState={this.getFlowerNameValidationState()}>
                            <ControlLabel>Flower Name</ControlLabel>
                            <FormControl type='text' value={this.state.fieldValues.get('flowerName') || ''} placeholder='Enter flower name' onChange={this.handleFlowerNameChange} />
                            <HelpBlock onClick={this.addFlowerTrigger} className={styles.flowerNameError}>{this.getFlowerNameValidationState() === 'error' && !this.state.addFlower ? `Flower name ${this.state.fieldValues.get('flowerName') || ''} not found. Click here to add the flower.` : ''}</HelpBlock>
                        </FormGroup>
                        {this.state.addFlower ? newFlowerForm : null}
                        <FormGroup controlId='sighterName' validationState={this.getSighterNameValidationState()}>
                            <ControlLabel>Sighter's Name</ControlLabel>
                            <FormControl type='text' value={this.state.fieldValues.get('sighter') || ''} placeholder="Enter sighter's name" onChange={this.handleSighterNameChange} />
                        </FormGroup>
                        <FormGroup controlId='location' validationState={this.getLocationNameValidationState()}>
                            <ControlLabel>Location</ControlLabel>
                            <FormControl type='text' value={this.state.fieldValues.get('locationName') || ''} placeholder='Enter location name' onChange={this.handleLocationNameChange} />
                            <HelpBlock onClick={this.addLocationTrigger} className={styles.locationNameError}>{this.getLocationNameValidationState() === 'error' && !this.state.addLocation ? `Location name ${this.state.fieldValues.get('locationName') || ''} not found. Click here to add the location.` : ''}</HelpBlock>
                        </FormGroup>
                        {this.state.addLocation ? newLocationForm : null}
                        <FormGroup controlId='date' validationState={this.getDateValidationState()}>
                            <ControlLabel>Date</ControlLabel>
                            <DatePicker value={this.getDateValue()} onChange={this.handleDateChange} dateFormat='MM/DD/YYYY' maxDate={new Date().toJSON()} />
                        </FormGroup>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => this.setState({ show: false })} className={`${styles.closeButton} pull-left`}>Close</Button>
                    <Button onClick={() => this.handleAdd} className={`${styles.addButton} pull-right`} bsStyle='primary' disabled={!this.checkFormValidation()}>+ Add</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default NewSightingModal;