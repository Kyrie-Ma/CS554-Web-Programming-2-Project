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
async function getCharacters(){
    const { charactersData } = await axios.get(charactersUrl);
    return charactersData;
}

async function getComics(){
    const { comicsData } = await axios.get(comicsUrl);
    return comicsData;
}

async function getStories(){
    const { storiesData } = await axios.get(storiessUrl);
    return storiesData;
}
*/

let exportedMethods = {
    async  getCharactersById(id){
        const oneCharacterUrl = charactersBaseUrl + '/' + id + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
        const oneCharacter = await axios.get(oneCharacterUrl).catch((error) =>{
            throw `Did not found the character with id ${id}`;
        });
        return oneCharacter;
    },

    async  getComicsById(id){
        const oneComicsUrl = comicsBaseUrl + '/' + id + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
        const oneComics = await axios.get(oneComicsUrl).catch((error) =>{
            throw `Did not found the comics with id ${id}`;
        });
        return oneComics;
    },

    async  getStoriesById(id){
        const oneStoriesUrl = storiesBaseUrl + '/' + id + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
        const oneStories = await axios.get(oneStoriesUrl).catch((error) =>{
            throw `Did not found the stories with id ${id}`;
        });
        return oneStories;
    },
}

module.exports = exportedMethods;