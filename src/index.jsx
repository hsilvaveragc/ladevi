import { createRoot } from 'react-dom/client'; // ← Cambio: nuevo import para React 18
import Root from 'shell/Root';

import store from './shared/redux/store';

import 'bootstrap/dist/css/bootstrap.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-table/react-table.css';
import 'react-datepicker/dist/react-datepicker.css';
import './globalStyles.css';

// ← Cambio: createRoot en lugar de ReactDOM.render
const rootEl = document.getElementById('root');
const root = createRoot(rootEl);
root.render(<Root store={store} />);
