import axios from 'axios';

const token = "eyJ1aWQiOiIxMTgwMDAxNDgiLCJzaWQiOiI4QUQxODQ2RTg0MUNEMEU3IiwiZXhwIjoyMDgzODU4NTYwfQ.VXuyHaEY0alAcxh1CM0etjeAP3LRLu7wYY3JpwB7BFM";
export default axios.create({
    baseURL: "https://tapi.lhu.edu.vn/qa",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
});
