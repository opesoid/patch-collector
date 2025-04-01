const downloadCurrentPage = async (saveMetadata = false) => {
    const buttons = getDownloadButtons(document)
    if (!buttons.length) return

    for (const button of buttons) {
        await downloadPatchWithMetadata(button, saveMetadata);
        
        // Add a small delay to prevent browser throttling
        await new Promise(resolve => setTimeout(resolve, 300))
    }
}

const downloadAllPages = async (deviceChoice, numPages, saveMetadata = false) => {
    const devicePattern = DEVICE_OPTIONS[deviceChoice]
    if (!devicePattern) return

    for (let page = 1; page <= numPages; page++) {
        const url = buildSearchUrl(deviceChoice, page)
        const doc = await fetchPage(url)
        
        if (!doc) continue

        const buttons = getDownloadButtons(doc)
        if (!buttons.length) {
            console.log(`No patches found on page ${page}`)
            continue
        }

        for (const button of buttons) {
            await downloadPatchWithMetadata(button, saveMetadata);
            
            // Add a small delay to prevent browser throttling
            await new Promise(resolve => setTimeout(resolve, 300))
        }
    }
}

const downloadKeywordPatches = async (deviceChoice, searchTerm, numPages, saveMetadata = false) => {
    const devicePattern = DEVICE_OPTIONS[deviceChoice]
    if (!devicePattern) return

    for (let page = 1; page <= numPages; page++) {
        const url = buildSearchUrl(deviceChoice, page, searchTerm)
        const doc = await fetchPage(url)
        
        if (!doc) continue

        const buttons = getDownloadButtons(doc)
        if (!buttons.length) {
            console.log(`No patches found on page ${page}`)
            continue
        }

        for (const button of buttons) {
            await downloadPatchWithMetadata(button, saveMetadata);
            
            // Add a small delay to prevent browser throttling
            await new Promise(resolve => setTimeout(resolve, 300))
        }
    }
}