export type Question = {
  id: string;
  text: string;
};

export const beginnerQuestions: Question[] = [
  { id: "SUS1", text: "There is a good possibility that my personal information (login credentials, bank account details, etc.) gets stolen and misused due to an email phishing attack." },
  { id: "SUS3", text: "I will likely be a victim of an email phishing attack." },
  { id: "SUS5", text: "It is likely that my computer becomes infected by a virus because of an email phishing attack." },
  { id: "SEV1", text: "Losing my personal information due to an email phishing attack is a serious problem for me." },
  { id: "SEV2", text: "Having my computer infected by a virus because of an email phishing attack is a serious problem for me." },
  { id: "SEV4", text: "The thought of becoming a victim of an email phishing attack scares me." },
  { id: "SEV5", text: "Phishing attacks by email are harmful." },
  { id: "IMP1a", text: "Taking action to prevent email phishing attacks is important for me." },
  { id: "IMP2", text: "Educating myself about email phishing attacks is important for me." },
  { id: "CUE1", text: "If I saw a news report or awareness poster about phishing, I would be more conscious of potentially falling victim." }
];

export const intermediateQuestions: Question[] = [
  { id: "SUS2", text: "I feel that my chances of receiving an email phishing attack are high." },
  { id: "SUS4", text: "I worry a lot about becoming victimized in an email phishing attack." },
  { id: "SEV3", text: "If I become a victim of an email phishing attack, my daily work could be negatively affected." },
  { id: "IMP1b", text: "Exercising care when reading emails with links is important for me." },
  { id: "IMP4", text: "Staying alert for email phishing is important for me." },
  { id: "BAR1", text: "Exercising care when reading emails with links would require starting a new habit, which is difficult." },
  { id: "BAR2", text: "Educating myself about phishing takes too much time." },
  { id: "BAR5", text: "I am afraid I would not be able to detect phishing emails." },
  { id: "CUE2", text: "If I noticed a suspicious transaction on my bank account, I would be concerned about being a victim of phishing." },
  { id: "CUE3", text: "If I noticed suspicious log-in attempts on my social media account(s), I would be concerned about phishing." }
];

export const advancedQuestions: Question[] = [
  { id: "IMP3", text: "Using tools to prevent email phishing attacks is important for me." },
  { id: "BAR3", text: "I don't know how to find and get the right tools or software to prevent email phishing attacks." },
  { id: "BAR4", text: "I don't know what to look for to detect phishing emails." },
  { id: "SEF1", text: "I am confident of recognizing a phishing email." },
  { id: "SEF2", text: "I can recognize a phishing email even if there was no one around to help me." },
  { id: "SEF3", text: "I can recognize a malicious URL from a legitimate URL." },
  { id: "SEF4", text: "I am sure of the steps to follow to recognize a phishing email." },
  { id: "BEH2", text: "Before clicking on a link in an email, I will first check if the sender and subject of the email make sense." },
  { id: "BEH3", text: "Before clicking on a link in an email, I will first check if the URL is legitimate." },
  { id: "BEH5", text: "I report phishing emails to help people avoid becoming victims." }
];
