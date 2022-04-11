// ----------------------------------------------------------------------

export default function Button(theme) {
  return {
    MuiButton: {
      styleOverrides: {
        root: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
        },
        sizeLarge: {
          paddingTop: '.8rem',
          paddingBottom: '.8rem',
        },
        containedInherit: {
          color: theme.palette.grey[800],
          '&:hover': {
            backgroundColor: theme.palette.grey[400],
          },
        },
      },
    },
  };
}

