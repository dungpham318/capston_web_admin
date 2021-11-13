import React, { useEffect } from 'react'

const Button = (props) => {

  const {
    label
  } = props

  return (
    <button
      className={
        (props.className) +
        ' flex flex-row items-center justify-center rounded-lg focus:outline-none ' +
        'focus:shadow focus:ring-1 ring-inputFocus ' +
        'hover:bg-opacity-50 '
      }
      onClick={() => {
        props.onClick()
      }}
    >
      <span className={
        'flex flex-row text-white px-3 py-3 font-text text-base font-medium items-center justify-center ' +
        props.text
      }>
        {props.icon}
        <span className='px-2 items-center justify-center'>
          {label}
        </span>
      </span>

    </button>

  )
}

Button.defaultProps = {
  onClick: () => { }
}

export default Button