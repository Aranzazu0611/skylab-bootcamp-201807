
'use strict'

var logic = {
    //token: 'NO-TOKEN',
    token: 'BQBR653wCX42gcOp3WTV0sorKpw1iWWBnArJly9oWudO1fpQ2D7-KW-Fc9I8WYs1-giB7TRc6P_uZudsy47cphBEmtoYGIxf3sjaKxhlCay2wi3lE9HyqXSsxmFQ7aBewZsbKc0LKZxa0N258CQVGBH6pbz07nY',

    _callApi: function (path) {
        var url = 'https://api.spotify.com/v1' + path;

        return $.ajax({
                url: url,
                type: 'GET',
                headers: {"Authorization": 'Bearer ' + this.token}
            }).done(function(result) {
                return result;
            });
    },

    searchArtists: function (query) {
        return $.when(this._callApi('/search?type=artist&query=' + query))
            .then(function(res) {
                return res.artists.items;
            });
    },

    retrieveAlbumsByArtistId(id) {
        return $.when(this._callApi('/artists/' + id + '/albums'))
            .then(function(res) {
                return res.items;
            });
    },

    retrieveTracksByAlbumId(id) {
        return $.when(this._callApi('/albums/' + id + '/tracks'))
            .then(function(res) {
                return res.items;
            });
    },


    retrieveTrackById(id) {
        return $.when(this._callApi('/tracks/' + id))
            .then(function(res){
                return res;
            });
    },

    searchAlbumsByQuery: function (query) {
        return $.when(this._callApi('/search?type=album&query=' + query))
            .then(function(res) {
                return res.albums.items;
            });
    },


    retrieveAlbumsById(id) {
        return $.when(this._callApi('/albums/' + id))
            .then(function(res){
                return res;
            });
    },
};