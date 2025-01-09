'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ArrowTurnDownLeftIcon, ArrowTurnDownRightIcon, MagnifyingGlassPlusIcon, MagnifyingGlassMinusIcon, ViewfinderCircleIcon, ArrowsRightLeftIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';

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
    const dragStartOffset = useRef({ x: 0, y: 0 });

    // Handle rotation
    const rotateLeft = () => setRotation((prevRotation) => prevRotation - 90);
    const rotateRight = () => setRotation((prevRotation) => prevRotation + 90);

    // Handle zoom
    const zoomIn = () => setZoom((prevZoom) => Math.min(prevZoom + 10, 400)); // Max zoom 200%
    const zoomOut = () => setZoom((prevZoom) => Math.max(prevZoom - 10, 10)); // Min zoom 50%

    // Handle flip
    const flipImageY = () => setFlipY((prevFlipY) => !prevFlipY);
    const flipImageX = () => setFlipX((prevFlipX) => !prevFlipX);

    // Reset to initial state
    const resetImage = () => {
        setRotation(0);
        setZoom(100);
        setFlipY(false);
        setFlipX(false);
        setPosition({ x: 0, y: 0 });
    };

    // Start dragging
    const startDrag = (e) => {
        const rect = imgRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        setDragging(true);
        dragStart.current = { x: e.clientX, y: e.clientY };
        dragStartOffset.current = {
            x: e.clientX - centerX,
            y: e.clientY - centerY
        };
        e.preventDefault();
    };

    // Stop dragging
    const endDrag = () => {
        setDragging(false);
    };

    // Handle drag movement
    const onDrag = useCallback((e) => {
        if (dragging) {
            const deltaX = e.clientX - dragStart.current.x;
            const deltaY = e.clientY - dragStart.current.y;

            // Calculate the new position based on the initial offset
            setPosition((prevPosition) => ({
                x: prevPosition.x + deltaX,
                y: prevPosition.y + deltaY
            }));

            // Update the drag start position for smooth dragging
            dragStart.current = { x: e.clientX, y: e.clientY };
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
    const transformString = `rotate(${rotation}deg) scale(${zoom / 100}) ${flipY ? 'scaleX(-1)' : ''} ${flipX ? 'scaleY(-1)' : ''} translate(${position.x}px, ${position.y}px)`;

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
                        cursor: dragging ? 'grabbing' : 'grab',
                    }}
                    onMouseDown={startDrag}
                />
            </div>
            <div className="aboslute mt-4 flex justify-center flex-wrap gap-2 z-50">
                <button
                    onClick={rotateLeft}
                    className="relative p-2  bg-[#00000079]  stroke-white rounded-lg hover:bg-gray-900 transition-transform duration-300"
                >
                    <ArrowTurnDownRightIcon className="w-3 h-3  stroke-white" />

                </button>
                <button
                    onClick={rotateRight}
                    className="relative p-2  bg-[#00000079]  stroke-white rounded-lg hover:bg-gray-900 transition-transform duration-300"
                >
                    <ArrowTurnDownLeftIcon className="w-3 h-3  stroke-white" />

                </button>
                <button
                    onClick={zoomOut}
                    className="relative p-2  bg-[#00000079]  stroke-white rounded-lg hover:bg-gray-900 transition-transform duration-300"
                >
                    <MagnifyingGlassMinusIcon className="w-3 h-3  stroke-white" />

                </button>
                <button
                    onClick={zoomIn}
                    className="relative p-2  bg-[#00000079]  stroke-white rounded-lg hover:bg-gray-900 transition-transform duration-300"
                >
                    <MagnifyingGlassPlusIcon className="w-3 h-3  stroke-white" />

                </button>
                <button
                    onClick={flipImageY}
                    className="relative p-2  bg-[#00000079]  stroke-white rounded-lg hover:bg-gray-900 transition-transform duration-300"
                >
                    <ArrowsRightLeftIcon className="w-3 h-3  stroke-white" />
                </button>
                <button
                    onClick={flipImageX}
                    className="relative p-2  bg-[#00000079]  stroke-white rounded-lg hover:bg-gray-900 transition-transform duration-300"
                >
                    <ArrowsUpDownIcon className="w-3 h-3  stroke-white" />
                </button>
                <button
                    onClick={resetImage}
                    className=" relative p-2 bg-[#00000079]  stroke-white rounded-lg hover:bg-gray-900 transition-transform duration-300" 
                >
                    <ViewfinderCircleIcon className="relative w-3 h-3  stroke-white" />
                </button>
            </div>
        </div>
    );
};

export default ImageCard;

