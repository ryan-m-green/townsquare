function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    } else {
        console.error('Screen not found:', screenId);
        return;
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Toggle Favorite Function
function toggleFavorite(button, businessName) {
    // Toggle the heart icon between outline and filled
    if (button.textContent === '♡') {
        // Add to favorites
        button.textContent = '♥';
        button.style.color = '#E67E50';
        
        // Show a notification
        showNotification(`Added ${businessName} to favorites!`);
        
        // In a real app, this would save to backend/localStorage
        console.log(`Added ${businessName} to favorites`);
    } else {
        // Remove from favorites
        button.textContent = '♡';
        button.style.color = 'white';
        
        // Show a notification
        showNotification(`Removed ${businessName} from favorites`);
        
        // In a real app, this would remove from backend/localStorage
        console.log(`Removed ${businessName} from favorites`);
    }
}

// Show notification toast
function showNotification(message) {
    // Remove existing notification if any
    const existing = document.querySelector('.toast-notification');
    if (existing) {
        existing.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'toast-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: #4A5859;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideDown 0.3s ease;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 2 seconds
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Simulate image upload functionality
document.addEventListener('DOMContentLoaded', function() {
    // Handle background image upload
    const bgUploadBtn = document.querySelector('.background-image-upload .btn-secondary');
    if (bgUploadBtn) {
        bgUploadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            simulateImageUpload('background');
        });
    }
    
    // Handle gallery image uploads
    const uploadSlotBtns = document.querySelectorAll('.upload-slot-btn');
    uploadSlotBtns.forEach((btn, index) => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            simulateImageUpload('gallery', index);
        });
    });
    
    // Handle business hours checkboxes
    const hoursCheckboxes = document.querySelectorAll('.hours-checkbox');
    hoursCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            toggleBusinessHours(this);
        });
    });
});

function toggleBusinessHours(checkbox) {
    const row = checkbox.closest('.hours-day-row');
    const timeInputs = row.querySelectorAll('.time-input');
    
    if (checkbox.checked) {
        // Enable time inputs
        timeInputs.forEach(input => {
            input.disabled = false;
        });
        row.classList.remove('closed');
    } else {
        // Disable time inputs
        timeInputs.forEach(input => {
            input.disabled = true;
        });
        row.classList.add('closed');
    }
}

function simulateImageUpload(type, index) {
    // In a real app, this would open a file picker
    // For this demo, we'll just show a visual change
    
    if (type === 'background') {
        const preview = document.querySelector('.background-preview-placeholder');
        if (preview) {
            preview.innerHTML = `
                <div style="color: #7A9B76; text-align: center;">
                    <div style="font-size: 32px; margin-bottom: 10px;">✓</div>
                    <div style="font-size: 14px;">Image Uploaded!</div>
                    <div style="font-size: 12px; margin-top: 5px; color: #999;">bookstore-interior.jpg</div>
                </div>
            `;
            preview.parentElement.style.borderColor = '#7A9B76';
            preview.parentElement.style.borderStyle = 'solid';
        }
    } else if (type === 'gallery') {
        const slots = document.querySelectorAll('.image-upload-slot');
        const slot = slots[index];
        if (slot) {
            const preview = slot.querySelector('.image-slot-preview');
            const btn = slot.querySelector('.upload-slot-btn');
            
            preview.innerHTML = `
                <div style="color: #7A9B76; font-size: 18px;">✓</div>
                <div style="font-size: 11px; margin-top: 5px; color: #7A9B76;">Uploaded</div>
                <button class="remove-image-btn" onclick="removeImage(${index})">×</button>
            `;
            btn.textContent = 'Replace';
            btn.classList.add('uploaded');
            slot.style.borderColor = '#7A9B76';
            slot.style.borderStyle = 'solid';
        }
    }
}

function removeImage(index) {
    const slots = document.querySelectorAll('.image-upload-slot');
    const slot = slots[index];
    if (slot) {
        const preview = slot.querySelector('.image-slot-preview');
        const btn = slot.querySelector('.upload-slot-btn');
        
        preview.innerHTML = `
            <span style="font-size: 24px;">📷</span>
            <div style="font-size: 11px; margin-top: 5px;">Image ${index + 1}</div>
        `;
        btn.textContent = 'Upload';
        btn.classList.remove('uploaded');
        slot.style.borderColor = '#ddd';
        slot.style.borderStyle = 'dashed';
    }
}

// Feature Voting Functions
function handleVote(button, voteType, featureId) {
    // Get the parent card
    const card = button.closest('.feature-vote-card');
    const voteButtons = card.querySelector('.vote-buttons');
    const statusMsg = card.querySelector('.vote-status-msg');
    const yesBtn = voteButtons.querySelector('.btn-vote-yes');
    const noBtn = voteButtons.querySelector('.btn-vote-no');
    
    // Check if user already voted
    const hasVoted = yesBtn.classList.contains('active') || noBtn.classList.contains('active');
    
    if (hasVoted) {
        // User is changing their vote or removing it
        if (button.classList.contains('active')) {
            // Clicking the same button - remove vote
            button.classList.remove('active');
            statusMsg.style.display = 'none';
        } else {
            // Switching vote
            yesBtn.classList.remove('active');
            noBtn.classList.remove('active');
            button.classList.add('active');
            statusMsg.style.display = 'block';
            statusMsg.textContent = voteType === 'yes' ? 'You voted Yes on this feature' : 'You voted No on this feature';
        }
    } else {
        // First time voting
        button.classList.add('active');
        statusMsg.style.display = 'block';
        statusMsg.textContent = voteType === 'yes' ? 'You voted Yes on this feature' : 'You voted No on this feature';
    }
    
    // In a real app, this would make an API call to save the vote
    console.log(`Vote recorded: ${voteType} for feature ${featureId}`);
}

function submitFeature() {
    // In a real app, this would validate the form and submit to the backend
    alert('Feature proposal submitted! It will be open for voting for 30 days.');
    showScreen('feature-voting');
}

// Workshop Registration Function
function registerWorkshop(button) {
    // Check if already registered
    if (button.disabled) {
        return;
    }
    
    // Disable the button
    button.disabled = true;
    
    // Change text to "Registered"
    button.textContent = '✓ Registered';
    
    // Update styling to show registered state
    button.style.background = '#7A9B76';
    button.style.borderColor = '#7A9B76';
    button.style.color = 'white';
    button.style.cursor = 'not-allowed';
    button.style.opacity = '0.8';
    
    // In a real app, this would make an API call to register the user
    console.log('Workshop registration successful');
}
