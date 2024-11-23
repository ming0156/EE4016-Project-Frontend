import MuiChip from '@mui/material/Chip';
import React from 'react';

const Chip = (props) => {
    const { ...rest } = props;

    return <MuiChip {...rest} />;
};

export default Chip;
