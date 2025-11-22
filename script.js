// Repository data - all science experiments in SecSci
const repositories = [
    {
        name: "Photosynthesis Experiment",
        description: "Interactive virtual experiment demonstrating the process of photosynthesis in plants. Adjust variables like light intensity, CO₂ concentration, temperature, and water availability to observe real-time effects.",
        icon: "🌱",
        url: "photosynthesis/",
        branch: "SecSci",
        tags: ["biology", "photosynthesis", "interactive", "education"],
        status: "active"
    },
    // Add more experiments here as they are created
    // Example structure:
    // {
    //     name: "Experiment Name",
    //     description: "Description of the experiment",
    //     icon: "🔬",
    //     url: "experiment-folder/",
    //     branch: "SecSci",
    //     tags: ["tag1", "tag2"],
    //     status: "active"
    // }
];

// Initialize the portal
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portal initialized. Repositories count:', repositories.length);
    initializePortal();
    setupSearch();
});

// Initialize portal and load repositories
function initializePortal() {
    const reposGrid = document.getElementById('reposGrid');
    const loading = document.getElementById('loading');
    
    // Check if repositories array exists and has data
    console.log('Initializing portal. Repositories:', repositories);
    if (!repositories || repositories.length === 0) {
        console.error('No repositories found');
        if (loading) loading.style.display = 'none';
        const noResults = document.getElementById('noResults');
        if (noResults) noResults.style.display = 'block';
        return;
    }
    
    // Simulate loading for better UX
    setTimeout(() => {
        if (loading) loading.style.display = 'none';
        console.log('Displaying repositories:', repositories);
        displayRepositories(repositories);
    }, 500);
}

// Display repositories in the grid
function displayRepositories(repos) {
    const reposGrid = document.getElementById('reposGrid');
    const noResults = document.getElementById('noResults');
    const loading = document.getElementById('loading');
    
    // Hide loading
    if (loading) {
        loading.style.display = 'none';
    }
    
    // Check if repos is valid
    if (!repos || repos.length === 0) {
        if (reposGrid) reposGrid.style.display = 'none';
        if (noResults) noResults.style.display = 'block';
        return;
    }
    
    // Show grid and hide no results
    if (reposGrid) {
        reposGrid.style.display = 'grid';
        reposGrid.innerHTML = '';
    }
    if (noResults) {
        noResults.style.display = 'none';
    }
    
    // Create and append cards
    repos.forEach((repo, index) => {
        const card = createRepoCard(repo, index);
        if (reposGrid && card) {
            reposGrid.appendChild(card);
        }
    });
}

// Create a repository card element
function createRepoCard(repo, index) {
    const card = document.createElement('a');
    card.href = repo.url || '#';
    card.className = 'repo-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    if (repo.url && repo.url.startsWith('http')) {
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
    }
    
    const tagsHtml = repo.tags && repo.tags.length > 0 ? 
        `<div class="repo-meta">
            ${repo.tags.map(tag => `<span class="tag">#${tag}</span>`).join(' ')}
        </div>` : '';
    
    card.innerHTML = `
        <span class="repo-icon">${repo.icon || '🔬'}</span>
        <h2 class="repo-title">${repo.name}</h2>
        <p class="repo-description">${repo.description || 'No description available.'}</p>
        ${tagsHtml}
        <span class="repo-link">View Experiment</span>
    `;
    
    return card;
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    const performSearch = () => {
        const query = searchInput.value.toLowerCase().trim();
        const filtered = repositories.filter(repo => {
            const nameMatch = repo.name.toLowerCase().includes(query);
            const descMatch = repo.description.toLowerCase().includes(query);
            const tagMatch = repo.tags?.some(tag => tag.toLowerCase().includes(query));
            return nameMatch || descMatch || tagMatch;
        });
        displayRepositories(filtered);
    };
    
    searchInput.addEventListener('input', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    searchBtn.addEventListener('click', performSearch);
}

