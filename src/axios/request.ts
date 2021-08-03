import axios from 'axios'

const baseURL = process.env.VUE_APP_BASE_URL

export const axiosBase = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'Content-type': 'application/json'
  }
})

export const setAuthToken = async(token: string): Promise<void> => {
  axiosBase.defaults.headers.Authorization = `Bearer ${token}`
}
