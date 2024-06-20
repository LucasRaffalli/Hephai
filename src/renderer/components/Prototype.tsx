/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import '@styles/invoiceFrom.scss';
import '@radix-ui/themes/styles.css';
import Button from '@mui/material/Button';
import { FormControlLabel, FormGroup, Switch } from '@mui/material';


const Prototype: React.FC = () => {


    return (
        <>
            <Button variant="contained">Hello world</Button>
            <Button variant="outlined">Outlined</Button>
            <FormGroup>
                <FormControlLabel control={<Switch defaultChecked />} label="Label" />
                <FormControlLabel required control={<Switch />} label="Required" />
                <FormControlLabel disabled control={<Switch />} label="Disabled" />
            </FormGroup>
        </>
    );
};

export default Prototype;
