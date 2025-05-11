const { fetchWebApi } = require('../utils');

async function getTopTracks(){
  return (await fetchWebApi(
    'me/top/tracks?time_range=long_term&limit=10', 'GET'
  )).items;
}

async function getFollowedArtists(){
    try {
        const artists = await fetchWebApi(
            'me/following?type=artist', 'GET'
        );
        console.log(artists);
        return artists.artists.items.map(artist => ({
            name: artist.name,
            id: artist.id,
            images: artist.images,
            genres: artist.genres,
            popularity: artist.popularity
        }));
    } catch (error) {
        throw error;
    }
}   

// const topTracks = await getTopTracks();
// console.log(
//   topTracks?.map(
//     ({name, artists}) =>
//       `${name} by ${artists.map(artist => artist.name).join(', ')}`
//   )
// );

module.exports = {
  getTopTracks,
    getFollowedArtists
};