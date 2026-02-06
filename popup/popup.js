document.addEventListener('DOMContentLoaded', async () => {
    const toggleSwitch = document.getElementById('extension-toggle')
    const statusText = document.getElementById('status-text')
    const statusIcon = document.getElementById('status-icon')

    const { enabled = false } = await chrome.storage.sync.get('enabled')

    toggleSwitch.checked = enabled
    updateStatusUI(enabled)

    toggleSwitch.addEventListener('change', async (e) => {
        const isEnabled = e.target.checked

        await chrome.storage.sync.set({ enabled: isEnabled })

        updateStatusUI(isEnabled)

        sendToggleMessage(isEnabled)
    })

    function updateStatusUI(isEnabled) {
        statusIcon.className = isEnabled ? 'status-icon active' : 'status-icon inactive'
        statusText.innerText = isEnabled ?
            'Active on CustomTone website. The extension will display when you visit the site.' :
            'Disabled. Enable the toggle to use the extension on CustomTone website.'
    }

    async function sendToggleMessage(isEnabled) {
        try {
            const tabs = await chrome.tabs.query({ url: "https://line6.com/customtone/*" })

            for (const tab of tabs) {
                chrome.tabs.sendMessage(tab.id, {
                    type: 'TOGGLE_EXTENSION',
                    enabled: isEnabled
                })
            }
        } catch (error) {
            console.error('Error sending toggle message:', error)
        }
    }





    const userGuideLink = document.getElementById('user-guide')
    if (userGuideLink) {
        userGuideLink.addEventListener('click', () => {
            chrome.tabs.create({ url: chrome.runtime.getURL('guide.html') })
        })
    }

    const privacyPolicyLink = document.getElementById('privacy-policy')
    if (privacyPolicyLink) {
        privacyPolicyLink.addEventListener('click', () => {
            chrome.tabs.create({ url: chrome.runtime.getURL('privacy_policy.html') })
        })
    }
}) 