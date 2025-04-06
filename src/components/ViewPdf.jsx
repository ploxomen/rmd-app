import { Worker,Viewer} from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import es_ES from '@react-pdf-viewer/locales/lib/es_ES.json';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/core/lib/styles/index.css';
import Head from 'next/head';
function ViewPdf({src,title}) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const handleDocumentLoad = (e) => {
    e.file.name = title
  };
  return(
    <>
      <Head>
        <title>PDF Cotización</title>
      </Head>
      <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`}>
        <Viewer
            fileUrl={src}
            defaultScale={1.5}
            localization={es_ES}
            plugins={[defaultLayoutPluginInstance]}
            onDocumentLoad={handleDocumentLoad}
        />
      </Worker>
    </>
  )
}
export default ViewPdf