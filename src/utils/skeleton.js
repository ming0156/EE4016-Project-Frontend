import { Grid, Typography } from '@mui/material';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
const skel = {};

skel.skeletonData = (numberOfRows) => {
    if (!numberOfRows || numberOfRows <= 0) numberOfRows = 1;

    let output = [''];
    while (output.length < numberOfRows) {
        output.push('');
    }

    return output;
}

skel.skeletonColumns = (columns, twoRowsLabels) => {
    columns.map((c) => {
        c.options['customBodyRenderLite'] = () => {
        
            return (c.label &&
                <Grid container spacing={0} alignItems="center" style={{ paddingTop: 9, paddingBottom: 9 }}>
                    <Grid item xs={12} zeroMinWidth>
                        <Typography align="left" variant="h6" color="inherit">
                            <Skeleton />
                        </Typography>
                        {twoRowsLabels?.includes(c.label) &&
                            <Typography align="left" variant="body2" color="inherit">
                                <Skeleton />
                            </Typography>
                        }
                    </Grid>
                </Grid >
            );
        }
        delete c.customBodyRender;
        return c;
    });

    return columns;
}

export default skel;