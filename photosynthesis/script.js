// Repository data - can be populated from GitHub API or static list
const repositories = [
    {
        name: "Photosynthesis Experiment",
        description: "Interactive virtual experiment demonstrating the process of photosynthesis in plants. Adjust variables like light intensity, CO₂ concentration, temperature, and water availability to observe real-time effects.",
        icon: "🌱",
        url: "./",
        branch: "SecSci",
        tags: ["biology", "photosynthesis", "interactive", "education"],
        status: "active"
    },
    // Add more repositories here as they are created
    // Example structure:
    // {
    //     name: "Repository Name",
    //     description: "Description of the experiment",
    //     icon: "🔬",
    //     url: "https://github.com/keithsflau/SecSci/repo-name",
    //     branch: "SecSci",
    //     tags: ["tag1", "tag2"],
    //     status: "active"
    // }
];

// GitHub API configuration (optional - for dynamic loading)
const GITHUB_CONFIG = {
    owner: "keithsflau",
    repo: "SecSci",
    branch: "SecSci",
    apiUrl: "https://api.github.com"
};

// Initialize the portal
document.addEventListener('DOMContentLoaded', () => {
    initializePortal();
    setupSearch();
});

// Initialize portal and load repositories
function initializePortal() {
    const reposGrid = document.getElementById('reposGrid');
    const loading = document.getElementById('loading');
    
    // For now, use static data
    // In the future, this could fetch from GitHub API
    setTimeout(() => {
        loading.style.display = 'none';
        displayRepositories(repositories);
    }, 500);
    
    // Uncomment below to fetch from GitHub API (requires CORS proxy or backend)
    // fetchRepositoriesFromGitHub();
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
    
    if (repo.url && !repo.url.startsWith('http') && !repo.url.startsWith('./')) {
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
    }
    
    const tagsHtml = repo.tags ? 
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

// Fetch repositories from GitHub API (optional - requires backend or CORS proxy)
async function fetchRepositoriesFromGitHub() {
    try {
        // This would require a backend API or CORS proxy
        // Example endpoint: ${GITHUB_CONFIG.apiUrl}/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents?ref=${GITHUB_CONFIG.branch}
        
        const response = await fetch(
            `${GITHUB_CONFIG.apiUrl}/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents?ref=${GITHUB_CONFIG.branch}`,
            {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            }
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch repositories');
        }
        
        const data = await response.json();
        const repos = data
            .filter(item => item.type === 'dir' && item.name !== '.git')
            .map(item => ({
                name: item.name,
                description: `Repository: ${item.name}`,
                icon: '🔬',
                url: item.html_url,
                branch: GITHUB_CONFIG.branch,
                tags: [],
                status: 'active'
            }));
        
        document.getElementById('loading').style.display = 'none';
        displayRepositories(repos);
    } catch (error) {
        console.error('Error fetching repositories:', error);
        document.getElementById('loading').style.display = 'none';
        // Fallback to static data
        displayRepositories(repositories);
    }
}

// Add tag styling
const style = document.createElement('style');
style.textContent = `
    .tag {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        background: rgba(52, 152, 219, 0.1);
        border-radius: 20px;
        font-size: 0.85rem;
        color: #3498db;
        margin-right: 0.5rem;
    }
`;
document.head.appendChild(style);

