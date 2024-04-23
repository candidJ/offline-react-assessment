import React, { useState, useEffect, useRef } from 'react';
import { Container, Stack, Grid, Button } from '@mui/material';
import { getLocations, isNameValid } from '../mock-api/apis';
import DataTable from '../components/DataTable';
import NameInput from '../components/NameInput';
import LocationDropdown from '../components/LocationDropDown';

const OfflineReactAssessment = () => {
    const [inputName, setInputName] = useState('');
    const [inputNameError, setInputNameError] = useState('');
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [nameLocationRows, setNameLocationRows] = useState([]);

    useEffect(() => {
        // Fetch locations from mock-api/apis.js
        const fetchLocations = async () => {
            try {
                const response = await getLocations();
                setLocations(response);
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };
        fetchLocations();

        return () => {
            // clear debounce timeout
            clearTimeout(debounceTimeoutRef.current);
        };
    }, []);

    // Initialize a ref to hold the debounce timeout
    const debounceTimeoutRef = useRef(null);

    /**
     * As a request to validate name is made on each user input, 
     * debounce ensures that a function is only executed after a certain period of inactivity (800 milliseconds)
     * 
     * @param {*} event 
     */
    const onNameChange = async (event) => {
        const newName = event.target.value;
        setInputName(newName);

        // Clear previous timeout to debounce inputName validation
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        // Debounce inputName validation
        debounceTimeoutRef.current = setTimeout(async () => {
            try {
                const response = await isNameValid(newName);
                if (response) {
                    setInputNameError('');
                } else {
                    setInputNameError('Name is already taken');
                }
            } catch (error) {
                console.error('Error validating input name', error);
            }
        }, 800);

    };

    const handleLocationChange = (event) => {
        setSelectedLocation(event.target.value);
    };

    const addNewNameLocationRow = () => {
        if (!inputNameError) {
            setNameLocationRows([...nameLocationRows, { id: window.crypto.randomUUID(), inputName, selectedLocation }]);
            clearUserInputs();
        }
    };

    const clearUserInputs = () => {
        setSelectedLocation('');
        setInputName('');
    };

    const columns = [
        { field: 'inputName', headerName: 'Name', width: 150 },
        { field: 'selectedLocation', headerName: 'Location', width: 150 }
    ];

    return (

        /** using Material UI for out of box components like Grid, TextField, Button */
        <Container maxWidth="md">
            <Grid container spacing={4} marginY={4}>
                <Grid item xs={12} sm={6}>
                    <NameInput
                        value={inputName}
                        onChange={onNameChange}
                        error={!!inputNameError}
                        helperText={inputNameError}
                    />

                </Grid>
                <Grid item xs={12} sm={6}>
                    <LocationDropdown
                        value={selectedLocation}
                        onChange={handleLocationChange}
                        locations={locations}
                    />
                </Grid>
            </Grid>
            <Stack direction="row" spacing={2} marginY={4}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={addNewNameLocationRow}
                    disabled={!!inputNameError || !selectedLocation || !inputName}
                >
                    Add
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={clearUserInputs}
                    disabled={!!inputNameError || (!selectedLocation && !inputName)}
                >
                    Clear
                </Button>
            </Stack>

            {nameLocationRows.length > 0 &&
                <DataTable rows={nameLocationRows} columns={columns} />
            }
        </Container>
    );
};

export default OfflineReactAssessment;