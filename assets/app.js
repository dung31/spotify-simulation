const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const audio = $(".song-play");

const songs = [
  {
    id: 1,
    name: "Vì mẹ anh bắt chia tay",
    singer: "Miu Lê, Karik",
    img: "./assets/img/tải xuống.jpg",
    song: "./assets/song/ViMeAnhBatChiaTay-MiuLe-7503053.mp3",
    duration: "4:20",
  },
  {
    id: 2,
    name: "Bên trên tầng lầu",
    singer: "Tăng Duy Tân",
    img: "./assets/img/Loi-bai-hat-Ben-Tren-Tang-Lau-Tang-Duy-Tan.jpg",
    song: "./assets/song/Ben Tren Tang Lau - Tang Duy Tan.mp3",
    duration: "3:04",
  },
  {
    id: 3,
    name: "She neva know",
    singer: "JustaTee",
    img: "./assets/img/sddefault.jpg",
    song: "./assets/song/SheNevaKnows-JustaTee-Emily_3mqz4.mp3",
    duration: "4:49",
  },
];

const app = {
  currentID: 1,
  isStarted: false,

  playCurrentSong: function () {
    $(".info-control i").style.display = "block";
    //play current song
    audio.src = songs[app.currentID - 1].song;
    if (app.isStarted) {
      audio.pause();
    }
    audio.play();

    //change play button
    $(".play-button").style.display = "none";
    $(".pause-button").style.display = "block";

    //change playlist song
    if ($(".song-played")) {
      $(".song-played").classList.remove("song-played");
    }
    if ($(".song-paused")) {
      $(".song-paused").classList.remove("song-paused");
    }
    let parentElement = $(".songid-" + app.currentID).parentNode.parentNode;
    parentElement.classList.add("song-played");

    //change song info in player bar
    $(".info-avatar img").src = songs[app.currentID - 1].img;
    $(".info-song h3").innerHTML = songs[app.currentID - 1].name;
    $(".info-song h4").innerHTML = songs[app.currentID - 1].singer;
    $(".end-song").innerHTML = songs[app.currentID - 1].duration;
  },

  unPauseCurrentSong() {
    audio.play();
    let parentElement = $(".songid-" + app.currentID).parentNode.parentNode;
    parentElement.classList.remove("song-paused");
  },

  pauseCurrentSong: function () {
    audio.pause();
    let parentElement = $(".songid-" + app.currentID).parentNode.parentNode;
    parentElement.classList.add("song-paused");
    $(".pause-button").style.display = "none";
    $(".play-button").style.display = "block";
  },

  preSong: function () {
    if (app.currentId != 0 && app.isStarted) {
      app.currentID--;
      app.playCurrentSong();
    }
  },

  nextSong: function () {
    if (app.currentID != songs.length && app.isStarted) {
      app.currentID++;
      app.playCurrentSong();
    }
  },

  setVolume: function (volume) {
    audio.volume = volume;
    $(".current-volume").style.width = `${volume * 100}%`;
    if (volume > 0.5) {
      $(".volume").innerHTML = '<i class="fal fa-volume"></i>';
    } else if (volume === 0) {
      $(".volume").innerHTML = '<i class="fal fa-volume-mute"></i>';
    } else {
      $(".volume").innerHTML = '<i class="fal fa-volume-down"></i>';
    }
  },
  handleEvent: function () {
    $(".play-button").onclick = function () {
      if (!app.isStarted) {
        app.playCurrentSong();
        app.isStarted = true;
      } else {
        app.unPauseCurrentSong();
      }
      $(".pause-button").style.display = "block";
      $(".play-button").style.display = "none";
    };
    $(".pause-button").onclick = function () {
      app.pauseCurrentSong();
    };

    // click playlist song
    playSongs = $$(".small-play");
    playSongs.forEach(function (playSong) {
      playSong.onclick = function () {
        let songClass = playSong.classList[1];
        app.currentID = songClass.slice(
          songClass.indexOf("-") + 1,
          songClass.length
        );
        app.isStarted = true;
        app.playCurrentSong();
      };
    });

    //next pre song
    $(".next-song").onclick = function () {
      app.nextSong();
    };
    $(".pre-song").onclick = function () {
      app.preSong();
    };

    //shuffle song and repeat song
    $(".random-song").onclick = function () {
      this.classList.toggle("clicked");
      if (app.transfer === "random") {
        app.transfer = "next";
      } else {
        if (app.transfer === "repeat") {
          $(".repeat-song").classList.remove("clicked");
        }
        app.transfer = "random";
      }
    };
    $(".repeat-song").onclick = function () {
      this.classList.toggle("clicked");
      if (app.transfer === "repeat") {
        app.transfer = "next";
      } else {
        if (app.transfer === "random") {
          $(".random-song").classList.remove("clicked");
        }
        app.transfer = "repeat";
      }
    };

    //handle step song
    $(".progress-song .progress-bar").onclick = function (e) {
      if (app.isStarted) {
        audio.currentTime =
          ((e.clientX - this.offsetLeft) / this.offsetWidth) * audio.duration;
        $(".current-bar").style.width = `${
          (100 * audio.currentTime) / audio.duration
        }%`;
      }
    };

    //handle volume up down

    $(".progress-volume").onclick = function (e) {
      app.setVolume((e.clientX - this.offsetLeft) / this.offsetWidth);
    };

    $(".volume").onclick = function () {
      if (audio.volume !== 0) {
        app.audioTemp = audio.volume;
        app.setVolume(0);
      } else {
        app.setVolume(app.audioTemp);
      }
    };

    //handle love song
    $(".info-control").onclick = function () {
      $(`.heart-${app.currentID}`).classList.toggle("heart-song");
    };

    //handle mobile player player
    $(".mobile-down").onclick = function () {
      $("#main").classList.remove("mobile-webapp");
      $(".mobile-down").style.display = "none";
    };

    var x = window.matchMedia("(max-width: 739px)");
    $("#player").onclick = function () {
      if (!$("#main").classList.contains("mobile-webapp") && x.matches) {
        $("#main").classList.add("mobile-webapp");
        $(".mobile-down").style.display = "block";
      }
    };
  },

  minutesPlayed: function (time) {
    let seconds;
    if (time.toFixed() % 60 < 10) {
      seconds = "0" + (time.toFixed() % 60);
    } else {
      seconds = time.toFixed() % 60;
    }
    let minutes = (time.toFixed() - (time.toFixed() % 60)) / 60;
    return minutes + ":" + seconds;
  },

  handleAccountButton: function () {
    $(".account").onclick = function () {
      if ($(".account-control").style.display === "block") {
        $(".account-control").style.display = "none";
        $(".account i:last-child ").style.display = "none";
        $(".account i:nth-child(2)").style.display = "block";
        $(".account").style.backgroundColor = "#3f453f";
      } else {
        $(".account-control").style.display = "block";
        $(".account i:last-child ").style.display = "block";
        $(".account i:nth-child(2)").style.display = "none";
        $(".account").style.backgroundColor = "#282828";
      }
    };
  },

  handleMobileButton: function () {
    $(".mobile-more").onclick = function () {
      $("#sideBar").style.display = "flex";
      $("#content").style.filter = "blur(8px)";
    };
    $(".mobile-back").onclick = function () {
      $("#sideBar").style.display = "none";
      $("#content").style.filter = "none";
    };
  },

  renderProgressBar() {
    let progressBar = $(".current-bar");
    setInterval(function () {
      if (app.isStarted) {
        $(".start-song").innerHTML = app.minutesPlayed(audio.currentTime);
        progressBar.style.width = `${
          (100 * audio.currentTime) / audio.duration
        }%`;
        if (audio.ended) {
          if (app.transfer === "next") {
            app.nextSong();
          } else if (app.transfer === "repeat") {
            app.playCurrentSong();
          } else {
            app.currentID = Math.floor(Math.random() * songs.length) + 1;
            app.playCurrentSong();
          }
        }
      }
    }, 200);
  },

  renderAlbum: function () {
    var htmls = songs.map(function (song) {
      return `
            <li>
            <div class="playlist-left">
                <div class="number-song">
                    ${song.id}
                </div>
                <div class="small-play songid-${song.id}">
                    <i class="fas fa-play"></i>
                </div>
                <img src="./assets/img/animated.gif" alt="animated" class="animated-song">
                <div class="song-name">
                    <h3 class="song-header">
                        ${song.name}
                    </h3>
                    <h3 class="singer">
                        ${song.singer}
                    </h3>
                </div>
            </div>
            <div class="time-song heart-${song.id}">
            <i class="fa-solid fa-heart-circle-check"></i>                
            ${song.duration}
            </div>
        </li>
            `;
    });
    $(".playlist").innerHTML = htmls.join(" ");
  },

  start: function () {
    this.handleAccountButton();
    this.handleMobileButton();
    this.renderAlbum();
    this.handleEvent();
    this.renderProgressBar();
  },
};

app.start();
