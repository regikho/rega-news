const loader = document.querySelector('.loader');
const sectionArticals = document.querySelector('.articles');

let isLoading = false;
let page = 1;
const pageSize = 8;
let totalResults = 0;
let lastQueryType = '';

function createNewsItem(text, src, imgSrc) {
    const newArticle = document.createElement('div');
    newArticle.classList.add("article-item");
    newArticle.innerHTML += `
        <img src="${imgSrc}" alt="${text}" class="articles-img" onError="this.src='./img/no-img.svg'" data-src="real.jpg">
        <h2 class="articles-title">${text}</h2>
        <div class="articles-wrapper">
            <a href="${src}" class="articles-button" target="_blank">Read More</a>
        </div>`;
    sectionArticals.append(newArticle);
}

async function getData(searchValue, pageSize, page) {
    let url = '';

    if (searchValue) {
        url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchValue)}&pageSize=${pageSize}&page=${page}&language=ru&sortBy=publishedAt&apiKey=d22014f7b6ef49f18d095302d23105ab`;
        lastQueryType = 'everything';
    } else {
        url = `https://newsapi.org/v2/top-headlines?pageSize=${pageSize}&page=${page}&language=ru&sortBy=publishedAt&apiKey=d22014f7b6ef49f18d095302d23105ab`;
        lastQueryType = 'top';
    }

    isLoading = true;
    loader.style.display = 'flex';
    document.querySelector('.wrapper').style.display = 'flex';
    
    const result = await fetch(url);
    const data = await result.json();

    isLoading = false;
    loader.style.display = 'none';
    document.querySelector('.wrapper').style.display = 'none';

    totalResults = data.totalResults;

    return data;
}

// Топ новости
const getTop = function (data) {
    const news = data.articles;

    if (lastQueryType === 'everything') {
        sectionArticals.innerHTML = '';
        page = 1;
    }

    console.log(lastQueryType);

    lastQueryType = 'top';

    for (let i = 0; i < pageSize; i++) {
        const title = news[i].title;
        const link = news[i].url;
        const imgLink = news[i].urlToImage;

        createNewsItem(title, link, imgLink);
    }
}

// Пугачева
const getSearch = function(data) {
    // sectionArticals.innerHTML = '';
    const news = data.articles;
    const headingTop = document.querySelector('.heading-top');

    if (lastQueryType === 'top') {
        // sectionArticals.innerHTML = '';
        page = 1;
    }
    
    console.log(lastQueryType);
    console.log(page);

    lastQueryType = 'everything';

    if (totalResults !== 0) {
        headingTop.innerHTML = `По вашему запросу найдено: ${totalResults} ${giveName(totalResults)}`;
    } else {
        headingTop.innerHTML = `По вашему запросу ничего найдено`;
        sectionArticals.innerHTML = `<img src="./img/no-result.svg" class="img_no-result">`;
    }

    // getTop(data);

    for (let i = 0; i < pageSize; i++) {
        const title = news[i].title;
        const link = news[i].url;
        const imgLink = news[i].urlToImage;

        createNewsItem(title, link, imgLink);
    }

    console.log(news);
}

document.querySelector('.search').addEventListener('submit', (e) => {
    e.preventDefault();
    const searchValue = document.querySelector('.search-text').value;

    document.querySelector('.wrapper').style.display = 'flex';
    loader.style.display = 'flex';

    getData(searchValue, pageSize, page).then(getSearch);
})


window.addEventListener('scroll', () => {
    if (isLoading) return;

    const documentRect = document.documentElement.getBoundingClientRect();
    
    if (documentRect.bottom < document.documentElement.clientHeight + 150) {
        page = page + 1;

        if (Math.ceil(totalResults / pageSize) >= page) {
            if (document.querySelector('.search-text').value) {
                getData(document.querySelector('.search-text').value, pageSize, page).then(getSearch);
            } else {
                getData('', pageSize, page).then(getTop);
            }
        }      
    }
})

getData('', pageSize, page).then(getTop);

function giveName(number) {
    let num = String(number);
    let numArr = [];
    let word = '';

    for (let i = 0; i < num.length; i++) {
        numArr.push(num.charAt(i));
    }
    
    let endPosition = numArr[numArr.length-1];
    let penultPosition = numArr[numArr.length-2];
    
    if ((endPosition >= 5 && endPosition <= 9) || 
        (endPosition === "0") ||
        (endPosition == 1 && penultPosition == 1) ||
        (endPosition >= 2 && endPosition <= 4 && penultPosition == 1)) {
            return word = " статей";
    }
        
    if (endPosition == 1 && penultPosition !=1) {
        return word = " статья";
    }
    
    if (endPosition >=2 && endPosition <= 4 && penultPosition != 1) {
        return word = " статьи";
    }
}