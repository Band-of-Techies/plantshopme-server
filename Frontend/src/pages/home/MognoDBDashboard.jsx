import React, { useEffect, useRef } from 'react';

const MongoDBDashboard = () => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const resizeIframe = () => {
      const iframe = iframeRef.current;
      if (iframe) {
        iframe.style.height = iframe.contentWindow.document.body.scrollHeight + 'px';
      }
    };

    window.addEventListener('resize', resizeIframe);
    resizeIframe(); // Call initially to set the correct height

    return () => {
      window.removeEventListener('resize', resizeIframe);
    };
  }, []);
  return (
    <div style={{ borderRadius: '2px', width: '800%', height: '235vh', minHeight:'100vh', margin: '10vh auto' ,overflow:'hidden'}}>
      <iframe
       ref={iframeRef}
        title="MongoDB Dashboard"
        style={{ width: '100%', height: '50%', border: 'none' , overflowY: 'hidden !important'}}
        src="https://charts.mongodb.com/charts-myplantstore-necbv/embed/dashboards?id=652f9734-3b6c-44cf-8c87-d0c2be2b8b1c&theme=light&autoRefresh=true&maxDataAge=3600&showTitleAndDesc=false&scalingWidth=fixed&scalingHeight=fixed"
        scrolling="no" ></iframe>
    </div>
  );
};

export default MongoDBDashboard;
