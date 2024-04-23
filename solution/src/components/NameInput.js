import React from 'react';
import { TextField } from '@mui/material';

const NameInput = ({ value, onChange, error, helperText }) => {
    return (
        <TextField
            label="Name"
            value={value}
            onChange={onChange}
            error={error}
            helperText={helperText}
            fullWidth
            required
            variant="standard"
        />
    );
};

export default NameInput;
