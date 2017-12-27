$(document).ready(function() {

  // Queue up a SoundCloud song to play via the song url
  var songs = ['https://soundcloud.com/chancetherapper/acid-rain-1',
               'https://soundcloud.com/hxns/precious',
               'https://soundcloud.com/morguemami/limelight-prod-xauve',
               'https://soundcloud.com/joshpanii/usedii'];

  playSC(songs[0], false); // false = don't autoPlay, true = autoPlay
  getSCinfo(songs[0], 'thumbnail', true, true);
  songs = loadUserSongs(songs); //check for user songs
  genContainers(songs); //generate playlist containers

  for (i = 1; i < songs.length; i++) {
    getSCinfo(songs[i], 'smallThumb' + i);

    //Set up click listeners for extra songs
    (function(i) {
      $("#smallThumb" + i).click(function(){
        playSC(songs[i], true);
        getSCinfo(songs[i], 'thumbnail', true, true);

        // Set the song link as the external link
        $("#sc_link").attr("href", songs[i]);
      });

    })(i);
  }

  var player = SC.Widget("so");

  // Set the song link as the external link
  $("#sc_link").attr("href", songs[0]);

  // Play button pressed
  $("#play").click(function() {
    player.play();
    toggleButtons('play');
  });

  // Pause button pressed
  $("#pause").click(function() {
    player.pause();
    toggleButtons('pause');
  });

  // Spacebar is pressed, pause or play song
  document.body.onkeyup = function(e){
    if(e.keyCode == 32){
      var player = SC.Widget("so");
      player.isPaused(function(pause){
        if(pause){
          player.play();
          toggleButtons('play');
        }else{
          player.pause();
          toggleButtons('pause');
        }
      });
    }
  }

  // New SoundCloud URL requested via prompt()
  $("#newSong").click(function() {
    var url = prompt("Enter in a new SoundCloud URL:");
    var scMatch = url.match(/^https:\/\/soundcloud\.com\/[a-z1-9-]*\/[a-z1-9-]*\/?$/);
    if(url !== null && scMatch !== null){
      saveUserSong(url, songs);
      playSC(url, true);
      getSCinfo(url, 'thumbnail', true, true);
      $("#sc_link").attr("href", url);
    }else{
      alert("Enter in a valid http://soundcloud.com/ link.")
    }
  });
})

/**
  Plays a SoundCloud song by replaceing the iFrame #so on the page.
  @param {string} song - The song URL from soundcloud.com/...
  @param {bool} autoPlay - Should it autoplay the song after loading it.
*/
function playSC(song, autoPlay){
  // Set up URL
  var uri = encodeURIComponent(song);
  var scUrl ='https://w.soundcloud.com/player/?url='+uri;
  // Set iFrame source
  $("#so").prop('src', scUrl);
  // Play song after 1 sec delay
  $("#so").on("load", function () {
      setTimeout(function(){
        if(autoPlay === true){
          var player = SC.Widget("so");
          player.play();
          toggleButtons('play');
        }
      }, 1000);
  });
}

/**
  Get the SoundCloud informatin for a given track,
  and replace elemnts on the page with the info.
  @param {string} song - The song URL from soundcloud.com/...
  @param {string} thumbId - DOM Id of element to populate
  @param {boolean} setTitle - Should title be set?
  @param {boolean} setArtist - Should artist be set?
*/
function getSCinfo(song, thumbId, setTitle, setArtist){
  // Get SC song info from oembed.js
  var uri = encodeURIComponent(song);
  var scUrl = 'https://soundcloud.com/oembed.json?maxheight=200&url='+uri;
  $.get(scUrl, function(data){
    // Populate the data onto the web-page
    var thumb_https = data.thumbnail_url.replace(/^http:\/\//i, 'https://');
    var title_only = data.title.split("by");
    $("#" + thumbId).prop("src", thumb_https);
    if (setTitle) {
      $("#song_title").html('<i class="fa fa-music" aria-hidden="true"></i> ' + title_only[0]);
    }

    if (setArtist) {
      $("#song_artist").html('<i class="fa fa-user" aria-hidden="true"></i> ' + data.author_name);
    }
  })
}

/**
 * Show and hide play/pause button depending
 * on whether the song is running or not.
 * @param {string} status - State of the song
 */
function toggleButtons(status) {
  if (status === 'play') {
    $("#play").hide();
    $("#pause").show();
  } else {
    $("#play").show();
    $("#pause").hide();
  }
}

//Save user added song on submit to localStorage
function saveUserSong(song, songlist) {
  if (localStorage.soundCloudPlayerList) {
    let userList = JSON.parse(localStorage.getItem("soundCloudPlayerList"));
    userList.push(song);
    localStorage.setItem("soundCloudPlayerList", JSON.stringify(userList));
  } else {
    localStorage.setItem("soundCloudPlayerList", JSON.stringify([song]));
  }
}

//Load user added song on page load/refresh
function loadUserSongs(songlist) {
  if (localStorage.soundCloudPlayerList) {
    let userList = JSON.parse(localStorage.soundCloudPlayerList);
    return songlist.concat(userList);
  }
  return songlist;
}

//Create new playlist container
function createNewListitem(index) {
  let newImage = document.createElement("img");
  newImage.src = "no-sc-artwork.png";
  newImage.className = "smallThumbnail";
  newImage.id = "smallThumb" + index;
  newImage.alt = "Album artwork";

  let newSong = document.createElement("div");
  newSong.className = "col-md-4 extra-art-container";
  newSong.appendChild(newImage);

  $("#extraArtRow").append(newSong);
}

//Create additional containers on page load based on additional user songs
function genContainers(songlist) {
  var playlistItems = document.querySelector("#extraArtRow").childElementCount;
  if(songlist.length - 1 > playlistItems) {
    let j = (songlist.length - 1) - playlistItems;
    for(i = 1; i <= j; i++) {
      createNewListitem(playlistItems + i);
    }
  }
}
