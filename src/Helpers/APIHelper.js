import Axios from "axios";

export async function sendRequest({method = "get", url, data = null} = {}) {
    return await Axios.request({method: method, url: url, data: data});
}
