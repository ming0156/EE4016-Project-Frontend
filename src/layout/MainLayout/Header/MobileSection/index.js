import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';
import {
    AppBar,
    ClickAwayListener, Grid, Grow, IconButton, Paper,
    Popper,
    Toolbar, useMediaQuery, useTheme
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import ProfileSection from '../ProfileSection';

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
        [theme.breakpoints.down('sm')]: {
            flexGrow: 0,
        },
    },
    popperContainer: {
        width: '100%',
        zIndex: 1,
    },
    flexContainer: {
        display: 'flex',
        flexDirection: 'row',
        padding: 0,
    },
    menuIcon: {
        fontSize: '1.5rem',
    },
}));

const MobileSection = () => {
    const classes = useStyles();
    const theme = useTheme();
    const matchMobile = useMediaQuery(theme.breakpoints.down(undefined));

    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <React.Fragment>
            <IconButton
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                color="inherit"
                size="large">
                <MoreVertTwoToneIcon className={classes.menuIcon} />
            </IconButton>
            <Popper
                open={open}
                placement="bottom-end"
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                className={classes.popperContainer}
                popperOptions={{
                    modifiers: {
                        offset: {
                            enable: true,
                            offset: '0px, 5px',
                        },
                        preventOverflow: {
                            padding: 0,
                        },
                    },
                }}
            >
                {({ TransitionProps, placement }) => (
                    <Grow {...TransitionProps} in={open}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <div className={classes.grow}>
                                    <AppBar color="default">
                                        <Toolbar>
                                            <Grid
                                                container
                                                direction="row"
                                                justifyContent={matchMobile ? 'space-between' : 'flex-end'}
                                                alignItems="center"
                                            >
                                                <ProfileSection />
                                            </Grid>
                                        </Toolbar>
                                    </AppBar>
                                </div>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </React.Fragment>
    );
};

export default MobileSection;
