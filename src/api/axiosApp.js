import axios from 'axios';

export default axios.create({ 
    baseURL: `${window.location.protocol}//${window.location.hostname==='localhost'?'localhost:8080':window.location.hostname}`
});
