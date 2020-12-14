import axios from 'axios';

export default axios.create({ 
    baseURL: `${window.location.protocol}//${window.location.hostname==='localhost'?'localhost:8080':process.env.REACT_APP_API_HOST}`
});
