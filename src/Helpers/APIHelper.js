import Axios from "axios";

/**
 * interface layer of api query (current using axios)  
 * Returns requested data in promise
 * @param {string} method - method type : get, post, put, delete. Default : get
 * @param {string} url - request url
 * @param {string} data - sending data
 */
export async function sendRequest({method = "get", url, data} = {}) {
    return await Axios.request({method: method, url: url, data: data});
}
