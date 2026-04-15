export const MARHALA_DATA = {
  1: {
    name: "Marhala 1",
    subjects: [
      "Al-Isti'ādhah",
      "Al-Basmālah",
      "Tajwīd na yanayohusiana nayo",
      "Al-Lahnu al-Jalī wa al-Khafī",
      "Idh-hār Al halqī",
      "Idghām + Iqlāb",
      "Ikhfā'",
      "Mīm Sākinah (Idh-hār)",
      "Idghām Mithlayn + Ikhfā'"
    ],
    schedule: {
      awamu: 5,
      duration: "3 months",
      darsa: 9,
      zoezi: 2,
      mtihani: 1,
      halaqah: 0,
      tadreeb: 0
    }
  },
  2: {
    name: "Marhala 2",
    subjects: [
      "Makhaarij (1)",
      "Makhaarij (2)",
      "Makhaarij (3)",
      "Ṣifāt zenye ḍhwidd (Vinyume)",
      "Ṣifāt zisizo na ḍhwidd (Vinyume)"
    ],
    schedule: {
      awamu: 5,
      duration: "3 months",
      darsa: 8,
      zoezi: 2,
      mtihani: 1,
      halaqah: 3,
      tadreeb: 1
    }
  },
  3: {
    name: "Marhala 3",
    subjects: [
      "Ḥukm al-Mīm wa an-Nūn al-Mushaddadatayn (Ghunnah)",
      "Aḥkām al-Mithlayn",
      "Al-Mutajānisayn wa al-Mutaqāribayn",
      "Tafkhīm na Tarqīq (ḥurūf al-isti'lā' na al-istifāl)",
      "Bāb al-Lāmāt",
      "Bāb al-Ḍhwād wa al-Dhwā'",
      "Aḥwāl ar-Rā' (Darsa 7–8)",
      "Bāb al-Lāmāt as-Sawākin"
    ],
    schedule: {
      awamu: 5,
      duration: "3 months",
      darsa: 9,
      zoezi: 2,
      mtihani: 1,
      halaqah: 1,
      tadreeb: 1
    }
  },
  4: {
    name: "Marhala 4",
    subjects: [
      "Aḥkām al-Mudūd",
      "Al-Waqf wa al-Ibtidā'",
      "Bāb al-Maqāṭi' wa al-Mabādi'",
      "Bāb at-Tā'āt",
      "Hamzat al-Waṣl",
      "Al-Ishmām wa ar-Rawm",
      "Al-Adā'"
    ],
    schedule: {
      awamu: 5,
      duration: "3 months",
      darsa: 9,
      zoezi: 2,
      mtihani: 1,
      halaqah: 1,
      tadreeb: 1
    }
  }
};

