document.addEventListener('DOMContentLoaded', () => {
    let weatherApiKey;
    let gptApiKey;

    fetch('http://localhost:3000/api/keys')
        .then(response => response.json())
        .then(data => {
            weatherApiKey = data.openWeatherMapApiKey;
            gptApiKey = data.openaiApiKey;
        })
        .catch(error => {
            console.error('Error fetching API keys:', error);
        });

    const weatherMenus = {
        "Clear": ["그릴드 치킨", "김밥", "스테이크", "샐러드"], // 맑은날
        "Rain": ["수제비","칼국수", "튀김덮밥", "라면","해물파전"], // 비오는날
        "Clouds": ["만두전골", "솥밥", "치킨"], // 흐린날
        "Snow": ["떡볶이", "김치찌개", "라면","부대찌개","팥죽"], // 눈오는날
        "Hot": ["물냉면", "막국수", "콩국수","비빔냉면","삼계탕"], // 더운날
    };

    const weatherImages = {
        "Clear": "images/clear.png", // 맑은날
        "Rain": "images/rain.png", // 비오는날
        "Clouds": "images/clouds.png", // 흐린날
        "Snow": "images/snow.png", // 눈오는날
        "Hot": "images/hot.png" // 더운날
    };

    const getWeatherButton = document.getElementById('getWeatherButton');
    const getGPTRecommendationButton = document.getElementById('getGPTRecommendationButton');
    const weatherInfo = document.getElementById('weatherInfo');
    const weatherIcon = document.getElementById('weatherIcon');
    const weatherMenuDisplay = document.getElementById('weatherMenuDisplay');
    const gptRecommendation = document.getElementById('gptRecommendation');

    getWeatherButton.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                getWeather(lat, lon);
            }, () => {
                weatherInfo.textContent = "위치 정보를 가져올 수 없습니다.";
            });
        } else {
            weatherInfo.textContent = "위치 정보 사용이 지원되지 않습니다.";
        }
    });

    function getWeather(lat, lon) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric&lang=kr`)
            .then(response => response.json())
            .then(data => {
                const weather = data.weather[0].main;
                const temp = data.main.temp;

                weatherInfo.textContent = `현재 날씨: ${weather}, 온도: ${temp}°C`;

                let weatherCondition = weather;
                if (temp > 30) {
                    weatherCondition = "Hot"; // 더운날
                }

                const imageUrl = weatherImages[weatherCondition] || "images/default.png";
                weatherIcon.innerHTML = `<img src="${imageUrl}" alt="${weatherCondition}">`;

                const menus = weatherMenus[weatherCondition] || ["메뉴 추천이 없습니다"];
                const randomMenu = menus[Math.floor(Math.random() * menus.length)];
                weatherMenuDisplay.textContent = `오늘의 추천 메뉴: ${randomMenu}`;
            })
            .catch(() => {
                weatherInfo.textContent = "날씨 정보를 가져올 수 없습니다.";
            });
    }

    getGPTRecommendationButton.addEventListener('click', () => {
        getGPTRecommendation();
    });

    function getGPTRecommendation() {
        const prompt = "오늘의 날씨에 맞는 추천 메뉴를 알려줘.";

        fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${gptApiKey}`
            },
            body: JSON.stringify({
                model: "text-davinci-003",
                prompt: prompt,
                max_tokens: 50
            })
        })
        .then(response => response.json())
        .then(data => {
            const recommendation = data.choices[0].text.trim();
            gptRecommendation.textContent = `GPT 추천 메뉴: ${recommendation}`;
        })
        .catch(error => {
            console.error('Error:', error);
            gptRecommendation.textContent = '추천 메뉴를 가져올 수 없습니다.';
        });
    }
});
// api 용 수정한거