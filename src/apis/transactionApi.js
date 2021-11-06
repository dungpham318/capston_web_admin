import { END_POINT } from '../config/index'

export async function getTransactionList(input) {
  let url = `/api/Appointment/advanced_get_appointments`
  return fetch(END_POINT + url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxIiwidW5pcXVlX25hbWUiOiJhZG1pbjEyM0BnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW5pc3RyYXRvciIsIm5iZiI6MTYzNjAxMTkxMywiZXhwIjoxNjM2NjE2NzEzLCJpYXQiOjE2MzYwMTE5MTN9.6criXw6TCfsFB7vj3aGKfNHUT8Jb8YzfFiojI_-1cAyoJFNxZdmFm1jhXrEcL9jpE__V01F-VChJZCinOdef3w'
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

export async function getTransactionDetailApi(input) {
  let url = `/api/Appointment/${input.id}`
  return fetch(END_POINT + url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxIiwidW5pcXVlX25hbWUiOiJhZG1pbjEyM0BnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW5pc3RyYXRvciIsIm5iZiI6MTYzNjAxMTkxMywiZXhwIjoxNjM2NjE2NzEzLCJpYXQiOjE2MzYwMTE5MTN9.6criXw6TCfsFB7vj3aGKfNHUT8Jb8YzfFiojI_-1cAyoJFNxZdmFm1jhXrEcL9jpE__V01F-VChJZCinOdef3w'
    },
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
