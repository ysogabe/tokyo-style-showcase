import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';

const VideoCard = styled.div`
  flex: 1;
  background-color: #f4f1ed;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  transform: scale(1);

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }
`;

const NavigationButton = styled.button<{ direction: 'prev' | 'next' }>`
  position: absolute;
  ${props => props.direction === 'prev' ? 'left: 2rem;' : 'right: 2rem;'}
  top: 50%;
  transform: translateY(-50%);
  background-color: #89d3a7;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  font-size: 28px;
  z-index: 1001;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);

  &:hover {
    background-color: #7ac598;
    transform: translateY(-50%) scale(1.05);
  }
`;

const VideoGallery: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videos = [
    {
      src: "/videos/tokyo_dawn_1.mp4",
      style: "Makoto Shinkai style",
      prompt: "A time-lapse of the Tokyo skyline at dawn, animated in the style of Makoto Shinkai. Vibrant colors, detailed cityscapes, and dramatic lighting as the sun rises over the skyscrapers."
    },
    {
      src: "/videos/tokyo_dawn_2.mp4",
      style: "Akira Kurosawa style",
      prompt: "Dawn breaks over Tokyo in the style of Akira Kurosawa. High-contrast black and white cinematography, with dramatic shadows and a focus on the interplay of light and darkness."
    },
    {
      src: "/videos/tokyo_dawn_3.mp4",
      style: "Studio Ghibli style",
      prompt: "A whimsical depiction of dawn in Tokyo, animated in the style of Studio Ghibli. Hand-drawn aesthetic, soft colors, and a magical atmosphere."
    }
  ];

  const handleVideoClick = (index: number) => {
    setSelectedVideo(index);
  };

  const closeModal = () => {
    setSelectedVideo(null);
  };

  const navigateVideo = useCallback((direction: 'prev' | 'next') => {
    if (selectedVideo === null) return;

    const newIndex = direction === 'next'
      ? (selectedVideo + 1) % videos.length
      : (selectedVideo - 1 + videos.length) % videos.length;
    
    setSelectedVideo(newIndex);
  }, [selectedVideo, videos.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedVideo === null) return;

      switch (e.key) {
        case 'ArrowLeft':
          navigateVideo('prev');
          break;
        case 'ArrowRight':
          navigateVideo('next');
          break;
        case 'Escape':
          closeModal();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedVideo, navigateVideo]);

  // 動画のsrcが変更されたときに動画をリロードする
  useEffect(() => {
    if (videoRef.current && selectedVideo !== null) {
      videoRef.current.load();
      videoRef.current.play();
    }
  }, [selectedVideo]);

  return (
    <div style={{ 
      backgroundColor: "#2c2520", // より暗めの背景色
      padding: "2rem",
      minHeight: "100vh"
    }}>
      <h1 style={{ 
        marginTop: "4rem", 
        fontSize: "2.5rem", 
        fontWeight: "bold", 
        textAlign: "center", 
        color: "#e8d164", // タイトルを目立たせる
        marginBottom: "2rem",
        textShadow: "2px 2px 4px rgba(0,0,0,0.2)"
      }}>
        東京の夜明け - AI生成動画ギャラリー
      </h1>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        width: "100%", 
        padding: "1rem",
        gap: "2rem"
      }}>
        {videos.map((video, index) => (
          <VideoCard key={index} onClick={() => handleVideoClick(index)}>
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              style={{ 
                width: "100%",
                borderBottom: "3px solid #89d3a7"
              }}
            >
              <source src={video.src} type="video/mp4" />
              お使いのブラウザは動画再生に対応していません
            </video>
            <div style={{ 
              padding: "1.5rem",
              backgroundColor: "#ffffff"
            }}>
              <h3 style={{ 
                color: "#2c2520", // より濃いテキスト色
                fontSize: "1.2rem", 
                fontWeight: "bold",
                marginBottom: "0.75rem"
              }}>
                {video.style}
              </h3>
              <p style={{ 
                color: "#4a4a4a", // 読みやすいグレー
                fontSize: "0.95rem",
                lineHeight: "1.5"
              }}>
                {video.prompt}
              </p>
            </div>
          </VideoCard>
        ))}
      </div>

      {selectedVideo !== null && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(44, 37, 32, 0.95)", // より暗めの背景
            backdropFilter: "blur(8px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}
          onClick={closeModal}
        >
          <NavigationButton
            direction="prev"
            onClick={(e) => {
              e.stopPropagation();
              navigateVideo('prev');
            }}
          >
            ←
          </NavigationButton>
          <NavigationButton
            direction="next"
            onClick={(e) => {
              e.stopPropagation();
              navigateVideo('next');
            }}
          >
            →
          </NavigationButton>
          <div 
            style={{
              position: "relative",
              width: "90vw",
              height: "90vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "2rem"
            }}
            onClick={e => e.stopPropagation()}
          >
            <video 
              ref={videoRef}
              autoPlay 
              loop 
              muted 
              playsInline
              controls
              style={{
                maxWidth: "100%",
                maxHeight: "75vh",
                backgroundColor: "#000",
                borderRadius: "1rem",
                boxShadow: "0 12px 24px rgba(0,0,0,0.3)"
              }}
            >
              <source src={videos[selectedVideo].src} type="video/mp4" />
              お使いのブラウザは動画再生に対応していません
            </video>
            <div style={{
              marginTop: "2rem",
              color: "#ffffff",
              textAlign: "center",
              maxWidth: "800px"
            }}>
              <h3 style={{ 
                fontSize: "2rem", 
                marginBottom: "1rem",
                color: "#e8d164", // モーダル内のタイトルを強調
                textShadow: "2px 2px 4px rgba(0,0,0,0.2)"
              }}>
                {videos[selectedVideo].style}
              </h3>
              <p style={{
                color: "#f4f1ed", // より明るい文字色
                fontSize: "1.1rem",
                lineHeight: "1.6",
                textShadow: "1px 1px 2px rgba(0,0,0,0.2)"
              }}>
                {videos[selectedVideo].prompt}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoGallery;