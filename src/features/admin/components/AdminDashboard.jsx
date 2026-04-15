import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { 
  Users, BookOpen, Settings, GraduationCap, 
  Plus, Trash2, Edit, Unlock, Lock,
  LogOut, Menu, X, CheckCircle, Search,
  UserPlus, ClipboardList, BarChart3, Eye, Save, XCircle, AlertTriangle
} from "lucide-react";
import Logo from "@/assets/images/logo.jpeg";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/toast";
import { generateRgNumber, hashPassword } from "../../auth/utils/authUtils";

const ActivityCreator = () => {
  const activities = JSON.parse(localStorage.getItem("activities") || "[]");
  const submissions = JSON.parse(localStorage.getItem("submissions") || "[]");
  const toast = useToast();
  const [showCreate, setShowCreate] = useState(false);
  const [showView, setShowView] = useState(null);
  const [newActivity, setNewActivity] = useState({
    marhala: "1", type: "quiz", title: "", description: "",
    deadline: "", duration: 30, passingScore: 70,
    questions: []
  });
  const [newQuestion, setNewQuestion] = useState({
    type: "multiple_choice", question: "", options: ["", "", "", ""],
    correct: "A", trueFalse: "true", textAnswer: ""
  });

  const addQuestion = () => {
    if (!newQuestion.question) {
      alert("Andika swali");
      return;
    }
    const q = { ...newQuestion, id: newActivity.questions.length + 1 };
    if (q.type === "multiple_choice" && q.options.some(o => !o)) {
      alert("jaza optiones zote");
      return;
    }
    setNewActivity({ ...newActivity, questions: [...newActivity.questions, q] });
    setNewQuestion({
      type: "multiple_choice", question: "", options: ["", "", "", ""],
      correct: "A", trueFalse: "true", textAnswer: ""
    });
  };

  const removeQuestion = (idx) => {
    const q = [...newActivity.questions];
    q.splice(idx, 1);
    setNewActivity({ ...newActivity, questions: q });
  };

  const saveActivity = () => {
    if (!newActivity.title || newActivity.questions.length === 0) {
      alert("Ongeza sharti la swali moja");
      return;
    }
    const activity = {
      ...newActivity,
      id: `m${newActivity.marhala}-${newActivity.type}-${Date.now()}`,
      marhala: parseInt(newActivity.marhala),
      createdAt: new Date().toISOString()
    };
    localStorage.setItem("activities", JSON.stringify([...activities, activity]));
    setShowCreate(false);
    setNewActivity({
      marhala: "1", type: "quiz", title: "", description: "",
      deadline: "", duration: 30, passingScore: 70, questions: []
    });
    toast("Activity added successfully!", "success");
  };

  const deleteActivity = (id, title = "") => {
    setDeleteDialog({ 
      open: true, 
      type: "activity", 
      item: { id, name: title } 
    });
  };

  const handleDeleteActivity = (id) => {
    const activities = JSON.parse(localStorage.getItem("activities") || "[]");
    const activity = activities.find(a => a.id === id);
    deleteActivity(id, activity?.title || "");
  };

  const gradeSubmission = (subIdx, score) => {
    const updated = [...submissions];
    updated[subIdx].score = score;
    updated[subIdx].status = "graded";
    localStorage.setItem("submissions", JSON.stringify(updated));
    toast("Alipata " + score + "%", "success");
  };

  const viewSubmissions = (activityId) => {
    setShowView(activityId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h3 className="text-2xl font-display font-bold text-emerald-900">Learning Activities</h3>
        <Button onClick={() => setShowCreate(!showCreate)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Activity
        </Button>
      </div>

      {showCreate && (
        <Card className="bg-emerald-50 border-emerald-200">
          <CardHeader>
            <CardTitle className="text-emerald-900">New Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <select 
                className="p-2 border border-emerald-200 rounded-lg"
                value={newActivity.marhala}
                onChange={(e) => setNewActivity({...newActivity, marhala: e.target.value})}
              >
                <option value="1">Marhala 1</option>
                <option value="2">Marhala 2</option>
                <option value="3">Marhala 3</option>
                <option value="4">Marhala 4</option>
              </select>
              <select 
                className="p-2 border border-emerald-200 rounded-lg"
                value={newActivity.type}
                onChange={(e) => setNewActivity({...newActivity, type: e.target.value})}
              >
                <option value="quiz">Quiz</option>
                <option value="exam">Exam</option>
              </select>
              <Input 
                type="number" 
                placeholder="Duration (minutes)"
                value={newActivity.duration}
                onChange={(e) => setNewActivity({...newActivity, duration: parseInt(e.target.value)})}
              />
              <Input 
                type="number" 
                placeholder="Alikuwa kupita (%)"
                value={newActivity.passingScore}
                onChange={(e) => setNewActivity({...newActivity, passingScore: parseInt(e.target.value)})}
              />
            </div>
            <Input 
              placeholder="Kichwa cha shughuli"
              value={newActivity.title}
              onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
            />
            <Input 
              placeholder="Maelezo (si lazima)"
              value={newActivity.description}
              onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
            />
            <Input 
              type="datetime-local"
              value={newActivity.deadline}
              onChange={(e) => setNewActivity({...newActivity, deadline: e.target.value})}
            />

            <div className="border-t border-emerald-200 pt-4">
              <h4 className="font-display font-semibold text-emerald-900 mb-4">Questions ({newActivity.questions.length})</h4>
              {newActivity.questions.map((q, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg mb-2">
                  <span className="text-emerald-800">{idx + 1}. {q.question.slice(0, 50)}...</span>
                  <button onClick={() => removeQuestion(idx)} className="text-red-500">
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <select 
                  className="p-2 border border-emerald-200 rounded-lg mb-2"
                  value={newQuestion.type}
                  onChange={(e) => setNewQuestion({...newQuestion, type: e.target.value, question: "", options: ["", "", "", ""]})}
                >
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="true_false">True/False</option>
                  <option value="text">Maandishi</option>
                </select>
                <Input 
                  placeholder="Swali"
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                  className="mb-2"
                />
                
                {newQuestion.type === "multiple_choice" && (
                  <div className="grid grid-cols-2 gap-2">
                    {newQuestion.options.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correct"
                          checked={newQuestion.correct === String.fromCharCode(65 + idx)}
                          onChange={() => setNewQuestion({...newQuestion, correct: String.fromCharCode(65 + idx)})}
                        />
                        <Input 
                          placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                          value={opt}
                          onChange={(e) => {
                            const opts = [...newQuestion.options];
                            opts[idx] = e.target.value;
                            setNewQuestion({...newQuestion, options: opts});
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                {newQuestion.type === "true_false" && (
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="tf"
                        checked={newQuestion.trueFalse === "true"}
                        onChange={() => setNewQuestion({...newQuestion, trueFalse: "true"})}
                      />
                      <span>Kweli</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="tf"
                        checked={newQuestion.trueFalse === "false"}
                        onChange={() => setNewQuestion({...newQuestion, trueFalse: "false"})}
                      />
                      <span>Uongo</span>
                    </label>
                  </div>
                )}

                {newQuestion.type === "text" && (
                  <Input 
                    placeholder="Jibu sahihi (kwa mkaguzi)"
                    value={newQuestion.textAnswer}
                    onChange={(e) => setNewQuestion({...newQuestion, textAnswer: e.target.value})}
                  />
                )}
                
                <Button onClick={addQuestion} className="mt-2 bg-blue-600 hover:bg-blue-700">
                  Ongeza Swali
                </Button>
              </div>
            </div>

            <Button onClick={saveActivity} className="bg-emerald-600 hover:bg-emerald-700">
              <Save className="w-4 h-4 mr-2" />
              Save Activity
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h4 className="font-display font-semibold text-emerald-900">Existing Activities</h4>
        {activities.map((activity, idx) => {
          const subs = submissions.filter(s => s.activityId === activity.id);
          return (
            <Card key={idx} className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display font-semibold text-emerald-900">{activity.title}</p>
                    <p className="text-sm text-emerald-600">
                      Marhala {activity.marhala} • {activity.type === "quiz" ? "Quiz" : "Exam"} • 
                      Questions: {activity.questions?.length || 0}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {subs.length > 0 && (
                      <Button onClick={() => viewSubmissions(activity.id)} size="sm" className="bg-blue-600">
                        <Eye className="w-4 h-4 mr-1" />
                        Majibu ({subs.length})
                      </Button>
                    )}
                    <Button onClick={() => handleDeleteActivity(activity.id)} variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {activities.length === 0 && (
          <Card className="bg-gray-50">
            <CardContent className="p-8 text-center text-gray-500">
              Hakuna shughuli bado
            </CardContent>
          </Card>
        )}
      </div>

      {showView && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-900">Majibu ya Wahitimu</CardTitle>
          </CardHeader>
          <CardContent>
            {submissions.filter(s => s.activityId === showView).map((sub, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg mb-2">
                <p className="font-medium text-emerald-900">{sub.studentId}</p>
                <p className="text-sm text-emerald-600 mb-2">
                  Alijibu: {JSON.stringify(sub.answers)}
                </p>
                {sub.status === "graded" ? (
                  <p className="text-emerald-700 font-semibold">Alipata: {sub.score}%</p>
                ) : (
                  <div className="flex gap-2 mt-2">
                    <Button onClick={() => gradeSubmission(idx, 100)} size="sm" className="bg-emerald-600">100%</Button>
                    <Button onClick={() => gradeSubmission(idx, 70)} size="sm" className="bg-blue-600">70%</Button>
                    <Button onClick={() => gradeSubmission(idx, 50)} size="sm" className="bg-orange-600">50%</Button>
                    <Button onClick={() => gradeSubmission(idx, 0)} size="sm" variant="destructive">0%</Button>
                  </div>
                )}
              </div>
            ))}
            <Button onClick={() => setShowView(null)} className="mt-4" variant="outline">
              Funga
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [activeSection, setActiveSection] = useState("students");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [newStudent, setNewStudent] = useState({
    name: "", phoneNumber: "", gender: "", marhala: "2", password: ""
  });
  const [newTeacher, setNewTeacher] = useState({
    name: "", email: "", phone: "", gender: "", password: "", marhalat: []
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetUser, setResetUser] = useState(null);
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, type: "", item: null });

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const teachers = JSON.parse(localStorage.getItem("teachers") || "[]");
  const unlockedLessons = JSON.parse(localStorage.getItem("unlockedLessons") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast("Please fill in all fields", "error");
      return;
    }
    if (currentPassword !== "/") {
      toast("Current password is incorrect", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast("New passwords do not match", "error");
      return;
    }
    if (newPassword.length < 4) {
      toast("Nenosiri lazima iwe angalau herufi 4", "error");
      return;
    }
    const adminData = JSON.parse(localStorage.getItem("adminCredentials") || '{"username":"Admin","password":"/"}');
    adminData.password = newPassword;
    localStorage.setItem("adminCredentials", JSON.stringify(adminData));
    toast("Password changed successfully!", "success");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleResetUserPassword = async () => {
    if (!resetNewPassword || resetNewPassword.length < 4) {
      toast("Password must be at least 4 characters", "error");
      return;
    }
    const hashedPassword = await hashPassword(resetNewPassword);
    if (resetUser.role === "teacher") {
      const teachers = JSON.parse(localStorage.getItem("teachers") || "[]");
      const updated = teachers.map(t => t.email === resetUser.email ? {...t, password: hashedPassword} : t);
      localStorage.setItem("teachers", JSON.stringify(updated));
    } else {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const updated = users.map(u => u.rgNumber === resetUser.rgNumber ? {...u, password: hashedPassword} : u);
      localStorage.setItem("users", JSON.stringify(updated));
    }
    toast(`Password for ${resetUser.name} changed successfully`, "success");
    setShowResetModal(false);
    setResetUser(null);
    setResetNewPassword("");
  };

  const addStudent = async () => {
    if (!newStudent.name || !newStudent.phoneNumber || !newStudent.gender || !newStudent.password) {
      toast("Please fill in all fields", "error");
      return;
    }

    const hashedPassword = await hashPassword(newStudent.password);
    const rgNumber = generateRgNumber(parseInt(newStudent.marhala), newStudent.gender, 5);
    
    const student = {
      ...newStudent,
      password: hashedPassword,
      rgNumber,
      marhala: parseInt(newStudent.marhala),
      awamu: 5,
      role: "student",
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...users, student];
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setShowAddStudent(false);
    setNewStudent({ name: "", phoneNumber: "", gender: "", marhala: "2", password: "" });
    toast(`Student added successfully! ${rgNumber}`, "success");
  };

  const addTeacher = async () => {
    if (!newTeacher.name || !newTeacher.phone || !newTeacher.gender || !newTeacher.password) {
      toast("Please fill in all fields", "error");
      return;
    }

    const hashedPassword = await hashPassword(newTeacher.password);
    const teacher = {
      ...newTeacher,
      password: hashedPassword,
      marhalat: newTeacher.marhalat.length > 0 ? newTeacher.marhalat : [1,2,3,4],
      role: "teacher",
      username: newTeacher.phone,
      email: newTeacher.email || "",
      createdAt: new Date().toISOString()
    };

    const updatedTeachers = [...teachers, teacher];
    localStorage.setItem("teachers", JSON.stringify(updatedTeachers));
    setShowAddTeacher(false);
    setNewTeacher({ name: "", email: "", phone: "", gender: "", password: "", marhalat: [] });
    toast("Teacher added successfully!", "success");
  };

  const deleteUser = (rgNumber, name) => {
    setDeleteDialog({ 
      open: true, 
      type: "student", 
      item: { id: rgNumber, name } 
    });
  };

  const confirmDelete = () => {
    const { type, item } = deleteDialog;
    if (type === "student") {
      const updated = users.filter(u => u.rgNumber !== item.id);
      localStorage.setItem("users", JSON.stringify(updated));
      toast(`${item.name} has been deleted`, "success");
    } else if (type === "teacher") {
      const updated = teachers.filter(t => t.phone !== item.id);
      localStorage.setItem("teachers", JSON.stringify(updated));
      toast(`${item.name} has been deleted`, "success");
    } else if (type === "activity") {
      const activities = JSON.parse(localStorage.getItem("activities") || "[]");
      const updated = activities.filter(a => a.id !== item.id);
      localStorage.setItem("activities", JSON.stringify(updated));
      toast("Activity deleted", "success");
    }
    setDeleteDialog({ open: false, type: "", item: null });
    window.location.reload();
  };

  const deleteTeacher = (phone, name) => {
    setDeleteDialog({ 
      open: true, 
      type: "teacher", 
      item: { id: phone, name } 
    });
  };

  const deleteActivity = (id, title) => {
    setDeleteDialog({ 
      open: true, 
      type: "activity", 
      item: { id, name: title } 
    });
  };

  const toggleLesson = (marhala, lessonId) => {
    const current = JSON.parse(localStorage.getItem("unlockedLessons") || "{}");
    if (!current[marhala]) current[marhala] = [];
    
    if (current[marhala].includes(lessonId)) {
      current[marhala] = current[marhala].filter(id => id !== lessonId);
    } else {
      current[marhala].push(lessonId);
    }
    localStorage.setItem("unlockedLessons", JSON.stringify(current));
    window.location.reload();
  };

  const marhalaData = {
    1: ["Al-Isti'ādhah", "Al-Basmālah", "Tajwīd na yanayohusiana", "Al-Lahnu al-Jalī wa al-Khafī", "Idh-hār Al halqī", "Idghām + Iqlāb", "Ikhfā'", "Mīm Sākinah", "Idghām Mithlayn"],
    2: ["Makhaarij (1)", "Makhaarij (2)", "Makhaarij (3)", "Ṣifāt zenye ḍhwidd", "Ṣifāt zisizo na ḍhwidd", "Hukm al-Mad", "Al-Waqf wa al-Ibtidā'", "Bāb al-Maqāṭi'"],
    3: ["Ḥukm al-Mīm", "Aḥkām al-Mithlayn", "Al-Mutajānisayn", "Tafkhīm na Tarqīq", "Bāb al-Lāmāt", "Bāb al-Ḍhwād", "Aḥwāl ar-Rā'", "Bāb al-Lāmāt as-Sawākin"],
    4: ["Aḥkām al-Mudūd", "Al-Waqf wa al-Ibtidā'", "Bāb al-Maqāṭi'", "Bāb at-Tā'āt", "Hamzat al-Waṣl", "Al-Ishmām wa ar-Rawm", "Al-Adā'"]
  };

  const filteredStudents = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.rgNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navItems = [
    { icon: Users, label: "Students", section: "students" },
    { icon: GraduationCap, label: "Teachers", section: "teachers" },
    { icon: BookOpen, label: "Lessons", section: "lessons" },
    { icon: ClipboardList, label: "Activities", section: "activities" },
    { icon: Settings, label: "Settings", section: "settings" },
  ];

  const SidebarItem = ({ icon: Icon, label, section }) => (
    <button
      onClick={() => { setActiveSection(section); setMobileMenuOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
        activeSection === section 
          ? "bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800 border-l-4 border-emerald-600 shadow-sm" 
          : "text-emerald-900/70 hover:bg-emerald-50 hover:text-emerald-900"
      }`}
    >
      <Icon className={`w-5 h-5 ${activeSection === section ? 'text-emerald-600' : 'group-hover:scale-110'}`} />
      <span className="font-body font-medium">{label}</span>
    </button>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "students":
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h3 className="text-2xl font-display font-bold text-emerald-900">Students</h3>
              <Button onClick={() => setShowAddStudent(!showAddStudent)} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Student
              </Button>
            </div>

            {showAddStudent && (
              <Card className="bg-emerald-50 border-emerald-200">
                <CardContent className="p-6 space-y-4">
                  <h4 className="font-display font-semibold text-emerald-900">Add New Student (Marhala 2-4)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Name" value={newStudent.name} onChange={(e) => setNewStudent({...newStudent, name: e.target.value})} />
                    <Input placeholder="Phone Number" value={newStudent.phoneNumber} onChange={(e) => setNewStudent({...newStudent, phoneNumber: e.target.value})} />
                    <select className="p-2 border border-emerald-200 rounded-lg" value={newStudent.marhala} onChange={(e) => setNewStudent({...newStudent, marhala: e.target.value})}>
                      <option value="2">Marhala 2</option>
                      <option value="3">Marhala 3</option>
                      <option value="4">Marhala 4</option>
                    </select>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setNewStudent({...newStudent, gender: "A"})} className={`flex-1 p-2 rounded border ${newStudent.gender === "A" ? "bg-emerald-200 border-emerald-500" : "border-gray-200"}`}>Male</button>
                      <button type="button" onClick={() => setNewStudent({...newStudent, gender: "B"})} className={`flex-1 p-2 rounded border ${newStudent.gender === "B" ? "bg-emerald-200 border-emerald-500" : "border-gray-200"}`}>Female</button>
                    </div>
                    <Input type="password" placeholder="Password" value={newStudent.password} onChange={(e) => setNewStudent({...newStudent, password: e.target.value})} />
                  </div>
                  <Button onClick={addStudent} className="bg-emerald-600 hover:bg-emerald-700">Save</Button>
                </CardContent>
              </Card>
            )}

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
              <Input 
                className="pl-10" 
                placeholder="Search by name or number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-emerald-50 border-b border-emerald-200">
                  <tr>
                    <th className="text-left p-4 font-display text-sm text-emerald-800">Reg Number</th>
                    <th className="text-left p-4 font-display text-sm text-emerald-800">Name</th>
                    <th className="text-left p-4 font-display text-sm text-emerald-800">Marhala</th>
                    <th className="text-left p-4 font-display text-sm text-emerald-800">Gender</th>
                    <th className="text-left p-4 font-display text-sm text-emerald-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-emerald-50/50">
                      <td className="p-4 font-body text-emerald-900">{student.rgNumber}</td>
                      <td className="p-4 font-body text-emerald-900">{student.name}</td>
                      <td className="p-4 font-body text-emerald-900">Marhala {student.marhala}</td>
                      <td className="p-4 font-body text-emerald-900">{student.gender === "A" ? "M" : "F"}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => { setResetUser(student); setShowResetModal(true); }} className="text-blue-500 hover:text-blue-700" title="Reset Password">
                            <Unlock className="w-5 h-5" />
                          </button>
                          <button onClick={() => deleteUser(student.rgNumber, student.name)} className="text-red-500 hover:text-red-700" title="Delete">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">No students found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "teachers":
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h3 className="text-2xl font-display font-bold text-emerald-900">Teachers</h3>
              <Button onClick={() => setShowAddTeacher(!showAddTeacher)} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Teacher
              </Button>
            </div>

            {showAddTeacher && (
              <Card className="bg-emerald-50 border-emerald-200">
                <CardContent className="p-6 space-y-4">
                  <h4 className="font-display font-semibold text-emerald-900">Add New Teacher</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Name" value={newTeacher.name} onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})} />
                    <Input placeholder="Phone Number" value={newTeacher.phone} onChange={(e) => setNewTeacher({...newTeacher, phone: e.target.value})} />
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setNewTeacher({...newTeacher, gender: "A"})} className={`flex-1 p-2 rounded border ${newTeacher.gender === "A" ? "bg-emerald-200 border-emerald-500" : "border-gray-200"}`}>Male</button>
                      <button type="button" onClick={() => setNewTeacher({...newTeacher, gender: "B"})} className={`flex-1 p-2 rounded border ${newTeacher.gender === "B" ? "bg-emerald-200 border-emerald-500" : "border-gray-200"}`}>Female</button>
                    </div>
                    <Input type="password" placeholder="Password" value={newTeacher.password} onChange={(e) => setNewTeacher({...newTeacher, password: e.target.value})} />
                  </div>
                  <Button onClick={addTeacher} className="bg-emerald-600 hover:bg-emerald-700">Save</Button>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTeachers.map((teacher, idx) => (
                <Card key={idx} className="bg-white border border-gray-200 hover:border-emerald-300 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-emerald-900">{teacher.name}</h4>
                        <p className="text-sm text-emerald-600">{teacher.phone}</p>
                      </div>
                    </div>
                    <p className="text-sm text-emerald-700 mb-2">Marhala: {teacher.marhalat?.join(", ") || "1-4"}</p>
                    <p className="text-sm text-emerald-700 mb-4">Phone: {teacher.phone}</p>
                    <div className="flex gap-2">
                      <Button onClick={() => { setResetUser(teacher); setShowResetModal(true); }} variant="outline" size="sm" className="flex-1">
                        <Unlock className="w-4 h-4 mr-1" />
                        Reset
                      </Button>
                      <Button onClick={() => deleteTeacher(teacher.phone, teacher.name)} variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredTeachers.length === 0 && (
                <div className="col-span-full p-8 text-center text-gray-500">No teachers found</div>
              )}
            </div>
          </div>
        );

      case "lessons":
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-2xl font-display font-bold text-emerald-900">Lesson Management</h3>
            <p className="text-emerald-700">Unlock or lock lessons for each Marhala</p>
            
            {[1,2,3,4].map(m => (
              <Card key={m} className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-emerald-900">Marhala {m}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {marhalaData[m]?.map((lesson, idx) => {
                      const lessonId = `m${m}-l${idx + 1}`;
                      const isUnlocked = unlockedLessons[m]?.includes(lessonId);
                      return (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-emerald-900">{lesson}</span>
                          <button 
                            onClick={() => toggleLesson(m, lessonId)}
                            className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm ${
                              isUnlocked 
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" 
                                : "bg-red-100 text-red-700 hover:bg-red-200"
                            }`}
                          >
                            {isUnlocked ? <><Unlock className="w-4 h-4" /> Unlocked</> : <><Lock className="w-4 h-4" /> Locked</>}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case "activities":
        return <ActivityCreator />;

      case "settings":
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-2xl font-display font-bold text-emerald-900">Settings</h3>
            <Card className="bg-emerald-50 border-emerald-200">
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-emerald-800">Current Password</label>
                  <Input 
                    type="password" 
                    placeholder="Current password" 
                    className="mt-2"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-emerald-800">New Password</label>
                  <Input 
                    type="password" 
                    placeholder="New password" 
                    className="mt-2"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-emerald-800">Confirm Password</label>
                  <Input 
                    type="password" 
                    placeholder="Confirm password" 
                    className="mt-2"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handlePasswordChange}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Change Password
                </Button>
              </CardContent>
            </Card>
          </div>
        );

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
          <span className="font-display font-bold text-emerald-800">Tajweed Admin</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg hover:bg-emerald-50">
          {mobileMenuOpen ? <X className="w-6 h-6 text-emerald-800" /> : <Menu className="w-6 h-6 text-emerald-800" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-40 pt-16 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center gap-3 p-4 mb-4 bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-xl border border-emerald-100">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <Settings className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-emerald-600 uppercase">Admin</p>
                <p className="text-emerald-900 font-display font-semibold">Mratibu</p>
              </div>
            </div>
            <nav className="space-y-2">
              {navItems.map((item) => (
                <SidebarItem key={item.section} icon={item.icon} label={item.label} section={item.section} />
              ))}
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50">
                <LogOut className="w-5 h-5" />
                <span className="font-body">Logout</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      <div className="hidden md:flex w-72 bg-white/80 backdrop-blur-sm border-r border-emerald-100/50 p-6 flex-col">
        <div className="flex items-center gap-3 p-4 mb-6 bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-xl border border-emerald-100">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
            <Settings className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-emerald-600 uppercase">Admin</p>
            <p className="text-emerald-900 font-display font-semibold truncate">Mratibu</p>
          </div>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <SidebarItem key={item.section} icon={item.icon} label={item.label} section={item.section} />
          ))}
        </nav>
        
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50">
          <LogOut className="w-5 h-5" />
          <span className="font-body">Logout</span>
        </button>
      </div>
      
      <div className="flex-1 p-4 md:p-8 mt-16 md:mt-0 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-emerald-900">
              Dashboard ya Mratibu
            </h1>
            <p className="text-emerald-700/70 font-body mt-1">Simamia mfumo wote</p>
          </div>
          
          {renderContent()}
        </div>
      </div>

      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-display font-bold text-emerald-900">Badili Nenosiri</h3>
              <button onClick={() => { setShowResetModal(false); setResetUser(null); }} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-emerald-700 mb-4">Mtoa: <span className="font-semibold">{resetUser?.name}</span></p>
            <Input 
              type="password" 
              placeholder="Nenosiri mpya" 
              value={resetNewPassword}
              onChange={(e) => setResetNewPassword(e.target.value)}
              className="mb-4"
            />
            <div className="flex gap-2">
              <Button onClick={handleResetUserPassword} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                Hifadhi
              </Button>
              <Button onClick={() => { setShowResetModal(false); setResetUser(null); }} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this {deleteDialog.type}?
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">
              You are about to delete <span className="font-semibold text-gray-900">{deleteDialog.item?.name}</span>. 
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialog({ open: false, type: "", item: null })}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;