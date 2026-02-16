// Environment indicator using CSS-only approach
// This will be added to globals.css instead of a React component

export const environmentIndicatorCSS = `
/* Environment Indicator - CSS Only */
.environment-indicator {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  z-index: 50;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: bold;
  color: white;
  cursor: default;
  user-select: none;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.environment-indicator.dev {
  background-color: #10b981; /* green-500 */
}

.environment-indicator.staging {
  background-color: #f59e0b; /* yellow-500 */
}

.environment-indicator.production {
  background-color: #ef4444; /* red-500 */
}
`;
