const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

searchInput.addEventListener('input', debounce(handleSearch, 300));

// Add a click event listener to the document
document.addEventListener('click', (event) => {
    const isClickInsideSearch = searchResults.contains(event.target);
    const isClickInsideSearchInput = searchInput.contains(event.target);

    // If the click is outside both the search input and results, hide the results
    if (!isClickInsideSearch && !isClickInsideSearchInput) {
        searchResults.innerHTML = '';
    }
});

function handleSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    searchResults.innerHTML = '';

    fetch(`http://localhost:8080/searchUsers?searchTerm=${searchTerm}`)
        .then(response => response.json())
        .then(users => {
            users.forEach(user => {
                const listItem = document.createElement('li');
                const img = document.createElement('img');
                img.src = '../../assets/user.svg';
                img.alt = 'Profile Icon';
                img.height = 24; 
                img.width = 24;

                const textContent = document.createElement('span');
                textContent.textContent = user.name;

                listItem.appendChild(img);
                listItem.appendChild(textContent);
                listItem.addEventListener('click', () => navigateToUserProfile(user.id));
                searchResults.appendChild(listItem);
            })
        })
        .catch(err => {
            console.error('Error fetching users:', err);
        })
}

function navigateToUserProfile(userId) {
    console.log(userId);
    window.location.href = `userProfileTemplate.html?id=${userId}`;
}

function debounce(func, delay) {
    let timeoutId;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(context, args), delay);
    };
}
