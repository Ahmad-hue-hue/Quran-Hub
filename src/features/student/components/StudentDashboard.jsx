import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { BookOpen, Calendar, ClipboardList, BarChart3, Users, HelpCircle, LogOut, Lock, CheckCircle, Clock, ChevronRight, Menu, X, Home, GraduationCap, Sparkles, Award, MessageCircle, Search, Send, Trash2 } from "lucide-react";
import Logo from "@/assets/images/logo.jpeg";
import { getScheduleData } from "./scheduleData";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/toast";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [activeSection, setActiveSection] = useState("profile");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLesson, setHoveredLesson] = useState(null);
  const [question, setQuestion] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null });
  const [lastReplyCount, setLastReplyCount] = useState(0);
  const [newReplies, setNewReplies] = useState(false);

  const deleteQuestionGlobal = () => {
    const qId = deleteDialog.item;
    if (!qId) return;
    const allQ = JSON.parse(localStorage.getItem("questions") || "[]");
    const filtered = allQ.filter(q => q.id !== qId);
    localStorage.setItem("questions", JSON.stringify(filtered));
    if (selectedQuestion && selectedQuestion.id === qId) {
      setSelectedQuestion(null);
    }
    setDeleteDialog({ open: false, item: null });
    alert("Question deleted");
  };

  useEffect(() => {
    if (selectedQuestion) {
      const allQuestions = JSON.parse(localStorage.getItem("questions") || "[]");
      const updated = allQuestions.find(q => q.id === selectedQuestion.id);
      if (updated) {
        setSelectedQuestion(updated);
      }
    }
  }, [activeSection]);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const student = currentUser || {
    name: "Mwigulu",
    rgNumber: "1.5.1.A",
    marhala: 1,
    awamu: 5,
    gender: "A"
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (activeSection === "teachers") {
        const freshQuestions = JSON.parse(localStorage.getItem("questions") || "[]");
        const freshMyQuestions = freshQuestions.filter(q => q.studentId === student.rgNumber);
        const freshReplied = freshMyQuestions.filter(q => q.status === "answered").length;
        if (freshReplied > lastReplyCount) {
          setNewReplies(true);
          setTimeout(() => setNewReplies(false), 5000);
        }
        setLastReplyCount(freshReplied);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [activeSection, student.rgNumber]);

  const marhalaLessons = {
    1: [
      { id: "m1-l1", title: "Al-Isti'ādhah", description: "Seeking refuge with Allah", isLocked: true, isCompleted: false },
      { id: "m1-l2", title: "Al-Basmālah", description: "In the name of Allah", isLocked: true, isCompleted: false },
      { id: "m1-l3", title: "Tajwīd na yanayohusiana nayo", description: "Fundamentals of Tajweed", isLocked: true, isCompleted: false },
      { id: "m1-l4", title: "Al-Lahnu al-Jalī wa al-Khafī", description: "Clear and hidden recitation", isLocked: true, isCompleted: false },
      { id: "m1-l5", title: "Idh-hār Al halqī", description: "Clear letter pronunciation", isLocked: true, isCompleted: false },
      { id: "m1-l6", title: "Idghām + Iqlāb", description: "Merging and conversion", isLocked: true, isCompleted: false },
      { id: "m1-l7", title: "Ikhfā'", description: "Hidden recitation", isLocked: true, isCompleted: false },
      { id: "m1-l8", title: "Mīm Sākinah (Idh-hār)", description: "Silent Meem rules", isLocked: true, isCompleted: false },
      { id: "m1-l9", title: "Idghām Mithlayn + Ikhfā'", description: "Advanced merging rules", isLocked: true, isCompleted: false },
    ],
    2: [
      { id: "m2-l1", title: "Al-Muqqaddimah", description: "Introduction to Tajweed", isLocked: true, isCompleted: false },
      { id: "m2-l2", title: "Sifaat al-Huroof", description: "Attributes of letters", isLocked: true, isCompleted: false },
      { id: "m2-l3", title: "Makharij al-Huroof", description: "Articulation points", isLocked: true, isCompleted: false },
      { id: "m2-l4", title: "Ahkaam al-Mad", description: "Rules of elongation", isLocked: true, isCompleted: false },
      { id: "m2-l5", title: "Ahkaam al-Sukun", description: "Rules of stillness", isLocked: true, isCompleted: false },
      { id: "m2-l6", title: "Ahkaam al-Tajweed", description: "Detailed Tajweed rules", isLocked: true, isCompleted: false },
      { id: "m2-l7", title: "Al-Waqf wa al-Ibtida", description: "Pausing and starting", isLocked: true, isCompleted: false },
      { id: "m2-l8", title: "Tashbih al-Murakkab", description: "Compound similarity", isLocked: true, isCompleted: false },
      { id: "m2-l9", title: "Kalimaat al-Mutqalib", description: "Complex words", isLocked: true, isCompleted: false },
    ],
    3: [
      { id: "m3-l1", title: "Nazaa'ir", description: "Similar letters", isLocked: true, isCompleted: false },
      { id: "m3-l2", title: "Maqbool wa Manzool", description: "Accepted and rejected", isLocked: true, isCompleted: false },
      { id: "m3-l3", title: "Ahkaam al-Laam", description: "Rules of Laam", isLocked: true, isCompleted: false },
      { id: "m3-l4", title: "Ahkaam al-Raa", description: "Rules of Raa", isLocked: true, isCompleted: false },
      { id: "m3-l5", title: "Ahkaam al-Noon", description: "Rules of Noon", isLocked: true, isCompleted: false },
      { id: "m3-l6", title: "Ahkaam al-Meem", description: "Rules of Meem", isLocked: true, isCompleted: false },
      { id: "m3-l7", title: "Ahkaam al-Taa Marbootah", description: "Rules of Taa Marbootah", isLocked: true, isCompleted: false },
      { id: "m3-l8", title: "Qira'ah al-Mukhtalif", description: "Different readings", isLocked: true, isCompleted: false },
      { id: "m3-l9", title: "Tartheel", description: "Rhythmic recitation", isLocked: true, isCompleted: false },
    ],
    4: [
      { id: "m4-l1", title: "Hishamniyat", description: "Advanced Hisham style", isLocked: true, isCompleted: false },
      { id: "m4-l2", title: "Shatibiyyat", description: "Shatibiyyah recitation", isLocked: true, isCompleted: false },
      { id: "m4-l3", title: "Duruziyyat", description: "Advanced practice", isLocked: true, isCompleted: false },
      { id: "m4-l4", title: "Tajweed al-Kabir", description: "Major Tajweed", isLocked: true, isCompleted: false },
      { id: "m4-l5", title: "Tajweed al-Saghir", description: "Minor Tajweed", isLocked: true, isCompleted: false },
      { id: "m4-l6", title: "Ahkam al-Mim al-Musahhah", description: "Whispered Meem rules", isLocked: true, isCompleted: false },
      { id: "m4-l7", title: "Qalqalah", description: "Vibration rules", isLocked: true, isCompleted: false },
      { id: "m4-l8", title: "Madd al-Munfasil", description: "Separate elongation", isLocked: true, isCompleted: false },
      { id: "m4-l9", title: "Madd al-Muttasil", description: "Connected elongation", isLocked: true, isCompleted: false },
    ],
  };

  const lessons = (() => {
    const marhalaKey = student.marhala || 1;
    const marhalaL = marhalaLessons[marhalaKey] || marhalaLessons[1];
    const unlockedLessons = JSON.parse(localStorage.getItem("unlockedLessons") || "{}");
    const unlockedForMarhala = unlockedLessons[marhalaKey] || [];
    
    return marhalaL.map(lesson => {
      const lessonId = lesson.id;
      const isUnlocked = unlockedForMarhala.includes(lessonId);
      return { ...lesson, isLocked: !isUnlocked };
    });
  })();

  const activities = (() => {
    const allActivities = JSON.parse(localStorage.getItem("activities") || "[]");
    return allActivities.filter(a => a.marhala === student.marhala);
  })();

  const schedule = getScheduleData(student.marhala || 1);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const allQuestions = JSON.parse(localStorage.getItem("questions") || "[]");
  const myQuestions = allQuestions.filter(q => q.studentId === student.rgNumber);
  const unreadReplies = myQuestions.filter(q => q.status === "answered").length;
  
  const navItems = [
    { icon: Home, label: "Profile", section: "profile" },
    { icon: Calendar, label: "Schedule", section: "schedule" },
    { icon: BookOpen, label: "Lessons", section: "lessons" },
    { icon: ClipboardList, label: "Activities", section: "activities" },
    { icon: Award, label: "Results", section: "results" },
    { icon: Users, label: "Ask Teacher", section: "teachers", badge: unreadReplies > 0 ? unreadReplies : 0 },
    { icon: BookOpen, label: "About", section: "about" },
  ];

  const SidebarItem = ({ icon: Icon, label, section, badge }) => (
    <button
      onClick={() => {
        setActiveSection(section);
        setMobileMenuOpen(false);
      }}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
        activeSection === section 
          ? "bg-gradient-to-r from-emerald-100 to-teal-50 text-emerald-800 border-l-4 border-emerald-600 shadow-sm" 
          : "text-emerald-900/70 hover:bg-emerald-50 hover:text-emerald-900"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 transition-transform duration-300 ${activeSection === section ? 'text-emerald-600' : 'group-hover:scale-110'}`} />
        <span className="font-body font-medium">{label}</span>
      </div>
      {badge > 0 && (
        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">{badge}</span>
      )}
    </button>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-100 via-white to-emerald-50 rounded-2xl shadow-lg p-6 text-emerald-900 border border-emerald-200">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-200/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-3 border-emerald-300 shadow-xl">
                    <img src={Logo} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="text-center md:text-left flex-1">
                  <h2 className="text-2xl font-display font-bold text-emerald-900">{student.name}</h2>
                  <p className="text-emerald-700 text-sm">Marhala {student.marhala} • Awamu {student.awamu}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3">
                    <div className="bg-white/80 rounded-lg px-3 py-1.5 border border-emerald-200">
                      <p className="text-xs text-emerald-500 uppercase tracking-wider">Reg</p>
                      <p className="text-base font-semibold font-display text-emerald-800">{student.rgNumber}</p>
                    </div>
                    <div className="bg-white/80 rounded-lg px-3 py-1.5 border border-emerald-200">
                      <p className="text-xs text-emerald-500 uppercase tracking-wider">Marhala</p>
                      <p className="text-base font-semibold font-display text-emerald-800">{student.marhala}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="bg-white border border-emerald-100 hover:border-emerald-300 hover:shadow-md transition-all">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-display font-bold text-emerald-900">0/9</p>
                  <p className="text-xs text-emerald-600">Lessons</p>
                </CardContent>
              </Card>
              <Card className="bg-white border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-blue-100 flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-2xl font-display font-bold text-blue-900">0/2</p>
                  <p className="text-xs text-blue-600">Quizzes</p>
                </CardContent>
              </Card>
              <Card className="bg-white border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-purple-100 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-2xl font-display font-bold text-purple-900">0/1</p>
                  <p className="text-xs text-purple-600">Exam</p>
                </CardContent>
              </Card>
              <Card className="bg-white border border-amber-100 hover:border-amber-300 hover:shadow-md transition-all">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                  </div>
                  <p className="text-2xl font-display font-bold text-amber-900">0%</p>
                  <p className="text-xs text-amber-600">Progress</p>
                </CardContent>
              </Card>
            </div>
            <Card className="bg-emerald-50 border border-emerald-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-display font-semibold text-emerald-900 text-sm">Your Progress</h3>
                </div>
                <div className="w-full bg-emerald-200 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: '0%' }}></div>
                </div>
                <p className="text-right text-sm text-emerald-600 mt-2 font-body">0% completed</p>
              </CardContent>
            </Card>
          </div>
        );
      
      case "schedule": {
        return (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
              <h3 className="text-lg font-display font-semibold text-emerald-900">Schedule - Awamu {student.awamu}</h3>
            </div>
            <div className="space-y-2">
              {schedule.map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-4 bg-white rounded-xl border border-emerald-100 hover:border-emerald-300 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-lg ${
                      item.type === "lesson" 
                        ? "bg-emerald-100 text-emerald-700" 
                        : item.type === "quiz"
                        ? "bg-blue-100 text-blue-700"
                        : item.type === "exam"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {item.type === "lesson" ? "L" : item.type === "quiz" ? "Q" : item.type === "exam" ? "E" : "R"}
                    </div>
                    <div>
                      <p className="font-display font-semibold text-emerald-900">{item.title}</p>
                      <p className="text-sm text-emerald-600">{item.date}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.type === "quiz" 
                      ? "bg-blue-100 text-blue-700" 
                      : item.type === "exam"
                      ? "bg-purple-100 text-purple-700"
                      : item.type === "results"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}>
                    {item.type === "lesson" ? "Lesson" : item.type === "quiz" ? "Quiz" : item.type === "exam" ? "Exam" : "Results"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case "lessons":
        return (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
              <h3 className="text-lg font-display font-semibold text-emerald-900">Lessons - Marhala {student.marhala}</h3>
              <span className="text-sm text-emerald-600">{lessons.filter(l => !l.isLocked).length}/{lessons.length} available</span>
            </div>
            <div className="space-y-2">
              {lessons.map((lesson, idx) => (
                <div 
                  key={lesson.id}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                    lesson.isLocked 
                      ? "bg-gray-50 border-gray-200 opacity-60" 
                      : lesson.isCompleted
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-white border-emerald-100 hover:border-emerald-300 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-display font-bold ${
                      lesson.isLocked 
                        ? "bg-gray-200 text-gray-500" 
                        : lesson.isCompleted
                        ? "bg-emerald-600 text-white"
                        : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {lesson.isLocked ? (
                        <Lock className="w-5 h-5" />
                      ) : lesson.isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>
                    <div>
                      <h4 className={`font-display font-semibold text-lg ${lesson.isLocked ? 'text-gray-400' : 'text-emerald-900'}`}>{lesson.title}</h4>
                      <p className={`text-sm ${lesson.isLocked ? 'text-gray-400' : 'text-emerald-600'}`}>{lesson.description}</p>
                    </div>
                  </div>
                  {!lesson.isLocked && (
                    <Button 
                      className={`px-4 py-2 font-medium transition-all duration-300 ${
                        lesson.isCompleted
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          : "bg-amber-500 hover:bg-amber-600 text-white"
                      }`}
                    >
                      {lesson.isCompleted ? "Review" : "Start"}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case "teachers": {
        const allTeachers = JSON.parse(localStorage.getItem("teachers") || "[]");
        const filteredTeachers = allTeachers.filter(t => t.gender === student.gender);
        
        const allQuestions = JSON.parse(localStorage.getItem("questions") || "[]");
        const myQuestions = allQuestions
          .filter(q => q.studentId === student.rgNumber)
          .sort((a, b) => b.id - a.id);
        
        const activeQuestion = selectedQuestion 
          ? allQuestions.find(q => q.id === selectedQuestion.id) || selectedQuestion 
          : null;

        const sendQuestion = () => {
          if (!question.trim()) {
            toast("Write a question", "error");
            return;
          }
          if (!selectedTeacher) {
            toast("Select a teacher", "error");
            return;
          }
          const questions = JSON.parse(localStorage.getItem("questions") || "[]");
          const newQuestion = {
            id: Date.now(),
            studentId: student.rgNumber,
            studentName: student.name,
            studentGender: student.gender,
            teacherId: selectedTeacher.phone,
            teacherName: selectedTeacher.name,
            question,
            answer: "",
            status: "pending",
            createdAt: new Date().toISOString(),
            messages: [{ id: "s1", text: question, sender: "student", timestamp: new Date().toISOString() }]
          };
          questions.push(newQuestion);
          localStorage.setItem("questions", JSON.stringify(questions));
          toast("Question sent to " + selectedTeacher.name, "success");
          setQuestion("");
          setSelectedQuestion(newQuestion);
          setSelectedTeacher(null);
        };

        const sendReply = () => {
          if (!replyMessage.trim()) {
            toast("Write a reply", "error");
            return;
          }
          const allQ = JSON.parse(localStorage.getItem("questions") || "[]");
          const updatedQuestions = allQ.map(q => {
            if (q.id === selectedQuestion.id) {
              const newMsg = { id: "s" + Date.now(), text: replyMessage, sender: "student", timestamp: new Date().toISOString() };
              const msgs = q.messages || [{ id: "s0", text: q.question, sender: "student", timestamp: q.createdAt }];
              return { ...q, messages: [...msgs, newMsg] };
            }
            return q;
          });
          localStorage.setItem("questions", JSON.stringify(updatedQuestions));
          
          const updatedSelected = { ...selectedQuestion, messages: [...(selectedQuestion.messages || [{ id: "s0", text: selectedQuestion.question, sender: "student", timestamp: selectedQuestion.createdAt }]), { id: "s" + Date.now(), text: replyMessage, sender: "student", timestamp: new Date().toISOString() }] };
          setSelectedQuestion(updatedSelected);
          setReplyMessage("");
          toast("Reply sent!", "success");
        };

        const confirmDelete = (qId, e) => {
          e?.stopPropagation();
          setDeleteDialog({ open: true, item: qId });
        };

        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-sm font-body text-emerald-700/70">Select a teacher and ask a question</span>
            </div>

            {!selectedQuestion ? (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <p className="font-display font-semibold text-emerald-800 mb-3">Your Teachers:</p>
                  {filteredTeachers.length === 0 ? (
                    <p className="text-emerald-600 font-body">No teachers registered yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {filteredTeachers.map((teacher, idx) => (
                        <button 
                          key={idx}
                          onClick={() => setSelectedTeacher(teacher)}
                          className={`p-4 rounded-xl border transition-all flex items-center gap-3 ${
                            selectedTeacher?.id === teacher.id
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : "bg-white border-emerald-200 hover:border-emerald-400"
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            selectedTeacher?.id === teacher.id ? "bg-white/20" : "bg-emerald-100"
                          }`}>
                            <GraduationCap className={`w-6 h-6 ${selectedTeacher?.id === teacher.id ? "text-white" : "text-emerald-600"}`} />
                          </div>
                          <div className="text-left">
                            <p className={`font-display font-semibold ${selectedTeacher?.id === teacher.id ? "text-white" : "text-emerald-900"}`}>{teacher.name}</p>
                            <p className={`text-sm ${selectedTeacher?.id === teacher.id ? "text-white/70" : "text-emerald-600"}`}>{teacher.phone}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {selectedTeacher && (
                  <div className="p-4 bg-white rounded-xl border border-emerald-200 shadow-lg">
                    <p className="font-display font-semibold text-emerald-800 mb-3">Ask a question to {selectedTeacher.name}:</p>
                    <textarea 
                      className="w-full p-4 rounded-xl border border-emerald-200 bg-gray-50 text-emerald-900 placeholder:text-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 font-body"
                      rows="3"
                      placeholder="Write your question here..."
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                    ></textarea>
                    <div className="flex gap-3 mt-3">
                      <Button onClick={() => setSelectedTeacher(null)} className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200">
                        Cancel
                      </Button>
                      <Button onClick={sendQuestion} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold">
                        Send Question
                      </Button>
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <p className="font-display font-semibold text-emerald-800 mb-3">Your Questions:</p>
                  <div className="space-y-3">
                    {myQuestions.map((q) => (
                      <div 
                        key={q.id}
                        onClick={() => setSelectedQuestion(q)}
                        className="p-4 bg-white rounded-xl border border-emerald-200 hover:border-emerald-400 hover:shadow-lg transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <GraduationCap className="w-6 h-6 text-emerald-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-display font-semibold text-sm text-gray-900 truncate">To: {q.teacherName || 'Teacher'}</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs ${
                                q.status === "answered" ? "bg-emerald-100 text-emerald-700" : "bg-yellow-100 text-yellow-700"
                              }`}>
                                {q.status === "answered" ? "Answered" : "Pending"}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 truncate">{q.question}</p>
                            {q.answer && (
<p className="text-xs text-emerald-500 mt-1 truncate">Answer: {q.answer}</p>
                            )}
                          </div>
                          <button 
onClick={(e) => confirmDelete(q.id, e)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {myQuestions.length === 0 && (
                      <p className="text-emerald-600 font-body text-center py-4">No questions asked yet.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-[70vh] bg-[#f5f5f5] rounded-2xl overflow-hidden shadow-lg border border-emerald-200">
                <div className="bg-emerald-600 p-3 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setSelectedQuestion(null)}
                      className="text-white"
                    >
                      <ChevronRight className="w-5 h-5 rotate-180" />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-white text-base">{activeQuestion.teacherName || 'Teacher'}</h4>
                      <p className="text-xs text-white/70">Conversation</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      const allQ = JSON.parse(localStorage.getItem("questions") || "[]");
                      const filtered = allQ.filter(q => q.id !== activeQuestion.id);
                      localStorage.setItem("questions", JSON.stringify(filtered));
                      setSelectedQuestion(null);
toast("Question deleted", "success");
                    }}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {(activeQuestion.messages || [{ id: "s0", text: activeQuestion.question, sender: "student", timestamp: activeQuestion.createdAt }]).map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === "student" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] p-3 rounded-2xl ${
                        msg.sender === "student" 
                          ? "bg-emerald-500 text-white rounded-br-md" 
                          : "bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100"
                      }`}>
                        <p className="text-sm font-body">{msg.text}</p>
                        <p className={`text-xs mt-1 ${msg.sender === "student" ? "text-white/70" : "text-gray-400"}`}>
                          {(msg.timestamp && msg.timestamp !== "now") ? new Date(msg.timestamp).toLocaleTimeString("sw-TZ", { hour: "2-digit", minute: "2-digit" }) : new Date().toLocaleTimeString("sw-TZ", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-3 bg-white border-t border-emerald-100">
                  <div className="flex gap-2">
                    <Input 
                      type="text"
                      placeholder="Write a message..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendReply()}
                      className="flex-1"
                    />
                    <Button onClick={sendReply} className="bg-emerald-600 hover:bg-emerald-700">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }

      case "results": {
        const allSubmissions = JSON.parse(localStorage.getItem("submissions") || "[]");
        const myResults = allSubmissions.filter(s => s.studentId === student.rgNumber);
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-sm font-body text-emerald-700/70">Awamu {student.awamu}</span>
            </div>
            <div className="space-y-4">
              {myResults.map((result, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
                  <div>
                    <p className="font-display font-semibold text-emerald-900">
                      {result.activityId}
                    </p>
                    <p className="text-sm text-emerald-600">
                      {new Date(result.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-xl ${
                    result.score !== null 
                      ? result.score >= 70 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {result.score !== null ? `${result.score}%` : "Pending"}
                  </div>
                </div>
              ))}
              {myResults.length === 0 && (
                <div className="p-8 rounded-2xl bg-gray-50 text-center text-gray-500">
                  No results yet
                </div>
              )}
            </div>
          </div>
        );
      }

      case "about": {
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-emerald-50 rounded-3xl p-8 border border-emerald-200 shadow-xl">
              <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-200/30 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-200/30 rounded-full translate-y-1/3 -translate-x-1/3 blur-2xl"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative w-32 h-32 mb-8">
                <div className="absolute inset-0 bg-emerald-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-2 bg-emerald-400 rounded-full"></div>
                <div className="absolute inset-4 bg-emerald-300 rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-emerald-700 shadow-lg">
                    <img src={Logo} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-amber-400 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
              </div>
                
                <h2 className="text-3xl md:text-4xl font-display font-bold text-emerald-900 tracking-wide">MUONGOZO WA DARSA ZA AHKAAM AT-TAJWĪD</h2>
                
                <div className="mt-6 flex items-center gap-4">
                  <span className="px-4 py-2 bg-emerald-600 text-white font-display font-semibold rounded-full">AWAMU YA 5</span>
                  <span className="text-emerald-700 font-body">|</span>
                  <span className="text-emerald-700 font-display font-semibold">2026</span>
                </div>
              </div>
            </div>

            <div className="space-y-6 bg-white rounded-2xl border border-emerald-200 p-8 shadow-lg">
              <div className="text-center">
                <p className="text-2xl font-display font-bold text-emerald-900 mb-2">Barnaamaj Ta'leem Al-Qur'an Al-Kareem wa Tajweedihi</p>
                <p className="text-emerald-700 font-body text-lg">برنامح تعليم القرآن الكريم وتجويده</p>
              </div>

              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                <p className="text-emerald-800 font-body text-center text-lg leading-relaxed">
                  <span className="font-semibold">"وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا"</span>
                </p>
                <p className="text-emerald-600 font-body text-center text-sm mt-2">(Na soma Qur'an kwa tartiil - Sūrat al-Muzzammil: 4)</p>
              </div>

              <div className="space-y-4 text-emerald-800 font-body">
                <p className="text-lg leading-relaxed">
                  <span className="font-display font-semibold text-emerald-900">Barnaamaj Ta'leem Al-Qur'an Al-Kareem wa Tajweedihi</span> ni Program ya Masomo ya Tajwīd Online inayohusisha kusoma Tajwiid katika ngazi 4 (marāḥil):
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
                  <div className="bg-emerald-100 rounded-xl p-4 text-center">
                    <p className="font-display font-bold text-emerald-800">Marḥala ya Kwanza</p>
                  </div>
                  <div className="bg-emerald-100 rounded-xl p-4 text-center">
                    <p className="font-display font-bold text-emerald-800">Marḥala ya Pili</p>
                  </div>
                  <div className="bg-emerald-100 rounded-xl p-4 text-center">
                    <p className="font-display font-bold text-emerald-800">Marḥala ya Tatu</p>
                  </div>
                  <div className="bg-emerald-100 rounded-xl p-4 text-center">
                    <p className="font-display font-bold text-emerald-800">Marḥala ya Nne</p>
                  </div>
                </div>

                <p className="leading-relaxed">
                  Kila marḥala itachukua miezi mitatu tu, ambapo darsa zitatumwa siku ya Jumamosi pekee katika wiki, ila inaweza kutokea dharura ya kufanya Darsa iwahishwe ama icheleweshwe.
                </p>

                <p className="leading-relaxed">
                  Pia kutakuwa na ratiba za ziada kuanzia marhala ya pili. Ratiba hizo ni kama vile <span className="font-semibold">tadriib</span> (kusoma kwa mwalimu ukarekebishwa) na <span className="font-semibold">halaqah</span>. Ambapo tadriib pia itakuwa ina alama zake (hivyo itampasa mtu kuhudhuria tadriib).
                </p>

                <p className="leading-relaxed">
                  Utaratibu wa kusoma ni kwamba mwanafunzi atatumia wiki nzima kuisoma na kuifahamu darsa husika, na kuulizia kila alichokua hajakifahamu kwa admini yoyote.
                </p>

                <p className="leading-relaxed">
                  Aidha katika kila marhala kutakuwa na mazoezi mawili tu ambayo yatalenga kupima uelewa na ufahamu wa mwanafunzi. Pia kutakuwa na mtihani wa mwisho mwishoni mwa kila marhala.
                </p>
              </div>
            </div>
          </div>
        );
      }

      case "help": {
        const teachersForHelp = JSON.parse(localStorage.getItem("teachers") || "[]");
        const sameGenderTeachers = teachersForHelp.filter(t => t.gender === student.gender);
        const allQuestionsData = JSON.parse(localStorage.getItem("questions") || "[]");
        const myQuestions = allQuestionsData.filter(q => q.studentId === student.rgNumber).sort((a, b) => b.id - a.id);
        
        const activeQuestion = selectedQuestion 
          ? allQuestionsData.find(q => q.id === selectedQuestion.id) || selectedQuestion 
          : null;
        
        const sendQuestion = () => {
          if (!question.trim()) {
            toast("Andika swali", "error");
            return;
          }
          if (sameGenderTeachers.length === 0) {
            toast("No teachers of your gender yet", "warning");
            return;
          }
          const assignedTeacher = sameGenderTeachers[0];
          const questions = JSON.parse(localStorage.getItem("questions") || "[]");
          const newQuestion = {
            id: Date.now(),
            studentId: student.rgNumber,
            studentName: student.name,
            studentGender: student.gender,
            teacherId: assignedTeacher.phone,
            teacherName: assignedTeacher.name,
            question,
            answer: "",
            status: "pending",
            createdAt: new Date().toISOString(),
            messages: [{ id: "s1", text: question, sender: "student", timestamp: new Date().toISOString() }]
          };
          questions.push(newQuestion);
          localStorage.setItem("questions", JSON.stringify(questions));
          toast("Question sent to " + assignedTeacher.name + "!", "success");
          setQuestion("");
          setSelectedQuestion(newQuestion);
        };

        const sendReply = () => {
          if (!replyMessage.trim()) {
            toast("Andika jibu", "error");
            return;
          }
          const allQuestions = JSON.parse(localStorage.getItem("questions") || "[]");
          const updatedQuestions = allQuestions.map(q => {
            if (q.id === selectedQuestion.id) {
              const newMsg = { id: "s" + Date.now(), text: replyMessage, sender: "student", timestamp: new Date().toISOString() };
              const msgs = q.messages || [{ id: "s0", text: q.question, sender: "student", timestamp: q.createdAt }];
              return { ...q, messages: [...msgs, newMsg] };
            }
            return q;
          });
          localStorage.setItem("questions", JSON.stringify(updatedQuestions));
          
          const updatedSelected = { ...selectedQuestion, messages: [...(selectedQuestion.messages || [{ id: "s0", text: selectedQuestion.question, sender: "student", timestamp: selectedQuestion.createdAt }]), { id: "s" + Date.now(), text: replyMessage, sender: "student", timestamp: new Date().toISOString() }] };
          setSelectedQuestion(updatedSelected);
          setReplyMessage("");
          toast("Umejibu swali!", "success");
        };

        const confirmDeleteQuestion = (qId, e) => {
          e?.stopPropagation();
          setDeleteDialog({ open: true, item: qId });
        };

        return (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-sm font-body text-emerald-600">{myQuestions.length} conversations</span>
            </div>
            
            {sameGenderTeachers.length === 0 && (
              <div className="p-6 rounded-2xl bg-yellow-50 border border-yellow-200">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-8 h-8 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-800">No teachers</p>
                    <p className="text-sm text-yellow-700">No teachers of your gender yet. Please wait.</p>
                  </div>
                </div>
              </div>
            )}

            {!selectedQuestion ? (
              <div className="grid gap-4">
                {myQuestions.map((q) => (
                  <div 
                    key={q.id}
                    onClick={() => setSelectedQuestion(q)}
                    className="p-4 bg-white rounded-2xl border border-emerald-200 hover:border-emerald-400 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-display font-semibold text-sm text-gray-900 truncate">Question from {new Date(q.createdAt).toLocaleDateString()}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            q.status === "answered" ? "bg-emerald-100 text-emerald-700" : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {q.status === "answered" ? "Answered" : "Pending"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{q.question}</p>
                        {q.answer && (
                          <p className="text-xs text-emerald-500 mt-1 truncate">Jibu: {q.answer}</p>
                        )}
                      </div>
                      <button 
                        onClick={(e) => confirmDeleteQuestion(q.id, e)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
                
                {myQuestions.length === 0 && sameGenderTeachers.length > 0 && (
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <div className="text-center mb-4">
                      <MessageCircle className="w-12 h-12 mx-auto mb-2 text-emerald-400" />
                      <p className="text-lg font-display font-semibold text-emerald-800">Contact Teachers</p>
                      <p className="text-emerald-600 text-sm">Write your question</p>
                    </div>
                    <textarea 
                      className="w-full p-4 rounded-xl border border-emerald-200 bg-white text-emerald-900 placeholder:text-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 font-body"
                      rows="3"
                      placeholder="Write your question here..."
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                    ></textarea>
                    <Button onClick={sendQuestion} className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-display font-semibold py-3">
                      Send Question
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col h-[70vh] bg-[#f5f5f5] rounded-2xl overflow-hidden shadow-lg border border-emerald-200">
                <div className="bg-emerald-600 p-3 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setSelectedQuestion(null)}
                      className="text-white"
                    >
                      <ChevronRight className="w-5 h-5 rotate-180" />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-white text-base">Teacher</h4>
                      <p className="text-xs text-white/70">Your question</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      const allQuestions = JSON.parse(localStorage.getItem("questions") || "[]");
                      const filtered = allQuestions.filter(q => q.id !== activeQuestion.id);
                      localStorage.setItem("questions", JSON.stringify(filtered));
                      setSelectedQuestion(null);
                      toast("Question deleted", "success");
                    }}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {(activeQuestion.messages || [{ id: "s0", text: activeQuestion.question, sender: "student", timestamp: activeQuestion.createdAt }]).map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === "student" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] p-3 rounded-2xl ${
                        msg.sender === "student" 
                          ? "bg-emerald-500 text-white rounded-br-md" 
                          : "bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100"
                      }`}>
                        <p className="text-sm font-body">{msg.text}</p>
                        <p className={`text-xs mt-1 ${msg.sender === "student" ? "text-white/70" : "text-gray-400"}`}>
                          {(msg.timestamp && msg.timestamp !== "now") ? new Date(msg.timestamp).toLocaleTimeString("sw-TZ", { hour: "2-digit", minute: "2-digit" }) : new Date().toLocaleTimeString("sw-TZ", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-3 bg-white border-t border-emerald-100">
                  <div className="flex gap-2">
                    <Input 
                      type="text"
                      placeholder="Write a reply..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendReply()}
                      className="flex-1"
                    />
                    <Button onClick={sendReply} className="bg-emerald-600 hover:bg-emerald-700">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 relative">
      <div className="absolute inset-0 opacity-[0.02]" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%231e5128\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/svg%3E")' }}>
      </div>

      <div className="md:hidden fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-sm border-b border-emerald-100 z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={Logo} alt="Logo" className="w-8 h-8 rounded-full" />
          <span className="font-display font-bold text-emerald-800">Tajweed</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg hover:bg-emerald-50 transition-colors">
          {mobileMenuOpen ? <X className="w-6 h-6 text-emerald-800" /> : <Menu className="w-6 h-6 text-emerald-800" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-40 pt-16 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center gap-3 p-4 mb-4 bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-xl border border-emerald-100">
              <img src={Logo} alt="Logo" className="w-12 h-12 rounded-full" />
              <div>
                <p className="text-xs text-emerald-600 uppercase tracking-wider">Welcome</p>
                <p className="text-emerald-900 font-display font-semibold">{student.name}</p>
              </div>
            </div>
            <nav className="space-y-2">
              {navItems.map((item) => (
                <SidebarItem key={item.section} icon={item.icon} label={item.label} section={item.section} />
              ))}
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-body">Logout</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      <div className="hidden md:flex w-72 bg-white/80 backdrop-blur-sm border-r border-emerald-100/50 p-6 flex-col relative">
        <div className="flex items-center gap-3 p-4 mb-6 bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-xl border border-emerald-100">
          <img src={Logo} alt="Logo" className="w-12 h-12 rounded-full" />
          <div>
            <p className="text-xs text-emerald-600 uppercase tracking-wider">Welcome</p>
            <p className="text-emerald-900 font-display font-semibold truncate">{student.name}</p>
          </div>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <SidebarItem key={item.section} icon={item.icon} label={item.label} section={item.section} />
          ))}
        </nav>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-body">Logout</span>
        </button>
      </div>
      
      <div className="flex-1 p-4 md:p-8 mt-16 md:mt-0 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-emerald-900">
              {activeSection === "profile" && "Dashboard"}
              {activeSection === "lessons" && "Lessons"}
              {activeSection === "activities" && "Activities"}
              {activeSection === "results" && "Results"}
              {activeSection === "teachers" && "Ask Teacher"}
              {activeSection === "about" && "About"}
            </h1>
            <p className="text-emerald-700/70 font-body mt-1">Marhala {student.marhala} • Awamu {student.awamu}</p>
          </div>
          
          {renderContent()}
        </div>

        <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
          <DialogContent className="bg-white rounded-2xl shadow-2xl border border-emerald-100">
            <DialogHeader>
              <DialogTitle className="text-emerald-900 flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-500" />
                Delete Question
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Are you sure you want to delete this question? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button 
                onClick={() => setDeleteDialog({ open: false, item: null })} 
                className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </Button>
              <Button 
                onClick={deleteQuestionGlobal} 
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default StudentDashboard;