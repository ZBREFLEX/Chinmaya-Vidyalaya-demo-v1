const photo = (file, width, height, alt, caption, source, page, object) => ({
  src: `/images/facilities/${file}`, preview: `/images/facilities/${file.replace(/\.(jpg|webp)$/, '')}-400.webp`,
  width, height, alt, caption, sources: [{ file: source, page, object }],
});

export const facilityChapters = [
  { id: 'learning-discovery', name: 'Learning & Discovery', introduction: 'Books, experiments and classroom learning, with space for curiosity.' },
  { id: 'sports-play', name: 'Sports & Play', introduction: 'From the playground to the courts, discover the school’s spaces for play.' },
  { id: 'care-support', name: 'Care & Everyday Support', introduction: 'Places and services that support the everyday school experience.' },
];

const labs = [
  { id: 'physics-lab', name: 'Physics', sourceName: 'Physics Lab', aliases: ['physics', 'science lab'], photo: photo('physics-lab.jpg', 800, 533, 'Physics laboratory with workbenches and apparatus', 'Physics Lab.', 'LABORATORIES.pdf', 1, 11) },
  { id: 'chemistry-lab', name: 'Chemistry', sourceName: 'Chemistry Lab', aliases: ['chemistry'], photo: photo('chemistry-lab.jpg', 800, 533, 'Chemistry laboratory with benches and shelves for glassware', 'Chemistry Lab.', 'LABORATORIES.pdf', 2, 36) },
  { id: 'biology-lab', name: 'Biology', sourceName: 'Biology Lab', aliases: ['biology'], photo: photo('biology-lab.jpg', 800, 533, 'Biology laboratory with workbenches and specimens on display', 'Biology Lab.', 'LABORATORIES.pdf', 2, 37) },
  { id: 'mathematics-lab', name: 'Mathematics', sourceName: 'Maths Lab', aliases: ['maths', 'mathematics', 'math'], photo: photo('mathematics-lab.jpg', 800, 533, 'Mathematics laboratory with round tables and learning displays', 'Maths Lab.', 'LABORATORIES.pdf', 3, 44) },
  { id: 'computer-science-lab', name: 'Computer Science', sourceName: 'Computer Lab', aliases: ['computer', 'computers', 'computing'], photo: photo('computer-science-lab.jpg', 800, 533, 'Students seated at computers in the Computer Lab', 'Computer Lab.', 'LABORATORIES.pdf', 3, 45) },
  { id: 'artificial-intelligence-lab', name: 'Artificial Intelligence', sourceName: 'Artificial Intelligence Lab', aliases: ['AI', 'ai lab', 'artificial intelligence'], photo: photo('artificial-intelligence-lab.jpg', 800, 533, 'Computer workstations in the Artificial Intelligence Lab', 'Artificial Intelligence Lab.', 'LABORATORIES.pdf', 4, 53) },
];

const basketballAdditional = photo('basketball-additional-view.jpg', 585, 438, 'Additional view of the outdoor basketball court surrounded by trees', 'Basketball court, additional view.', 'PLAYGROUND.pdf', 2, 37);

