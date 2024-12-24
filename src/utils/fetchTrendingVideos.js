const fetchTrendingVideos = async ({ query, videos, setVideos }) => {
    const options = {
      method: "GET",
      url: "https://yt-api.p.rapidapi.com/search",
      params: {
        query,
        geo: "IN",
      },
      headers: {
        "x-rapidapi-key": import.meta.env.VITE_VIDEO_DETAIL_FETCHIING_API,
        "x-rapidapi-host": "yt-api.p.rapidapi.com",
      },
    };
  
    try {
      const response = await axios.request(options);
  
      const trending = response.data.data;
      const newtrending = trending.filter((video) => video.type === "video");
      if (!newtrending || newtrending.length === 0) setVideos([]);
      else setVideos(newtrending);
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  
  const fetchVideolocal = async ({ query, videos, setVideos, page, sortBy }) => {
    try {
      const response = await axios.get(
        `/api/v1/videos?query=${query}&page=${page}&sortBy=${sortBy}`
      );
      if (!response.data.data) setVideos([]);
      else setVideos(response.data.data);
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  export {fetchTrendingVideos,fetchVideolocal}