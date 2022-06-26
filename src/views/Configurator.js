// core components
import ChartCard from 'components/ChartCard/ChartCard';
import PanelHeader from 'components/PanelHeader/PanelHeader.js';
import { useState } from 'react';
// reactstrap components
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { Popover, Slider } from '@mui/material';

import Notification from 'components/Notifications/Notification';
import { useEffect, useRef } from 'react';
import { SwatchesPicker } from 'react-color';
import ReactJson from 'react-json-view';
import Lottie from 'react-lottie';
import FileUpload from 'react-material-file-upload';
import { useLocation } from 'react-router-dom';
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    CustomInput,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    FormGroup,
    Input,
    Row,
    UncontrolledDropdown,
} from 'reactstrap';
import { uuid } from 'uuidv4';
import {
    doughnutColorsOptionsClone,
    doughnutCustomOptionsClone,
    doughnutSliderOptionsClone,
    doughnutWidget,
} from 'variables/configurator-doughnut';
import {
    authorizationBasicAuthClone,
    authorizationBearerAuthClone,
    chartTypesList,
    colorsOptionsClone,
    customOptionsClone,
    dataSourceAuthorizationOptionsClone,
    dataSourceListClone,
    dataSourceOptionsListClone,
    defaultChart,
    requirements,
    sliderGeneralSettingsClone,
    sliderOptionsClone,
    widget,
} from 'variables/configurator-line';
import { pieColorsOptionsClone, pieCustomOptionsClone, pieSliderOptionsClone, pieWidget } from 'variables/configurator-pie';
import { createWidgetApi, getWidgetByChartId, updateWidgetByChartId } from '../server/api';

var _ = require('lodash');

// lottie settings
const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: require('../lottie-files/create-widget-loading.json'),
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
    },
};