export const LESSONS = {
  1: [
    { id: "m1-l1", title: "Al-Isti'ādhah", description: "Seeking refuge with Allah", isLocked: true },
    { id: "m1-l2", title: "Al-Basmālah", description: "In the name of Allah", isLocked: true },
    { id: "m1-l3", title: "Tajwīd Basics", description: "Fundamentals of Tajweed", isLocked: true },
    { id: "m1-l4", title: "Al-Lahnu al-Jalī wa al-Khafī", description: "Clear and hidden recitation", isLocked: true },
    { id: "m1-l5", title: "Idh-hār Al halqī", description: "Clear letter pronunciation", isLocked: true },
    { id: "m1-l6", title: "Idghām + Iqlāb", description: "Merging and conversion", isLocked: true },
    { id: "m1-l7", title: "Ikhfā'", description: "Hidden recitation", isLocked: true },
    { id: "m1-l8", title: "Mīm Sākinah", description: "Silent Meem rules", isLocked: true },
    { id: "m1-l9", title: "Idghām Mithlayn + Ikhfā'", description: "Advanced merging rules", isLocked: true }
  ],
  2: [
    { id: "m2-l1", title: "Makhaarij (1)", description: "Articulation points part 1", isLocked: true },
    { id: "m2-l2", title: "Makhaarij (2)", description: "Articulation points part 2", isLocked: true },
    { id: "m2-l3", title: "Makhaarij (3)", description: "Articulation points part 3", isLocked: true },
    { id: "m2-l4", title: "Ṣifāt zenye ḍhwidd", description: "Letters with brightness", isLocked: true },
    { id: "m2-l5", title: "Ṣifāt zisizo na ḍhwidd", description: "Letters without brightness", isLocked: true }
  ],
  3: [
    { id: "m3-l1", title: "Ghunnah", description: "Nasal sound rules", isLocked: true },
    { id: "m3-l2", title: "Aḥkām al-Mithlayn", description: "Similar letters rules", isLocked: true },
    { id: "m3-l3", title: "Al-Mutajānisayn", description: "Identical letters", isLocked: true },
    { id: "m3-l4", title: "Tafkhīm na Tarqīq", description: "Thick and thin letters", isLocked: true },
    { id: "m3-l5", title: "Bāb al-Lāmāt", description: "Lām rules", isLocked: true },
    { id: "m3-l6", title: "Bāb al-Ḍhwād wa al-Dhwā'", description: "Dhāw and Dāw rules", isLocked: true },
    { id: "m3-l7", title: "Aḥwāl ar-Rā'", description: "States of Rā", isLocked: true },
    { id: "m3-l8", title: "Bāb al-Lāmāt as-Sawākin", description: "Silent Lām rules", isLocked: true }
  ],
  4: [
    { id: "m4-l1", title: "Aḥkām al-Mudūd", description: "Prolonged letter rules", isLocked: true },
    { id: "m4-l2", title: "Al-Waqf wa al-Ibtidā'", description: "Stopping and starting", isLocked: true },
    { id: "m4-l3", title: "Bāb al-Maqāṭi'", description: "Cutting rules", isLocked: true },
    { id: "m4-l4", title: "Bāb at-Tā'āt", description: "Ta rules", isLocked: true },
    { id: "m4-l5", title: "Hamzat al-Waṣl", description: "Connecting Hamza", isLocked: true },
    { id: "m4-l6", title: "Al-Ishmām", description: "Inclination rules", isLocked: true },
    { id: "m4-l7", title: "Al-Adā'", description: "Delivery and articulation", isLocked: true }
  ]
};

export const ACTIVITIES = {
  1: [
    { id: "a1-q1", type: "quiz", title: "Zoezi 1", deadline: "2026-05-15", duration: 30, status: "pending" },
    { id: "a1-q2", type: "quiz", title: "Zoezi 2", deadline: "2026-06-15", duration: 30, status: "pending" },
    { id: "a1-e1", type: "exam", title: "Mtihani", deadline: "2026-07-01", duration: 60, status: "pending" }
  ],
  2: [
    { id: "a2-q1", type: "quiz", title: "Zoezi 1", deadline: "2026-05-15", duration: 30, status: "pending" },
    { id: "a2-q2", type: "quiz", title: "Zoezi 2", deadline: "2026-06-15", duration: 30, status: "pending" },
    { id: "a2-e1", type: "exam", title: "Mtihani", deadline: "2026-07-01", duration: 60, status: "pending" }
  ],
  3: [
    { id: "a3-q1", type: "quiz", title: "Zoezi 1", deadline: "2026-05-15", duration: 30, status: "pending" },
    { id: "a3-q2", type: "quiz", title: "Zoezi 2", deadline: "2026-06-15", duration: 30, status: "pending" },
    { id: "a3-e1", type: "exam", title: "Mtihani", deadline: "2026-07-01", duration: 60, status: "pending" }
  ],
  4: [
    { id: "a4-q1", type: "quiz", title: "Zoezi 1", deadline: "2026-05-15", duration: 30, status: "pending" },
    { id: "a4-q2", type: "quiz", title: "Zoezi 2", deadline: "2026-06-15", duration: 30, status: "pending" },
    { id: "a4-e1", type: "exam", title: "Mtihani", deadline: "2026-07-01", duration: 60, status: "pending" }
  ]
};
