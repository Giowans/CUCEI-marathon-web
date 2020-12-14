import logo from './logo.svg';
import 'rsuite/dist/styles/rsuite-default.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import FrameLayout from './FrameLayout/FrameLayout'
// Provider
import { AuthProvider } from './context/auth';
function App() {

  return (
    <AuthProvider>
      <FrameLayout/>
    </AuthProvider>
  );
}

export default App;
