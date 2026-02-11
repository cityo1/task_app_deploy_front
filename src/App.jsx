import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Completed from './components/Completed';
import Proceeding from './components/Proceeding';
import Important from './components/Important';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/completed" element={<Completed />} />
          <Route path="/proceeding" element={<Proceeding />} />
          <Route path="/important" element={<Important />} />
        </Routes>
        {/* 경고창 */}
        <ToastContainer
          position="bottom-center"
          autoClose={1000}
          theme="dark"
        />
      </div>
    </BrowserRouter>
  );
};

export default App;
