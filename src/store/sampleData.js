export const initialMeals = [
  {
    id: 'meal-thit-kho',
    name: 'Thịt kho',
    ingredients: ['Thịt heo', 'Hành lá'],
  },
  {
    id: 'meal-canh-khoai-ngot',
    name: 'Canh khoai ngọt',
    ingredients: ['Khoai ngọt'],
  },
  {
    id: 'meal-lap-xuong-chien',
    name: 'Lạp xưởng chiên',
    ingredients: ['Lạp xưởng'],
  },
  {
    id: 'meal-canh-rong-bien-tau-hu',
    name: 'Canh rong biển tàu hủ',
    ingredients: ['Rong biển', 'Tàu hủ'],
  },
  {
    id: 'meal-xuc-xich-xao-bong-cai-xanh',
    name: 'Xúc xích xào bông cải xanh',
    ingredients: ['Xúc xích', 'Bông cải xanh'],
  },
  {
    id: 'meal-thit-ga-xao',
    name: 'Thịt gà xào',
    ingredients: ['Thịt gà', 'Rau'],
  },
  {
    id: 'meal-canh-cu-ham-thit',
    name: 'Canh củ hầm thịt',
    ingredients: ['Sườn heo', 'Củ dền', 'Khoai tây', 'Cà rốt'],
  },
  {
    id: 'meal-ca-kho-khom',
    name: 'Cá kho khóm',
    ingredients: ['Cá', 'Khóm', 'Hành lá'],
  },
  {
    id: 'meal-trung-xao-version-2',
    name: 'Trứng xào version 2',
    ingredients: ['Trứng chiên', 'Nấm đùi gà', 'Hành tây', 'Đậu bắp'],
  },
  {
    id: 'meal-salad',
    name: 'Salad',
    ingredients: ['Ớt chuông', 'Rau hỗn hợp', 'Sốt mè rang', 'Thịt luộc'],
  },
]

export const initialProducts = [
  { id: 'product-sua-th', name: 'Sữa TH' },
  { id: 'product-yakurt', name: 'Yakurt' },
  { id: 'product-sua-dac', name: 'Sữa đặc' },
  { id: 'product-snack', name: 'Snack' },
  { id: 'product-tissue', name: 'Tissue' },
  { id: 'product-hanh-la', name: 'Hành lá' },
  { id: 'product-nuoc-mam', name: 'Nước mắm' },
  { id: 'product-banh-bao', name: 'Bánh bao' },
]

export const initialWeeklyPlan = {
  id: 'plan-week-2026-03-23',
  weekLabel: '23/03 - 27/03',
  notes: '',
  days: {
    monday: ['meal-thit-kho', 'meal-canh-khoai-ngot'],
    tuesday: ['meal-lap-xuong-chien', 'meal-canh-rong-bien-tau-hu'],
    wednesday: ['meal-xuc-xich-xao-bong-cai-xanh', 'meal-thit-ga-xao'],
    thursday: ['meal-canh-cu-ham-thit', 'meal-ca-kho-khom'],
    friday: ['meal-trung-xao-version-2', 'meal-salad'],
    saturday: [],
    sunday: [],
  },
  extraItems: [
    {
      id: 'extra-sua-dac',
      name: 'Sữa đặc',
      checked: false,
      note: '',
    },
    {
      id: 'extra-yakurt',
      name: 'Yakurt',
      checked: false,
      note: '',
    },
    {
      id: 'extra-sua-th',
      name: 'Sữa TH',
      checked: false,
      note: '',
    },
    {
      id: 'extra-snack',
      name: 'Snack',
      checked: false,
      note: '',
    },
  ],
}
