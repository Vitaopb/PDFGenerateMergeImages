var myRangeCols = document.querySelector("#numCols");
var myValueCols = document.querySelector("#myValueCols");
var myRangeRows = document.querySelector("#numRows");
var myValueRows = document.querySelector("#myValueRows");
function showUnitRange(myRange, myValue) {
  var off =
    myRange.offsetWidth / (parseInt(myRange.max) - parseInt(myRange.min));
  var px =
    (myRange.valueAsNumber - parseInt(myRange.min)) * off -
    myValue.offsetParent.offsetWidth / 2;

  myValue.parentElement.style.left = px + "px";
  myValue.parentElement.style.top = myRange.offsetHeight + "px";
  myValue.innerHTML = myRange.value;

  myRange.oninput = function () {
    let px =
      (myRange.valueAsNumber - parseInt(myRange.min)) * off -
      myValue.offsetWidth / 2;
    myValue.innerHTML = myRange.value;
    myValue.parentElement.style.left = px + "px";
  };

  updateImageCountText()
}

showUnitRange(myRangeCols, myValueCols)
showUnitRange(myRangeRows, myValueRows)



const imageInput = document.getElementById("imageInput");

imageInput.addEventListener("change", function (event) {
  const selectedFile = event.target.files[0];

  if (selectedFile) {
    document.getElementById(
      "fileNameText"
    ).textContent = `Arquivo selecionado: ${selectedFile.name}`;
  } else {
    document.getElementById("fileNameText").textContent = "";
  }
});

function updateImageCountText() {
  const numCols = parseInt(document.getElementById("numCols").value);
  const numRows = parseInt(document.getElementById("numRows").value);
  const imageCount = numCols * numRows;
  const imageCountText = `Será gerado ${imageCount} imagens.`;
  document.getElementById("imageCountText").textContent = imageCountText;
}

document
  .getElementById("numCols")
  .addEventListener("input", updateImageCountText);
document
  .getElementById("numRows")
  .addEventListener("input", updateImageCountText);

function generatePDF() {
  const imageInput = document.getElementById("imageInput");
  const numCols = parseInt(document.getElementById("numCols").value);
  const numRows = parseInt(document.getElementById("numRows").value);
  const quantity = numCols * numRows;
  const file = imageInput.files[0];

  if (!file) {
    alert("Por favor, selecione uma imagem.");
    return;
  }

  const reader = new FileReader();
  reader.onloadend = function () {
    const imageBase64 = reader.result;
    const img = new Image();
    img.src = imageBase64;
    img.onload = function () {
      const imgWidth = img.width;
      const imgHeight = img.height;
      const pdf = new jsPDF();
      const margin = 10;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const cellWidth = (pageWidth - 2 * margin) / numCols;
      const cellHeight = (pageHeight - 2 * margin) / numRows;

      let currentRow = 0;
      let currentCol = 0;

      for (let i = 0; i < quantity; i++) {
        const x = margin + currentCol * cellWidth;
        const y = margin + currentRow * cellHeight;

        const scaleFactor = Math.min(
          cellWidth / imgWidth,
          cellHeight / imgHeight
        );
        const newWidth = imgWidth * scaleFactor;
        const newHeight = imgHeight * scaleFactor;

        pdf.addImage(imageBase64, "JPEG", x, y, newWidth, newHeight);
        currentCol++;
        if (currentCol === numCols) {
          currentCol = 0;
          currentRow++;
          if (currentRow === numRows) {
            currentRow = 0;
          }
        }
      }

      pdf.save("output.pdf");
    };
  };

  reader.readAsDataURL(file);
}
