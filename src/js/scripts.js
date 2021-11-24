const API_KEY = 'AIzaSyBN-ebbmOls-O7YGLwXCJ6_EW2tnsX7LVw';

const btnGenerate = document.querySelector('.js-generate-video');
const youtubeContainer = document.querySelector('.youtube-container');
const typeChannelId = document.querySelector('.js-input');
const radioBtns = document.querySelectorAll('input[type="radio"]');

window.onload = () => {
	const savedID = localStorage.getItem('prev');
	typeChannelId.value = savedID;

	const getRadio = localStorage.getItem('radioID');
	if (getRadio) {
		const activeRadio = document.getElementById(getRadio);
		activeRadio.checked = true;
	}
}

radioBtns.forEach(el => {
	el.addEventListener('change', function () {
		const radioID = localStorage.getItem('radioID');
		const prevResult = localStorage.getItem('prev');

		if (typeChannelId.value !== '') {
			typeChannelId.value = '';
		}

		if (radioID && prevResult) {
			localStorage.removeItem('radioID');
			localStorage.removeItem('prev');
		}

		const activeRadio = checkActiveRadio();
		activeRadio === 'radio01' ? typeChannelId.placeholder = 'Введите имя канала' : typeChannelId.placeholder = 'Введите id канала';
	})
});

const fetching = (url) => {
	fetch(url)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			if (!data.items) {
				alert('Проверьте название канала. Введено несуществующее название канала!');
				return
			}
			if (!data.prevPageToken && !data.nextPageToken) {
				const id = data.items[0].id;
				fetchingById(id);
			} else {
				processingData(data);
			}
		});
}

const checkActiveRadio = () => {
	const radioActive = document.querySelector('input[name="search"]:checked');
	return radioActive.getAttribute('id');
}

btnGenerate.addEventListener('click', () => {
	const inputValue = typeChannelId.value;

	if (!inputValue.length) {
		alert('Введите имя или идентификатор канала!')
		return
	}

	localStorage.setItem('radioID', checkActiveRadio());
	localStorage.setItem('prev', inputValue);

	const activeRadio = checkActiveRadio();
	if (activeRadio === 'radio01') {
		fetchingByChannelName(inputValue)
	} else {
		if (inputValue.length !== 24) {
			alert('Недействительный идентификатор канала!');
			return
		}
		fetchingById(inputValue);
	}
})

const fetchingByChannelName = (name) => {
	const url = `https://www.googleapis.com/youtube/v3/channels?key=${API_KEY}&part=contentDetails&forUsername=${name}`;
	fetching(url);
}

const fetchingById = (id) => {
	const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${id}&maxResults=50&pageToken=CDIQAA`;
	fetching(url);
}

const processingData = (data) => {
	const items = data.items;
	const videos = items.map(item => item.id.videoId);
	getRandomVideo(videos);
}

const getRandomVideo = (videos) => {
	const video = videos[Math.floor(Math.random() * videos.length)];
	showTemplate(video);
}

const showTemplate = (video) => {
	const html = `<iframe src="https://www.youtube.com/embed/${video}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
	if (!youtubeContainer.classList.contains('youtube-container_show')) {
		youtubeContainer.classList.add('youtube-container_show');
	}
	youtubeContainer.innerHTML = html
}
