import axios from "axios";
import { getToken } from "./auth";

//axios请求添加token
const Init = () => {
  const token = getToken();

  if (token) {
    axios.defaults.headers.common["token"] = token;
  }
}

export default Init;