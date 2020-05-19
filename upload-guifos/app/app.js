const recordGif = `
<div class="record-gif">
    <div class="top-bar">
        <h4 id="title">Un Chequeo Antes de Empezar</h4>
        <a href="upload.html"><img src="./../img/button3.svg" alt=""></a>
    </div>
    <div class="gif" id="gif">
        <video src="" id="video"></video>
    </div>
    <div class="btns" id="btns">
    </div>
</div>
`;
const btnCapture = `
<div class="btns-capture">
    <button class="button-pink img-capture" onclick="startGif()"><img src="./../img/camera.svg" alt=""></button>
    <button class="button-pink" onclick="startGif()">Capturar</button>
</div>
`;
const btnStop = `
<div class="btns-stop">
    <div class="timer">00:00:00:00</div>
    <div>
        <button class="stop img" onclick="stopGif()"><img src="./../img/recording.svg" alt=""></button>
        <button class="stop" onclick="stopGif()">Listo</button>
    </div>
</div>
`;
const btnUpload = `
<div class="upload">
    <div>
        <div class="timer">00:00:00:00</div>
        <div class="img"><img src="./../img/forward.svg" alt="Button forward"></div>
        <div class="loading-bar" id="loadingBar"></div>
    </div>
    <div class="btns">
        <button class="button-white" onclick="repeatGif()">Repetir Captura</button>
        <button class="button-pink" onclick="uploadGif()">Subir Guifo</button>
    </div>
</div>
`;
const loadingGif = `
<div class="loading">
    <img src="./../img/globe_img.png" alt="" class="globe">
    <h4>Estamos subiendo tu guifo…</h4>
    <div class="loading-bar"></div>
    <p>Tiempo restante: <span>38 años</span> algunos minutos</p>
</div>
<div class="btns">
    <button class="cancel button-white" onclick="uploadLink()">Cancelar</button>
</div>
`;
const success = `
<div class="success">
<div class="top-bar">
    <h4>Guifo Subido Con Éxito</h4>
    <a href="upload.html"><img src="./../img/button3.svg" alt=""></a>
</div>
<div class="test">
    <div class="mini-gif">
        <img id="miniGif"></img>
    </div>
    <div>
        <h4>Guifo creado con éxito</h4>
        <div class="btns">
            <button class="button-white" onclick="showLink()">Copiar Enlace Guifo</button>
            <div class="link no-display" id="copyLink">Link: </div>
            <button class="button-white" onclick="saveGif()">Descargar Guifo</button>
        </div>
    </div>
</div>
<button class="button-pink" onclick="uploadLink()">Listo</button>
</div>
`;
const general = document.getElementById('general');
let recorder;

const cleanGeneral = () => {
    general.innerHTML = '';
};
const cleanBtns = () => {
    btns.innerHTML = '';
};
const insertBtnCapture = () => {
    btns.innerHTML = btnCapture;
};

const startVideo = async () => {
    let stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
    });
    recorder = new RecordRTCPromisesHandler(stream, {
        type: 'gif'
    });
    video = document.getElementById('video');
    video.srcObject = stream;
    video.play();
};
const startRecord = () => {
    recorder.startRecording();
};

const changeTitle = (cont) => {
    title.innerHTML = `${cont}`;
};
let blob;
const stopRecord = async () => {
    await recorder.stopRecording();
    blob = await recorder.getBlob();
    img.src = URL.createObjectURL(blob);
    video.srcObject.stop();
};
const insertBtnStop = () => {
    btns.innerHTML = btnStop;
    changeTitle('Capturando tu guifo');
};
const insertBtnUpload = () => {
    btns.innerHTML = btnUpload;
    changeTitle('Vista Previa');
};
const img = document.createElement('img');
const insertImg = () => {
    gif.removeChild(video);
    gif.appendChild(img);
};
const cleanGif = () => {
    gif.innerHTML = ``;
};

const insertRecordGif = () => {
    cleanGeneral();
    general.innerHTML = recordGif;
    insertBtnCapture();
    startVideo();
};
const startGif = () => {
    cleanBtns();
    insertBtnStop();
    startRecord();
    startTimer();
};
const stopGif = () => {
    cleanBtns();
    stopRecord();
    insertImg();
    insertBtnUpload();
};
const repeatGif = () => {
    insertRecordGif();
};