export const facilities = [
  {
    id: 'library', slug: 'library', name: 'Saraswathy Mandir — Library', chapter: 'learning-discovery',
    description: ['Vidyalaya boasts of a well equipped library with approximately 15,000 books including Fiction, Non-Fiction and Reference Books catering to the needs of different age groups of students. Weeklies, Journals and Dailies keep the students and staff up-to-date with the events happening in and around.'],
    aliases: ['library', 'books', 'reading', 'Saraswathy Mandir', 'journals'],
    photos: [photo('library.jpg', 738, 425, 'Saraswathy Mandir library with bookshelves, reading tables and blue chairs', 'Inside Saraswathy Mandir, the school library.', 'LIBRARY.pdf', 1, 10)],
    source: { file: 'LIBRARY.pdf', pages: [1, 2] },
  },
  {
    id: 'laboratories', slug: 'laboratories', name: 'Laboratories', chapter: 'learning-discovery',
    description: ['Scientifically advanced laboratories for Physics, Chemistry, Biology, Computer Science and Mathematics.'],
    aliases: ['laboratories', 'labs', 'lab', 'experiments'], photos: [], labs,
    source: { file: 'LABORATORIES.pdf', pages: [1, 2, 3, 4] },
  },
  {
    id: 'audio-visual-room', slug: 'audio-visual-room', name: 'Audio Visual Room', chapter: 'learning-discovery',
    description: ['Audio Visual Room is well equipped with the latest audio visual aids like LCD projector, Over Head Projector, Slide Projector, TV, Computers etc'],
    aliases: ['audio visual', 'AV room', 'projector', 'TV'], photos: [],
    source: { file: 'Chinmaya Vidayalam Kolazhy - Thrissur _ www.chinmayavidyalaya.org _ CBSE Schhol Thrissur, Kerala.pdf', pages: [1] },
  },
  {
    id: 'digital-classrooms', slug: 'digital-classrooms', name: 'Digital Classrooms', chapter: 'learning-discovery',
    introduction: 'Technology-supported classroom learning.',
    description: ["Smart Class programme transforms our present day classrooms into technology enabled classrooms. It has revolutionized the way a teacher teaches in the classroom making the learning process both cognitive and constructive. It is an innovative technology that helps the students to benefit from animations and audio visual inputs based on the topics learnt. The digitalized classes offer a practical approach which focuses on the child's interest and helps them to be cognizant of the wide diversity of learning styles. This technology offers suitable aid for students from KG to Plus Two. We hope to provide our children the best solution to develop both in the cognitive and intellectual level."],
    aliases: ['smart class', 'digital', 'animations', 'classrooms'],
    photos: [photo('digital-classrooms.jpg', 514, 385, 'Teacher and students in a digital classroom, with a play symbol visible in the still photograph', 'Digital Classrooms — still photograph.', 'DIGITAL CLASSROOMS.pdf', 1, 10)],
    video: null, source: { file: 'DIGITAL CLASSROOMS.pdf', pages: [1, 2] },
  },
  {
    id: 'playground', slug: 'playground', name: 'Playground & Playpen', chapter: 'sports-play',
    description: ['The campus has three playgrounds - Football Court, Basketball Court, 800 mt. Track etc.'],
    aliases: ['playground', 'playpen', 'ground', 'football', 'track', 'sports'],
    photos: [
      photo('playground.jpg', 572, 320, 'Broad school ground bordered by trees and campus buildings', 'The school playground.', 'PLAYGROUND.pdf', 1, 12),
      photo('football-ground.jpg', 550, 384, 'Goalposts on a grass playing ground beside a tree-lined boundary', 'A goalpost view of the playing ground.', 'PLAYGROUND.pdf', 2, 36),
    ],
    relatedPhotoSources: [basketballAdditional], relatedFacilities: ['basketball-court'],
    source: { file: 'PLAYGROUND.pdf', pages: [1, 2] },
  },
  {
    id: 'basketball-court', slug: 'basketball-court', name: 'Basketball Court with Gallery', chapter: 'sports-play',
    description: [], aliases: ['basketball', 'court', 'gallery'],
    photos: [photo('basketball-court.jpg', 500, 450, 'Painted outdoor basketball court viewed from above with tiered seating beside it', 'Basketball Court with Gallery.', 'BASKETBALL COURT.pdf', 1, 9), basketballAdditional],
    source: { file: 'BASKETBALL COURT.pdf', pages: [1], related: ['PLAYGROUND.pdf'] },
  },
  {
    id: 'badminton-court', slug: 'badminton-court', name: 'Badminton Court', chapter: 'sports-play',
    description: [], aliases: ['badminton', 'indoor court'],
    photos: [
      photo('badminton-court.jpg', 500, 450, 'Students watching a badminton game inside the covered court', 'Badminton Court, first view.', 'BADMINTON COURT.pdf', 1, 10),
      photo('badminton-additional-view.jpg', 500, 450, 'A student holding a racket in the covered badminton court, with spectators behind', 'Badminton Court, second view.', 'BADMINTON COURT.pdf', 2, 34),
    ], source: { file: 'BADMINTON COURT.pdf', pages: [1, 2] },
  },
  {
    id: 'transport', slug: 'transport', name: 'Transport', chapter: 'care-support',
    description: ['Five school buses running on five different routes. Other than the regular school trips, conveyance facility is provided for students attending entrance coaching classes.'],
    aliases: ['bus', 'buses', 'transport', 'conveyance', 'school trips'],
    photos: [photo('transport.jpg', 800, 600, 'Yellow school buses parked along the tree-lined campus driveway', 'School buses on campus.', 'TRANSPORT FACILITY.pdf', 1, 10)],
    source: { file: 'TRANSPORT FACILITY.pdf', pages: [1, 2] },
  },
  {
    id: 'apan-mithra', slug: 'apan-mithra', name: 'Apan Mithra — First Aid', chapter: 'care-support',
    description: ['Apan Mithra is the accident management cell that takes charge during short intervals / lunch interval. The responsible members of this cell render help and first aid to the causalities. They are always on their toes.'],
    aliases: ['accident', 'first aid', 'Apan Mithra', 'help'], photos: [],
    source: { file: 'APAN MITHRA (FIRST AID).pdf', pages: [1] },
  },
  {
    id: 'sick-bay', slug: 'sick-bay', name: 'Sick Bay', chapter: 'care-support',
    description: ['We believe that "a healthy mind rests in a healthy body" and "Cleanliness is next to Godliness".', 'To provide a comfortable ambience when the body and mind is in a state of unrest; the Vidyalaya ensures the "Sick Bay" facility.'],
    aliases: ['sick bay', 'health', 'rest', 'unwell'],
    photos: [photo('sick-bay.webp', 800, 533, 'Beds and chairs inside the school Sick Bay', 'The Sick Bay room.', 'SICK BAY.pdf', 1, 10)],
    source: { file: 'SICK BAY.pdf', pages: [1, 2] },
  },
];

export const facilityById = Object.fromEntries(facilities.map(item => [item.id, item]));
export const laboratoryEntries = labs;
export const allFacilityPhotos = facilities.flatMap(item => [...item.photos, ...(item.labs || []).map(lab => lab.photo)]);

const words = value => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(/\s+/).filter(Boolean);
function matches(query, text) {
  const haystack = words(text);
  return words(query).every(word => haystack.some(token => word.length <= 2 ? token === word : token.startsWith(word)));
}

export function findFacilities(query = '') {
  const labResults = query.trim() ? labs.filter(lab => matches(query, `${lab.name} lab ${lab.aliases.join(' ')}`)).map(lab => ({ id: lab.id, name: `${lab.name} Lab`, chapter: 'learning-discovery', parentId: 'laboratories' })) : [];
  const results = facilities.filter(item => !query.trim() || matches(query, `${item.name} ${item.aliases.join(' ')} ${item.description.join(' ')}`))
    .filter(item => item.id !== 'laboratories' || !labResults.length)
    .map(item => ({ id: item.id, name: item.name, chapter: item.chapter }));
  return [...labResults, ...results];
}

export function facilityTarget(id) {
  const lab = labs.find(item => item.id === id);
  return lab ? { facility: facilityById.laboratories, lab } : facilityById[id] ? { facility: facilityById[id] } : undefined;
}
