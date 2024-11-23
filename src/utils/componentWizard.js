import CloseIcon from '@mui/icons-material/Close';
import TimePicker from '@mui/lab/TimePicker';
import {
    Autocomplete, Box, Button, Card,
    CardContent, CircularProgress, DialogTitle, FormControl, FormControlLabel,
    FormHelperText, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Select, Switch, TextField, ToggleButton, ToggleButtonGroup, Tooltip, Typography
} from '@mui/material';
import {
    DesktopDatePicker
} from '@mui/lab';
import { Field } from 'formik';
import _ from 'lodash';
import React from 'react';
import Breadcrumb from '../component/Breadcrumb';

const general = {};
const dialog = {};
const dashboard = {};

general.breadcrumb = ({ title, trail }) => (
    <Breadcrumb title={title}>
        <Typography to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
            {trail.shift()}
        </Typography>
        {trail.map(el =>
            <Typography key={el} variant="subtitle2" color="primary" className="link-breadcrumb">
                {el}
            </Typography>
        )}
    </Breadcrumb>
);

dialog.header = ({ title, handleClose }) => (
    <DialogTitle>
        {title}
        <IconButton style={{ backgroundColor: '#FFFFFF00', float: 'right', padding: 0 }} color="primary" aria-label="add" size="medium" onClick={handleClose}>
            <CloseIcon />
        </IconButton>
    </DialogTitle>
);

dialog.submitButton = ({ isSubmitting, disabled, text, onClick, variant }) => (
    <Button variant={variant ?? "contained"} type={onClick ? undefined : "submit"} onClick={onClick} color="primary" disabled={isSubmitting || disabled}>
        {isSubmitting ? <CircularProgress size={24} /> : (text ?? "Submit")}
    </Button>
);

dialog.footerButton = ({ onClick, icon, text, variant, color, isLoading }) => (
    <Button variant={variant ?? "text"} color={color ?? "secondary"} onClick={onClick} disabled={isLoading}>
        {isLoading ? <CircularProgress size={24} /> : <React.Fragment>{icon} {text}</React.Fragment>}
    </Button>
);

dialog.gridButton = ({ onClick, icon, text, xs, sm, md, lg, xl, variant, color }) => (
    <Grid item xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
        <Button variant={variant ?? "text"} color={color ?? "secondary"} onClick={onClick} sx={{ height: '94.68%', margin: 0, padding: 0 }}>
            {icon} {text}
        </Button>
    </Grid>
);

dialog.subtitle = ({ name, button, xs, sm, md, lg, xl }) => (
    <Grid item xs={xs ?? 12} sm={sm} md={md} lg={lg} xl={xl} key={name} >
        <div style={{
            display: 'flex',
            alignItems: 'center'
        }}>
            <Typography style={{ fontWeight: '500', fontSize: 18 }}>
                {name}
            </Typography>
            {button &&
                <Button size="small" variant="text" color="secondary" onClick={button.onClick}>
                    {button.icon}
                </Button>
            }
        </div>
    </Grid >
);

dialog.textField = (props) => <Field {...props} as={d_tf} />
const d_tf = ({ label, xs, sm, md, lg, xl, form, required, row, unit, unit_position, tooltip, readOnly, ...props }) => {
    const { errors, touched } = form;
    const err = _.get(touched, props.name) && _.get(errors, props.name);
    if (!label && required) unit += " *";
    return (
        <Grid item xs={xs} sm={sm} md={md} lg={lg} xl={xl} key={label}>
            <Tooltip title={tooltip ? (typeof tooltip === 'string' ? tooltip : props.value) : ''}>
                <TextField
                    {...props}
                    label={label}
                    error={err !== undefined}
                    helperText={err}
                    required={required}
                    value={props.value ?? ''}
                    InputProps={{
                        endAdornment: (unit) && <InputAdornment position={unit_position ?? "end"} >
                            <Typography sx={{ color: err !== undefined ? 'error.main' : 'text.primary' }}>{unit}</Typography>
                        </InputAdornment>,
                        readOnly: readOnly
                    }}
                    InputLabelProps={{ shrink: !!unit || undefined }}
                    fullWidth
                    margin="normal"
                    variant={readOnly ? "filled" : "outlined"}
                    style={{ margin: 0 }}
                    multiline={!!row}
                    rows={row}
                />
            </Tooltip>
        </Grid>
    )
};

