
//设置token   name-- key值     data -- token   expires -- 过期时间
export function setToken(name, data, expires) {
  const obj = {
    data,
    expires
  };
  localStorage.setItem(name, JSON.stringify(obj));
}

//获取token
export function getToken() {
  var jsonParse = JSON.parse(localStorage.getItem('token'));
  const time = new Date().getTime();

  if (jsonParse) {
    if (jsonParse.expires > time) {
      return jsonParse.data;
    } else {
      localStorage.removeItem('token');
      return null;
    }
  }
}

//判断是否登录
export function isLogin() {
  if (getToken()) {
    console.log("true");
    return true;
  }
  console.log("false");
  return false
}