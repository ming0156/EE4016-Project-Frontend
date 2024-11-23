import {
    Grid
} from '@mui/material';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as actionTypes from '../../store/actions';
import { saveAs } from 'file-saver'
import { general, dialog } from '../../utils/componentWizard';
import API from '../../api';
import { useTranslation } from 'react-i18next';
import MUIDataTable from 'mui-datatables';

const UIList = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    // export dialog
    const [downloadingMember, setDownloadingMember] = useState(false);

    const downloadMemberCsv = async () => {
        try {
            setDownloadingMember(true);
            saveAs((await API.Member.export_csv()).data, 'member.csv');
        } catch (err) {
            console.log(err);
            dispatch(actionTypes.SNACKBAR_ERROR);
        } finally {
            setDownloadingMember(false);
        }
    }

    return (
        <React.Fragment>
            <general.breadcrumb title="" trail={[`${t('Global.Home')}`, `${t('Member.Title')}`]} />

            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <dialog.footerButton onClick={downloadMemberCsv} text={`${t('Member.Download_Member')}`} variant="outlined" isLoading={downloadingMember} />
                </Grid>
            </Grid>


        </React.Fragment>
    );
};

export default UIList;