import axios from "axios";

export function fetchList() {
    return axios.get('http://192.168.3.118:8005/api/states');
}

