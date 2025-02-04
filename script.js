/************************************************
  script.js
  Prevents "already declared" & "null" errors
************************************************/

// 1) Fade out the black overlay when “Yes, show me!” is clicked
function startSurprise() {
  const intro = document.getElementById('intro');
  intro.style.opacity = '0';

  // After 1s, hide overlay & show main content
  setTimeout(() => {
    intro.style.display = 'none';
    document.getElementById('main').style.opacity = '1';
  }, 1000);
}

// 2) Grab references ONCE
const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const loveMessage = document.getElementById('love-message');
const hugGif = document.getElementById('hugGif');

// 3) “No” button
if (noBtn) {
  noBtn.addEventListener('click', () => {
    alert("No way, bubs pressed this one is a mistake!");
  });
} else {
  console.error("No button with id='noBtn' found!");
}

// 4) “Yes” button toggles message & GIF
if (yesBtn) {
  yesBtn.addEventListener('click', () => {
    loveMessage.classList.toggle('show');
    if (loveMessage.classList.contains('show')) {
      hugGif.classList.add('hidden');
    } else {
      hugGif.classList.remove('hidden');
    }
  });
} else {
  console.error("No button with id='yesBtn' found!");
}

/************************************************
  Optional hidden download function:
  - Use in console: hiddenDownload()
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
