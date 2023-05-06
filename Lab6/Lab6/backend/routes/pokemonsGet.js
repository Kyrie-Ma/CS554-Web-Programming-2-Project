const express = require('express');
const router = express.Router();
const redis = require('redis');
const client = redis.createClient();
const axios = require('axios');
client.connect().then(() => {});
const pokemonsData = require("../data/pokemons");
const flat = require("flat");
const unflatten = flat.unflatten;

router.get('/pokemon/page/:pagenum', async (req, res) => {
    try {
        let exists = await client.exists(req.params.pagenum+"pokemonPage");
        if (exists) {
            //console.log('Results in cache');
            let searchResults = await client.get(req.params.pagenum+"pokemonPage");
            searchResults = JSON.parse(searchResults);
            await client.LPUSH("history", JSON.stringify(searchResults));
            res.json(searchResults);
        }
        else{
            //console.log('Results not in cache');
            let theResult = await pokemonsData.getPokemonByPage(req.params.pagenum);
            let result = theResult.data.results;
            await client.set(req.params.pagenum+"pokemonPage", JSON.stringify(result));
            await client.LPUSH("history", JSON.stringify(result));
            res.json(result);
        }
    } catch (error) {
        res.status(404).json(error);
    }
});

router.get('/pokemon/:id', async (req, res) => {
    try {
        let exists = await client.exists(req.params.id+"pokemonID");
        if (exists) {
            //console.log('Results in cache');
            let searchResults = await client.get(req.params.id+"pokemonID");
            searchResults = JSON.parse(searchResults);
            await client.LPUSH("history", JSON.stringify(searchResults));
            res.json(searchResults);
        }
        else{
            //console.log('Results not in cache');
            let theResult = await pokemonsData.getPokemonByID(req.params.id);
            let result = theResult.data;
            await client.set(req.params.id+"pokemonID", JSON.stringify(result));
            await client.LPUSH("history", JSON.stringify(result));
            res.json(result);
        }
    } catch (error) {
        res.status(404).json(error);
    }
});

module.exports = router;