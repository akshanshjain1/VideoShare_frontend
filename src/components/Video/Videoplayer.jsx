import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  IconButton,
  Slider,
  Typography,
  Stack,
  Tooltip,
  CircularProgress,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  FullscreenExit,
} from "@mui/icons-material";

const VideoPlayer = ({ src }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(50);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [aspectRatio, setAspectRatio] = useState('16/9');
  // Play/Pause
  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Mute/Unmute
  const handleMuteToggle = () => {
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Volume Control
  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
    videoRef.current.volume = newValue / 100;
  };

  // Update Progress
  const handleTimeUpdate = () => {
    setProgress(
      (videoRef.current.currentTime / videoRef.current.duration) * 100
    );
  };

  // Seek Functionality
  const handleSeek = (event, newValue) => {
    videoRef.current.currentTime = (newValue / 100) * videoRef.current.duration;
    setProgress(newValue);
  };

  // Video Metadata Loaded
  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

  // Buffering state
  const handleWaiting = () => {
    setIsBuffering(true);
  };

  const handlePlaying = () => {
    setIsBuffering(false);
  };

  // Fullscreen Toggle
  const handleFullscreenToggle = () => {
    if (!isFullscreen) {
      videoRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  // Speed Control
  const handleSpeedMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSpeedChange = (speed) => {
    setSpeed(speed);
    videoRef.current.playbackRate = speed;
    setAnchorEl(null);
  };

  // Format Time (Helper)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };
  useEffect(() => {
    const video = document.createElement('video');
    video.src = src;

    // Load metadata to get video dimensions
    video.onloadedmetadata = () => {
      const { videoWidth, videoHeight } = video;
      const calculatedAspectRatio = `${videoWidth}/${videoHeight}`;
      setAspectRatio(calculatedAspectRatio);
    }
    return () => {
      video.src = '';
    };
  }, [src]);
  return (
    <Box
      sx={{
        width: '100%',
        aspectRatio:aspectRatio,
        mx: "auto",
        position: "relative",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      
        onClick={handlePlayPause}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onWaiting={handleWaiting}
        onPlaying={handlePlaying}
      />

      {/* Buffering Indicator */}
      {isBuffering && (
        <CircularProgress
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#ffffff",
          }}
        />
      )}

      {/* Controls */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          background: "rgba(0, 0, 0, 0.5)",
          borderRadius: "0px 0px 12px 12px",
          opacity: 0,
          transition: "opacity 0.3s ease",
          "&:hover": {
            opacity: 1,
          },
        }}
      >
        {/* Play/Pause */}
        <Tooltip
          style={{ outline: "none" }}
          title={isPlaying ? "Pause" : "Play"}
          arrow
        >
          <IconButton
            onClick={handlePlayPause}
            sx={{ outline: "none", color: "#fff", padding: "8px" }}
          >
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>
        </Tooltip>

        {/* Time */}
        <Typography variant="body2" sx={{ color: "#fff", fontWeight: 500 }}>
          {formatTime(videoRef.current?.currentTime || 0)} /{" "}
          {formatTime(duration)}
        </Typography>

        {/* Controls Group */}
        <Stack direction="row" spacing={2} alignItems="center">
          {/* Volume Control */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title={isMuted ? "Unmute" : "Mute"} arrow>
              <IconButton
                onClick={handleMuteToggle}
                sx={{ color: "#fff", padding: "8px" }}
              >
                {isMuted ? <VolumeOff /> : <VolumeUp />}
              </IconButton>
            </Tooltip>
            <Slider
              value={volume}
              onChange={handleVolumeChange}
              sx={{
                width: 100,
                color: "#ff5722",
                "& .MuiSlider-thumb": {
                  backgroundColor: "#ff5722",
                },
              }}
            />
          </Box>

          {/* Speed Control */}
          <Button
            variant="contained"
            onClick={handleSpeedMenuOpen}
            style={{ outline: "none" }}
            sx={{
              backgroundColor: "#ff5722",
              color: "#fff",
              fontSize: "0.875rem",
              padding: "2px 12px",
              "&:hover": {
                backgroundColor: "#ff5722",
              },
              borderRadius: "8px",
            }}
          >
            {speed}x
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            sx={{
              "& .MuiPaper-root": {
                borderRadius: "8px",
              },
            }}
          >
            {[0.5, 1, 1.5, 2].map((rate) => (
              <MenuItem key={rate} onClick={() => handleSpeedChange(rate)}>
                {rate}x
              </MenuItem>
            ))}
          </Menu>

          {/* Fullscreen */}
          <Tooltip
            style={{ outline: "none" }}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            arrow
          >
            <IconButton
              onClick={handleFullscreenToggle}
              sx={{ color: "#fff", padding: "8px" }}
            >
              {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* Progress Bar */}
      <Slider
        value={progress}
        onChange={handleSeek}
        sx={{
          position: "absolute",
          bottom: 40,
          left: 40,
          right: 40,
          width: "calc(100% - 80px)", // Adjusted width to not occupy full screen
          color: "#ff5722",
          height: 4,
          "& .MuiSlider-thumb": {
            backgroundColor: "#ff5722",
          },
        }}
      />
    </Box>
  );
};

export default VideoPlayer;
