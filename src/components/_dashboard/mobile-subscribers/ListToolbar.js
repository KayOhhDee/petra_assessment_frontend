import React from 'react';
import searchFill from '@iconify/icons-eva/search-fill';
import { Icon } from '@iconify/react';
import { Box, Button, CircularProgress, FormControl, Grid, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, Toolbar } from '@mui/material';
// material
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(0, 1, 0, 3)
}));

const SearchStyle = styled(OutlinedInput)(() => ({ // unnecessary
  width: "100%"
}));

// ----------------------------------------------------------------------

ListToolbar.propTypes = {
  // filterName: PropTypes.string,
  // onFilterName: PropTypes.func,
  requesting: PropTypes.bool
};

const SERVICE_TYPE = [
  { label: "All", value: "all" },
  { label: "Mobile prepaid", value: "MOBILE_PREPAID" },
  { label: "Mobile postpaid", value: "MOBILE_POSTPAID" }
]


export default function ListToolbar({ requesting }) {
  const [values, setValues] = React.useState({
    serviceType: "all",
    filterName: ""
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  }

  return (
    <RootStyle>
      <Grid container spacing={2}>
        <Grid item sm={3} xs={12}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Service Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={values.serviceType}
              label="Service Type"
              name="serviceType"
              onChange={handleChange}
            >
              {SERVICE_TYPE.map(item => (
                <MenuItem key={item.label} value={item.value}>{item.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item sm={7} xs={12}>
          <SearchStyle
            value={values.filterName}
            name="filterName"
            onChange={handleChange}
            placeholder="Search..."
            startAdornment={
              <InputAdornment position="start">
                <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                {requesting ? <CircularProgress sx={{ color: 'text.disabled' }} size={18} /> : null}
              </InputAdornment>
            }
          />
        </Grid>
        <Grid item sm={2} xs={12}>
          <Button fullWidth variant="contained" size="large">Search</Button>
        </Grid>
      </Grid>
    </RootStyle>
  );
}
