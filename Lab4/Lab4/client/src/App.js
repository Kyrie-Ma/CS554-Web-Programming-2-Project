import React from 'react';
import logo from './img/Marvel_Logo.svg.png';
import './App.css';
import Home from './components/Home';
import CharactersList from './components/CharactersList';
import ComicsList from './components/ComicsList';
import StoriesList from './components/StoriesList';
import Characters from './components/Characters';
import Comics from './components/Comics';
import Stories from './components/Stories';
import CharactersHistory from './components/CharactersHistory';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

const App = () => {

	return (
		<Router>
			<div className='App'>
				<header className='App-header'>
					<img src={logo} className='App-logo' alt='logo' />
					<h1 className='App-title'>Welcome to the React.js Marvel API Example</h1>
					<Link className='showlink' to='/'>
           				Home
					</Link>
					<Link className='showlink' to='/characters/page/1'>
           				Characters
					</Link>
          			<Link className='showlink' to='/comics/page/1'>
            			Comics
					</Link>
					<Link className='showlink' to='/stories/page/1'>
           				Stories
					</Link>
				</header>
				<br />
				<br />
				<div className='App-body'>
					<Routes>
						<Route path='/' element={<Home />} />
						<Route path='/characters/history' element={<CharactersHistory />} />
          				<Route path='/characters/page/:page' element={<CharactersList />} />
          				<Route path='/comics/page/:page' element={<ComicsList />} />
          				<Route path='/stories/page/:page' element={<StoriesList />} />
						<Route path='/characters/:id' element={<Characters />} />
						<Route path='/comics/:id' element={<Comics />} />
						<Route path='/stories/:id' element={<Stories />} />
					</Routes>
				</div>
			</div>
		</Router>
	);
};

export default App;
