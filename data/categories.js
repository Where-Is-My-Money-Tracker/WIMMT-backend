module.exports = [
  {
    id: 1,
    parent_id: 0,
    description: 'Food',
    child_categories: [2, 3]
  },
  {
    id: 2,
    parent_id: 1,
    description: 'Ready meals',
    child_categories: []
  },
  {
    id: 3,
    parent_id: 1,
    description: 'Takeout',
    child_categories: []
  },
  {
    id: 4,
    parent_id: 0,
    description: 'Pets',
    child_categories: [5, 6, 7, 8]
  },
  {
    id: 5,
    parent_id: 4,
    description: 'Cat',
    child_categories: []
  },
  {
    id: 6,
    parent_id: 4,
    description: 'Dog',
    child_categories: []
  },
  {
    id: 7,
    parent_id: 4,
    description: 'Fish',
    child_categories: []
  },
  {
    id: 8,
    parent_id: 4,
    description: 'Canaries',
    child_categories: []
  },
  {
    id: 9,
    parent_id: 0,
    description: 'Subscriptions',
    child_categories: []
  },
  {
    id: 10,
    parent_id: 0,
    description: 'Self improvement',
    child_categories: []
  }
];