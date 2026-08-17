export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Only POST requests are allowed."
    });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: "No diagram description was provided."
      });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `You are Math Vision, an AI assistant for visually impaired students.

The student wants to generate or understand a mathematical diagram.

Student request:
${prompt}

Describe clearly what the diagram should contain, including shapes, labels, measurements, positions, and important mathematical relationships.`
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "OpenAI request failed."
      });
    }

    return res.status(200).json({
      result: data.output_text || "The AI did not return a response."
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}