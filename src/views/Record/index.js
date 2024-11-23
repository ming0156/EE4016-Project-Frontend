import _ from 'lodash';
import debounce from "lodash/debounce";
import axios from "axios";
import AddIcon from '@mui/icons-material/Add';
import ImportIcon from '@mui/icons-material/UploadFile';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import {
    Alert, Box, Dialog, DialogActions, DialogContent, Fab, CircularProgress, Typography, Zoom, Grid, TextField
} from '@mui/material';
import {
    DesktopDatePicker
} from '@mui/lab';
import makeStyles from '@mui/styles/makeStyles';
import { Formik } from 'formik';
import MUIDataTable from 'mui-datatables';
import React, { useEffect, useRef, useState, useCallback } from 'react';
// the hook
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import * as actionTypes from '../../store/actions';
import { useDropzone } from 'react-dropzone'
import { saveAs } from 'file-saver';
import { dialog, general } from '../../utils/componentWizard';
import Helper from '../../utils/helper';
import Skeleton from '../../utils/skeleton';
import Validation from '../../utils/validation';
import useAuth from '../../hooks/useAuth';
import API from '../../api';
import Loader from '../../component/Loader/Loader';

const useStyles = makeStyles((theme) => ({
    overlaymain: {
        position: 'relative',
        display: 'block',
        margin: '0px',
        '&:hover > span': {
            display: 'flex',
        },
    },
    overlayedit: {
        [theme.breakpoints.up('md')]: {
            justifyContent: "flex-end"
        },
    },
    btnlast: {
        marginLeft: '5px',
    },
    table: {
        background: 'transparent',
        boxShadow: 'none',
        '& table': {
            borderSpacing: '0 2px',
            borderCollapse: 'separate',
        },
        '& tbody tr': {
            background: '#fff',
            boxShadow: '0 2px 6px -1px rgba(0, 0, 0, 0.1)',
        },
        '& tbody tr:hover': {
            background: theme.palette.primary.main + '!important',
            '& td': {
                color: '#fff',
            },
        },
    },
    btnAdd: {
        position: 'relative',
        left: '-10px',
        '@media only screen and (max-width: 599px)': {
            display: 'flex',
            margin: '0 auto',
            left: '0px',
        }
    },
    noMarginDialog: {
        '&>div:nth-child(3)': {
            '&>div': {
                margin: 0,
            },
        },
    },
    selectHeaderButton: {
        marginRight: '24px',
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Zoom ref={ref} {...props} />;
});


const UIList = () => {
    const { user } = useAuth();
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    //Each Data Sector contains 30 page of data rows
    //no. of data = rowsPerPage * 30
    const [prevDataSector, setPrevDataSector] = useState([]);
    const [dataSector, setDataSector] = useState([]);
    const [nextDataSector, setNextDataSector] = useState([]);
    //data contains the data rows of the current page
    //no. of data = rowsPerPage
    const [data, setData] = useState([]);
    const noOfPagesPerSector = 20;

    const [isLoading, setIsLoading] = useState(true);
    const [filterDate, setFilterDate] = useState(null);
    const [filterList, setFilterList] = useState([[], []]);

    const [currPage, setCurrPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPage, setTotalPage] = useState(-1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    // const init = async () => {
    //     try {
    //         setIsLoading(true);
    //         setData((await API.Gift.get_all()).data.data);
    //         setIsLoading(false);
    //     } catch {
    //     }
    // };

    const changePage = async (query) => {
        debounceChangePage(query);
        //Transerve to Preload Previous Data Sector
        //[ (prevDataSector) ... 27 28 29 ] <--- [ 0 1 2 ... (dataSector) ] [ 0 1 2 ... (nextDataSector) ]
        if (query.page % noOfPagesPerSector === noOfPagesPerSector - 1 && currPage % noOfPagesPerSector === 0) {
            if (!prevDataSector && prevDataSector.length() === 0) {
                setIsLoading(true);
            }
            else {
                //[ null ] [ (dataSector) ... 27 28 29 ] [ 0 1 2 ... (nextDataSector) ]
                setNextDataSector(dataSector);
                setDataSector(prevDataSector);
                setPrevDataSector([]);
            }
        }
        //Transerve to Preload Next Data Sector
        //[ (prevDataSector) ... 27 28 29 ] [ (dataSector) ... 27 28 29 ] ---> [ 0 1 2 ... (nextDataSector) ]
        if (query.page % noOfPagesPerSector === 0 && currPage % noOfPagesPerSector === noOfPagesPerSector - 1) {
            if (!nextDataSector && nextDataSector.length() === 0) {
                setIsLoading(true);
            }
            else {
                //[ (prevDataSector) ... 27 28 29 ] [ (dataSector) ... 27 28 29 ] [ null ]
                setPrevDataSector(dataSector);
                setDataSector(nextDataSector);
                setNextDataSector([]);
            }
        }
        setData(dataSector.slice((query.page % noOfPagesPerSector) * rowsPerPage, (query.page % noOfPagesPerSector) * rowsPerPage + rowsPerPage));
    };

    let cancelToken;
    const debounceChangePage = useCallback(debounce(async (query) => {
        let currSectorNumber = Math.floor(query.page / noOfPagesPerSector);
        const rowsPerSector = query.rowsPerPage * noOfPagesPerSector;
        try {
            if (typeof cancelToken != typeof undefined) {
                cancelToken.cancel("Operation canceled due to new request.")
            }
            query.rowsPerPage = rowsPerSector;
            cancelToken = axios.CancelToken.source();
            //Initialization
            if (query.page === 0) {
                query.page = currSectorNumber;
                setIsLoading(true);
                const response = (await API.Gift.get_all(query)).data;

                setDataSector(response.data);
                setTotalCount(response.totalCount);
                setTotalPage(response.totalPage);
                setIsLoading(false);
            }
            //Preload Previous Data Sector
            if (query.page % noOfPagesPerSector <= parseInt(noOfPagesPerSector / 3) && query.page % noOfPagesPerSector > 0) {
                let response = null;
                if (query.page % noOfPagesPerSector === parseInt(noOfPagesPerSector / 3) && currSectorNumber !== 0) {
                    query.page = currSectorNumber - 1; //Previous Sector
                    response = (await API.Gift.get_all(query, cancelToken.token)).data;
                }
                if (response && response.success) {
                    setPrevDataSector(response.data);
                    setTotalCount(response.totalCount);
                    setTotalPage(response.totalPage);
                }
            }
            //Preload Next Data Sector
            if (query.page % noOfPagesPerSector >= parseInt(noOfPagesPerSector * 2 / 3) && query.page % noOfPagesPerSector < noOfPagesPerSector - 1) {
                let response = null;
                if (query.page % noOfPagesPerSector === parseInt(noOfPagesPerSector * 2 / 3) && currSectorNumber !== totalPage) {
                    query.page = currSectorNumber + 1; //Next Sector
                    response = (await API.Gift.get_all(query, cancelToken.token)).data;
                }
                if (response && response.success) {
                    setNextDataSector(response.data);
                    setTotalCount(response.totalCount);
                    setTotalPage(response.totalPage);
                }
            }
        } catch (err) {
            if (!axios.isCancel(err)) {
                dispatch(actionTypes.SNACKBAR_ERROR);
                setIsLoading(false);
            }
        }

        // if (query.page % noOfPagesPerSector === 0 || query.page % noOfPagesPerSector === noOfPagesPerSector - 1) {
        //     try {
        //         setIsLoading(true);
        //         if (typeof cancelToken != typeof undefined) {
        //             cancelToken.cancel("Operation canceled due to new request.")
        //         }
        //         query.rowsPerPage = rowsPerSector;
        //         query.page = currSectorNumber;
        //         cancelToken = axios.CancelToken.source();

        //         const response = (await API.Gift.get_all(query, cancelToken.token)).data;

        //         setDataSector(response.data);
        //         setTotalCount(response.totalCount);
        //         setIsLoading(false);
        //     } catch (err) {
        //         if (!axios.isCancel(err)) {
        //             dispatch(actionTypes.SNACKBAR_ERROR);
        //             setIsLoading(false);
        //         }
        //     }
        // }
    }, 0), []);

    useEffect(() => {
        changePage({
            page: 0,
            rowsPerPage: rowsPerPage,
            isGift: true
        });
    }, []);

    useEffect(() => {
        changePage({
            page: 0,
            rowsPerPage: rowsPerPage,
            isGift: true
        });
    }, [rowsPerPage]);

    useEffect(() => {
        setData(dataSector.slice((currPage % noOfPagesPerSector) * rowsPerPage, (currPage % noOfPagesPerSector) * rowsPerPage + rowsPerPage));
    }, [dataSector])

    const columns = [
        {
            label: `${t('Gift.Gift_ID')}`,
            name: 'giftId',
            options: {
                customBodyRenderLite: dataIndex => data[dataIndex]['giftId'] ?? <Typography align="left" variant="body1" sx={{ color: 'text.hint' }}>N/A</Typography>,
                filterType: 'textField',
                filterOptions: {
                    fullWidth: true,
                },
                customFilterListOptions: {
                    render: v => `${t('Gift.Gift_ID')}: ` + v
                }
            },
        },
        {
            label: `${t('Gift.Name_en')}`,
            name: `display_name_en`,
            options: {
                customBodyRenderLite: dataIndex => data[dataIndex]['display_name_en'] ?? <Typography align="left" variant="body1" sx={{ color: 'text.hint' }}>N/A</Typography>,
                filterType: 'textField',
                customFilterListOptions: {
                    render: v => `${t('Gift.Name_en')}: ` + v
                },
            },
        },
        {
            label: `${t('Gift.Name_tc')}`,
            name: `display_name_zh_hant`,
            options: {
                customBodyRenderLite: dataIndex => data[dataIndex]['display_name_zh_hant'] ?? <Typography align="left" variant="body1" sx={{ color: 'text.hint' }}>N/A</Typography>,
                filterType: 'textField',
                customFilterListOptions: {
                    render: v => `${t('Gift.Name_tc')}: ` + v
                },
            },
        },
        {
            label: `${t('Gift.Name_sc')}`,
            name: `display_name_zh_hans`,
            options: {
                customBodyRenderLite: dataIndex => data[dataIndex]['display_name_zh_hans'] ?? <Typography align="left" variant="body1" sx={{ color: 'text.hint' }}>N/A</Typography>,
                filterType: 'textField',
                customFilterListOptions: {
                    render: v => `${t('Gift.Name_sc')}: ` + v
                },
            },
        },
        {
            label: `${t('Gift.LocationID')}`,
            name: `locationId`,
            options: {
                customBodyRenderLite: dataIndex => data[dataIndex]['locationId'] ?? <Typography align="left" variant="body1" sx={{ color: 'text.hint' }}>N/A</Typography>,
                filterType: 'textField',
                customFilterListOptions: {
                    render: v => `${t('Gift.LocationID')}: ` + v
                },
            },
        },
        {
            label: `${t('Gift.Shop_name')}`,
            name: `shop_name`,
            options: {
                customBodyRenderLite: dataIndex => data[dataIndex]['shop_name'] ?? <Typography align="left" variant="body1" sx={{ color: 'text.hint' }}>N/A</Typography>,
                filterType: 'textField',
                customFilterListOptions: {
                    render: v => `${t('Gift.Shop_name')}: ` + v
                },
            },
        },
        {
            label: `${t('Gift.Type')}`,
            name: `type`,
            options: {
                customBodyRenderLite: dataIndex => data[dataIndex]['type'] ?? <Typography align="left" variant="body1" sx={{ color: 'text.hint' }}>N/A</Typography>,
                filterType: 'dropDownList',
                filterOptions: ["machine", "station", "spot"],
                customFilterListOptions: {
                    render: v => `${t('Gift.Type')}: ` + v
                },
            },
        },
        // {
        //     label: `${t('Gift.Display')}`,
        //     name: `display`,
        //     options: {
        //         customBodyRenderLite: dataIndex => data[dataIndex]['display'] ?? <Typography align="left" variant="body1" sx={{ color: 'text.hint' }}>N/A</Typography>,
        //         filterType: 'textField',
        //         customFilterListOptions: {
        //             render: v => `${t('Gift.Display')}: ` + v
        //         },
        //     },
        // },
        {
            label: `${t('Gift.Display')}`,
            name: `display`,
            options: {
                customBodyRenderLite: dataIndex => {
                    const displayValue = data[dataIndex]['display'];
                    return displayValue !== undefined ? (
                        <Typography align="left" variant="body1">
                            {displayValue ? t('Y') : t('N')}
                        </Typography>
                    ) : (
                        <Typography align="left" variant="body1" sx={{ color: 'text.hint' }}>N/A</Typography>
                    );
                },
                filterType: 'dropDownList',
                filterOptions: ["Y", "N"],
                customFilterListOptions: {
                    render: v => `${t('Gift.Display')}: ` + v
                },
            },
        },
        // {
        //     label: `${t('Gift.Name_sc')}`,
        //     name: `display_name_zh_hans`,
        //     options: {
        //         customBodyRenderLite: dataIndex => data[dataIndex]['display_name_zh_hans'] ?? <Typography align="left" variant="body1" sx={{ color: 'text.hint' }}>N/A</Typography>,
        //         filterType: 'textField',
        //         customFilterListOptions: {
        //             render: v => `${t('Gift.Name_sc')}: ` + v
        //         },
        //     },
        // },
        // {
        //     label: `${t('Gift.greenScore')}`,
        //     name: 'greenScore',
        //     options: {
        //         customBodyRenderLite: dataIndex => data[dataIndex]['greenScore'] ?? <Typography align="left" variant="body1" sx={{ color: 'text.hint' }}>N/A</Typography>,
        //         filterType: 'textField',
        //         customFilterListOptions: {
        //             render: v => `${t('Gift.greenScore')}: ` + v
        //         },
        //     },
        // },
        // {
        //     label: `${t('Gift.Description')}`,
        //     name: 'description',
        //     options: {
        //         filter: false
        //     },
        // },
        // {
        //     label: `${t('Gift.Remarks')}`,
        //     name: 'remarks',
        //     options: {
        //         filter: false
        //     },
        // },
        // {
        //     label: `${t('Gift.Created_at')}`,
        //     name: 'createdAt',
        //     options: {
        //         customBodyRenderLite: (dataIndex, rowIndex) => {
        //             return (
        //                 <Grid key={dataIndex} container spacing={2} alignItems="center">
        //                     <Grid item xs zeroMinWidth>
        //                         <Typography align="left" variant="h6" color="inherit">
        //                             {Helper.apiTsToTableFormat(new Date(data[dataIndex].createdAt).toISOString())[0]}
        //                         </Typography>
        //                         <Typography align="left" variant="body2" sx={{ color: "text.hint" }}>
        //                             {Helper.apiTsToTableFormat(new Date(data[dataIndex].createdAt).toISOString())[1]}
        //                         </Typography>
        //                     </Grid>
        //                 </Grid >
        //             );
        //         },
        //         filterType: 'custom',
        //         customFilterListOptions: {
        //             render: v => {
        //                 let date_filters = [];
        //                 if (v[0] && !isNaN(new Date(v[0]))) date_filters.push(`${t('Gift.StartDate')}: ${v[0].toISOString().substring(0, 10)}`);
        //                 if (v[1] && !isNaN(new Date(v[1]))) date_filters.push(`${t('Gift.EndDate')}: ${v[1].toISOString().substring(0, 10)}`);
        //                 if (date_filters.length) return date_filters.join(", ");
        //                 return false;
        //             },
        //             update: (filterList, filterPos, index) => {
        //                 filterList[index] = [];
        //                 setFilterDate(null);
        //                 return filterList;
        //             },
        //         },
        //         filterList: filterDate,
        //         filterOptions: {
        //             names: [],
        //             fullWidth: true,
        //             display: (filterList, onChange, index, column) => (
        //                 <div>
        //                     <DesktopDatePicker
        //                         label={t('Gift.StartDate')}
        //                         maxDate={filterList[index][1]}
        //                         value={filterList[index][0] || null}
        //                         onChange={v => {
        //                             if (!filterList[index][0] || !isNaN(new Date(filterList[index][0]))) {
        //                                 filterList[index][0] = v;
        //                                 setFilterDate(d => d ? [v, d[1]] : [v, null])
        //                             }
        //                             onChange(filterList[index], index, column);
        //                         }}
        //                         inputFormat="dd/MM/yyyy"
        //                         renderInput={(params) =>
        //                             <TextField
        //                                 {...params}
        //                                 variant="standard"
        //                                 style={{ width: '48%', marginRight: '4%' }}
        //                             />
        //                         }
        //                     />
        //                     <DesktopDatePicker
        //                         label={t('Gift.EndDate')}
        //                         minDate={filterList[index][0]}
        //                         value={filterList[index][1] || null}
        //                         onChange={v => {
        //                             if (!filterList[index][1] || !isNaN(new Date(filterList[index][1]))) {
        //                                 filterList[index][1] = v;
        //                                 setFilterDate(d => d ? [d[0], v] : [null, v])
        //                             }
        //                             onChange(filterList[index], index, column);
        //                         }}
        //                         inputFormat="dd/MM/yyyy"
        //                         renderInput={(params) =>
        //                             <TextField
        //                                 {...params}
        //                                 variant="standard"
        //                                 style={{ width: '48%' }}
        //                             />
        //                         }
        //                     />
        //                 </div>
        //             ),
        //         },
        //     },
        // },
        // {
        //     label: `${t('Gift.Updated_at')}`,
        //     name: 'updatedAt',
        //     options: {
        //         filter: false,
        //         customBodyRenderLite: (dataIndex, rowIndex) => {
        //             return (
        //                 <Grid key={dataIndex} container spacing={2} alignItems="center">
        //                     <Grid item xs zeroMinWidth>
        //                         <Typography align="left" variant="h6" color="inherit">
        //                             {Helper.apiTsToTableFormat(new Date(data[dataIndex].updatedAt).toISOString())[0]}
        //                         </Typography>
        //                         <Typography align="left" variant="body2" sx={{ color: "text.hint" }}>
        //                             {Helper.apiTsToTableFormat(new Date(data[dataIndex].updatedAt).toISOString())[1]}
        //                         </Typography>
        //                     </Grid>
        //                 </Grid >
        //             );
        //         },
        //     },
        // },
        {
            label: '',
            name: '',
            options: {
                filter: false,
                sort: false,
                empty: true,
                customBodyRenderLite: (dataIndex) => {
                    return (
                        <Box component="span" m={1} className={classes.overlaymain}>
                            <Box component="span" className={classes.overlayedit} display="flex">
                                <Fab size="small" color="secondary" aria-label="add" onClick={() => handleOpenEditOneDialog(dataIndex)}>
                                    <EditIcon />
                                </Fab>
                                {(user && user.role && user.role === 'Admin') ? // hide when user has no access right
                                    <Fab
                                        size="small"
                                        sx={{ backgroundColor: 'error.main' }}
                                        className={classes.btnlast}
                                        onClick={() => handleDelete(dataIndex)}
                                    >
                                        <DeleteOutlineIcon />
                                    </Fab>
                                    : <></>}
                            </Box>
                        </Box >
                    );
                },
            },
        },
    ];

    const options = {
        rowsPerPage: rowsPerPage,
        selectableRows: "none",
        print: false,
        viewColumns: false,
        onDownload: () => {
            handleOpenExportDialog();
            return false;
        },
        count: totalCount,
        serverSide: true,
        onTableChange: (action, tableState) => {
            const resetPageAction = ['search', 'filterChange', 'resetFilters'];
            if (resetPageAction.includes(action))
                tableState.page = 0;
            const fetchAction = ['changePage', 'changeRowsPerPage', 'sort', 'search', 'filterChange', 'resetFilters'];
            if (fetchAction.includes(action)) {
                setCurrPage(tableState.page);
                if (action === 'changeRowsPerPage')
                    setRowsPerPage(tableState.rowsPerPage);
                if (action === 'filterChange')
                    setFilterList(tableState.filterList);
                changePage({
                    page: tableState.page,
                    rowsPerPage: tableState.rowsPerPage,
                    isGift: true,
                    sort: _.isEmpty(tableState.sortOrder) ?
                        undefined :
                        { [tableState.sortOrder.name]: tableState.sortOrder.direction === 'asc' ? 1 : -1 },
                    query: tableState.searchText,
                    filter: tableState.filterList.reduce((p, c, i) => {
                        if (c.length) {
                            if (!p)
                                p = [];
                            let obj = {};
                            // if (tableState.columns[i].name === 'createdAt') {
                            //     obj[tableState.columns[i].name] = {};
                            //     if (c[0])
                            //         obj[tableState.columns[i].name].$gte = c[0];
                            //     if (c[1])
                            //         obj[tableState.columns[i].name].$lte = c[1];
                            // }
                            if (tableState.columns[i].name === 'display') {
                                // Convert 'Y' to true and 'N' to false
                                c[0] === 'Y' ? obj[tableState.columns[i].name] = true : c[0] === 'N' ?
                                    obj[tableState.columns[i].name] = false : obj[tableState.columns[i].name] = { $in: [true, false] };
                            }
                            else {
                                obj[tableState.columns[i].name] = c[0];
                            }
                            p.push(obj);
                        }
                        console.log(JSON.stringify(p))
                        return p;
                    }, undefined)
                });
            }
        },
        // customSearch: (searchQuery, currentRow, columns) => {
        //     searchQuery = searchQuery.toLowerCase(); // convert query to lowercase
        //     return columns.some((column, index) => {
        //         if (!column.label || !currentRow[index]) { // handle edit buttons & undefined
        //             return false;
        //         } else if (column.label === 'Status') { // handle status
        //             return (currentRow[index] ? "active" : "disabled").includes(searchQuery);
        //         } else if (column.label === 'Last Modification' || column.label === 'Last Login') { // handle formatted timestamp
        //             return Helper.apiTsToTableFormat(currentRow[index]).join(' ').toLowerCase().includes(searchQuery);
        //         } else { // default behavior
        //             return currentRow[index].toString().toLowerCase().includes(searchQuery);
        //         }
        //     });
        // },

        textLabels: {
            title: {

            },
            body: {
                noMatch: t('Muidatatable.body.noMatch'),
                toolTip: t('Muidatatable.body.toolTip'),
            },
            pagination: {
                next: t('Muidatatable.pagination.next'),
                previous: t('Muidatatable.pagination.previous'),
                rowsPerPage: t('Muidatatable.pagination.rowsPerPage'),
                displayRows: t('Muidatatable.pagination.displayRows'),
            },
            toolbar: {
                search: t('Muidatatable.toolbar.search'),
                downloadCsv: t('Muidatatable.toolbar.downloadCsv'),
                print: t('Muidatatable.toolbar.print'),
                viewColumns: t('Muidatatable.toolbar.viewColumns'),
                filterTable: t('Muidatatable.toolbar.filterTable'),
            },
            filter: {
                all: t('Muidatatable.filter.all'),
                title: t('Muidatatable.filter.title'),
                reset: t('Muidatatable.filter.reset'),
            },
        }
    };

    // Edit Dialog
    const formikRef = useRef();
    const [editOneDialogData, setEditOneDialogData] = useState({});
    const [openEditOneDialog, setOpenEditOneDialog] = useState(false);

    const handleOpenEditOneDialog = (index) => {
        const d = data[index] ?? null;

        setEditOneDialogData({
            submit: null,
            index,
            dialogType: d ? "Edit" : "Create",
            giftId: d?.giftId ?? "",
            display_name_en: d?.display_name_en ?? "",
            display_name_zh_hant: d?.display_name_zh_hant ?? "",
            display_name_zh_hans: d?.display_name_zh_hans ?? "",
            // greenScore: d?.greenScore ?? "",
            // description: d?.description ?? "",
            // remarks: d?.remarks ?? "",
            locationId: d?.locationId ?? "",
            shop_name: d?.shop_name ?? "",
            type: d?.type ?? "",
            display: d?.display ? 'Y' : 'N',
        });
        formikRef.current?.resetForm();
        setOpenEditOneDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenEditOneDialog(false);
    };

    const handleDelete = async (index) => {
        const d = data[index];
        if (window.confirm(`${t('Global.DeleteReminder')} ${d.giftId} ? `)) {
            try {
                await API.Gift.delete_one(d.giftId);
                const dd = [...data];
                dd.splice(index, 1)
                dispatch({ ...actionTypes.SNACKBAR_WARNING, message: `Record ${d.giftId} deleted!` });
                setData(dd)
            } catch (err) {
                dispatch(actionTypes.SNACKBAR_ERROR);
            }
        }
    };

    const reloadRecord = async (giftId, index) => {
        console.log(`reload`)
        try {
            const record = (await API.Gift.get_one(giftId)).data.data;
            const dd = [...data];
            if (index != null) {
                dd[index] = record;
                dispatch({ ...actionTypes.SNACKBAR_SUCCESS, message: `Gift ${record.giftId} updated!` });
            } else {
                dd.push(record);
                dispatch({ ...actionTypes.SNACKBAR_SUCCESS, message: `Gift ${record.giftId} created!` });
            }
            setData(dd);
        } catch {
            dispatch(actionTypes.SNACKBAR_ERROR);
        } finally {
            changePage({
                page: 0,
                rowsPerPage: rowsPerPage,
                isGift: true
            });
        }
    };

    // Import Dialog
    const [openImportDialog, setOpenImportDialog] = useState(false);
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadRes, setUploadRes] = useState(null);

    const handleOpenImportDialog = () => {
        setFile(null);
        setIsSubmitting(false);
        setUploadRes(null);
        setOpenImportDialog(true);
    };

    const handleCloseImportDialog = () => {
        setOpenImportDialog(false);
    };

    const onDrop = useCallback(acceptedFile => {
        setFile(acceptedFile[0]);
    }, []);

    const onSubmit = async () => {
        try {
            setIsSubmitting(true);
            const response = (await API.Gift.import_csv_gift(file)).data;
            setUploadRes({
                success: true,
                msg: `${response.data.length} gift record uploaded successfully!`
            });
            changePage({
                page: 0,
                rowsPerPage: rowsPerPage,
                isGift: true
            });
        } catch (err) {
            if (err?.response?.data?.message)
                setUploadRes({
                    success: false,
                    msg: err.response.data.message
                });
            else
                dispatch(actionTypes.SNACKBAR_ERROR);
        } finally {
            setIsSubmitting(false);
        }
    }

    // Export Dialog
    const [openExportDialog, setOpenExportDialog] = useState(false);
    const [exportQuery, setExportQuery] = useState(null);

    const handleOpenExportDialog = () => {
        setExportQuery({
            // startDate: filterDate && filterDate[0],
            // endDate: filterDate && filterDate[1],
            giftId: filterList[0][0],
        });
        setOpenExportDialog(true);
    };

    const handleCloseExportDialog = () => {
        setOpenExportDialog(false);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <React.Fragment>
            <general.breadcrumb title="" trail={[`${t('Global.Home')}`, `${t('Gift.Title')}`]} />
            {/* Table */}

            <MUIDataTable
                title={
                    isLoading ? <Loader loading={isLoading} /> :
                        <Box>
                            <Fab title={`${t('Global.Create')}${t('Gift.Title')}`} aria-label="add" size="small" color="secondary" className={classes.btnAdd} onClick={() => handleOpenEditOneDialog()}>
                                <AddIcon />
                            </Fab>
                            <Fab title={`${t('Gift.Import_Gift_CSV')}`} aria-label="import" size="small" color="secondary" className={classes.btnlast} onClick={() => handleOpenImportDialog()}>
                                <ImportIcon />
                            </Fab>
                        </Box>
                }
                data={isLoading ? Skeleton.skeletonData(rowsPerPage) : data}
                columns={isLoading ? Skeleton.skeletonColumns(columns) : columns}
                options={options}
                className={classes.table}
            />
            {/* Edit Dialog */}
            {openEditOneDialog && <Dialog
                open={openEditOneDialog}
                TransitionComponent={Transition}
                onClose={handleCloseDialog}
                className={classes.noMarginDialog}
                keepMounted
            >
                <dialog.header title={`${t('Global.' + editOneDialogData.dialogType)}${t('Gift.Title')}`} handleClose={handleCloseDialog} />
                <Formik
                    enableReinitialize
                    innerRef={formikRef}
                    initialValues={editOneDialogData}
                    validationSchema={Yup.object().shape({
                        giftId: Validation.isNum(),
                        // description: Validation.required(),
                        display_name_en: Validation.required(),
                        display_name_zh_hans: Validation.required(),
                        display_name_zh_hant: Validation.required(),
                        locationId: Validation.required(),
                        shop_name: Validation.required(),
                        type: Validation.required(),
                    })}
                    onSubmit={async (values) => {
                        console.log(`hiiii`)
                        try {
                            if (editOneDialogData.dialogType === "Edit") {
                                //edit gift info
                                //id, name_tc, name, locationID, shop name or shop id (for deleted shop), type, display
                                let displayval = (values.display === "Y")
                                console.log(`hi ${JSON.stringify(values, null, 2)}`)
                                await API.Gift.update_one_gift(values.giftId, values.display_name_en, values.display_name_zh_hant, values.display_name_zh_hans, values.locationId, values.shop_name, values.type, displayval);

                            } else {
                                //create
                                let displayval = (values.display === "Y")
                                // console.log(gift.display)
                                console.log(`hi ${JSON.stringify(values, null, 2)}`)
                                await API.Gift.create_one_gift(values.giftId, values.display_name_en, values.display_name_zh_hant, values.display_name_zh_hans, values.locationId, values.shop_name, values.type, displayval)
                            }
                            reloadRecord(values.giftId, values.index);
                            handleCloseDialog();

                        } catch (err) {
                            if (err.response.data.message) {
                                dispatch({ ...actionTypes.SNACKBAR_ERROR, message: err.response.data.message })
                            } else {
                                dispatch(actionTypes.SNACKBAR_ERROR);
                            }


                        }
                    }}
                >
                    {props => {
                        const { values, handleSubmit } = props;
                        return (
                            <form noValidate onSubmit={handleSubmit}>
                                <DialogContent>
                                    <Grid container spacing={2}>
                                        <dialog.textField form={props} label={`${t('Gift.Gift_ID')}`} name="giftId" xs={12} required readOnly={editOneDialogData.dialogType !== "Create"} />
                                        <dialog.textField form={props} label={`${t('Gift.Name_en')}`} name="display_name_en" xs={12} required />
                                        <dialog.textField form={props} label={`${t('Gift.Name_tc')}`} name="display_name_zh_hant" xs={12} required />
                                        <dialog.textField form={props} label={`${t('Gift.Name_sc')}`} name="display_name_zh_hans" xs={12} required />
                                        <dialog.textField form={props} label={`${t('Gift.LocationID')}`} name="locationId" xs={12} required />
                                        <dialog.textField form={props} label={`${t('Gift.Shop_name')}`} name="shop_name" xs={12} required />
                                        <dialog.dropDownList form={props} label={`${t('Gift.Type')}`} name="type" xs={12} required options={[
                                            { value: "machine", name: "machine" }, { value: "station", name: "station" }, { value: "spot", name: "spot" }
                                        ]} />
                                        <dialog.dropDownList form={props} label={`${t('Gift.Display')}`} name="display" xs={12} options={[
                                            { value: "Y", name: "True" }, { value: "N", name: "False" }
                                        ]} />
                                    </Grid>
                                </DialogContent>

                                <DialogActions>
                                    {!props.isSubmitting && <dialog.footerButton onClick={() => handleOpenEditOneDialog(values.index)} text={editOneDialogData.dialogType === "Edit" ? `${t('Global.Reset')}` : `${t('Global.Clear')}`} />}
                                    <dialog.submitButton isSubmitting={props.isSubmitting} text={`${t('Global.Submit')}`} />
                                </DialogActions>
                            </form>
                        )
                    }}
                </Formik>
            </Dialog>}

            {/* Import Dialog */}
            {openImportDialog && <Dialog
                open={openImportDialog}
                TransitionComponent={Transition}
                onClose={handleCloseImportDialog}
                className={classes.noMarginDialog}
                keepMounted
                fullWidth
                maxWidth={(uploadRes && !uploadRes.success) ? "xl" : "xs"}
            >
                <dialog.header title={`${t('Gift.Import_Gift_CSV')}`} handleClose={handleCloseImportDialog} />
                <DialogContent dividers>
                    {uploadRes ?
                        uploadRes.success ?
                            <Alert severity="success">{uploadRes.msg}</Alert> :
                            <React.Fragment>
                                {
                                    typeof uploadRes.msg === "string" ? <Alert severity="error">{uploadRes.msg}</Alert> :
                                        Object.entries(uploadRes.msg).map(el => <Alert severity="error">{`[Row ${el[0]}] ${el[1]}`}</Alert>)
                                }
                            </React.Fragment>
                        : isSubmitting ?
                            <CircularProgress size={20} />
                            :
                            <div {...getRootProps()} style={{ height: '10vh', textAlign: 'center', verticalAlign: 'middle', borderStyle: 'dashed', borderColor: 'grey' }}>
                                <input {...getInputProps()} />
                                {
                                    file ?
                                        <p>{file.name}</p> :
                                        isDragActive ?
                                            <p>{`${t('Gift.Drop_file_content_1')}`}</p> :
                                            <p>{`${t('Gift.Drop_file_content_2')}`}</p>
                                }
                            </div>
                    }
                </DialogContent>
                {(!isSubmitting && !uploadRes) && <DialogActions>
                    <dialog.footerButton onClick={() => handleOpenImportDialog()} text={`${t('Global.Clear')}`} />
                    <dialog.submitButton isSubmitting={isSubmitting} disabled={isSubmitting || !file} onClick={onSubmit} text={`${t('Global.Upload')}`} />
                </DialogActions>}
            </Dialog>}

            {/* Export Dialog */}
            {openExportDialog && <Dialog
                open={openExportDialog}
                TransitionComponent={Transition}
                onClose={handleCloseExportDialog}
                className={classes.noMarginDialog}
                keepMounted
            >
                <dialog.header title={`${t('Gift.Export_Gift_CSV')}`} handleClose={handleCloseExportDialog} />
                <Formik
                    enableReinitialize
                    initialValues={exportQuery}
                    validationSchema={Yup.object().shape({
                        //startDate: Validation.required(),
                        //endDate: Validation.required(),
                    })}
                    onSubmit={async (values) => {
                        try {
                            // const startDate = values.startDate ? new Date(values.startDate) : null;
                            // const endDate = values.endDate ? new Date(values.endDate) : null;
                            // let createdAt = null;
                            // if (startDate || endDate) {
                            //     createdAt = {}
                            //     if (startDate) {
                            //         createdAt.$gte = startDate
                            //     }
                            //     if (endDate) {
                            //         createdAt.$lte = endDate
                            //     }
                            // }

                            const isGift = true;
                            let filter = [];
                            // if (createdAt) filter.push({ createdAt: createdAt });
                            if (values.giftId) filter.push({ giftId: values.giftId });
                            if (values.display_name_en) filter.push({ display_name_en: values.display_name_en });
                            if (values.display_name_zh_hant) filter.push({ display_name_zh_hant: values.display_name_zh_hant });
                            if (values.display_name_zh_hans) filter.push({ display_name_zh_hant: values.display_name_zh_hans });
                            if (values.locationId) filter.push({ locationId: values.locationId });
                            if (values.shop_name) filter.push({ shop_name: values.shop_name });
                            if (values.type) filter.push({ type: values.type === "machine" || values.type === "station" || values.type === "spot" ? values.type : { $in: ["machine", "station", "spot"] } });
                            if (values.display) filter.push({ display: values.display === "Y" ? true : values.display === "N" ? false : { $in: [true, false] } });
                            console.log(`filter: ${JSON.stringify(filter)}`);
                            const params = { isGift: isGift, filter: filter }
                            saveAs((await API.Gift.export_csv(params)).data, 'gift.csv');
                        } catch (err) {
                            if (err.response?.status === 404)
                                dispatch({ ...actionTypes.SNACKBAR_ERROR, message: t('Snackbar.NoDateRangeRecord') });
                            else
                                dispatch(actionTypes.SNACKBAR_ERROR);
                        }
                    }}
                >
                    {props => {
                        const { values, handleSubmit } = props;
                        return (
                            <form noValidate onSubmit={handleSubmit}>
                                <DialogContent>
                                    <Grid container spacing={2}>
                                        {/* <dialog.datePicker form={props} label={`${t('Gift.StartDate')}`} name="startDate" maxDate={values.endDate} xs={6} /> */}

                                        {/* <dialog.datePicker form={props} label={`${t('Gift.EndDate')}`} name="endDate" minDate={values.startDate} xs={6} /> */}

                                        <dialog.textField form={props} label={`${t('Gift.Gift_ID')}`} name="giftId" xs={6} />
                                        <dialog.textField form={props} label={`${t('Gift.Name_en')}`} name="display_name_en" xs={6} />
                                        <dialog.textField form={props} label={`${t('Gift.Name_tc')}`} name="display_name_zh_hant" xs={6} />
                                        <dialog.textField form={props} label={`${t('Gift.Name_sc')}`} name="display_name_zh_hans" xs={6} />
                                        <dialog.textField form={props} label={`${t('Gift.LocationID')}`} name="locationId" xs={6} />
                                        <dialog.textField form={props} label={`${t('Gift.Shop_name')}`} name="shop_name" xs={6} />
                                        <dialog.dropDownList form={props} label={`${t('Gift.Type')}`} name="type" xs={6} options={[
                                            { value: "All", name: "All" }, { value: "machine", name: "machine" }, { value: "station", name: "station" }, { value: "spot", name: "spot" }
                                        ]} />
                                        <dialog.dropDownList form={props} label={`${t('Gift.Display')}`} name="display" xs={6} options={[
                                            { value: "All", name: "All" }, { value: "Y", name: "True" }, { value: "N", name: "False" }
                                        ]} />

                                    </Grid>

                                </DialogContent>
                                <DialogActions>
                                    <dialog.submitButton isSubmitting={props.isSubmitting} text={`${t('Global.Submit')}`} />
                                </DialogActions>
                            </form>
                        )
                    }}
                </Formik>
            </Dialog>}
        </React.Fragment>
    );
};

export default UIList;