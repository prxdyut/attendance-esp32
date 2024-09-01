const subjects = [
  { value: "mathematics", name: "Mathematics" },
  { value: "english-language", name: "English Language" },
  { value: "literature", name: "Literature" },
  { value: "physics", name: "Physics" },
  { value: "chemistry", name: "Chemistry" },
  { value: "biology", name: "Biology" },
  { value: "earth-science", name: "Earth Science" },
  { value: "history", name: "History" },
  { value: "geography", name: "Geography" },
  { value: "civics", name: "Civics" },
  { value: "economics", name: "Economics" },
  { value: "psychology", name: "Psychology" },
  { value: "sociology", name: "Sociology" },
  { value: "foreign-language", name: "Foreign Language" },
  { value: "computer-science", name: "Computer Science" },
  { value: "information-technology", name: "Information Technology" },
  { value: "physical-education", name: "Physical Education" },
  { value: "health-education", name: "Health Education" },
  { value: "art", name: "Art" },
  { value: "music", name: "Music" },
  { value: "drama", name: "Drama" },
  { value: "dance", name: "Dance" },
  { value: "philosophy", name: "Philosophy" },
  { value: "religious-studies", name: "Religious Studies" },
  { value: "environmental-science", name: "Environmental Science" },
  { value: "astronomy", name: "Astronomy" },
  { value: "statistics", name: "Statistics" },
  { value: "calculus", name: "Calculus" },
  { value: "algebra", name: "Algebra" },
  { value: "geometry", name: "Geometry" },
  { value: "trigonometry", name: "Trigonometry" },
  { value: "home-economics", name: "Home Economics" },
  { value: "woodworking", name: "Woodworking" },
  { value: "metalworking", name: "Metalworking" },
  { value: "accounting", name: "Accounting" },
  { value: "business-studies", name: "Business Studies" },
  { value: "media-studies", name: "Media Studies" },
  { value: "political-science", name: "Political Science" },
  { value: "anthropology", name: "Anthropology" },
  { value: "forensic-science", name: "Forensic Science" },
  { value: "other", name: "Other" },
];

export const getAllSubjects = () => subjects;
export const getSubject = (name: string) =>
  subjects.find((subject) => subject.value == name)?.name || name;
