'use client'
import React, { useState, useRef, useCallback, useEffect } from 'react';

// Helper function to clamp values within a range
const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

const ImageCard = ({ imageUrl, altText }) => {
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [flipY, setFlipY] = useState(false);
  const [flipX, setFlipX] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const lastMousePosition = useRef({ x: 0, y: 0 });

  // Handle rotation
  const rotateLeft = () => setRotation((prevRotation) => prevRotation - 90);
  const rotateRight = () => setRotation((prevRotation) => prevRotation + 90);

  // Handle zoom
  const zoomIn = () => setZoom((prevZoom) => Math.min(prevZoom + 10, 200)); // Max zoom 200%
  const zoomOut = () => setZoom((prevZoom) => Math.max(prevZoom - 10, 50)); // Min zoom 50%

  // Handle flip
  const flipImageY = () => setFlipY((prevFlipY) => !prevFlipY);
  const flipImageX = () => setFlipX((prevFlipX) => !prevFlipX);

  // Start dragging
  const startDrag = (e) => {
    setDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    lastMousePosition.current = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  };

  // Stop dragging
  const endDrag = () => {
    setDragging(false);
  };

  // Handle drag movement
  const onDrag = useCallback((e) => {
    if (dragging) {
      const deltaX = e.clientX - lastMousePosition.current.x;
      const deltaY = e.clientY - lastMousePosition.current.y;
      
      setPosition((prevPosition) => ({
        x: prevPosition.x + deltaX,
        y: prevPosition.y + deltaY
      }));
      
      lastMousePosition.current = { x: e.clientX, y: e.clientY };
    }
  }, [dragging]);

  useEffect(() => {
    if (dragging) {
      const handleMouseMove = (e) => {
        requestAnimationFrame(() => onDrag(e));
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', endDrag);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', endDrag);
      };
    }
  }, [dragging, onDrag]);

  // Apply transformation to the image
  const transformString = `rotate(${rotation}deg) scale(${zoom / 100}) ${flipY ? 'scaleX(-1)' : ''} ${flipX ? 'scaleY(-1)' : ''} translate3d(${position.x}px, ${position.y}px, 0)`;

  return (
    <div className="mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-4 relative">
      <div className="relative">
        <img
          src={imageUrl}
          alt={altText}
          ref={imgRef}
          className="transition-transform duration-300"
          style={{
            transform: transformString,
            transformOrigin: 'center center',
            willChange: 'transform',
            cursor: dragging ? 'grabbing' : 'grab',
          }}
          onMouseDown={startDrag}
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={rotateLeft}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Rotar Izquierda
        </button>
        <button
          onClick={rotateRight}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Rotar Derecha
        </button>
        <button
          onClick={zoomOut}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Menos Zoom
        </button>
        <button
          onClick={zoomIn}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Más Zoom
        </button>
        <button
          onClick={flipImageY}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Revertir Eje Y
        </button>
        <button
          onClick={flipImageX}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Revertir Eje X
        </button>
      </div>
    </div>
  );
};


const App = () => {
  return (
    <div className="p-6">
      <ImageCard
        imageUrl="/ci.jpg"
        altText="Descripción de la imagen"
      />
    </div>
  );
};

export default App;