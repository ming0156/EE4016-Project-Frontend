import { createTheme, adaptV4Theme } from '@mui/material';
import value from '../assets/scss/_themes-vars.module.scss';
import { grey } from '@mui/material/colors';

export function theme(customization) {
    let textPrimary;
    let textSecondary;
    let textDark;
    let textHint;
    let background;
    let paper;
    let menuCaption;
    let textInversePrimary;

    switch (customization.navType) {
        case 'dark':
            textPrimary = menuCaption = textInversePrimary = value.textDarkPrimary;
            textSecondary = value.textDarkSecondary;
            textDark = value.textDarkDark;
            textHint = value.textHintDark;

            background = value.backgoundDark;
            paper = value.paperDark;
            break;
        case 'light':
        default:
            textPrimary = textInversePrimary = menuCaption = value.textPrimary;
            textSecondary = value.textSecondary;
            textDark = value.textDark;
            textHint = value.textHint;

            background = value.backgound;
            paper = value.paper;
            break;
    }

    return createTheme(adaptV4Theme({
        palette: {
            mode: 'light',
            common: {
                black: value.paperDark,
            },
            primary: {
                light: value.primaryLight,
                main: value.primary,
                dark: value.primaryDark,
                100: value.primary100,
            },
            secondary: {
                light: value.secondaryLight,
                main: value.secondary,
                dark: value.secondaryDark,
            },
            error: {
                light: value.errorLight,
                main: value.error,
                dark: value.errorDark,
            },
            warning: {
                light: value.warningLight,
                main: value.warning,
                dark: value.warningDark,
            },
            info: {
                light: value.infoLight,
                main: value.info,
                dark: value.infoDark,
            },
            success: {
                light: value.successLight,
                main: value.success,
                dark: value.successDark,
            },
            grey: {
                300: value.grey300,
                400: value.grey400,
            },
            bg: {
                100: value.bg100,
            },
            textDark: {
                color: textDark,
            },
            text: {
                primary: textPrimary,
                secondary: textSecondary,
                dark: textDark,
                hint: textHint,
            },
            background: {
                paper: paper,
                default: background,
            },
        },
        breakpoints: {
            values: {
                bp1411: 1411,
                xs: 0,
                sm: 600,
                md: 900,
                lg: 1200,
                xl: 1536,
            },
        },
        typography: {
            fontFamily: `'Poppins', sans-serif`,
            h6: {
                fontWeight: 500,
                color: textSecondary,
                fontSize: '0.875rem',
            },
            h5: {
                fontSize: '1.125rem',
                color: textSecondary,
                fontWeight: 600,
            },
            h4: {
                fontSize: '1.25rem',
                color: textSecondary,
                fontWeight: 500,
            },
            h3: {
                fontSize: '1.5rem',
                color: textDark,
                fontWeight: 600,
            },
            h2: {
                fontSize: '2rem',
                color: textDark,
                fontWeight: 600,
            },
            h1: {
                fontSize: '2.2rem',
                color: textDark,
                fontWeight: 600,
            },
            subtitle1: {
                fontSize: '0.875rem',
                fontWeight: 500,
                color: textSecondary,
                lineHeight: '1.643em',
            },
            subtitle2: {
                fontSize: '0.8125rem',
                fontWeight: 400,
            },
            caption: {
                fontSize: '0.68rem',
                color: textHint,
                fontWeight: 500,
            },
            body1: {
                fontSize: '0.875rem',
                fontWeight: 400,
                lineHeight: '1.643em',
            },
            body2: {
                letterSpacing: '0em',
                fontWeight: 400,
                lineHeight: '1.643em',
            },
            menuCaption: {
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: value.primary,
                padding: '5px 15px 5px',
                textTransform: 'uppercase',
                marginTop: '10px',
            },
            subMenuCaption: {
                fontSize: '0.6875rem',
                fontWeight: 400,
                color: menuCaption,
                textTransform: 'capitalize',
            },
            subHeading: {
                color: 'red',
            },
            cardTitle: {
                color: value.primary,
                fontSize: '1rem',
            },
            breadcrumbTitle: {
                fontWeight: 500,
                fontSize: '1.5rem',
                color: textDark,
            },
        },
        overrides: {
            MuiAccordionSummary: {
                root: {
                    fontWeight: 600,
                    fontSize: '0.875rem',
                },
                content: {
                    color: textSecondary,
                    fontWeight: 500,
                },
            },
            MuiPaper: {
                elevation1: {
                    boxShadow: '0 4px 6px -2px rgb(0 0 0 / 12%), 0 2px 2px -1px rgb(0 0 0 / 5%)',
                },
                rounded: {
                    borderRadius: '10px',
                },
            },
            MuiCardHeader: {
                root: {
                    color: textDark,
                    padding: '24px',
                },
            },
            MuiCardContent: {
                root: {
                    padding: '24px',
                },
            },
            MuiCardActions: {
                root: {
                    padding: '24px',
                },
            },
            MuiSvgIcon: {
                root: {
                    fontSize: '1.3rem',
                },
            },
            // Table
            MUIDataTableToolbar: {
                root: {
                    minHeight: '48px !important',
                }
            },
            MUIDataTableFooter: {
                root: {
                    position: 'sticky',
                    bottom: 0,
                    backgroundColor: "#f0f2f8"
                },
            },
            MuiTableCell: {
                root: {
                    padding: '6px 18px 6px 18px',
                    whiteSpace: 'nowrap',
                    height: '50px',
                },
                head: {
                    padding: '6px 18px 6px 18px',
                    color: textDark,
                    fontWeight: 500,
                },
                paddingCheckbox: {
                    paddingLeft: '36px',
                    position: 'relative',
                },
            },
            MuiList: {
                root: {
                    overflow: 'hidden',
                },
            },
            MuiListItem: {
                root: {
                    color: textInversePrimary,
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    '&$selected': {
                        color: value.primary,
                        backgroundColor: value.menuHover,
                        '&:hover': {
                            backgroundColor: value.menuHover,
                        },
                        '& .MuiListItemIcon-root': {
                            color: value.primary,
                        },
                    },
                    '&:hover': {
                        color: value.primaryDark,
                        '& .MuiListItemIcon-root': {
                            color: value.primaryDark,
                        },
                    },
                },
                button: {
                    '&:hover': {
                        backgroundColor: value.menuHover,
                    },
                },
            },
            MuiListItemIcon: {
                root: {
                    minWidth: '36px',
                    color: textInversePrimary,
                },
            },
            MUIDataTableSelectCell: {
                fixedLeft: {
                    position: 'relative',
                    '@media (max-width: 959.95px)': {
                        borderBottomWidth: 0,
                    }
                },
            },
            MuiChip: {
                colorSecondary: {
                    color: grey[100],
                },
                colorPrimary: {
                    color: grey[100],
                },
                root: {
                    color: grey[100],
                },
                outlined: {
                    color: grey[500],
                },
            },
            MUIDataTableFilterList: {
                root: {
                    margin: '0px 0px 6px 6px'
                },
                chip: {
                    color: textPrimary,
                },
            },
            MUIDataTableBodyCell: {
                root: {
                    fontWeight: 500,
                }
            },
            MuiTimelineDot: {
                defaultGrey: {
                    background: grey[300],
                },
            },
            MuiTimelineConnector: {
                root: {
                    background: grey[300],
                },
            },
            MuiTableContainer: {
                root: {
                    boxShadow: 'none',
                },
            },
            MuiAvatar: {
                colorDefault: {
                    backgroundColor: value.textHint,
                    color: grey[100],
                },
            },
            MuiInputBase: {
                input: {
                    color: textDark,
                },
            },
        },
    }));
}

export default theme;
