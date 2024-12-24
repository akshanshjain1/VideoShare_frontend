import { useState } from "react";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";

function AIhelp() {
  const [query, setQuery] = useState("");
  const [generatedText, setgeneratedtext] = useState("");
  const [generating, setGenerating] = useState(false);
  const handlesubmit = async () => {
    setgeneratedtext((prev) => prev + "\n\nYou Said:" + query);
    setGenerating(true);
    try {
      if (generatedText.length > 3000)
        setGenerating((prev) => prev.slice(-3000));
      const res = await axios.post(
        `/api/v1/users/generatetext?query=${query}`,
        { prevconversation: generatedText }
      );
      console.log(res.data.data);
      setgeneratedtext((prev) => prev + "\nAI Said:" + res.data.data);
      console.log(generatedText);
    } catch (error) {
      console.error("Error generating text:", error);
    }
    setGenerating(false);
  };
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: "4px",
          width:'100%',
          height:'100%',
          gap:'0.35rem'

        }}
      >
        <input
          type="text"
          style={{ width: "100%" }}
          placeholder="Write your question"
          onChange={(e) => setQuery(e.target.value)}
          value={query}
        />
        <Button
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          onClick={handlesubmit}
        ></Button>
      </div>
      <div style={{ height: "100%" }}>
        <textarea
          placeholder="Generated Text"
          value={generatedText}
          style={{ height: "300px", width: "300px" }}
        ></textarea>
      </div>
    </div>
  );
}
export default AIhelp;
