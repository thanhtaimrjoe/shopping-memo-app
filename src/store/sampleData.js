export const initialMeals = [
  {
    id: '56a2f5cd-856d-4dbb-9df5-b13c6d0b8c01',
    name: 'Thịt kho',
    ingredients: ['Thịt heo', 'Hành lá'],
  },
  {
    id: '56a2f5cd-856d-4dbb-9df5-b13c6d0b8c02',
    name: 'Canh khoai ngọt',
    ingredients: ['Khoai ngọt'],
  },
  {
    id: '56a2f5cd-856d-4dbb-9df5-b13c6d0b8c03',
    name: 'Lạp xưởng chiên',
    ingredients: ['Lạp xưởng'],
  },
  {
    id: '56a2f5cd-856d-4dbb-9df5-b13c6d0b8c04',
    name: 'Canh rong biển tàu hủ',
    ingredients: ['Rong biển', 'Tàu hủ'],
  },
  {
    id: '56a2f5cd-856d-4dbb-9df5-b13c6d0b8c05',
    name: 'Xúc xích xào bông cải xanh',
    ingredients: ['Xúc xích', 'Bông cải xanh'],
  },
  {
    id: '56a2f5cd-856d-4dbb-9df5-b13c6d0b8c06',
    name: 'Thịt gà xào',
    ingredients: ['Thịt gà', 'Rau'],
  },
  {
    id: '56a2f5cd-856d-4dbb-9df5-b13c6d0b8c07',
    name: 'Canh củ hầm thịt',
    ingredients: ['Sườn heo', 'Củ dền', 'Khoai tây', 'Cà rốt'],
  },
  {
    id: '56a2f5cd-856d-4dbb-9df5-b13c6d0b8c08',
    name: 'Cá kho khóm',
    ingredients: ['Cá', 'Khóm', 'Hành lá'],
  },
  {
    id: '56a2f5cd-856d-4dbb-9df5-b13c6d0b8c09',
    name: 'Trứng xào version 2',
    ingredients: ['Trứng chiên', 'Nấm đùi gà', 'Hành tây', 'Đậu bắp'],
  },
  {
    id: '56a2f5cd-856d-4dbb-9df5-b13c6d0b8c0a',
    name: 'Salad',
    ingredients: ['Ớt chuông', 'Rau hỗn hợp', 'Sốt mè rang', 'Thịt luộc'],
  },
]

export const initialProducts = [
  { id: 'a9c0c42f-635c-4177-b519-0ff0b1f76401', name: 'Sữa TH', image: '' },
  { id: 'a9c0c42f-635c-4177-b519-0ff0b1f76402', name: 'Yakurt', image: '' },
  { id: 'a9c0c42f-635c-4177-b519-0ff0b1f76403', name: 'Sữa đặc', image: '' },
  { id: 'a9c0c42f-635c-4177-b519-0ff0b1f76404', name: 'Snack', image: '' },
  { id: 'a9c0c42f-635c-4177-b519-0ff0b1f76405', name: 'Tissue', image: '' },
  { id: 'a9c0c42f-635c-4177-b519-0ff0b1f76406', name: 'Hành lá', image: '' },
  { id: 'a9c0c42f-635c-4177-b519-0ff0b1f76407', name: 'Nước mắm', image: '' },
  { id: 'a9c0c42f-635c-4177-b519-0ff0b1f76408', name: 'Bánh bao', image: '' },
]

export const createInitialWeeklyPlan = () => ({
  id: '7f340e8b-4b74-4d08-95d4-2c9bf5b81401',
  weekLabel: '23/03 - 27/03',
  notes: '',
  days: {
    monday: ['56a2f5cd-856d-4dbb-9df5-b13c6d0b8c01', '56a2f5cd-856d-4dbb-9df5-b13c6d0b8c02'],
    tuesday: ['56a2f5cd-856d-4dbb-9df5-b13c6d0b8c03', '56a2f5cd-856d-4dbb-9df5-b13c6d0b8c04'],
    wednesday: ['56a2f5cd-856d-4dbb-9df5-b13c6d0b8c05', '56a2f5cd-856d-4dbb-9df5-b13c6d0b8c06'],
    thursday: ['56a2f5cd-856d-4dbb-9df5-b13c6d0b8c07', '56a2f5cd-856d-4dbb-9df5-b13c6d0b8c08'],
    friday: ['56a2f5cd-856d-4dbb-9df5-b13c6d0b8c09', '56a2f5cd-856d-4dbb-9df5-b13c6d0b8c0a'],
    saturday: [],
    sunday: [],
  },
  extraItems: [
    {
      id: 'b7b71b8f-d66b-47c8-b0f8-1b693eb7c401',
      name: 'Sữa đặc',
      checked: false,
      note: '',
    },
    {
      id: 'b7b71b8f-d66b-47c8-b0f8-1b693eb7c402',
      name: 'Yakurt',
      checked: false,
      note: '',
    },
    {
      id: 'b7b71b8f-d66b-47c8-b0f8-1b693eb7c403',
      name: 'Sữa TH',
      checked: false,
      note: '',
    },
    {
      id: 'b7b71b8f-d66b-47c8-b0f8-1b693eb7c404',
      name: 'Snack',
      checked: false,
      note: '',
    },
  ],
})
