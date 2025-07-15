import { useRef, useEffect } from 'react';

const Noise = ({
  patternSize = 128,
  patternAlpha = 40,
  patternRefreshInterval = 2,
}) => {
  const grainRef = useRef(null);

  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    let animationId;

    const drawNoiseTile = () => {
      const tile = document.createElement('canvas');
      tile.width = patternSize;
      tile.height = patternSize;
      const tileCtx = tile.getContext('2d');

      const imageData = tileCtx.createImageData(patternSize, patternSize);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const val = Math.random() * 255;
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
        data[i + 3] = patternAlpha;
      }

      tileCtx.putImageData(imageData, 0, 0);
      return tile;
    };

    const draw = () => {
      const tile = drawNoiseTile();
      const pattern = ctx.createPattern(tile, 'repeat');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const loop = () => {
      if (frame % patternRefreshInterval === 0) {
        draw();
      }
      frame++;
      animationId = requestAnimationFrame(loop);
    };

    window.addEventListener('resize', resize);
    resize();
    loop();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [patternSize, patternAlpha, patternRefreshInterval]);

  return (
    <canvas
      ref={grainRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ imageRendering: 'pixelated' }}
    />
  );
};

export default Noise;
