/************************************************
  script.js
  Single-run guard to avoid re-declarations &
  ID checks to avoid null issues
************************************************/

// If this script has already run, don't run again:
if (!window.__SURPRISE_SCRIPT_LOADED__) {
  window.__SURPRISE_SCRIPT_LOADED__ = true;

  // 1) Attach startSurprise to the window so inline onclick can see it
  window.startSurprise = function() {
    const intro = document.getElementById('intro');
    if (!intro) {
      console.error("No element with id='intro' found!");
      return;
    }

    intro.style.opacity = '0';

    // After 1s, hide overlay & show main content
    setTimeout(() => {
      intro.style.display = 'none';
      const main = document.getElementById('main');
      if (main) {
        main.style.opacity = '1';
      } else {
        console.error("No element with id='main' found!");
      }
    }, 1000);
  };

  // 2) Grab references ONCE (using var so re-including the script won't error)
  var noBtn       = document.getElementById('noBtn');
  var yesBtn      = document.getElementById('yesBtn');
  var loveMessage = document.getElementById('love-message');
  var hugGif      = document.getElementById('hugGif');

  // 3) “No” button
  if (noBtn) {
    noBtn.addEventListener('click', () => {
      alert("No way bubs pressed this one it hasss to be a mistake!");
    });
  } else {
    console.error("No button with id='noBtn' found!");
  }

  // 4) “Yes” button toggles message & GIF
  if (yesBtn) {
    yesBtn.addEventListener('click', () => {
      if (!loveMessage || !hugGif) {
        console.error("Missing 'love-message' or 'hugGif' element!");
        return;
      }

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
}
