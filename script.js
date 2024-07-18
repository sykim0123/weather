document.addEventListener('DOMContentLoaded', () => {
    const weatherMenus = {
        "Clear": ["", "스테이크", "샐러드"], // 맑은날
        "Rain": ["김치찌개", "된장찌개", "라면"], // 비오는날
        "Clouds": ["떡볶이", "비빔밥", "치킨"], // 흐린날
        "Snow": ["떡볶이", "김치찌개", "라면"], // 눈오는날
        "Hot": ["냉면", "막국수", ""] // 더운날
    };

    const weatherImages = {
        "Clear": "images/clear.png", // 맑은날
        "Rain": "images/rain.png", // 비오는날
        "Clouds": "images/clouds.png", // 흐린날
        "Snow": "images/snow.png", // 눈오는날
        "Hot": "images/hot.png" // 더운날
    };

    const getWeatherButton = document.getElementById('getWeatherButton');
    const weatherInfo = document.getElementById('weatherInfo');
    const weatherIcon = document.getElementById('weatherIcon');

    const weatherMenuDisplay = document.getElementById('weatherMenuDisplay');

    const apiKey = '2c75612c6897ab9fb36c8a6a04ec62b8';

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
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`)
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
                weatherMenuDisplay.textContent = `오늘의 추천 메뉴: ${menus.join(', ')}`;
            })
            .catch(() => {
                weatherInfo.textContent = "날씨 정보를 가져올 수 없습니다.";
            });
    }
});
//첫번째 커밋