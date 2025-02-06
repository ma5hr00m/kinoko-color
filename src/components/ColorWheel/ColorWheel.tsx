import React, { useEffect, useRef, useState } from 'react';
import styles from './ColorWheel.module.scss';
import ColorDisplay from '../ColorDisplay/ColorDisplay';

export const ColorWheel: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 200, y: 200 });
  const [color, setColor] = useState({ hex: '#ff0000', rgba: 'rgba(255, 0, 0, 1)' });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { 
      alpha: false,
      willReadFrequently: true
    });
    if (!ctx) return;

    // 启用抗锯齿
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const size = canvas.width;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (Math.min(centerX, centerY) - 2);  // 留出边缘空间
    const antiAliasingRadius = 2; // 抗锯齿范围

    // 创建一个临时画布用于抗锯齿处理
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = size;
    tempCanvas.height = size;
    const tempCtx = tempCanvas.getContext('2d', {
      alpha: true,
      willReadFrequently: true
    });
    if (!tempCtx) return;

    // 清除画布
    ctx.clearRect(0, 0, size, size);
    tempCtx.clearRect(0, 0, size, size);

    // 使用像素级渲染来创建平滑的色轮
    const imageData = tempCtx.createImageData(size, size);
    const data = imageData.data;

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 计算边缘透明度
        let alpha = 255;
        if (distance > radius - antiAliasingRadius && distance <= radius + antiAliasingRadius) {
          alpha = Math.round(255 * (1 - (distance - (radius - antiAliasingRadius)) / (2 * antiAliasingRadius)));
        } else if (distance > radius + antiAliasingRadius) {
          alpha = 0;
        }

        if (alpha > 0) {
          // 计算色相角度（0-360）
          const hue = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
          
          // 计算饱和度（0-100%）基于到中心的距离
          const saturation = Math.min((distance / radius) * 100, 100);
          
          // 将 HSL 转换为 RGB
          const lightness = 50;
          const c = (1 - Math.abs(2 * lightness / 100 - 1)) * saturation / 100;
          const x1 = c * (1 - Math.abs((hue / 60) % 2 - 1));
          const m = lightness / 100 - c / 2;

          let r1 = 0, g1 = 0, b1 = 0;

          if (hue < 60) {
            [r1, g1, b1] = [c, x1, 0];
          } else if (hue < 120) {
            [r1, g1, b1] = [x1, c, 0];
          } else if (hue < 180) {
            [r1, g1, b1] = [0, c, x1];
          } else if (hue < 240) {
            [r1, g1, b1] = [0, x1, c];
          } else if (hue < 300) {
            [r1, g1, b1] = [x1, 0, c];
          } else {
            [r1, g1, b1] = [c, 0, x1];
          }

          const idx = (y * size + x) * 4;
          data[idx] = Math.round((r1 + m) * 255);     // R
          data[idx + 1] = Math.round((g1 + m) * 255); // G
          data[idx + 2] = Math.round((b1 + m) * 255); // B
          data[idx + 3] = alpha;                      // A
        }
      }
    }

    // 将图像数据绘制到临时画布
    tempCtx.putImageData(imageData, 0, 0);

    // 将临时画布的内容绘制到主画布，应用额外的平滑效果
    ctx.save();
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, size, size);
    ctx.drawImage(tempCanvas, 0, 0);
    ctx.restore();
  }, []);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e) {
      e.preventDefault();
    }
    
    const container = containerRef.current;
    if (!container || !canvasRef.current) return;

    const rect = container.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Get color at position
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(x, y, 1, 1).data;
    const [r, g, b] = imageData;
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    const rgba = `rgba(${r}, ${g}, ${b}, 1)`;

    setPosition({ x, y });
    setColor({ hex, rgba });
  };

  const handleInteractionStart = (e: React.MouseEvent | React.TouchEvent) => {
    handleMouseMove(e);
    const container = containerRef.current;
    if (!container) return;

    const handleMouseUp = () => {
      container.removeEventListener('mousemove', handleMouseMove as unknown as (e: MouseEvent) => void);
      container.removeEventListener('touchmove', handleMouseMove as unknown as (e: TouchEvent) => void);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
    };

    container.addEventListener('mousemove', handleMouseMove as unknown as (e: MouseEvent) => void);
    container.addEventListener('touchmove', handleMouseMove as unknown as (e: TouchEvent) => void);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleMouseUp);
  };


  return (
    <div className={styles.colorWheelContainer}>
      <div 
        ref={containerRef}
        className={styles.colorWheel}
      >
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className={styles.canvas}
          onMouseDown={handleInteractionStart}
          onTouchStart={handleInteractionStart}
        />
        <div 
          className={styles.focusPoint}
          style={{
            left: position.x,
            top: position.y,
            backgroundColor: color.hex
          }}
        />
      </div>
      <ColorDisplay color={color} />
    </div>
  );
};

export default ColorWheel;
