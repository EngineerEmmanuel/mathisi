

"use client";

import axios from "axios";
import { useState, useMemo, useEffect } from "react";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";
import PaymentWall from "./components/PaymentWall";
import Header from "./components/Header";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [quiz, setQuiz] = useState("");
  const [summary, setSummary] = useState("");
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const router = useRouter();
  const { user, loading } = useAuth();
  
  // Redirect to auth page if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  // Handle quiz generation
  const handleGenerateQuiz = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }
    setLoadingQuiz(true);
    const formData = new FormData();
    formData.append("document", file);
    try {
      const res = await axios.post<{ quiz: string }>(
        "http://localhost:5000/generate",
        formData
      );
      setQuiz(res.data.quiz);
      setSummary(""); // Clear summary when generating a new quiz
    } catch (err) {
      console.error("Quiz generation error:", err);
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.error || "Unknown error";
        alert(`Quiz generation failed: ${errorMessage}`);
      } else {
        alert("Quiz generation failed: Unknown error");
      }
    } finally {
      setLoadingQuiz(false);
    }
  };

  // Handle summary generation
  const handleGenerateSummary = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }
    setLoadingSummary(true);
    const formData = new FormData();
    formData.append("document", file);
    try {
      const res = await axios.post<{ summary: string }>(
        "http://localhost:5000/summarize",
        formData
      );
      setSummary(res.data.summary);
      setQuiz(""); // Clear quiz when generating a new summary
    } catch (err) {
      console.error("Summary generation error:", err);
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.error || "Unknown error";
        alert(`Summary generation failed: ${errorMessage}`);
      } else {
        alert("Summary generation failed: Unknown error");
      }
    } finally {
      setLoadingSummary(false);
    }
  };

  // Dynamically build nodes and edges from the quiz text
  const { nodes, edges } = useMemo(() => {
    if (!quiz) {
      return { nodes: [], edges: [] };
    }

    const lines = quiz
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const baseX = 200;
    const baseY = 100;

    const nodes = lines.map((line, index) => ({
      id: `${index + 1}`,
      position: {
        x: baseX + (index % 3) * 200,
        y: baseY + Math.floor(index / 3) * 120,
      },
      data: { label: line },
      type: index === 0 ? "input" : undefined,
    }));

    const edges = lines.slice(1).map((_, index) => ({
      id: `e${1 + index}-${2 + index}`,
      source: `${index + 1}`,
      target: `${index + 2}`,
      animated: true,
    }));

    return { nodes, edges };
  }, [quiz]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        Document Processor: Quiz & Summary
      </h1>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload a PDF, DOCX, or TXT file
        </label>
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-4 p-2 border rounded"
        />
      </div>

      <div className="flex space-x-4 mb-6">
        <PaymentWall>
          <button
            onClick={handleGenerateQuiz}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
            disabled={loadingQuiz || loadingSummary}
          >
            {loadingQuiz ? "Generating Quiz..." : "Generate Quiz"}
          </button>
          <button
            onClick={handleGenerateSummary}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-green-300"
            disabled={loadingQuiz || loadingSummary}
          >
            {loadingSummary ? "Generating Summary..." : "Generate Summary"}
          </button>
        </PaymentWall>
      </div>

      {quiz && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Generated Quiz</h2>
          <pre className="bg-white p-4 border rounded whitespace-pre-wrap">
            {quiz}
          </pre>
        </div>
      )}

      {summary && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Document Summary</h2>
          <pre className="bg-white p-4 border rounded whitespace-pre-wrap">
            {summary}
          </pre>
        </div>
      )}

      {nodes.length > 0 && quiz && (
        <div className="mt-10" style={{ width: "100%", height: "600px" }}>
          <h2 className="text-xl font-semibold mb-2">Quiz Mind Map</h2>
          <ReactFlow nodes={nodes} edges={edges} fitView>
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </div>
      )}
      </div>
    </div>
  );
}
