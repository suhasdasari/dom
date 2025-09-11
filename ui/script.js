document.addEventListener('DOMContentLoaded', function() {
    const landingPage = document.getElementById('landing-page');
    const mainInterface = document.getElementById('main-interface');
    const getStartedBtn = document.getElementById('get-started-btn');
    const micBtn = document.getElementById('mic-btn');
    const closeBtn = document.getElementById('close-btn');

    // Show main interface when Get Started is clicked
    getStartedBtn.addEventListener('click', function() {
        landingPage.classList.remove('active');
        mainInterface.classList.add('active');
    });

    // Handle microphone button click
    micBtn.addEventListener('click', function() {
        console.log('Microphone button clicked');
        // Add your microphone functionality here
        // For example: start/stop recording, toggle mute, etc.
    });

    // Handle close button click
    closeBtn.addEventListener('click', function() {
        console.log('Close button clicked');
        // Return to landing page
        mainInterface.classList.remove('active');
        landingPage.classList.add('active');
    });

    // Add some interactive feedback
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = '';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
});
