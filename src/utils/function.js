function formatViewCount(count) {
    if (count >= 1_000_000) {
      // If count is 1 million or more, divide by 1 million and append 'M'
      return `${(count / 1_000_000).toFixed(1)}M`;
    } else if (count >= 1_000) {
      // If count is 1 thousand or more, divide by 1 thousand and append 'K'
      return `${(count / 1_000).toFixed(1)}K`;
    }
    // Return count as a string for numbers less than 1000
    return count.toString();
  }

  function formatDuration(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      // Format as HH:MM:SS
      return `${hrs.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    } else {
      // Format as MM:SS
      return `${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
  }
  function timeSincePublished(createdAt) {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();

    // Calculate the difference in time (milliseconds)
    const diffInMs = currentDate - createdDate;

    // Convert the difference to seconds, minutes, hours, and days
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    // Return the appropriate string
    if (diffInDays >= 1) {
      if (diffInDays === 1) {
        return "1 day ago";
      } else {
        return ` ${diffInDays} days ago`;
      }
    } else if (diffInHours >= 1) {
      return `${diffInHours} hours ago`;
    } else if (diffInMinutes >= 1) {
      return `${diffInMinutes} minutes ago`;
    } else {
      return `Just now`;
    }
  }

  const formatNumber = (num) => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    } else {
      return num;
    }
  };
  export {
    timeSincePublished,
    formatDuration,
    formatViewCount,
    formatNumber
  }