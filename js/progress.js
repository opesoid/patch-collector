const createProgressManager = (container) => {
    let progressBar = null
    let progressText = null
    let progressPercentage = null
    let progressCount = null
    let progressIcon = null
    
    // Initialize the progress elements
    const init = () => {
        // Status row
        const statusRow = document.createElement('div')
        statusRow.className = 'progress-status'
        
        progressText = document.createElement('div')
        progressText.className = 'progress-text'
        
        progressPercentage = document.createElement('div')
        progressPercentage.className = 'progress-percentage'
        
        statusRow.appendChild(progressText)
        statusRow.appendChild(progressPercentage)
        
        // Progress bar
        const barContainer = document.createElement('div')
        barContainer.className = 'progress-bar-container'
        
        progressBar = document.createElement('div')
        progressBar.className = 'progress-bar'
        
        barContainer.appendChild(progressBar)
        
        // Details row
        const detailsRow = document.createElement('div')
        detailsRow.className = 'progress-details'
        
        progressIcon = document.createElement('div')
        progressIcon.className = 'progress-icon'
        progressIcon.innerHTML = getDownloadIcon()
        
        progressCount = document.createElement('div')
        progressCount.className = 'progress-count'
        
        detailsRow.appendChild(progressIcon)
        detailsRow.appendChild(progressCount)
        
        // Assemble container
        container.appendChild(statusRow)
        container.appendChild(barContainer)
        container.appendChild(detailsRow)
    }
    
    const show = () => {
        if (container) {
            container.style.display = 'block'
        }
    }
    
    const hide = () => {
        if (container) {
            container.style.display = 'none'
        }
    }
    
    const updateProgress = (current, total, details = '') => {
        const percentage = (current / total) * 100
        
        if (progressBar) {
            progressBar.style.width = `${percentage}%`
            progressBar.style.backgroundColor = getProgressColor(percentage)
            
            // Remove any existing classes
            progressBar.classList.remove('success', 'error')
        }
        
        if (progressText) {
            if (details.startsWith('Scanning')) {
                progressText.textContent = 'Scanning pages...'
                progressIcon.innerHTML = getScanIcon()
            } else {
                progressText.textContent = 'Downloading patches...'
                progressIcon.innerHTML = getDownloadIcon()
            }
        }
        
        if (progressPercentage) {
            progressPercentage.textContent = `${Math.round(percentage)}%`
        }
        
        if (progressCount) {
            if (details.includes("\n")) {
                progressCount.textContent = details.split("\n")[1]
            } else if (details.startsWith('Scanning')) {
                progressCount.textContent = `${current}/${total} pages`
            } else {
                progressCount.textContent = `${current}/${total} patches`
            }
        }
    }
    
    const getProgressColor = (percentage) => {
        if (percentage < 30) return '#ff9800'
        if (percentage < 70) return '#2196f3'
        return '#4caf50'
    }
    
    const showSuccess = (message) => {
        if (progressBar) {
            progressBar.style.width = '100%'
            progressBar.classList.add('success')
        }
        
        if (progressText) {
            progressText.textContent = 'Complete!'
        }
        
        if (progressPercentage) {
            progressPercentage.textContent = '100%'
        }
        
        if (progressIcon) {
            progressIcon.innerHTML = getSuccessIcon()
        }
        
        if (progressCount) {
            progressCount.textContent = message
        }
        
        setTimeout(() => hide(), 3000)
    }
    
    const showError = (message) => {
        if (progressBar) {
            progressBar.style.width = '100%'
            progressBar.classList.add('error')
        }
        
        if (progressText) {
            progressText.textContent = 'Error'
        }
        
        if (progressPercentage) {
            progressPercentage.textContent = ''
        }
        
        if (progressIcon) {
            progressIcon.innerHTML = getErrorIcon()
        }
        
        if (progressCount) {
            progressCount.textContent = message
        }
        
        setTimeout(() => hide(), 3000)
    }
    
    const getDownloadIcon = () => {
        return '<svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>'
    }
    
    const getScanIcon = () => {
        return '<svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>'
    }
    
    const getSuccessIcon = () => {
        return '<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>'
    }
    
    const getErrorIcon = () => {
        return '<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>'
    }
    
    // Initialize the progress elements
    init()
    
    // Return the public methods
    return {
        show,
        hide,
        updateProgress,
        showSuccess,
        showError
    }
} 