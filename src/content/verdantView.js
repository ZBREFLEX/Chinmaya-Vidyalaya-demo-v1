const image = (file, width, height, alt, caption, source, page, object) => ({
  src: `/images/verdant-view/${file}.jpg`,
  preview: `/images/verdant-view/${file}-360.webp`,
  width, height, alt, caption, source: { file: source, page, object },
});

export const gardens = [
  {
    id: 'vegetable-garden', title: 'Vegetable Garden',
    introduction: 'Growing, tending, learning.',
    description: 'The Vidyalaya hosts a vegetable garden where students grow farm fresh seasonal vegetables using organic manure and pesticides. The vegetables after harvesting are sold within the campus.',
    images: [
      image('vegetable-garden', 601, 444, 'Rows of vegetables growing in the campus garden, with trees and a boundary wall behind', 'Seasonal vegetable beds within the campus.', 'vegetable grarden.pdf', 2, 34),
      image('students-in-vegetable-garden', 537, 404, 'Students standing among vegetable beds beside a school building', 'Students in the Vegetable Garden.', 'vegetable grarden.pdf', 1, 10),
    ],
    highlights: [], source: { file: 'vegetable grarden.pdf', pages: [1, 2] },
  },
  {
    id: 'herbal-garden', title: 'Herbal Garden',
    introduction: 'Discovering traditional plant knowledge.',
    description: 'Within the campus a herbal garden with varieties of medicinal plants labelled with their scientific and common names is also present, which enables the students to get firsthand knowledge of these traditional herbs and trees and their use in household remedies as cure for various ailments.',
    images: [image('herbal-garden', 533, 407, 'Labelled potted plants arranged around a tree in the school’s Herbal Garden', 'Labelled plants in the Herbal Garden.', 'herbal garden.pdf', 1, 10)],
    highlights: [], source: { file: 'herbal garden.pdf', pages: [1, 2] },
  },
  {
    id: 'nakshathravanam', title: 'Nakshathravanam',
    introduction: 'A connection to Kerala tradition.',
    description: '‘Nakshatravanam’ is another major attraction within the campus where plants representing Birth Stars are grown in pots. A detailed knowledge about the plant belonging to each birth star along with their scientific and common names is also displayed. ‘Dasapushpangal’ constituting of ten flowers holding a prominent position in Kerala tradition are also grown here.',
    images: [image('nakshathravanam', 611, 349, 'Potted plants and information signs arranged beneath green shade netting at Nakshathravanam', 'Potted plants and their displayed names at Nakshathravanam.', 'nakshtharavanam.pdf', 1, 9)],
    highlights: ['Birth-star plants', 'Dasapushpangal'], source: { file: 'nakshtharavanam.pdf', pages: [1] },
  },
];
