import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock, faCircleCheck, faCircleXmark, faChevronLeft, faChevronRight,
  faSave, faTriangleExclamation, faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";

const ActivityPage = () => {
  const { activityId } = useParams();
  const navigate = useNavigate();
  
  
  const [activity, setActivity] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  useEffect(() => {
    const activities = JSON.parse(localStorage.getItem("activities") || "[]");
    const act = activities.find(a => a.id === activityId);
    if (act) {
      setActivity(act);
      setTimeLeft(act.duration * 60);
      
      const submissions = JSON.parse(localStorage.getItem("submissions") || "[]");
      const existing = submissions.find(s => s.activityId === activityId && s.studentId === user.rgNumber);
      if (existing) {
        setAnswers(existing.answers || {});
        setSubmitted(true);
        setResult(existing);
      }
    }
  }, [activityId]);

  useEffect(() => {
    if (!started || submitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, submitted, timeLeft]);

  useEffect(() => {
    if (!started || submitted) return;
    const autoSave = setInterval(() => {
      localStorage.setItem(`draft_${activityId}_${user.rgNumber}`, JSON.stringify(answers));
    }, 30000);
    return () => clearInterval(autoSave);
  }, [started, submitted, answers, activityId]);

  const startActivity = () => {
    setStarted(true);
    const draft = localStorage.getItem(`draft_${activityId}_${user.rgNumber}`);
    if (draft) {
      setAnswers(JSON.parse(draft));
    }
  };

  const setAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const calculateScore = () => {
    if (!activity || !activity.questions) return 0;
    let score = 0;
    let total = 0;
    activity.questions.forEach((q, idx) => {
      total += q.points || 10;
      const ans = answers[idx + 1];
      if (q.type === "multiple_choice" && ans === q.correct) score += q.points || 10;
      if (q.type === "true_false" && ans === q.trueFalse) score += q.points || 10;
      if (q.type === "text" && ans && ans.toLowerCase().trim() === q.trueFalse?.toLowerCase().trim()) score += q.points || 10;
    });
    return total > 0 ? Math.round((score / total) * 100) : 0;
  };

  const handleSubmit = () => {
    const score = activity.type === "text" ? null : calculateScore();
    const submission = {
      activityId,
      studentId: user.rgNumber,
      studentName: user.name,
      answers,
      score,
      status: score !== null ? "submitted" : "pending",
      submittedAt: new Date().toISOString()
    };
    
    const submissions = JSON.parse(localStorage.getItem("submissions") || "[]");
    const existingIdx = submissions.findIndex(s => s.activityId === activityId && s.studentId === user.rgNumber);
    if (existingIdx >= 0) {
      submissions[existingIdx] = submission;
    } else {
      submissions.push(submission);
    }
    localStorage.setItem("submissions", JSON.stringify(submissions));
    localStorage.removeItem(`draft_${activityId}_${user.rgNumber}`);
    toast.success("Umerekodiwa!");
    setSubmitted(true);
    setResult(submission);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (!activity) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Activity not found</p>
            <Button onClick={() => navigate("/student")} className="mt-4">
              <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 mr-2" />
              Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted && result) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-gray-900 text-center">Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-4xl font-display font-bold text-gray-900">
                {result.score !== null ? `${result.score}%` : "Pending"}
              </p>
              <p className="text-gray-600">
                {result.status === "graded" ? (
                  result.score >= activity.passingScore ? (
                    <span className="text-gray-600 flex items-center justify-center gap-2">
                      <FontAwesomeIcon icon={faCircleCheck} className="w-5 h-5" /> Umepita!
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center justify-center gap-2">
                      <FontAwesomeIcon icon={faCircleXmark} className="w-5 h-5" /> Haijapita
                    </span>
                  )
                ) : "Inasubiri ukaguzi"}
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium text-gray-900">{activity.title}</p>
              <p className="text-sm text-gray-600">
                Questions: {activity.questions?.length || 0}
              </p>
            </div>

            <Button onClick={() => navigate("/student")} className="w-full bg-primary">
              <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-gray-900">{activity.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-700">
                <FontAwesomeIcon icon={faClock} className="w-5 h-5" />
                <span>Time: {activity.duration} minutes</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <FontAwesomeIcon icon={faClipboardList} className="w-5 h-5" />
                <span>Questions: {activity.questions?.length || 0}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <FontAwesomeIcon icon={faCircleCheck} className="w-5 h-5" />
                <span>Passing: {activity.passingScore}%</span>
              </div>
            </div>
            
            {activity.description && (
              <p className="text-gray-600 text-sm">{activity.description}</p>
            )}

            <FontAwesomeIcon icon={faTriangleExclamation} className="w-5 h-5 text-orange-500" />
            <p className="text-sm text-orange-600">
              Once you start, the timer will begin. You cannot submit after time runs out.
            </p>

            <Button onClick={startActivity} className="w-full bg-primary hover:bg-gray-700">
              Start Activity
            </Button>
            
            <Button onClick={() => navigate("/student")} variant="outline" className="w-full">
              <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 mr-2" />
              Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const question = activity.questions[currentQ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Button onClick={() => navigate("/student")} variant="ghost" size="sm">
            <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 mr-2" />
            Exit
          </Button>
          
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            timeLeft < 60 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
          }`}>
            <FontAwesomeIcon icon={faClock} className="w-5 h-5" />
            <span className="font-display font-bold">{formatTime(timeLeft)}</span>
          </div>
          
          <div className="text-gray-700">
            Swali {currentQ + 1}/{activity.questions.length}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900 text-lg">
              {question.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {question.type === "multiple_choice" && (
              <div className="space-y-2">
                {question.options.map((opt, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  return (
                    <label
                      key={idx}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        answers[currentQ + 1] === letter
                          ? "border-primary bg-gray-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${currentQ}`}
                        checked={answers[currentQ + 1] === letter}
                        onChange={() => setAnswer(letter)}
                        className="sr-only"
                      />
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-bold ${
                        answers[currentQ + 1] === letter
                          ? "bg-gray-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}>
                        {letter}
                      </div>
                      <span className="text-gray-900">{opt}</span>
                    </label>
                  );
                })}
              </div>
            )}

            {question.type === "true_false" && (
              <div className="space-y-2">
                <label
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    answers[currentQ + 1] === "true"
                      ? "border-primary bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${currentQ}`}
                    checked={answers[currentQ + 1] === "true"}
                    onChange={() => setAnswer("true")}
                    className="sr-only"
                  />
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-bold ${
                    answers[currentQ + 1] === "true"
                      ? "bg-gray-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}>
                    ✓
                  </div>
                  <span className="text-gray-900">Kweli</span>
                </label>
                <label
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    answers[currentQ + 1] === "false"
                      ? "border-primary bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${currentQ}`}
                    checked={answers[currentQ + 1] === "false"}
                    onChange={() => setAnswer("false")}
                    className="sr-only"
                  />
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-bold ${
                    answers[currentQ + 1] === "false"
                      ? "bg-gray-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}>
                    ✗
                  </div>
                  <span className="text-gray-900">Uongo</span>
                </label>
              </div>
            )}

            {question.type === "text" && (
              <div className="space-y-2">
                <Input
                  placeholder="Enter your answer here..."
                  value={answers[currentQ + 1] || ""}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="h-24"
                />
                <p className="text-sm text-gray-600">
                  This answer will be reviewed by teacher
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <Button
                onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
                disabled={currentQ === 0}
                variant="outline"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentQ < activity.questions.length - 1 ? (
                <Button
                  onClick={() => setCurrentQ(currentQ + 1)}
                  className="bg-primary"
                >
                  Next
                  <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4 ml-2" />
                </Button>
              ) : (
<Button
                  onClick={handleSubmit}
                  className="bg-primary hover:bg-gray-700"
                >
                  <FontAwesomeIcon icon={faSave} className="w-4 h-4 mr-2" />
                  Submit
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ActivityPage;