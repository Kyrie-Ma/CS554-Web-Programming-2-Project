//import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import { Link, useParams } from 'react-router-dom';
//import SearchShows from './SearchShows';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography, makeStyles, CardHeader,Box, Button,TextField} from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import TrainersContext from './trainersContext';
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

const TrainerList = (props) => {
    const [currentTrainer, setCurrentTrainer, allTrainersGroup, setAllTrainersGroup] = useContext(TrainersContext);
    const classes = useStyles();
    return(
        <Grid >
            <Card variant='outlined'>
                <CardActionArea>
                    <h1>Trainers:</h1>
                    <TextField id="trainer" label="trainer" variant="outlined" />
                    <form  className='form' id='add-trainer'
                        onSubmit={(e) => {
                            e.preventDefault();
                            const trainerName = document.getElementById('trainer').value.trim();
                            if (trainerName === "") {
                                alert("input should not be empty!");
                                return;
                            }
                            setAllTrainersGroup({ ...allTrainersGroup, [trainerName]: [] });
                        }}
                    >
                        <button className='button' type='submit'>
                            Create
                        </button>
                    </form>
                </CardActionArea>
                {
                    Object.keys(allTrainersGroup).map((name) => {
                        return(
                            <Grid container key={name}>
                                <Grid container>
                                <Typography gutterBottom variant='h6' component='h2'>Pokemon trainer: {name} 
                                {
                                    currentTrainer!==name? <button onClick={()=>{setCurrentTrainer(name)}}>Select Trainer</button> : <p> Has been select Selected</p>
                                }
                                <button onClick={()=>{
                                    if(currentTrainer===name){
                                        setCurrentTrainer("");
                                    }
                                    const temp = {...allTrainersGroup};
                                    delete temp[name];
                                    setAllTrainersGroup(temp);
                                }}>Delete Trainer</button>
                                </Typography>
                                </Grid>
                                {allTrainersGroup[name].map((element)=>{
                                    return(
                                        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                                            <Card>
                                                <CardActionArea>
                                                    <Link to={`/pokemon/${element.id}`}>
                                                        <CardMedia 
                                                            className={classes.media}
                                                            component='img'
                                                            image={element.img}
                                                            title='pokemon image'
                                                        />
                                                        <CardContent>
                                                            <Typography className={classes.titleHead} gutterBottom variant='h6' component='h3'>
									                            {element.name}
								                            </Typography>
                                                        </CardContent>
                                                    </Link>
                                                </CardActionArea>
                                                <CardActionArea>
                                                    <button onClick={()=>{ 
                                                        setAllTrainersGroup({ ...allTrainersGroup, [name]: [...allTrainersGroup[name]].filter((element2) => {return element2.id !== element.id }) });
                                                    }}>Release Pokemon</button>
                                                </CardActionArea>
                                            </Card>
                                        </Grid>
                                    );
                                    }
                                )}
                                <br/>
                                <br/>
                                <br/>
                                <br/>
                                <br/>
                            </Grid>
                        );
                    })
                }
            </Card>
        </Grid>
    )
};
export default TrainerList;