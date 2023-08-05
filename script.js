window.onload = async function () {
    const getIp = async function () {
        try {
            const ipResponse = await fetch('https://api64.ipify.org?format=json');
            const ipData = await ipResponse.json();
            const ip = ipData.ip;
            const toFetch = `https://ipinfo.io/${ip}?token=58eee96b82a44e`;
            console.log(toFetch);

            const infoResponse = await fetch(toFetch);
            const infoData = await infoResponse.json();

            console.log(infoData);
            // Process and display the additional information as needed
            document.querySelector('#ip__add').textContent = `${infoData.ip}`;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    await getIp();
}

document.querySelector('.getStarted__btn').addEventListener('click',() => {
    window.location.assign('./map/index.html');
})