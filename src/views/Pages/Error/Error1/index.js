import { Button, Grid, Link, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { gridSpacing } from '../../../../store/constant';
const useStyles = makeStyles((theme) => ({
    errortext: {
        fontSize: '140px',
        fontWeight: '900',
        position: 'relative',
        lineHeight: '120px',
        color: theme.palette.primary.main,
        filter: 'drop-shadow(2px 6px 0px rgba(0,0,0,0.2))',
    },
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
}));
const ErrorPages = () => {
    const classes = useStyles();

    return (
        <div className={classes.authwrapper}>
            <Grid container spacing={gridSpacing} justifyContent="center">
                <Grid item lg={4} md={6} sm={10}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <Typography component="div" variant="h6" className={classes.errortext}>
                                404
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography component="div" variant="h6" className={classes.errortitle}>
                                Oops! Page not found!
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography component="div" variant="body2">
                                You can head over to the <Link href="/">Homepage</Link> for more options
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary">
                                Reload
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};

export default ErrorPages;
