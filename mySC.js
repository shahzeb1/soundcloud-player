$(document).ready(function() {

  // Queue up a SoundCloud song to play via the song url
  var song1 = 'https://soundcloud.com/chancetherapper/acid-rain-1';
  var song2 = 'https://soundcloud.com/hxns/precious';
  var song3 = 'https://soundcloud.com/morguemami/limelight-prod-xauve';
  var song4 = 'https://soundcloud.com/joshpanii/usedii';

  playSC(song1, false); // false = don't autoPlay, true = autoPlay

  getSCinfo(song1, 'thumbnail', true, true);
  getSCinfo(song2, 'smallThumb1');
  getSCinfo(song3, 'smallThumb2');
  getSCinfo(song4, 'smallThumb3');

  var player = SC.Widget("so");

  // Set the song link as the external link
  $("#sc_link").attr("href", song1);

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
      playSC(url, true);
      getSCinfo(url, 'thumbnail', true, true);
      $("#sc_link").attr("href", url);
    }else{
      alert("Enter in a valid http://soundcloud.com/ link.")
    }
  });

  $("#smallThumb1").click(function() {
    playSC(song2, true);
    getSCinfo(song2, 'thumbnail', true, true);
  });

  $("#smallThumb2").click(function() {
    playSC(song3, true);
    getSCinfo(song3, 'thumbnail', true, true);
  });

  $("#smallThumb3").click(function() {
    playSC(song4, true);
    getSCinfo(song4, 'thumbnail', true, true);
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