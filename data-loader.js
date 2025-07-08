/**
 * Data loader for Caritas Rwanda website
 * This script loads JSON data files and populates website content
 */

// Main data loading function
async function loadSiteData() {
    try {
        // Load different data types
        const adverts = await fetchJSON('Backup/adverts.json');
        const departments = await fetchJSON('Backup/departments.json');
        const services = await fetchJSON('Backup/services.json');
        const projects = await fetchJSON('Backup/projects.json');
        
        // Once data is loaded, initialize site sections
        if (adverts) initializeAdverts(adverts);
        if (departments) initializeDepartments(departments);
        if (services) initializeServices(services);
        if (projects) initializeProjects(projects);
        
        console.log('Site data loaded successfully');
    } catch (error) {
        console.error('Error loading site data:', error);
    }
}

// Helper function to fetch JSON files
async function fetchJSON(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Failed to load ${path}: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${path}:`, error);
        return null;
    }
}

// Initialize adverts section with JSON data
function initializeAdverts(adverts) {
    // Get current language
    const lang = document.documentElement.lang || 'en';
    
    // Find container for featured advert
    const featuredContainer = document.querySelector('.hero-banner');
    if (featuredContainer && adverts.length > 0) {
        // Use the first active advert as the featured one
        const featured = adverts.find(ad => ad.isActive === true) || adverts[0];
        
        // Update hero banner content
        if (featured) {
            // Set background image from gallery if available
            if (featured.gallery && featured.gallery.length > 0) {
                featuredContainer.style.backgroundImage = `url('${featured.gallery[0]}')`;
            }
            
            // Update title based on language
            const bannerContent = featuredContainer.querySelector('.banner-content');
            if (bannerContent) {
                const title = bannerContent.querySelector('h1');
                if (title && featured.name && featured.name[lang]) {
                    title.textContent = featured.name[lang].toUpperCase();
                }
            }
        }
    }
    
    // You could also populate other sections with adverts data
    // For example, creating a promotional section with all active adverts
}

// Initialize departments section with JSON data
function initializeDepartments(departments) {
    // Implementation for departments data
    // This would populate any department-related sections on the page
}

// Initialize services section with JSON data
function initializeServices(services) {
    // Implementation for services data
    // This would populate any service-related sections on the page
}

// Initialize projects section with JSON data
function initializeProjects(projects) {
    const projectsContainer = document.querySelector('.project-carousel');
    if (!projectsContainer || !projects || !projects.length) return;
    
    // Clear existing content
    projectsContainer.innerHTML = '';
    
    // Get current language
    const lang = document.documentElement.lang || 'en';
    
    // Add projects from JSON data
    projects.forEach(project => {
        if (!project.isActive) return;
        
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        
        // Create project image container
        const imageContainer = document.createElement('div');
        imageContainer.className = 'project-image';
        
        // Add image if available
        const img = document.createElement('img');
        if (project.gallery && project.gallery.length > 0) {
            img.src = project.gallery[0];
        } else {
            img.src = 'project-placeholder.jpg';
        }
        img.alt = project.name?.[lang] || 'Project Image';
        imageContainer.appendChild(img);
        
        // Create project info container
        const infoContainer = document.createElement('div');
        infoContainer.className = 'project-info';
        
        // Add project title
        const title = document.createElement('h3');
        title.textContent = project.name?.[lang] || 'Project Title';
        infoContainer.appendChild(title);
        
        // Add project description
        const description = document.createElement('p');
        description.innerHTML = project.description?.[lang] || '';
        infoContainer.appendChild(description);
        
        // Add read more link
        const readMore = document.createElement('a');
        readMore.className = 'read-more';
        readMore.href = `project.html?id=${project._id.$oid}`;
        readMore.innerHTML = 'Read More <i class="fa fa-arrow-right"></i>';
        infoContainer.appendChild(readMore);
        
        // Assemble card
        projectCard.appendChild(imageContainer);
        projectCard.appendChild(infoContainer);
        
        // Add to container
        projectsContainer.appendChild(projectCard);
    });
}

// Call the main function when document is loaded
document.addEventListener('DOMContentLoaded', loadSiteData);