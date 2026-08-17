/* --------------------------------------------------
   CONFIGURAÇÃO: caminhos dos arquivos e volume
   -------------------------------------------------- */
const CONFIG = {
    videoFile: "sources/hifumibg.mp4",   // vídeo convertido para mp4 (H.264 + áudio silencioso)
    videoType: "video/mp4",
    audioFile: "sources/hifumiOST.mp3",
    audioType: "audio/mpeg",
    volume: 0.08
};

function showDebug(msg) {
    const el = document.getElementById("debug-msg");
    el.style.display = "block";
    el.textContent = msg;
    console.error(msg);
}

document.addEventListener("DOMContentLoaded", () => {
    const videoSource = document.getElementById("video-source");
    const audioSource = document.getElementById("audio-source");
    const video = document.getElementById("bg-video");
    const audio = document.getElementById("bg-audio");
    const btn = document.getElementById("toggle-audio-btn");
    const audioLabel = document.getElementById("audio-label");

    videoSource.src = CONFIG.videoFile;
    videoSource.type = CONFIG.videoType;
    video.load();

    audioSource.src = CONFIG.audioFile;
    audioSource.type = CONFIG.audioType;
    audio.load();

    audio.volume = CONFIG.volume;


    function isVideoPlaying() {
        return video.currentTime > 0 && !video.paused && !video.ended
            && video.readyState > video.HAVE_CURRENT_DATA;
    }

    function playVid() {
        if (!isVideoPlaying()) {
            return video.play();
        }
        return Promise.resolve();
    }

    const retryInterval = setInterval(() => {
        if (document.visibilityState === "visible" && !isVideoPlaying()) {
            playVid().catch(() => {});
        } else if (isVideoPlaying()) {
            clearInterval(retryInterval);
        }
    }, 1000);

    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible" && !isVideoPlaying()) {
            playVid().catch(() => {});
        }
    });

    audio.muted = true;

    function isAudioPlaying() {
        return audio.currentTime > 0 && !audio.paused && !audio.ended
            && audio.readyState > audio.HAVE_CURRENT_DATA;
    }

    function playAudio() {
        if (!isAudioPlaying()) {
            return audio.play();
        }
        return Promise.resolve();
    }

    playAudio().then(() => {
        btn.textContent = "🔇";
        audioLabel.textContent = "> Blue Archive OST 80. Colorful Beach";
    }).catch(() => {
        btn.textContent = "🔇";
        audioLabel.textContent = "> Blue Archive OST 80. Colorful Beach";
    });

    const audioRetryInterval = setInterval(() => {
        if (document.visibilityState === "visible" && !isAudioPlaying()) {
            playAudio().catch(() => {});
        } else if (isAudioPlaying()) {
            clearInterval(audioRetryInterval);
        }
    }, 1000);

    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible" && !isAudioPlaying()) {
            playAudio().catch(() => {});
        }
    });

    btn.addEventListener("click", () => {
        audio.muted = !audio.muted;
        btn.textContent = audio.muted ? "🔇" : "🔊";
        audioLabel.textContent = "> Blue Archive OST 80. Colorful Beach";
        if (!isAudioPlaying()) {
            playAudio().catch(() => {});
        }
    });
});