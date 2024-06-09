export type Item = {
  name: string;
  slug: string;
  description?: string;
};

export const navRoutes: { name: string; items: Item[] }[] = [
  {
    name: 'Накладні',
    items: [
      {
        name: 'Накладна 1',
        slug: 'invoice',
        description: 'Створення накладних, АПП, БК тощо',
      },
      {
        name: 'Накладна 2',
        slug: 'route-groups',
        description: 'Створення',
      },
      {
        name: 'Накладна 3',
        slug: 'parallel-routes',
        description: 'Створення',
      },
    ],
  },
  {
    name: 'Акти',
    items: [
      {
        name: 'Акт приймання-передачі основних засобів',
        slug: 'loading',
        description: 'Перегляд та друк актів приймання-передачі основних засобів',
      },
      {
        name: 'АПП військового',
        slug: 'error-handling',
        description: 'Перегляд та друк актів приймання-передачі військового',
      },
      {
        name: 'Акт тех. стану',
        slug: 'n6453453',
        description: 'Перегляд та друк актів технічного стану',
      },
      {
        name: 'Акт списання',
        slug: 'n432321',
        description: 'Перегляд та друк актів списання',
      },
      {
        name: 'Акт зміни стану',
        slug: 'n1231',
        description: 'Перегляд та друк актів зміни стану',
      },
    ],
  },
  {
  name: 'Додатки та облік',
    items: [
      {
        name: 'Додаток 46',
        slug: 'addon46',
        description: 'Перегляд та друк додатку 46',
      },
      {
        name: 'Додаток 47',
        slug: 'addon47',
        description: 'Перегляд та друк додатку 47',
      },
      {
        name: 'Облік',
        slug: 'parallel-routes',
        description: 'Перегляд загального обліку майна',
      },
    ],
  },
];
