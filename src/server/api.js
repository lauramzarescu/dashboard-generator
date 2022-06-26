const axios = require('axios');

const userId = '62a768b3a2f6b5bab70bb3c7';

export const getAllWidgets = async (id) => {
    try {
        return await axios.get('http://localhost:5000/widgets');
    } catch (error) {
        console.error(error);
    }
};

export const getUser = async () => {
    try {
        return await axios.get('http://localhost:5000/user/' + userId);
    } catch (error) {
        console.error(error);
    }
};

export const getWidgetByChartId = async (id) => {
    console.log('get chart by id');
    try {
        return await axios.get('http://localhost:5000/widget/chartid/' + id);
    } catch (error) {
        console.error(error);
    }
};

export const createWidgetApi = async (config) => {
    try {
        return await axios.post('http://localhost:5000/widget', {
            userId: userId,
            config: config,
        });
    } catch (error) {
        console.error(error);
    }
};

export const deleteWidget = async (id) => {
    try {
        return await axios.delete('http://localhost:5000/widget/' + id);
    } catch (error) {
        console.error(error);
    }
};

export const updateWidget = async (id, config) => {
    try {
        return await axios.patch('http://localhost:5000/widget/' + id, {
            config: config,
        });
    } catch (error) {
        console.error(error);
    }
};

export const updateWidgetByChartId = async (id, config) => {
    try {
        return await axios.patch('http://localhost:5000/widget/chartid/' + id, {
            config: config,
        });
    } catch (error) {
        console.error(error);
    }
};

export const updateUser = async (id, user) => {
    try {
        return await axios.patch('http://localhost:5000/user/' + id, {
            user: user,
        });
    } catch (error) {
        console.error(error);
    }
};
