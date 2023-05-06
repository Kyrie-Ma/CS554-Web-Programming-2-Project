const axios = require('axios');
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let exportedMethods = {
    async getPokemonByPage(pagenum){
        pagenum = parseInt(pagenum);
        const pokemonPageUrl = "https://pokeapi.co/api/v2/pokemon/?limit=20&offset=" + (pagenum-1)*20;
        const pokemonByPage = await axios.get(pokemonPageUrl).catch((error) =>{
            //console.log(error.response.data);
            //console.log(error);
            throw "404 error: no pokemon in this page";
        });
        const pokemonData = pokemonByPage;
        pokemonData.data.results = pokemonData.data.results.map(element => {
            element.url = element.url.slice(0, -1);
            const id = element.url.slice(element.url.lastIndexOf('/') + 1, element.url.length);
            element.img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
            return { id: id, ...element };
        });
        return pokemonData;
    },

    async getPokemonByID(Id){
        const pokemonIdUrl = "https://pokeapi.co/api/v2/pokemon/" + Id;
        Id = parseInt(Id);
        const pokemonById = await axios.get(pokemonIdUrl).catch((error) =>{
            //console.log(error.response.data);
            //console.log(error);
            throw "404 error: Pokemon does not exist";
        });
        return pokemonById;
    },
}

module.exports = exportedMethods;