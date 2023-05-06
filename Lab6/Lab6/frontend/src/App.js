import React, { useState } from 'react'
import './App.css';
import Home from './components/Home';
import PokemonList from './components/pokemonList';
import PokemonDetail from './components/pokemonDetail';
import TrainersList from './components/trainers';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import TrainersContext from './components/trainersContext';

function App() {
  	const [currentTrainer, setCurrentTrainer] = useState("");
  	const [allTrainersGroup, setAllTrainersGroup] = useState({});
  	return (
    	<Router>
			<div className='App'>
        		<TrainersContext.Provider value={[currentTrainer, setCurrentTrainer, allTrainersGroup, setAllTrainersGroup]}>
				  	<header className='App-header'>
					  	<h1 className='App-title'>Welcome to the React.js and context API pokemon Example</h1>
					  	<Link className='showlink' to='/'>
           	  				Home
					  	</Link>
					  <Link className='showlink' to='/pokemon/page/1'>
              				pokemonsList
					  </Link>
					  <Link className='showlink' to='/trainers'>
           	  				trainers
					  </Link>
				  	</header>
				  	<br />
				  	<br />
				  	<div className='App-body'>
					  	<Routes>
						  	<Route path='/' element={<Home />} />
						  	<Route path='/pokemon/page/:pagenum' element={<PokemonList />} />
          	  				<Route path='/pokemon/:id' element={<PokemonDetail />} />
          	  				<Route path='/trainers' element={<TrainersList />} />
					  	</Routes>
				  	</div>
        		</TrainersContext.Provider>
			</div>
		</Router>
  	);
}

export default App;
