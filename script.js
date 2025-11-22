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
    initializePortal();
    setupSearch();
});

// Initialize portal and load repositories
function initializePortal() {
    const reposGrid = document.getElementById('reposGrid');
    const loading = document.getElementById('loading');
    
    // Simulate loading for better UX
    setTimeout(() => {
        loading.style.display = 'none';
        displayRepositories(repositories);
    }, 500);
}

// Display repositories in the grid
function displayRepositories(repos) {
    const reposGrid = document.getElementById('reposGrid');
    const noResults = document.getElementById('noResults');
    
    if (repos.length === 0) {
        reposGrid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    reposGrid.style.display = 'grid';
    noResults.style.display = 'none';
    reposGrid.innerHTML = '';
    
    repos.forEach((repo, index) => {
        const card = createRepoCard(repo, index);
        reposGrid.appendChild(card);
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

