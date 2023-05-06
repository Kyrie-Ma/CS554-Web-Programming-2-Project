import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography, makeStyles } from '@material-ui/core';
import '../App.css';
import TrainersContext from './trainersContext';

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

const PokemonList = (props) => {
    const page = useParams().pagenum;
    const classes = useStyles();
    const [ loading, setLoading ] = useState(true);
	const [ pokemonData, setPokemonData ] = useState(undefined);
	const [ pageValue, setPage ] = useState(parseInt(page));
    const [currentTrainer, setCurrentTrainer, allTrainersGroup, setAllTrainersGroup] = useContext(TrainersContext);
    let card = null;
	useEffect(() =>{
		console.log('useEffect fired');
		async function fetchData(){
			try{
				const { data } = await axios.get('http://localhost:4000/pokemon/page/' + page);
				setPokemonData(data);
				setLoading(false);
			} catch(e){
				console.log(e);
			}
		}
		fetchData();
	},[page]);
    const buildCard = (pokemon) => {
        return(
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={pokemon.id}>
                <Card className={classes.card} variant='outlined'>
					<CardActionArea>
						<Link to={`/pokemon/${pokemon.id}`}>
							<CardMedia
								className={classes.media}
								component='img'
								image={pokemon.img}
								title='pokemon image'
							/>
							<CardContent>
								<Typography className={classes.titleHead} gutterBottom variant='h6' component='h2'>
									{pokemon.name}
								</Typography>
							</CardContent>
						</Link>
                        <CardActionArea>
                        {
                            currentTrainer === "" ? "Please choose a trainer first" :
                            (
                                allTrainersGroup[currentTrainer].map(item => item.id).includes(pokemon.id) ?
                                    <button onClick={() => { 
                                        setAllTrainersGroup({ ...allTrainersGroup, [currentTrainer]: [...allTrainersGroup[currentTrainer]].filter((element) => { return element.id !== pokemon.id }) });
                                    }}>Release pokemon</button>
                                    :
                                    <button onClick={() => { 
                                    if (allTrainersGroup[currentTrainer].length === 6) {
                                        alert("One trainer only has 6 pokemon at most!");
                                        return;
                                    }
                                    setAllTrainersGroup({ ...allTrainersGroup, [currentTrainer]: [...allTrainersGroup[currentTrainer], pokemon] }); 
                                }}>Catch Pokemon</button>
                            )
                        }
                        </CardActionArea>
					</CardActionArea>
				</Card>
            </Grid>
        )
    };
    card =
        pokemonData &&
        pokemonData.map((pokemon) => {
			return buildCard(pokemon);
	});
    if (loading) {
		return (
			<div>
				{pageValue > 58 ? <h2>404 page number can not be greater than 58</h2>:
				pageValue < 1? <h2>404 page number can not be less than 1</h2>:
				pageValue >= 1 && page <= 58 ? <h2>Loading....</h2>:
				<h2>404 please enter the valid url</h2>}
			</div>
		);
    }else{
        if(pageValue >=1 && pageValue <= 58){
            return(
                <div>
					{pageValue >= 2 ? <Link className='prePage' to={`/pokemon/page/${parseInt(page)-1}`} onClick={() => setPage(pageValue - 1)} >Pre</Link> : undefined}
					<span>   page: {pageValue}   </span>
					{pageValue <= 57 ? <Link className='nextPage' to={`/pokemon/page/${parseInt(page)+1}`} onClick={() => setPage(pageValue + 1)} >Next</Link> : undefined}
					<br />
					<br />
					<br />
					<div>
				        <Grid container className={classes.grid} spacing={5}>
						    {card}
					    </Grid>
                    </div>
                </div>
            )
        }else{
			return(
				<div>
					<h2>404 error: no pokemon in this page</h2>
				</div>
			)
		}
    }
};


export default PokemonList;