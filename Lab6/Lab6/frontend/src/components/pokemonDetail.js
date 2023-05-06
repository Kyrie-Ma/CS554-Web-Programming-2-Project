import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography, makeStyles, CardHeader,box, } from '@material-ui/core';

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

const PokemonDetail = (props) => {
    const classes = useStyles();
    const id = useParams().id;
    const [pokemonDetail, setPokemonDetail] = useState(undefined);
    const [ loading, setLoading ] = useState(true);
    useEffect(() => {
        console.log ("useEffect fired")
        async function fetchData() {
          try {
            const { data } = await axios.get('http://localhost:4000/pokemon/' + id);
            setPokemonDetail(data);
            setLoading(false);
          } catch (e) {
            console.log(e);
          }
        }
    
        fetchData();
    
      }, [id]);

    if (loading) {
		return (
			<div>
                {pokemonDetail !== "404 error: Pokemon does not exist" ? <h2>404 error: Pokemon does not exist.</h2>:
				<h2>Loading....</h2>}
			</div>
		);
    } else {
        if(pokemonDetail !== "404 error: Pokemon does not exist"){
            return(
                <div>
                    <h1>{pokemonDetail.name}</h1>
                    <img src={pokemonDetail.sprites.other['official-artwork'].front_default} alt='pokemonPicture'></img>
                    <br/>
                    <h2 className='title'>Type:</h2>
                    <span>
                        <div>
                            {
                                pokemonDetail.types.map((pokemonType) =>{
                                    return <h2>{pokemonType.type.name}</h2>
                                })   
                            }
                        </div>
                    </span>
                </div>
            )
        }
        else{
			return(
				<h2>404 error: Pokemon does not exist.</h2>
			);
		}
    }
};


export default PokemonDetail;