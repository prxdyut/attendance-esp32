import { useMediaQuery } from "@mui/material";

const isMobile = useMediaQuery("@media (max-width:599.95px)", {
  noSsr: true,
});

export default isMobile;
