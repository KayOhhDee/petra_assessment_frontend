import * as React from 'react';
import * as Yup from 'yup';
import Proptypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Form, FormikProvider, useFormik } from 'formik';
import { useQuery, useMutation } from 'urql';
// material
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Alert, Box, Button,
  Dialog, DialogActions,
  DialogContent,
  DialogTitle, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, Slide, TextField
} from '@mui/material';

AddMobileSubscriber.propTypes = {
  isOpen: Proptypes.bool,
  setIsOpen: Proptypes.func,
  selectedItem: Proptypes.object,
  children: Proptypes.node
};

const ChildrenButtonStyle = styled(Button)(() => ({
  width: '100%',
  padding: 0
}));

// ----------------------------------------------------------------------

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

// ----------------------------------------------------------------------

const SERVICE_TYPE = [
  { label: "Mobile prepaid", value: "MOBILE_PREPAID" },
  { label: "Mobile postpaid", value: "MOBILE_POSTPAID" }
]

const UsersQuery = `
query {
  users {
    id
    name
  }
}
`;

const OwnersQuery = `
query {
  owners {
    id
    name
  }
}
`;

const AddMobileSubscriberMutation = `
mutation CreateMobileSubscriber(
  $msisdn: String!, $customerIdOwner: Float!, $customerIdUser: Float!, $serviceType: String!
) {
  createMobileSubscriber(
    info: {
      msisdn: $msisdn,
      customerIdUser: $customerIdUser,
      customerIdOwner: $customerIdOwner,
      serviceType: $serviceType
    }) {
      id
      msisdn
      customerIdUser
      customerIdOwner
      serviceType
      serviceStartDate
      ownerSubscriber {
        id
        name
      }
      userSubscriber {
        id
        name
      }
  }
}
`;

const UpdateMobileSubscriberMutation = `
mutation UpdateMobileSubscriber(
  $id: Float!, $msisdn: String!, $customerIdOwner: Float!, $customerIdUser: Float!, $serviceType: String!
) {
  updateMobileSubscriber(
    id: $id,
    info: {
      msisdn: $msisdn,
      customerIdUser: $customerIdUser,
      customerIdOwner: $customerIdOwner,
      serviceType: $serviceType
    }) {
      id
      msisdn
      customerIdUser
      customerIdOwner
      serviceType
      serviceStartDate
      ownerSubscriber {
        id
        name
      }
      userSubscriber {
        id
        name
      }
  }
}
`;

export default function AddMobileSubscriber({ isOpen, setIsOpen, selectedItem, children }) {
  const [open, setOpen] = React.useState(true);
  const [error, setError] = React.useState(null);

  // ---------------------------------------------------------------------------

  const usersResponse = useQuery({
    query: UsersQuery,
  });
  const ownersResponse = useQuery({
    query: OwnersQuery,
  });
  const [,createMobileSubscriber] = useMutation(AddMobileSubscriberMutation);
  const [,updateMobileSubscriber] = useMutation(UpdateMobileSubscriberMutation);

  // ---------------------------------------------------------------------------

  const {
    data: usersData,
    fetching: usersFetching,
    error: usersError
  } = usersResponse[0];

  const {
    data: ownersData,
    fetching: ownersFetching,
    error: ownersError
  } = ownersResponse[0];

  // ---------------------------------------------------------------------------

  const _isMounted = React.useRef(true);

  // ----------------------------------------------------------------------------

  const MobileSubscriberSchema = Yup.object().shape({
    msisdn: Yup.string().required('msisdn is required'),
    serviceType: Yup.string().required('service type is required'),
    customerIdOwner: Yup.number().required('owner is required'),
    customerIdUser: Yup.number().required('user is required')
  });

  const [initialValues] = React.useState({
    serviceType: '',
    msisdn: '',
    customerIdOwner: '',
    customerIdUser: ''
  });

  const formik = useFormik({
    initialValues,
    validationSchema: MobileSubscriberSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setSubmitting(true);
      setError(null);

      let response;

      if (selectedItem) {
        response = await updateMobileSubscriber({id: selectedItem.id, ...values});
      } else {
        response = await createMobileSubscriber(values);
      }

      if (response.error) {
        if (response.error.message.includes('duplicate key value')) {
          setError('Mobile subscriber already exists');
        } else {
          setError(response.error.message);
        }
        setSubmitting(false);
        return;

      }
      setSubmitting(false);
      resetForm(initialValues);
      handleClose();

      if (_isMounted.current) {
        setOpen(false);
      }
    }
  });

  // ----------------------------------------------------------------------

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = React.useCallback(() => {
    setOpen(false);
    setIsOpen(false);
  }, [setIsOpen]);

  // ----------------------------------------------------------------------

  React.useEffect(() => {
    if (isOpen) {
      handleOpen();
      if (selectedItem) {
        formik.setValues(selectedItem);
      }
    } else {
      formik.resetForm();
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleClose, isOpen]);

  React.useEffect(
    () => () => {
      _isMounted.current = false;
    },
    []
  );

  // ----------------------------------------------------------------------

  const { errors, isSubmitting, handleSubmit, getFieldProps, touched } = formik;

  return (
    <div>
      <ChildrenButtonStyle onClick={() => setOpen(true)}>{children}</ChildrenButtonStyle>
      <Dialog
        open={open}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        {error && <Alert severity="error">{error}</Alert>}
        <DialogTitle>{!selectedItem ? 'Add Mobile Subscriber' : `Edit ${selectedItem?.msisdn}`}</DialogTitle>
        <DialogContent>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate>
              <Box sx={{ pt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={8}>
                    <TextField
                      fullWidth
                      label="Msisdn"
                      {...getFieldProps('msisdn')}
                      error={Boolean(touched.msisdn && errors.msisdn)}
                      helperText={touched.msisdn && errors.msisdn}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth error={Boolean(errors.serviceType)}>
                      <InputLabel id="demo-simple-select-label">Service Type</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        {...getFieldProps('serviceType')}
                        label="Service Type"
                      >
                        {SERVICE_TYPE.map((item) => (
                          <MenuItem key={item.value} value={item.value}>
                            {item.label}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{errors.serviceType}</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={Boolean(errors.customerIdOwner)}>
                      <InputLabel id="demo-simple-select-label">Owner</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        {...getFieldProps('customerIdOwner')}
                        label="Owner"
                        disabled={ownersFetching}
                      >
                        {(!ownersFetching ? ownersData.owners : []).map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{errors.customerIdOwner}</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={Boolean(errors.customerIdUser)}>
                      <InputLabel id="demo-simple-select-label">User</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        {...getFieldProps('customerIdUser')}
                        label="User"
                        disabled={usersFetching}
                      >
                        {(!usersFetching ? usersData.users : []).map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{errors.customerIdUser}</FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </Form>
          </FormikProvider>
        </DialogContent>
        <DialogActions>
          <LoadingButton onClick={handleSubmit} loading={isSubmitting}>
            {selectedItem ? 'Update' : 'Save'}
          </LoadingButton>
          <Button disabled={isSubmitting} onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
