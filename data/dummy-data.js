import TaskSection from "../models/task-section";

export const TASK_SECTIONS = [
  new TaskSection("s1", "Savor", "#D500A9", "fast-food", [
    "Practice gratitude",
    "Reduce Stress and depressive symptoms",
    "improve your ability to be mindful",
  ]),
  new TaskSection("s2", "Thank", "#FE197B", "happy", [
    'Combat your innate "negative bias"',
    "Reduce stress & Boost happiness",
    "Feel more in control of your life",
  ]),
  new TaskSection("s3", "Aspire", "#BC6A0B", "flame", [
    "Boost optimism",
    "Prolong feeling of excitement",
    "Build motivation",
  ]),
  new TaskSection("s4", "Give", "#FC8802", "flower", [
    "Boost self-esteem",
    "Practice compassion for others",
    "Feel more connected to others",
  ]),
  new TaskSection("s5", "Empathize", "#FFb400", "heart-half", [
    "Build compassion",
    "Encourage open-mindedness",
    "Deepen your sense of community",
  ]),
  new TaskSection("s6", "Revive", "#A4BE00", "medkit", [
    "Feel more calm",
    "Get ready for a restful night/'s sleep",
    "Reduce feelings of anxiety and stress",
  ]),
];
