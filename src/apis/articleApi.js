import { END_POINT } from '../config/index'

export async function addArticleApi(input) {
  console.log(input)

  let url = `/api/Article/create_article`
  return fetch(END_POINT + url, {
    method: 'POST',
    headers: {
      // 'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxIiwidW5pcXVlX25hbWUiOiJhZG1pbjEyM0BnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW5pc3RyYXRvciIsIm5iZiI6MTYzNjE4OTI4MSwiZXhwIjoxNjM2Nzk0MDgxLCJpYXQiOjE2MzYxODkyODF9.JxKU8i1IVBMk6jRU03_FlQ5sDYM5ieDBUkEsGyjS_woMZcd0-1aG-dLWEv7LxlTH2MQW-XemHKf2zEnnCdL0ug'
    },
    body: input
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


export async function getArticleListApi(input) {

  let url = `/api/Article/advanced_get_articles`
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


export async function getArticleDetailApi(input) {

  let url = `/api/Article/get_article/${input?.id}`
  return fetch(END_POINT + url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxIiwidW5pcXVlX25hbWUiOiJhZG1pbjEyM0BnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW5pc3RyYXRvciIsIm5iZiI6MTYzNjE4OTI4MSwiZXhwIjoxNjM2Nzk0MDgxLCJpYXQiOjE2MzYxODkyODF9.JxKU8i1IVBMk6jRU03_FlQ5sDYM5ieDBUkEsGyjS_woMZcd0-1aG-dLWEv7LxlTH2MQW-XemHKf2zEnnCdL0ug'
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
