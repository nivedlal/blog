import React, { useEffect, useRef } from 'react';

const FuzzyText = ({
  text = '404',
  fontSize = '40vw',
  fontWeight = 900,
  fontFamily = 'inherit',
  color = '',
  enableHover = true,
  baseIntensity = 0.18,
  hoverIntensity = 0.5,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const computedFontSize = window.getComputedStyle(canvas).fontSize;
    const computedFontFamily = window.getComputedStyle(canvas).fontFamily;

    const font = `${fontWeight} ${computedFontSize} ${computedFontFamily}`;
    ctx.font = font;
    ctx.textBaseline = 'alphabetic';

    const metrics = ctx.measureText(text);
    const ascent = metrics.actualBoundingBoxAscent || 0;
    const descent = metrics.actualBoundingBoxDescent || 0;
    const width = metrics.width;
    const height = ascent + descent;

    canvas.width = width;
    canvas.height = height;

    canvas.style.width = 'auto';
    canvas.style.height = 'auto';

    const offscreen = document.createElement('canvas');
    offscreen.width = width;
    offscreen.height = height;

    const offCtx = offscreen.getContext('2d');
    offCtx.font = font;
    offCtx.textBaseline = 'alphabetic';
    offCtx.fillStyle = color;
    offCtx.fillText(text, 0, ascent);

    let isHovering = false;
    const fuzzRange = 30;

    const render = () => {
      const intensity = isHovering ? hoverIntensity : baseIntensity;
      ctx.clearRect(0, 0, width, height);
      for (let y = 0; y < height; y++) {
        const dx = (Math.random() - 0.5) * fuzzRange * intensity;
        ctx.drawImage(offscreen, 0, y, width, 1, dx, y, width, 1);
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleHover = (e) => {
      if (!enableHover) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      isHovering = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
    };

    const stopHover = () => {
      isHovering = false;
    };

    if (enableHover) {
      canvas.addEventListener('mousemove', handleHover);
      canvas.addEventListener('mouseleave', stopHover);
      canvas.addEventListener('touchmove', handleHover, { passive: false });
      canvas.addEventListener('touchend', stopHover);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (enableHover) {
        canvas.removeEventListener('mousemove', handleHover);
        canvas.removeEventListener('mouseleave', stopHover);
        canvas.removeEventListener('touchmove', handleHover);
        canvas.removeEventListener('touchend', stopHover);
      }
    };
  }, [
    text,
    fontSize,
    fontWeight,
    fontFamily,
    color,
    enableHover,
    baseIntensity,
    hoverIntensity,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="inline-block align-middle"
      style={{ fontSize, display: 'inline-block' }}
    />
  );
};

export default FuzzyText;
