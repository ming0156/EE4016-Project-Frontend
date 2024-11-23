import { Box, Button, ButtonGroup } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { useTranslation } from 'react-i18next';


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: '350px',
        minWidth: '250px',
        backgroundColor: theme.palette.background.paper,
        paddingBottom: 0,
        borderRadius: '10px',
    },
    subHeader: {
        backgroundColor: theme.palette.grey.A400,
        color: theme.palette.common.white,
        padding: '5px 15px',
    },
    menuIcon: {
        fontSize: '1.5rem',
    },
    menuButton: {
        [theme.breakpoints.down('md')]: {
            minWidth: '50px',
        },
        [theme.breakpoints.down('sm')]: {
            minWidth: '35px',
        }
    },
}));

const LanguageSection = () => {
    const classes = useStyles();

    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        localStorage.setItem('preferLang', lng);
        i18n.changeLanguage(lng);
    };

    return (
        <React.Fragment>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    '& > *': {
                        m: 1,
                    },
                }}
            >
                <ButtonGroup color="inherit" variant="text" aria-label="outlined button group">
                    <Button className={classes.menuButton}
                        aria-haspopup="true"
                        onClick={(e) => {
                            e.preventDefault();
                            changeLanguage('en');
                        }}
                    >EN
                    </Button>
                    <Button className={classes.menuButton}
                        aria-haspopup="true"
                        onClick={(e) => {
                            e.preventDefault();
                            changeLanguage('tc');
                        }}
                    >繁</Button>
                    <Button className={classes.menuButton}
                        aria-haspopup="true"
                        onClick={(e) => {
                            e.preventDefault();
                            changeLanguage('sc');
                        }}
                    >簡</Button>
                </ButtonGroup>
            </Box>
        </React.Fragment>
    );
};

export default LanguageSection;
