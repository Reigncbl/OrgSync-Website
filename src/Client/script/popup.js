// Show popup only once per session
window.onload = function() {
    if (!sessionStorage.getItem("popupShown")) {
      showPopup();
      sessionStorage.setItem("popupShown", "true");
    }
  };
  
  // Show popup function
  function showPopup() {
    document.getElementById("popupOverlay").classList.remove("hidden");
    document.getElementById("popupBox").classList.remove("hidden");
  }
  
  // Close popup function
  function closePopup() {
    document.getElementById("popupOverlay").classList.add("hidden");
    document.getElementById("popupBox").classList.add("hidden");
  }

  // Prevent scrolling when popup is open
  function showPopup() {
    const overlay = document.getElementById('popupOverlay');
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; 
  }
  
  // Restore scrolling
  function closePopup() {
    const overlay = document.getElementById('popupOverlay');
    overlay.classList.add('hidden');
    document.body.style.overflow = ''; 
  }

  