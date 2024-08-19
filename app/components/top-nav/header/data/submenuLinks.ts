import {SubMenuAttrs, SubMenuLink} from './SubMenu';

export const subMenuWomensLinks: SubMenuLink[] = [
  {uri: "/collections/all/Women's", name: 'All Womens', id: 1},
  {uri: "/collections/tops/Women's", name: 'Womens Tops', id: 2},
  {uri: "/collections/bottoms/Women's", name: 'Womens Bottoms', id: 3},
  {uri: '/collections/dresses/', name: 'Dresses & Rompers', id: 4},
];

export const subMenuMensLinks: SubMenuLink[] = [
  {uri: "/collections/all/Men's", name: 'All Mens', id: 1},
  {uri: "/collections/tops/Men's", name: 'Mens Tops', id: 2},
  {uri: "/collections/bottoms/Men's", name: 'Mens Bottoms', id: 3},
];

export const mensSubMenuAttrs: SubMenuAttrs = {
  links: subMenuMensLinks,
  toggleText: "Men's",
};

export const womensSubMenuAttrs: SubMenuAttrs = {
  links: subMenuMensLinks,
  toggleText: "Women's",
};
