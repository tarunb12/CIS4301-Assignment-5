import React, { Component } from 'react';
import { DropdownButton, FormControl, InputGroup } from 'react-bootstrap';
import styles from './updateflowermodal.css'

class CustomControl extends Component {
    render() {
        const { value, placeholder, selectedDate, dateDropdownItems, ...rest } = this.props;
        return (
            <InputGroup>
                <FormControl {...rest} value={value} placeholder={placeholder} className={styles.formControl} />
                <DropdownButton id='input-dropdown-addon' componentClass={InputGroup.Button} title={selectedDate || 'Select Date'}>
                    {dateDropdownItems}
                </DropdownButton>
            </InputGroup>
        );
    }
}

export default CustomControl;