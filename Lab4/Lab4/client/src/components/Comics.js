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

const Comics = (props) => {
	const { id } = useParams();
	const [ comicsData, setComicsData ] = useState(undefined);
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
    const returnStoryId = (theStoryId) => {
        var storyId = theStoryId.substring(44);
        return storyId
    }
	useEffect(
		() => {
			console.log ("useEffect fired")
			async function fetchData() {
				try {
                    const { data } = await axios.get(`http://localhost:4000/api/comics/${id}`);
					setComicsData(data);
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
	/*
	let textObjects = null;
	const regex = /(<([^>]+)>)/gi;
	if (comicsData && comicsData.textObjects[0].text && comicsData.textObjects[0].text !== "") {
		textObjects = comicsData && comicsData.textObjects[0].text.replace(regex, '');
	} else {
		textObjects = 'No text';
	}
	*/
	if (loading) {
		return (
			<div>
				<h2>Loading....</h2>
			</div>
		);
	} else {
		if(comicsData !== "404 please enter the valid url"){
			return (
				<Card className={classes.card} variant='outlined'>
					<CardHeader className={classes.titleHead} title={comicsData.title} />
					<CardMedia
						className={classes.media}
						component='img'
						image={comicsData.thumbnail && comicsData.thumbnail.path && comicsData.thumbnail.extension ? comicsData.thumbnail.path + "." + comicsData.thumbnail.extension : noImage}
						title='comics image'
					/>
					<CardContent>
						<Typography variant='body2' color='textSecondary' component='span'>
							<dl>
								<p>
									<dt className='title'>Description:</dt>
									{comicsData && comicsData.description && comicsData.description !== "" ? <dd>{comicsData.description}</dd> : <dd>N/A</dd>}
								</p>
								<p>
									<dt className='title'>Modified:</dt>
									{comicsData && comicsData.modified && comicsData.modified !== "" ? <dd>{comicsData.modified.slice(0,10)}</dd> : <dd>N/A</dd>}
								</p>
								<p>
									<dt className='title'>ISBN:</dt>
									{comicsData && comicsData.isbn && comicsData.isbn !== "" ? <dd>{comicsData.isbn}</dd> : <dd>N/A</dd>}
								</p>
								<p>
									<dt className='title'>Format:</dt>
									{comicsData && comicsData.format && comicsData.format !== "" ? <dd>{comicsData.format}</dd> : <dd>N/A</dd>}
								</p>
								{/*
								<p>
									<dt className='title'>Text:</dt>
									<dd>{textObjects}</dd>
								</p>
								*/}
								<p>
									<dt className='title'>Text:</dt>
									{comicsData && comicsData.textObjects.length >=1 && comicsData.textObjects[0].text && comicsData.textObjects[0].text !== "" ? <dd>{comicsData.textObjects[0].text.replace( /(<([^>]+)>)/gi, '')}</dd> : <dd>N/A</dd>}
								</p>
	
								<p>
									<dt className='title'>Creators:</dt>
									{comicsData && comicsData.creators.items && comicsData.creators.items.length >= 1 ? (
										<span>
											<p>
												{comicsData.creators.items.map((creator) => {
													if (comicsData.creators.items.length > 1) return <dd key={creator}>{creator.name} - {creator.role} , </dd>;
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
									{comicsData && comicsData.characters.items && comicsData.characters.items.length >= 1 ? (
										<span>
											<p>
												{comicsData.characters.items.map((character) => {
													if (comicsData.characters.items.length > 1) return <a rel='noopener noreferrer' target='_blank' href={'/characters/' + returnCharactersId(character.resourceURI)}> {character.name} <br /></a>
													return <a rel='noopener noreferrer' target='_blank' href={'/characters/' + returnCharactersId(character.resourceURI)}> {character.name} <br /></a>
													
												})}
											</p>
										</span>
									) : (
										<dd>N/A</dd>
									)}
								</p>
								<p>
									<dt className='title'>Stories:</dt>
									{comicsData && comicsData.stories.items && comicsData.stories.items.length >= 1 ? (
										<span>
											<p>
												{comicsData.stories.items.map((story) => {
													if (comicsData.stories.items.length > 1) return <a rel='noopener noreferrer' target='_blank' href={'/stories/' + returnStoryId(story.resourceURI)}> {story.name} , <br /></a>
													return <a rel='noopener noreferrer' target='_blank' href={'/stories/' + returnStoryId(story.resourceURI)}> {story.name} <br /></a>
													
												})}
											</p>
										</span>
									) : (
										<dd>N/A</dd>
									)}
								</p>
							</dl>
							<Link to='/comics/page/1'>Back to all comics...</Link>
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

export default Comics;
