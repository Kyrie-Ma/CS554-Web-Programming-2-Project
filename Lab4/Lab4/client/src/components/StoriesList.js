import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
//import SearchShows from './SearchShows';
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
const StoriesList = (props) => {
	const { page } = useParams();
	//const regex = /(<([^>]+)>)/gi;
	const classes = useStyles();
	const [ loading, setLoading ] = useState(true);
	//const [ searchData, setSearchData ] = useState(undefined);
	const [ marvelData, setMarvelData ] = useState(undefined);
	//const [ searchTerm, setSearchTerm ] = useState('');
	const [ pageValue, setPage ] = useState(parseInt(page));
	let card = null;
 	/*
	useEffect(() => {
		console.log('on load useeffect');
		async function fetchData() {
			try {
				const { data } = await axios.get('http://api.tvmaze.com/shows');
				setShowsData(data);
				setLoading(false);
			} catch (e) {
				console.log(e);
			}
		}
		fetchData();
	}, []);
	*/
	useEffect(() =>{
		console.log('pageSearch useEffect fired');
		async function fetchData(){
			try{
				const { data } = await axios.get('http://localhost:4000/api/stories/page/' + page);
				setMarvelData(data);
				setLoading(false);
			} catch(e){
				console.log(e);
			}
		}
		fetchData();
	},[page]);
/*
	useEffect(
		() => {
			console.log('search useEffect fired');
			async function fetchData() {
				try {
					console.log(`in fetch searchTerm: ${searchTerm}`);
					const { data } = await axios.get('http://api.tvmaze.com/search/shows?q=' + searchTerm);
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
*/
/*
	const searchValue = async (value) => {
		setSearchTerm(value);
	};
    */
	const buildCard = (stories) => {
		return (
			<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={stories.id}>
				<Card className={classes.card} variant='outlined'>
					<CardActionArea>
						<Link to={`/stories/${stories.id}`}>
							<CardMedia
								className={classes.media}
								component='img'
								image={stories.thumbnail && stories.thumbnail.path && stories.thumbnail.extension ? stories.thumbnail.path + "." + stories.thumbnail.extension : noImage}
								title='stories image'
							/>

							<CardContent>
								<Typography className={classes.titleHead} gutterBottom variant='h6' component='h2'>
									{stories.title}
								</Typography>
                                {/*
								<Typography variant='body2' color='textSecondary' component='p'>
									{show.summary ? show.summary.replace(regex, '').substring(0, 139) + '...' : 'No Summary'}
									<span>More Info</span>
								</Typography>
                                */}
							</CardContent>
						</Link>
					</CardActionArea>
				</Card>
			</Grid>
		);
	};
    /*
	if (searchTerm) {
		card =
			searchData &&
			searchData.map((shows) => {
				let { show } = shows;
				return buildCard(show);
			});
	} else {
		card =
			showsData &&
			showsData.map((show) => {
				return buildCard(show);
			});
	}
    */
    card =
        marvelData &&
        marvelData.map((stories) => {
        return buildCard(stories);
        });

	if (loading) {
		return (
			<div>
				{pageValue > 6147 ? <h2>404 page number can not be greater than 6146</h2>:
				pageValue < 1 ? <h2>404 page number can not be less than 1</h2>:
				pageValue >= 1 && pageValue <= 6147 ? <h2>Loading....</h2>:
				<h2>404 please enter the valid url</h2>}
			</div>
		);
	
	/*
	if (loading) {
		return (
			
			<div>
				<h2>Loading....</h2>
			</div>
		);
	
	} else {
		return (
			<div>
				<SearchShows searchValue={searchValue} />
				<br />
				<br />
				<Grid container className={classes.grid} spacing={5}>
					{card}
				</Grid>
			</div>
		);
	}
};
*/
	}else{
		if(pageValue >= 1 && pageValue <= 6147){
			return(
				<div>
					{/*
					<SearchShows searchValue={searchValue} />
					*/}
					<br />
					<br />
					{/*
					{searchTerm === '' ?
					*/}
						<div>
							{pageValue >= 2 ? <Link className='prePage' to={`/stories/page/${pageValue-1}`} onClick={() => setPage(pageValue - 1)} >Pre</Link> : undefined}
							<span>   page: {pageValue}   </span>
							{pageValue <= 6146 ? <Link className='nextPage' to={`/stories/page/${pageValue+1}`} onClick={() => setPage(pageValue + 1)} >Next</Link> : undefined}
							<br />
							<br />
							<br />
						</div>
						{/*
							:
						undefined
					}
					*/}
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
export default StoriesList;