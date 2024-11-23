import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Collapse, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import NavItem from './../NavItem';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
    collapseIcon: {
        fontSize: '1rem',
    },
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
        backgroundColor: 'transparent !important',
        paddingTop: '8px',
        paddingBottom: '8px',
        borderRadius: '5px',
    },
}));

const NavCollapse = (props) => {
    const classes = useStyles();
    const customization = useSelector((state) => state.customization);
    const { t } = useTranslation();

    const { menu, level } = props;
    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState(null);

    const handleClick = () => {
        setOpen(!open);
        setSelected(!selected ? menu.id : null);
    };
    let childKeys = [];

    const menus = menu.children.map(item => {
        if(item['hide']) return;
        switch (item.type) {
            case 'collapse':
                return <NavCollapse key={item.id} menu={item} level={level + 1} />;
            case 'item':
                childKeys.push(item.id);
                return <NavItem key={item.id} item={item} level={level + 1} />;
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    });

    const Icon = menu.icon;
    const menuIcon = menu.icon ? (
        <Icon className={classes.listCustomIcon} />
    ) : (
        <ArrowForwardIcon className={classes.listCustomIcon} fontSize={level > 0 ? 'inherit' : 'default'} />
    );

    let menuIconClass = !menu.icon ? classes.listIcon : classes.menuIcon;

    return (
        <React.Fragment>
            <ListItem
                className={level > 1 ? classes.listItemNoBack : classes.listItem}
                selected={!open && childKeys.includes(customization.isOpen)}
                button
                onClick={handleClick}
                style={{ paddingLeft: level * 16 + 'px' }}
            >
                <ListItemIcon className={menuIconClass}>{menuIcon}</ListItemIcon>
                <ListItemText
                    primary={
                        <Typography
                            variant="body1"
                            color="inherit"
                            className={classes.listItemTypography}
                        >
                            {t(menu.title)}
                        </Typography>
                    }
                    secondary={
                        menu.caption && (
                            <Typography variant="caption" className={classes.subMenuCaption} display="block" gutterBottom>
                                {menu.caption}
                            </Typography>
                        )
                    }
                />
                {open ? <ExpandLess className={classes.collapseIcon} /> : <ExpandMore className={classes.collapseIcon} />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {menus}
                </List>
            </Collapse>
        </React.Fragment>
    );
};

export default NavCollapse;
