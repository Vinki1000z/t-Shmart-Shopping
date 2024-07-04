// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loginpage from './Components/Loginpage';
import Dashboard from './Components/Dashboard';


function App() {
  return (
    <Router>
          <Routes>
       <Route path="/" element={<Loginpage/>} />        
       <Route path="/dashboard" element={<Dashboard/>} />        
       </Routes>
    </Router>
  );
}

export default App;
