import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { Button, ControlLabel, FormControl, FormGroup, MenuItem, Modal, Panel, DropdownButton, InputGroup } from 'react-bootstrap';
import DatePicker from 'react-16-bootstrap-date-picker';
import CustomControl from './customcontrol';
import styles from './updateflowermodal.css';

class UpdateFlowerModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dateDropdownItems: [],
            fieldValues: new Map(),
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
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.show !== this.state.show) {
            this.setState({ show: nextProps.show })
        }
    }

    getInfoFromDb = () => {
        this.getFlowerNameInfoFromDb();
        this.getFlowerSightingInfoFromDb();
    }

    getFlowerSightingInfoFromDb = () => {
        axios.get(`/api/getFlowerSightingInfo/${this.props.flowerName}`)
        .then(res => this.setState({ flowerSightingInfo: res.data.data }))
        .then(() => this.createDropdownItems());
    }

    getFlowerNameInfoFromDb = () => {
        axios.get(`/api/getFlowerNameInfo/${this.props.flowerName}`)
        .then(res => this.setState({ flowerNameInfo: res.data.data[0] }));
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
        this.setState({ selectedSighter: sighter, selectionPriority: newSelectionPriority }, () => this.updateDropdownItems());
        this.updateDropdownItems('sighter');
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
        this.setState({ selectedLocationName: locationName, selectionPriority: newSelectionPriority }, () => this.updateDropdownItems());
        this.updateDropdownItems('locationName');
    }

    setDateStateAndUpdate = date => {
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
        this.setState({ selectedDate: date, selectionPriority: newSelectionPriority }, () => this.updateDropdownItems());
        this.updateDropdownItems('date');
    }

    updateDropdownItems = () => {
        this.updateSightersDropdownItems();
        this.updateLocationNameDropdownItems();
        this.updateDateDropdownItems();
    }

    updateSightersDropdownItems = () => {
        const priority = this.state.selectionPriority.indexOf('sighter');
        const sighters = this.state.flowerSightingInfo
            .map(sightingInfo => sightingInfo.PERSON) // map person property to sighters
            .filter((value, index, self) => self.indexOf(value) === index); // remove duplicates
        let sightersDropdownItems = [<MenuItem key='All Sighters' onClick={() => this.setSighterStateAndUpdate('All Sighters')}>All Sighters</MenuItem>];
    }

    updateLocationNameDropdownItems = () => {
        const locations = this.state.flowerSightingInfo
            .map(sightingInfo => sightingInfo.LOCATION) // map location property to locations
            .filter((value, index, self) => self.indexOf(value) === index); // remove duplicates
        const priority = this.state.selectionPriority.indexOf('locationName');
    }

    updateDateDropdownItems = () => {
        const dates = this.state.flowerSightingInfo
            .map(sightingInfo => {
                let dateArr = sightingInfo.SIGHTED.split('-');
                const [ year, month, day ] = dateArr;
                dateArr = [ month, day, year ];
                return dateArr.join('/'); // reformat date and map to date property to dates
            }).filter((value, index, self) => self.indexOf(value) === index); // remove duplicates
        let dateDropdownItems = [<MenuItem key='All Dates' onClick={() => this.setDateStateAndUpdate('All Dates')}>All Dates</MenuItem>];

        const priority = this.state.selectionPriority.indexOf('date');
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

    handleClose = () => {
        this.setState({ show: false });
        this.props.handleClose();
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

    checkFormValidation = () => {
        return false;
    }

    render() {
        if (this.state.show && this.state.flowerSightingInfo.length === 0 && _.isEmpty(this.state.flowerNameInfo)) this.getInfoFromDb();
        return (
            <Modal show={this.state.show} onHide={this.props.handleClose} className={styles.modal}>
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
                                <FormGroup id='flowerName'>
                                    <ControlLabel>Flower Name</ControlLabel>
                                    <FormControl type='text' value={this.state.fieldValues.get('flowerName') || ''} onChange={this.handleFlowerNameChange} placeholder={this.state.flowerNameInfo.COMNAME} />
                                </FormGroup>
                                <FormGroup id='genus'>
                                    <ControlLabel>Flower Genus</ControlLabel>
                                    <FormControl type='text' value={this.state.fieldValues.get('genus') || ''} onChange={this.handleGenusChange} placeholder={this.state.flowerNameInfo.GENUS} />
                                </FormGroup>
                                <FormGroup id='species'>
                                    <ControlLabel>Flower Species</ControlLabel>
                                    <FormControl type='text' value={this.state.fieldValues.get('species') || ''} onChange={this.handleSpeciesChange} placeholder={this.state.flowerNameInfo.SPECIES} />
                                </FormGroup>
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
                                <FormGroup id='sighter'>
                                    <ControlLabel>Sighter Name</ControlLabel>
                                    <InputGroup>
                                        <FormControl type='text' value={this.state.fieldValues.get('sighter') || ''} onChange={this.handleSighterChange} placeholder={this.state.selectedSighter !== null ? `Enter sighter's name to replace ${this.state.selectedSighter === 'All Sighters' ? this.state.selectedSighter.toLowerCase() : this.state.selectedSighter}` : ''} />
                                        <DropdownButton id='input-dropdown-addon' componentClass={InputGroup.Button} title={this.state.selectedSighter || 'Select Sighter'}>
                                            {this.state.sightersDropdownItems}
                                        </DropdownButton>
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup id='location'>
                                    <ControlLabel>Location Name</ControlLabel>
                                    <InputGroup>
                                        <FormControl type='text' value={this.state.fieldValues.get('locationName') || ''} onChange={this.handleLocationNameChange} placeholder={this.state.selectedLocationName !== null ? `Enter location name to replace ${this.state.selectedLocationName === 'All Locations' ? this.state.selectedLocationName.toLowerCase() : this.state.selectedLocationName}` : ''} />
                                        <DropdownButton id='input-dropdown-addon' componentClass={InputGroup.Button} title={this.state.selectedLocationName || 'Select Location'}>
                                            {this.state.locationNameDropdownItems}
                                        </DropdownButton>
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup id='date'>
                                    <ControlLabel>Date</ControlLabel>
                                    <DatePicker customControl={<CustomControl dateDropdownItems={this.state.dateDropdownItems} selectedDate={this.state.selectedDate} />} />
                                </FormGroup>
                                <Button onClick={() => this.setState({ selectedDate: null, selectedLocationName: null, selectedSighter: null })} className={`${styles.resetButton} pull-right`}>Reset</Button>
                            </Panel.Body>
                        </Panel.Collapse>
                    </Panel>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.handleClose} className={`${styles.closeButton} pull-left`}>Close</Button>
                    <Button onClick={() => this.handleUpdate} className={`${styles.updateButton} pull-right`} bsStyle='primary' disabled={!this.checkFormValidation()}>Update</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default UpdateFlowerModal;