dialog.numberField = (props) => <Field {...props} as={d_nf} />
const d_nf = ({ label, xs, sm, md, lg, xl, form, required, allowNegative, unit, unit_position, readOnly, ...props }) => {
    const { errors, touched, handleBlur, setFieldValue } = form;
    const err = _.get(touched, props.name) && _.get(errors, props.name);
    if (!label && required) unit += " *";
    return (
        <Grid item xs={xs} sm={sm} md={md} lg={lg} xl={xl} key={label}>
            <TextField
                {...props}
                label={label}
                error={err !== undefined}
                helperText={err}
                required={required}
                value={props.value ?? ''}
                onBlur={e => !isNaN(e.target.value) ? handleBlur(e) : setFieldValue(props.name, '')}
                onChange={e => (!isNaN(e.target.value) || !e.target.value || (allowNegative && e.target.value === "-")) &&
                    setFieldValue(props.name, e.target.value.replace(allowNegative ? / /g : / |-/g, ''))
                }
                InputProps={{
                    endAdornment: (unit) && <InputAdornment position={unit_position ?? "end"} >
                        <Typography sx={{ color: err !== undefined ? 'error.main' : 'text.primary' }}>{unit}</Typography>
                    </InputAdornment>,
                    readOnly: readOnly
                }}
                InputLabelProps={{ shrink: !!unit || undefined }}
                fullWidth
                margin="normal"
                variant={readOnly ? "filled" : "outlined"}
                style={{ margin: 0 }}
            />
        </Grid>
    )
};

dialog.timePicker = (props) => <Field {...props} as={d_tp} />
const d_tp = ({ label, xs, sm, md, lg, xl, form, required, maxTime, minTime, hideClock, ...props }) => {
    const { errors, touched, setFieldValue } = form;
    const err = _.get(touched, props.name) && _.get(errors, props.name);
    return (
        <Grid item xs={xs} sm={sm} md={md} lg={lg} xl={xl} key={label}>
            <TimePicker
                {...props}
                label={label}

                onChange={(newValue) => setFieldValue(props.name, newValue)}
                fullWidth
                margin="normal"
                variant="outlined"
                style={{ margin: 0 }}
                inputFormat="HH:mm"
                mask="__:__"
                ampm={false}
                minTime={minTime}
                maxTime={maxTime}
                value={props.value || null}

                renderInput={(params) =>
                    <TextField
                        {...params}
                        error={err !== undefined || params.error}
                        helperText={err}
                        required={required}
                        InputProps={hideClock ? undefined : params.InputProps}
                    />
                }
            />
        </Grid>
    )
};

dialog.datePicker = (props) => <Field {...props} as={d_dp} />
const d_dp = ({ label, xs, sm, md, lg, xl, form, required, maxTime, minTime, hideClock, ...props }) => {
    const { errors, touched, setFieldValue } = form;
    const err = _.get(touched, props.name) && _.get(errors, props.name);
    return (
        <Grid item xs={xs} sm={sm} md={md} lg={lg} xl={xl} key={label}>
            <DesktopDatePicker
                {...props}
                label={label}
                inputFormat="dd/MM/yyyy"
                value={props.value || null}
                onChange={(newValue) => setFieldValue(props.name, newValue)}

                renderInput={(params) =>
                    <TextField
                        {...params}
                        error={err !== undefined || params.error}
                        helperText={err}
                        required={required}
                        InputProps={hideClock ? undefined : params.InputProps}
                    />
                }
            />
        </Grid>
    )
};



dialog.autocomplete = (props) => <Field {...props} as={d_ac} />
const d_ac = ({ label, xs, sm, md, lg, xl, form, required, options, open, setOpen, loading, ...props }) => {
    const { errors, touched, setFieldTouched, setFieldValue } = form;
    const err = _.get(touched, props.name) && _.get(errors, props.name);
    return (
        <Grid item xs={xs} sm={sm} md={md} lg={lg} xl={xl} key={label}>
            <Autocomplete
                {...props}
                openOnFocus autoComplete
                fullWidth
                options={options}
                onChange={(e, value) => setFieldValue(props.name, value)}
                onBlur={(e) => {
                    const v = options.find(el => el.toLowerCase() === e.target.value.toLowerCase());
                    if (v) setFieldValue(props.name, v);
                    setFieldTouched(props.name);
                }}
                onOpen={setOpen ? () => {
                    setOpen(true);
                } : undefined}
                onClose={setOpen ? () => {
                    setOpen(false);
                } : undefined}
                loading={loading}
                renderInput={(params) => <TextField
                    {...params}
                    label={label}
                    margin="normal"
                    variant="outlined"
                    error={err !== undefined}
                    helperText={err}
                    required={required}
                    style={{ margin: 0 }}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />}
            />
        </Grid>
    )
};

