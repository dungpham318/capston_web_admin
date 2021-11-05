import { END_POINT } from '../config/index'

export async function addArticleApi(input) {
  console.log(JSON.stringify(input))
  let url = `api/Article/create_article`
  return fetch(END_POINT + url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxIiwidW5pcXVlX25hbWUiOiJhZG1pbjEyM0BnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW5pc3RyYXRvciIsIm5iZiI6MTYzNTU4MzIwOCwiZXhwIjoxNjM2MTg4MDA4LCJpYXQiOjE2MzU1ODMyMDh9.9H4laE64bhkJdsGFoyIZ7eFuTi6C2swWgQqYWHR9MGbgFprRly5JZ6Ey4r3kQNIiyqIc15GPZagogoBL135T4Q'
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



