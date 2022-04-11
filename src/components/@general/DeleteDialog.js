import * as React from 'react';
import Proptypes from 'prop-types';
import {
  Button,
  Dialog,
  Alert,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

DeleteDialog.propTypes = {
  isOpen: Proptypes.bool,
  setIsOpen: Proptypes.func,
  selectedItem: Proptypes.object,
  delFunc: Proptypes.func
};

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function DeleteDialog({ isOpen, setIsOpen, selectedItem, delFunc }) {
  const [open, setOpen] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  // ---------------------------------------------------------------------------

  const _isMounted = React.useRef(true);

  // ----------------------------------------------------------------------

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = React.useCallback(() => {
    setOpen(false);
    setIsOpen(false);
    setError(null);
  }, [setIsOpen]);

  const handleDelete = async () => {
    if (selectedItem) {
      try {
        setIsLoading(true);
        await delFunc({id: selectedItem.id});
        handleClose();
      } catch (error) {
        setError(error.message);
      } finally {
        if (_isMounted.current) {
          setIsLoading(false);
        }
      }
    }
  };

  // ----------------------------------------------------------------------

  React.useEffect(() => {
    if (isOpen) handleOpen();
    else handleClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleClose, isOpen]);

  React.useEffect(
    () => () => {
      _isMounted.current = false;
    },
    []
  );

  // ----------------------------------------------------------------------

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        // onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        {error && <Alert severity="error">{error}</Alert>}
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            This action will delete the measurement permanently. You can't undo this action.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <LoadingButton loading={isLoading} color="error" onClick={handleDelete}>
            Yes
          </LoadingButton>
          <Button disabled={isLoading} onClick={handleClose}>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
