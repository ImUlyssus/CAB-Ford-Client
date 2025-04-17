// Move the download logic into a global component that is always mounted
// (e.g., in your main app layout or a dedicated PDFDownloadHandler component).
// This way, the download is triggered regardless of what route or page the user is on.

import { useContext, useEffect, useRef } from 'react';
import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';
import AuthContext from '../context/AuthProvider';

import FirstSheet from '../components/Sheets/FirstSheet';
import SecondSheet from '../components/Sheets/SecondSheet';
import ThirdSheet from '../components/Sheets/ThirdSheet';
import FourthSheet from '../components/Sheets/FourthSheet';
import FifthSheet from '../components/Sheets/FifthSheet';
import SixthSheet from '../components/Sheets/SixthSheet';
import SevenSheet from '../components/Sheets/SeventhSheet';
import EightSheet from '../components/Sheets/EightSheet';

const sheets = [
  FirstSheet,
  SecondSheet,
  () => <FifthSheet exportSite="aat" />,
  () => <FifthSheet exportSite="ftm" />,
  () => <FifthSheet exportSite="fsst" />,
  () => <SevenSheet exportSite="aat" />,
  () => <SevenSheet exportSite="ftm" />,
  () => <SevenSheet exportSite="fsst" />,
  () => <SixthSheet exportSite="aat" />,
  () => <SixthSheet exportSite="ftm" />,
  () => <SixthSheet exportSite="fsst" />,
  EightSheet,
  FourthSheet,
  ThirdSheet,
];

const PDFDownloadHandler = () => {
  const { auth, triggerDownload, setTriggerDownload } = useContext(AuthContext);
  const pdfContainerRef = useRef(null);

  const handleDownload = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();

    const nodes = pdfContainerRef.current?.children || [];

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (!node) continue;

      try {
        const dataUrl = await domtoimage.toPng(node, { cacheBust: true });
        const img = new Image();
        img.src = dataUrl;

        await new Promise((resolve) => {
          img.onload = () => {
            const imgWidth = pdfWidth;
            const imgHeight = (img.height * imgWidth) / img.width;
            if (i > 0) pdf.addPage();
            pdf.addImage(img, 'PNG', 0, 0, imgWidth, imgHeight);
            resolve();
          };
        });
      } catch (err) {
        console.error(`Error rendering sheet ${i + 1}:`, err);
      }
    }

    const fileName = auth?.fileName || 'dashboard';
    pdf.save(`${fileName}.pdf`);
  };

//   useEffect(() => {
//     if (triggerDownload) {
//       handleDownload().then(() => {
//         setTriggerDownload(false);
//       });
//     }
//   }, [triggerDownload]);
useEffect(() => {
    if (triggerDownload?.downloading) {
        handleDownload().then(() => {
            triggerDownload.done();
        });
    }
}, [triggerDownload]);


  return (
    <div
      ref={pdfContainerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        overflow: 'hidden',
        zIndex: -9999,
      }}
    >
      {sheets.map((Sheet, idx) => (
        <div
          key={idx}
          className="p-6 bg-white"
          style={{ width: '794px', height: '1123px', marginBottom: '20px' }}
        >
          <Sheet />
        </div>
      ))}
    </div>
  );
};

export default PDFDownloadHandler;
