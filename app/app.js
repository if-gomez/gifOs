const myFetch = {
    apiKey: 'KdpBg8wKgDfANjp24Bz6PdBnCfJzY8SF',
    
    getTrending: function (){
        const data = fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${this.apiKey}&limit=25&rating=G`)
            .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
            .then(res => res.json())
            .then(res => {
                const {data} = res;
                return data
            })
            .catch(rej => console.error(rej));
        return data
    },
    search: function (search){
        const data = fetch(`https://api.giphy.com/v1/gifs/search?api_key=${this.apiKey}&q=${search}&limit=25&offset=0&rating=G&lang=en`)
            .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
            .then(res => res.json())
            .then(res => {
                const {data} = res;
                return data
            })
            .catch(rej => console.error(rej));
        return data
    }
};

//Renderizar tendencias
const trendingSection = document.getElementById('trendingSection');

const renderGif = (data) => {
    for (const gif of data) {
        const div = document.createElement('div');
        const img = document.createElement('img');
        const divBorder = document.createElement('div');
        const divTopBar = document.createElement('div');
        div.setAttribute('id', 'gifTrending');
        trendingSection.appendChild(div);
        div.appendChild(img);
        div.className = 'gif-trending';
        img.src = gif.images.fixed_height.url;
        div.insertBefore(divBorder, img);
        div.insertBefore(divTopBar, img);
        img.addEventListener('mouseover', () => {
            divTopBar.className = 'top-bar';
            divTopBar.innerText = `#${gif.slug}`.replace(/-/g, ' #');
            divBorder.className = 'border';
        });
        img.addEventListener('mouseleave', () => {
            divTopBar.className = 'no-display';
            divBorder.className = 'no-display';
        });
        }
};
window.addEventListener('load', async () => {
    const data = await myFetch.getTrending()
    renderGif(data);
});



//Renderizar sugerencias
const suggestList = ['simpson', 'rick&morty', 'toystory', 'shrek'];

const renderSuggest = async (sug) => {
    const sugGif = document.getElementById(sug)
    const data = await myFetch.search(sug);
    sugGif.src = data[0].images.fixed_height.url;
    changeTitle(sug, data);
};
const changeTitle = (sug, data) => {
    const title = document.createElement('h5');
    const img = document.getElementById(`${sug}Img`)
    document.getElementById(`topBar${sug}`)
        .insertBefore(title, img)
    title.textContent = `#${data[0].title}`.replace(/ /g, '');  
};
const cleanSection = () => {
    trendingSection.innerHTML = '';
};
const seeAllSuggest = async (i) => {
    const data = await myFetch.search(i);
    renderGif(data);
};
const seeMore = (i) => {
    document.getElementById(`${i}Btn`)
    .addEventListener('click', () => {
        cleanSection();
        seeAllSuggest(i);
    });
};
window.addEventListener('load', async () => {
    for (const i of suggestList) {
        renderSuggest(i);
        seeMore(i);
    }
});

//Renderizar busquedas
const dividerTrending = document.getElementById('dividerTrending');
const input = document.getElementById('inputSearchBar');
const btnSearchBar = document.getElementById('btnSearchBar');

input.addEventListener('keypress', () => {
    btnActive();
});
input.addEventListener('click', () => {
    searchSuggestActive();
})
btnSearchBar.addEventListener('click', async () => {
    const data = await myFetch.search(input.value);
    cleanSection();
    cleanSuggest();
    renderGif(data);
    btnInactive();
    dividerTrendingText();
    searchSuggestInactive();
    if(data.length == 0){
        trendingSection.innerText = 'No hay resultados para tu búsqueda';
    };
    console.log(data);
});
const btnActive = () => {
    btnSearchBar.className = 'btn-active';
};
const btnInactive = () => {
    btnSearchBar.className = 'btn-inactive'
};

const searchSuggest = document.getElementById('searchSuggest');

const searchSuggestActive = () => {
    searchSuggest.style.display = 'block';
};
const searchSuggestInactive = () => {
    searchSuggest.style.display = 'none';
};
searchSuggest.addEventListener('mouseleave', searchSuggestInactive)

document.getElementById('messi')
    .addEventListener('click', async () => {
        const data = await myFetch.search('messi');
        cleanSection();
        cleanSuggest();
        renderGif(data);
        dividerTrendingText();
        searchSuggestInactive();
    })

document.getElementById('cuarentena')
    .addEventListener('click', async () => {
        const data = await myFetch.search('cuarentena');
        cleanSection();
        cleanSuggest();
        renderGif(data);
        dividerTrendingText();
        searchSuggestInactive();
    });
    
document.getElementById('peppa')
    .addEventListener('click', async () => {
        const data = await myFetch.search('peppa pig');
        cleanSection();
        cleanSuggest();
        renderGif(data);
        dividerTrendingText();
        searchSuggestInactive();
    });


const cleanSuggest = () => {
    document.getElementById('suggest').innerHTML = '';
    document.getElementById('dividerSuggest').className = 'no-display';
};
const dividerTrendingText = () => {
    dividerTrending.textContent = 'Resultados para tu busqueda: '+ input.value.toUpperCase();
};
//Cambiar tema
const themeOptions = document.getElementById('themeOptions');
const lightTheme = document.getElementById('lightTheme');
const darkTheme = document.getElementById('darkTheme');
const logo = document.getElementById('logo');

const showOptions = () => {
    themeOptions.removeAttribute('class');
};
const hideOptions = () => {
    themeOptions.addEventListener('mouseleave', () => {
            themeOptions.className = 'no-display';
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
        .href = `styles/${option}-theme.css`;
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
    logo.src = `./img/gifOF_logo_${opt}.png`;
};

document.getElementById('createGuifos')
    .addEventListener('click', () => {
        location.href = './upload-guifos/upload.html';
    })


//Renderizar mis guifos
const renderLocal = () => {
    for (let i = 0; i < localStorage.length; i++) {
        let element = localStorage.key(i);
        const gif = localStorage.getItem(element);
        fetch(`https://api.giphy.com/v1/gifs/${gif}?api_key=KdpBg8wKgDfANjp24Bz6PdBnCfJzY8SF`)
            .then(res => res.json())
            .then(res => {
                const img = document.createElement('img');
                trendingSection.appendChild(img);
                img.src = res.data.images.fixed_height.url;
            })
    };
};

const changeText = () => {
    dividerTrending.innerText = 'Mis guifos';
}

document.getElementById('misGuifos')
    .addEventListener('click', () => {
        cleanSection();
        cleanSuggest();
        renderLocal();
        changeText();
    });