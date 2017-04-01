$(document).ready(function() {

  // Queue up a SoundCloud song to play via the song url
  var song = 'https://soundcloud.com/chancetherapper/acid-rain-1';
  playSC(song, false); // false = don't autoPlay, true = autoPlay
  getSCinfo(song);
  var player = SC.Widget("so");

  // Set the song link as the external link
  $("#sc_link").attr("href", song);

  // Play button pressed
  $("#play").click(function() {
    player.play();
  });

  // Pause button pressed
  $("#pause").click(function() {
    player.pause();
  });

  // New SoundCloud URL requested via prompt()
  $("#newSong").click(function() {
    var url = prompt("Enter in a new SoundCloud URL:");
    var scMatch = url.match(/^https:\/\/soundcloud\.com\/[a-z1-9\/-]*/);
    if(url !== null && scMatch !== null){
      playSC(url, true);
      getSCinfo(url);
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
        }
      }, 1000);
  });
}

/**
  Get the SoundCloud informatin for a given track,
  and replace elemnts on the page with the info.
  @param {string} song - The song URL from soundcloud.com/...
*/
function getSCinfo(song){
  // Get SC song info from oembed.js
  var uri = encodeURIComponent(song);
  var scUrl = 'https://soundcloud.com/oembed.json?maxheight=200&url='+uri;
  $.get(scUrl, function(data){
    // Populate the data onto the web-page
    var thumb_https = data.thumbnail_url.replace(/^http:\/\//i, 'https://');
    var title_only = data.title.split("by");
    var name_no_quotes = data.author_name.substring(1, data.author_name.length-1);;
    $("#thumbnail").prop("src", thumb_https);
    $("#song_title").html('<i class="fa fa-music" aria-hidden="true"></i> ' + title_only[0]);
    $("#song_artist").html('<i class="fa fa-user" aria-hidden="true"></i> ' + name_no_quotes);
  })
}
