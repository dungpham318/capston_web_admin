import React, { Component } from 'react';
import Modal from '@mui/material/Modal'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

export default class Loading extends Component {

  render() {
    return (
      <Modal
        open={this.props.isOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>
      </Modal>
    )
  }

}