export const handleShare = (id, name) => {
    const videoURL = `${window.location.origin}/video/${id}`;
    const shareData = {
      title: name,
      text: `Check out this awesome Video: ${name}`,
      url: videoURL,
    };
  
    if (navigator.share) {
      // If Web Share API is supported
      navigator
        .share(shareData)
        .then(() => console.log("Shared successfully"))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      // Fallback if Web Share is not supported
      console.log("Web Share not supported. Fallback to copying URL.");
      navigator.clipboard
        .writeText(videoURL)
        .then(() => alert("Link copied to clipboard!"))
        .catch((error) => console.error("Error copying link:", error));
    }
  };
  