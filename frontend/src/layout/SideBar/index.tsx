import { Link } from "react-router-dom";

export default function SideBar() {
  type SideBarBrand = {
    type: "brand";
    image: [string, string];
    name: string;
  };
  type SideBarCategory = {
    type: "category";
    text: string;
  };
  type SideBarLink = {
    type: "link";
    label: string;
    url: string;
    disabled?: true;
    icon: JSX.Element;
  };
  type SideBarDivider = {
    type: "divider";
  };
  type SideBarSpace = {
    type: "space";
  };
  type SideBarLogout = {
    type: "logout";
  };

  type SideBarItem =
    | SideBarLink
    | SideBarDivider
    | SideBarBrand
    | SideBarCategory
    | SideBarSpace
    | SideBarLogout;

  const SideBarItems: SideBarItem[] = [
    {
      type: "brand",
      image: ["https://google.com", "brand"],
      name: "Safalya Classes",
    },
    { type: "space" },
    { type: "divider" },
    { type: "space" },
    { type: "link", label: "Dashboard", url: "/dashboard", icon: <></> },
    { type: "space" },
    { type: "category", text: "People" },
    { type: "link", label: "Batches", url: "/batches", icon: <></> },
    { type: "link", label: "Students", url: "/students", icon: <></> },
    { type: "link", label: "Faculty", url: "/faculty", icon: <></> },
    { type: "space" },
    { type: "category", text: "Integrations" },
    { type: "link", label: "Whatsapp", url: "/whatsapp", icon: <></> },
    {
      type: "link",
      label: "Telegram",
      disabled: true,
      url: "/telegram",
      icon: <></>,
    },
    {
      type: "link",
      label: "Email",
      disabled: true,
      url: "/email",
      icon: <></>,
    },
    { type: "link", label: "SMS", disabled: true, url: "/sms", icon: <></> },
    { type: "space" },
    { type: "category", text: "More" },
    // { type: "link", label: "Templates", url: "/templates", icon: <></> },
    { type: "link", label: "Statistics", url: "/statistics", icon: <></> },
    { type: "link", label: "Holidays", url: "/holidays", icon: <></> },
    { type: "link", label: "Settings", url: "/settings", icon: <></> },
    { type: "space" },
    { type: "logout" },
  ];

  return (
    <div className=" border p-2 overflow-auto">
      <ul>
        {SideBarItems.map((item, i) => {
          switch (item.type) {
            case "brand":
              return (
                <li key={i}>
                  <Link to={"/"}>
                    <div>
                      <img src={item.image[0]} alt={item.image[1]} />
                      <p className=" font-bold text-xl">{item.name}</p>
                    </div>
                  </Link>
                </li>
              );
            case "link":
              return (
                <li key={i} className={`py-2 px-4 border ${item.disabled && "opacity-50"}`}>
                  <Link to={item.disabled ? "javascript:void(0)" : item.url}>
                    {item.icon}
                    <p>{item.label}</p>
                  </Link>
                </li>
              );
            case "divider":
              return (
                <li key={i}>
                  <hr />
                </li>
              );
            case "category":
              return (
                <li key={i}>
                  <pre>{item.text}</pre>
                </li>
              );
            case "space":
              return (
                <li key={i}>
                  <div style={{ height: 8, width: "100%" }}> </div>
                </li>
              );
            case "logout":
              return (
                <li style={{ color: "red" }} key={i}>
                  <Link to={"/logout"}>
                    icon
                    <p>Logout</p>
                  </Link>
                </li>
              );
          }
          return <></>;
        })}
      </ul>
    </div>
  );
}
