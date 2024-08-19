interface SubMenuLinksProps {
  links: SubMenuLink[];
}

export interface SubMenuLink {
  id: number;
  uri: string;
  name: string;
}

export interface SubMenuAttrs {
  links: SubMenuLink[];
  toggleText: string;
}

export const SubMenuLinks = ({links}: SubMenuLinksProps) => {
  return (
    <div className="text-3xl font-semibold tracking-wide flex flex-col gap-2">
      {links.map((link) => (
        <a
          key={link.id}
          href={link.uri}
          className="px-4 py-2 rounded hover:bg-gray-50/20 transition-colors"
        >
          {link.name}
        </a>
      ))}
    </div>
  );
};
