import React, { useEffect, useState } from 'react'

const TextField = (props) => {

  const [value, setValue] = useState(props.value)

  const {
    label,
    placeholder,
    multiline
  } = props

  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  return (
    <div className={'flex flex-row items-center ' + (props.container)}>

      {
        label !== undefined &&
        <span className='text-left font-text text-sm font-bold pr-6 w-32'>{label}</span>

      }

      {/* <input
        className="flex flex-auto outline-none 
        border border-inputBorder focus:border-inputFocus hover:border-inputFocus
        font-text text-text
        py-3 mx-10 px-2 rounded-lg text-base 
        focus:shadow focus:ring-1 ring-inputFocus"
        placeholder={placeholder}
      /> */}

      {
        multiline ?
          <textarea
            className={
              "flex flex-auto outline-none " +
              "border border-inputBorder focus:border-inputFocus hover:border-inputFocus " +
              "font-text text-text " +
              "py-2 px-2 rounded-lg text-base " +
              "focus:shadow focus:ring-1 ring-inputFocus " +
              (props.className)
            }
            placeholder={placeholder}
            onChange={(event) => {
              props.onChange(event.target.value)
              setValue(event.target.value)
            }}
            value={value}
          /> :
          <input
            className={
              "flex flex-auto outline-none " +
              "border border-inputBorder focus:border-inputFocus hover:border-inputFocus " +
              "font-text text-text " +
              "py-2 px-2 rounded-lg text-base " +
              "focus:shadow focus:ring-1 ring-inputFocus " +
              (props.className)
            }
            type={props.type}
            placeholder={placeholder}
            onChange={(event) => {
              props.onChange(event.target.value)
              setValue(event.target.value)
            }}
            value={value}
          />
      }

    </div>

  )
}

TextField.defaultProps = {
  multiline: false,
  type: '',
  onChange: () => { }
}

export default TextField