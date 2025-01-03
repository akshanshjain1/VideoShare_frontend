import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";
import Navbar from "./components/Navbar/Navbar.jsx";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/ErrorBoundary.jsx";
import { CircularProgress } from "@mui/material";


const HeroSection = lazy(() => import("./components/HeroSection/HeroSection.jsx"));
const Signup = lazy(() => import("./components/Signup/signup.jsx"));
const Login = lazy(() => import("./components/Login/login.jsx"));
const Home = lazy(() => import("./components/home/Home.jsx"));
const Logout = lazy(() => import("./components/Logout/logout.jsx"));
const Setting = lazy(() => import("./components/settings/setting.jsx"));
const Userprofile = lazy(() => import("./components/Userprofile/userprofile.jsx"));
const Subscribers = lazy(() => import("./components/HeroSection/subscribers.jsx"));
const Subscriptions = lazy(() => import("./components/HeroSection/subscriptions.jsx"));
const Mycontent = lazy(() => import("./components/Mycontent/mycontent.jsx"));
const Video = lazy(() => import("./components/Video/ViewVideo.jsx"));
const Videoyoutube = lazy(() => import("./components/Video/viewvideoyt.jsx"));
const HeroSectionSearch = lazy(() => import("./components/HeroSection/Herosection.search.jsx"));
const SearchHome = lazy(() => import("./components/home/Searchhome.jsx"));
const LikedVideo = lazy(() => import("./components/LikedVideo/likedvideo.jsx"));
const Playlist = lazy(() => import("./components/Playlist/playlist.jsx"));
const WatchHistory = lazy(() => import("./components/Watchhistory/watchhistory.jsx"));
const PlaylistVideo = lazy(() => import("./components/Playlist/PlaylistVideo.jsx"));
const OtherUserPlaylistVideo = lazy(() => import("./components/Playlist/otherUserPlaylistVideo.jsx"));
const Notification = lazy(() => import("./components/Notification/notification.jsx"));
const Dashboard = lazy(() => import("./components/Dashboard/dashboard.jsx"));

const router = createBrowserRouter([
  
  {
    path: "/login",
    element: (
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
        <Suspense fallback={<div><CircularProgress color="primary" /></div>}>
          <Login />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: "/signup",
    element: (
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
        <Suspense fallback={<div><CircularProgress color="primary" /></div>}>
          <Signup />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: "/",
    element: (
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
        <Suspense fallback={<div><CircularProgress color="primary" /></div>}>
          <Home />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: "/logout",
    element: (
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
        <Suspense fallback={<div><CircularProgress color="primary" /></div>}>
          <Logout />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: "/settings",
    element: (
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
        <Suspense fallback={<div><CircularProgress color="primary" /></div>}>
          <Setting />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: "/user/:username",
    element: (
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
        <Suspense fallback={<div><CircularProgress color="primary" /></div>}>
          <Userprofile />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: "/user/subscribers",
    element: (
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
        <Suspense fallback={<div><CircularProgress color="primary" /></div>}>
          <Subscribers />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: "/user/subscriptions",
    element: (
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
        <Suspense fallback={<div><CircularProgress color="primary" /></div>}>
          <Subscriptions />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: "/user/mycontent",
    element: (
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
        <Suspense fallback={<div><CircularProgress color="primary" /></div>}>
          <Mycontent />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: "/video/:videoId",
    element: (
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
        <Suspense fallback={<div><CircularProgress color="primary" /></div>}>
          <Video />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: "/youtubevideo/:videoId",
    element: (
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
        <Suspense fallback={<div><CircularProgress color="primary" /></div>}>
          <Videoyoutube />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: "/search",
    element: (
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
        <Suspense fallback={<div><CircularProgress color="primary" /></div>}>
          <SearchHome />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: "/user/likedVideo",
    element: (
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
        <Suspense fallback={<div><CircularProgress color="primary" /></div>}>
          <LikedVideo />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: "/user/playlist",
    element: (
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
        <Suspense fallback={<div><CircularProgress color="primary" /></div>}>
          <Playlist />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: "/user/watch-history",
    element: (
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
        <Suspense fallback={<div><CircularProgress color="primary" /></div>}>
          <WatchHistory />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: "/user/playlist/:playlistID",
    element: (
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
        <Suspense fallback={<div><CircularProgress color="primary" /></div>}>
          <PlaylistVideo />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: "/playlist/:playlistID",
    element: (
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
        <Suspense fallback={<div><CircularProgress color="primary" /></div>}>
          <OtherUserPlaylistVideo />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: "/notifications",
    element: (
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
        <Suspense fallback={<div><CircularProgress color="primary" /></div>}>
          <Notification />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: "/user/dashboard",
    element: (
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
        <Suspense fallback={<div><CircularProgress color="primary" /></div>}>
          <Dashboard />
        </Suspense>
      </ErrorBoundary>
    ),
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;