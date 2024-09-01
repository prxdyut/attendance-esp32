import {
  AttachMoney,
  AttachMoneyOutlined,
  Event,
  EventOutlined,
  GroupOutlined,
  HomeOutlined,
  LibraryBooks,
  LibraryBooksOutlined,
  Logout,
  Notifications,
  NotificationsOutlined,
  Person,
  Schedule,
  ScheduleOutlined,
  School,
  Score,
  ScoreOutlined,
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  SvgIconTypeMap,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { Ham, MenuIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const drawerWidth = 240;
export default function Topbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const settings = ["Profile", "Account", "Dashboard", "Logout"];
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const options: {
    icon: OverridableComponent<SvgIconTypeMap>;
    label: string;
    url: string;
  }[] = [
    {
      icon: HomeOutlined,
      label: "Home",
      url: "/dashboard",
    },
    {
      icon: ScheduleOutlined,
      label: "Schedule",
      url: "/schedules",
    },
    {
      icon: ScoreOutlined,
      label: "Scores",
      url: "/scores",
    },
    {
      icon: AttachMoneyOutlined,
      label: "Fees",
      url: "/fees",
    },
    {
      icon: NotificationsOutlined,
      label: "Alerts",
      url: "/alerts",
    },
    {
      icon: LibraryBooksOutlined,
      label: "Resources",
      url: "/resources",
    },
    {
      icon: EventOutlined,
      label: "Holidays",
      url: "/holidays",
    },
    {
      icon: GroupOutlined,
      label: "Batches",
      url: "/batches",
    },
  ];

  return (
    <Box>
      <Toolbar />
      <AppBar
        elevation={0}
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: "white",
          color: "black",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box flex={1} />
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem sx={{ flexDirection: "column", alignItems: "start" }}>
                <Box sx={{ height: 12 }} />
                <Typography variant="body2" fontWeight={600}>
                  Pradyut Das
                </Typography>
                <Typography fontSize={12}>daspradyut516@gmail.com</Typography>
              </MenuItem>
              <Divider flexItem />
              {options.map(
                (
                  option: {
                    icon: OverridableComponent<SvgIconTypeMap>;
                    label: string;
                    url: string;
                  },
                  index: number
                ) => (
                  <MenuItem
                    key={index}
                    onClick={handleCloseUserMenu}
                    sx={{ gap: 2 }}
                    component={Link}
                    to={option.url}
                  >
                    <option.icon sx={{ opacity: 0.6 }} />{" "}
                    <Typography>{option.label}</Typography>
                  </MenuItem>
                )
              )}
              <Divider flexItem />
              <MenuItem
                onClick={handleCloseUserMenu}
                sx={{ gap: 2 }}
                component={Link}
                to={"/students"}
              >
                <School sx={{ opacity: 0.6 }} />{" "}
                <Typography>Students</Typography>
              </MenuItem>
              <MenuItem
                onClick={handleCloseUserMenu}
                sx={{ gap: 2 }}
                component={Link}
                to={"/faculty"}
              >
                <Person sx={{ opacity: 0.6 }} />{" "}
                <Typography>Faculty</Typography>
              </MenuItem>
              <Divider flexItem />
              <MenuItem
                onClick={handleCloseUserMenu}
                sx={(theme) => ({
                  gap : 2,
                  color: theme.palette.error.main,
                  "& .MuiTouchRipple-root": {
                    color: theme.palette.error.dark,
                  },
                })}
              >
                <Logout sx={{ opacity: 0.6 }} /> <Typography>Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
