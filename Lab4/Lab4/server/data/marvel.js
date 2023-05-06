const axios = require('axios');
const md5 = require('blueimp-md5');
const publickey = '3921d75c74e884e542d23ba2a9e2e050';
const privatekey = 'b7a3b16dd3ff629dde2232b33f1326b11506b5f8';
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const charactersBaseUrl = 'https://gateway.marvel.com:443/v1/public/characters';
const charactersUrl = charactersBaseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
const comicsBaseUrl = 'https://gateway.marvel.com:443/v1/public/comics';
const comicsUrl = comicsBaseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
const storiesBaseUrl = 'https://gateway.marvel.com:443/v1/public/stories';
const storiessUrl = storiesBaseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;

/*
async function getAllCharacters(){
    const { charactersData } = await axios.get(charactersUrl);
    return charactersData;
}

async function getAllComics(){
    const { comicsData } = await axios.get(comicsUrl);
    return comicsData;
}

async function getAllStories(){
    const { storiesData } = await axios.get(storiessUrl);
    return storiesData;
}
*/

let exportedMethods = {
    async  getCharactersByPage(pagenum){
        const characterPageUrl = charactersBaseUrl + '?offset=' + (pagenum-1)*20 +'&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
        //const check = comicsUrl;
        const characterPage = await axios.get(characterPageUrl).catch((error) =>{
            //console.log(error.response.data);
            //console.log(error);
            throw error.response.data;
        });
        return characterPage;
    },

    async  getComicsPage(pagenum){
        const comicsPageUrl = comicsBaseUrl + '?offset=' + (pagenum-1)*20 +'&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
        //const check = comicsUrl;
        const comicsPage = await axios.get(comicsPageUrl).catch((error) =>{
            //console.log(error.response.data);
            //console.log(error);
            throw error.response.data;
        });
        return comicsPage;
    },

    async  getStoriesByPage(pagenum){
        const storiesPageUrl = storiesBaseUrl + '?offset=' + (pagenum-1)*20 +'&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
        //const check = comicsUrl;
        const storiesPage = await axios.get(storiesPageUrl).catch((error) =>{
            //console.log(error.response.data);
            //console.log(error);
            throw error.response.data;
        });
        return storiesPage;
    },
    
    async  getCharactersById(id){
        const oneCharacterUrl = charactersBaseUrl + '/' + id + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
        //const check = comicsUrl;
        const oneCharacter = await axios.get(oneCharacterUrl).catch((error) =>{
            throw '404 please enter the valid url';
        });
        return oneCharacter;
    },
    

    async  getComicsById(id){
        const oneComicsUrl = comicsBaseUrl + '/' + id + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
        const oneComics = await axios.get(oneComicsUrl).catch((error) =>{
            throw '404 please enter the valid url';
        });
        return oneComics;
    },

    async  getStoriesById(id){
        const oneStoriesUrl = storiesBaseUrl + '/' + id + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
        const oneStories = await axios.get(oneStoriesUrl).catch((error) =>{
            throw '404 please enter the valid url';
        });
        return oneStories;
    },

    async  getCharactersByName(name){
        const searchCharactersUrl = charactersBaseUrl + '?nameStartsWith=' + name + '&limit=100'  + '&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
        const searchCharacters = await axios.get(searchCharactersUrl).catch((error) =>{
            throw '404 please enter the valid url';
        });
        if(searchCharacters.data.data.results.length === 0){
            throw '404 please enter the valid url';
        }
        return searchCharacters;
    },

    async  getComicsByName(name){
        const searchComicsUrl = comicsBaseUrl + '?titleStartsWith=' + name + '&limit=100'  + '&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
        const searchComics = await axios.get(searchComicsUrl).catch((error) =>{
            throw '404 please enter the valid url';
        });
        if(searchComics.data.data.results.length === 0){
            throw '404 please enter the valid url';
        }
        return searchComics;
    },
/*
    async  getStoriesByName(name){
        const searchStoriesUrl = storiesBaseUrl + '?titleStartsWith=' + name + '&limit=100'  + '&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
        const searchStories = await axios.get(searchStoriesUrl).catch((error) =>{
            throw '404 please enter the valid url';
        });
        if(searchStories.data.data.results.length === 0){
            throw '404 please enter the valid url';
        }
        return searchStories;
    },
    */
}

module.exports = exportedMethods;