dialog.dropDownList = (props) => <Field {...props} as={d_ddl} />
const d_ddl = ({ label, xs, sm, md, lg, xl, form, required, options, value, setFields, renderValue, callback, ...props }) => {
    const { errors, touched, handleChange, setFieldValue } = form;
    const err = _.get(touched, props.name) && _.get(errors, props.name);
    let foundMatch = false;
    return (
        <Grid item xs={xs} sm={sm} md={md} lg={lg} xl={xl} key={label}>
            <FormControl
                {...props}
                style={{ width: '100%' }}
                required={required}
                error={err !== undefined}
            >
                <InputLabel id="autowidth-label">{label}</InputLabel>
                <Select
                    {...props}
                    labelId={label}
                    value={value ?? ""}
                    label={label || undefined}
                    id={label}
                    fullWidth
                    displayEmpty
                    disabled={props.disabled || false}
                    renderValue={renderValue}
                    onChange={(e) => {
                        if (setFields) {
                            setFields.forEach(el => {
                                if (!el['if'] || e.target.value === el['if']) setFieldValue(el['name'], el['value']);
                            });
                        }
                        handleChange(e);
                        if(typeof callback === 'function') callback(e.target.value);
                    }}
                >
                    {options && options.map((el, index) => {
                        if (el.value === value) foundMatch = true;
                        if (index === options.length - 1 && !foundMatch) {
                            if (props.defaultValue && options.find(element => element.value === props.defaultValue))
                                setFieldValue(props.name, props.defaultValue);
                            else
                                setFieldValue(props.name, options[0].value);
                        }
                        return <MenuItem key={el.value} value={el.value}>{el.name}</MenuItem>;
                    })}

                </Select>
                <FormHelperText>{err}</FormHelperText>
            </FormControl>
        </Grid>
    )
};

dialog.switch = (props) => <Field {...props} as={d_s} />
const d_s = ({ label, xs, sm, md, lg, xl, form, required, displayTrue, displayFalse, color1, color2, ...props }) => {
    return (
        <Grid item xs={xs} sm={sm} md={md} lg={lg} xl={xl} key={label}>
            <InputLabel>{label}</InputLabel>
            <FormControlLabel label={props.value ? displayTrue : displayFalse} sx={{ color: props.value ? (color1 ?? "green") : (color2 ?? "grey"), height: 34 }} control={
                <Switch
                    {...props}
                    value={!!props.value}
                    checked={props.value ?? undefined}
                />
            } />
        </Grid>
    )
};

dialog.toggleButton = (props) => <Field {...props} as={d_tb} />
const d_tb = ({ label, xs, sm, md, lg, xl, form, required, options, buttonStyle, ...props }) => {
    const { setFieldValue } = form;
    return (
        <Grid item xs={xs} sm={sm} md={md} lg={lg} xl={xl} key={label}>
            <ToggleButtonGroup
                {...props}
                color="info"
                exclusive
                onChange={e => setFieldValue(props.name, e.target.value)}
            >
                {options.map(el =>
                    <ToggleButton key={el.value} value={el.value} style={buttonStyle}>{el.name}</ToggleButton>
                )}
            </ToggleButtonGroup>
        </Grid>
    )
};

dashboard.card = ({ contentStyle, gridHeight, cardHeight, xs, sm, md, lg, xl, color, footerText, footerIcon, customRender, data, rowLeftPadding, rowBullet, rowContentSize }) => {
    rowContentSize = rowContentSize ?? 8;
    return (
        <Grid item xs={xs} sm={sm} md={md} lg={lg} xl={xl} height={gridHeight}>
            <Card>
                <CardContent style={contentStyle ?? { padding: '16px' }}>
                    {customRender ? customRender :
                        <Grid container justifyContent="space-between" alignItems="center">
                            {
                                data.map((el, i) => <React.Fragment>
                                    {el.title && <Grid item xs={12} paddingBottom={0.5} paddingTop={i === 0 ? 0 : 1}>
                                        <Typography variant='subtitle1'>{el.title}</Typography>
                                    </Grid>}
                                    {el.row &&
                                        el.row.map((el, i) => <React.Fragment>
                                            {rowBullet &&
                                                <Grid item xs={0.3}>
                                                    <Typography variant='h6' paddingLeft={rowLeftPadding}>{(i + 1) + '. '}</Typography>
                                                </Grid>
                                            }
                                            <Grid item xs={rowContentSize - (rowBullet ? 0.3 : 0)}>
                                                <Tooltip title={el[0]} followCursor>
                                                    <Typography noWrap variant='h6' paddingLeft={rowBullet ? 0 : rowLeftPadding}>{el[0]}</Typography>
                                                </Tooltip>
                                            </Grid>
                                            <Grid item xs={12 - rowContentSize} align="right">
                                                <Typography variant='h6'>{el[1]}</Typography>
                                            </Grid>
                                        </React.Fragment>)
                                    }
                                </React.Fragment>)
                            }
                        </Grid>
                    }
                </CardContent>
                {(footerText || footerIcon) &&
                    <Box sx={{ backgroundColor: color }}>
                        <Grid container justifyContent="space-between" style={{
                            textAlign: 'center',
                            padding: '8px',
                            paddingLeft: '20px',
                            paddingRight: '20px',
                            color: 'white'
                        }}>
                            <Grid item>
                                <Typography variant="body2"> {footerText} </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2"> {footerIcon ? React.createElement(footerIcon, {}) : ''} </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                }
            </Card>
        </Grid>
    )
}

export { general, dialog, dashboard };

