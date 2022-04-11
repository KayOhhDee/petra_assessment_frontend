// scroll bar
import 'simplebar/src/simplebar.css';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { createClient, Provider } from 'urql';

//
import App from './App';

// ----------------------------------------------------------------------

const client = createClient({
  url: 'http://localhost:4000/graphql',
});

ReactDOM.render(
  <Provider value={client}>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </Provider>,
  document.getElementById('root')
);
