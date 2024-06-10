import { Strapi } from '@strapi/strapi';

export default {
  config: {
    locales: ["uk", "en"],
  },
  bootstrap(app: Strapi) {
    console.log(app);
  },
};
