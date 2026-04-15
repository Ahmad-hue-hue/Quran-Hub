import { create } from 'zustand';
import { MARHALA_DATA } from '../data/marhalaData';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  
  login: (userData) => set({ 
    user: userData, 
    isAuthenticated: true 
  }),
  
  logout: () => set({ 
    user: null, 
    isAuthenticated: false 
  }),
  
  updateUser: (updates) => set((state) => ({ 
    user: { ...state.user, ...updates } 
  }))
}));

export const useStudentStore = create((set) => ({
  currentStudent: null,
  enrolledMarhala: null,
  lessons: [],
  activities: [],
  results: [],
  
  setStudent: (student) => set({ 
    currentStudent: student,
    enrolledMarhala: MARHALA_DATA[student.marhala]
  }),
  
  unlockLesson: (lessonId) => set((state) => ({
    lessons: state.lessons.map(lesson => 
      lesson.id === lessonId ? { ...lesson, isLocked: false } : lesson
    )
  })),
  
  completeLesson: (lessonId) => set((state) => ({
    lessons: state.lessons.map(lesson => 
      lesson.id === lessonId ? { ...lesson, isCompleted: true } : lesson
    )
  })),
  
  submitActivity: (activityId, answers) => set((state) => ({
    activities: state.activities.map(activity => 
      activity.id === activityId ? { ...activity, status: 'submitted', answers } : activity
    )
  })),
  
  setResults: (results) => set({ results })
}));
