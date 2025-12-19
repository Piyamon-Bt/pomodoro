import { useEffect, useMemo, useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  Check,
  Leaf,
  Settings,
  Sparkles,
} from "lucide-react";

type Task = {
  id: number;
  text: string;
  completed: boolean;
  pomodoros: number;
};

export default function GardenPomodoro() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);

  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isBreak, setIsBreak] = useState<boolean>(false);

  const [completedPomodoros, setCompletedPomodoros] = useState<number>(0);
  const [focusTime, setFocusTime] = useState<number>(25);
  const [breakTime, setBreakTime] = useState<number>(5);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  useEffect(() => {
    let interval: number | undefined;

    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    }

    if (timeLeft === 0) {
      setIsRunning(false);

      if (!isBreak) {
        setCompletedPomodoros((p) => p + 1);
        setTimeLeft(breakTime * 60);
        setIsBreak(true);
      } else {
        setTimeLeft(focusTime * 60);
        setIsBreak(false);
      }
    }

    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isRunning, timeLeft, isBreak, focusTime, breakTime]);

  const addTask = () => {
    const text = newTask.trim();
    if (!text) return;

    setTasks((prev) => [
      ...prev,
      { id: Date.now(), text, completed: false, pomodoros: 0 },
    ]);
    setNewTask("");
  };

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    setActiveTaskId((prev) => (prev === id ? null : prev));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft((isBreak ? breakTime : focusTime) * 60);
  };

  const applySettings = () => {
    setIsRunning(false);
    setTimeLeft((isBreak ? breakTime : focusTime) * 60);
    setShowSettings(false);
  };

  const activeTaskText = useMemo(() => {
    if (!activeTaskId) return null;
    return tasks.find((t) => t.id === activeTaskId)?.text ?? null;
  }, [activeTaskId, tasks]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4 md:p-8 relative overflow-hidden">
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-float-particle"
            style={{
              background: `linear-gradient(${Math.random() * 360}deg, rgba(219, 39, 119, 0.3), rgba(147, 51, 234, 0.3), rgba(59, 130, 246, 0.3))`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-purple-300 animate-twinkle"
            size={12 + Math.random() * 8}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Leaf className="text-purple-400 w-10 h-10 animate-float" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
              Garden Focus
            </h1>
            <Leaf
              className="text-pink-400 w-10 h-10 animate-float"
              style={{ animationDelay: "0.5s" }}
            />
          </div>
          <p
            className="text-purple-500 text-lg animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            Grow your productivity, one pomodoro at a time 🌱
          </p>
        </div>

        {/* Timer Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-6 border-4 border-purple-200 animate-scale-in relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 via-purple-50/50 to-blue-50/50 animate-gradient-shift rounded-3xl" />

          <div className="flex justify-end mb-4 relative z-10">
            <button
              onClick={() => setShowSettings((s) => !s)}
              className="text-purple-400 hover:text-purple-500 p-2 hover:bg-purple-50 rounded-lg transition-all transform hover:scale-110 hover:rotate-90 duration-300"
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>

          {showSettings && (
            <div className="mb-6 p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border-2 border-purple-200 relative z-10 animate-slide-down">
              <h3 className="text-xl font-bold text-purple-700 mb-4">
                ⚙️ Timer Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
                  <label className="block text-purple-600 font-semibold mb-2">
                    Focus Time (minutes)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={focusTime}
                    onChange={(e) => setFocusTime(Number(e.target.value))}
                    className="w-full px-4 py-2 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-400 text-purple-700 transition-all focus:scale-105"
                  />
                </div>
                <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  <label className="block text-purple-600 font-semibold mb-2">
                    Break Time (minutes)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={breakTime}
                    onChange={(e) => setBreakTime(Number(e.target.value))}
                    className="w-full px-4 py-2 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-400 text-purple-700 transition-all focus:scale-105"
                  />
                </div>
              </div>
              <button
                onClick={applySettings}
                className="w-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                Apply Settings
              </button>
            </div>
          )}

          <div className="text-center mb-6 relative z-10">
            <div className="inline-block bg-gradient-to-r from-pink-300 to-purple-300 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4 animate-pulse-soft">
              {isBreak ? "🌸 Break Time" : "🌿 Focus Time"}
            </div>

            <div className="text-8xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4 font-mono animate-scale-pulse">
              {formatTime(timeLeft)}
            </div>

            {activeTaskText && (
              <div className="text-purple-600 text-lg animate-fade-in">
                Working on: <span className="font-semibold">{activeTaskText}</span>
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-center mb-4 relative z-10">
            <button
              onClick={() => setIsRunning((r) => !r)}
              className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
            >
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isRunning ? "Pause" : "Start"}
            </button>

            <button
              onClick={resetTimer}
              className="bg-gradient-to-r from-orange-300 to-pink-300 hover:from-orange-400 hover:to-pink-400 text-white px-6 py-4 rounded-2xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:scale-110 hover:rotate-12"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          </div>

          <div className="flex justify-center gap-6 text-center relative z-10">
            <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl px-6 py-3 border-2 border-pink-200 transform hover:scale-110 transition-all duration-300 animate-float">
              <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent animate-number-change">
                {completedPomodoros}
              </div>
              <div className="text-sm text-purple-600">Pomodoros Today</div>
            </div>

            <div
              className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl px-6 py-3 border-2 border-purple-200 transform hover:scale-110 transition-all duration-300 animate-float"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent animate-number-change">
                {tasks.filter((t) => t.completed).length}
              </div>
              <div className="text-sm text-blue-600">Tasks Done</div>
            </div>
          </div>
        </div>

        {/* Task Input */}
        <div
          className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-6 mb-6 border-4 border-pink-200 animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-4 flex items-center gap-2">
            <span className="animate-bounce">🌻</span> Add New Task
          </h2>

          <div className="flex gap-3">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              placeholder="Plant a new task..."
              className="flex-1 px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-400 text-purple-700 placeholder-purple-300 transition-all focus:scale-105 focus:shadow-lg"
            />
            <button
              onClick={addTask}
              className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:scale-110 hover:rotate-3"
            >
              <Plus className="w-5 h-5" />
              Add
            </button>
          </div>
        </div>

        {/* Task List */}
        <div
          className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-blue-200 animate-slide-up"
          style={{ animationDelay: "0.3s" }}
        >
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent mb-4 flex items-center gap-2">
            <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>
              🌳
            </span>{" "}
            Your Garden
          </h2>

          {tasks.length === 0 ? (
            <div className="text-center py-12 text-purple-500 animate-fade-in">
              <div className="text-6xl mb-4 animate-float">🌱</div>
              <p className="text-lg">Your garden is empty. Plant some tasks to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <div
                  key={task.id}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all transform hover:scale-102 animate-slide-in ${
                    task.completed
                      ? "bg-purple-50 border-purple-200 opacity-60"
                      : activeTaskId === task.id
                      ? "bg-gradient-to-r from-pink-50 to-purple-50 border-purple-300 shadow-lg"
                      : "bg-white border-pink-200 hover:border-purple-300 hover:shadow-md"
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all transform hover:scale-125 hover:rotate-12 ${
                      task.completed
                        ? "bg-gradient-to-r from-pink-400 to-purple-400 border-purple-400"
                        : "border-purple-300 hover:border-purple-400"
                    }`}
                  >
                    {task.completed && <Check className="w-4 h-4 text-white" />}
                  </button>

                  <span
                    className={`flex-1 transition-all ${
                      task.completed ? "line-through text-purple-400" : "text-purple-700 font-medium"
                    }`}
                  >
                    {task.text}
                  </span>

                  <button
                    onClick={() =>
                      setActiveTaskId((prev) => (prev === task.id ? null : task.id))
                    }
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all transform hover:scale-110 ${
                      activeTaskId === task.id
                        ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-md"
                        : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                    }`}
                  >
                    {activeTaskId === task.id ? "Active" : "Select"}
                  </button>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-all transform hover:scale-125 hover:rotate-12"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-purple-500 animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <p className="text-sm animate-float">
            🌿 {focusTime} min focus • {breakTime} min break • Stay productive 🌿
          </p>
        </div>
      </div>

      {/* ✅ IMPORTANT: no "jsx" prop here for Vite/React */}
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes float-particle { 0% { transform: translate(0, 0); opacity: 0; } 50% { opacity: 0.6; } 100% { transform: translate(var(--tw-translate-x, 0), -100px); opacity: 0; } }
        @keyframes twinkle { 0%, 100% { opacity: 0.2; } 50% { opacity: 1; } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fade-in-down { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-down { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-in { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes scale-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes scale-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
        @keyframes pulse-soft { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.9; transform: scale(1.05); } }
        @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes gradient-shift { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
        @keyframes number-change { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }

        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-float-particle { animation: float-particle linear infinite; }
        .animate-twinkle { animation: twinkle ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-fade-in-down { animation: fade-in-down 0.6s ease-out; }
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
        .animate-slide-up { animation: slide-up 0.5s ease-out; }
        .animate-slide-in { animation: slide-in 0.4s ease-out; }
        .animate-scale-in { animation: scale-in 0.5s ease-out; }
        .animate-scale-pulse { animation: scale-pulse 2s ease-in-out infinite; }
        .animate-pulse-soft { animation: pulse-soft 2s ease-in-out infinite; }
        .animate-gradient { background-size: 200% 200%; animation: gradient 3s ease infinite; }
        .animate-gradient-shift { animation: gradient-shift 4s ease-in-out infinite; }
        .animate-number-change { animation: number-change 0.3s ease-out; }

        .hover\\:scale-102:hover { transform: scale(1.02); }
      `}</style>
    </div>
  );
}
