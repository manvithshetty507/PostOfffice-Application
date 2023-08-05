// JavaScript code

// Function to add Google Maps with specified latitude and longitude
function addmap(lat, long) {
    const map = document.querySelector('.map');
    const frame = document.createElement('iframe');
    const url = `https://maps.google.com/maps?q=${lat},${long}&z=15&output=embed`;
    frame.setAttribute('src', url);
    frame.setAttribute('width', '700px');
    frame.setAttribute('height', '400px');
    map.appendChild(frame);
}

// Function to get formatted date and time in the specified time zone
function getDateTime(info) {
    const dateTime = new Date().toLocaleString('en-US', { timeZone: info });
    console.log(dateTime);
    return dateTime;
}

// Execute when the window is loaded
window.onload = async function () {
    // Function to get IP address and additional information
    const getIp = async function () {
        try {
            const ipResponse = await fetch('https://api64.ipify.org?format=json');
            const ipData = await ipResponse.json();
            const ip = ipData.ip;
            const toFetch = `https://ipinfo.io/${ip}?token=58eee96b82a44e`;

            const infoResponse = await fetch(toFetch);
            const infoData = await infoResponse.json();

            // Process and display the additional information as needed
            try {
                // Update UI elements with IP information
                document.querySelector('#ip__add').textContent = `${infoData.ip}`;
                document.querySelector('#lat').textContent = `Latitude: ${infoData.loc.split(',')[0]}`;
                document.querySelector('#long').textContent = `Longitude: ${infoData.loc.split(',')[1]}`;
                document.querySelector('#city').textContent = `City: ${infoData.city}`;
                document.querySelector('#region').textContent = `Region: ${infoData.region}`;
                document.querySelector('#org').textContent = `Org: ${infoData.org}`;
                document.querySelector('#host').textContent = `HostName: ${infoData.hostname}`;
                document.querySelector('#time__zone').textContent = `TimeZone: ${infoData.timezone}`;
                document.querySelector('#date').textContent = `Date and Time: ${getDateTime(infoData.timezone)}`;
                document.querySelector('#pin').textContent = `PinCode: ${infoData.postal}`;
            } catch (error) {
                console.log(error);
            }

            // Call function to add Google Maps
            addmap(infoData.loc.split(',')[0], infoData.loc.split(',')[1]);

            // Call function to find nearby post offices
            findNearbyPostOffices(infoData.postal);

        } catch (error) {
            console.error('Error fetching IP information:', error);
        }
    }

    // Call the getIp function to start the process
    getIp();

    // Function to find nearby post offices
    async function findNearbyPostOffices(pincode) {
        const apiKey = `https://api.postalpincode.in/pincode/${pincode}`;

        try {
            const response = await fetch(apiKey);
            const data = await response.json();
            console.log(data);
            document.querySelector('#msg').textContent = `Message: ${data[0].Message}`;
            addAllOffice(data[0]);
        } catch (error) {
            console.error('Error fetching nearby post offices:', error);
        }
    }

    // Function to add all post offices to the UI
    function addAllOffice(data) {
        const allOffice = document.querySelector('.all__posts');
        const postOffices = data.PostOffice;
        console.log(postOffices);
        postOffices.forEach((office) => {
            const Curoffice = document.createElement('div');
            Curoffice.className = 'post__box';

            Curoffice.innerHTML = `<span>Name: ${office.Name}</span>
                <span>Branch: ${office.Block}</span>
                <span>Delivery Status: ${office.DeliveryStatus}</span>
                <span>District: ${office.District}</span>
                <span>Division: ${office.Division}</span>`;

            allOffice.appendChild(Curoffice);
        })
    }

    // Function to handle search and filtering of post offices
    function Search(toSearch) {
        const allPosts = document.querySelector('.all__posts');
        const postBoxes = allPosts.querySelectorAll('.post__box');
        const updatedPosts = [];

        postBoxes.forEach((post) => {
            let curName = post.querySelector('span').textContent;
            curName = curName.split(':')[1].trim().toLowerCase();
            const curBranchName = post.querySelector('span:nth-child(2)').textContent.split(':')[1].trim().toLowerCase();

            if (toSearch === curName || toSearch == curBranchName) {
                updatedPosts.push(post);
            }
        });

        allPosts.innerHTML = ''; // Clear the container

        updatedPosts.forEach((post) => {
            allPosts.appendChild(post);
        });
        document.querySelector('.search__input').value = "";
    }

    // Event listener for search input
    document.querySelector('.search__input').addEventListener('keydown', (event) => {
        if (event.key === "Enter") {
            const toSearch = document.querySelector('.search__input').value;
            Search(toSearch.toLowerCase());
        }
    });
}


