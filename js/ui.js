const formatProgressText = (current, total) => {
    const padLength = total.toString().length
    return `patch ${current.toString().padStart(padLength, '0')}/${total}`
}

const createButton = (text, onClick) => {
    const button = document.createElement('button')
    button.innerText = text
    button.className = 'patch-collector-button'
    button.addEventListener('click', onClick)
    return button
}

const createDeviceSelect = () => {
    const select = document.createElement('select')
    select.className = 'patch-collector-select'

    const defaultOption = document.createElement('option')
    defaultOption.value = ''
    defaultOption.text = 'Select Device'
    select.appendChild(defaultOption)

    DEVICE_LIST.forEach(device => {
        const option = document.createElement('option')
        option.value = device.name
        option.text = device.name
        select.appendChild(option)
    })

    return select
}

const createSearchInput = () => {
    const container = document.createElement('div')
    container.className = 'search-container'

    const inputWrapper = document.createElement('div')
    inputWrapper.className = 'search-input-wrapper'

    const searchIcon = document.createElement('div')
    searchIcon.className = 'search-icon'
    searchIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    `

    const input = document.createElement('input')
    input.type = 'text'
    input.className = 'search-input'
    input.placeholder = 'Search patches (e.g., Metal, Clean)'

    const pageControl = document.createElement('div')
    pageControl.className = 'page-control'
    pageControl.innerHTML = `
        <div class="page-control-label">Pages to search:</div>
        <div class="page-control-buttons">
            <button class="control-button" id="decrementPage">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <input type="number" class="page-display page-input" value="1" min="1" max="100">
            <button class="control-button" id="incrementPage">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    `

    inputWrapper.appendChild(searchIcon)
    inputWrapper.appendChild(input)
    container.appendChild(inputWrapper)
    container.appendChild(pageControl)

    const pageInput = pageControl.querySelector('.page-input')
    const decrementButton = pageControl.querySelector('#decrementPage')
    const incrementButton = pageControl.querySelector('#incrementPage')

    return {
        container,
        input,
        pageInput,
        decrementButton,
        incrementButton
    }
}

const createFloatingContainer = () => {
    const container = document.createElement('div')
    container.id = 'patch-collector-container'
    return container
}

const createTabSystem = () => {
    const tabContainer = document.createElement('div')
    tabContainer.className = 'tab-container'

    const tabNav = document.createElement('div')
    tabNav.className = 'tab-nav'

    const tabContent = document.createElement('div')
    tabContent.className = 'tab-content'

    tabContainer.appendChild(tabNav)
    tabContainer.appendChild(tabContent)

    const addTab = (id, label, content, isActive = false) => {
        const tabButton = document.createElement('button')
        tabButton.className = `tab-button ${isActive ? 'active' : ''}`
        tabButton.textContent = label
        tabButton.dataset.tab = id

        const tabPanel = document.createElement('div')
        tabPanel.className = `tab-panel ${isActive ? 'active' : ''}`
        tabPanel.id = `tab-${id}`
        tabPanel.appendChild(content)

        tabNav.appendChild(tabButton)
        tabContent.appendChild(tabPanel)

        tabButton.addEventListener('click', () => {
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active')
            })
            document.querySelectorAll('.tab-panel').forEach(panel => {
                panel.classList.remove('active')
            })

            tabButton.classList.add('active')
            tabPanel.classList.add('active')
        })
    }

    return {
        container: tabContainer,
        addTab
    }
}

let progressManager = null
let currentPage = 1

const createUI = async () => {
    const existingContainer = document.getElementById('patch-collector-container')
    if (existingContainer) {
        existingContainer.remove()
    }

    const container = createFloatingContainer()

    const header = document.createElement('div')
    header.className = 'patch-collector-header'

    const title = document.createElement('div')
    title.className = 'patch-collector-title'
    title.innerHTML = `
        <img src="${chrome.runtime.getURL('icons/icon48.png')}" class="title-icon" alt="Patch Collector">
        Patch Collector
    `

    const minimizeBtn = document.createElement('button')
    minimizeBtn.className = 'minimize-button'
    minimizeBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
    `

    let isMinimized = false
    minimizeBtn.addEventListener('click', () => {
        const content = container.querySelector('.tab-container')
        isMinimized = !isMinimized

        if (isMinimized) {
            content.style.display = 'none'
            minimizeBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                </svg>
            `
        } else {
            content.style.display = 'block'
            minimizeBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            `
        }
    })

    header.appendChild(title)
    header.appendChild(minimizeBtn)

    // Improved Drag Logic
    let currentX = 0;
    let currentY = 0;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;
    let dragAnimationFrame;

    function dragStart(e) {
        if (e.type === "touchstart") {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }

        if (e.target.closest('.minimize-button') || e.target.closest('.patch-collector-button')) {
            return;
        }

        header.style.cursor = 'grabbing';
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
    }

    function drag(e) {
        e.preventDefault();

        if (e.type === "touchmove") {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
        } else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
        }

        xOffset = currentX;
        yOffset = currentY;

        // Use requestAnimationFrame for smoother performance
        if (dragAnimationFrame) {
            cancelAnimationFrame(dragAnimationFrame);
        }

        dragAnimationFrame = requestAnimationFrame(() => {
            container.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        });
    }

    function dragEnd() {
        initialX = currentX;
        initialY = currentY;

        header.style.cursor = 'grab';
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', dragEnd);

        if (dragAnimationFrame) {
            cancelAnimationFrame(dragAnimationFrame);
        }
    }

    header.addEventListener('mousedown', dragStart);

    container.appendChild(header)

    const tabs = createTabSystem()

    const settingsPanel = document.createElement('div')
    settingsPanel.className = 'settings-panel'

    const deviceSelect = createDeviceSelect()
    const deviceLabel = document.createElement('div')
    deviceLabel.className = 'settings-label'
    deviceLabel.textContent = 'Device'

    const sortSelect = document.createElement('select')
    sortSelect.className = 'patch-collector-select'

    const sortOptions = [
        { value: 'rating', text: 'Rating (highest first)' },
        { value: 'thecount', text: 'Downloads (most first)' }
    ]

    sortOptions.forEach(option => {
        const optionElement = document.createElement('option')
        optionElement.value = option.value
        optionElement.text = option.text
        sortSelect.appendChild(optionElement)
    })

    const sortLabel = document.createElement('div')
    sortLabel.className = 'settings-label'
    sortLabel.textContent = 'Sort by'

    settingsPanel.appendChild(deviceLabel)
    settingsPanel.appendChild(deviceSelect)
    settingsPanel.appendChild(sortLabel)
    settingsPanel.appendChild(sortSelect)

    const searchPanel = document.createElement('div')
    searchPanel.className = 'search-panel'

    const search = createSearchInput()

    const downloadKeywordBtn = createButton('Search & Download', async () => {
        const deviceChoice = deviceSelect.value
        if (!deviceChoice) {
            alert('Please select a device')
            return
        }

        const searchTerm = search.input.value.trim()
        if (!searchTerm) {
            search.input.focus()
            return
        }

        const numPages = parseInt(search.pageInput.value, 10) || 1
        const sortBy = sortSelect.value

        progressManager.show()
        let totalPatches = 0
        let downloadedPatches = 0

        try {
            for (let page = 1; page <= numPages; page++) {
                progressManager.updateProgress(page - 1, numPages, `Scanning page ${page}/${numPages}`)

                const url = buildSearchUrl(deviceChoice, page, searchTerm, sortBy)
                if (!url) {
                    progressManager.showError('Invalid device selection')
                    return
                }

                const doc = await fetchPage(url)
                if (!doc) {
                    progressManager.updateProgress(page - 1, numPages, `Failed to fetch page ${page}`)
                    continue
                }

                const buttons = getDownloadButtons(doc)
                totalPatches += buttons.length

                for (const button of buttons) {
                    downloadedPatches++

                    progressManager.updateProgress(downloadedPatches, totalPatches, `Downloading\n${formatProgressText(downloadedPatches, totalPatches)}`)

                    await downloadPatchWithMetadata(button);

                    await new Promise(resolve => setTimeout(resolve, 1))
                }
            }

            if (downloadedPatches > 0) {
                progressManager.showSuccess(`Successfully downloaded ${downloadedPatches} patches`)
            } else {
                progressManager.showError('No patches found')
            }
        } catch (error) {
            console.error('Download error:', error)
            progressManager.showError('Failed to download patches')
        }
    })
    downloadKeywordBtn.classList.add('primary-button')

    const downloadCurrentBtn = createButton('Download Current Page', async () => {
        const deviceChoice = deviceSelect.value
        if (!deviceChoice) {
            alert('Please select a device')
            return
        }

        progressManager.show()
        progressManager.updateProgress(0, 1, 'Downloading current page...')

        try {
            const buttons = getDownloadButtons(document)
            if (!buttons.length) {
                progressManager.showError('No patches found on current page')
                return
            }

            let downloadedPatches = 0
            for (const button of buttons) {
                downloadedPatches++

                progressManager.updateProgress(downloadedPatches, buttons.length, `Downloading\n${formatProgressText(downloadedPatches, buttons.length)}`)

                await downloadPatchWithMetadata(button);

                await new Promise(resolve => setTimeout(resolve, 1))
            }

            if (downloadedPatches > 0) {
                progressManager.showSuccess(`Successfully downloaded ${downloadedPatches} patches`)
            } else {
                progressManager.showError('No patches found')
            }
        } catch (error) {
            console.error('Download error:', error)
            progressManager.showError('Failed to download patches')
        }
    })
    downloadCurrentBtn.classList.add('secondary-button')

    searchPanel.appendChild(search.container)
    searchPanel.appendChild(downloadKeywordBtn)
    searchPanel.appendChild(downloadCurrentBtn)

    search.decrementButton.addEventListener('click', () => {
        let value = parseInt(search.pageInput.value, 10) || 1
        if (value > 1) {
            search.pageInput.value = value - 1
        }
    })

    search.incrementButton.addEventListener('click', () => {
        let value = parseInt(search.pageInput.value, 10) || 1
        search.pageInput.value = value + 1
    })

    const bulkPanel = document.createElement('div')
    bulkPanel.className = 'bulk-panel'

    const pageCountContainer = document.createElement('div')
    pageCountContainer.className = 'page-control'
    pageCountContainer.innerHTML = `
        <div class="page-control-label">Pages to download:</div>
        <div class="page-control-buttons">
            <button class="control-button" id="decrementBulkPage">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <input type="number" class="page-display page-input" value="5" min="1" max="100">
            <button class="control-button" id="incrementBulkPage">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    `

    const pageCountInput = pageCountContainer.querySelector('.page-input')
    const decrementBulkPageBtn = pageCountContainer.querySelector('#decrementBulkPage')
    const incrementBulkPageBtn = pageCountContainer.querySelector('#incrementBulkPage')

    bulkPanel.appendChild(pageCountContainer)

    const downloadAllBtn = createButton('Download All Patches', async () => {
        const deviceChoice = deviceSelect.value
        if (!deviceChoice) {
            alert('Please select a device')
            return
        }

        const numPages = parseInt(pageCountInput.value, 10) || 5
        const sortBy = sortSelect.value

        progressManager.show()
        let totalScannedPages = 0
        let totalPatches = 0
        let downloadedPatches = 0

        try {
            for (let page = 1; page <= numPages; page++) {
                progressManager.updateProgress(page - 1, numPages, `Scanning page ${page}/${numPages}`)

                const url = buildSearchUrl(deviceChoice, page, '', sortBy)
                if (!url) {
                    progressManager.showError('Invalid device selection')
                    return
                }

                const doc = await fetchPage(url)
                if (!doc) {
                    progressManager.updateProgress(page - 1, numPages, `Failed to fetch page ${page}`)
                    continue
                }

                totalScannedPages++

                const buttons = getDownloadButtons(doc)
                if (!buttons.length) {
                    continue
                }

                totalPatches += buttons.length

                for (const button of buttons) {
                    downloadedPatches++

                    progressManager.updateProgress(downloadedPatches, totalPatches, `Downloading\n${formatProgressText(downloadedPatches, totalPatches)}`)

                    await downloadPatchWithMetadata(button);

                    await new Promise(resolve => setTimeout(resolve, 1))
                }
            }

            if (downloadedPatches > 0) {
                progressManager.showSuccess(`Successfully downloaded ${downloadedPatches} patches`)
            } else {
                progressManager.showError('No patches found')
            }
        } catch (error) {
            console.error('Download error:', error)
            progressManager.showError('Failed to download patches')
        }
    })
    downloadAllBtn.classList.add('primary-button')
    bulkPanel.appendChild(downloadAllBtn)

    decrementBulkPageBtn.addEventListener('click', () => {
        let value = parseInt(pageCountInput.value, 10) || 5
        if (value > 1) {
            pageCountInput.value = value - 1
        }
    })

    incrementBulkPageBtn.addEventListener('click', () => {
        let value = parseInt(pageCountInput.value, 10) || 5
        pageCountInput.value = value + 1
    })

    tabs.addTab('settings', 'Settings', settingsPanel, true)
    tabs.addTab('search', 'Search', searchPanel)
    tabs.addTab('bulk', 'Bulk', bulkPanel)

    container.appendChild(tabs.container)

    const progressContainer = document.createElement('div')
    progressContainer.className = 'progress-container'
    container.appendChild(progressContainer)

    progressManager = createProgressManager(progressContainer)

    // Drag logic was here but moved into createUI to use closure scope correctly
    // or integrated within createUI as implemented in this overwrite.

    const createBuyMeCoffeeButton = () => {
        const wrapper = document.createElement('div')
        wrapper.className = 'bmc-wrapper'

        const link = document.createElement('a')
        link.href = 'https://buymeacoffee.com/opesoid'
        link.target = '_blank'
        link.className = 'bmc-button'

        // SVG Icon for Coffee Cup
        const svgIcon = `
            <svg class="bmc-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2,21H20V19H2M20,8H18V5H20M20,3H4V13A4,4 0 0,0 8,17H14A4,4 0 0,0 18,13V10H20A2,2 0 0,0 22,8V5C22,3.89 21.1,3 20,3Z" />
            </svg>
        `

        link.innerHTML = `${svgIcon} Buy me a coffee`
        wrapper.appendChild(link)
        return wrapper
    }

    const createFooter = () => {
        const footer = document.createElement('div')
        footer.className = 'patch-collector-footer'

        // Version and Links
        const guideUrl = chrome.runtime.getURL('guide.html')
        const privacyUrl = chrome.runtime.getURL('privacy_policy.html')

        footer.innerHTML = `
            v1.1 • <a href="${guideUrl}" target="_blank">User Guide</a> • <a href="${privacyUrl}" target="_blank">Privacy Policy</a> • <a href="https://opes.dev" target="_blank">Opes.dev</a>
            <div class="footer-disclaimer">
                Not affiliated with Line 6 or Yamaha Guitar Group, Inc.
            </div>
        `
        return footer
    }

    container.appendChild(createBuyMeCoffeeButton())
    container.appendChild(createFooter())

    document.body.appendChild(container)
    return container
}

const handleDownloadButtonClick = async (event) => {
    const button = event.target.closest('.download-tone');
    if (!button) return;


    event.preventDefault();
    event.stopPropagation();

    await downloadPatchWithMetadata(button);
}

const addDownloadButtonListener = () => {
    document.addEventListener('click', handleDownloadButtonClick, true);
}