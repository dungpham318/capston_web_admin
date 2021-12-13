/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from 'react'
import ic_star from '../../assets/images/ic_star.png'
import ic_star_active from '../../assets/images/ic_star_active.png'

const RatingView = (props) => {
  const total = 5
  const [value, setValue] = useState(props.value)

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      paddingTop: '1em',
      paddingBottom: '1em',
    }}>

      {
        [1, 2, 3, 4, 5].map((item, ele) => {
          return (
            <div onPress={() => {
              // if (props.editable) {
              //   setValue(ele + 1)
              //   props.onChange(ele + 1)
              // }
            }}>
              <img
                src={ele + 1 <= value ? ic_star_active : ic_star}
                style={{
                  width: '2em',
                  height: '2em',
                  marginLeft: '0.5em'
                }}
              />
            </div>
          )
        })
      }

    </div>
  )

}

RatingView.defaultProps = {
  value: 0,
  editable: true
}

export default RatingView