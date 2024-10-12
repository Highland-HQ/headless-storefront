const subMenuMensLinks = [
  {uri: "/collections/all/Men's", name: 'All Mens'},
  {uri: "/collections/tops/Men's", name: 'Mens Tops'},
  {uri: "/collections/bottoms/Men's", name: 'Mens Bottoms'},
];

export const SubMenuMens = () => {
  return (
    <div className="text-3xl font-semibold tracking-wide flex flex-col gap-2">
      {subMenuMensLinks.map((link) => (
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
