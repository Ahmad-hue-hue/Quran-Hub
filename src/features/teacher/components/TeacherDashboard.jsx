import React, { useState, useRef, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers, faComments, faBookOpen, faUserCheck, faClock, faChevronRight,
  faBars, faXmark, faHome, faGraduationCap, faSearch, faFilter,
  faPaperPlane, faCircleCheck, faCircleExclamation, faRightFromBracket,
  faUser, faEnvelope, faPhone, faTrash, faBell
} from "@fortawesome/free-solid-svg-icons";
import Logo from "@/assets/images/logo.jpeg";
import { useNavigate } from "react-router-dom";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("roster");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef(null);
  const [selectedMarhala, setSelectedMarhala] = useState("all");
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  const teacher = JSON.parse(localStorage.getItem("currentUser")) || { name: "Teacher", gender: "A", marhalat: [1,2,3,4], specialization: "Tajweed" };
  const allStudents = JSON.parse(localStorage.getItem("users") || "[]");
  
  const [refreshKey, setRefreshKey] = useState(0);
  
  const allQuestions = useMemo(() => {
    return JSON.parse(localStorage.getItem("questions") || "[]");
  }, [refreshKey]);
  
  const students = allStudents.map((s, idx) => ({
    id: s.rgNumber || "s" + idx,
    name: s.name,
    rgNumber: s.rgNumber,
    phoneNumber: s.phoneNumber,
    gender: s.gender,
    marhala: s.marhala,
    awamu: s.awamu || 5,
    progress: 0
  }));
  
  const [conversationMessages, setConversationMessages] = useState({});
  
  const inquiriesList = allQuestions.map((q, idx) => ({
    id: q.id || "q" + idx,
    studentName: q.studentName,
    studentRg: q.studentId,
    studentGender: q.studentGender,
    question: q.question,
    timestamp: new Date(q.createdAt || Date.now()).toLocaleDateString(),
    status: q.status || "pending",
    marhala: 1,
    teacherId: q.teacherId
  }));
  
  const [inquiries, setInquiriesList] = useState(inquiriesList);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, inquiry: null });
  const [lastCount, setLastCount] = useState(0);
  const [newQuestions, setNewQuestions] = useState(false);
  
  const sendMessage = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    const text = typeof e === 'string' ? e : (e && e.target ? e.target.value : replyText);
    
    if (!text || !text.trim() || !selectedInquiry) return;
    
    const newMsg = {
      id: "m" + Date.now(),
      text: text.trim(),
      sender: "teacher",
      timestamp: new Date().toISOString()
    };
    
    let inquiryMsgs = conversationMessages[selectedInquiry.id] || [];
    
    if (inquiryMsgs.length === 0) {
      inquiryMsgs = [{
        id: "m0",
        text: selectedInquiry.question,
        sender: "student",
        timestamp: selectedInquiry.timestamp
      }];
    }
    
    setConversationMessages({
      ...conversationMessages,
      [selectedInquiry.id]: [...inquiryMsgs, newMsg]
    });
    
    const allQuestions = JSON.parse(localStorage.getItem("questions") || "[]");
    const updatedQuestions = allQuestions.map(q => {
      if (q.id === selectedInquiry.id) {
        const msgs = q.messages || [{ id: "s0", text: q.question, sender: "student", timestamp: q.createdAt }];
        return {
          ...q,
          status: "answered",
          answer: text.trim(),
          messages: [...msgs, newMsg]
        };
      }
      return q;
    });
    localStorage.setItem("questions", JSON.stringify(updatedQuestions));
    
    setInquiriesList(inquiriesList.map(inq => 
      inq.id === selectedInquiry.id ? { ...inq, status: "answered" } : inq
    ));
    
    setSelectedInquiry(prev => ({ ...prev, status: "answered" }));
    setReplyText("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const deleteMessage = (msgId) => {
    if (!selectedInquiry) return;
    
    const inquiryMsgs = conversationMessages[selectedInquiry.id] || [];
    setConversationMessages({
      ...conversationMessages,
      [selectedInquiry.id]: inquiryMsgs.filter(m => m.id !== msgId)
    });
  };

  const confirmDelete = (inquiry) => {
    setDeleteDialog({ open: true, inquiry });
  };

  const deleteInquiry = () => {
    const allQ = JSON.parse(localStorage.getItem("questions") || "[]");
    const filtered = allQ.filter(q => q.id !== deleteDialog.inquiry.id);
    localStorage.setItem("questions", JSON.stringify(filtered));
    if (selectedInquiry && selectedInquiry.id === deleteDialog.inquiry.id) {
      setSelectedInquiry(null);
    }
    setDeleteDialog({ open: false, inquiry: null });
  };

  const filteredStudents = students.filter(student => {
    const matchesGender = student.gender === teacher.gender;
    const matchesMarhala = selectedMarhala === "all" || student.marhala === parseInt(selectedMarhala);
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    student.rgNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGender && matchesMarhala && matchesSearch;
  });

  const filteredInquiries = inquiries.filter(q => {
    if (!teacher?.phone) return true;
    if (!q.teacherId) return q.studentGender === teacher.gender;
    return q.teacherId === teacher.phone;
  });

  const pendingInquiries = filteredInquiries.filter(i => i.status === "pending");
  const answeredInquiries = filteredInquiries.filter(i => i.status === "answered");
  const pendingCount = pendingInquiries.length;
  const answeredCount = answeredInquiries.length;

  useEffect(() => {
    if (pendingCount > lastCount) {
      setNewQuestions(true);
      setTimeout(() => setNewQuestions(false), 5000);
    }
    setLastCount(pendingCount);
  }, [pendingCount]);

  useEffect(() => {
    if (activeSection === "inquiries") {
      const freshQuestions = JSON.parse(localStorage.getItem("questions") || "[]");
      const freshInquiriesList = freshQuestions.map((q, idx) => ({
        id: q.id || "q" + idx,
        studentName: q.studentName,
        studentRg: q.studentId,
        studentGender: q.studentGender,
        question: q.question,
        timestamp: new Date(q.createdAt || Date.now()).toLocaleDateString(),
        status: q.status || "pending",
        marhala: 1,
        teacherId: q.teacherId
      }));
      setInquiriesList(freshInquiriesList);
    }
  }, [activeSection]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (activeSection === "inquiries") {
        const freshQuestions = JSON.parse(localStorage.getItem("questions") || "[]");
        const freshInquiriesList = freshQuestions.map((q, idx) => ({
          id: q.id || "q" + idx,
          studentName: q.studentName,
          studentRg: q.studentId,
          studentGender: q.studentGender,
          question: q.question,
          timestamp: new Date(q.createdAt || Date.now()).toLocaleDateString(),
          status: q.status || "pending",
          marhala: 1,
          teacherId: q.teacherId
        }));
        setInquiriesList(freshInquiriesList);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [activeSection]);

  const handleLogout = () => {
    navigate("/login");
  };

  const [navItems] = useState([
    { icon: faUserCheck, label: "Students", section: "roster" },
    { icon: faComments, label: "Inquiries", section: "inquiries", badge: pendingCount },
  ]);

  const SidebarItem = ({ icon, label, section, badge }) => (
    <button
      onClick={() => {
        setActiveSection(section);
        setMobileMenuOpen(false);
      }}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
        activeSection === section 
          ? "bg-primary/20 text-primary border-l-4 border-primary shadow-sm" 
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <div className="flex items-center gap-3">
        <FontAwesomeIcon icon={icon} className={`w-5 h-5 transition-transform duration-300 ${activeSection === section ? 'text-primary' : 'group-hover:scale-110'}`} />
        <span className="font-body font-medium">{label}</span>
      </div>
      {badge > 0 && (
        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{badge}</span>
      )}
    </button>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "roster":
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-3">
                <div className="relative">
                  <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 font-body text-sm"
                  />
                </div>
                <select
                  value={selectedMarhala}
                  onChange={(e) => setSelectedMarhala(e.target.value)}
                  className="px-4 py-2 rounded-xl border border-gray-200 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 font-body text-sm"
                >
                  <option value="all">All Marhalat</option>
                  <option value="1">Marhala 1</option>
                  <option value="2">Marhala 2</option>
                  <option value="3">Marhala 3</option>
                  <option value="4">Marhala 4</option>
                </select>
              </div>
            </div>
            
            <div className="grid gap-4">
              {filteredStudents.map((student, idx) => (
                <div 
                  key={student.id}
                  className="relative overflow-hidden p-5 rounded-2xl bg-white border border-gray-100 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-100 transition-all duration-500"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary to-primary"></div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-100 to-gray-100 flex items-center justify-center">
                        <FontAwesomeIcon icon={faUser} className="w-7 h-7 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-gray-900 text-lg">{student.name}</h4>
                        <p className="text-sm text-gray-700/70 font-body">{student.rgNumber}</p>
                      </div>
                    </div>
                      <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg">
                        <span className="text-xs text-primary font-body">Marhala</span>
                        <span className="font-display font-bold text-gray-700">{student.marhala}</span>
                      </div>
                      <Button onClick={() => setSelectedStudent(student)} className="px-4 bg-primary hover:bg-gray-800 text-white text-sm">
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredStudents.length === 0 && (
              <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200 text-center">
                <FontAwesomeIcon icon={faUsers} className="w-14 h-14 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-800 font-display font-semibold text-lg">No students found</p>
                <p className="text-gray-700/70 font-body mt-2">Wanafunzi wanaohitajika watakuwa hapa.</p>
              </div>
            )}
          </div>
        );
      
case "inquiries": {
        const counts = (
          <div className="mb-3 text-sm">
            <span className="text-gray-700">{pendingCount} maswali yaliyosubiri</span>
          </div>
        );
        
        const inbox = (
          <div className={`${selectedInquiry ? 'hidden' : ''} w-full bg-white rounded-2xl shadow-lg overflow-hidden`}>
            <div className="max-h-[60vh] md:max-h-[70vh] overflow-y-auto">
              {filteredInquiries.map((inquiry) => (
                <div 
                  key={inquiry.id}
                  onClick={() => { 
                    setSelectedInquiry(inquiry); 
                    setShowReplyForm(false); 
                    setReplyText("");
                    if (!conversationMessages[inquiry.id]) {
                      setConversationMessages({
                        ...conversationMessages,
                        [inquiry.id]: [{
                          id: "m0",
                          text: inquiry.question,
                          sender: "student",
                          timestamp: inquiry.timestamp
                        }]
                      });
                    }
if (inquiry.status === "pending") {
                      const allQ = JSON.parse(localStorage.getItem("questions") || "[]");
                      const updatedQ = allQ.map(q => 
                        q.id === inquiry.id ? { ...q, status: "answered" } : q
                      );
                      localStorage.setItem("questions", JSON.stringify(updatedQ));
                      setSelectedInquiry({ ...inquiry, status: "answered" });
                      const updatedList = filteredInquiries.map(inq => 
                        inq.id === inquiry.id ? { ...inq, status: "answered" } : inq
                      );
                      setInquiriesList(updatedList);
                    }
                  }}
                  className={`p-4 cursor-pointer transition-all border-b border-gray-100 ${
                    selectedInquiry?.id === inquiry.id 
                      ? "bg-gray-50" 
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon icon={faUser} className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-display font-semibold text-sm text-gray-900 truncate">{inquiry.studentName}</span>
                        <span className="text-xs text-gray-500">{inquiry.timestamp}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{inquiry.question}</p>
                    </div>
                    {inquiry.status === "pending" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
        const chat = selectedInquiry && (
          <div className="w-full flex flex-col h-[75vh] bg-[#e5ddd6] rounded-2xl overflow-hidden shadow-lg">
              <div className="bg-primary p-3 flex items-center gap-3 shadow-sm">
                <button 
                  onClick={() => { setSelectedInquiry(null); setShowReplyForm(false); setReplyText(""); }}
                  className="text-white"
                >
                  <FontAwesomeIcon icon={faChevronRight} rotation={180} className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-white text-base">{selectedInquiry.studentName}</h4>
                  <p className="text-xs text-white/70">{selectedInquiry.studentRg} • M{selectedInquiry.marhala}</p>
                </div>
              </div>
              
              <div 
                className="flex-1 p-4 overflow-y-auto bg-[#e5ddd5]"
                ref={(el) => {
                  if (el) el.scrollTop = el.scrollHeight;
                }}
              >
                {(conversationMessages[selectedInquiry.id] || []).length === 0 ? (
                  <div className="flex justify-start mb-4">
                    <div className="flex items-end gap-2 max-w-[80%]">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 self-end">
                        <FontAwesomeIcon icon={faUser} className="w-4 h-4 text-gray-700" />
                      </div>
                      <div className="bg-white px-4 py-2 rounded-2xl rounded-bl-sm rounded-tr-2xl shadow-md">
                        <p className="text-sm text-gray-900 leading-relaxed">{selectedInquiry.question}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  (conversationMessages[selectedInquiry.id] || []).map((msg) => (
                    msg.sender === "student" ? (
                      <div key={msg.id} className="flex justify-start mb-4">
                        <div className="flex items-end gap-2 max-w-[80%]">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 self-end">
                            <FontAwesomeIcon icon={faUser} className="w-4 h-4 text-gray-700" />
                          </div>
                          <div className="bg-white px-4 py-2 rounded-2xl rounded-bl-sm rounded-tr-2xl shadow-md">
                            <p className="text-sm text-gray-900 leading-relaxed">{msg.text}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div key={msg.id} className="flex justify-end mb-4 group relative">
                        <div className="flex items-end gap-2 max-w-[80%] flex-row-reverse">
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 self-end">
                            <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4 text-white" />
                          </div>
                          <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-br-sm rounded-tl-2xl shadow-md">
                            <p className="text-sm text-gray-900 leading-relaxed">{msg.text}</p>
                            <span className="text-xs text-primary/70 mt-1 block text-right">✓ {msg.timestamp}</span>
                            <button 
                              onClick={() => deleteMessage(msg.id)}
                              className="absolute -top-2 -left-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs hidden group-hover:block hover:bg-red-600"
                            >×</button>
                          </div>
                        </div>
                      </div>
                    )
                  ))
                )}
              </div>

              <div className="p-3 bg-gray-100 border-t border-gray-200 flex items-end gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    ref={inputRef}
                    className="message-input w-full px-4 py-2 rounded-full bg-white focus:bg-white border border-transparent focus:border-gray-300 focus:outline-none text-sm"
                    placeholder="Type a message..."
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && replyText.trim()) {
                          sendMessage(replyText);
                        }
                      }}
                  />
                </div>
                <Button 
                  onClick={() => sendMessage(replyText)}
                  disabled={!replyText.trim()}
                  className="bg-primary text-white hover:bg-primary p-3 rounded-full shadow-md"
                >
                  <FontAwesomeIcon icon={faPaperPlane} className="w-5 h-5" />
                </Button>
              </div>
            </div>
        );
        
        return (
          <div className="space-y-4 animate-fade-in">
            {counts}
            {selectedInquiry ? chat : inbox}
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative">
      <div className="absolute inset-0 opacity-[0.02]" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%231e5128\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/svg%3E")' }}>
      </div>

      <div className="md:hidden fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-xl shadow-lg shadow-white/20 border-b border-white/20 z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={Logo} alt="Logo" className="w-9 h-9 rounded-full ring-2 ring-primary/50" />
          <div>
            <span className="font-display font-bold text-gray-800 text-sm">Tajweed</span>
            <p className="text-[10px] text-gray-500 leading-tight">{teacher.name}</p>
          </div>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          {mobileMenuOpen ? <FontAwesomeIcon icon={faXmark} className="w-6 h-6 text-gray-800" /> : <FontAwesomeIcon icon={faBars} className="w-6 h-6 text-gray-800" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-gray-50/80 backdrop-blur-xl z-40 pt-16 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center gap-3 p-4 mb-4 bg-white/60 backdrop-blur-md rounded-xl border border-gray-200/50">
              <img src={Logo} alt="Logo" className="w-12 h-12 rounded-full ring-2 ring-primary/50" />
              <div>
                <p className="text-xs text-primary uppercase tracking-wider">Welcome</p>
                <p className="text-gray-800 font-display font-semibold">{teacher.name}</p>
              </div>
            </div>
            <nav className="space-y-2 bg-white/60 backdrop-blur-md rounded-2xl p-3 border border-gray-200/50">
              {navItems.map((item) => (
                <SidebarItem key={item.section} icon={item.icon} label={item.label} section={item.section} badge={item.badge} />
              ))}
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
              >
                <FontAwesomeIcon icon={faRightFromBracket} className="w-5 h-5" />
                <span className="font-body">Logout</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      <div className="hidden md:flex w-72 bg-white/80 backdrop-blur-sm border-r border-gray-100/50 p-6 flex-col relative">
        <div className="flex items-center gap-3 p-4 mb-6 bg-gray-50 rounded-xl border border-gray-100">
          <img src={Logo} alt="Logo" className="w-12 h-12 rounded-full" />
          <div>
            <p className="text-xs text-primary uppercase tracking-wider">Welcome</p>
            <p className="text-gray-900 font-display font-semibold truncate">{teacher.name}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <SidebarItem key={item.section} icon={item.icon} label={item.label} section={item.section} badge={item.badge} />
          ))}
        </nav>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
        >
          <FontAwesomeIcon icon={faRightFromBracket} className="w-5 h-5" />
          <span className="font-body">Logout</span>
        </button>
      </div>
      
      <div className="flex-1 p-4 md:p-8 mt-14 md:mt-0 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">
              {activeSection === "roster" && "Students"}
              {activeSection === "inquiries" && "Inquiries"}
              {activeSection === "lessons" && "Lessons"}
            </h1>
            <p className="text-gray-700/70 font-body mt-1">
              {teacher.specialization} • Gender: {teacher.gender === "A" ? "Male" : "Female"}
            </p>
          </div>
          
          {renderContent()}
        </div>
      </div>

      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="bg-primary p-6 text-white">
              <button 
                onClick={() => setSelectedStudent(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white"
              >
                <FontAwesomeIcon icon={faXmark} className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                  <FontAwesomeIcon icon={faGraduationCap} className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold">{selectedStudent.name}</h2>
                  <p className="text-white/80 text-sm">{selectedStudent.rgNumber}</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-primary uppercase">Marhala</p>
                  <p className="text-xl font-display font-bold text-gray-800">{selectedStudent.marhala}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-primary uppercase">Jinsia</p>
                  <p className="text-xl font-display font-bold text-gray-800">{selectedStudent.gender === "A" ? "M" : "Mke"}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 uppercase mb-1">Nambari ya Simu</p>
                <p className="text-gray-800 font-body">{selectedStudent.phoneNumber || "Haijawekwa"}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 uppercase mb-1">Alijiunga</p>
                <p className="text-gray-800 font-body">{selectedStudent.awamu ? `Awamu ${selectedStudent.awamu}` : "Awamu 5"}</p>
              </div>
              <Button 
                onClick={() => setSelectedStudent(null)}
                className="w-full bg-primary hover:bg-gray-800 text-white"
              >
                Funga
              </Button>
            </div>
          </div>
        </div>
      )}
        <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
          <DialogContent className="bg-white rounded-2xl shadow-2xl border border-gray-100">
            <DialogHeader>
              <DialogTitle className="text-gray-900 flex items-center gap-2">
                <FontAwesomeIcon icon={faTrash} className="w-5 h-5 text-red-500" />
                Delete Question
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Are you sure you want to delete this question? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button 
                onClick={() => setDeleteDialog({ open: false, inquiry: null })} 
                className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </Button>
              <Button 
                onClick={deleteInquiry} 
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  );
};

export default TeacherDashboard;