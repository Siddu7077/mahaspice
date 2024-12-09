const menuSections = {
  welcomeDrink: {
    title: 'Welcome Drink',
    limit: 1,
    items: ['Lime Juice', 'Buttermilk', 'Watermelon', 'Muskmelon', 'Papaya']
  },
  welcomeSnacks: {
    title: 'Welcome Snacks',
    limit: 1,
    items: ['Harabhara Kabob', 'Veg Manchuria', 'Smiles Hearts', 'Cheese Balls']
  },
  salad: {
    title: 'Salad',
    limit: 1,
    items: ['Green Salad', 'Sprouts Salad', 'Tossed Salad', 'Garden Salad']
  },
  hot: {
    title: 'Hot',
    limit: 1,
    items: ['Mirchi Bajji', 'Artikaka Bajji', 'Pan Leaf Bajji']
  },
  roti: {
    title: 'Roti',
    limit: 1,
    items: ['Rumali Roti', 'Pulkha', 'Chapatti', 'Poori']
  },
  splRice: {
    title: 'Special Rice (Basmathi)',
    limit: 1,
    items: ['Veg Pulav', 'Veg Biryani', 'Peas Pulav', 'Muttor Pulav']
  },
  fry: {
    title: 'Fry',
    limit: 1,
    items: ['Bhendi Fry', 'Donda Fry', 'Kanda Poosa Fry', 'Aloo Vepudu']
  },
  vegCurry: {
    title: 'Veg Curry',
    limit: 1,
    items: [
      'Gutti Vankai Masala',
      'Aloo Paneer Curry',
      'Chole Masala',
      'Mix Veg Kurma',
      'Gobi Muttor'
    ]
  },
  dal: {
    title: 'Dal',
    limit: 1,
    items: [
      'Tomato Dal',
      'Dosakaya Pappu',
      'Palak Dal',
      'Gongura Pappu',
      'Kaddu Dal'
    ]
  },
  sambarRasam: {
    title: 'Sambar or Rasam',
    limit: 1,
    items: [
      'Tomato Rasam',
      'Mix Sambar',
      'Pepper Sambar',
      'Pappu Charu',
      'Madras Sambar'
    ]
  },
  chutney: {
    title: 'Chutney',
    limit: 1,
    items: [
      'Tomato Chutney',
      'Cabbage Chutney',
      'Dosakaya Chutney',
      'Gongura Chutney'
    ]
  },
  pickel: {
    title: 'Pickel',
    limit: 1,
    items: ['Mango Pickel', 'Dosakaya Pickel', 'Lime Pickel']
  },
  sweet: {
    title: 'Sweet',
    limit: 1,
    items: ['Gulabjamoon', 'Chakrapongal', 'Kala Jamoon', 'Carrot Halwa']
  },
  iceCream: {
    title: 'Ice Cream',
    limit: 1,
    items: ['Strawberry', 'Vanilla']
  },
  nonVegSnacks: {
    title: 'Non-Veg Snacks (Chicken)',
    limit: 1,
    items: [
      'Pepper Chicken',
      'Chicken Pakora',
      'Ginger Chicken',
      'Chicken Manchuria'
    ]
  },
  nonVegChicken: {
    title: 'Non-Veg Chicken',
    limit: 1,
    items: [
      'Chicken Dum Biryani',
      'Chicken Pulav',
      'Butter Chicken',
      'Kadhai Chicken'
    ]
  },
  nonVegEgg: {
    title: 'Non-Veg Egg',
    limit: 1,
    items: [
      'Egg Pulav',
      'Egg Biryani',
      'Egg Masala',
      'Egg Pulusu',
      'Egg Curry'
    ]
  },
  commonItems: {
    title: 'Common Items',
    limit: 5,
    items: ['Curd', 'Papad', 'Ritha', 'Plain Rice', 'Drinking Water (Serve in Glass)']
  }
};

export { menuSections };
