

document.addEventListener('DOMContentLoaded', () => {
    const jobListingsContainer = document.querySelector('.job-listings');
    const filtersContainer = document.querySelector('.filters');
    const clearBtn = document.querySelector('.clear-btn');
    let jobs = [];
    let filters = [];

    // Fetch the data from the JSON file
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            jobs = data;
            displayJobs(jobs);
        })
        .catch(error => console.error('Error fetching data:', error));

    // Function to display job listings
    function displayJobs(jobs) {
        jobListingsContainer.innerHTML = '';
        jobs.forEach(job => {
            const jobElement = document.createElement('div');
            jobElement.classList.add('job-listing');
            jobElement.innerHTML = `
                <img src="${job.logo}" alt="${job.company} logo">
                <div class="info">
                    <h3>${job.position}</h3>
                    <p>${job.company}</p>
                    <p>${job.postedAt} · ${job.contract} · ${job.location}</p>
                    <div class="tags">
                        <span class="tag">${job.role}</span>
                        <span class="tag">${job.level}</span>
                        ${job.languages.map(language => `<span class="tag">${language}</span>`).join('')}
                        ${job.tools.map(tool => `<span class="tag">${tool}</span>`).join('')}
                    </div>
                </div>
            `;
            jobListingsContainer.appendChild(jobElement);

            // Add event listener to tags
            jobElement.querySelectorAll('.tag').forEach(tag => {
                tag.addEventListener('click', () => {
                    const filter = tag.textContent;
                    if (!filters.includes(filter)) {
                        filters.push(filter);
                        updateFilters();
                        filterJobs();
                    }
                });
            });
        });
    }

    // Event listener for clearing filters
    clearBtn.addEventListener('click', () => {
        filters = [];
        updateFilters();
        displayJobs(jobs);
    });

    // Function to update filter tags
    function updateFilters() {
        filtersContainer.innerHTML = '';
        filters.forEach(filter => {
            const filterElement = document.createElement('span');
            filterElement.classList.add('filter');
            filterElement.textContent = filter;
            filterElement.addEventListener('click', () => {
                filters = filters.filter(f => f !== filter);
                updateFilters();
                filterJobs();
            });
            filtersContainer.appendChild(filterElement);
        });
    }

    // Function to filter job listings
    function filterJobs() {
        const filteredJobs = jobs.filter(job =>
            filters.every(filter =>
                job.role === filter ||
                job.level === filter ||
                job.languages.includes(filter) ||
                job.tools.includes(filter)
            )
        );
        displayJobs(filteredJobs);
    }
});