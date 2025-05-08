// script.js
function downloadContact() {
  const a = document.createElement('a');
  a.href = 'hailey-contact.vcf';
  a.download = 'hailey-contact.vcf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function exchangeContact() {
  document.getElementById('exchangeModal').classList.remove('hidden');
}

function closeExchangeModal() {
  document.getElementById('exchangeModal').classList.add('hidden');
}

// Optional: Enforce mobile-only access
document.addEventListener('DOMContentLoaded', () => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  document.getElementById('desktop-message').style.display = isMobile ? 'none' : 'flex';
  document.getElementById('mobile-content').style.display = isMobile ? 'block' : 'none';
});

document.getElementById('exchangeForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const contact = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    sender: "hailey"
  };

  try {
    const response = await fetch('https://asam-businesscard.onrender.com/api/exchange-contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact)
    });

    if (response.ok) {
      downloadContact(); // Send them your .vcf
      closeExchangeModal();
      alert('Thanks! Your info has been shared via SMS.');
    } else {
      const errorData = await response.json();
      alert('Failed to send contact info: ' + errorData.error);
    }
  } catch (err) {
    alert('An error occurred while sharing your contact info.');
    console.error(err);
  }
});