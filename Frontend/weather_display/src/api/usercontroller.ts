import axios from "axios";

let url = window.location.href
url='http://localhost:7777/'

const fetchUserData = async (id: string): Promise<any> => {
    return (await axios.post(`${url}user/`, {id: id})).data
}

const updateUserLocations = async (id: string, locations: string[]): Promise<any> => {
    return (await axios.put(`${url}user/${id}`, {id: id, locations: locations})).data
}

export {fetchUserData, updateUserLocations};