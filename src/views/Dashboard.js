// core components
import PanelHeader from 'components/PanelHeader/PanelHeader.js';
// reactstrap components
import { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import { ResizableBox } from 'react-resizable';
import { useHistory } from 'react-router-dom';
import { Button, Card, Col, Row } from 'reactstrap';
import ChartCard from '../components/ChartCard/ChartCard';
import { getAllWidgets, updateWidget } from '../server/api';

// lottie settings
const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: require('../lottie-files/no-widgets-available.json'),
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
    },
};

function Dashboard() {
    const [widgets, setWidgets] = useState([]);
    const [widgetSize, setWidgetSize] = useState([]);
    const history = useHistory();

    const fetchData = async () => {
        getAllWidgets().then((response) => {
            if (response && response.data) {
                setWidgets(response.data);

                let sizeArray = [];

                response.data.forEach((element) => {
                    let pxWidth = (getContainerWidth() * Number(element.config.dashboardSizeWidth.replace('%', ''))) / 100 - 25;
                    sizeArray.push({ width: pxWidth, height: 350 });
                });
                setWidgetSize(sizeArray);
            }
        });
    };

    const widgetDeleted = (id) => {
        const deletedWidgetIndex = widgets.findIndex((widget) => widget._id === id);
        let widgetsClone = _.cloneDeep(widgets);
        widgetsClone.splice(deletedWidgetIndex, 1);
        setWidgets(widgetsClone);
        window.location.reload(false);
    };

    const getContainerWidth = () => {
        return document.getElementsByClassName('content')[0].offsetWidth;
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleClick = () => {
        history.push('/admin/configurator');
    };

    const handleWidgetUpdate = (widgetIndex, width) => {
        let percentWidth = (width * 100) / getContainerWidth();
        let widgetsClone = _.cloneDeep(widgets);
        let widgetObj = widgetsClone[widgetIndex];

        widgetObj.config.dashboardSizeWidth = percentWidth + '%';

        setWidgets(widgetsClone);
        updateWidget(widgets[widgetIndex]._id, widgetObj.config);
    };

    return (
        <>
            <PanelHeader size='sm' />
            <div className='content'>
                <Row className={!widgets.length ? 'justify-center' : ''}>
                    {!widgets.length && (
                        <Col md='6'>
                            <Card className='h-100 d-flex align-center'>
                                <Lottie options={defaultOptions} height={200} width={200} />
                                <Button color='secondary' size='lg' active onClick={handleClick}>
                                    Create your first widget here
                                </Button>
                            </Card>
                        </Col>
                    )}

                    {widgets.map((widget, index) => {
                        return (
                            <ResizableBox
                                key={'resizable-box-' + index}
                                height={350}
                                width={widgetSize[index] ? widgetSize[index].width : 500}
                                axis={'both'}
                                minConstraints={[300, 350]}
                                className='m-10'
                                onResizeStop={(event, { element, size, handle }) => {
                                    let widgetObj = _.cloneDeep(widgetSize);
                                    let widgetCurrentSize = widgetObj[index];

                                    if (widgetCurrentSize) {
                                        widgetCurrentSize.width = size.width;
                                        widgetCurrentSize.height = size.height;
                                        setWidgetSize(widgetObj);
                                        handleWidgetUpdate(index, size.width);
                                    }
                                }}
                            >
                                <ChartCard
                                    shouldRefreshChart={true}
                                    config={widget.config}
                                    id={widget._id}
                                    lastUpdateDate={widget.update_at}
                                    onWidgetDelete={widgetDeleted}
                                />
                            </ResizableBox>
                        );
                    })}
                </Row>
            </div>
        </>
    );
}

export default Dashboard;
