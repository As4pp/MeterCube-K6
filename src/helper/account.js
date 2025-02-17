import http from "k6/http";
import {check} from "k6";

export function getAccountDetails(){
    const API_URL =  __ENV.BASE_URL + "/api/my-account/get-user-details/" + __ENV.DEFAULT_USER_ID;

    const response = http.get(API_URL, {
        headers: {
            'accept': '*/*',
            'content-type': 'application/json',
            'Authorization': `Bearer ${__ENV.TOKEN}`
        }
    })

    check(response, {
        "[getAccountDetails] response status must be 200": (res) => res.status === 200,
        "[getAccountDetails] response data must not be null": (res) => res.json().data != null
    })

    return response.json()
}