import { Card, CardContent, Divider, Typography } from '@mui/material';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';

const useStyles = makeStyles((theme) => ({
    root: {
        background: 'transparent',
        boxShadow: 'none',
        border: 'none',
    },
    cardClass: {
        padding: theme.spacing(3),
    },
    cardContent: {
        paddingLeft: 0,
        paddingTop: 0,
        paddingBottom: '0 !important',
    },
    divider: {
        marginBottom: theme.spacing(2),
        marginTop: theme.spacing(2),
    },
    spacer: {
        marginBottom: theme.spacing(3),
    },
    breadcrumbTitle: {
        fontWeight: 500,
        marginTop: theme.spacing(1),
    },
}));

const Breadcrumbs = (props) => {
    const classes = useStyles();
    const { color, outline, size, title, divider, isCard, ...rest } = props;
    let cardClass = classes.root;
    if (isCard) {
        cardClass = classes.cardClass;
    }

    return (
        <Card className={cardClass}>
            <CardContent className={classes.cardContent}>
                <MuiBreadcrumbs {...rest} />
                {title && (
                    <Typography className={classes.breadcrumbTitle} variant="h3">
                        {title}
                    </Typography>
                )}
                {divider === false && !isCard && <div className={classes.spacer} />}
                {divider !== false && <Divider className={classes.divider} />}
            </CardContent>
        </Card>
    );
};

export default Breadcrumbs;
