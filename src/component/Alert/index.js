import MuiAlert from '@mui/material/Alert';
import React from 'react';

const Alert = React.forwardRef((props, ref) => {
    const { ...rest } = props;

    return <MuiAlert ref={ref} {...rest} />;
});

export default Alert;
