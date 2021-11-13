import { END_POINT } from '../config/index'
import { token } from '../config/index'

export async function addArticleApi(input) {
  console.log(input)

  let url = `/api/Article/create_article`
  return fetch(END_POINT + url, {
    method: 'POST',
    headers: {
      // 'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
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
      'Authorization': 'Bearer ' + token
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
      'Authorization': 'Bearer ' + token
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
