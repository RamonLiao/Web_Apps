const blurInput = document.getElementById("blur");
const transparencyInput = document.getElementById("transparency");
const colorInput = document.getElementById("color");
const outlineInput = document.getElementById("outline");
const cssResult = document.getElementById("css-code");
const glassRec = document.querySelector(".glass-preview-rectangle");
let cssResultJson = "";

// Set default values for the preview
blurInput.value = 1;
transparencyInput.value = 0.31;
colorInput.value = "#000";
outlineInput.value = 0;

// Initialise the glass preview with default values
updateGlassPreview();

// Add event listeners to the range sliders
blurInput.addEventListener("input", updateGlassPreview);
transparencyInput.addEventListener("input", updateGlassPreview);
outlineInput.addEventListener("input", updateGlassPreview);

// Add event listener to the color input (color picker)
colorInput.addEventListener("input", () => {
  updateGlassPreview();
  updateCSSCode();
});

function updateGlassPreview() {
  const blurValue = blurInput.value;
  const transparencyValue = transparencyInput.value;
  const colorValue = colorInput.value;
  const outlineValue = outlineInput.value;

  // Update the glass preview rectangle
  glassRec.style.backdropFilter = `blur(${blurValue}px)`;
  glassRec.style.backgroundColor = `rgba(${hexToRgb(
    colorValue
  )}, ${transparencyValue})`;
  glassRec.style.outline = `${outlineValue}px solid ${colorValue}`;

  updateCSSCode();
}

function updateCSSCode() {
  const blurValue = blurInput.value;
  const transparencyValue = transparencyInput.value;
  const colorValue = colorInput.value;
  const outlineValue = outlineInput.value;
  const cssCode = `background-color: rgba(${hexToRgb(
    colorValue
  )}, ${transparencyValue});
  \nbackdrop-filter: blur(${blurValue}px);
  \n-webkit-backdrop-filter: blur(${blurValue}px);
  \noutline: ${outlineValue}px solid ${colorValue};
  \nborder-radius: 10px;
  \nbox-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
   `;

  // Display generated CSS code in the textarea
  cssResult.value = cssCode;

  // Generate CSS code in JS style
  const cssResultObj = {
    /** Format 1:
     * element.style[prop] = newCSSObj[prop];
     *  */
    // backgroundColor: `rgba(${hexToRgb(colorValue)}, ${transparencyValue})`,
    // backdropFilter: `blur(${blurValue}px)`,
    // webkitBackdropFilter: `blur(${blurValue}px)`,
    // outline: `${outlineValue}px solid ${colorValue}`,
    // borderRadius: "10px",
    // boxShadow: `0 4px 6px rgba(0, 0, 0, 0.1)`,

    /** Format 2:
     * element.style.setProperty()
     */
    "background-color": `rgba(${hexToRgb(colorValue)}, ${transparencyValue})`,
    "backdrop-filter": `blur(${blurValue}px)`,
    "-webkit-backdrop-filter": `blur(${blurValue}px)`,
    outline: `${outlineValue}px solid ${colorValue}`,
    "border-radius": "10px",
    "box-shadow": `0 4px 6px rgba(0, 0, 0, 0.1)`,
  };
  cssResultJson = JSON.stringify(cssResultObj);
}

// Helperr function to conver HEX to RGB
function hexToRgb(hex) {
  const shorthandRegax = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegax, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )}`
    : null;
}

// Add event listener to the "Copy To Clipboard" button
const copyButton = document.getElementById("copy-button");
copyButton.addEventListener("click", copyToClipboard);

function copyToClipboard() {
  // Execute copy
  updateClipboard(cssResult.value);

  // Change button text to indicate copying
  copyButton.textContent = "Copied!";

  // Reset button text after a short delay
  setTimeout(() => {
    copyButton.textContent = "Copy To Clipboard";
  }, 1000);
}

// Upadate Clipboard
function updateClipboard(newClip) {
  /** Method 1: execCommand() */
  //   const copyText = cssResult.value;
  //   const textArea = document.createElement("textarea");
  //   textArea.value = copyText;
  //   document.body.appendChild(textArea);
  //   textArea.select();
  //   document.execCommand("copy");
  //   document.body.removeChild(textArea);

  /** Method 2: Clipboard API
   * The clipboard-write permission name is not supported in Firefox, only Chromium browsers.
   */
  navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
    if (result.state === "granted" || result.state === "prompt") {
      navigator.clipboard.writeText(newClip).then(
        () => {
          /* clipboard successfully set */
        },
        (error) => {
          /* clipboard write failed */
          cssResult.select();
          document.execCommand("copy");
          copyButton.focus();

          console.error(error);
        }
      );
    } else {
      cssResult.select();
      document.execCommand("copy");
      copyButton.focus();
    }
  });
}

// Add event listener to the "Test CSS Code" button
const testButton = document.getElementById("test-button");
testButton.addEventListener("click", opentATestTab);

function opentATestTab() {
  updateClipboard(cssResultJson);

  // compose CSS style in json format
  setTimeout(() => {
    const url = "./Usage Example/index.html";
    window.open(url, "_blank");
  }, 1000);
}
