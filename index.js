const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// convert incoming data into json
app.use(bodyParser.json());

// in memory data store
const users = [];
const playlists = [];

// create new users
app.post('/users', (req, res) => {
    // untuk nanti dimasukkan ke body
    const { username, email } = req.body;
    if (!username || !email) {
        return res.status(400).json({error: "Username and Email are required"});
    }
    const newUser = {id: users.length + 1, username, email};
    users.push(newUser);
    res.status(201).json(newUser)
})

// create new playlist 
app.post('/playlists', (req, res) => {
    const { userId, name} = req.body;
    if (!userId || !name) {
        return res.status(400).json({error: "UserId and Name are required"});
    }

    // find user id first
    const user = users.find((user) => user.id === parseInt(userId));
    if (!user) {
        return res.status(404).json({error: "Users not found"});
    }

    // create new playlist 
    const newPlaylist = { id: playlists.length + 1, userId, name };
    playlists.push(newPlaylist);
    res.status(201).json(newPlaylist);
});

app.get('/users/:userId/playlists', (req, res) => {
    const { userId } = req.params;
    const userPlaylist = playlists.filter((playlist) => playlist.userId === parseInt(userId));
    res.status(200).json(userPlaylist);
});


// for song route
app.post('/playlists/:playlistId/songs', (req, res) => {
    const { playlistId } = req.params; // ini untuk supaya bisa request di parameter url
    const {name, artist} = req.body; // ini untuk supaya bisa request di body sebagai inputan 

    if (!name || !artist) {
        res.status(400).json({error: "Name and Artis must be filled"});
    }

    const playlist = playlists.find((playlist) => playlist.id === parseInt(playlistId));
    if (!playlist) {
        res.status(404).json({error: "Playlist not found"});
    }
    songlength = playlists.song.length;
    const newSong = {id: songlength + 1, name, artist, playCount: 0};
    playlist.songs.push(newSong);
    res.status(201).json(newSong);
})

// untuk biar setiap play bertambah count nya
app.post('/playlists/:playlistId/songs/:songId/play', (req,res) => {
    const {playlistId, songId} = req.params;
    const playlist = playlists.find((playlist) => playlist.id === parseInt(playlistId));
    if (!playlist) {
        res.status(400).json({error: "Playlist required"})
    }

    const song = playlists.songs.find((song => song.id === parseInt(songId)));
    if (!song) {
        res.status(404).json({error: "song not found in playlist required"});
    }
    song.playCount += 1;
    res.status(200).json({ message: "Song play incremented"});
})

// ambil semua playlist untuk seorang user
app.get('users/:userId/playlists', (req, res) => {
    const {userId}  = req.params;
    const userPlaylists = playlists.filter((playlist) => playlist.userId === parseInt(userId));

    // hitung dan totalkan jumlah kali main
    const playListWithPlayCount = userPlaylists.map((playlist) => ({
        ...playlist,
        songs: playlist.songs.map((song) => ({
            ...song,
            playCount: song.playCount || 0,
        })),
    }));
    res.status(200).json(playListWithPlayCount);
})

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});
