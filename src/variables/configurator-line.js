var _ = require('lodash');

const chartTypesList = [
    {
        label: 'Line',
        name: 'line',
        key: 'type',
        enable: true,
    },
    {
        label: 'Bar',
        name: 'bar',
        key: 'type',
        enable: true,
    },
    {
        label: 'Area',
        name: 'area',
        key: 'type',
        enable: false,
    },
    {
        label: 'Pie',
        name: 'pie',
        key: 'type',
        enable: true,
    },
    {
        label: 'Doughnut',
        name: 'doughnut',
        key: 'type',
        enable: true,
    },
    {
        label: 'Radar',
        name: 'radar',
        key: 'type',
        enable: true,
    },
];

const customOptions = [
    {
        label: 'Multiple datasets',
        key: 'multiple.datasets',
        enabled: false,
    },
    {
        label: 'Show legend',
        enabled: false,
        key: 'options.plugins.legend.display',
    },
    {
        label: 'Enable animation',
        enabled: false,
        key: 'options.animation',
    },
    {
        label: 'Enable dropdown actions',
        enabled: false,
        key: 'dropdown',
    },
    {
        label: 'Show X-axis labels',
        enabled: false,
        key: 'options.scales.x.ticks.display',
    },
    {
        label: 'Show Y-axis labels',
        enabled: false,
        key: 'options.scales.y.ticks.display',
    },
    {
        label: 'Show X-axis grid',
        enabled: false,
        key: 'options.scales.x.grid.display',
    },
    {
        label: 'Show Y-axis grid',
        enabled: false,
        key: 'options.scales.y.grid.display',
    },
];

const dataSourceList = [
    {
        label: 'Title',
        value: '',
        placeholder: 'Widget title',
        size: 6,
        className: 'pr-1',
        key: 'title',
        saveButton: false,
    },
    {
        label: 'Description',
        value: '',
        placeholder: 'Widget description',
        size: 6,
        className: 'pl-1',
        key: 'description',
        saveButton: false,
    },
    {
        label: 'Data source',
        value: '',
        placeholder: 'https://your-api-backend.domain.com',
        key: 'dataSourceUrl',
        saveButton: true,
        size: 8,
    },
    {
        label: 'Refresh time (in seconds)',
        value: '',
        placeholder: 'Time',
        key: 'refreshDuration',
        saveButton: false,
        size: 4,
    },
];

const colorsOptions = [
    {
        label: 'Border',
        key: 'data.datasets',
        endingKey: 'borderColor',
        value: '#ddd',
    },
    {
        label: 'Background',
        key: 'data.datasets',
        endingKey: 'backgroundColor',
        value: '#ddd',
    },
    {
        label: 'Point border',
        key: 'data.datasets',
        endingKey: 'pointBorderColor',
        value: 'blue',
    },
    {
        label: 'Point background',
        key: 'data.datasets',
        endingKey: 'pointBackgroundColor',
        value: 'blue',
    },
];

const dataSourceOptionsList = [
    {
        label: 'Require authorization',
        enabled: false,
        key: 'authorization.require',
    },
];

const dataSourceAuthorizationOptions = [
    {
        label: 'Authorization type',
        value: 'No auth',
        key: 'authorization.type',
        size: 4,
        options: ['Basic Auth', 'Bearer Token'],
    },
];

const authorizationBasicAuth = [
    {
        label: 'Username',
        value: '',
        placeholder: 'Username',
        key: 'authorization.config',
        endingKey: 'username',
        type: 'text',
        size: 6,
    },
    {
        label: 'Password',
        value: '',
        placeholder: 'Password',
        key: 'authorization.config',
        endingKey: 'password',
        type: 'password',
        size: 6,
    },
];

const authorizationBearerAuth = [
    {
        label: 'Token',
        value: '',
        placeholder: 'Token',
        key: 'authorization.config',
        endingKey: 'token',
        size: 12,
    },
];

const sliderOptions = [
    {
        label: 'Border width',
        value: 5,
        key: 'data.datasets',
        endingKey: 'borderWidth',
        min: 0,
        max: 20,
        step: 1,
    },
    {
        label: 'Point border width',
        value: 2,
        key: 'data.datasets',
        endingKey: 'pointBorderWidth',
        min: 0,
        max: 20,
        step: 1,
    },
    {
        label: 'Point hover radius',
        value: 4,
        key: 'data.datasets',
        endingKey: 'pointHoverRadius',
        min: 0,
        max: 20,
        step: 1,
    },
    {
        label: 'Point hover border width',
        value: 1,
        key: 'data.datasets',
        endingKey: 'pointHoverBorderWidth',
        min: 0,
        max: 20,
        step: 1,
    },
    {
        label: 'Point radius',
        value: 4,
        key: 'data.datasets',
        endingKey: 'pointRadius',
        min: 0,
        max: 20,
        step: 1,
    },
    {
        label: 'Tension',
        value: 0.4,
        key: 'data.datasets',
        endingKey: 'tension',
        min: 0,
        max: 1,
        step: 0.1,
    },
];

