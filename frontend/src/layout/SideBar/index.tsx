import {
  ExpandLess,
  ExpandMore,
  Inbox,
  Logout,
  Mail,
  StarBorder,
  Dashboard,
  AddCard,
  Schedule,
  Score,
  AttachMoney,
  Notifications,
  LibraryBooks,
  BarChart,
  Event,
  CheckCircle,
  Cancel,
  BeachAccess,
  Group,
  School,
  Person,
  WhatsApp,
  Email,
  Sms,
  Settings,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Collapse,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from "@mui/material";
import { red } from "@mui/material/colors";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
type SideBarChildren = {
  type: "children";
  label: string;
  url: string;
  disabled?: true;
  icon: JSX.Element;
  children: SideBarLink[];
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
  | SideBarLogout
  | SideBarChildren;

export default function SideBar({
  openState,
}: {
  openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}) {
  const drawerWidth = 240;
  const SideBarItems: SideBarItem[] = [
    {
      type: "link",
      label: "Dashboard",
      url: "/dashboard",
      icon: <Dashboard />,
    },
    { type: "link", label: "New Cards", url: "/new-cards", icon: <AddCard /> },
    { type: "link", label: "Schedules", url: "/schedules", icon: <Schedule /> },
    { type: "link", label: "Scores", url: "/scores", icon: <Score /> },
    { type: "link", label: "Fees", url: "/fees", icon: <AttachMoney /> },
    { type: "link", label: "Alerts", url: "/alerts", icon: <Notifications /> },
    {
      type: "link",
      label: "Resources",
      url: "/resources",
      icon: <LibraryBooks />,
    },
    {
      type: "link",
      label: "Statistics",
      url: "/statistics",
      icon: <BarChart />,
    },
    { type: "link", label: "Holidays", url: "/holidays", icon: <Event /> },
    { type: "space" },
    { type: "category", text: "Attendance" },
    {
      type: "link",
      label: "Presentees",
      url: "/presentees",
      icon: <CheckCircle />,
    },
    { type: "link", label: "Absentees", url: "/absentees", icon: <Cancel /> },
    {
      type: "link",
      label: "Holiday For",
      url: "/holiday-for",
      icon: <BeachAccess />,
    },
    { type: "space" },
    { type: "category", text: "People" },
    { type: "link", label: "Batches", url: "/batches", icon: <Group /> },
    { type: "link", label: "Students", url: "/students", icon: <School /> },
    { type: "link", label: "Faculty", url: "/faculty", icon: <Person /> },
    { type: "space" },
    { type: "category", text: "Integrations" },
    { type: "link", label: "Whatsapp", url: "/whatsapp", icon: <WhatsApp /> },
    // {
    //   type: "link",
    //   label: "Email",
    //   disabled: true,
    //   url: "/email",
    //   icon: <Email />,
    // },
    // { type: "link", label: "SMS", disabled: true, url: "/sms", icon: <Sms /> },
    { type: "space" },
    // { type: "category", text: "More" },
    // { type: "link", label: "Settings", url: "/settings", icon: <Settings /> },
    // { type: "space" },
    { type: "logout" },
  ];

  const [mobileOpen, setMobileOpen] = openState;
  const [isClosing, setIsClosing] = useState(false);

  const navigate = useNavigate();

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerOpen = () => {
    setMobileOpen(true);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const ChildrenItem = (item: SideBarChildren) => {
    const [open, setOpen] = useState(true);

    const handleOpen = () => {
      setOpen(!open);
    };

    return (
      <List onMouseLeave={() => setOpen(false)}>
        <ListItemButton
          onMouseEnter={() => setOpen(true)}
          onClick={() => navigate(item.url)}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.label} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children.map((child) => (
              <ListItemButton
                sx={{ pl: 4 }}
                onClick={() => navigate(child.url)}
              >
                <ListItemIcon>{child.icon}</ListItemIcon>
                <ListItemText primary={child.label} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </List>
    );
  };

  const drawer = (
    <Box>
      <Toolbar>XYZ Classes</Toolbar>
      <Divider />
      <List onClick={handleDrawerClose}>
        {SideBarItems.map((item, i) => {
          switch (item.type) {
            case "link":
              return (
                <ListItem
                  key={i}
                  disablePadding
                  onClick={() => navigate(item.url)}
                >
                  <ListItemButton>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              );
            case "children":
              return <ChildrenItem {...item} />;
            case "divider":
              return <Divider />;
            case "category":
              return <ListItem>{item.text}</ListItem>;
            case "space":
              return <ListItem sx={{ height: "8px" }} />;
            case "logout":
              return (
                <ListItem key={i} disablePadding sx={{ color: red[900] }}>
                  <ListItemButton>
                    <ListItemIcon>
                      <Logout sx={{ color: red[900] }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={<Typography fontWeight={600}>Logout</Typography>}
                    />
                  </ListItemButton>
                </ListItem>
              );
          }
          return <></>;
        })}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <SwipeableDrawer
        variant="temporary"
        open={mobileOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        onOpen={handleDrawerOpen}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {drawer}
      </SwipeableDrawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