const apiPost = async () => {
    const response = await fetch(`https://upload.giphy.com/v1/gifs?api_key=KdpBg8wKgDfANjp24Bz6PdBnCfJzY8SF`, {
        method: 'POST',
        body: formData
    })
    return response
};

let formData = new FormData();
const misGuifos = document.getElementById('misGuifos');
let link;
const uploadGif = async () => {
    uploadingGif();
    setTimeout(async () => {
        try {
            formData.append('file', blob, 'myGif.gif');
            const post = await apiPost();
            if (post.status != 200) {
                throw new Error('Ha ocurrido un error')
            } else {
                const postJSON = post.json();
                postJSON
                    .then(res => {
                        localStorage.setItem(`gif${res.data.id}`, `${res.data.id}`);
                        getMyGif(res.data.id);
                    })
                    .then(insertSuccess())
                    .catch(e => console.error(e));
            }
        } catch (e) {
            console.error(e);
        }
    }, 5000);
};
const uploadingGif = () => {
    cleanGif();
    cleanBtns();
    gif.innerHTML = loadingGif;
};
const insertSuccess = () => {
    cleanGeneral();
    general.innerHTML = success;
};

for (let i = 0; i < localStorage.length; i++) {
    let element = localStorage.key(i);
    const gif = localStorage.getItem(element);
    fetch(`https://api.giphy.com/v1/gifs/${gif}?api_key=KdpBg8wKgDfANjp24Bz6PdBnCfJzY8SF`)
        .then(res => res.json())
        .then(res => {
            const img = document.createElement('img');
            misGuifos.appendChild(img);
            img.src = res.data.images.fixed_height.url;
        })
};
const getMyGif = (myId) => {
    fetch(`https://api.giphy.com/v1/gifs/${myId}?api_key=KdpBg8wKgDfANjp24Bz6PdBnCfJzY8SF`)
        .then(res => res.json())
        .then(res => {
            link = res.data.url;
            renderMiniGif(res);
        })
};
const showLink = () => {
    const copyLink = document.getElementById('copyLink');
    copyLink.innerText = `${link}`;
    copyLink.classList.remove('no-display');
    setTimeout(() => {
        copyLink.classList.add('no-display');
    }, 3000);

};
if (localStorage.length > 0) {
    document.getElementById('misGuifosDivider')
        .classList.remove('no-display');
};
const homeLink = () => {
    location.href = '/index.html';
};
const uploadLink = () => {
    location.href = '/upload-guifos/upload.html';
};
const saveGif = () => {
    invokeSaveAsDialog(blob);
};
const renderMiniGif = (data) => {
    miniGif.src = data.data.images.fixed_height.url;
};

//Cambiar tema
const themeOptions = document.getElementById('themeOptions');
const lightTheme = document.getElementById('lightTheme');
const darkTheme = document.getElementById('darkTheme');
const logo = document.getElementById('logo');

const showOptions = () => {
    themeOptions.style.visibility = 'visible';
};
const hideOptions = () => {
    themeOptions.addEventListener('mouseleave', () => {
        themeOptions.style.visibility = 'hidden';
    })
};
document.getElementById('btnTheme')
    .addEventListener('click', () => {
        showOptions();
        hideOptions();
    });
document.getElementById('dropdownTheme')
    .addEventListener('click', () => {
        showOptions();
        hideOptions();
    });
const showTheme = (option) => {
    document.getElementById('linkTheme')
        .href = `./styles/${option}-theme.css`;
};
lightTheme.addEventListener('click', () => {
    showTheme('light');
    lightThemeActive();
    changeLogo('light');
})
darkTheme.addEventListener('click', () => {
    showTheme('dark');
    darkThemeActive();
    changeLogo('dark');
});
const lightThemeActive = () => {
    darkTheme.removeAttribute('class');
    lightTheme.className = 'li-active';
};
const darkThemeActive = () => {
    lightTheme.removeAttribute('class');
    darkTheme.className = 'li-active';
};
const changeLogo = (opt) => {
    logo.src = `../img/gifOF_logo_${opt}.png`;
};