const sliderGeneralSettings = [
    {
        label: 'Dashboard size (%)',
        value: 33,
        key: 'dashboardSizeWidth',
        min: 30,
        max: 100,
        step: 1,
        concatenateWith: '%',
    },
];

const requirements = [
    {
        key: 'dataSourceUrl',
        error: 'No URL specified',
        required: true,
    },
    {
        key: 'refreshDuration',
        error: 'No refresh duration specified',
        required: true,
    },
];

const userProfileFields = [
    [
        {
            label: 'Fullname',
            key: 'fullname',
            size: 6,
        },
        {
            label: 'Email',
            key: 'email',
            size: 6,
        },
    ],
    [
        {
            label: 'Address',
            key: 'address',
            size: 12,
        },
    ],
    [
        {
            label: 'City',
            key: 'city',
            size: 4,
        },
        {
            label: 'Country',
            key: 'country',
            size: 4,
        },
        {
            label: 'Postal code',
            key: 'postal_code',
            size: 4,
        },
    ],
];

var gradientChartOptionsConfigurationWithNumbersAndGrid = {
    animation: {
        duration: 0,
    },
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
        tooltips: {
            bodySpacing: 4,
            mode: 'nearest',
            intersect: 0,
            position: 'nearest',
            xPadding: 10,
            yPadding: 10,
            caretPadding: 10,
        },
    },
    responsive: 1,
    scales: {
        y: {
            display: true,
            grid: {
                zeroLineColor: 'transparent',
                drawTicks: false,
                display: false,
                drawBorder: false,
            },
            ticks: {
                display: false,
                maxTicksLimit: 7,
            },
        },
        x: {
            display: true,
            ticks: {
                display: false,
                maxTicksLimit: 7,
            },
            grid: {
                zeroLineColor: 'transparent',
                drawTicks: false,
                display: false,
                drawBorder: false,
            },
        },
    },
    layout: {
        padding: { left: 0, right: 0, top: 15, bottom: 15 },
    },
};

const defaultChart = {
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Active Users',
                borderColor: '#f96332',
                pointBorderColor: '#FFF',
                pointBackgroundColor: '#f96332',
                pointBorderWidth: 2,
                pointHoverRadius: 8,
                pointHoverBorderWidth: 1,
                pointRadius: 4,
                fill: true,
                backgroundColor: 'transparent',
                borderWidth: 5,
                tension: 0.4,
                data: [542, 480, 430, 550, 530, 453, 380, 434, 568, 690, 800, 330],
            },
        ],
    },
    options: gradientChartOptionsConfigurationWithNumbersAndGrid,
};

const dropdownSettings = [
    {
        label: 'Edit',
        key: 'edit',
        enabled: true,
        action: undefined,
    },
    {
        label: 'Delete',
        key: 'delete',
        enabled: true,
        action: undefined,
    },
    {
        label: 'Resize',
        key: 'resize',
        enabled: false,
        action: undefined,
    },
];

const customOptionsClone = _.cloneDeep(customOptions);
const dataSourceListClone = _.cloneDeep(dataSourceList);
const dataSourceOptionsListClone = _.cloneDeep(dataSourceOptionsList);
const sliderOptionsClone = _.cloneDeep(sliderOptions);
const sliderGeneralSettingsClone = _.cloneDeep(sliderGeneralSettings);
const colorsOptionsClone = _.cloneDeep(colorsOptions);
const userProfileFieldsClone = _.cloneDeep(userProfileFields);
const dataSourceAuthorizationOptionsClone = _.cloneDeep(dataSourceAuthorizationOptions);
const authorizationBasicAuthClone = _.cloneDeep(authorizationBasicAuth);
const authorizationBearerAuthClone = _.cloneDeep(authorizationBearerAuth);

let defaultLineChartObject = _.cloneDeep(defaultChart);
let defaultChartOptions = defaultLineChartObject.options;

let widget = {
    id: undefined,
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

module.exports = {
    customOptionsClone,
    dataSourceListClone,
    dataSourceOptionsListClone,
    sliderOptionsClone,
    sliderGeneralSettingsClone,
    colorsOptionsClone,
    defaultChart,
    chartTypesList,
    widget,
    requirements,
    dropdownSettings,
    userProfileFieldsClone,
    dataSourceAuthorizationOptionsClone,
    authorizationBasicAuthClone,
    authorizationBearerAuthClone,
};
