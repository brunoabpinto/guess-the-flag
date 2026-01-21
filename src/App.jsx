import { useState, useEffect } from 'react';
import { flags } from './flags';


export default function FlagGame() {
  const [currentFlag, setCurrentFlag] = useState(null);
  const [score, setScore] = useState(0);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [usedFlags, setUsedFlags] = useState([]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    loadNewFlag();
  }, []);

  const loadNewFlag = () => {
    const availableFlags = flags.filter(f => !usedFlags.includes(f.name));
    
    if (availableFlags.length === 0) {
      return;
    }

    const randomFlag = availableFlags[Math.floor(Math.random() * availableFlags.length)];
    setOptions( getRandomNames(flags, randomFlag.name));
    setCurrentFlag(randomFlag);
    setFeedback('');
    setSelectedAnswer(null);
  };

  const getRandomNames = (arr, correctName) => {
    const filtered = arr.filter(item => item.name !== correctName);
    const shuffled = [...filtered].sort(() => 0.5 - Math.random()).slice(0, 3);
    const names = shuffled.map(item => item.name);

    const correctNamePos = Math.floor(Math.random() * (names.length + 1));
    names.splice(correctNamePos, 0, correctName);

    return names;
};

  const handleAnswer = (answer) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    setQuestionsAsked(prev => prev + 1);
    setUsedFlags(prev => [...prev, currentFlag.name]);

    if (answer === currentFlag.name) {
      setScore(prev => prev + 1);
    } else {
      setFeedback(`Wrong! It was ${currentFlag.name}`);
      setCurrentFlag(null);
      return;
    }

    setTimeout(() => {
      if (usedFlags.length + 1 >= flags.length) {
        return;
      }
      loadNewFlag();
    }, 1500);
  };

  const resetGame = () => {
    setScore(0);
    setQuestionsAsked(0);
    setUsedFlags([]);
    setFeedback('');
    setSelectedAnswer(null);
    loadNewFlag();
  };

  if (!currentFlag) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold mb-4">Game Complete! 🎊</h1>
          <p className="text-xl mb-2">Final Score: {score}</p>
          <p className="text-lg mb-6">
            {score === questionsAsked ? 'Perfect score! 🏆' : 
             score >= questionsAsked * 0.7 ? 'Great job! 🌟' : 
             'Keep practicing! 💪'}
          </p>
          <button
            onClick={resetGame}
            className="bg-linear-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="flex justify-end items-center mb-6">
          <div className="text-right">
            <p className="text-sm text-gray-600">Score</p>
            <p className="text-2xl font-bold text-purple-600">{score}</p>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="text-9xl mb-4">{currentFlag.emoji}</div>
          {feedback && (
            <p className={`text-xl font-semibold ${
              feedback.includes('Correct') ? 'text-green-600' : 'text-red-600'
            }`}>
              {feedback}
            </p>
          )}
        </div>

        <div className="space-y-3">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
              className={`w-full p-4 rounded-lg font-semibold transition-all ${
                selectedAnswer === null
                  ? 'bg-gray-100 hover:bg-purple-100 hover:shadow-md text-gray-800'
                  : selectedAnswer === option
                  ? option === currentFlag.name
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  : option === currentFlag.name
                  ? 'bg-green-200 text-green-800'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          Question {Math.min(questionsAsked + 1, flags.length)} of {flags.length}
        </div>
      </div>
    </div>
  );
}