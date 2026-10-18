const photo = (file, width, height, alt, caption, source, page) => ({
  src: `/images/infrastructure/${file}`, width, height, alt, caption, source, page,
});

export const campusLocations = [
  {
    id: 'kg-block', slug: 'kg-block', name: 'Chinmaya Balkrishna', subtitle: 'KG Block', category: 'Learning spaces',
    description: ["Chinmaya Balkrishna is a building in the shape of a tortoise, which is constructed to equip our Nursery School. This is unique in its style of construction, so as to invoke the imagination of young children and develop a love for nature. The building has 6 Class Rooms, Teachers' Room, Headmistress's Room, Central Assembly Hall, and Modern Neat Toilets. It is constructed in a well ventilated and environmental friendly manner. The building also boasts of an Air Conditioned Auditorium"],
    highlights: ['6 classrooms', "Teachers’ & Headmistress’s rooms", 'Central assembly hall', 'Modern neat toilets', 'Well ventilated construction', 'Air-conditioned auditorium'],
    aliases: ['KG', 'kindergarten', 'nursery', 'tortoise', 'balakrishna'],
    photos: [photo('chinmaya-balkrishna.jpg', 600, 402, 'Tortoise-shaped Chinmaya Balkrishna nursery building surrounded by greenery', 'The tortoise-shaped Chinmaya Balkrishna, KG Block.', 'balakrishna.pdf', 1)],
    sublocations: [], source: { file: 'balakrishna.pdf', pages: [1, 2] },
  },
  {
    id: 'main-block', slug: 'main-block', name: 'Main Block', subtitle: 'Classrooms & administration', category: 'Learning spaces',
    description: ['It consists of administrative block, auditorium ,middle school, secondary and senior secondary classes.'],
    highlights: [], aliases: ['administration', 'middle school', 'secondary', 'senior secondary', 'Tapovan Maharaj', 'auditorium', '500'],
    photos: [
      photo('main-block.jpg', 592, 397, 'Main Block classrooms overlooking the tree-lined school courtyard', 'The Main Block and its courtyard.', 'main block.pdf', 1),
      photo('tapovan-maharaj-auditorium.jpg', 594, 395, 'Students seated inside Tapovan Maharaj Auditorium', 'Tapovan Maharaj Auditorium, within Main Block.', 'main block.pdf', 2),
    ],
    sublocations: [{ id: 'tapovan-maharaj-auditorium', name: 'Tapovan Maharaj Auditorium', description: ['A fully equipped and neatly furnished auditorium which can accommodate around 500 students'], photoIndex: 1 }],
    source: { file: 'main block.pdf', pages: [1, 2] },
  },
  {
    id: 'saraswathy-temple', slug: 'saraswathy-temple', name: 'Saraswathy Temple', subtitle: 'Shrine', category: 'Culture & reflection',
    description: ['The Vidyalaya is blessed by a Saraswathy Temple in its campus. Students and teachers begin their day by invoking the blessings of Goddess Saraswathi.'],
    highlights: [], aliases: ['temple', 'shrine', 'Saraswathi', 'prayer'],
    photos: [photo('saraswathy-temple.jpg', 382, 570, 'Saraswathy Temple illuminated at night, with its red tiled roof and entrance in view', 'Saraswathy Temple, photographed at night.', 'temple.pdf', 2)],
    sublocations: [], source: { file: 'temple.pdf', pages: [2] },
  },
  {
    id: 'golden-jubilee-block', slug: 'golden-jubilee-block', name: 'Golden Jubilee Block', subtitle: 'Campus building', category: 'Learning spaces',
    description: [], highlights: [], aliases: ['jubilee', 'golden'],
    photos: [photo('golden-jubilee-block.jpg', 553, 370, 'Golden Jubilee Block overlooking the school ground', 'Golden Jubilee Block.', 'golden jjublee block.pdf', 1)],
    sublocations: [], source: { file: 'golden jjublee block.pdf', pages: [1] },
  },
  {
    id: 'chinmaya-balaniketan', slug: 'chinmaya-balaniketan', name: 'Chinmaya Balaniketan', subtitle: 'Hostel', category: 'Stay & support',
    description: ['Chinmaya Balaniketan is a residential home away from home. The hostel is situated in the Vidyalaya campus.', 'Accommodation is available for boys and girls.'],
    highlights: [], aliases: ['hostel', 'residential', 'boys', 'girls', 'Balanikethan'],
    photos: [photo('chinmaya-balaniketan.jpg', 800, 600, 'Chinmaya Balaniketan hostel building behind a garden and boundary railing', 'Chinmaya Balaniketan, the campus hostel.', 'CHINMAYA BALANIKETAN.pdf', 1)],
    sublocations: [], source: { file: 'CHINMAYA BALANIKETAN.pdf', pages: [1, 2] },
  },
  {
    id: 'parking-area', slug: 'parking-area', name: 'Cycle Shed & Car Parking Area', subtitle: 'Parking', category: 'Stay & support',
    description: [], highlights: [], aliases: ['cycle', 'shed', 'car', 'parking', 'bicycle'],
    photos: [
      photo('cycle-shed.webp', 800, 533, 'Two-wheelers parked beneath the covered cycle shed', 'The covered cycle shed.', 'shed.pdf', 1),
      photo('car-parking.webp', 800, 533, 'A car parked on the paved area beside the school buildings', 'The car parking area.', 'shed.pdf', 2),
    ],
    sublocations: [], source: { file: 'shed.pdf', pages: [1, 2] },
  },
  {
    id: 'chinmaya-vishram', slug: 'chinmaya-vishram', name: 'Chinmaya Vishram', subtitle: 'Guest house', category: 'Stay & support',
    description: ['A comfortable guest house keeps its doors open to welcome our special guests and parents.'],
    highlights: [], aliases: ['guest house', 'guests', 'parents', 'vishram'],
    photos: [photo('chinmaya-vishram.jpg', 549, 367, 'Chinmaya Vishram guest house with a tiled roof, lawn and palm trees', 'Chinmaya Vishram, the campus guest house.', 'vishram.pdf', 2)],
    sublocations: [], source: { file: 'vishram.pdf', pages: [2] },
  },
  {
    id: 'chinmaya-saket', slug: 'chinmaya-saket', name: 'Chinmaya Saket', subtitle: 'Residence & welfare', category: 'Stay & support',
    description: ['A quaint residential place for our local Acharya coupled with an Annakshetra and Student Welfare Counter.'],
    highlights: [], aliases: ['Acharya', 'residence', 'Annakshetra', 'student welfare counter', 'saket'],
    photos: [], sublocations: [],
    source: { file: 'Chinmaya Vidayalam Kolazhy - Thrissur _ www.chinmayavidyalaya.org _ CBSE Schhol Thrissur, Kerala.pdf', pages: [1] },
  },
  {
    id: 'chinmaya-darshan', slug: 'chinmaya-darshan', name: 'Chinmaya Darshan', subtitle: 'Photo exhibition', category: 'Culture & reflection',
    description: ['CHINMAYA DARSHANA permanent photo exhibition that portrays the inspiring life of Poojya Gurudev His Holiness Swami Chinmayanandaji, his vision and mission. This creative and aesthetic presentation takes one to a journey with the Great Master.'],
    highlights: [], aliases: ['exhibition', 'photo', 'Gurudev', 'Chinmayanandaji', 'vision', 'mission', 'darshan'],
    photos: [photo('chinmaya-darshan.jpg', 572, 397, 'Photo displays lining the walls of the Chinmaya Darshan exhibition hall', 'Inside Chinmaya Darshan, the permanent photo exhibition.', 'darshan.pdf', 1)],
    sublocations: [], source: { file: 'darshan.pdf', pages: [1, 2] },
  },
];

export function findCampusSpaces(query) {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return campusLocations.filter(place => {
    const text = [place.name, place.subtitle, place.category, ...place.description, ...place.aliases, ...place.highlights, ...place.sublocations.flatMap(item => [item.name, ...item.description])].join(' ').toLowerCase();
    return words.every(word => text.includes(word));
  });
}

export function locationFromHash(hash) {
  const slug = hash.replace(/^#/, '');
  return campusLocations.find(place => place.slug === slug || place.sublocations.some(item => item.id === slug));
}
