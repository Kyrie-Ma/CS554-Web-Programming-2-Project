import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import noImage from '../img/image_not_available.jpg';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography, makeStyles } from '@material-ui/core';

import '../App.css';
const useStyles111 = makeStyles({
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
		borderBottom: '1px solid #1e8678',
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
const CharactersHistory = () => {
	//const regex = /(<([^>]+)>)/gi;
	const classes111 = useStyles111();
	const [ loading, setLoading ] = useState(true);
    const [ historyData, setHistoryData ] = useState(undefined);
	let card = null;

	useEffect(() =>{
		console.log('useEffect fired');
		async function fetchData(){
			try{
				const { data } = await axios.get('http://localhost:4000/api/characters/history');
				setHistoryData(data);
				setLoading(false);
			} catch(e){
				console.log(e);
			}
		}
		fetchData();
	},[]);

	const buildCard111 = (characters111) => {
		
		return (
			<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={characters111.id}>
				<Card className={classes111.card} variant='outlined'>
					<CardActionArea>
						<Link to={`/characters/${characters111.id}`}>
							<CardMedia
								className={classes111.media}
								component='img'
								image={characters111.thumbnail && characters111.thumbnail.path && characters111.thumbnail.extension ? characters111.thumbnail.path + "." + characters111.thumbnail.extension : noImage}
								title='characters image'
							/>
							<CardContent>
								<Typography className={classes111.titleHead} gutterBottom variant='h6' component='h3'>
									{characters111.name}
								</Typography>
							</CardContent>
						</Link>
					</CardActionArea>
				</Card>
			</Grid>
		);
	};

    card =
        historyData &&
        historyData.map((characters111) => {
        	return buildCard111(characters111);
        });

	if (loading) {
		return (
			<div>
				Loading...
			</div>
		);
	
	}else{
		return(
			<div>
				<br />
				<br />
				<Grid container className={classes111.grid} spacing={5}>
					{card}
				</Grid>
			</div>
		)
	}
};
export default CharactersHistory;