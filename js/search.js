const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

searchInput.addEventListener('input', debounce(handleSearch, 300));
function handleSearch(){
    const searchTerm = searchInput.value.trim().toLowerCase();
    searchResults.innerHTML = '';

    fetch(`http://localhost:8080/searchUsers?searchTerm=${searchTerm}`)
        .then(response => response.json())
        .then(users => {
            users.forEach(user => {
                //console.log(user);
                const listItem = document.createElement('li');
                const img = document.createElement('img');
                img.src = '../../assets/profile.png';
                img.alt = 'Profile Icon';

                img.height = 24; 
                img.width = 24;

                //listItem.appendChild(img);

                const textContent = document.createElement('span');
                textContent.textContent = user.name;
                //listItem.textContent = user.name;
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

function navigateToUserProfile(userId){
    console.log(userId);
    window.location.href = `userProfileTemplate.html?id=${userId}`;
}

function debounce(func, delay){
    let timeoutId;
    return function(){
        const context = this;
        const args = arguments;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(context, args), delay);
    };
}