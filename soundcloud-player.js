(function (root,factory) {
    if ( typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define (['exports'], factory);
    } else if ( typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        factory(exports, true);
    } else if ( typeof exports === 'object' && typeof exports. nodeName !== 'string' ) {
        // CommonJS
        factory(exports, false);
    } else {
        // Browser globals (root is window)
       factory(root, false);
    }
})( this , function (exports, isNode) {
/**
  Loads song from SoundCloud by replacing the iFrame #so on the page and optionally autoplays it.
  @param {string} song - The song URL from soundcloud.com/...
  @param {bool} autoPlay - Should it autoplay the song after loading it.*/
function loadFromSC(song, autoPlay) {
  // Set up URL
  var uri = encodeURIComponent(song);
  var scUrl ='https://w.soundcloud.com/player/?url=' + uri;  // Set iFrame source
  $("#so").prop('src', scUrl);
  // Play song after 1 sec delay
  $("#so").on("load", function () {
      setTimeout(function(){
        if(autoPlay === true){
          play();
        }
      }, 1000);
  });
};

/**
  Get the SoundCloud information for a given track
  @param {string} songUrl - The song URL from soundcloud.com/...
*/
function getSCinfo(songUrl) {
  return new Promise((resolve, reject) => {
    // Get SC song info from oembed.js
    var uri = encodeURIComponent(songUrl);
    var scUrl = 'https://soundcloud.com/oembed.json?maxheight=200&url=' + uri;
    var request = $.get(scUrl, function(data){
      resolve(data);
    });
  });
};

/**
  Play the song
*/
function play() {
    var scPlayer = SC.Widget("so");
    scPlayer.play();
};

/**
  Pause the song
*/
function pause() {
    var scPlayer = SC.Widget("so");
    scPlayer.pause();
};

/**
  Switch between playing and paused
*/
function toggleIsPlaying() {
    return new Promise((resolve, reject) => {
        var scPlayer = SC.Widget("so");
        scPlayer.isPaused((paused) => {
            if(paused){
                play();
            }else{
                pause();
            }

            resolve(paused);
        });
    });
};
var SCPlayer = {
    "loadFromSC": loadFromSC,
    "getSCinfo": getSCinfo,
    "play": play,
    "pause": pause,
    "toggleIsPlaying": toggleIsPlaying
};
if (isNode) exports = SCPlayer;
else exports.SCPlayer = SCPlayer;
});
