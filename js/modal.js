class ModalManager {
    constructor() {
        this.createModal();
        this.setupEventListeners();
    }

    createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'modal-overlay';
        
        this.modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-inner">
                    <div class="modal-header">
                        <h3 class="modal-title">Search Patches</h3>
                    </div>
                    <div class="modal-body">
                        <div class="search-input-container">
                            <div class="search-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input type="text" class="search-input" placeholder="Search patches (e.g., Metal, Clean, Blues)" />
                        </div>
                        <div class="page-control">
                            <div class="page-control-label">Pages to search:</div>
                            <div class="page-control-buttons">
                                <button class="control-button" id="decrementPage">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <div class="page-display">1</div>
                                <button class="control-button" id="incrementPage">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="modal-button button-secondary" id="cancelSearch">Cancel</button>
                        <button class="modal-button button-primary" id="confirmSearch">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Search
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.modal);

        this.keywordInput = this.modal.querySelector('.search-input');
        this.pageDisplay = this.modal.querySelector('.page-display');
        this.decrementButton = this.modal.querySelector('#decrementPage');
        this.incrementButton = this.modal.querySelector('#incrementPage');
        this.cancelButton = this.modal.querySelector('#cancelSearch');
        this.confirmButton = this.modal.querySelector('#confirmSearch');
    }

    setupEventListeners() {
        this.currentPage = 1;
        
        this.decrementButton.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.updatePageDisplay();
            }
        });

        this.incrementButton.addEventListener('click', () => {
            this.currentPage++;
            this.updatePageDisplay();
        });

        this.keywordInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.confirmButton.click();
            }
        });

        this.modal.addEventListener('mousedown', (e) => {
            if (e.target === this.modal) {
                e.preventDefault();
                this.hide();
                this.currentReject?.();
            }
        });
    }

    updatePageDisplay() {
        this.pageDisplay.textContent = this.currentPage;
        this.decrementButton.disabled = this.currentPage <= 1;
    }

    show(options = {}) {
        const { title = 'Search Patches', showSearch = true, confirmText = 'Search' } = options;
        
        return new Promise((resolve, reject) => {
            this.currentResolve = resolve;
            this.currentReject = reject;
            
            // Update modal title
            this.modal.querySelector('.modal-title').textContent = title;
            
            // Show/hide search input
            const searchContainer = this.modal.querySelector('.search-input-container');
            searchContainer.style.display = showSearch ? 'flex' : 'none';
            
            // Update confirm button text
            this.confirmButton.innerHTML = `
                ${showSearch ? `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>` : ''}
                ${confirmText}
            `;
            
            this.modal.classList.add('visible');
            this.keywordInput.value = '';
            this.currentPage = 1;
            this.updatePageDisplay();
            
            document.body.style.overflow = 'hidden';
            
            if (showSearch) {
                setTimeout(() => {
                    this.keywordInput.focus();
                }, 50);
            }

            this.confirmButton.onclick = () => {
                if (showSearch) {
                    const keyword = this.keywordInput.value.trim();
                    if (keyword) {
                        this.hide();
                        resolve({ keyword, pages: this.currentPage });
                    } else {
                        this.keywordInput.focus();
                    }
                } else {
                    this.hide();
                    resolve(this.currentPage);
                }
            };

            this.cancelButton.onclick = () => {
                this.hide();
                reject();
            };
        });
    }

    hide() {
        this.modal.classList.remove('visible');
        document.body.style.overflow = '';
        this.currentResolve = null;
        this.currentReject = null;
    }

    showKeywordSelector() {
        return this.show({
            title: 'Search Patches',
            showSearch: true,
            confirmText: 'Search'
        });
    }

    showPageSelector(title = 'Select Pages') {
        return this.show({
            title,
            showSearch: false,
            confirmText: 'Download'
        });
    }
} 