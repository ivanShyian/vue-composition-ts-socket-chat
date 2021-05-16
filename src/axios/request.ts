import axios from 'axios'

const baseURL = process.env.VUE_APP_BASE_URL
const axiosBase = axios.create({
  baseURL
})

export {
  axiosBase
}
