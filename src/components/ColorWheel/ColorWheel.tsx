import React, { useEffect, useRef, useState } from 'react';
import styles from './ColorWheel.module.scss';

export const ColorWheel: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 150, y: 150 });
  const [color, setColor] = useState({ hex: '#ff0000', rgba: 'rgba(255, 0, 0, 1)' });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // 启用抗锯齿
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 1;

    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 使用更高效的渲染方法
    const segments = 360;
    const segmentAngle = (2 * Math.PI) / segments;

    // 绘制平滑的色轮
    for (let i = 0; i < segments; i++) {
      const startAngle = i * segmentAngle;
      const endAngle = startAngle + segmentAngle;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      // 创建径向渐变
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
      );

      const hue = (i * 360) / segments;
      gradient.addColorStop(0, `hsla(${hue}, 0%, 50%, 1)`);
      gradient.addColorStop(1, `hsla(${hue}, 100%, 50%, 1)`);

      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // 添加平滑效果
    ctx.globalCompositeOperation = 'destination-over';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
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
    <div>
      <div 
        ref={containerRef}
        className={styles.colorWheel}
        onMouseDown={handleInteractionStart}
        onTouchStart={handleInteractionStart}
      >
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          style={{ borderRadius: '50%' }}
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
      <div className={styles.colorInfo}>
        <div 
          className={styles.colorBox}
          style={{ backgroundColor: color.hex }}
        />
        <div className={styles.values}>
          <div>HEX: {color.hex}</div>
          <div>RGBA: {color.rgba}</div>
        </div>
      </div>
    </div>
  );
};
