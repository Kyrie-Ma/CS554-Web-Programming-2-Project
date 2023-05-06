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

router.get('/api/characters/page/:pagenum', async (req, res) => {
    try {
        let exists = await client.exists(req.params.pagenum+"charactersPage");
        if (exists) {
            //console.log('Results in cache1');
            let searchResults = await client.get(req.params.pagenum+"charactersPage");
            searchResults = JSON.parse(searchResults);
            //await client.LPUSH("history", JSON.stringify(searchResults));
            res.json(searchResults);
        }
        else{
            //console.log('Results not in cache1');
            let theResult = await marvelData.getCharactersByPage(req.params.pagenum);
            let result = theResult.data.data.results;
            /*
            if(result == []){
                res.status(404).json("error: no data in this page");
            }
            */
            await client.set(req.params.pagenum+"charactersPage", JSON.stringify(result));
            //await client.LPUSH("history", JSON.stringify(result));
            res.json(result);
        }
    } catch (error) {
        console.log('Results not in cache');
        await client.set(req.params.pagenum+"charactersPage", JSON.stringify(error));
        res.status(404).json(error);
    }
});

router.get('/api/comics/page/:pagenum', async (req, res) => {
    try {
        let exists = await client.exists(req.params.pagenum+"comicsPage");
        if (exists) {
            //console.log('Results in cache1');
            let searchResults = await client.get(req.params.pagenum+"comicsPage");
            searchResults = JSON.parse(searchResults);
            res.json(searchResults);
        }
        else{
            //console.log('Results not in cache1');
            let theResult = await marvelData.getComicsPage(req.params.pagenum);
            let result = theResult.data.data.results;
            /*
            if(result == []){
                res.status(404).json("error: no data in this page");
            }
            */
            await client.set(req.params.pagenum+"comicsPage", JSON.stringify(result));
            res.json(result);
        }
    } catch (error) {
        //console.log('Results not in cache');
        await client.set(req.params.pagenum+"comicsPage", JSON.stringify(error));
        res.status(404).json(error);
    }
});

router.get('/api/stories/page/:pagenum', async (req, res) => {
    try {
        let exists = await client.exists(req.params.pagenum+"storiesPage");
        if (exists) {
            //console.log('Results in cache1');
            let searchResults = await client.get(req.params.pagenum+"storiesPage");
            searchResults = JSON.parse(searchResults);
            res.json(searchResults);
        }
        else{
            //console.log('Results not in cache1');
            let theResult = await marvelData.getStoriesByPage(req.params.pagenum);
            let result = theResult.data.data.results;
            /*
            if(result == []){
                res.status(404).json("error: no data in this page");
            }
            */
            await client.set(req.params.pagenum+"storiesPage", JSON.stringify(result));
            res.json(result);
        }
    } catch (error) {
        //console.log('Results not in cache');
        await client.set(req.params.pagenum+"storiesPage", JSON.stringify(error));
        res.status(404).json(error);
    }
});

router.get('/api/characters/:id', async (req, res) => {
    try {
        if(req.params.id !== "history"){
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
        }
        
    } catch (error) {
        //console.log('Results not in cache');
        //await client.set(req.params.id+"character", JSON.stringify(error));
        //res.status(404).json(error);
        res.json(error);
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
        //await client.set(req.params.id+"comics", JSON.stringify(error));
        //res.status(404).json(error);
        res.json(error);
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
        //await client.set(req.params.id+"stories", JSON.stringify(error));
        //res.status(404).json(error);
        res.json(error);
    }
});


router.get('/api/characters/search/:nameC', async (req, res) => {
    try {
        let exists = await client.exists(req.params.nameC+"characters");
        if (exists) {
            //console.log('Results in cache');
            let searchResults = await client.get(req.params.nameC+"characters");
            searchResults = JSON.parse(searchResults);
            res.json(searchResults);
        }
        else{
            //console.log('Results not in cache');
            let theResult = await marvelData.getCharactersByName(req.params.nameC);
            let result = theResult.data.data.results;
            await client.set(req.params.nameC+"characters", JSON.stringify(result));
            res.json(result);
        }
    } catch (error) {
        //await client.set(req.params.id+"stories", JSON.stringify(error));
        //res.status(404).json(error);
        //console.log(error);
        res.json(error);
    }
});

router.get('/api/comics/search/:nameC', async (req, res) => {
    try {
        let exists = await client.exists(req.params.nameC+"comics");
        if (exists) {
            //console.log('Results in cache');
            let searchResults = await client.get(req.params.nameC+"comics");
            searchResults = JSON.parse(searchResults);
            res.json(searchResults);
        }
        else{
            //console.log('Results not in cache');
            let theResult = await marvelData.getComicsByName(req.params.nameC);
            let result = theResult.data.data.results;
            await client.set(req.params.nameC+"comics", JSON.stringify(result));
            res.json(result);
        }
    } catch (error) {
        //await client.set(req.params.id+"stories", JSON.stringify(error));
        //res.status(404).json(error);
        //console.log(error);
        res.json(error);
    }
});
/*
router.get('/api/stories/search/:nameC', async (req, res) => {
    try {
        let exists = await client.exists(req.params.nameC+"stories");
        if (exists) {
            //console.log('Results in cache');
            let searchResults = await client.get(req.params.nameC+"stories");
            searchResults = JSON.parse(searchResults);
            res.json(searchResults);
        }
        else{
            //console.log('Results not in cache');
            let theResult = await marvelData.getStoriesByName(req.params.nameC);
            let result = theResult.data.data.results;
            await client.set(req.params.nameC+"stories", JSON.stringify(result));
            res.json(result);
        }
    } catch (error) {
        //await client.set(req.params.id+"stories", JSON.stringify(error));
        //res.status(404).json(error);
        //console.log(error);
        res.json(error);
    }
});
*/
module.exports = router;