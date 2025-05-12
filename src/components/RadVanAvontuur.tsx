import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import html2canvas from "html2canvas";


const challengeDetails = [
  { title: "Café omgekeerd", description: "Bestel een drankje dat je nooit zou kiezen." },
  { title: "Straatpoëzie", description: "Draag een gedicht voor aan een onbekende." },
  { title: "Snackroulette", description: "Laat een ander willekeurig iets voor je kopen." },
  { title: "Dansvloer zonder vloer", description: "Dans op straat met muziek." },
  { title: "Mystery Challenge", description: "Zing of doe een handstand ergens raar." },
];

export default function RadVanAvontuur() {
  const [selected, setSelected] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [score, setScore] = useState(0);
  const [fails, setFails] = useState(0);
  const [history, setHistory] = useState([]);
  const challengeRef = useRef(null);

  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    const newIndex = Math.floor(Math.random() * challengeDetails.length);
    setTimeout(() => {
      setSelected(newIndex);
      setSpinning(false);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }, 2000);
  };

  const markAsDone = () => {
    if (selected !== null) {
      setHistory([...history, challengeDetails[selected]]);
      setScore(score + 1);
      setSelected(null);
    }
  };

  const markAsFailed = () => {
    if (selected !== null) {
      setFails(fails + 1);
      setSelected(null);
    }
  };

  const downloadPoster = async () => {
    if (challengeRef.current) {
      const canvas = await html2canvas(challengeRef.current);
      const link = document.createElement("a");
      link.download = "mijn-uitdaging.png";
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const shareChallenge = () => {
    const challenge = selected !== null ? challengeDetails[selected] : history[history.length - 1];
    if (navigator.share && challenge) {
      navigator.share({
        title: "Mijn Avontuurlijke Uitdaging",
        text: `${challenge.title} — ${challenge.description}`,
        url: window.location.href
      }).catch(err => console.log("Deel geannuleerd of mislukt:", err));
    } else {
      alert("Delen wordt niet ondersteund op dit apparaat.");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-6 p-4 sm:p-6 bg-gradient-to-br from-pink-100 via-yellow-100 to-blue-100">
      <div className="absolute top-4 right-4 text-sm sm:text-lg font-semibold bg-white px-3 py-2 sm:px-4 sm:py-2 rounded shadow text-right">
        <div>✅ Uitdagingen voltooid: {score}</div>
        <div>❌ Opdrachten mislukt: {fails}</div>
      </div>

      <div className="w-full max-w-[90vw] sm:max-w-xs">
        <div className="rounded-full bg-white border-4 shadow-inner w-64 h-64 flex items-center justify-center text-center text-sm">
  {spinning ? "Spinnen..." : selected !== null ? challengeDetails[selected].title : "Draai het Rad!"}
</div>
      </div>

      <Button onClick={spinWheel} disabled={spinning} className="text-base sm:text-lg px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-md">
        {spinning ? "Even geduld..." : "🎡 DRAAI!"}
      </Button>

      <AnimatePresence>
        {selected !== null && !spinning && (
          <motion.div
            key="challenge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <Card ref={challengeRef} className="w-full max-w-lg text-center shadow-lg mt-6">
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-2">🎯 Je Uitdaging:</h2>
                <h3 className="text-lg font-bold mb-1">{challengeDetails[selected].title}</h3>
                <p className="mb-4">{challengeDetails[selected].description}</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button onClick={markAsDone} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full">
                    ✅ Uitdaging Voltooid
                  </Button>
                  <Button onClick={markAsFailed} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full">
                    ❌ Opdracht Mislukt
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {history.length > 0 && (
        <div className="mt-10 max-w-xl w-full bg-white rounded shadow p-4 text-center">
          <h3 className="text-lg font-semibold mb-2">📚 Voltooide Uitdagingen:</h3>
          <ul className="list-disc pl-5 space-y-1 text-left">
            {history.map((item, index) => (
              <li key={index}><strong>{item.title}</strong>: {item.description}</li>
            ))}
          </ul>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <Button onClick={shareChallenge} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full">📤 Deel</Button>
            <Button onClick={downloadPoster} className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-full">🖼️ Download als Poster</Button>
          </div>
        </div>
      )}
    </div>
  );
}
