import axios from "axios";
import React, { useState } from "react";

const AutoGenerate = () => {
  const [query, setQuery] = useState("");
  const [titledescription, setTitleDescription] = useState([]);
  const [generating, setGenerating] = useState(false);

  const handleSubmit = async () => {
    setGenerating(true);
    try {
      const res = await axios.post(`/api/v1/videos/generatetext?query=${query}`);
      setTitleDescription(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      console.error("Error generating text:", error);
    }
    setGenerating(false);
  };

  const generatedText = titledescription
    .map((item) => `Title: ${item.title}\nDescription: ${item.description}\n\n`)
    .join("");

  return (
    <div className="form-right">
      <label>Auto Generate Title and Description</label>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          height: "12%",
          gap: "1rem",
        }}
      >
        <input
          style={{ height: "35%" }}
          type="text"
          placeholder="Write about your video in 4-5 words..."
          onChange={(e) => setQuery(e.target.value)}
          value={query}
        />

        <button style={{ height: "77%" }} onClick={handleSubmit}>
          {generating ? "Generating..." : "Generate"}
        </button>
      </div>
      <textarea
        placeholder="Generated title and description..."
        readOnly
        value={generatedText}
        style={{ height: "60%", width: "94%" }}
      />
    </div>
  );
};

export default AutoGenerate;
