const express = require('express');
const router = express.Router();
const { getTopTracks, getFollowedArtists} = require('../services/spotify');

// router.get('/artists', async (req, res) => {

// })



router.get('/top-tracks', async (req, res) => {
    try {
        const response = await getTopTracks();
        if (!res) {
            return res.status(404).json({ error: 'No top tracks found' });
        }
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching top tracks:', error);
        res.status(500).json({ error: 'Failed to fetch top tracks' });
    }
})


router.get('/artists/following', async (req, res) => {
    try {
        const followedArtists = await getFollowedArtists();
        if (!followedArtists) {
            return res.status(404).json({ error: 'No followed artists found' });
        }
        res.status(200).json(followedArtists);
    } catch (error) {
        console.error('Error fetching artists:', error);
        res.status(500).json({ error: 'Failed to fetch artists' });
    }
})

module.exports = router;