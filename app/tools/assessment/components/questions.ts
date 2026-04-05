export const questions = [
  {
    id: "q1",
    text: "How often do you use the same password across multiple accounts?",
    options: [
      { text: "Always", score: 0 },
      { text: "Mostly", score: 25 },
      { text: "Rarely", score: 75 },
      { text: "Never", score: 100 },
    ],
    trait: "Behavioral",
  },
  {
    id: "q2",
    text: "Before clicking a link in an unexpected email, what do you usually do?",
    options: [
      { text: "Click immediately to see what it is", score: 0 },
      { text: "Check if the sender name looks familiar", score: 30 },
      { text: "Hover over the link to reveal the actual URL", score: 80 },
      { text: "Verify with the sender via a different channel", score: 100 },
    ],
    trait: "Behavioral",
  },
  {
    id: "q3",
    text: "If a highly sensitive account requires 2-Factor Authentication (2FA), how do you typically feel?",
    options: [
      { text: "I find it annoying and try to bypass it", score: 0 },
      { text: "I do it because I have to, but I dislike it", score: 40 },
      { text: "I appreciate the extra security layer", score: 90 },
      { text: "I proactively enable 2FA on all my accounts", score: 100 },
    ],
    trait: "Behavioral",
  },
];
