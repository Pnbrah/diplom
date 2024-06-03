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
        description: 'Create UI that is shared across routes',
      },
      {
        name: 'Накладна 2',
        slug: 'route-groups',
        description: 'Organize routes without affecting URL paths',
      },
      {
        name: 'Накладна 3',
        slug: 'parallel-routes',
        description: 'Render multiple pages in the same layout',
      },
    ],
  },
  {
    name: 'Акти',
    items: [
      {
        name: 'Акт приймання-передачі основних засобів',
        slug: 'loading',
        description:
          'Create meaningful Loading UI for specific parts of an app',
      },
      {
        name: 'АПП військового',
        slug: 'error-handling',
        description: 'Create Error UI for specific parts of an app',
      },
      {
        name: 'Акт тех. стану',
        slug: 'n6453453',
        description: 'Create Not Found UI for specific parts of an app',
      },
      {
        name: 'Акт списання',
        slug: 'n432321',
        description: 'Create Not Found UI for specific parts of an app',
      },
      {
        name: 'Акт зміни стану',
        slug: 'n1231',
        description: 'Create Not Found UI for specific parts of an app',
      },
    ],
  },
  {
  name: 'Додатки та облік',
    items: [
      {
        name: 'Додаток 46',
        slug: 'addon46',
        description: 'Create UI that is shared across routes',
      },
      {
        name: 'Додаток 47',
        slug: 'addon47',
        description: 'Organize routes without affecting URL paths',
      },
      {
        name: 'Облік',
        slug: 'parallel-routes',
        description: 'Render multiple pages in the same layout',
      },
    ],
  },
];
