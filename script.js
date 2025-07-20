document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // "Hire me" button functionality
    const hireMeButton = document.getElementById('hireMeBtn');
    if (hireMeButton) {
        hireMeButton.addEventListener('click', function() {
            window.location.href = 'mailto:gilbertkwame7@gmail.com?subject=Inquiry from your Portfolio Website';
        });
    }

    // --- CONTENTFUL INTEGRATION STARTS HERE ---

    // REPLACE WITH YOUR ACTUAL Contentful Space ID and Access Token
    // IMPORTANT: NEVER expose your Management Token here! Only Delivery API tokens.
    const CONTENTFUL_SPACE_ID = 'sohnzczarvdr'; // e.g., 'abcdef12345'
    const CONTENTFUL_ACCESS_TOKEN = 'AI0c1MJmACxV38pqYhKHPcqt_eKZGtD8v3wkXso0YX8'; // e.g., 'ghijk67890'

    // Function to fetch projects from Contentful
    async function fetchProjects() {
        const projectsGrid = document.querySelector('.projects-grid');
        if (!projectsGrid) return; // Exit if projects grid not found

        // Clear any existing placeholder content
        projectsGrid.innerHTML = '';

        try {
            // Fetch entries of your 'project' content type
            const response = await fetch(
                https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/master/entries?access_token=${CONTENTFUL_ACCESS_TOKEN}&content_type=portfolioProject&order=sys.createdAt
            );
            const data = await response.json();

            // Fetch assets (images) separately based on their IDs
            const assetsResponse = await fetch(
                https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/master/assets?access_token=${CONTENTFUL_ACCESS_TOKEN}
            );
            const assetsData = await assetsResponse.json();
            const assetMap = new Map(assetsData.items.map(asset => [asset.sys.id, asset.fields.file.url]));

            if (data.items && data.items.length > 0) {
                data.items.forEach(item => {
                    const title = item.fields.title;
                    // For rich text, you might need a library like contentful-rich-text-html-renderer
                    // For now, we'll just get the plain text if description is rich text
                    const description = item.fields.description ? item.fields.description.content[0].content[0].value : 'No description provided.';
                    const imageId = item.fields.image ? item.fields.image.sys.id : null;
                    const imageUrl = imageId ? assetMap.get(imageId) : 'project-placeholder.jpg'; // Fallback image
                    const githubLink = item.fields.githubLink || '#';
                    const liveDemoLink = item.fields.liveDemoLink || '#';

                    const projectCardHTML = `
                        <div class="project-card">
                            <img src="${imageUrl}" alt="${title} Thumbnail" />
                            <h3>${title}</h3>
                            <p>${description}</p>
                            <a href="${liveDemoLink}" class="project-link" target="_blank">View Project</a>
                            ${githubLink && githubLink !== '#' ? <a href="${githubLink}" class="project-link" target="_blank" style="margin-left: 10px;">GitHub</a> : ''}
                        </div>
                    `;
                    projectsGrid.insertAdjacentHTML('beforeend', projectCardHTML);
                });
            } else {
                projectsGrid.innerHTML = '<p>No projects found. Please add content in Contentful.</p>';
            }

        } catch (error) {
            console.error('Error loading projects from Contentful:', error);
            projectsGrid.innerHTML = '<p>Failed to load projects. Please check console for details.</p>';
        }
    }

    // Call the fetchProjects function when the page loads
    fetchProjects();

    // --- CONTENTFUL INTEGRATION ENDS HERE ---
});
