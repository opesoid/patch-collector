let container = null

const initializePatchCollector = async () => {
    // Check if extension is enabled
    const { enabled = false } = await chrome.storage.sync.get('enabled')
    if (!enabled) {
        removeUI()
        return
    }
    
    if (document.readyState === 'complete') {
        await createUIWrapper()
    } else {
        window.addEventListener('load', createUIWrapper)
    }
}

const createUIWrapper = async () => {
    removeUI()
    container = await createUI()
}

const removeUI = () => {
    if (container) {
        container.remove()
        container = null
    }
    
    // Also check for any orphaned containers
    const existingContainer = document.getElementById('patch-collector-container')
    if (existingContainer) {
        existingContainer.remove()
    }
}

// Listen for toggle messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'TOGGLE_EXTENSION') {
        if (message.enabled) {
            createUIWrapper()
        } else {
            removeUI()
        }
    }
})

initializePatchCollector()