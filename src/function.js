export const convertMoney = (_text) => {
  // console.log("11111111 convert money", Math.round(_text / 15 * 100))
  if (_text !== '' && _text !== undefined && _text !== null) {
    let texts = _text?.toString();

    if (_text !== undefined) {
      let text = _text.toString().split(".").join("");
      let length = text.length;
      let value = "";
      // if (length === 7) {
      //   text = text.substr(0, 1) + "000000"
      //   // console.log('------------> ', text, text.replace(text.slice(-6, length), "000000"))
      // } else
      if (length === 8) {
        text = text.substr(0, 2) + "000000"
      } else if (length === 9) {
        text = text.substr(0, 3) + "000000"
      } else if (length === 10) {
        text = text.substr(0, 4) + "000000"
      } else if (length === 11) {
        text = text.substr(0, 5) + "000000"
      } else if (length === 12) {
        text = text.substr(0, 6) + "000000"
      }
      // if(text.split('.').length) ;

      if (length >= 4) {
        for (let i = length - 1; i >= 0; i = i - 3) {
          value =
            `${text[i - 3] === undefined || text[i - 2] === undefined ? "" : "."
            }${text[i - 2] === undefined ? "" : text[i - 2]}${text[i - 1] === undefined ? "" : text[i - 1]
            }${text[i] === undefined ? "" : text[i]}` + value;
        }
      } else {
        return texts.split(".").join("");
      }
      return value;
    } else {
      return "";
    }
  } else {
    return ""
  }
}

export function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export const convertDate = (day) => {
  let date = new Date(day)
  let time
  let dd = date.getUTCDate()
  if (dd < 10) {
    dd = '0' + dd
  }
  let mm = date.getUTCMonth() + 1
  if (mm < 10) {
    mm = '0' + mm
  }
  let yyyy = date.getUTCFullYear()
  return dd + '/' + mm + '/' + yyyy
}

export const convertDateTime = (time) => {
  if (time === null || time === undefined) {
    return "";
  }
  let day = time.getUTCDate();
  if (day < 10) {
    day = "0" + day;
  }
  let month = time.getUTCMonth() + 1;
  if (month < 10) {
    month = "0" + month;
  }
  let year = time.getFullYear();
  if (year < 10) {
    year = "0" + year;
  }
  let hours = time.getUTCHours();
  if (hours < 10) {
    hours = "0" + hours;
  }
  let minutes = time.getUTCMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  let seconds = time.getUTCSeconds();
  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}