import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './Routes/Home';
import Tv from './Routes/Tv';
import Search from './Routes/Search';
import Header from './Components/Header';

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/tv">
          <Tv />
        </Route>
        <Route exact path="/search">
          <Search />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
