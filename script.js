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

    videoSource.src = CONFIG.videoFile;
    videoSource.type = CONFIG.videoType;
    video.load();

    audioSource.src = CONFIG.audioFile;
    audioSource.type = CONFIG.audioType;
    audio.load();

    audio.volume = CONFIG.volume;

    // Erro no elemento <video>
    // video.addEventListener("error", () => {
    //     const err = video.error;
    //     let reason = "desconhecido";
    //     if (err) {
    //         switch (err.code) {
    //             case err.MEDIA_ERR_ABORTED: reason = "carregamento abortado"; break;
    //             case err.MEDIA_ERR_NETWORK: reason = "erro de rede (arquivo não encontrado no caminho '" + CONFIG.videoFile + "'?)"; break;
    //             case err.MEDIA_ERR_DECODE: reason = "erro de decodificação (arquivo corrompido)"; break;
    //             case err.MEDIA_ERR_SRC_NOT_SUPPORTED: reason = "formato/codec não suportado pelo navegador"; break;
    //         }
    //     }
    //     showDebug("Falha ao carregar vídeo: " + reason);
    // });

    // videoSource.addEventListener("error", () => {
    //     showDebug("Não foi possível carregar o arquivo de vídeo em '" + CONFIG.videoFile + "'. Verifique se o arquivo existe nesse caminho relativo ao index.html.");
    // });

    // audio.addEventListener("error", () => {
    //     showDebug("Falha ao carregar áudio em '" + CONFIG.audioFile + "'.");
    // });

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

    // playVid().catch((err) => {
    //     showDebug("Navegador bloqueou o autoplay do vídeo: " + err.message);
    // });

    // Rede de segurança: caso o navegador ainda assim pause o vídeo em algum momento,
    // insistimos periodicamente enquanto a página estiver visível.
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

    // Autoplay do áudio (mp3)
    audio.play().then(() => {
        btn.textContent = "🔊";
    }).catch(() => {
        btn.textContent = "🔊";
    });

    btn.addEventListener("click", () => {
        if (audio.paused) {
            audio.play();
            btn.textContent = "🔊";
        } else {
            audio.pause();
            btn.textContent = "🔇";
        }
    });
});
