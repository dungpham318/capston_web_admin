import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box'

const CustomModal = (props) => {

  const {
    isOpen,
    onClose
  } = props

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50em',
        height: '50em',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        overflow: 'auto'
      }}
      >
        {props.children}
      </Box>
    </Modal>
  )
}

CustomModal.defaultProps = {
  isOpen: false,
  onClose: () => { }
}

export default CustomModal
