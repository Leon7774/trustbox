export type ProficiencyLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface Question {
  id: string;
  text: string;
  construct: string;
  options: { text: string; score: number }[];
}

const defaultOptions = [
  { text: "Never", score: 0 },
  { text: "Rarely", score: 25 },
  { text: "Sometimes", score: 50 },
  { text: "Often", score: 75 },
  { text: "Always", score: 100 },
];

const invertedOptions = [
  { text: "Never", score: 100 },
  { text: "Rarely", score: 75 },
  { text: "Sometimes", score: 50 },
  { text: "Often", score: 25 },
  { text: "Always", score: 0 },
];

// Helper to easily define questions without repeating the options array
function createQ(id: string, text: string, construct: string, inverted: boolean = false): Question {
  return {
    id,
    text,
    construct,
    options: inverted ? invertedOptions : defaultOptions,
  };
}

export const questionsByLevel: Record<ProficiencyLevel, Question[]> = {
  BEGINNER: [
    createQ("B1", "I set my social media accounts to \"Private\" so only friends can see my posts.", "Self-Efficacy"),
    createQ("B2", "I accept friend requests from people I do not recognize in real life.", "Perceived Susceptibility", true),
    createQ("B3", "I use my birthdate or part of my name in my account passwords.", "Perceived Severity", true),
    createQ("B4", "I click on links in messages that promise \"free gifts\" or \"prizes.\"", "Perceived Susceptibility", true),
    createQ("B5", "I review the \"App Permissions\" before installing a new game or social app.", "Response Efficacy"),
    createQ("B6", "I share photos of my boarding passes or ID cards on social media.", "Perceived Vulnerability", true),
    createQ("B7", "I use \"Login with Facebook/Google\" for every new website I join.", "Response Cost", true),
    createQ("B8", "I change my password immediately if I am notified of a login from a new device.", "Cues to Action"),
    createQ("B9", "I log out of my accounts when using a computer that isn't mine.", "Response Efficacy"),
    createQ("B10", "I share my \"One-Time Password\" (OTP) with callers claiming to be \"Support.\"", "Perceived Severity", true),
    createQ("B11", "I hide my email address and phone number from my public profile.", "Self-Efficacy"),
    createQ("B12", "I verify the identity of a \"Friend\" who suddenly asks for money via chat.", "Response Efficacy"),
    createQ("B13", "I use the \"Report/Block\" feature when I receive a suspicious link.", "Self-Efficacy"),
    createQ("B14", "I keep my \"Location Services\" off unless I am actively using a map.", "Perceived Vulnerability"),
    createQ("B15", "I ignore \"Clickbait\" headlines that require me to log in to read more.", "Perceived Susceptibility"),
    createQ("B16", "I use \"Public Wi-Fi\" without checking if the network name is official.", "Perceived Susceptibility", true),
    createQ("B17", "I delete emails that look like \"Urgent\" warnings from banks I don't have accounts with.", "Response Efficacy"),
    createQ("B18", "I post photos of my keys, ID cards, or school badges online.", "Perceived Vulnerability", true),
    createQ("B19", "I use \"Auto-fill\" for my home address and phone number on shopping sites.", "Response Cost", true),
    createQ("B20", "I click \"Allow\" on every pop-up that asks for my location on a website.", "Perceived Vulnerability", true),
    createQ("B21", "I check my \"Active Logins\" to see if someone else is using my account.", "Self-Efficacy"),
    createQ("B22", "I use the \"Secret Chat\" or \"Disappearing Messages\" feature for sensitive info.", "Self-Efficacy"),
    createQ("B23", "I avoid clicking on ads that promise \"Work from Home\" or \"Easy Money.\"", "Perceived Susceptibility"),
    createQ("B24", "I keep my software updated even if I don't see a \"new feature\" I like.", "Cues to Action"),
    createQ("B25", "I use a separate email address just for social media and spam.", "Response Efficacy"),
    createQ("B27", "I actively seek information to understand the cybersecurity threats facing my organization.", "Awareness"),
    createQ("B28", "I check if my personal information is being used for unauthorized or wrong purposes.", "Privacy Concern"),
    createQ("B29", "I verify that the digital systems I use are reliable before entering sensitive data.", "Trust"),
    createQ("B30", "I consider the lack of cybersecurity awareness to be a direct threat to my personal safety.", "Perceived Severity"),
    createQ("B31", "I limit the amount of personal information I share to prevent privacy violations.", "Privacy")
  ],
  INTERMEDIATE: [
    createQ("I1", "I use a unique, complex password for every one of my school/work accounts.", "Response Cost"),
    createQ("I2", "I use public Wi-Fi (cafes, libraries) for online banking or shopping.", "Perceived Severity", true),
    createQ("I3", "I update my computer’s Operating System as soon as an update is available.", "Cues to Action"),
    createQ("I4", "I leave my laptop or smartphone unlocked when I go to get a coffee or book.", "Perceived Vulnerability", true),
    createQ("I5", "I use a VPN (Virtual Private Network) when connecting to the campus Wi-Fi.", "Self-Efficacy"),
    createQ("I6", "I enable \"Two-Factor Authentication\" (2FA) on my primary email account.", "Self-Efficacy"),
    createQ("I7", "I back up my academic files to a secure cloud or external hard drive weekly.", "Response Efficacy"),
    createQ("I8", "I check the \"lock icon\" (HTTPS) in the browser before entering a password.", "Response Efficacy"),
    createQ("I9", "I download \"Cracked\" or pirated software from unofficial websites.", "Perceived Susceptibility", true),
    createQ("I10", "I use a physical webcam cover when I am not in a video call.", "Self-Efficacy"),
    createQ("I11", "I allow my browser to \"save\" my credit card info for easier checkout.", "Response Cost", true),
    createQ("I12", "I scan my USB drives for viruses before opening files on my laptop.", "Response Efficacy"),
    createQ("I13", "I set a complex PIN or Biometric lock on my mobile phone.", "Self-Efficacy"),
    createQ("I14", "I clear my \"Browsing History\" and \"Cookies\" after using a shared computer.", "Response Efficacy"),
    createQ("I15", "I disable \"Auto-Connect to Wi-Fi\" on my mobile devices.", "Perceived Vulnerability"),
    createQ("I16", "I disable \"File Sharing\" and \"AirDrop\" when I am in public places.", "Perceived Vulnerability"),
    createQ("I17", "I changed the default password (e.g., admin/admin) on my home Wi-Fi router.", "Self-Efficacy"),
    createQ("I18", "I avoid using \"USB Charging Stations\" in public unless I have a data blocker.", "Perceived Severity"),
    createQ("I19", "I verify the \"App Developer\" name in the App Store before downloading.", "Response Efficacy"),
    createQ("I20", "I use a \"Recovery Email\" or \"Phone Number\" that is different from my main one.", "Response Efficacy"),
    createQ("I21", "I clear my \"Saved Passwords\" from my browser regularly.", "Self-Efficacy"),
    createQ("I22", "I read the \"Privacy Policy\" or \"Terms of Service\" for apps that handle my money.", "Perceived Severity"),
    createQ("I23", "I use \"Biometric\" (Face/Fingerprint) instead of just a 4-digit PIN.", "Self-Efficacy"),
    createQ("I24", "I turn off my Wi-Fi and Bluetooth when I am not using them.", "Perceived Vulnerability"),
    createQ("I25", "I check my bank statements for small, unrecognized \"test\" transactions.", "Cues to Action"),
    createQ("I27", "I use my technical competencies to implement security measures, like complex passwords.", "Self-Efficacy"),
    createQ("I28", "It is easy to perform the necessary security steps required to protect my accounts.", "Self-Efficacy"),
    createQ("I29", "I treat the data I handle as a likely target for cyber attackers.", "Perceived Vulnerability"),
    createQ("I30", "I choose security software specifically because I believe it effectively protects my data.", "Response Efficacy"),
    createQ("I31", "I avoid using digital systems that appear too complex to secure properly.", "Complexity", true)
  ],
  ADVANCED: [
    createQ("A1", "I report suspicious emails to the IT/Security department immediately.", "Cues to Action"),
    createQ("A2", "I use my personal USB drive to transfer files to an organizational computer.", "Perceived Vulnerability", true),
    createQ("A3", "I lock my workstation (Win+L) every time I leave my desk.", "Response Efficacy"),
    createQ("A4", "I share my login credentials with a colleague to help them with a task.", "Perceived Severity", true),
    createQ("A5", "I categorize and label my files by sensitivity (e.g., Confidential).", "Self-Efficacy"),
    createQ("A6", "I bypass the organization's VPN to access sites more quickly.", "Response Cost", true),
    createQ("A7", "I participate in advanced security training sessions provided by my org.", "Self-Efficacy"),
    createQ("A8", "I use a \"Privacy Filter\" screen to prevent others from seeing my monitor.", "Self-Efficacy"),
    createQ("A9", "I verify the identity of any IT personnel requesting remote access to my PC.", "Response Efficacy"),
    createQ("A10", "I use my work email for personal registrations (shopping, gaming).", "Perceived Susceptibility", true),
    createQ("A11", "I shred physical documents that contain sensitive data or account info.", "Perceived Severity"),
    createQ("A12", "I use a dedicated \"Guest Network\" for IoT devices (printers, smart lights).", "Self-Efficacy"),
    createQ("A13", "I encrypt email attachments that contain personal or financial data.", "Self-Efficacy"),
    createQ("A14", "I ignore security alerts from my antivirus because they slow down my work.", "Response Cost", true),
    createQ("A15", "I proactively check my account \"Login Activity\" for unrecognized sessions.", "Response Efficacy"),
    createQ("A16", "I use \"Incognito\" or \"Private\" mode when testing organizational web tools.", "Self-Efficacy"),
    createQ("A17", "I avoid using the same password for my \"Email\" and my \"System Login.\"", "Perceived Severity"),
    createQ("A18", "I follow the \"Clear Desk\" policy by not leaving sensitive notes on my desk.", "Response Efficacy"),
    createQ("A19", "I use a \"Password-Protected\" screen saver that activates after 5 minutes.", "Self-Efficacy"),
    createQ("A20", "I verify \"System Update\" emails by checking the official company portal.", "Response Efficacy"),
    createQ("A21", "I use an \"Encrypted Folders\" feature to store highly sensitive documents.", "Self-Efficacy"),
    createQ("A22", "I use \"Multi-Factor\" (2FA) even when the system says it is \"Optional.\"", "Motivation to Protect"),
    createQ("A23", "I refrain from discussing confidential work/school projects in public areas.", "Perceived Vulnerability"),
    createQ("A25", "I strictly adhere to all cybersecurity procedures established by my organization.", "Cybersecurity Behavior"),
    createQ("A26", "I monitor my computer for unusual behavior, such as slowdowns, freezes, or unexpected pop-ups", "Cybersecurity Behavior"),
    createQ("A27", "I ensure that security updates are applied regularly to the systems I operate.", "Cybersecurity Behavior"),
    createQ("A28", "I follow security policies because I believe they significantly reduce breach likelihood.", "Response Efficacy"),
    createQ("A29", "I report potential system exploits that could be caused by technical complexity.", "Exploitability")
  ]
};
