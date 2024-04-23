import React from 'react';
import { TextField, MenuItem } from '@mui/material';

const LocationDropdown = ({ value, onChange, locations }) => {
    return (
        <TextField
            select
            label="Location"
            value={value}
            onChange={onChange}
            fullWidth
            required
            variant="standard"
        >
            {locations.map((location, index) => (
                <MenuItem key={index} value={location}>
                    {location}
                </MenuItem>
            ))}
        </TextField>
    );
};

export default LocationDropdown;
