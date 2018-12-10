import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';

import { Button, ControlLabel, FormControl, FormGroup, MenuItem, Modal, Panel, DropdownButton, InputGroup, Table } from 'react-bootstrap';
import DatePicker from 'react-16-bootstrap-date-picker';
import styles from './updateflowermodal.css';

const initialState = {
    dateDropdownItems: [],
    fieldValues: new Map(),
    flowerDropdownSightingInfo: [],
    flowerLocations: [],
    flowerNameInfo: {},
    flowerNamePanelOpen: false,
    flowerSightingInfo: [],
    flowerSightingPanelOpen: false,
    locationNameDropdownItems: [],
    selectedDate: null,
    selectedLocationName: null,
    selectedSighter: null,
    selectionPriority: new Array(3).fill(null),
    show: false,
    sightersDropdownItems: []
}

class UpdateFlowerModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dateDropdownItems: [],
            fieldValues: new Map(),
            flowerDropdownSightingInfo: [],
            flowerLocations: [],
            flowerNameInfo: {},
            flowerNamePanelOpen: false,
            flowerSightingInfo: [],
            flowerSightingPanelOpen: false,
            locationNameDropdownItems: [],
            selectedDate: null,
            selectedLocationName: null,
            selectedSighter: null,
            selectionPriority: new Array(3).fill(null),
            show: false,
            sightersDropdownItems: []
        };
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.show !== this.state.show) {
            this.setState({ show: nextProps.show })
        }
    }

    getInfoFromDb = () => {
        this.getFlowerNameInfoFromDb();
        this.getFlowerSightingInfoFromDb();
        this.getFlowerLocationsFromDb();
    }

    getFlowerSightingInfoFromDb = () => {
        axios.get(`/api/getFlowerSightingInfo/${this.props.flowerName}`)
        .then(res => this.setState({ flowerSightingInfo: res.data.data, flowerDropdownSightingInfo: res.data.data }))
        .then(() => this.createDropdownItems());
    }

    getFlowerNameInfoFromDb = () => {
        axios.get(`/api/getFlowerNameInfo/${this.props.flowerName}`)
        .then(res => this.setState({ flowerNameInfo: res.data.data[0] }));
    }

    getFlowerLocationsFromDb = () => {
        axios.get('/api/getFlowerLocations')
        .then(res => this.setState({ flowerLocations: res.data.data.map(location => location.LOCATION) }));
    }

    updateFlowerNameInfoInDb = () => {
        const flowerName = this.state.flowerNameInfo.COMNAME;
        const newFlowerName = this.state.fieldValues.get('flowerName').toLowerCase().charAt(0).toUpperCase() || this.state.flowerNameInfo.COMNAME;
        const newFlowerGenus = this.state.fieldValues.get('genus').toLowerCase().charAt(0).toUpperCase() || this.state.flowerNameInfo.GENUS;
        const newFlowerSpecies = this.state.fieldValues.get('species').toLowerCase() || this.state.flowerNameInfo.SPECIES;
        axios.put(`/api/updateFlowerNameInfo/${flowerName}/${newFlowerName}/${newFlowerGenus}/${newFlowerSpecies}`)
        .then(this.props.reloadFlowerNameInfo());
    }

    updateFlowerSightingInfoInDb = () => {
        const flowerName = this.state.flowerNameInfo.COMNAME;
        const tuplesToUpdate = this.state.flowerDropdownSightingInfo.map(sighting => [ flowerName, sighting.PERSON, sighting.LOCATION, sighting.SIGHTED ]);
        let updatedTuples = [];
        for (let i = 0; i < tuplesToUpdate.length; i++) {
            const sighting = tuplesToUpdate[i];
            const updatedSighter = this.state.fieldValues.get('sighter') || sighting[1];
            const formattedSighter = `${updatedSighter.charAt(0).toUpperCase()}${updatedSighter.slice(1).toLowerCase()}`;
            const updatedLocation = this.state.fieldValues.get('locationName') || sighting[2];
            let formattedLocation = updatedLocation;
            const updatedDate = this.state.fieldValues.get('date') || sighting[3];
            this.state.flowerLocations.forEach(location => {
                if (location.toLowerCase() === formattedLocation.toLowerCase()) {
                    formattedLocation = location;
                }
            })
            updatedTuples[i] = [ flowerName, formattedSighter, formattedLocation, updatedDate ];
        }
        for (let i = 0; i < tuplesToUpdate.length; i++) {
            const oldSighting = tuplesToUpdate[i];
            const newSighting = updatedTuples[i];
            const [ oldName, oldSighter, oldLocation, oldDate ] = oldSighting;
            const [ newName, newSighter, newLocation, newDate ] = newSighting;
            axios.post('/api/updateFlowerSightingInfo', {
                flowerName,
                oldSighting: {
                    oldSighter, oldLocation, oldDate
                },
                newSighting: {
                    newSighter, newLocation, newDate
                }
            });
        }
    }

    handleUpdate = () => {
        console.log('update !');
        if (this.getFlowerSightingInfoValidationState()) {
            this.updateFlowerSightingInfoInDb();
        }
        if (this.getFlowerNameInfoUpdateValidationState()) {
            // this.updateFlowerNameInfoInDb();
        }
        this.handleClose();
    }

    handleClose = () => {
        this.setState(initialState);
        this.props.handleClose();
    }

    createFlowerNameTable = () => {
        const flowerName = this.state.flowerNameInfo.COMNAME;
        const flowerGenus = this.state.flowerNameInfo.GENUS;
        const flowerSpecies = this.state.flowerNameInfo.SPECIES;
        const newFlowerName = this.state.fieldValues.get('flowerName') || flowerName;
        const newGenus = this.state.fieldValues.get('genus') || flowerGenus;
        const newSpecies = this.state.fieldValues.get('species') || flowerSpecies;
        const flowerNameData = flowerName === newFlowerName ? flowerName : `${flowerName} \u2192 ${newFlowerName}`;
        const flowerGenusData = flowerGenus === newGenus ? flowerGenus : `${flowerGenus} \u2192 ${newGenus}`;
        const flowerSpeciesData = flowerSpecies === newSpecies ? flowerSpecies : `${flowerSpecies} \u2192 ${newSpecies}`;
        const flowerNameCell = <td key='flowerName'>{flowerNameData}</td>;
        const flowerGenusCell = <td key='genus'>{flowerGenusData}</td>;
        const flowerSpeciesCell = <td key='species'>{flowerSpeciesData}</td>;
        const tableBody = <tr>{[flowerNameCell, flowerGenusCell, flowerSpeciesCell]}</tr>;
        return (
            <Table hover bordered>
                <thead>
                    <tr>
                        <th>Flower Name</th>
                        <th>Genus</th>
                        <th>Species</th>
                    </tr>
                </thead>
                <tbody>
                    {tableBody}
                </tbody>
            </Table>
        );
    }

    createFlowerSightingsTable = () => {
        const { flowerDropdownSightingInfo } = this.state;
        let tableBody = [];
        for (let i = 0; i < flowerDropdownSightingInfo.length; i++) {
            const sighting = flowerDropdownSightingInfo[i];
            const sighter = sighting.PERSON;
            const locationName = sighting.LOCATION;
            const date = sighting.SIGHTED;
            const enteredSighter = this.state.fieldValues.get('sighter') || sighter;
            const enteredLocationName = this.state.fieldValues.get('locationName') || locationName;
            const enteredDate = this.state.fieldValues.get('date') || date;

            const sighterData = sighter === enteredSighter ? sighter : `${sighter} \u2192 ${enteredSighter}`;
            const locationNameData = locationName === enteredLocationName ? locationName : `${locationName} \u2192 ${enteredLocationName}`;
            const dateData = date === enteredDate ? date : `${date} \u2192 ${enteredDate}`;
            const sighterCell = <td key={`${sighter} Person ${i}`}>{sighterData}</td>;
            const locationNameCell = <td key={`${locationName} Location ${i}`}>{locationNameData}</td>;
            const dateCell = <td key={`${date} Date ${i}`}>{dateData}</td>;

            tableBody.push(
                <tr key={i}>{[sighterCell, locationNameCell, dateCell]}</tr>
            );
        }
        return (
            <Table hover bordered>
                <thead>
                    <tr>
                        <th>Sighter</th>
                        <th>Location</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {tableBody}
                </tbody>
            </Table>
        );
    }

    setSighterStateAndUpdate = sighter => {
        const { selectionPriority } = this.state;
        let newSelectionPriority = selectionPriority.filter(entry => entry !== null);
        if (!newSelectionPriority.includes('sighter') && !(sighter === 'All Sighters')) {
            newSelectionPriority.push('sighter');
        }
        else if (newSelectionPriority.includes('sighter') && sighter === 'All Sighters') {
            newSelectionPriority = newSelectionPriority.filter(entry => entry !== 'sighter');
        }
        const nullArr = newSelectionPriority.length < 3 ? new Array(3 - newSelectionPriority.length).fill(null) : [];
        newSelectionPriority = nullArr.length === 0 ? newSelectionPriority : [ ...newSelectionPriority, ...nullArr ];
        const refreshedFlowerSightingInfo = this.state.flowerSightingInfo;
        this.setState({ selectedSighter: sighter, selectionPriority: newSelectionPriority, flowerDropdownSightingInfo: refreshedFlowerSightingInfo }, () => this.updateDropdownItems());
    }

    setLocationNameStateAndUpdate = locationName => {
        const { selectionPriority } = this.state;
        let newSelectionPriority = selectionPriority.filter(entry => entry !== null);
        if (!newSelectionPriority.includes('locationName') && !(locationName === 'All Locations')) {
            newSelectionPriority.push('locationName');
        }
        else if (newSelectionPriority.includes('locationName') && locationName === 'All Locations') {
            newSelectionPriority = newSelectionPriority.filter(entry => entry !== 'locationName');
        }
        const nullArr = newSelectionPriority.length < 3 ? new Array(3 - newSelectionPriority.length).fill(null) : [];
        newSelectionPriority = nullArr.length === 0 ? newSelectionPriority : [ ...newSelectionPriority, ...nullArr ];
        const refreshedFlowerSightingInfo = this.state.flowerSightingInfo;
        this.setState({ selectedLocationName: locationName, selectionPriority: newSelectionPriority, flowerDropdownSightingInfo: refreshedFlowerSightingInfo }, () => this.updateDropdownItems());
    }

    setDateStateAndUpdate = date => {
        let dateArr = date.split('/');
        const [ month, day, year ] = dateArr;
        dateArr = [ year, month, day ];
        const reformattedDate = dateArr.join('-');
        const { selectionPriority } = this.state;
        let newSelectionPriority = selectionPriority.filter(entry => entry !== null);
        if (!newSelectionPriority.includes('date') && !(date === 'All Dates')) {
            newSelectionPriority.push('date');
        }
        else if (newSelectionPriority.includes('date') && date === 'All Dates') {
            newSelectionPriority = newSelectionPriority.filter(entry => entry !== 'date');
        }
        const nullArr = newSelectionPriority.length < 3 ? new Array(3 - newSelectionPriority.length).fill(null) : [];
        newSelectionPriority = nullArr.length === 0 ? newSelectionPriority : [ ...newSelectionPriority, ...nullArr ];
        const refreshedFlowerSightingInfo = this.state.flowerSightingInfo;
        this.setState({ selectedDate: reformattedDate, selectionPriority: newSelectionPriority, flowerDropdownSightingInfo: refreshedFlowerSightingInfo }, () => this.updateDropdownItems());
    }

    updateDropdownItems = () => {
        const [ sighterPriority, locationNamePriority, datePriority ] = [
            this.state.selectionPriority.indexOf('sighter') === -1 ? 3 : this.state.selectionPriority.indexOf('sighter'),
            this.state.selectionPriority.indexOf('locationName') === -1 ? 4 : this.state.selectionPriority.indexOf('locationName'),
            this.state.selectionPriority.indexOf('date') === -1 ? 5 : this.state.selectionPriority.indexOf('date')
        ];
        let priorities = {};
        priorities[sighterPriority] = flowerDropdownSightingInfo => this.updateSightersDropdownItems(flowerDropdownSightingInfo);
        priorities[locationNamePriority] = flowerDropdownSightingInfo => this.updateLocationNameDropdownItems(flowerDropdownSightingInfo);
        priorities[datePriority] = flowerDropdownSightingInfo => this.updateDateDropdownItems(flowerDropdownSightingInfo);
        let flowerDropdownSightingInfo = this.state.flowerDropdownSightingInfo;
        Object.entries(priorities).forEach(([key, value]) => {
            flowerDropdownSightingInfo = value(flowerDropdownSightingInfo);
        })
        this.setState({ flowerDropdownSightingInfo });
    }

    updateSightersDropdownItems = flowerDropdownSightingInfo => {
        const sighters = flowerDropdownSightingInfo
            .map(sightingInfo => sightingInfo.PERSON) // map person property to sighters
            .filter((value, index, self) => self.indexOf(value) === index); // remove duplicates
        let sightersDropdownItems = [<MenuItem key='All Sighters' onClick={() => this.setSighterStateAndUpdate('All Sighters')}>All Sighters</MenuItem>];
        sighters.forEach(sighter => sightersDropdownItems.push(<MenuItem key={sighter} onClick={() => this.setSighterStateAndUpdate(sighter)}>{sighter}</MenuItem>));
        const newFlowerDropdownSightingInfo = flowerDropdownSightingInfo.filter(info => {
            if (this.state.selectedSighter === null) {
                return true;
            }
            return info.PERSON === this.state.selectedSighter;
        });
        this.setState({ sightersDropdownItems });
        return newFlowerDropdownSightingInfo;
    }

    updateLocationNameDropdownItems = flowerDropdownSightingInfo => {
        const locations = flowerDropdownSightingInfo
            .map(sightingInfo => sightingInfo.LOCATION) // map location property to locations
            .filter((value, index, self) => self.indexOf(value) === index); // remove duplicates
        let locationNameDropdownItems = [<MenuItem key='All Locations' onClick={() => this.setLocationNameStateAndUpdate('All Locations')}>All Locations</MenuItem>];
        locations.forEach(location => locationNameDropdownItems.push(<MenuItem key={location} onClick={() => this.setLocationNameStateAndUpdate(location)}>{location}</MenuItem>));
        const newFlowerDropdownSightingInfo = flowerDropdownSightingInfo.filter(info => {
            if (this.state.selectedLocationName === null) {
                return true;
            }
            return info.LOCATION === this.state.selectedLocationName;
        });
        this.setState({ locationNameDropdownItems });
        return newFlowerDropdownSightingInfo;
    }

    updateDateDropdownItems = flowerDropdownSightingInfo => {
        const dates = flowerDropdownSightingInfo
            .map(sightingInfo => {
                let dateArr = sightingInfo.SIGHTED.split('-');
                const [ year, month, day ] = dateArr;
                dateArr = [ month, day, year ];
                return dateArr.join('/'); // reformat date and map to date property to dates
            }).filter((value, index, self) => self.indexOf(value) === index); // remove duplicates
        let dateDropdownItems = [<MenuItem key='All Dates' onClick={() => this.setDateStateAndUpdate('All Dates')}>All Dates</MenuItem>];
        dates.forEach(date => dateDropdownItems.push(<MenuItem key={date} onClick={() => this.setDateStateAndUpdate(date)}>{date}</MenuItem>))
        const newFlowerDropdownSightingInfo = flowerDropdownSightingInfo.filter(info => {
            if (this.state.selectedDate === null) {
                return true;
            }
            return info.SIGHTED === this.state.selectedDate;
        });
        this.setState({ dateDropdownItems });
        return newFlowerDropdownSightingInfo;
    }

    createDropdownItems = () => {
        this.createSightersDropdownItems();
        this.createLocationNameDropdownItems();
        this.createDateDropdownItems();
    }

    createSightersDropdownItems = () => {
        const sighters = this.state.flowerSightingInfo
            .map(sightingInfo => sightingInfo.PERSON) // map person property to sighters
            .filter((value, index, self) => self.indexOf(value) === index); // remove duplicates
        let sightersDropdownItems = [<MenuItem key='All Sighters' onClick={() => this.setSighterStateAndUpdate('All Sighters')}>All Sighters</MenuItem>];
        sighters.forEach(sighter => sightersDropdownItems.push(<MenuItem key={sighter} onClick={() => this.setSighterStateAndUpdate(sighter)}>{sighter}</MenuItem>));
        this.setState({ sightersDropdownItems });
    }

    createLocationNameDropdownItems = () => {
        const locations = this.state.flowerSightingInfo
            .map(sightingInfo => sightingInfo.LOCATION) // map location property to locations
            .filter((value, index, self) => self.indexOf(value) === index); // remove duplicates
        let locationNameDropdownItems = [<MenuItem key='All Locations' onClick={() => this.setLocationNameStateAndUpdate('All Locations')}>All Locations</MenuItem>];
        locations.forEach(location => locationNameDropdownItems.push(<MenuItem key={location} onClick={() => this.setLocationNameStateAndUpdate(location)}>{location}</MenuItem>));
        this.setState({ locationNameDropdownItems });
    }

    createDateDropdownItems = () => {
        const dates = this.state.flowerSightingInfo
            .map(sightingInfo => {
                let dateArr = sightingInfo.SIGHTED.split('-');
                const [ year, month, day ] = dateArr;
                dateArr = [ month, day, year ];
                return dateArr.join('/'); // reformat date and map to date property to dates
            }).filter((value, index, self) => self.indexOf(value) === index); // remove duplicates
        let dateDropdownItems = [<MenuItem key='All Dates' onClick={() => this.setDateStateAndUpdate('All Dates')}>All Dates</MenuItem>];
        dates.forEach(date => dateDropdownItems.push(<MenuItem key={date} onClick={() => this.setDateStateAndUpdate(date)}>{date}</MenuItem>))
        this.setState({ dateDropdownItems });
    }

    handleFlowerNameChange = event => {
        let { fieldValues } = this.state;
        fieldValues.set('flowerName', event.target.value);
        this.setState({ fieldValues });
    }

    handleGenusChange = event => {
        let { fieldValues } = this.state;
        fieldValues.set('genus', event.target.value);
        this.setState({ fieldValues });
    }

    handleSpeciesChange = event => {
        let { fieldValues } = this.state;
        fieldValues.set('species', event.target.value);
        this.setState({ fieldValues });
    }

    handleSighterChange = event => {
        let { fieldValues } = this.state;
        fieldValues.set('sighter', event.target.value);
        this.setState({ fieldValues });
    }

    handleLocationNameChange = event => {
        let { fieldValues } = this.state;
        fieldValues.set('locationName', event.target.value);
        this.setState({ fieldValues });
    }

    handleDateChange = date => {
        if (date != null) {
            let { fieldValues } = this.state;
            fieldValues.set('date', date.substring(0, 10));
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

    formattedSelectedDate = () => {
        const selectedDate = this.state.selectedDate;
        let dateArr = selectedDate.split('-');
        const [ year, month, day ] = dateArr;
        dateArr = [ month, day, year ];
        return dateArr.join('/');
    }

    checkFormValidation = () => {
        if (this.getFlowerNameValidationState() === 'success' || this.getGenusValidationState() === 'success' || this.getSpeciesValidationState() === 'success' || this.getSighterValidationState() === 'success' || this.getLocationNameValidationState() === 'success' || this.getDateValidationState() === 'success') {
            return true;
        }
        return false;
    }

    getFlowerNameValidationState = () => {
        const flowerName = this.state.fieldValues.get('flowerName') || '';
        if (flowerName !== '') {
            return 'success';
        }
        return null;
    }

    getGenusValidationState = () => {
        const genus = this.state.fieldValues.get('genus') || '';
        if (genus !== '') {
            return 'success';
        }
        return null;
    }

    getSpeciesValidationState = () => {
        const species = this.state.fieldValues.get('species') || '';
        if (species !== '') {
            return 'success';
        }
        return null;
    }

    getSighterValidationState = () => {
        const sighter = this.state.fieldValues.get('sighter') || '';
        if (sighter !== '') {
            return 'success';
        }
        return null;
    }

    getLocationNameValidationState = () => {
        const locationNameValue = (this.state.fieldValues.get('locationName') || '').toLowerCase();
        if (this.state.flowerLocations.map(location => location.toLowerCase()).includes(locationNameValue)) {
            return 'success';
        }
        else if (locationNameValue === '') {
            return null;
        }
        return 'error';    
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

    getFlowerNameInfoUpdateValidationState = () => {
        if (this.getFlowerNameValidationState() === 'success' || this.getGenusValidationState() === 'success' || this.getSpeciesValidationState() === 'success') {
            return true;
        }
        return false;
    }

    getFlowerSightingInfoValidationState = () => {
        if (this.getSighterValidationState() === 'success' || this.getLocationNameValidationState() === 'success' || this.getDateValidationState() === 'success') {
            if (this.getSighterValidationState() !== 'error' && this.getLocationNameValidationState() !== 'error' && this.getDateValidationState() !== 'error') {
                return true;
            }
        }
        return false;
    }

    render() {
        if (this.state.show && this.state.flowerSightingInfo.length === 0 && _.isEmpty(this.state.flowerNameInfo)) this.getInfoFromDb();
        const flowerNameTable = this.getFlowerNameInfoUpdateValidationState() ? this.createFlowerNameTable() : null;
        const flowerSightingTable = this.getFlowerSightingInfoValidationState() ? this.createFlowerSightingsTable() : null;
        
        return (
            <Modal show={this.state.show} onHide={this.handleClose} className={styles.modal}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Flower: {this.props.flowerName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Panel bsStyle='success' expanded={this.state.flowerNamePanelOpen} onToggle={() => this.setState({ flowerNamePanelOpen: !this.state.flowerNamePanelOpen })}>
                        <Panel.Heading>
                            <Panel.Title toggle>
                                Update Flower Naming Info
                            </Panel.Title>
                        </Panel.Heading>
                        <Panel.Collapse>
                            <Panel.Body>
                                <FormGroup id='flowerName' validationState={this.getFlowerNameValidationState()}>
                                    <ControlLabel>Flower Name</ControlLabel>
                                    <FormControl type='text' value={this.state.fieldValues.get('flowerName') || ''} onChange={this.handleFlowerNameChange} placeholder={this.state.flowerNameInfo.COMNAME} />
                                </FormGroup>
                                <FormGroup id='genus' validationState={this.getGenusValidationState()}>
                                    <ControlLabel>Flower Genus</ControlLabel>
                                    <FormControl type='text' value={this.state.fieldValues.get('genus') || ''} onChange={this.handleGenusChange} placeholder={this.state.flowerNameInfo.GENUS} />
                                </FormGroup>
                                <FormGroup id='species' validationState={this.getDateValidationState()}>
                                    <ControlLabel>Flower Species</ControlLabel>
                                    <FormControl type='text' value={this.state.fieldValues.get('species') || ''} onChange={this.handleSpeciesChange} placeholder={this.state.flowerNameInfo.SPECIES} />
                                </FormGroup>
                                {flowerNameTable}
                            </Panel.Body>
                        </Panel.Collapse>
                    </Panel>
                    <Panel bsStyle='success' expanded={this.state.flowerSightingPanelOpen} onToggle={() => this.setState({ flowerSightingPanelOpen: !this.state.flowerSightingPanelOpen })}>
                        <Panel.Heading>
                            <Panel.Title toggle>
                                Update Flower Sighting Info
                            </Panel.Title>
                        </Panel.Heading>
                        <Panel.Collapse>
                            <Panel.Body>
                                <FormGroup id='sighter' validationState={this.getSighterValidationState()}>
                                    <ControlLabel>Sighter Name</ControlLabel>
                                    <InputGroup>
                                        <FormControl type='text' value={this.state.fieldValues.get('sighter') || ''} onChange={this.handleSighterChange} placeholder={this.state.selectedSighter !== null ? `Enter sighter's name to replace ${this.state.selectedSighter === 'All Sighters' ? this.state.selectedSighter.toLowerCase() : this.state.selectedSighter}` : ''} />
                                        <DropdownButton id='input-dropdown-addon' componentClass={InputGroup.Button} title={this.state.selectedSighter || 'Select Sighter'}>
                                            {this.state.sightersDropdownItems}
                                        </DropdownButton>
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup id='location' validationState={this.getLocationNameValidationState()}>
                                    <ControlLabel>Location Name</ControlLabel>
                                    <InputGroup>
                                        <FormControl type='text' value={this.state.fieldValues.get('locationName') || ''} onChange={this.handleLocationNameChange} placeholder={this.state.selectedLocationName !== null ? `Enter location name to replace ${this.state.selectedLocationName === 'All Locations' ? this.state.selectedLocationName.toLowerCase() : this.state.selectedLocationName}` : ''} />
                                        <DropdownButton id='input-dropdown-addon' componentClass={InputGroup.Button} title={this.state.selectedLocationName || 'Select Location'}>
                                            {this.state.locationNameDropdownItems}
                                        </DropdownButton>
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup id='date' validationState={this.getDateValidationState()}>
                                    <ControlLabel>Date</ControlLabel>
                                    <InputGroup>
                                        <DatePicker maxDate={new Date().toJSON()} dateFormat='MM/DD/YYYY' onChange={this.handleDateChange} value={this.state.fieldValues.get('date') || ''} customControl={
                                            <FormControl type='text' placeholder='MM/DD/YYYY' />
                                        }/>
                                    <DropdownButton id='input-dropdown-addon' componentClass={InputGroup.Button} title={this.state.selectedDate === null ? 'Select Date' : this.formattedSelectedDate()}>
                                        {this.state.dateDropdownItems}
                                    </DropdownButton>
                                </InputGroup>
                                </FormGroup>
                                <Button onClick={() => this.setState({ selectedDate: null, selectedLocationName: null, selectedSighter: null })} className={`${styles.resetButton} pull-right`}>Reset</Button>
                                {flowerSightingTable}
                            </Panel.Body>
                        </Panel.Collapse>
                    </Panel>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.handleClose} className={`${styles.closeButton} pull-left`}>Close</Button>
                    <Button onClick={this.handleUpdate} className={`${styles.updateButton} pull-right`} bsStyle='primary' disabled={!this.checkFormValidation()}>Update</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default UpdateFlowerModal;