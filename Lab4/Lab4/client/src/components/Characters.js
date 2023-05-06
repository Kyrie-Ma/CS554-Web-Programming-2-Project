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
	},
});

const Characters = (props) => {
	const { id } = useParams();
	//console.log(props);
	const [ characterData, setCharacterData ] = useState(undefined);
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
    const returnComicsId = (theComicsId) => {
        var comicsId = theComicsId.substring(43);
        return comicsId
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
					const { data } = await axios.get(`http://localhost:4000/api/characters/${id}`);
					setCharacterData(data);
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
				<h2>Loading....</h2>
			</div>
		);
	} else {
		if(characterData !== "404 please enter the valid url"){
			return (
				<Card className={classes.card} variant='outlined'>
					<CardHeader className={classes.titleHead} title={characterData.name} />
					<CardMedia
						className={classes.media}
						component='img'
						image={characterData.thumbnail && characterData.thumbnail.path && characterData.thumbnail.extension ? characterData.thumbnail.path + "." + characterData.thumbnail.extension : noImage}
						title='characters image'
					/>
					<CardContent>
						<Typography variant='body2' color='textSecondary' component='span'>
							<dl>
								<p>
									<dt className='title'>Description:</dt>
									{characterData && characterData.description && characterData.description !== "" ? <dd>{characterData.description}</dd> : <dd>N/A</dd>}
								</p>
								<p>
									<dt className='title'>Modified:</dt>
									{characterData && characterData.modified && characterData.modified !== "" ? <dd>{characterData.modified.slice(0,10)}</dd> : <dd>N/A</dd>}
								</p>
								<p>
									<dt className='title'>Comics:</dt>
									{characterData && characterData.comics.items && characterData.comics.items.length >= 1 ? (
										<span>
											<p>
												{characterData.comics.items.map((comi) => {
													if (characterData.comics.items.length > 1) return <a rel='noopener noreferrer' target='_blank' href={'/comics/' + returnComicsId(comi.resourceURI)}> {comi.name} <br /></a>
													return <a rel='noopener noreferrer' target='_blank' href={'/comics/' + returnComicsId(comi.resourceURI)}> {comi.name} <br /></a>
												})}
											</p>
										</span>
									) : (
										<dd>N/A</dd>
									)}
								</p>
	
								<p>
									<dt className='title'>Stories:</dt>
									{characterData && characterData.stories.items && characterData.stories.items.length >= 1 ? (
										<span>
											<p>
												{characterData.stories.items.map((story) => {
													if (characterData.stories.items.length > 1) return <a rel='noopener noreferrer' target='_blank' href={'/stories/' + returnStoryId(story.resourceURI)}> {story.name} <br /></a>
													return <a rel='noopener noreferrer' target='_blank' href={'/stories/' + returnStoryId(story.resourceURI)}> {story.name} <br /></a>
												})}
											</p>
										</span>
									) : (
										<dd>N/A</dd>
									)}
								</p>
							</dl>
							<Link className='showlinkHistory' to='/characters/page/1'>Back to all characters...</Link>
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

export default Characters;
