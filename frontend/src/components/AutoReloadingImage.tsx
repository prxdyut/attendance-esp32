import React, { useState, useEffect } from 'react';

const AutoReloadImage = ({ src, alt, reloadInterval = 5000, className }: any) => {
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setImageSrc(`${src}?t=${new Date().getTime()}`);
    }, reloadInterval);

    return () => clearInterval(intervalId);
  }, [src, reloadInterval]);

  return (
    <div className={`text-center ${className}`}>
      <img 
        src={imageSrc} 
        alt={alt} 
        className="max-w-full h-auto border border-gray-300 rounded-md p-2"
      />
    </div>
  );
};

export default AutoReloadImage;