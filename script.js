/************************************************
  script.js
  All JavaScript logic separate from the HTML.
************************************************/

// 1) Fade out the black overlay when “Yes, show me!” is clicked
function startSurprise() {
  const intro = document.getElementById('intro');
  intro.style.opacity = '0';

  // After 1s, hide the overlay & show main content
  setTimeout(() => {
    intro.style.display = 'none';
    document.getElementById('main').style.opacity = '1';
  }, 1000);
}

// 2) Grab the “No” and “Yes” buttons from the main content
const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');

// 3) Define logic for “No” button
noBtn.addEventListener('click', () => {
  alert("No way, bubs pressed this one is a mistake!");
});

// 4) Define logic for “Yes” button (toggles the message & GIF)
const loveMessage = document.getElementById('love-message');
const hugGif = document.getElementById('hugGif');

yesBtn.addEventListener('click', () => {
  // Toggle the 'show' class to reveal/hide the love message
  loveMessage.classList.toggle('show');

  // If the message is shown, hide the GIF; otherwise show it
  if (loveMessage.classList.contains('show')) {
    hugGif.classList.add('hidden');
  } else {
    hugGif.classList.remove('hidden');
  }
});

/************************************************
  Optional hidden download function:
  - Call hiddenDownload() in the console to download
    Surprise.html (as a data URL).
************************************************/
/*
function hiddenDownload() {
  const htmlContent = document.documentElement.outerHTML;
  const link = document.createElement('a');
  link.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent);
  link.download = 'Surprise.html';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
*/

