import Cookies from "js-cookie"

export const getCookie = () => {
    const cookie = Cookies.get('authenticate');
    return {'Authorization' : cookie ? 'Bearer ' + JSON.parse(cookie).access_token : '' };
}