import * as React from 'react';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DataGridC from './DataGridC';

export default function ModalGenre() {
  const [open, setOpen] = React.useState<boolean>(false);
  return (
    <React.Fragment>
      <Button
        variant="outlined"
        color="neutral"
        onClick={() => setOpen(true)}
      >
        Genre
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <DialogTitle sx={{ ml: 3 }}>Genre</DialogTitle>
          <DataGridC />
          <Button>Add new genre</Button>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}