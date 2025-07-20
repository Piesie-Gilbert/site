document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start' // Scroll to the top of the section
                });
            }
        });
    });

    // "Hire me" button functionality - sends an email
    const hireMeButton = document.getElementById('hireMeBtn');
    if (hireMeButton) {
        hireMeButton.addEventListener('click', function() {
            window.location.href = 'mailto:gilbertkwame7@gmail.com?subject=Inquiry from your Portfolio Website';
        });
    }

    // Set current year in footer dynamically
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- CONTENTFUL INTEGRATION STARTS HERE ---

    // REPLACE WITH YOUR ACTUAL Contentful Space ID and Access Token
    // IMPORTANT: NEVER expose your Management Token here! Only Delivery API tokens.
    const CONTENTFUL_SPACE_ID = 'sohnzczarvdr'; // Your Contentful Space ID
    const CONTENTFUL_ACCESS_TOKEN = 'AI0c1MJmACxV38pqYhKHPcqt_eKZGtD8v3wkXso0YX8'; // Your Contentful Delivery API Access Token

    // Function to fetch projects from Contentful
    async function fetchProjects() {
        const projectsGrid = document.querySelector('.projects-grid');
        if (!projectsGrid) return; // Exit if projects grid not found

        // Show a loading message
        projectsGrid.innerHTML = '<p>Loading projects...</p>';

        try {
            // Fetch entries of your 'portfolioProject' content type
            // IMPORTANT: 'content_type=portfolioProject' must match your exact Contentful Content Type ID
            const entriesResponse = await fetch(
                https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/master/entries?access_token=${CONTENTFUL_ACCESS_TOKEN}&content_type=portfolioProject&order=sys.createdAt
            );
            const entriesData = await entriesResponse.json();

            // Fetch assets (images) separately based on their IDs
            const assetsResponse = await fetch(
                https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/master/assets?access_token=${CONTENTFUL_ACCESS_TOKEN}
            );
            const assetsData = await assetsResponse.json();
            
            // Create a map for quick asset lookup
            const assetMap = new Map();
            if (assetsData.items) {
                assetsData.items.forEach(asset => {
                    if (asset.fields && asset.fields.file && asset.fields.file.url) {
                        assetMap.set(asset.sys.id, asset.fields.file.url);
                    }
                });
            }

            // Clear loading message
            projectsGrid.innerHTML = '';

            if (entriesData.items && entriesData.items.length > 0) {
                entriesData.items.forEach(item => {
                    const title = item.fields.title || 'No Title';
                    
                    // Robust handling for rich text description
                    let description = 'No description provided.';
                    if (item.fields.description && item.fields.description.content) {
                        // Iterate through content nodes to extract text
                        description = item.fields.description.content
                            .map(node => {
                                if (node.nodeType === 'paragraph' && node.content) {
                                    // Extract text from inline nodes
                                    return node.content.map(subNode => subNode.value || '').join('');
                                }
                                return ''; // Handle other node types if necessary, or just skip
                            })
                            .filter(Boolean) // Remove empty strings from mapping
                            .join('\n'); // Join paragraphs with a newline
                    }

                    const imageId = item.fields.image ? item.fields.image.sys.id : null;
                    // Prepend 'https:' for absolute URL, essential for displaying images from Contentful CDN
                    const imageUrl = imageId && assetMap.has(imageId) ? https:${assetMap.get(imageId)} : 'project-placeholder.jpg'; 

                    const githubLink = item.fields.githubLink || '#';
                    const liveDemoLink = item.fields.liveDemoLink || '#';

                    const projectCardHTML = `
                        <div class="project-card">
                            <img src="${imageUrl}" alt="${title} Thumbnail" onerror="this.onerror=null;this.src='project-placeholder.jpg';"/>
                            <h3>${title}</h3>
                            <p>${description}</p>
                            <a href="${liveDemoLink}" class="project-link" target="_blank">View Project</a>
                            ${githubLink && githubLink !== '#' ? <a href="${githubLink}" class="project-link" target="_blank" style="margin-left: 10px;">GitHub</a> : ''}
                        </div>
                    `;
                    projectsGrid.insertAdjacentHTML('beforeend', projectCardHTML);
                });
            } else {
                projectsGrid.innerHTML = '<p>No projects found. Please add content in Contentful and ensure they are published.</p>';
            }

        } catch (error) {
            console.error('Error loading projects from Contentful:', error);
            projectsGrid.innerHTML = '<p>Failed to load projects. Please check console for details and ensure your Contentful API keys/content are correct.</p>';
        }
    }

    // Call the fetchProjects function when the page loads
    fetchProjects();

    // --- CONTENTFUL INTEGRATION ENDS HERE ---
});