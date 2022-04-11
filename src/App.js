// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
import { ChartStyle } from './components/chart';
// components
import ScrollToTop from './components/ScrollToTop';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeConfig>
      <GlobalStyles />
      <ChartStyle />
      <ScrollToTop />
      <Router />
    </ThemeConfig>
  );
}
