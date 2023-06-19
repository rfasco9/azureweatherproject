import axios from "axios";

export async function getCurrUser() {
    const response = (await axios.get('/.auth/me', {headers: {
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS'
    },
    withCredentials: true})).data;
    console.log(response)
    if (response[0]) {
      const { user_id } = response[0];
      return user_id;
    } else {
      return null;
    }
  }

export async function getCurrUserData() {
  const id = await getCurrUser();
}