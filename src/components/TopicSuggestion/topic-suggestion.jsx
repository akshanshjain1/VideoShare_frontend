import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios"
export default function TagTopicSelector() {
  const [tags, setTags] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedMain, setSelectedMain] = useState(null);
  const [selectedSubTags, setSelectedSubTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axios.get("/api/v1/topic-suggestion/tags");
        setTags(res.data);
      } catch (err) {
        console.error("Error fetching tags:", err);
      }
    };
    
    fetchTags();
  }, []);

  useEffect(() => {
    const fetchTopics = async () => {
      if (selectedSubTags.length === 0) {
        setTopics([]);
        return;
      }
      try {
        const res = await axios.post("/api/v1/topic-suggestion/topics-by-tags", { subTags: selectedSubTags });
        setTopics(res.data);
      } catch (err) {
        console.error("Error fetching topics:", err);
      }
    };
    fetchTopics();
  }, [selectedSubTags]);

  const toggleSubTag = (tag) => {
    setSelectedSubTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleMainTag = (tagId) => {
    if (selectedMain === tagId) {
      setSelectedMain(null);
      setSelectedSubTags([]);
    } else {
      setSelectedMain(tagId);
      setSelectedSubTags([]);
    }
  };

  const friendlyExplanation = {
    hook: "The opening statement or action to grab attention",
    intro: "A brief introduction to the topic",
    middle: "The main content or story",
    end: "A conclusion or wrap-up",
    toneAndStyle: "The overall mood and delivery (e.g., funny, serious)",
    editingTips: "Suggestions to enhance the visuals or audio",
    retentionTips: "Tricks to keep viewers engaged",
    emotionToEvoke: "The feeling you want the viewer to experience",
    cta: "Call To Action, like 'Subscribe', 'Comment', or 'Visit the link'",
    suggestedDuration: "The recommended length of the video",
    platformTips: "Tips for publishing and platform-specific tricks",
    backgroundMusicSuggestions: "Suggested background music with mood and URL"
  };

  const Button = ({ children, onClick, variant = "default", style = {} }) => {
    const baseStyle = {
      padding: "12px 24px",
      borderRadius: "12px",
      border: "none",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "600",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      position: "relative",
      overflow: "hidden",
      textTransform: "capitalize",
      letterSpacing: "0.5px",
      ...style
    };

    const variants = {
      default: {
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        boxShadow: "0 8px 32px rgba(102, 126, 234, 0.4)",
        transform: "translateY(0)",
      },
      outline: {
        background: "rgba(255, 255, 255, 0.9)",
        color: "#667eea",
        border: "2px solid #667eea",
        boxShadow: "0 4px 16px rgba(102, 126, 234, 0.2)",
      },
      secondary: {
        background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
        color: "#d97706",
        boxShadow: "0 4px 16px rgba(252, 182, 159, 0.4)",
      }
    };

    const hoverStyle = variant === "default" ? {
      transform: "translateY(-2px)",
      boxShadow: "0 12px 40px rgba(102, 126, 234, 0.6)",
    } : variant === "outline" ? {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      transform: "translateY(-2px)",
      boxShadow: "0 8px 32px rgba(102, 126, 234, 0.4)",
    } : {
      transform: "translateY(-2px)",
      boxShadow: "0 8px 32px rgba(252, 182, 159, 0.6)",
    };

    return (
      <button
        onClick={onClick}
        style={{
          ...baseStyle,
          ...variants[variant],
        }}
        onMouseEnter={(e) => {
          Object.assign(e.target.style, hoverStyle);
        }}
        onMouseLeave={(e) => {
          Object.assign(e.target.style, variants[variant]);
        }}
      >
        {children}
      </button>
    );
  };

  const Card = ({ children, style = {} }) => (
    <div style={{
      borderRadius: "24px",
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)",
      overflow: "hidden",
      position: "relative",
      ...style
    }}>
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "4px",
        background: "linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c, #4facfe, #00f2fe)"
      }} />
      {children}
    </div>
  );

  return (
    <div style={{
      minHeight: "100%",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      position: "relative",
      minWidth:"100%",
      overflow:"scroll"
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: `
          radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(79, 172, 254, 0.3) 0%, transparent 50%)
        `,
        animation: "float 20s ease-in-out infinite"
      }} />
      
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-20px) rotate(1deg); }
            66% { transform: translateY(-10px) rotate(-1deg); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }
          .shimmer {
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.4),
              transparent
            );
            background-size: 1000px 100%;
            animation: shimmer 3s infinite;
          }
        `}
      </style>

      <div style={{
        position: "relative",
        zIndex: 1,
        padding: "40px 24px",
        maxWidth: "1400px",
        margin: "0 auto"
      }}>
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            textAlign: "center",
            marginBottom: "50px"
          }}
        >
          <h1 style={{
            fontSize: "3.5rem",
            fontWeight: "800",
            background: "linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "16px",
            textShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
          }}>
            The Content Creator Studio
          </h1>
          <p style={{
            fontSize: "1.25rem",
            color: "rgba(255, 255, 255, 0.9)",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: "1.6"
          }}>
            Discover uncovered topics and get content suggestions tailored for your audience
          </p>
        </motion.div>

        <div style={{
          display: "flex",
          gap: "40px",
          alignItems: "flex-start",
          flexWrap: "wrap"
        }}>
          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              flex: "0 0 380px",
              position: "sticky",
              top: "40px"
            }}
          >
            <Card style={{ padding: "32px" }}>
              <h2 style={{
                fontSize: "1.75rem",
                fontWeight: "700",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "12px"
              }}>
                🎯 Choose Your Niche
              </h2>
              <p style={{
                fontSize: "1rem",
                color: "#6b7280",
                marginBottom: "24px",
                lineHeight: "1.5"
              }}>
                Select a category that matches your content style and audience interests.
              </p>
              
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                marginBottom: "24px"
              }}>
                {tags.map((tag) => (
                  <Button
                    key={tag._id}
                    onClick={() => toggleMainTag(tag._id)}
                    variant={selectedMain === tag._id ? "default" : "outline"}
                    style={{
                      fontSize: "16px",
                      animation: selectedMain === tag._id ? "pulse 2s infinite" : "none"
                    }}
                  >
                    {tag.mainTag}
                  </Button>
                ))}
              </div>

              <AnimatePresence>
                {selectedMain && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <div style={{
                      padding: "20px",
                      background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                      borderRadius: "16px",
                      border: "1px solid #e2e8f0"
                    }}>
                      <h3 style={{
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: "12px"
                      }}>
                        ✨ Specific Topics
                      </h3>
                      <div style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px"
                      }}>
                        {tags
                          .find((tag) => tag._id === selectedMain)
                          ?.subTags.map((sub) => (
                            <Button
                              key={sub._id}
                              onClick={() => toggleSubTag(sub.name)}
                              variant={selectedSubTags.includes(sub.name) ? "default" : "secondary"}
                              style={{ fontSize: "14px" }}
                            >
                              {sub.name}
                            </Button>
                          ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>

          {/* Main Content */}
          <div style={{ flex: "1", minWidth: "600px" }}>
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "400px"
                  }}
                >
                  <div style={{
                    width: "80px",
                    height: "80px",
                    border: "4px solid rgba(255, 255, 255, 0.3)",
                    borderTop: "4px solid #ffffff",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                  }} />
                  <style>
                    {`
                      @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                      }
                    `}
                  </style>
                </motion.div>
              ) : topics.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card style={{
                    padding: "60px 40px",
                    textAlign: "center",
                    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)"
                  }}>
                    <div style={{
                      fontSize: "4rem",
                      marginBottom: "24px",
                      animation: "float 3s ease-in-out infinite"
                    }}>
                      ✨
                    </div>
                    <h3 style={{
                      fontSize: "1.5rem",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "16px"
                    }}>
                      Ready to Create Amazing Content?
                    </h3>
                    <p style={{
                      fontSize: "1.1rem",
                      color: "#6b7280",
                      lineHeight: "1.6",
                      maxWidth: "500px",
                      margin: "0 auto"
                    }}>
                      Select a category and choose specific topics to unlock personalized content ideas, 
                      trending suggestions, and AI-powered creation tips.
                    </p>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  style={{ display: "flex", flexDirection: "column", gap: "30px" }}
                >
                  {topics.map((topic, index) => (
                    <motion.div
                      key={topic._id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card style={{ overflow: "visible" }}>
                        <div style={{ padding: "32px" }}>
                          {/* Topic Header */}
                          <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                            marginBottom: "24px"
                          }}>
                            <div style={{
                              width: "60px",
                              height: "60px",
                              borderRadius: "16px",
                              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "1.5rem",
                              color: "white",
                              fontWeight: "bold"
                            }}>
                              🎯
                            </div>
                            <div>
                              <h2 style={{
                                fontSize: "1.75rem",
                                fontWeight: "700",
                                color: "#111827",
                                marginBottom: "4px"
                              }}>
                                {topic.title}
                              </h2>
                              <p style={{
                                fontSize: "1rem",
                                color: "#6b7280",
                                fontStyle: "italic"
                              }}>
                                {topic.summarizedTitle}
                              </p>
                            </div>
                          </div>

                          {/* Stats Grid */}
                          <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: "16px",
                            marginBottom: "24px"
                          }}>
                            {[
                              { label: "Videos Created", value: topic.videoCreatedCount, icon: "🎥", color: "#10b981" },
                              { label: "Search Count", value: topic.searchCount, icon: "📊", color: "#3b82f6" },
                              { label: "Demand Score", value: topic.demandScore, icon: "🔥", color: "#f59e0b" },
                              { label: "Tags", value: topic.tags.length, icon: "🏷️", color: "#8b5cf6" }
                            ].map((stat, idx) => (
                              <div key={idx} style={{
                                background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                                padding: "16px",
                                borderRadius: "12px",
                                border: `2px solid ${stat.color}20`,
                                textAlign: "center"
                              }}>
                                <div style={{
                                  fontSize: "1.5rem",
                                  marginBottom: "4px"
                                }}>
                                  {stat.icon}
                                </div>
                                <div style={{
                                  fontSize: "1.5rem",
                                  fontWeight: "700",
                                  color: stat.color,
                                  marginBottom: "2px"
                                }}>
                                  {stat.value}
                                </div>
                                <div style={{
                                  fontSize: "0.875rem",
                                  color: "#6b7280",
                                  fontWeight: "500"
                                }}>
                                  {stat.label}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Music Suggestions */}
                          <div style={{
                            background: "linear-gradient(135deg, #fef3c7 0%, #f59e0b20 100%)",
                            padding: "20px",
                            borderRadius: "16px",
                            marginBottom: "24px",
                            border: "1px solid #f59e0b30"
                          }}>
                            <h3 style={{
                              fontSize: "1.25rem",
                              fontWeight: "600",
                              color: "#92400e",
                              marginBottom: "16px",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px"
                            }}>
                              🎵 Background Music Suggestions
                            </h3>
                            <div style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                              gap: "12px"
                            }}>
                              {['short', 'long'].flatMap(type => (
                                Object.values(topic.instructions[type]?.language || {}).flatMap((langObj) => (
                                  (langObj.backgroundMusicSuggestions || []).map((track, idx) => (
                                    <div key={type + track.url + idx} style={{
                                      background: "rgba(255, 255, 255, 0.7)",
                                      padding: "12px",
                                      borderRadius: "8px",
                                      border: "1px solid #f59e0b40"
                                    }}>
                                      <div style={{
                                        fontWeight: "600",
                                        color: "#92400e",
                                        fontSize: "0.875rem",
                                        marginBottom: "4px"
                                      }}>
                                        {track.mood}
                                      </div>
                                      <a 
                                        href={track.url} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        style={{
                                          color: "#2563eb",
                                          textDecoration: "none",
                                          fontSize: "0.875rem",
                                          wordBreak: "break-all"
                                        }}
                                      >
                                        {track.url}
                                      </a>
                                    </div>
                                  ))
                                ))
                              ))}
                            </div>
                          </div>

                          {/* Instructions */}
                          {['short', 'long'].map((type) => (
                            <details key={type} style={{
                              marginBottom: "16px",
                              borderRadius: "16px",
                              background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
                              border: "1px solid #cbd5e1",
                              overflow: "hidden"
                            }}>
                              <summary style={{
                                cursor: "pointer",
                                padding: "20px",
                                fontWeight: "600",
                                fontSize: "1.125rem",
                                color: "#334155",
                                background: "linear-gradient(135deg, #667eea20 0%, #764ba220 100%)",
                                borderBottom: "1px solid #cbd5e1",
                                transition: "all 0.3s ease"
                              }}>
                                {type === 'short' ? '🎬 Short-Form Content Strategy' : '📺 Long-Form Content Blueprint'}
                              </summary>
                              <div style={{ padding: "24px" }}>
                                {Object.entries(topic.instructions[type].language).map(([lang, inst]) => (
                                  <div key={lang} style={{
                                    background: "rgba(255, 255, 255, 0.7)",
                                    padding: "20px",
                                    borderRadius: "12px",
                                    border: "1px solid #e2e8f0"
                                  }}>
                                    <h4 style={{
                                      fontSize: "1.125rem",
                                      fontWeight: "600",
                                      color: "#1f2937",
                                      marginBottom: "16px",
                                      textTransform: "capitalize",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px"
                                    }}>
                                      🌍 {lang} Content Guidelines
                                    </h4>
                                    <div style={{
                                      display: "grid",
                                      gap: "12px"
                                    }}>
                                      {Object.entries(inst).map(([key, val]) => (
                                        key === 'structure' ? (
                                          <div key={key} style={{
                                            background: "linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%)",
                                            padding: "16px",
                                            borderRadius: "8px",
                                            border: "1px solid #c4b5fd"
                                          }}>
                                            <h5 style={{
                                              fontSize: "1rem",
                                              fontWeight: "600",
                                              color: "#5b21b6",
                                              marginBottom: "8px"
                                            }}>
                                              📋 Content Structure
                                            </h5>
                                            {Object.entries(val).map(([section, content]) => (
                                              <div key={section} style={{
                                                marginBottom: "8px",
                                                fontSize: "0.875rem"
                                              }}>
                                                <span style={{
                                                  fontWeight: "600",
                                                  color: "#7c3aed",
                                                  textTransform: "capitalize"
                                                }}>
                                                  {section}:
                                                </span>
                                                <span style={{
                                                  color: "#4c1d95",
                                                  marginLeft: "8px"
                                                }}>
                                                  {content}
                                                </span>
                                              </div>
                                            ))}
                                          </div>
                                        ) : key === 'backgroundMusicSuggestions' ? null : (
                                          <div key={key} style={{
                                            padding: "12px",
                                            background: "rgba(255, 255, 255, 0.5)",
                                            borderRadius: "8px",
                                            border: "1px solid #e5e7eb"
                                          }}>
                                            <span style={{
                                              fontWeight: "600",
                                              color: "#374151",
                                              fontSize: "0.875rem"
                                            }}>
                                              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:
                                            </span>
                                            <span style={{
                                              color: "#6b7280",
                                              marginLeft: "8px",
                                              fontSize: "0.875rem"
                                            }}>
                                              {val}
                                            </span>
                                            <div style={{
                                              fontSize: "0.75rem",
                                              color: "#9ca3af",
                                              fontStyle: "italic",
                                              marginTop: "4px"
                                            }}>
                                              {friendlyExplanation[key] || ""}
                                            </div>
                                          </div>
                                        )
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </details>
                          ))}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}