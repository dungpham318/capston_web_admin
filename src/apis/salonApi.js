import { END_POINT, MAP_KEY } from '../config/index'
import { token } from '../config/index'

export async function getSalonList(input) {
  let url = `/api/Salon/advanced_get_salons`
  return fetch(END_POINT + url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
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

export async function createSalonApi(input) {
  let url = `/api/Salon/create_salon`
  return fetch(END_POINT + url, {
    method: 'POST',
    headers: {
      // 'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
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

export async function searchAddressApi(input) {
  let url = `https://rsapi.goong.io/Place/AutoComplete?api_key=${MAP_KEY}&location=${input.location}&input=${input.input}`
  return fetch(url, {
    method: 'GET',
    // headers: {
    //   'Content-Type': 'application/json',
    //   'Authorization': 'Bearer ' + localStorage.getItem('token')
    // },
  })
    .then((response) => {
      return response.json();
    })
    .then(data => {
      // if (!data.isSuccess) {
      //   alert(data.message)
      //   return false
      // } else {
      return data
      // }
    })
    .catch((error) => {
      console.log(error)
      return false
    });
}

export async function getAddressByIDApi(input) {
  let url = `https://rsapi.goong.io/Place/Detail?api_key=${MAP_KEY}&place_id=${input.place_id}`
  return fetch(url, {
    method: 'GET',
    // headers: {
    //   'Content-Type': 'application/json',
    //   'Authorization': 'Bearer ' + localStorage.getItem('token')
    // },
  })
    .then((response) => {
      return response.json();
    })
    .then(data => {
      // if (!data.isSuccess) {
      //   alert(data.message)
      //   return false
      // } else {
      return data
      // }
    })
    .catch((error) => {
      console.log(error)
      return false
    });
}

export async function getSalonDetailApi(input) {
  let url = `/api/Salon/${input?.id}`
  return fetch(END_POINT + url, {
    method: 'GET',
    headers: {
      // 'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
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

export async function updateSalonApi(input) {
  let url = `/api/Salon/update_salon`
  return fetch(END_POINT + url, {
    method: 'PUT',
    headers: {
      // 'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
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

