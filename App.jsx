import { useState } from "react";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function generateDiagram() {
    if (!prompt.trim()) {
      setResult("Please enter a diagram description.");
      return;
    }

    setLoading(true);
    setResult("Generating...");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: prompt
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "AI request failed.");
      }

      setResult(data.result);
    } catch (error) {
      setResult("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>Math Vision</h1>

      <p>
        AI-powered Mathematical Diagram Assistant
      </p>

      <label htmlFor="prompt">
        Describe the diagram you want to generate:
      </label>

      <br />

      <textarea
        id="prompt"
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        rows="5"
        cols="50"
      />

      <br />

      <button
        onClick={generateDiagram}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Diagram"}
      </button>

      <section aria-live="polite">
        <h2>AI Response</h2>
        <p>{result}</p>
      </section>
    </main>
  );
}