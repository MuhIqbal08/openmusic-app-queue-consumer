const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getSongsByPlaylistId(playlistId) {
    const queryPlaylist = {
      text: 'SELECT id, name FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const querySong = {
      text: `SELECT songs.id, songs.title, songs.performer 
           FROM songs 
           INNER JOIN playlistsongs ON songs.id = playlistsongs.song_id 
           WHERE playlistsongs.playlist_id = $1`,
      values: [playlistId],
    };

    const resultPlaylists = await this._pool.query(queryPlaylist);
    const resultSongs = await this._pool.query(querySong);

    return {
      playlist: {
        id: resultPlaylists.rows[0].id,
        name: resultPlaylists.rows[0].name,
        songs: resultSongs.rows,
      },
    };
  }
}

module.exports = PlaylistsService;
