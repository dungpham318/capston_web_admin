
import { END_POINT } from '../config/index'

export async function getCustomerList(input) {
  let url = `/api/Customer/advanced_get_customers`
  return fetch(END_POINT + url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxIiwidW5pcXVlX25hbWUiOiJhZG1pbjEyM0BnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW5pc3RyYXRvciIsIm5iZiI6MTYzNTU2OTE5MSwiZXhwIjoxNjM2MTczOTkxLCJpYXQiOjE2MzU1NjkxOTF9.GBu-9rmyu-l5C0umBfYZnx05m60UzY6KiZz-lz6aO03N8f7HCjt24WcluN0M35s5-EHbNocy9qp00k8ODWDG4Q'
    },
    body: JSON.stringify(input)
  })
    .then((response) => {
      return response.json();
    })
    .then(data => {
      if (!data.isSuccess) {
        alert(data.message)
        return false
      } else {
        return data
      }
    })
    .catch((error) => {
      console.log(error)
      return false
    });
}
