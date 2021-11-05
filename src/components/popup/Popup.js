import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import React from 'react'

export default function Popup(props) {

    const {title, children, openPopup, setOpenPopup} = props;

    return (
        <Dialog open={openPopup}>
            <DialogTitle>
                <div>Title Here</div>
            </DialogTitle>
            <DialogContent>
                <div>Content Here</div>
            </DialogContent>
        </Dialog>

    )
}
