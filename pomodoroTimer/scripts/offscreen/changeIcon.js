async function generateExtensionPieIcon(angle, color, size = 32) {
  const circumference = 2 * Math.PI * 5;
  const strokeDasharray = circumference * (angle / 360);
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" height="20px" width="20px">
    <circle
      r="5px" cx="10px" cy="10px" fill="transparent"
      stroke="${color}" stroke-width="10px"
      stroke-dasharray="${strokeDasharray} ${circumference}"
      style="transform-origin: center; transform: rotate(${-90 - angle}deg);"
    />
  </svg>`;

  const svgDataUrl = `data:image/svg+xml;charset=utf-8;base64,${btoa(svg)}`;
  const png = await svgToPng64(svgDataUrl, size, size);
  return png;
}

async function svgToPng64(svg, width, height) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = svg;
    image.addEventListener("load", () => {
      const canvas = document.createElement("canvas");
      canvas.setAttribute("width", width);
      canvas.setAttribute("height", height);
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, width, height);

      const dataUrl = canvas.toDataURL("image/png");
      resolve(dataUrl);
    });
  });
}
