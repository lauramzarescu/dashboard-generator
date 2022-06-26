var _ = require('lodash');

const doughnutCustomOptions = [
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

const doughnutColorOptions = [
    {
        label: 'Border',
        key: 'data.datasets[0].borderColor',
        endingKey: '',
        value: '#ddd',
    },
    {
        label: 'Background',
        key: 'data.datasets[0].backgroundColor',
        endingKey: '',
        value: '#ddd',
    },
    {
        label: 'Hover background',
        key: 'data.datasets[0].hoverBackgroundColor',
        endingKey: '',
        value: 'blue',
    },
    {
        label: 'Hover border',
        key: 'data.datasets[0].hoverBorderColor',
        endingKey: '',
        value: 'blue',
    },
];

const doughnutSliderOptions = [
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
        label: 'Border radius',
        value: 0,
        key: 'data.datasets',
        endingKey: 'borderRadius',
        min: 0,
        max: 100,
        step: 1,
    },
    {
        label: 'Circumference',
        value: 360,
        key: 'data.datasets',
        endingKey: 'circumference',
        min: 0,
        max: 360,
        step: 1,
    },
    {
        label: 'Rotation',
        value: 0,
        key: 'data.datasets',
        endingKey: 'rotation',
        min: 0,
        max: 360,
        step: 1,
    },
    // {
    //     label: 'Spacing',
    //     value: 0,
    //     key: 'data.datasets',
    //     endingKey: 'spacing',
    //     min: 0,
    //     max: 20,
    //     step: 1,
    // },
    // {
    //     label: 'Weight',
    //     value: 1,
    //     key: 'data.datasets',
    //     endingKey: 'weight',
    //     min: 0,
    //     max: 20,
    //     step: 1,
    // },
    {
        label: 'Cutout',
        value: 50,
        key: 'options.cutout',
        min: 0,
        max: 100,
        step: 1,
    },
];

var doughnutOptionsConfiguration = {
    cutout: 50,
    animation: {
        duration: 0,
    },
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
    maintainAspectRatio: false,
    responsive: true,
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

const doughnutDefaultChart = {
    data: {
        labels: ['Jan', 'Feb', 'Mar'],
        datasets: [
            {
                label: 'Dataset',
                borderColor: '#f96332',
                backgroundColor: 'transparent',
                borderWidth: 5,
                borderRadius: 0,
                circumference: 360,
                hoverBackgroundColor: undefined,
                hoverBorderColor: undefined,
                rotation: undefined,
                spacing: 0,
                weight: 1,
                data: [542, 480, 430],
            },
        ],
    },
    options: doughnutOptionsConfiguration,
};

const doughnutCustomOptionsClone = _.cloneDeep(doughnutCustomOptions);
const doughnutSliderOptionsClone = _.cloneDeep(doughnutSliderOptions);
const doughnutColorsOptionsClone = _.cloneDeep(doughnutColorOptions);

let doughnutDefaultLineChartObject = _.cloneDeep(doughnutDefaultChart);
let doughnutDefaultChartOptions = doughnutDefaultLineChartObject.options;

let doughnutWidget = {
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
    data: doughnutDefaultLineChartObject.data,
    options: doughnutDefaultChartOptions,
    dropdown: true,
    type: 'doughnut',
};

module.exports = {
    doughnutCustomOptionsClone,
    doughnutSliderOptionsClone,
    doughnutColorsOptionsClone,
    doughnutDefaultLineChartObject,
    doughnutDefaultChartOptions,
    doughnutWidget,
};
