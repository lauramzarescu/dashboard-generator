import { Slide } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import * as React from 'react';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

function SlideTransition(props) {
    return <Slide {...props} direction='bottom' />;
}

export default function Notification(props) {
    let severity = props.severity;
    let autoHideDuration = props.duration;
    let message = props.message;
    let open = props.open;

    return (
        <Stack spacing={2} sx={{ width: '100%' }}>
            <Snackbar
                open={open}
                autoHideDuration={autoHideDuration}
                onClose={props.handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                TransitionComponent={SlideTransition}
            >
                <Alert onClose={props.handleClose} severity={severity} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </Stack>
    );
}
