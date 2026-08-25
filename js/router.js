/* ==========================================================================
   Enrutador de la SPA (js/router.js)
   ========================================================================== */

let viewHistory = ['home'];
let onViewChangeCallback = null;

// Registers observer callback for dynamic routing actions
export function onRouteChanged(callback) {
  onViewChangeCallback = callback;
}

// Navigates to a specific screen container in the DOM
export function navigateTo(viewId, data = null) {
  const currentActive = document.querySelector('.app-view.active');
  if (currentActive) {
    currentActive.classList.remove('active');
  }

  // Push to history stack if not duplicates
  if (viewHistory[viewHistory.length - 1] !== viewId) {
    viewHistory.push(viewId);
  }

  const targetView = document.getElementById(`view-${viewId}`);
  if (targetView) {
    targetView.classList.add('active');
  }

  // Notify observer that screen was changed
  if (onViewChangeCallback) {
    onViewChangeCallback(viewId, data);
  }

  // Reset page window viewport scroll position
  window.scrollTo({ top: 0, behavior: 'instant' });
}

// Navigates back in history stack
export function goBack() {
  if (viewHistory.length > 1) {
    viewHistory.pop(); // Pop current view
    const previousView = viewHistory[viewHistory.length - 1];

    const currentActive = document.querySelector('.app-view.active');
    if (currentActive) {
      currentActive.classList.remove('active');
    }

    const targetView = document.getElementById(`view-${previousView}`);
    if (targetView) {
      targetView.classList.add('active');
    }

    // Trigger router callback
    if (onViewChangeCallback) {
      onViewChangeCallback(previousView, null);
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
  } else {
    navigateTo('home');
  }
}

// Returns the view history stack (useful for resets)
export function resetHistory() {
  viewHistory = ['home'];
}
