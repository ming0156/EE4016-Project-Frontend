import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import { Box, Grid, IconButton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { drawerWidth } from './../../../store/constant';
import LanguageSection from './LanguageSection'

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(1.25),
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    menuIcon: {
        fontSize: '1.5rem',
    },
}));

const Header = (props) => {
    const { drawerToggle } = props;
    const classes = useStyles();

    return (
        <React.Fragment>
            <Box width={drawerWidth}>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <IconButton
                            edge="start"
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="open drawer"
                            onClick={drawerToggle}
                            size="large">
                            <MenuTwoToneIcon className={classes.menuIcon} />
                        </IconButton>
                    </Grid>
                </Grid>
            </Box>
            <div className={classes.grow} />
            <LanguageSection />
        </React.Fragment>
    );
};

export default Header;
