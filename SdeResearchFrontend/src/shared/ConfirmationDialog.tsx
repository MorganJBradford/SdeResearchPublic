import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material';
import { ConfirmationDialogProps } from '../utils/types';

export default function ConfirmationDialog({
  id,
  openDialogButtonProps,
  dialogDescription,
  dialogTitle,
  confirmationButtonProps,
}: ConfirmationDialogProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmation = () => {
    handleClose();
    if (confirmationButtonProps.onConfirmById && id)
      confirmationButtonProps.onConfirmById(id);

    if (confirmationButtonProps.onConfirm)
      confirmationButtonProps.onConfirm();
  }

  return (
    <div style={{display: 'inline-flex'}}>
      <Button sx={openDialogButtonProps.styles} onClick={handleClickOpen}>
        {openDialogButtonProps.text}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {dialogTitle}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogDescription}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: 'white', backgroundColor: theme.palette.primaryPalette.darkColor, '&:hover': { backgroundColor: theme.palette.primaryPalette.blueColor }}} onClick={handleClose}>Cancel</Button>
          <Button sx={confirmationButtonProps.styles} onClick={() => handleConfirmation()} autoFocus>
            {confirmationButtonProps.text}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
