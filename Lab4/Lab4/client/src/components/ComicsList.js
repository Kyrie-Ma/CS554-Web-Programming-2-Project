import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import SearchComics from './Search';
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
const ComicsList = (props) => {
	const { page } = useParams();
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
				const { data } = await axios.get('http://localhost:4000/api/comics/page/' + page);
				setMarvelData(data);
				setLoading(false);
			} catch(e){
				//console.log(page);
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
					const { data } = await axios.get('http://localhost:4000/api/comics/search/' + searchTerm);
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
    
	const buildCard = (comics) => {
		return (
			<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={comics.id}>
				<Card className={classes.card} variant='outlined'>
					<CardActionArea>
						<Link to={`/comics/${comics.id}`}>
							<CardMedia
								className={classes.media}
								component='img'
								image={comics.thumbnail && comics.thumbnail.path && comics.thumbnail.extension ? comics.thumbnail.path + "." + comics.thumbnail.extension : noImage}
								title='comics image'
							/>
							<CardContent>
								<Typography className={classes.titleHead} gutterBottom variant='h6' component='h2'>
									{comics.title}
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
			searchData.map((comics) => {
				return buildCard(comics);
			});
	} else {
		card =
		marvelData &&
		marvelData.map((comics) => {
				return buildCard(comics);
			});
	}

	if (loading) {
		return (
			<div>
				{pageValue > 2669 ? <h2>404 page number can not be greater than 2668</h2>:
				pageValue <= 0? <h2>404 page number can not be less than 1</h2>:
				pageValue >= 1 && pageValue <= 2669 ? <h2>Loading....</h2>:
				<h2>404 please enter the valid url</h2>}
			</div>
		);
	
	}else{
		if(pageValue >= 1 && pageValue <= 2669 && searchData === "404 please enter the valid url"){
			return(
				<div>
					<br />
					<br />
					<br />
					<SearchComics searchValue={searchValue} />
					<br />
					<p> No value with this search</p>
					<br />
					<br />
					<div>
						{pageValue >= 2 ? <Link className='prePage' to={`/comics/page/${pageValue-1}`} onClick={() => setPage(pageValue - 1)} >Pre</Link> : undefined}
						<span>   page: {page}   </span>
						{pageValue <= 2668 ? <Link className='nextPage' to={`/comics/page/${pageValue+1}`} onClick={() => setPage(pageValue + 1)} >Next</Link> : undefined}
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
		if(pageValue >= 1 && pageValue <= 2669 && searchData !== "404 please enter the valid url"){
			return(
				<div>
					<br />
					<br />
					<br />
					<SearchComics searchValue={searchValue} />
					<br />
					<br />
					<div>
						{pageValue >= 2 ? <Link className='prePage' to={`/comics/page/${pageValue-1}`} onClick={() => setPage(pageValue - 1)} >Pre</Link> : undefined}
						<span>   page: {page}   </span>
						{pageValue <= 2668 ? <Link className='nextPage' to={`/comics/page/${pageValue+1}`} onClick={() => setPage(pageValue + 1)} >Next</Link> : undefined}
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
export default ComicsList;