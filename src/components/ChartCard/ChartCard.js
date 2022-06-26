import ReportGmailerrorredRoundedIcon from '@mui/icons-material/ReportGmailerrorredRounded';
import { useState } from 'react';
import { Bar, Doughnut, Line, Pie, Radar } from 'react-chartjs-2';
import { useHistory } from 'react-router-dom';
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CardTitle,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    UncontrolledDropdown,
} from 'reactstrap';
import useInterval from 'use-interval';
import { dropdownSettings } from 'variables/configurator-line';
import { deleteWidget, updateWidgetByChartId } from '../../server/api';

var _ = require('lodash');

function ChartCard(props) {
    let databaseId = props.id;
    let config = props.config;
    let data = _.cloneDeep(config.data);
    let options = _.cloneDeep(config.options);
    let shouldRefreshChart = props.shouldRefreshChart;
    let lastUpdateDate = props.lastUpdateDate;

    let [widget, setWidget] = useState(_.cloneDeep(config));
    let [requestFailed, setRequestFailed] = useState(false);

    let history = useHistory();

    useInterval(() => {
        if (shouldRefreshChart && config.dataSourceUrl) {
            let auth = '';

            if (widget.authorization.type === 'Basic Auth') {
                const username = widget.authorization.config.username;
                const password = widget.authorization.config.password;

                auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
            }

            fetch(config.dataSourceUrl, {
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

                    setRequestFailed(true);
                    throw new Error('Invalid configuration type');
                })
                .then(
                    (result) => {
                        let newWidgetObj = _.cloneDeep(widget);
                        if (result.data.length > 1) {
                            let obj = _.cloneDeep(widget.data.datasets[0]);
                            let widgetCopy = _.cloneDeep(widget);

                            widgetCopy.data.datasets = [];

                            for (let i = 0; i < result.data.length; i++) {
                                let objCopy = _.cloneDeep(obj);

                                objCopy.label = result.data[i].label;
                                objCopy.data = result.data[i].value;

                                widgetCopy.data.datasets.push(objCopy);
                            }

                            console.log(widget.data.datasets[0].data, widgetCopy.data.datasets[0].data);
                            setWidget(widgetCopy);
                        } else {
                            _.set(newWidgetObj, 'data.datasets[0].data', result.data[0].value);
                            _.set(newWidgetObj, 'data.datasets[0].label', result.data[0].label);
                            setWidget(newWidgetObj);
                        }
                        _.set(newWidgetObj, 'data.labels', result.labels);

                        updateWidgetByChartId(widget.id, widget).then((response) => {
                            if (response.data.modifiedCount === 1) {
                                console.log('updated successfully');
                            }
                        });

                        setRequestFailed(false);
                    },
                    (error) => {
                        console.log(error);
                        setRequestFailed(true);
                    }
                );
        }
    }, config.refreshDuration * 1000);

    const chartType = () => {
        let type = widget.type;

        if (shouldRefreshChart) {
            data = _.cloneDeep(widget.data);
            options = _.cloneDeep(widget.options);
        } else {
            type = config.type;
        }

        switch (type) {
            case 'line':
                return <Line data={data} options={options} />;
            case 'bar':
                return <Bar data={data} options={options} />;
            case 'pie':
                return <Pie data={data} options={options} />;
            case 'doughnut':
                return <Doughnut data={data} options={options} />;
            case 'radar':
                return <Radar data={data} options={options} />;
        }
    };

    const handleOptionClick = (option) => {
        switch (option) {
            case 'edit':
                history.push({
                    pathname: '/admin/configurator',
                    search: '?edit=1&id=' + config.id,
                });
                break;
            case 'delete':
                deleteWidget(databaseId);
                props.onWidgetDelete(databaseId);
                break;
        }
    };

    return (
        <Card className='card-chart'>
            <CardHeader>
                <CardTitle>{shouldRefreshChart ? widget.title : config.title}</CardTitle>
                <h5 className='card-category'>{shouldRefreshChart ? widget.description : config.description}</h5>
                {/* <h5 className='card-category'>{'Last updated: ' + lastUpdateDate}</h5> */}
                {widget.dropdown && (
                    <UncontrolledDropdown>
                        <DropdownToggle className='btn-round btn-outline-default btn-icon' color='default'>
                            <i className='now-ui-icons loader_gear' />
                        </DropdownToggle>
                        <DropdownMenu right>
                            {dropdownSettings.map((option) => {
                                return (
                                    <DropdownItem
                                        disabled={!option.enabled}
                                        className={option.key === 'delete' ? 'text-danger' : ''}
                                        onClick={() => handleOptionClick(option.key)}
                                    >
                                        {option.label}
                                    </DropdownItem>
                                );
                            })}
                        </DropdownMenu>
                    </UncontrolledDropdown>
                )}
            </CardHeader>
            <CardBody>
                <div className='chart-area'>{chartType()}</div>
            </CardBody>
            <CardFooter>
                <div className='stats'>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div className='w-60'>
                            <i className='now-ui-icons arrows-1_refresh-69' />{' '}
                            {widget.refreshDuration ? widget.refreshDuration + ' s' : '- -'}
                        </div>
                        {requestFailed && (
                            <div style={{ display: 'flex', justifyContent: 'end', height: '10px' }}>
                                <ReportGmailerrorredRoundedIcon style={{ float: 'right', color: 'red', marginRight: '5px' }} />
                                <p style={{ color: 'red' }}>Data source URL failed</p>
                            </div>
                        )}
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}

export default ChartCard;
