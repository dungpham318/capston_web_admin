import { END_POINT } from '../config/index'

export async function getComboList(input) {
  let url = `/api/Combo/advanced_get_combos`
  return fetch(END_POINT + url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxIiwidW5pcXVlX25hbWUiOiJhZG1pbjEyM0BnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW5pc3RyYXRvciIsIm5iZiI6MTYzNjE4OTI4MSwiZXhwIjoxNjM2Nzk0MDgxLCJpYXQiOjE2MzYxODkyODF9.JxKU8i1IVBMk6jRU03_FlQ5sDYM5ieDBUkEsGyjS_woMZcd0-1aG-dLWEv7LxlTH2MQW-XemHKf2zEnnCdL0ug'
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
