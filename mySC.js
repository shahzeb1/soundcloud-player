$(document).ready(function() {  
  // Queue up a SoundCloud song to play via the song url
  var songs = ['https://soundcloud.com/chancetherapper/acid-rain-1',
               'https://soundcloud.com/hxns/precious',
               'https://soundcloud.com/morguemami/limelight-prod-xauve',
               'https://soundcloud.com/joshpanii/usedii'];

  loadFromSC(songs[0], false); // false = don't autoPlay, true = autoPlay
  getSCinfo(songs[0]).then((data) => {
    updateInUI('thumbnail', data, true);
  });

  for (i = 1; i < songs.length; i++) {
    (function(i) {
      getSCinfo(songs[i]).then((data) => {
        updateInUI('smallThumb' + i, data, false);
      });
      
      //Set up click listeners for extra songs
      $("#smallThumb" + i).click(function(){
        loadFromSC(songs[i], true);
        toggleButtons(true);
        getSCinfo(songs[i]).then((data) => {
          updateInUI('thumbnail', data, true);
        });

        // Set the song link as the external link
        $("#sc_link").attr("href", songs[i]);
      });
      
    })(i);
  };

  // Set the song link as the external link
  $("#sc_link").attr("href", songs[0]);

  // Play button pressed
  $("#play").click(function() {
    play();
    toggleButtons(true);
  });

  // Pause button pressed
  $("#pause").click(function() {
    pause();
    toggleButtons(false);
  });

  // Spacebar is pressed, pause or play song
  document.body.onkeyup = function(e){
    if(e.keyCode == 32){
      toggleIsPlaying().then((isPlaying) => {
        toggleButtons(isPlaying);
      });
    }
  };

  // New SoundCloud URL requested via prompt()
  $("#newSong").click(function() {
    var url = prompt("Enter in a new SoundCloud URL:");
    var scMatch = url.match(/^https:\/\/soundcloud\.com\/[a-z1-9-]*\/[a-z1-9-]*\/?$/);
    if(url !== null && scMatch !== null){
      loadFromSC(url, true);
      toggleButtons(true);
      getSCinfo(url).then((data) => {
        updateInUI('thumbnail', data, true);
      });
      
      $("#sc_link").attr("href", url);
    }else{
      alert("Enter in a valid http://soundcloud.com/ link.")
    }
  });
});

/**
  Update UI with artwork and optionally song metadata
   @param {string} thumbId - DOM Id of element to populate
   @param {any} data - Object describing a song from SoundCloud
   @param {boolean} setInfo - Should song and artist be set?
 */
function updateInUI(thumbId, data, setInfo) {
  var thumb_https = data.thumbnail_url.replace(/^http:\/\//i, 'https://');

  $("#" + thumbId).prop("src", thumb_https);

  if (setInfo){
    var title_only = data.title.split("by");
    $("#song_title").html('<i class="fa fa-music" aria-hidden="true"></i> ' + title_only[0]);
    $("#song_artist").html('<i class="fa fa-user" aria-hidden="true"></i> ' + data.author_name);
  }
};

/**
 * Show and hide play/pause button depending
 * on whether the song is running or not.
 * @param {boolean} status - State of the song
 */
function toggleButtons(isPlaying) {
  if (isPlaying) {
    $("#play").hide();
    $("#pause").show();
  } else {
    $("#play").show();
    $("#pause").hide();
  }
};