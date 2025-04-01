const extractToneId = button => button.id.split('-')[1]

const createDownloadLink = (toneId, patchInfo = null) => {
    const link = document.createElement('a')
    link.href = `${BASE_URL}/tone/deliver/${toneId}`
    
    // If patch info is provided, create a consistent filename
    if (patchInfo) {
        // Create a safe filename based on the patch name and ID
        let safeName = 'unknown_patch';
        
        // Make sure we have a valid patch name
        if (patchInfo.name && patchInfo.name !== 'Unknown Patch') {
            safeName = patchInfo.name
                .replace(/[^a-z0-9]/gi, '_')
                .replace(/_+/g, '_')
                .toLowerCase();
        }
        
        // Log the patch info for debugging
        console.log('Creating download link for patch:', patchInfo);
        
        // Set a specific filename pattern
        link.download = `line6_patch_${toneId}_${safeName}.hlx`
    } else {
        // Default behavior - browser will use server-provided filename
        link.download = ''
    }
    
    return link
}

const triggerDownload = link => {
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

const fetchPage = async url => {
    try {
        const response = await fetch(url)
        const html = await response.text()
        const tempDoc = document.createElement('html')
        tempDoc.innerHTML = html
        return tempDoc
    } catch (error) {
        console.error("Failed to fetch page:", error)
        return null
    }
}

const buildSearchUrl = (deviceChoice, page, searchTerm = '', sortBy = 'rating') => {
    const devicePattern = DEVICE_OPTIONS[deviceChoice]
    if (!devicePattern) return null

    const baseSearchPath = searchTerm ? '/customtone/search' : '/customtone/browse'
    const encodedTerm = encodeURIComponent(searchTerm)
    return `https://line6.com${baseSearchPath}${devicePattern}${page}/?sort=${sortBy}&sort_dir=desc&search_term=${encodedTerm}`
}

const getDownloadButtons = doc => 
    Array.from(doc.querySelectorAll('a.deliver_tone.customtone'))

const extractPatchInfo = button => {
    const toneId = extractToneId(button)
    
    // First try the parent .tone_details container
    let container = button.closest('.tone_details')
    if (container) {
        const name = container.querySelector('.tone_name')?.textContent?.trim()
        const author = container.querySelector('.tone_author')?.textContent?.trim()
        if (name) {
            return {
                id: toneId,
                name: name,
                author: author || 'Unknown Author'
            }
        }
    }
    
    // Try finding the closest table row
    container = button.closest('tr')
    if (container) {
        // The name is usually in the first cell
        const nameCell = container.cells[0]
        const name = nameCell?.querySelector('a')?.textContent?.trim()
        // Author is usually in the second cell
        const author = container.cells[1]?.textContent?.trim()
        if (name) {
            return {
                id: toneId,
                name: name,
                author: author || 'Unknown Author'
            }
        }
    }
    
    // Try finding the closest .tone-container (new layout)
    container = button.closest('.tone-container')
    if (container) {
        const name = container.querySelector('.tone-name')?.textContent?.trim()
        const author = container.querySelector('.tone-author')?.textContent?.trim()
        if (name) {
            return {
                id: toneId,
                name: name,
                author: author || 'Unknown Author'
            }
        }
    }
    
    // If all else fails, try to find any nearby text that might be the name
    const nearbyText = button.parentElement?.textContent?.trim()
    if (nearbyText && nearbyText !== 'Download') {
        return {
            id: toneId,
            name: nearbyText,
            author: 'Unknown Author'
        }
    }
    
    // Last resort fallback
    return {
        id: toneId,
        name: `Patch ${toneId}`,
        author: 'Unknown Author'
    }
}

const extractComprehensiveMetadata = (button) => {
    const toneId = extractToneId(button)
    let metadata = {
        id: toneId,
        name: 'Unknown Patch',
        author: 'Unknown Author',
        device: 'Unknown Device',
        date_posted: '',
        downloads: 0,
        rating: 0,
        genres: [],
        song: '',
        band: '',
        guitarist: '',
        comment: '',
        url: `${BASE_URL}/tone/${toneId}/`
    }
    
    // Find the tone container
    let toneContainer = button.closest('.tone')
    if (!toneContainer) {
        // Try alternative container structures
        toneContainer = button.closest('tr')
        if (!toneContainer) {
            toneContainer = button.closest('.tone-container')
            if (!toneContainer) {
                // Return basic metadata if we can't find the container
                return extractPatchInfo(button)
            }
        }
    }
    
    // Extract device info
    const deviceImg = toneContainer.querySelector('.product_icon')
    if (deviceImg) {
        metadata.device = deviceImg.getAttribute('alt') || metadata.device
    }
    
    // Extract author
    const authorLink = toneContainer.querySelector('a[href*="/customtone/profile/"]')
    if (authorLink) {
        metadata.author = authorLink.textContent.trim()
    }
    
    // Extract tone name
    const toneNameLink = toneContainer.querySelector('a[href*="/customtone/tone/"]')
    if (toneNameLink) {
        const toneName = toneNameLink.textContent.replace('TONE NAME:', '').trim()
        if (toneName) metadata.name = toneName
    }

    // If we still don't have a name, try alternative selectors
    if (metadata.name === 'Unknown Patch') {
        // Try to find the tone name in other common locations
        const possibleNameElements = [
            toneContainer.querySelector('.tone-name'),
            toneContainer.querySelector('.tone_name'),
            toneContainer.querySelector('h3'),
            toneContainer.querySelector('h4'),
            toneContainer.querySelector('strong'),
            // Try to find any element with "tone" and "name" in the class
            ...Array.from(toneContainer.querySelectorAll('[class*="tone"][class*="name"]')),
            ...Array.from(toneContainer.querySelectorAll('[class*="tone_name"]'))
        ].filter(Boolean);
        
        for (const element of possibleNameElements) {
            const text = element.textContent.trim();
            if (text && text !== 'Download' && text.length > 1) {
                metadata.name = text;
                break;
            }
        }
        
        // If still no name, try to get it from the URL
        if (metadata.name === 'Unknown Patch') {
            const toneUrl = toneNameLink?.getAttribute('href');
            if (toneUrl) {
                const urlParts = toneUrl.split('/');
                const lastPart = urlParts[urlParts.length - 1];
                if (lastPart && !isNaN(parseInt(lastPart))) {
                    // This is just the ID, try the part before
                    const possibleName = urlParts[urlParts.length - 2];
                    if (possibleName && possibleName !== 'tone') {
                        metadata.name = possibleName.replace(/-/g, ' ');
                    }
                }
            }
        }
    }

    // Extract date posted
    const dateElement = toneContainer.querySelector('.date')
    if (dateElement) {
        const dateText = dateElement.textContent.trim()
        const dateMatch = dateText.match(/\d{1,2}\/\d{1,2}\/\d{2,4}/)
        if (dateMatch) metadata.date_posted = dateMatch[0]
    }
    
    // Extract downloads
    const downloadsText = toneContainer.textContent.match(/(\d+)\s*downloads/)
    if (downloadsText && downloadsText[1]) {
        metadata.downloads = parseInt(downloadsText[1], 10)
    }
    
    // Extract genres
    const genreElements = toneContainer.querySelectorAll('ul.col-xs-4 li')
    if (genreElements.length > 0) {
        genreElements.forEach(el => {
            const genreText = el.textContent.trim()
            if (genreText) {
                // Split by commas if multiple genres are in one element
                const genres = genreText.split(',').map(g => g.trim()).filter(g => g)
                metadata.genres.push(...genres)
            }
        })
    }
    
    // Extract song, band, guitarist info
    const detailsLists = toneContainer.querySelectorAll('.details ul')
    detailsLists.forEach(list => {
        const items = list.querySelectorAll('li')
        items.forEach(item => {
            const text = item.textContent.trim()
            if (text.startsWith('SONG:')) {
                metadata.song = text.replace('SONG:', '').trim()
            } else if (text.startsWith('BAND:')) {
                metadata.band = text.replace('BAND:', '').trim()
            } else if (text.startsWith('GUITARIST:')) {
                metadata.guitarist = text.replace('GUITARIST:', '').trim()
            }
        })
    })
    
    // Extract comment
    const commentElement = toneContainer.querySelector('.comment')
    if (commentElement) {
        metadata.comment = commentElement.textContent.trim()
    }
    
    // Extract rating if available
    const raterElement = toneContainer.querySelector('.ratetone')
    if (raterElement && raterElement.id) {
        const ratingId = raterElement.id.replace('ratetone-', '')
        // Try to find the rating value from the script that initializes the rater
        const scripts = document.querySelectorAll('script')
        for (const script of scripts) {
            if (script.textContent.includes(`ratetone-${ratingId}`)) {
                const ratingMatch = script.textContent.match(new RegExp(`ratetone-${ratingId}.*?value:\\s*(\\d+)`))
                if (ratingMatch && ratingMatch[1]) {
                    metadata.rating = parseInt(ratingMatch[1], 10)
                    break
                }
            }
        }
    }
    
    return metadata
}

const downloadPatchAndGetFilename = async (toneId) => {
    try {
        // Fetch the patch file to get the actual filename from headers
        const response = await fetch(`${BASE_URL}/tone/deliver/${toneId}`, {
            method: 'GET'
        });
        
        // Get the filename from the Content-Disposition header
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = '';
        
        if (contentDisposition) {
            // Extract filename from the header
            const filenameMatch = contentDisposition.match(/filename="(.+?)"/i);
            if (filenameMatch && filenameMatch[1]) {
                filename = filenameMatch[1];
            } else {
                // Try alternative format
                const filenameMatch2 = contentDisposition.match(/filename=(.+?)(;|$)/i);
                if (filenameMatch2 && filenameMatch2[1]) {
                    filename = filenameMatch2[1].trim();
                }
            }
        }
        
        // If we couldn't get the filename from headers, create a default one
        if (!filename) {
            filename = `patch_${toneId}.hlx`;
        }
        
        // Create a blob from the response
        const blob = await response.blob();
        
        // Return both the blob and filename
        return { blob, filename };
    } catch (error) {
        console.error('Error downloading patch:', error);
        return { blob: null, filename: `patch_${toneId}.hlx` };
    }
};

const triggerBlobDownload = (blob, filename) => {
    if (!blob) return false;
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a download link
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
};

const downloadPatchWithMetadata = async (button, saveMetadata = false) => {
    try {
        const toneId = extractToneId(button);
        const metadata = extractComprehensiveMetadata(button);
        
        // Download the patch and get its actual filename
        const { blob, filename } = await downloadPatchAndGetFilename(toneId);
        
        // Extract the base filename without extension
        const baseFilename = filename.replace(/\.[^/.]+$/, '');
        
        // Update metadata with the actual filename
        metadata.filename = filename;
        
        // If the patch name is unknown, use the filename (without extension) as the name
        if (metadata.name === 'Unknown Patch') {
            // Remove file extension and replace underscores with spaces
            metadata.name = baseFilename.replace(/_/g, ' ');
            console.log('Using filename as patch name:', metadata.name);
        }
        
        // Trigger the download with the actual filename
        triggerBlobDownload(blob, filename);
        
        // Save metadata if requested
        if (saveMetadata) {
            // Create metadata blob
            const metadataBlob = new Blob(
                [JSON.stringify(metadata, null, 2)],
                { type: 'application/json' }
            );
            
            // Trigger metadata download
            triggerBlobDownload(metadataBlob, `${baseFilename}_metadata.json`);
        }
        
        return true;
    } catch (error) {
        console.error('Error downloading patch with metadata:', error);
        return false;
    }
};

const saveMetadataToFile = async (metadata) => {
    try {
        // Create a Blob with the metadata JSON
        const metadataBlob = new Blob(
            [JSON.stringify(metadata, null, 2)], 
            { type: 'application/json' }
        )
        
        // Create a safe filename based on the patch name
        const safeName = metadata.name
            .replace(/[^a-z0-9]/gi, '_')
            .replace(/_+/g, '_')
            .toLowerCase()
        
        // Log the metadata for debugging
        console.log('Saving metadata:', metadata);
        
        // Create a download URL for the metadata file
        const metadataUrl = URL.createObjectURL(metadataBlob)
        
        // Create a download link for the metadata
        const metadataLink = document.createElement('a')
        metadataLink.href = metadataUrl
        // Match the patch filename pattern but with _metadata.json suffix
        metadataLink.download = `line6_patch_${metadata.id}_${safeName}_metadata.json`
        
        // Trigger the download
        document.body.appendChild(metadataLink)
        metadataLink.click()
        
        // Clean up
        document.body.removeChild(metadataLink)
        URL.revokeObjectURL(metadataUrl)
        
        return true
    } catch (error) {
        console.error('Failed to save metadata:', error)
        return false
    }
}