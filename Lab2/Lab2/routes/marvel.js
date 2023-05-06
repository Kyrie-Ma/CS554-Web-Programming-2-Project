const express = require('express');
const router = express.Router();
const redis = require('redis');
const client = redis.createClient();
const axios = require('axios');
client.connect().then(() => {});
const marvelData = require("../data/marvel");
const flat = require("flat");
const unflatten = flat.unflatten;

router.get('/api/characters/history', async (req, res) => {
    try {
        let historyResult = (await client.LRANGE("history", 0, 19)).map(JSON.parse);
        res.json(historyResult);
    } catch (error) {
        res.status(404).json(error);
    }
});

router.get('/api/characters/:id', async (req, res) => {
    try {
        let exists = await client.exists(req.params.id+"character");
        if (exists) {
            //console.log('Results in cache');
            let searchResults = await client.get(req.params.id+"character");
            searchResults = JSON.parse(searchResults);
            await client.LPUSH("history", JSON.stringify(searchResults));
            res.json(searchResults);
        }
        else{
            //console.log('Results not in cache');
            let theResult = await marvelData.getCharactersById(req.params.id);
            let result = theResult.data.data.results[0];
            await client.set(req.params.id+"character", JSON.stringify(result));
            await client.LPUSH("history", JSON.stringify(result));
            res.json(result);
        }
    } catch (error) {
        res.status(404).json(error);
    }
});

router.get('/api/comics/:id', async (req, res) => {
    try {
        let exists = await client.exists(req.params.id+"comics");
        if (exists) {
            //console.log('Results in cache');
            let searchResults = await client.get(req.params.id+"comics");
            searchResults = JSON.parse(searchResults);
            res.json(searchResults);
        }
        else{
            //console.log('Results not in cache');
            let theResult = await marvelData.getComicsById(req.params.id);
            let result = theResult.data.data.results[0];
            await client.set(req.params.id+"comics", JSON.stringify(result));
            res.json(result);
        }
    } catch (error) {
        res.status(404).json(error);
    }
});

router.get('/api/stories/:id', async (req, res) => {
    try {
        let exists = await client.exists(req.params.id+"stories");
        if (exists) {
            //console.log('Results in cache');
            let searchResults = await client.get(req.params.id+"stories");
            searchResults = JSON.parse(searchResults);
            res.json(searchResults);
        }
        else{
            //console.log('Results not in cache');
            let theResult = await marvelData.getStoriesById(req.params.id);
            let result = theResult.data.data.results[0];
            await client.set(req.params.id+"stories", JSON.stringify(result));
            res.json(result);
        }
    } catch (error) {
        res.status(404).json(error);
    }
});

module.exports = router;