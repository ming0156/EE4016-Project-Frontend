import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Avatar, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Chip from '../../../../../component/Chip';
import * as actionTypes from '../../../../../store/actions';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
    listIcon: {
        minWidth: '25px',
    },
    listItem: {
        borderRadius: '5px',
        marginBottom: '5px',
    },
    subMenuCaption: {
        ...theme.typography.subMenuCaption,
    },
    listItemNoBack: {
        paddingTop: '8px',
        paddingBottom: '5px',
        marginBottom: '3px',
        borderRadius: '5px',
    },
}));

const NavItem = (props) => {
    const classes = useStyles();
    const customization = useSelector((state) => state.customization);
    const dispatch = useDispatch();
    const { item, level } = props;
    const { t } = useTranslation();

    const Icon = item.icon;
    const itemIcon = item.icon ? (
        <Icon className={classes.listCustomIcon} color="inherit" />
    ) : (
        <ArrowForwardIcon className={classes.listCustomIcon} color="inherit" fontSize={level > 0 ? 'inherit' : 'default'} />
    );

    let itemIconClass = !item.icon ? classes.listIcon : classes.menuIcon;

    let itemTarget = '';
    if (item.target) {
        itemTarget = '_blank';
    }

    let listItemProps = { component: Link, to: item.url };
    if (item.external) {
        listItemProps = { component: 'a', href: item.url };
    }

    return (
        <ListItem
            disabled={item.disabled}
            className={level > 1 ? classes.listItemNoBack : classes.listItem}
            selected={customization.isOpen === item.id}
            component={Link}
            onClick={() => dispatch({ type: actionTypes.MENU_OPEN, isOpen: item.id })}
            to={item.url}
            target={itemTarget}
            button
            style={{ paddingLeft: level * 16 + 'px' }}
            {...listItemProps}
        >
            <ListItemIcon className={itemIconClass}>{itemIcon}</ListItemIcon>
            <ListItemText
                primary={
                    <Typography
                        variant={customization.isOpen === item.id ? 'subtitle1' : 'body1'}
                        color="inherit"
                        className={classes.listItemTypography}
                    >
                        {t(item.title)}
                    </Typography>
                }
                secondary={
                    item.caption && (
                        <Typography variant="caption" className={classes.subMenuCaption} display="block" gutterBottom>
                            {item.caption}
                        </Typography>
                    )
                }
            />
            {item.chip && (
                <Chip
                    color={item.chip.color}
                    variant={item.chip.variant}
                    size={item.chip.size}
                    label={item.chip.label}
                    avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
                />
            )}
        </ListItem>
    );
};

export default NavItem;
