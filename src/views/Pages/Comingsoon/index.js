import { Button, CardMedia, Grid, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { gridSpacing } from '../../../store/constant';
import Error from './../../../assets/images/page/comingsoon.svg';
const useStyles = makeStyles((theme) => ({
    errortitle: {
        fontSize: '25px',
        fontWeight: '600',
        position: 'relative',
        marginBottom: '15px',
        '&:after': {
            content: '""',
            position: 'absolute',
            bottom: '-15px',
            left: 'calc(50% - 25px)',
            width: '50px',
            height: '4px',
            background: theme.palette.primary.main,
            borderRadius: '3px',
        },
    },
    authwrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        minWidth: '100%',
        minHeight: '100vh',
        textAlign: 'center',
        [theme.breakpoints.down('md')]: {
            padding: '30px',
        },
    },
    errorimg: {
        width: '80%',
        margin: '0 auto',
    },
}));
const Soonpages = () => {
    const classes = useStyles();

    return (
        <div className={classes.authwrapper}>
            <Grid container spacing={gridSpacing} justifyContent="center">
                <Grid item lg={4} md={6} sm={10}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <CardMedia component="img" image={Error} title="Cover image" className={classes.errorimg} />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography component="div" variant="h6" className={classes.errortitle}>
                                Sorry, We're Offline!
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography component="div" variant="body2">
                                Our website is currently offline for maintenance,<br></br> we will be back shortly
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary">
                                Try again
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};

export default Soonpages;
