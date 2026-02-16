// Environment Indicator - Vanilla JavaScript
// This script will be added to the HTML head

export const environmentIndicatorScript = `
<script>
(function() {
  // Wait for DOM to be ready
  function addEnvironmentIndicator() {
    // Detect environment from URL
    const url = window.location.href;
    let environment = 'development';
    let label = 'DEV';
    let className = 'dev';
    
    if (url.includes('/websekolah-staging/')) {
      environment = 'staging';
      label = 'STAGING';
      className = 'staging';
    } else if (url.includes('/websekolah/')) {
      environment = 'production';
      label = 'PROD';
      className = 'production';
    }
    
    // Create indicator element
    const indicator = document.createElement('div');
    indicator.className = 'environment-indicator ' + className;
    indicator.textContent = label;
    indicator.title = environment.charAt(0).toUpperCase() + environment.slice(1) + ' Environment';
    
    // Add to page
    document.body.appendChild(indicator);
  }
  
  // Add when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addEnvironmentIndicator);
  } else {
    addEnvironmentIndicator();
  }
})();
</script>
`;
