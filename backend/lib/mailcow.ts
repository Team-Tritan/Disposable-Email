import axios, { Axios } from 'axios';

interface CreateMailbox {
    domain: string;
    name: string;
    quota: string;
    password: string;
    forcePwUpdate: string
}


export default class Mailcow {

    private apiKey: string;
    private axios: Axios;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.axios = axios.create({
            baseURL: process.env.MAILCOW_API_BASE,
            headers: {
                "X-API-Key": this.apiKey,
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });
    }


    async createMailbox({
        domain,
        name,
        quota,
        password,
        forcePwUpdate
    } : CreateMailbox) {
        return await this.axios.post("/api/v1/add/mailbox", {
            domain,
            name,
            quota,
            password,
            forcePwUpdate,
            local_part: name,
            password2: password,
            active: "1",
            tls_enforce_in: "1",
            tls_enforce_out: "1"
        }).then((res) => {
            const data = res.data;

            if(res.status == 200) {
                return data;
            } else {
                return null
            }
        }).catch(err => {
            return null;
        });                
    } 
}