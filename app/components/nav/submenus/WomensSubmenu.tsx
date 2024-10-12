const subMenuWomensLinks = [
  {uri: "/collections/all/Women's", name: 'All Womens'},
  {uri: "/collections/tops/Women's", name: 'Womens Tops'},
  {uri: "/collections/bottoms/Women's", name: 'Womens Bottoms'},
  {uri: '/collections/dresses,rompers-jumpsuits/', name: 'Dresses & Rompers'},
];

export const SubMenuWomens = () => {
  return (
    <div className="text-3xl font-semibold tracking-wide flex flex-col gap-2">
      {subMenuWomensLinks.map((link) => (
        <a
          key={link.name}
          href={link.uri}
          className="px-4 py-2 rounded hover:bg-gray-50/20 transition-colors"
        >
          {link.name}
        </a>
      ))}
    </div>
  );
};
