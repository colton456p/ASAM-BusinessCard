// script.js
function downloadContact() {
    const a = document.createElement('a');
    a.href = 'colton-contact.vcf';
    a.download = 'colton-contact.vcf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  
  function exchangeContact() {
    alert("Exchange functionality requires backend or NFC handling. For now, this is a placeholder.");
  }
  
  // Optional: Enforce mobile-only access
  document.addEventListener('DOMContentLoaded', () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    document.getElementById('desktop-message').style.display = isMobile ? 'none' : 'flex';
    document.getElementById('mobile-content').style.display = isMobile ? 'block' : 'none';
  });
  