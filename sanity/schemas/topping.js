import { FaPepperHot as icon, FaSeedling as seed } from 'react-icons/fa';

export default {
  // Computer name
  name: 'topping',
  // Visible title
  title: 'Toppings',
  type: 'document',
  icon,
  fields: [
    {
      name: 'name',
      title: 'Topping Name',
      type: 'string',
      description: 'What is the name of the topping?',
    },
    {
      name: 'vegetarian',
      title: 'Vegetarian',
      type: 'boolean',
      description: 'What is the name of the topping?',
      options: {
        layout: 'checkbox',
      },
    },
  ],
  preview: {
    select: {
      name: 'name',
      vegetarian: 'vegetarian',
    },
    prepare: (fields) => ({
      title: `${fields.name} ${fields.vegetarian ? '+seedling' : ''}`,
    }),
  },
};
// 🌱
