import { Provider } from 'react-redux';
import { store } from './store';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './Module 4/React Router - Navigation in React/NavBar';
import Home from './Module 4/React Router - Navigation in React/Home';
import Counter from './Module 4/Redux Toolkit - State Management in React/Counter_Redux/Counter';
// ... other imports

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/counter" element={<Counter />} />
          {/* Other existing routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;