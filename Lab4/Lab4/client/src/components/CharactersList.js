import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import SearchCharacters from './Search';
import noImage from '../img/image_not_available.jpg';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography, makeStyles } from '@material-ui/core';

import '../App.css';

const useStyles = makeStyles({
	card: {
		maxWidth: 250,
		height: 'auto',
		marginLeft: 'auto',
		marginRight: 'auto',
		borderRadius: 5,
		border: '1px solid #1e8678',
		boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
	},
	titleHead: {
		color: '#1100ff',
		borderBottom: '1px solid #1100ff',
		fontWeight: 'bold'
	},
	grid: {
		flexGrow: 1,
		flexDirection: 'row'
	},
	media: {
		height: '100%',
		width: '100%'
	},
	button: {
		color: '#1e8678',
		fontWeight: 'bold',
		fontSize: 12
	}
});
const CharactersList = (props) => {
	const {page} = useParams();
	//const regex = /(<([^>]+)>)/gi;
	const classes = useStyles();
	const [ loading, setLoading ] = useState(true);
	const [ searchData, setSearchData ] = useState(undefined);
	const [ marvelData, setMarvelData ] = useState(undefined);
	const [ searchTerm, setSearchTerm ] = useState('');
	const [ pageValue, setPage ] = useState(parseInt(page));
	let card = null;

	useEffect(() =>{
		console.log('useEffect fired');
		async function fetchData(){
			try{
				const { data } = await axios.get('http://localhost:4000/api/characters/page/' + page);
				setMarvelData(data);
				setLoading(false);
			} catch(e){
				console.log(e);
			}
		}
		fetchData();
	},[page]);

	useEffect(
		() => {
			console.log('useEffect fired');
			async function fetchData() {
				try {
					console.log(`in fetch searchTerm: ${searchTerm}`);
					const { data } = await axios.get('http://localhost:4000/api/characters/search/' + searchTerm);
					setSearchData(data);
					setLoading(false);
				} catch (e) {
					console.log(e);
				}
			}
			if (searchTerm) {
				console.log ('searchTerm is set')
				fetchData();
			}
		},
		[ searchTerm ]
	);

	const searchValue = async (value) => {
		setSearchTerm(value);
	};
    
	const buildCard = (characters) => {
		return (
			<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={characters.id}>
				<Card className={classes.card} variant='outlined'>
					<CardActionArea>
						<Link to={`/characters/${characters.id}`}>
							<CardMedia
								className={classes.media}
								component='img'
								image={characters.thumbnail && characters.thumbnail.path && characters.thumbnail.extension ? characters.thumbnail.path + "." + characters.thumbnail.extension : noImage}
								title='characters image'
							/>
							<CardContent>
								<Typography className={classes.titleHead} gutterBottom variant='h6' component='h2'>
									{characters.name}
								</Typography>
							</CardContent>
						</Link>
					</CardActionArea>
				</Card>
			</Grid>
		);
	};
    
	if (searchTerm && searchData !== "404 please enter the valid url") {
		card =
			searchData &&
			searchData.map((characters) => {
				return buildCard(characters);
			});
	}else {
		card =
			marvelData &&
			marvelData.map((characters) => {
				return buildCard(characters);
			});
	}
    
	if (loading) {
		return (
			<div>
				{pageValue > 79 ? <h2>404 page number can not be greater than 79</h2>:
				pageValue < 1? <h2>404 page number can not be less than 1</h2>:
				pageValue >= 1 && page <= 79 ? <h2>Loading....</h2>:
				<h2>404 please enter the valid url</h2>}
			</div>
		);
	
	}else{
		if(pageValue >=1 && pageValue <= 79 && searchData === "404 please enter the valid url"){
			return(
				<div>
					<Link className='showlinkHistory' to='/characters/history'>Characters History</Link>
					<br />
					<br />
					<br />
					<SearchCharacters searchValue={searchValue} />
					<br />
					<p> No value with this search</p>
					<br />
					<br />
					<div>
						{pageValue >= 2 ? <Link className='prePage' to={`/characters/page/${parseInt(page)-1}`} onClick={() => setPage(pageValue - 1)} >Pre</Link> : undefined}
						<span>   page: {pageValue}   </span>
						{pageValue <= 78 ? <Link className='nextPage' to={`/characters/page/${parseInt(page)+1}`} onClick={() => setPage(pageValue + 1)} >Next</Link> : undefined}
						<br />
						<br />
						<br />
					</div>
					<Grid container className={classes.grid} spacing={5}>
						{card}
					</Grid>
				</div>
			)
		}
		else if(pageValue >=1 && pageValue <= 79 && searchData !== "404 please enter the valid url"){
			return(
				<div>
					<Link className='showlinkHistory' to='/characters/history'>Characters History</Link>
					<br />
					<br />
					<br />
					<SearchCharacters searchValue={searchValue} />
					<br />
					<br />
					<div>
						{pageValue >= 2 ? <Link className='prePage' to={`/characters/page/${parseInt(page)-1}`} onClick={() => setPage(pageValue - 1)} >Pre</Link> : undefined}
						<span>   page: {pageValue}   </span>
						{pageValue <= 78 ? <Link className='nextPage' to={`/characters/page/${parseInt(page)+1}`} onClick={() => setPage(pageValue + 1)} >Next</Link> : undefined}
						<br />
						<br />
						<br />
					</div>
					<Grid container className={classes.grid} spacing={5}>
						{card}
					</Grid>
				</div>
			)
		}
		else{
			return(
				<div>
					<h2>404 please enter the valid url</h2>
				</div>
			)
		}
	}
		
};
export default CharactersList;