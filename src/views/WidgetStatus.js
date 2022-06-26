import { useEffect, useState } from 'react';

import { Chip } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Lottie from 'react-lottie';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import PanelHeader from '../components/PanelHeader/PanelHeader';
import { getAllWidgets } from '../server/api';

const columns = [
    { id: 'title', label: 'Title', minWidth: 170, type: 'text' },
    { id: 'description', label: 'Description', minWidth: 100, type: 'text' },
    {
        id: 'refresh_time',
        label: 'Refresh time (seconds)',
        minWidth: 70,
        align: 'left',
        type: 'text',
    },
    {
        id: 'datasource_url',
        label: 'Data source URL',
        minWidth: 170,
        align: 'left',
        type: 'text',
    },
    {
        id: 'status',
        label: 'Status',
        minWidth: 50,
        align: 'left',
        type: 'chip',
    },
];

function createData(title, description, refresh_time, datasource_url, status) {
    return {
        title: title,
        description: description,
        refresh_time: refresh_time,
        datasource_url: datasource_url,
        status: status,
    };
}

function buildRows(widgets) {
    let rows = [];

    for (let i = 0; i < widgets.length; i++) {
        rows.push(
            createData(
                widgets[i].config.title,
                widgets[i].config.description,
                widgets[i].config.refreshDuration,
                widgets[i].config.dataSourceUrl,
                widgets[i].config.status
            )
        );
    }

    return rows;
}

// lottie settings
const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: require('../lottie-files/no-data.json'),
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
    },
};

function WidgetStatus() {
    const [widgets, setWidgets] = useState([]);
    const [rows, setRows] = useState([]);

    const fetchData = async () => {
        getAllWidgets().then((response) => {
            if (response && response.data) {
                setWidgets(response.data);
                setRows(buildRows(response.data));
            }
        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const chooseChipColor = (value) => {
        switch (value) {
            case 'active':
                return 'success';
            case 'disabled':
                return 'error';
            case 'draft':
                return 'warning';
            default:
                return 'success';
        }
    };

    return (
        <>
            <PanelHeader size='sm' />
            <div className='content'>
                <Row>
                    <Col md='12'>
                        <Card className='h-100'>
                            <CardHeader>
                                <h5 className='title'>Widget Configurations</h5>
                            </CardHeader>
                            {!widgets.length ? (
                                <Lottie options={defaultOptions} height={400} width={400} />
                            ) : (
                                <CardBody>
                                    <TableContainer sx={{ maxHeight: 440 }}>
                                        <Table stickyHeader aria-label='sticky table'>
                                            <TableHead>
                                                <TableRow>
                                                    {columns.map((column) => (
                                                        <TableCell
                                                            key={column.id}
                                                            align={column.align}
                                                            style={{ minWidth: column.minWidth }}
                                                        >
                                                            <b>{column.label}</b>
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                                                    return (
                                                        <TableRow hover role='checkbox' tabIndex={-1} key={'row-' + index}>
                                                            {columns.map((column) => {
                                                                const value = row[column.id];
                                                                return (
                                                                    <TableCell key={column.id} align={column.align}>
                                                                        {column.type === 'chip' && (
                                                                            <Chip
                                                                                variant='outlined'
                                                                                color={value === 'active' ? 'success' : 'error'}
                                                                                label={value}
                                                                            />
                                                                        )}
                                                                        {column.type === 'text' ? value : ''}
                                                                    </TableCell>
                                                                );
                                                            })}
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        rowsPerPageOptions={[10, 25, 100]}
                                        component='div'
                                        count={rows.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </CardBody>
                            )}
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default WidgetStatus;
