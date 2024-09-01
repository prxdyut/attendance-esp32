import { Route, Routes } from "react-router-dom";
import MainLayout from "./layout";
import Dashboard from "./pages/dashboard";
import Students from "./pages/students";
import Faculty from "./pages/faculty";
import Whatsapp from "./pages/whatsapp";
import NotFound from "./pages/notFound";
import Templates from "./pages/templates";
import Holidays from "./pages/holidays";
import Settings from "./pages/settings";
import Batches from "./pages/batches";
import BatchSingle from "./pages/batches/single";
import UserData from "./pages/user/index";
import NewCards from "./pages/newCards";
import { Logs } from "./components/Logs";
import { Graph } from "./components/Graph";
import { Presentees } from "./pages/attendance/presentees";
import { Absentees } from "./pages/attendance/absentees";
import Schedule from "./pages/schedules";
import Scores from "./pages/scores";
import { FeeStatistics } from "./pages/fees/statistics";
import { ResourceList } from "./pages/resources";
import Buckets from "./components/fileUpload";
import { AlertList } from "./pages/alerts";
import { HolidayFor } from "./pages/attendance/holidays";
import Statistics from "./pages/statistics";

function App() {
  return (
    <div>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="buckets" element={<Buckets />} />
          <Route path="whatsapp" element={<Whatsapp />} />
          <Route path="templates" element={<Templates />} />
          <Route path="statistics">
            <Route index element={<Statistics />} />
            <Route path="present" element={<Logs />} />
            <Route path="unexcused" element={<Logs />} />
            <Route path="batch-based" element={<Graph />} />
          </Route>
          <Route path="new-cards" element={<NewCards />} />
          <Route path="settings" element={<Settings />} />
          <Route path="presentees" element={<Presentees />} />
          <Route path="absentees" element={<Absentees />} />
          <Route path="holiday-for" element={<HolidayFor />} />
          <Route path="students/*" element={<Students />} />
          <Route path="user/:id" element={<UserData />} />
          <Route path="batches">
            <Route index element={<Batches />} />
            <Route path="new" element={<Batches />} />
            <Route path=":id">
              <Route index element={<BatchSingle />} />
              <Route path="edit" element={<Batches />} />
              <Route path="delete" element={<Batches />} />
              <Route path="*" element={<BatchSingle />} />
            </Route>
          </Route>
          <Route path="faculty/*" element={<Faculty />} />
          <Route path="holidays/*" element={<Holidays />} />
          <Route path="schedules/*" element={<Schedule />} />
          <Route path="scores/*" element={<Scores />} />
          <Route path="fees/*" element={<FeeStatistics />} />
          <Route path="alerts/*" element={<AlertList />} />
          <Route path="resources/*" element={<ResourceList />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