function Configurator(props) {
    const searchParams = useLocation().search;
    const editMode = new URLSearchParams(searchParams).get('edit');
    const editWidgetId = new URLSearchParams(searchParams).get('id');

    const [configurationFile, setConfigurationFile] = useState([]);

    let widgetInstance = useRef(widget);
    let customOptions = useRef(customOptionsClone);
    let dataSourceList = useRef(dataSourceListClone);
    let dataSourceOptionsList = useRef(dataSourceOptionsListClone);
    let sliderOptions = useRef(sliderOptionsClone);
    let sliderGeneralSettings = useRef(sliderGeneralSettingsClone);
    let colorsOptions = useRef(colorsOptionsClone);
    let dataSourceAuthorizationOption = useRef(dataSourceAuthorizationOptionsClone);
    let authorizationBasicAuth = useRef(authorizationBasicAuthClone);
    let authorizationBearerAuth = useRef(authorizationBearerAuthClone);
    let dataSourceLoaded = useRef(false);

    let [widgetHasBeenModified, setWidgetHasBeenModified] = useState(false);
    let [chartType, setChartType] = useState(widgetInstance.current.type);
    let [authorizationType, setAuthorizationType] = useState(widgetInstance.current.authorization.type);
    let [createWidgetLoading, setCreateWidgetLoading] = useState(false);
    let [widgetObj, setWidgetObj] = useState(widgetInstance.current);
    let [dataSourceUrl, setDataSourceUrl] = useState('');
    let [dataSourceLength, setDataSourceLength] = useState(1);
    let [validUrl, setValidUrl] = useState(false);
    let [toast, setToast] = useState({
        message: '',
        severity: '',
        duration: 5000,
        loaded: false,
    });
    let [openToast, setOpenToast] = useState(false);
    const [popover, setPopover] = useState(Array.from({ length: 10 }, (e) => Array(colorsOptions.current.length).fill(null)));

    const handleClick = (event, dataSourceIndex, columnIndex) => {
        let newPopover = _.cloneDeep(popover);
        newPopover[dataSourceIndex][columnIndex] = event.target;
        setPopover([...newPopover]);
    };

    const handleClose = (dataSourceIndex, columnIndex) => {
        let newPopover = _.cloneDeep(popover);
        newPopover[dataSourceIndex][columnIndex] = null;
        setPopover([...newPopover]);
    };

    const handleOpen = (dataSourceIndex, columnIndex) => {
        return Boolean(popover[dataSourceIndex][columnIndex]);
    };

    let id = open ? 'simple-popover' : undefined;

    useEffect(() => {
        if (editMode && editWidgetId) {
            getWidgetByChartId(editWidgetId).then((response) => {
                if (response && response.data) {
                    let file = response.data;
                    setConfigurationFile([file]);
                    setWidgetObj({ ...file.config });
                }
            });
        }
        /**
         * reset widget and states after first rendering
         * passing an empty array to the second argument of the useEffect's function
         * will run this function only once, after first render
         */
        resetWidget();
    }, []);

    useEffect(() => {
        switch (chartType) {
            case 'Doughnut':
                customOptions.current = doughnutCustomOptionsClone;
                colorsOptions.current = doughnutColorsOptionsClone;
                sliderOptions.current = doughnutSliderOptionsClone;
                widgetInstance.current = doughnutWidget;
                widgetInstance.current.id = uuid();

                setWidgetObj(widgetInstance.current);
                setDataSourceLength(widgetInstance.current.data.datasets[0].data.length);
                notification('You need to load the data source again after changing the chart type!', 'warning', 10000);

                break;
            case 'Pie':
                customOptions.current = pieCustomOptionsClone;
                colorsOptions.current = pieColorsOptionsClone;
                sliderOptions.current = pieSliderOptionsClone;
                widgetInstance.current = pieWidget;
                widgetInstance.current.id = uuid();

                setWidgetObj(widgetInstance.current);
                setDataSourceLength(widgetInstance.current.data.datasets[0].data.length);
                notification('You need to load the data source again after changing the chart type!', 'warning', 10000);

                break;
            case 'Line':
                customOptions.current = customOptionsClone;
                colorsOptions.current = colorsOptionsClone;
                sliderOptions.current = sliderOptionsClone;
                widgetInstance.current = widget;
                setWidgetObj(widgetInstance.current);
                setDataSourceLength(widgetInstance.current.data.length);
                break;
        }
    }, [chartType]);

    const validateUrlPattern = (url) => {
        const regex = new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?');

        if (!regex.test(url)) {
            console.log('test');
            setValidUrl(false);
        } else {
            setValidUrl(true);
        }
    };

    const notification = (message, severity, duration) => {
        let newToast = _.cloneDeep(toast);
        newToast = {
            message: message,
            severity: severity,
            duration: duration,
            loaded: true,
        };
        setToast(newToast);
        setOpenToast(true);
    };

    const getDataSource = () => {
        let auth = '';

        if (authorizationType === 'Basic Auth') {
            const username = widgetObj.authorization.config.username;
            const password = widgetObj.authorization.config.password;

            auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
        }

        fetch(dataSourceUrl, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: auth,
            },
        })
            .then((res) => {
                const contentType = res.headers.get('content-type');
                if (contentType && contentType.indexOf('application/json') !== -1) {
                    return res.json();
                }

                setValidUrl(false);
                notification('Invalid configuration type', 'error', 5000);
                throw new Error('Invalid configuration type');
            })
            .then(
                (result) => {
                    if (chartType === 'Pie' || chartType === 'Doughnut') {
                        setDataSourceLength(result.data[0].value.length);
                    } else {
                        setDataSourceLength(result.data.length);
                    }

                    if (result.data.length > 1) {
                        customOptions.current[0].enabled = true;

                        let obj = _.cloneDeep(widgetInstance.current.data.datasets[0]);
                        widgetInstance.current.data.datasets.pop();

                        for (let i = 0; i < result.data.length; i++) {
                            let objCopy = _.cloneDeep(obj);

                            objCopy.label = result.data[i].label;
                            objCopy.data = result.data[i].value;

                            widgetInstance.current.data.datasets.push(objCopy);
                        }

                        setWidgetObj(widgetInstance.current);
                    } else {
                        handleFieldChange(result.data[0].value, { key: 'data.datasets[0].data' });
                        handleFieldChange(result.data[0].label, { key: 'data.datasets[0].label' });
                    }

                    handleFieldChange(result.labels, { key: 'data.labels' });
                    dataSourceLoaded.current = true;

                    setValidUrl(true);
                },
                (error) => {
                    console.log(error);
                }
            );
    };

    const setAuthorizationField = (value, source) => {
        let newWidgetObj = { ...widgetObj };
        let configObj = _.get(newWidgetObj, source.key);

        configObj[source.endingKey] = value;
        _.set(newWidgetObj, source.key, configObj);
    };

    const handleFieldChange = (value, source, index = -1) => {
        let newWidgetObj = { ...widgetObj };

        let endingKey = source.endingKey ? '.' + source.endingKey : source.endingKey;
        let keyPath = 'endingKey' in source && index !== -1 ? source.key + '[' + index + ']' + endingKey : source.key;

        if (source.concatenateWith) {
            value += source.concatenateWith;
        }

        if (source.endingKey && widgetObj.authorization.require && source.endingKey === 'username') {
            value += '';
        }

        _.set(newWidgetObj, keyPath, value);
        setWidgetObj(newWidgetObj);

        if (source.key === 'dataSourceUrl') {
            validateUrlPattern(value);
            setDataSourceUrl(value);
            return;
        }

        console.log(newWidgetObj);
        source.enabled = value;
    };

    const validateAuthorizationFields = () => {
        switch (authorizationType) {
            case 'Basic Auth':
                if (!widgetObj.authorization.config.username || !widgetObj.authorization.config.password) {
                    return false;
                }
                break;
            case 'Bearer Token':
                if (!widgetObj.authorization.config.token) {
                    return false;
                }
                break;
        }

        return true;
    };

    const createWidget = (draft = false) => {
        if (widgetObj.authorization.require && !validateAuthorizationFields()) {
            notification('Invalid authorization input data!', 'error', 5000);
            return;
        }

        if (!dataSourceLoaded.current) {
            getDataSource();
            dataSourceLoaded.current = true;
        }

        try {
            requirements.forEach((requirement) => {
                const value = _.get(widgetObj, requirement.key);

                if (!value) {
                    notification(requirement.error, 'error', 5000);
                    throw new Error(requirement.error);
                }

                if (!validUrl) {
                    notification('Invalid URL', 'error', 5000);
                    throw new Error('Invalid URL');
                }
            });

            let widgetForDraft;

            if (draft) {
                widgetForDraft = _.cloneDeep(widgetObj);
                widgetForDraft.status = 'draft';
            }

            resetWidget();
            setCreateWidgetLoading(true);

            setTimeout(() => {
                createWidgetApi(draft ? widgetForDraft : widgetObj).then((response) => {
                    if (response.data.insertedId) {
                        notification('Widget created successfully', 'success', 5000);
                        setCreateWidgetLoading(false);
                        dataSourceLoaded.current = false;
                    }
                });
            }, 1500);
        } catch (error) {}
    };

    const updateWidgetConfig = () => {
        if (!widgetHasBeenModified) {
            notification('Nothing to update', 'warning', 5000);
            return;
        }

        setCreateWidgetLoading(true);

        setTimeout(() => {
            updateWidgetByChartId(widgetObj.id, widgetObj).then((response) => {
                if (response.data.modifiedCount === 1) {
                    notification('Widget updated successfully', 'success', 5000);
                    setCreateWidgetLoading(false);
                }
            });
        }, 1500);
    };

    const resetWidget = () => {
        let defaultLineChartObject = _.cloneDeep(defaultChart);
        let defaultChartOptions = defaultLineChartObject.options;

        customOptions.current = _.cloneDeep(customOptionsClone);
        dataSourceList.current = _.cloneDeep(dataSourceListClone);
        dataSourceOptionsList.current = _.cloneDeep(dataSourceOptionsListClone);
        sliderOptions.current = _.cloneDeep(sliderOptionsClone);
        sliderGeneralSettings.current = _.cloneDeep(sliderGeneralSettingsClone);
        colorsOptions.current = _.cloneDeep(colorsOptionsClone);
        dataSourceAuthorizationOption.current = _.cloneDeep(dataSourceAuthorizationOptionsClone);
        authorizationBasicAuth.current = _.cloneDeep(authorizationBasicAuthClone);
        authorizationBearerAuth.current = _.cloneDeep(authorizationBearerAuthClone);

        widgetInstance.current = {
            id: uuid(),
            dashboardSizeWidth: '33%',
            dataSourceUrl: undefined,
            authorization: {
                require: false,
                type: undefined,
                config: {},
            },
            refreshDuration: undefined,
            status: 'active',
            title: 'Chart title',
            description: 'Chart description',
            data: defaultLineChartObject.data,
            options: defaultChartOptions,
            dropdown: true,
            type: 'line',
        };

        setChartType(widgetInstance.current.type);
        setDataSourceLength(1);
        setWidgetObj(widgetInstance.current);
        setConfigurationFile([]);
        setCreateWidgetLoading(false);
    };

    const uploadConfigurationFile = (file) => {
        if (file[0].type !== 'application/json') {
            notification('Invalid file type', 'error', 5000);
            return;
        }

        const fileReader = new FileReader();
        fileReader.readAsText(file[0], 'UTF-8');
        fileReader.onload = (e) => {
            const file = JSON.parse(e.target.result);
            setConfigurationFile([file]);
            setWidgetObj(file);
        };
    };

    const editUploadedConfigurationFile = (file) => {
        setWidgetObj(file.updated_src.config);
        setWidgetHasBeenModified(true);
    };

    const addToUploadedConfigurationFile = (file) => {
        setWidgetObj(file.updated_src.config);
        setWidgetHasBeenModified(true);
    };

    const deleteFromUploadedConfigurationFile = (file) => {
        setWidgetObj(file.updated_src.config);
        setWidgetHasBeenModified(true);
    };

    const handleToastClone = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenToast(false);
    };

    return (
        <>
            <PanelHeader size='sm' />
            {toast.loaded && (
                <Notification
                    open={openToast}
                    handleClose={handleToastClone}
                    severity={toast.severity}
                    duration={toast.duration}
                    message={toast.message}
                />
            )}
            <div className='content'>
                <Row>
                    {!configurationFile.length && (
                        <Col md='6'>
                            {createWidgetLoading && (
                                <Lottie
                                    options={defaultOptions}
                                    height={200}
                                    width={200}
                                    style={{ position: 'absolute', left: '50%', top: '35%', transform: 'translate(-50%, 0)', zIndex: 1 }}
                                />
                            )}
                            <Card
                                className={('json-card', createWidgetLoading ? 'blur-5' : '')}
                                style={{ overflow: 'scroll', height: '80vh' }}
                            >
                                <CardHeader>
                                    <h5 className='title'>Widget Configuration</h5>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col md='3'>
                                            <div className='upper-dropdowns'>
                                                <UncontrolledDropdown>
                                                    <DropdownToggle className='btn-round btn-outline-default' color='default'>
                                                        {'Chart type: ' + chartType}
                                                    </DropdownToggle>
                                                    <DropdownMenu>
                                                        {chartTypesList.map((type, index) => {
                                                            return (
                                                                <DropdownItem
                                                                    key={'charttype-' + index}
                                                                    disabled={!type.enable}
                                                                    onClick={() => {
                                                                        setChartType(type.label);
                                                                        handleFieldChange(type.name, type);
                                                                    }}
                                                                >
                                                                    {type.label}
                                                                </DropdownItem>
                                                            );
                                                        })}
                                                    </DropdownMenu>
                                                </UncontrolledDropdown>
                                            </div>
                                        </Col>
                                    </Row>
                                    <hr></hr>

                                    <Row>
                                        {dataSourceList.current.map((source, index) => {
                                            return (
                                                <Col className={source.className} md={source.size} key={'datasource-' + index}>
                                                    <FormGroup>
                                                        <label>{source.label}</label>
                                                        <div className={source.saveButton ? 'save-button-input-container' : undefined}>
                                                            <Input
                                                                value={source.value}
                                                                placeholder={source.placeholder}
                                                                type='text'
                                                                onChange={(event, value) => {
                                                                    source.value = value;
                                                                    handleFieldChange(event.target.value, source);
                                                                }}
                                                            />
                                                            {source.saveButton && (
                                                                <CheckCircleRoundedIcon
                                                                    style={{ marginLeft: '-30px' }}
                                                                    onClick={() => getDataSource()}
                                                                />
                                                            )}
                                                        </div>
                                                    </FormGroup>
                                                </Col>
                                            );
                                        })}
                                    </Row>

                                    <FormGroup>
                                        <div>
                                            {dataSourceOptionsList.current.map((checkbox, index) => {
                                                return (
                                                    <CustomInput
                                                        onChange={() => handleFieldChange(event.target.checked, checkbox)}
                                                        type='checkbox'
                                                        id={'datasource-options-' + index}
                                                        key={'datasource-options-' + index}
                                                        label={checkbox.label}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </FormGroup>

                                    <Row>
                                        {dataSourceAuthorizationOption.current.map((option, index) => {
                                            return (
                                                <Col md='3' key={'datasource-' + index}>
                                                    <div className='upper-dropdowns'>
                                                        <UncontrolledDropdown>
                                                            <DropdownToggle
                                                                disabled={!widgetObj.authorization.require}
                                                                className='btn-round btn-outline-default'
                                                                color='default'
                                                            >
                                                                {option.label}
                                                            </DropdownToggle>
                                                            <DropdownMenu>
                                                                {option.options.map((type, indexType) => {
                                                                    return (
                                                                        <DropdownItem
                                                                            key={'datasource-option' + indexType}
                                                                            onClick={() => {
                                                                                setAuthorizationType(type);
                                                                                handleFieldChange(type, option);
                                                                            }}
                                                                        >
                                                                            {type}
                                                                        </DropdownItem>
                                                                    );
                                                                })}
                                                            </DropdownMenu>
                                                        </UncontrolledDropdown>
                                                    </div>
                                                </Col>
                                            );
                                        })}
                                    </Row>

                                    <Row>
                                        {authorizationType === 'Basic Auth' &&
                                            widgetObj.authorization.require &&
                                            authorizationBasicAuth.current.map((field, index) => {
                                                return (
                                                    <Col md={field.size} key={'basic-auth-' + index}>
                                                        <FormGroup>
                                                            <label>{field.label}</label>
                                                            <div className={field.saveButton ? 'save-button-input-container' : undefined}>
                                                                <Input
                                                                    placeholder={field.placeholder}
                                                                    type={field.type}
                                                                    onChange={(event) => {
                                                                        field.value = event.target.value;
                                                                        setAuthorizationField(event.target.value, field);
                                                                    }}
                                                                />
                                                                {field.saveButton && (
                                                                    <CheckCircleRoundedIcon style={{ marginLeft: '-30px' }} />
                                                                )}
                                                            </div>
                                                        </FormGroup>
                                                    </Col>
                                                );
                                            })}
                                    </Row>

                                    <Row>
                                        {authorizationType === 'Bearer Token' &&
                                            widgetObj.authorization.require &&
                                            authorizationBearerAuth.current.map((field, index) => {
                                                return (
                                                    <Col md={field.size} key={'bearer-token-auth-' + index}>
                                                        <FormGroup>
                                                            <label>{field.label}</label>
                                                            <div className={field.saveButton ? 'save-button-input-container' : undefined}>
                                                                <Input
                                                                    placeholder={field.placeholder}
                                                                    type={field.type}
                                                                    onChange={(event) => {
                                                                        field.value = event.target.value;
                                                                        setAuthorizationField(event.target.value, field);
                                                                    }}
                                                                />
                                                                {field.saveButton && (
                                                                    <CheckCircleRoundedIcon style={{ marginLeft: '-30px' }} />
                                                                )}
                                                            </div>
                                                        </FormGroup>
                                                    </Col>
                                                );
                                            })}
                                    </Row>

                                    <hr></hr>

                                    {[...Array(dataSourceLength)].map((item, index) => {
                                        return (
                                            <div key={'item-' + index}>
                                                <p className='subtitle no-margin'>Colors for set {index + 1}</p>
                                                <Row className='align-center'>
                                                    <br />
                                                    {colorsOptions.current.map((option, optionIndex) => {
                                                        return (
                                                            <Col key={'color-' + optionIndex}>
                                                                <Button
                                                                    className='w-100'
                                                                    aria-describedby={id}
                                                                    variant='contained'
                                                                    style={{ backgroundColor: option[index] }}
                                                                    onClick={(event) => {
                                                                        handleClick(event, index, optionIndex);
                                                                    }}
                                                                >
                                                                    {option.label}
                                                                </Button>
                                                                <Popover
                                                                    id={id}
                                                                    open={handleOpen(index, optionIndex)}
                                                                    anchorEl={popover[index][optionIndex]}
                                                                    onClose={() => handleClose(index, optionIndex)}
                                                                    anchorOrigin={{
                                                                        vertical: 'bottom',
                                                                        horizontal: 'left',
                                                                    }}
                                                                    style={{ overflow: 'hidden' }}
                                                                >
                                                                    <SwatchesPicker
                                                                        color={option.value}
                                                                        onChangeComplete={(color) => {
                                                                            handleFieldChange(color.hex, option, index);
                                                                        }}
                                                                    />
                                                                </Popover>
                                                            </Col>
                                                        );
                                                    })}
                                                </Row>
                                            </div>
                                        );
                                    })}

                                    <hr></hr>
                                    <Row>
                                        <Col md='6'>
                                            <FormGroup>
                                                <div>
                                                    {customOptions.current.map((checkbox, index) => {
                                                        return (
                                                            <Col md='12' key={'checkbox-' + index}>
                                                                <CustomInput
                                                                    onChange={() => handleFieldChange(event.target.checked, checkbox)}
                                                                    type='checkbox'
                                                                    checked={checkbox.enabled}
                                                                    id={'checkbox-' + index}
                                                                    label={checkbox.label}
                                                                />
                                                            </Col>
                                                        );
                                                    })}
                                                </div>
                                            </FormGroup>
                                        </Col>
                                        <Col md='6'>
                                            <div>
                                                {sliderGeneralSettings.current.map((slider, index) => {
                                                    return (
                                                        <Col md='8' key={'slider-general-settings-' + index}>
                                                            {slider.label}
                                                            <Slider
                                                                size='small'
                                                                value={slider.value}
                                                                aria-label='Small'
                                                                valueLabelDisplay='auto'
                                                                min={slider.min}
                                                                max={slider.max}
                                                                step={slider.step}
                                                                onChange={(event, value) => {
                                                                    slider.value = value;
                                                                    handleFieldChange(value, slider);
                                                                }}
                                                            />
                                                        </Col>
                                                    );
                                                })}
                                            </div>
                                        </Col>
                                    </Row>

                                    <hr></hr>
                                    <Row>
                                        {sliderOptions.current.map((slider, index) => {
                                            return (
                                                <Col md='4' key={'slider-' + index}>
                                                    {slider.label}
                                                    <Slider
                                                        size='small'
                                                        value={slider.value}
                                                        aria-label='Small'
                                                        valueLabelDisplay='auto'
                                                        min={slider.min}
                                                        max={slider.max}
                                                        step={slider.step}
                                                        onChange={(event, value) => {
                                                            slider.value = value;
                                                            handleFieldChange(value, slider, 0);
                                                        }}
                                                    />
                                                </Col>
                                            );
                                        })}
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    )}

                    {configurationFile.length === 1 && (
                        <Col md='6'>
                            {createWidgetLoading && (
                                <Lottie
                                    options={defaultOptions}
                                    height={200}
                                    width={200}
                                    style={{ position: 'absolute', left: '50%', top: '35%', transform: 'translate(-50%, 0)', zIndex: 1 }}
                                />
                            )}
                            <Card className={'json-card ' + (createWidgetLoading ? 'blur-5' : '')}>
                                <CardHeader>
                                    <h5 className='title'>File Configuration</h5>
                                </CardHeader>
                                <CardBody>
                                    <ReactJson
                                        onEdit={editUploadedConfigurationFile}
                                        onAdd={addToUploadedConfigurationFile}
                                        onDelete={deleteFromUploadedConfigurationFile}
                                        src={configurationFile[0]}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    )}

                    <Col md='6'>
                        <ChartCard shouldRefreshChart={false} config={widgetObj} />
                        <FileUpload key={'config-file'} value={configurationFile} onChange={(file) => uploadConfigurationFile(file)} />
                    </Col>
                </Row>
                {!editMode && (
                    <>
                        <Button color='primary' size='lg' active onClick={() => createWidget()}>
                            Create widget
                        </Button>
                        {/* <Button color='primary' size='lg' active onClick={() => createWidget(true)}>
                            Save as draft
                        </Button> */}
                    </>
                )}
                {editMode && (
                    <Button color='primary' size='lg' active onClick={() => updateWidgetConfig()}>
                        Update widget
                    </Button>
                )}
                <Button color='secondary' size='lg' active onClick={() => resetWidget()}>
                    Reset
                </Button>
            </div>
        </>
    );
}

export default Configurator;
