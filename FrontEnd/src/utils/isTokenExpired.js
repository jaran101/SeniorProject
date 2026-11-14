export default function isTokenExpired(token) {
  if (!token) return true;
  try {
    const base64 = token.split(".")[1];
    const payload = JSON.parse(atob(base64.replaceAll("-","+").replaceAll("_","/")));
    if(!payload.exp){
        return false;        
    }
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch {
    return true;
  }
}