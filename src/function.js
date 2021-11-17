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