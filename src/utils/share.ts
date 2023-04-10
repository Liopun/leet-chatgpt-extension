import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const sharePngOrPdf = (name: string, pdf?: boolean) => {
  (async () => {
    try {
      const divElement = document.getElementById('chats-dialog-content');
      if (divElement) {
        const shadowDiv = divElement.cloneNode(true) as HTMLElement;

        shadowDiv.style.position = 'fixed';
        shadowDiv.style.width = '1080px';
        shadowDiv.style.left = '-9999px';
        shadowDiv.style.top = '-9999px';
        shadowDiv.style.zIndex = '-9999';
        shadowDiv.style.pointerEvents = 'none';
        document.body.appendChild(shadowDiv);

        const canvas = await html2canvas(shadowDiv, {
          scrollY: -shadowDiv.scrollHeight,
          height: shadowDiv.offsetHeight,
          scale: 2,
        });

        document.body.removeChild(shadowDiv);

        const dataUrl = canvas.toDataURL('image/png');

        if (pdf) {
          const pdfDoc = new jsPDF('p', 'mm', [canvas.width, canvas.height]);
          const url = 'https://leetchatgpt.com/';
          pdfDoc.addImage(dataUrl, 'PNG', 0, 0, canvas.width, canvas.height);
          pdfDoc.setFontSize(80);
          pdfDoc.text(url, 20, 50);
          pdfDoc.createAnnotation({
            type: 'link',
            title: url,
            bounds: {
              x: 0,
              y: 50,
              w: 200,
              h: 80,
            },
            contents: url,
            open: true,
          });
          pdfDoc.save(`leet-chatgpt-${name}.pdf`);
          return;
        }

        const downloadLink = document.createElement('a');
        downloadLink.href = dataUrl;
        downloadLink.download = `leet-chatgpt-${name}.png`;
        downloadLink.click();
      }
    } catch (error) {
      console.debug('SHARE ERROR:::', error);
    }
  })();
};
