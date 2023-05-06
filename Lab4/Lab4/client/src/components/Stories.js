import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import noImage from '../img/image_not_available.jpg';
import { makeStyles, Card, CardContent, CardMedia, Typography, CardHeader } from '@material-ui/core';
import '../App.css';
const useStyles = makeStyles({
	card: {
		maxWidth: 550,
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

const Stories = (props) => {
    const { id } = useParams();
	const [ storiesData, setStoriesData ] = useState(undefined);
	const [ loading, setLoading ] = useState(true);
	const classes = useStyles();
    /*
	const tConvert = (time) => {
		// Check correct time format and split into components
		time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [ time ];

		if (time.length > 1) {
			// If time format correct
			time = time.slice(1); // Remove full string match value
			time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
			time[0] = +time[0] % 12 || 12; // Adjust hours
		}
		return time.join(''); // return adjusted time or original string
	};
	const formatDate = (characterData) => {
		var year = characterData.substring(0, 4);
		var month = characterData.substring(5, 7);
		var day = characterData.substring(8, 10);
		return month + '/' + day + '/' + year;
	};
    */
    const returnCharactersId = (theCharactersId) => {
        var charactersId = theCharactersId.substring(47);
        return charactersId
    }
    const returnComicsId = (theComicsId) => {
        var comicsId = theComicsId.substring(43);
        return comicsId
    }
	useEffect(
		() => {
			console.log ("useEffect fired")
			async function fetchData() {
				try {
                    const { data } = await axios.get(`http://localhost:4000/api/stories/${id}`);
					setStoriesData(data);
					setLoading(false);
					//console.log(data);
				} catch (e) {
					console.log(e);
				}
			}
			fetchData();
		},
		[ id ]
	);

	if (loading) {
		return (
			<div>
				{storiesData !== undefined ? <h2>Loding....</h2>:<h2>404 please enter the valid url</h2>}
			</div>
		);
	} else {
		if(storiesData !== "404 please enter the valid url"){
			return (
				<Card className={classes.card} variant='outlined'>
					<CardHeader className={classes.titleHead} title={storiesData.title} />
					<CardMedia
						className={classes.media}
						component='img'
						image={storiesData.thumbnail && storiesData.thumbnail.path && storiesData.thumbnail.extension ? storiesData.thumbnail.path + "." + storiesData.thumbnail.extension : noImage}
						title='stories image'
					/>
					<CardContent>
						<Typography variant='body2' color='textSecondary' component='span'>
							<dl>
								<p>
									<dt className='title'>Description:</dt>
									{storiesData && storiesData.description && storiesData.description !== "" ? <dd>{storiesData.description}</dd> : <dd>N/A</dd>}
								</p>
								<p>
									<dt className='title'>Modified:</dt>
									{storiesData && storiesData.modified && storiesData.modified !== "" ? <dd>{storiesData.modified.slice(0,10)}</dd> : <dd>N/A</dd>}
								</p>
								<p>
									<dt className='title'>Type:</dt>
									{storiesData && storiesData.type && storiesData.type !== "" ? <dd>{storiesData.type}</dd> : <dd>N/A</dd>}
								</p>
								<p>
									<dt className='title'>Creators:</dt>
									{storiesData && storiesData.creators.items && storiesData.creators.items.length >= 1 ? (
										<span>
											<p>
												{storiesData.creators.items.map((creator) => {
													if (storiesData.creators.items.length > 1) return <dd key={creator}>{creator.name} - {creator.role} , </dd>;
													return <dd key={creator}>{creator.name}, </dd>;
												})}
											</p>
										</span>
									) : (
										<dd>N/A</dd>
									)}
								</p>
								<p>
									<dt className='title'>Characters:</dt>
									{storiesData && storiesData.characters.items && storiesData.characters.items.length >= 1 ? (
										<span>
											<p>
												{storiesData.characters.items.map((character) => {
													if (storiesData.characters.items.length > 1) return <a rel='noopener noreferrer' target='_blank' href={'/characters/' + returnCharactersId(character.resourceURI)}> {character.name} <br /></a>
													return <a rel='noopener noreferrer' target='_blank' href={'/characters/' + returnCharactersId(character.resourceURI)}> {character.name} <br /></a>
													
												})}
											</p>
										</span>
									) : (
										<dd>N/A</dd>
									)}
								</p>
								<p>
									<dt className='title'>Comics:</dt>
									{storiesData && storiesData.comics.items && storiesData.comics.items.length >= 1 ? (
										<span>
											<p>
												{storiesData.comics.items.map((comi) => {
													if (storiesData.comics.items.length > 1) return <a rel='noopener noreferrer' target='_blank' href={'/comics/' + returnComicsId(comi.resourceURI)}> {comi.name} <br /></a>
													return <a rel='noopener noreferrer' target='_blank' href={'/comics/' + returnComicsId(comi.resourceURI)}> {comi.name} <br /></a>
												})}
											</p>
										</span>
									) : (
										<dd>N/A</dd>
									)}
								</p>
							</dl>
							<Link to='/stories/page/1'>Back to all stories...</Link>
						</Typography>
					</CardContent>
				</Card>
			);
		}
		else{
			return(
				<h2>404 please enter the valid url</h2>
			);
		}
		
	}
};

export default Stories;
