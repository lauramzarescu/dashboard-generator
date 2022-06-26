// reactstrap components
import { Button, Card, CardBody, CardHeader, Col, Form, FormGroup, Input, Row } from 'reactstrap';

// core components
import Notification from 'components/Notifications/Notification';
import PanelHeader from 'components/PanelHeader/PanelHeader.js';
import { useEffect, useRef, useState } from 'react';
import { getUser, updateUser } from 'server/api';
import { userProfileFieldsClone } from 'variables/configurator-line';

function User() {
    let [user, setUser] = useState({});
    let userProfileFields = useRef(userProfileFieldsClone);
    let [validUrl, setValidUrl] = useState(false);
    let [toast, setToast] = useState({
        message: '',
        severity: '',
        duration: 5000,
        loaded: false,
    });
    let [openToast, setOpenToast] = useState(false);

    const fetchData = async () => {
        getUser().then((response) => {
            if (response && response.data) {
                setUser(response.data);
                console.log(response.data);
            }
        });
    };

    const saveChanges = () => {
        updateUser(user._id, user).then((response) => {
            if (response && response.data && response.data.modifiedCount === 1) {
                notification('Profile updated successfully', 'success', 5000);
            }
        });
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

    const handleToastClone = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenToast(false);
    };

    const handleFieldChange = (value, source) => {
        let userUpdateObj = { ...user };

        _.set(userUpdateObj, source.key, value);
        setUser(userUpdateObj);

        source.enabled = value;
    };

    useEffect(() => {
        fetchData();
    }, []);

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
                    <Col md='8'>
                        <Card>
                            <CardHeader>
                                <h5 className='title'>Edit Profile</h5>
                            </CardHeader>
                            <CardBody>
                                <Form>
                                    {userProfileFields.current.map((row) => {
                                        return (
                                            <Row>
                                                {row.map((field) => {
                                                    return (
                                                        <Col md={field.size}>
                                                            <FormGroup>
                                                                <label>{field.label}</label>
                                                                <Input
                                                                    defaultValue={user[field.key]}
                                                                    type='text'
                                                                    onChange={(event) => handleFieldChange(event.target.value, field)}
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                    );
                                                })}
                                            </Row>
                                        );
                                    })}
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Button color='primary' size='lg' active onClick={() => saveChanges()}>
                    Save changes
                </Button>
            </div>
        </>
    );
}

export default User;
