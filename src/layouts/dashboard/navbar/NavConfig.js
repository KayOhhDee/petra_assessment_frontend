// components
import Iconify from "../../../components/Iconify";

// ----------------------------------------------------------------------

const getIcon = (icon) => <Iconify icon={icon} />;

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    items: [
      { title: 'app', path: '/app', icon: getIcon('radix-icons:dashboard') },
      { title: 'mobile subscribers', path: '/mobile-subscribers', icon: getIcon('fluent:people-16-regular') },
    ],
  },
];

export default navConfig;
