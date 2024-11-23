import { useState, useEffect } from 'react';
import MUIDataTable from 'mui-datatables';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet-contextmenu';
import 'leaflet-contextmenu/dist/leaflet.contextmenu.css';
import Skeleton from '../../utils/skeleton';
import { useTranslation } from 'react-i18next';
import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import API from '../../api';
import ClearIcon from '@mui/icons-material/Clear';
import MarkerClusterGroup from 'react-leaflet-markercluster';

import { Refresh } from '@mui/icons-material';
import { Typography, Dialog, /*extractEventHandlers*/ } from '@mui/material';
import StatusChip from './StatusChip'
import Helper from '../../utils/helper';

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
            justifyContent: 'flex-end',
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
        },
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
    },
}));

const MapView = () => {
    const [map, setMap] = useState(null);
    const [data, setData] = useState([]);
    //const [aoeData, setAoeData] = useState([]);
    const [specialCodeData, setSpecialCodeData] = useState([]);
    const [dialogType, setDialogType] = useState('')
    const [heartBeat, setHeartBeat] = useState([]);
    const [serverStatus, setServerStatus] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isDialogLoading, setIsDiaLogLoading] = useState(true);
    let combinedArray = [];
    //let completedArray = [];
    const [isLoading, setIsLoading] = useState(true);
    const { t } = useTranslation();
    const classes = useStyles();

    async function openDialog(machineID, type) {
        setIsOpen(true);
        setIsDiaLogLoading(true);
        let response = []
        // console.log(type)
        if (type === 'capacity') {
            response = (await API.Machine.get_latest_capacity_status_log(machineID)).data.data;
        }
        else if (type === 'general') {
            response = (await API.Machine.get_latest_general_status_log(machineID)).data.data;
        }
        else if (type === 'special') {
            response = (await API.Machine.get_latest_special_status_log(machineID)).data.data;
        }
        setDialogType(type)
        setSpecialCodeData(response);
        setIsDiaLogLoading(false);
    }

    function handleCloseDialog() {
        setIsOpen(false);
    }

    async function reloadHeartBeat() {
        checkServerStatus();
    }

    const checkServerStatus = async () => {
        try {

            let now = new Date();
            let contractorList = (await API.Contractor.get_all()).data.data;
            // console.log(await API.Contractor.get_all())
            // console.log(contractorList)
            let contractorListArray = contractorList.map((contractor) => {
                contractor['status'] = 'alive'
                return contractor;
            });
            let currentYear = now.toString().split(' ')[3];
            let currentMon = now.toString().split(' ')[1];
            switch (currentMon) {
                case 'Jan':
                    currentMon = '01';
                    break;
                case 'Feb':
                    currentMon = '02';
                    break;
                case 'Mar':
                    currentMon = '03';
                    break;
                case 'Apr':
                    currentMon = '04';
                    break;
                case 'May':
                    currentMon = '05';
                    break;
                case 'Jun':
                    currentMon = '06';
                    break;
                case 'Jul':
                    currentMon = '07';
                    break;
                case 'Aug':
                    currentMon = '08';
                    break;
                case 'Sep':
                    currentMon = '09';
                    break;
                case 'Oct':
                    currentMon = '10';
                    break;
                case 'Nov':
                    currentMon = '11';
                    break;
                case 'Dec':
                    currentMon = '12';
                    break;
                default:
            }
            let currentDay = now.toString().split(' ')[2];
            let currentTimeH = now.toString().split(' ')[4].split(':')[0];
            let currentTimeM = now.toString().split(' ')[4].split(':')[1];

            let contractorSortedListArray = [];
            for (let i = 0; i < contractorListArray.length; i++) {
                contractorSortedListArray.push(contractorListArray[i]);
            }

            for (let i = 0; i < contractorSortedListArray.length; i++) {
                // console.log(contractorSortedListArray[i])
                if (contractorSortedListArray[i].updatedAt) {
                    let contractorYear = contractorSortedListArray[i].updatedAt.split('-')[0];
                    let contractorMon = contractorSortedListArray[i].updatedAt.split('-')[1];
                    let contractorDay = contractorSortedListArray[i].updatedAt.split('-')[2].split('T')[0];
                    let contractorH = contractorSortedListArray[i].updatedAt.split('T')[1].split(':')[0];
                    let contractorM = contractorSortedListArray[i].updatedAt.split('T')[1].split(':')[1];
                    if (+currentYear - +contractorYear !== 0) {
                        contractorSortedListArray[i].status = 'ShutDown';
                    }
                    if (+currentMon - +contractorMon !== 0) {
                        contractorSortedListArray[i].status = 'ShutDown';
                    }
                    if (+currentDay - +contractorDay !== 0) {
                        contractorSortedListArray[i].status = 'ShutDown';
                    }
                    if (+currentTimeH - +contractorH >= 1) {
                        if (+currentTimeM + 60 - +contractorM >= 5) {
                            contractorSortedListArray[i].status = 'ShutDown';
                        }
                    } else {
                        if (+currentTimeM - +contractorM >= 5) {
                            contractorSortedListArray[i].status = 'ShutDown';
                        }
                    }
                }
            }
            setServerStatus(contractorSortedListArray);
        } catch (error) {
            console.error(error)
        }
    };

    const init = async () => {
        try {
            setIsLoading(true);

            let lData = (await API.Location.get_all()).data.data;
            let mData = (await API.Machine.get_all()).data.data;

            let machineStatus = (await API.Machine.get_sl()).data.data;
            //setAoeData(machineStatus)
            machineStatus = machineStatus && machineStatus.map((element, index) => {
                element.id = index + 1
                return element
            })
            setHeartBeat(machineStatus)

            for (let m of mData) {
                const locationData = lData.find((element) => element.locationID === m.locationID)
                if (locationData) {
                    if (locationData.latitude && locationData.longitude) {
                        combinedArray.push({
                            latitude: locationData.latitude,
                            longitude: locationData.longitude,
                            machineID: m.machineID,
                            machineType: m.machineType,
                            description: m.remarks,
                            address: locationData.address,
                            locationID: locationData.locationID,
                            locationType: locationData.locationType,
                        });
                    }
                }
            }
            for (let i = 0; i < combinedArray.length; i++) {
                const statusIndex = machineStatus.findIndex((element) => {
                    return element.machineID === combinedArray[i].machineID
                })
                let status = ''
                combinedArray[i].status = status;
            }

            setData(combinedArray);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };
    function getWindowSize() {
        const { innerWidth, innerHeight } = window;
        return { innerWidth, innerHeight };
    }

    const [windowSize, setWindowSize] = useState(getWindowSize());

    // async function getSL() {
    //     let machineList = await API.Machine.get_sl();
    //     console.log('machineList', machineList);
    // }

    useEffect(() => {
        checkServerStatus();
        // getSL();
        init();
        function handleWindowResize() {
            setWindowSize(getWindowSize());
        }
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    //for display index in dataTable
    // function customRowIndexColumn() {
    //     return {
    //         name: `${t('Map.Index')}`,
    //         options: {
    //             filter: false,
    //             customBodyRender: (value, meta) => {
    //                 return meta.rowIndex + 1;
    //             },
    //         },
    //     };
    // }
    function capacity2Color(capacity) {
        if (capacity == null)
            return '#808080'
        if (capacity >= 95)
            return '#EB5757'
        else if (capacity >= 80)
            return '#F2C94C'
        return '#2F80ED'
    }

    function level2Color(level) {
        if (level === 1)
            return '#F2C94C'
        else if (level === 2)
            return '#EB5757'
        return '#2F80ED'
    }

    function level2Message(level) {
        if (level === 1)
            return 'Warning'
        else if (level === 2)
            return 'Error'
        return 'Online'
    }

    //for customize the value(level to status) in dataTable
    function capacityDisplay() {
        return {
            label: `${t('Map.CapacityStatus')}`,
            name: 'capacityStatus',
            options: {
                filter: true,
                sortCompare: (order) => {
                    return (obj1, obj2) => {
                        if (obj1.data == null) return (order === 'asc' ? -1 : 1)
                        if (obj2.data == null) return (order === 'asc' ? 1 : -1)
                        let val1 = parseInt(obj1.data, 10);
                        let val2 = parseInt(obj2.data, 10);
                        return (val1 - val2) * (order === 'asc' ? 1 : -1);
                    };
                },
                customBodyRender: (value, meta) => {
                    let message = value != null ? value + "%" : "none"
                    let bgColor = capacity2Color(value)
                    return (
                        <StatusChip bgColor={bgColor} meta={meta} message={message} openDialog={openDialog} type={'capacity'} />
                    );
                },
            },
        };
    }
    function generalDisplay() {
        return {
            label: `${t('Map.GeneralStatus')}`,
            name: 'generalStatus',
            options: {
                filter: true,
                // sortCompare: (order) => {
                //     return (obj1, obj2) => {
                //         let val1 = obj1.data ? obj1.data[0].level : 3;
                //         let val2 = obj2.data ? obj2.data[0].level : 3;
                //         return (val1 - val2) * (order === 'asc' ? 1 : -1)
                //     }
                // },
                customBodyRender: (value, meta) => {
                    let bgColor = value != null ? value === "Online" ? "#2F80ED" : "#EB5757" : "#808080"
                    let message = value != null ? value : 'none'
                    return (
                        <StatusChip bgColor={bgColor} meta={meta} message={message} openDialog={openDialog} type={'general'} />
                    );
                },
            },
        };
    }
    function specialDisplay() {
        return {
            label: `${t('Map.SpecialStatus')}`,
            name: 'specialStatus',
            options: {
                filter: true,
                customBodyRender: (value, meta) => {
                    let bgColor = value != null ? value === "Online" ? "#2F80ED" : "#EB5757" : "#808080"
                    let message = value != null ? value : 'none'
                    return (
                        <StatusChip bgColor={bgColor} message={message} meta={meta} openDialog={openDialog} type={'special'} />
                    );
                },
            },
        };
    }

    function dialogLevel2Message(level) {
        if (level === 1)
            return 'Error'
        else if (level === 2)
            return 'Offline'
        return 'Online'
    }
    const levelDisplay = {
        label: `${t('Map.Status')}`,
        name: 'level',
        options: {
            filter: false,
            customBodyRender: (value, meta) => {
                let bgColor = level2Color(value)
                let message = dialogLevel2Message(value)
                if ([0, 1, 2].includes(value)) {
                    return (
                        <StatusChip bgColor={bgColor} message={message} openDialog={() => { }} sx={{ cursor: 'default' }} />
                    );
                } else {
                    return 'Unexpected level';
                }
            },
        },
    }

    const columns = [
        // customRowIndexColumn(),
        {
            label: `${t('Map.Index')}`,
            name: 'id',
            options: {
                filter: false,
            }
        },
        {
            label: `${t('Map.MachineID')}`,
            name: 'machineID',
            options: {
                filter: true,
            },
        },
        // {
        //     label: `${t('Map.Description')}`,
        //     name: 'message',
        //     options: {
        //         filter: false,
        //     },
        // },
        capacityDisplay(),
        generalDisplay(),
        specialDisplay(),
    ];

    const capacityLevelDisplay = {
        label: `${t('Map.Status')}`,
        name: 'capacity',
        options: {
            filter: false,
            customBodyRender: (value, meta) => {
                let bgColor = capacity2Color(meta.rowData[5])
                let message = value != null ? value + '%' : 'none'
                return (
                    <StatusChip bgColor={bgColor} message={message} openDialog={() => { }} sx={{ cursor: 'default' }} />
                );
            },
        }
    }

    const createdAtColumn = {
        label: `${t('Map.createdAt')}`,
        name: 'createdAt',
        options: {
            filter: false,
            customBodyRender: (value, tableMeta, updateValue) => {
                return (
                    <Grid key={tableMeta.rowIndex} container spacing={2} alignItems="center">
                        <Grid item xs zeroMinWidth>
                            <Typography align="left" variant="h6" color="inherit">
                                {Helper.apiTsToTableFormat(new Date(value).toISOString())[0]}
                            </Typography>
                            <Typography align="left" variant="body2" sx={{ color: "text.hint" }}>
                                {Helper.apiTsToTableFormat(new Date(value).toISOString())[1]}
                            </Typography>
                        </Grid>
                    </Grid >
                );
            },
        }
    }

    const capacityColumns = [
        createdAtColumn,
        { label: `${t('Map.MachineID')}`, name: 'machineID', options: { filter: false } },
        { label: `${t('Map.Code')}`, name: 'code', options: { filter: false } },
        { label: `${t('Map.Level')}`, name: 'level', options: { filter: false } },
        { label: `${t('Map.Bin_Type')}`, name: 'type', options: { filter: false } },
        capacityLevelDisplay,
    ]
    const generalColumns = [
        createdAtColumn,
        { label: `${t('Map.MachineID')}`, name: 'machineID', options: { filter: false } },
        { label: `${t('Map.Code')}`, name: 'code', options: { filter: false } },
        { label: `${t('Map.Level')}`, name: 'level', options: { filter: false } },
        { label: `${t('Map.Description')}`, name: 'message', options: { filter: false } },
    ]
    const specialCodeColumns = [
        createdAtColumn,
        { label: `${t('Map.MachineID')}`, name: 'machineID', options: { filter: false } },
        { label: `${t('Map.Code')}`, name: 'code', options: { filter: false } },
        { label: `${t('Map.Level')}`, name: 'level', options: { filter: false } },
        { label: `${t('Map.Description')}`, name: 'message', options: { filter: false } },
        levelDisplay,
    ];
    const iconMarkup = renderToStaticMarkup(<img alt='icon_machine' src="https://www.hkrvm.com.hk/images/rvm_map/icon_machine_available.png"></img>);

    const customMarkerIcon = divIcon({ html: iconMarkup });

    return (
        <div>
            <Grid container spacing={4}>
                <Grid item xl={8} lg={12}>
                    <div style={{ display: 'flex', flexDirection: 'column', }}>
                        <div style={{ width: '100%', minWidth: '420px' }}>
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <h3>
                                    <b>{`${t('Map.ServerStatus')}`}</b>
                                </h3>
                                <div style={{ marginLeft: 'auto', marginRight: '0px', position: 'relative', cursor: 'pointer' }} onClick={() => reloadHeartBeat()}>
                                    <Refresh style={{ margin: '0px', position: 'absolute', right: '100%', top: '50%', transform: 'translateY(-50%)' }} />
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'block', borderBottom: '2px solid #C2C9D1', marginTop: '10px', marginBottom: '10px' }}></div>
                        <div>
                            <div style={{ margin: '0px 0px 6px 6px' }} />
                            <div
                                style={
                                    {
                                        height: '110px',
                                        width: '100%',
                                        minWidth: '420px',
                                        backgroundColor: '#FFFFFF',
                                        borderTopLeftRadius: '25px',
                                        borderTopRightRadius: '25px',
                                        overflowWrap: 'anywhere',
                                        overflowY: 'auto',
                                    }
                                }
                            >
                                <div
                                    style={
                                        windowSize.innerWidth <= 1300
                                            ? {
                                                display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'space-around',
                                                marginLeft: '10px',
                                                marginTop: '10px',
                                                flexWrap: 'wrap',
                                            }
                                            : {
                                                display: 'flex',
                                                flexDirection: 'row',
                                                //   justifyContent: 'space-around',
                                                marginLeft: '10px',
                                                marginTop: '10px',
                                                flexWrap: 'wrap',
                                            }
                                    }
                                >
                                    {serverStatus.map((server, index) => {
                                        return (
                                            <div key={index}>
                                                <div
                                                    style={{
                                                        minWidth: '100px',
                                                        maxWidth: '335px',
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        // justifyContent: 'space-around',
                                                    }}
                                                >
                                                    {windowSize.innerWidth <= 1300 ? (
                                                        <div
                                                            style={
                                                                server.status === 'alive'
                                                                    ? {
                                                                        height: '10px',
                                                                        width: '10px',
                                                                        backgroundColor: 'green',
                                                                        borderRadius: '50%',
                                                                        marginTop: '6px',
                                                                        marginRight: '20px',
                                                                    }
                                                                    : {
                                                                        height: '10px',
                                                                        width: '10px',
                                                                        backgroundColor: 'red',
                                                                        borderRadius: '50%',
                                                                        marginRight: '20px',
                                                                        marginTop: '6px',
                                                                    }
                                                            }
                                                        ></div>
                                                    ) : (
                                                        <div
                                                            style={
                                                                server.status === 'alive'
                                                                    ? {
                                                                        height: '10px',
                                                                        width: '10px',
                                                                        backgroundColor: 'green',
                                                                        borderRadius: '50%',
                                                                        marginTop: '6px',
                                                                        marginLeft: '20px',
                                                                        marginRight: '25px',
                                                                    }
                                                                    : {
                                                                        height: '10px',
                                                                        width: '10px',
                                                                        backgroundColor: 'red',
                                                                        borderRadius: '50%',
                                                                        marginRight: '25px',
                                                                        marginLeft: '20px',
                                                                        marginTop: '6px',
                                                                    }
                                                            }
                                                        ></div>
                                                    )}
                                                    {windowSize.innerWidth <= 1300 ? (
                                                        <div style={{ width: '240px' }}>{server.contractorID}</div>
                                                    ) : (
                                                        <div style={{ width: '135px' }}>{server.contractorID}</div>
                                                    )}
                                                    {/* <div style={{ width: '120px' }}>{server[0].contractorID}</div> */}
                                                    {server.status === 'alive' ? <div style={{ marginRight: '19px' }}>Online</div> : <></>}
                                                    {server.status === 'dead' ? (
                                                        <div style={{ marginRight: '20px' }}>Error&nbsp;&nbsp;&nbsp;</div>
                                                    ) : (
                                                        <></>
                                                    )}
                                                    {server.status === 'ShutDown' ? <div style={{ marginRight: '19px' }}>Offline</div> : <></>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div
                                style={
                                    {
                                        height: '30px',
                                        width: '100%',
                                        minWidth: '420px',
                                        backgroundColor: '#9190A1',
                                        borderBottomRightRadius: '25px',
                                        borderBottomLeftRadius: '25px',
                                        position: 'relative',
                                        color: '#FFFFFF',
                                        display: 'flex',
                                        justifyContent: 'center',
                                    }
                                }
                            >
                                <div style={{ marginTop: '2px' }}>{`${t('Map.ServerStatus')}`}</div>
                            </div>
                        </div>

                        <div
                            style={
                                { marginTop: '50px', width: '100%', minWidth: '420px' }
                            }
                        ></div>
                        <div style={{ display: 'flex' }}>
                            <h3>
                                <b>{`${t('Map.Alerts')}`}</b>
                            </h3>
                            <div style={{ marginLeft: 'auto', marginRight: '0px', position: 'relative', cursor: 'pointer' }} onClick={() => init()}>
                                <Refresh style={{ margin: '0px', position: 'absolute', right: '100%', top: '50%', transform: 'translateY(-50%)' }} />
                            </div>
                        </div>
                        <div style={{ display: 'block', borderBottom: '2px solid #C2C9D1', marginTop: '10px', marginBottom: '10px' }}></div>
                        <MUIDataTable
                            data={isLoading ? Skeleton.skeletonData(20) : heartBeat}
                            columns={isLoading ? Skeleton.skeletonColumns(columns) : columns}
                            options={{
                                setCellProps: () => ({
                                    style: { width: windowSize.innerWidth - 950, minWidth: '420px' },
                                }),
                                rowsPerPage: 20,
                                rowsPerPageOptions: [20],
                                selectableRows: "none",
                                filter: true,
                                search: true,
                                print: false,
                                download: false,
                                viewColumns: false,
                                // sortOrder: {
                                //     name: 'id',
                                //     direction: 'asc'
                                // }
                            }}
                            className={classes.table}
                        />

                    </div>
                </Grid>
                <Grid item xl={4} lg={12}>
                    <MapContainer
                        center={[22.302711, 114.177216]}
                        zoom={13}
                        style={
                            {
                                height: '100%',
                                width: '100%',
                                minHeight: '700px',
                                minWidth: '420px'
                            }
                        }
                        whenCreated={setMap}
                        attributionControl={false}
                        contextmenu={true}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <MarkerClusterGroup showCoverageOnHover={false}>
                            {data.map((e, idx) => {
                                if (isNaN(e.latitude) || isNaN(e.longitude)) return;
                                return (
                                    <Marker key={idx} position={[parseFloat(e.latitude), parseFloat(e.longitude)]} icon={customMarkerIcon}>
                                        <Popup>
                                            <Typography noWrap variant="h6">
                                                machineID: {e.machineID}
                                            </Typography>
                                            <Typography noWrap variant="h6">
                                                locationID: {e.locationID}
                                            </Typography>
                                            <Typography noWrap variant="h6">
                                                LocationType: {e.locationType}
                                            </Typography>
                                            <Typography variant="h6">
                                                Address: {e.address}
                                            </Typography>
                                            {/* <Typography noWrap variant="h6">
                                                Status: {e.status}
                                            </Typography> */}
                                        </Popup>
                                    </Marker>
                                );
                            })}
                        </MarkerClusterGroup>
                    </MapContainer>
                </Grid>
            </Grid>
            {isOpen && (
                <Dialog open={isOpen} onClose={handleCloseDialog} fullWidth={true} maxWidth={"lg"}>
                    <div>
                        <ClearIcon onClick={handleCloseDialog} style={{ float: 'right', margin: '15px', cursor: 'pointer' }} />
                    </div>
                    <div>
                        <MUIDataTable
                            data={isDialogLoading ? Skeleton.skeletonData(5) : specialCodeData}
                            columns={isDialogLoading ? Skeleton.skeletonColumns(specialCodeColumns) : dialogType === 'special' ? specialCodeColumns : dialogType === 'capacity' ? capacityColumns : dialogType === 'general' ? generalColumns : []}
                            options={{
                                rowsPerPageOptions: [5, 10],
                                rowsPerPage: 5,
                                selectableRows: "none",
                                filter: false,
                                search: false,
                                print: false,
                                download: false,
                                viewColumns: false,
                                sortOrder: {
                                    name: 'code',
                                    direction: 'asc'
                                }
                            }}
                        />
                    </div>
                </Dialog>
            )}

        </div>

    );
};

export default MapView;
