import React from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "./layout";
import Dashboard from "./pages/dashboard";
import Students from "./pages/students";
import Modal from "./modal";
import Faculty from "./pages/faculty";
import Whatsapp from "./pages/whatsapp";
import NotFound from "./pages/notFound";
import Templates from "./pages/templates";
import Statistics from "./pages/statistics";
import Holidays from "./pages/holidays";
import HolidayNew from "./modal/Holiday/New";
import Settings from "./pages/settings";
import Batches from "./pages/batches";
import BatchesNew from "./pages/batches/new";
import BatchesEdit from "./pages/batches/edit";
import BatchesDelete from "./modal/Batch/Delete";
import BatchSingle from "./pages/batches/single";
import UserNew from "./pages/user/new";
import UserEdit from "./pages/user/edit";
import UserDelete from "./pages/user/delete";
import UserData from "./pages/user/index";
import NewCards from "./pages/newCards";
import { Logs } from "./components/Logs";
import { Graph } from "./components/Graph";
import { Absentees, Presentees } from "./pages/attendance/presentees";
import { Schedule } from "./pages/schedules";
import { NewSchedule } from "./pages/schedules/new";
import { EditSchedule } from "./pages/schedules/edit";
import Scheduledelete from "./pages/schedules/delete";
import { ViewAllScores } from "./pages/scores";
import { EditScore } from "./pages/scores/edit";
import { DeleteScore } from "./pages/scores/delete";
import { ViewSingleScore } from "./pages/scores/view";
import { CreateScore } from "./pages/scores/new";
import { FeeStatistics } from "./pages/fees/statistics";
import { FeeInstallment } from "./pages/fees/installment";
import { Defaulters } from "./pages/fees/defaulters";
import { SetTotalFeesForm } from "./pages/fees/total";
import { ResourceList } from "./pages/resources";
import { ResourceUpload } from "./pages/resources/new";
import Buckets from "./components/fileUpload";
import ResourceDelete from "./pages/resources/delete";
import { AlertList } from "./pages/alerts";
import { AlertCreator } from "./pages/alerts/new";

function App() {
  return (
    <div>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="students">
            <Route index element={<Students />} />
            <Route path="new" element={<UserNew />} />
            <Route path=":id">
              <Route index element={<UserData />} />
              <Route path="edit" element={<UserEdit />} />
              <Route path="delete" element={<UserDelete />} />
            </Route>
          </Route>
          <Route path="alerts">
            <Route index element={<AlertList />} />
            <Route path="new" element={<AlertCreator />} />
            <Route path=":id">
              <Route path="delete" element={<UserDelete />} />
            </Route>
          </Route>
          <Route path="buckets"  element={<Buckets />}/>
          <Route path="faculty">
            <Route index element={<Faculty />} />
            <Route path="new" element={<UserNew />} />
            <Route path=":id">
              <Route index element={<UserData />} />
              <Route path="edit" element={<UserEdit />} />
              <Route path="delete" element={<UserDelete />} />
            </Route>
          </Route>
          <Route path="fees">
            <Route index element={<FeeStatistics />} />
            <Route path="installment" element={<FeeInstallment />} />
            <Route path="defaulters" element={<Defaulters />} />
            <Route path="total" element={<SetTotalFeesForm />} />
          </Route>
          <Route path="whatsapp" element={<Whatsapp />} />
          <Route path="templates" element={<Templates />} />
          <Route path="statistics" element={<Statistics />}>
            <Route element={<Modal />}>
              <Route path="present" element={<Logs />} />
              <Route path="unexcused" element={<Logs />} />
              <Route path="batch-based" element={<Graph />} />
            </Route>
          </Route>
          <Route path="holidays">
            <Route element={<Holidays />}>
              <Route index />
              <Route element={<Modal />}>
                <Route path="new" element={<HolidayNew />} />
              </Route>
            </Route>
            <Route path=":id">
              <Route path="view" element={<Students />} />
            </Route>
          </Route>
          <Route path="new-cards" element={<NewCards />} />
          <Route path="batches">
            <Route index element={<Batches />} />
            <Route path="new" element={<BatchesNew />} />
            <Route path=":id">
              <Route index element={<BatchSingle />} />
              <Route path="edit" element={<BatchesEdit />} />
              <Route path="delete" element={<BatchesDelete />} />
            </Route>
          </Route>
          <Route path="settings" element={<Settings />} />
          <Route path="presentees" element={<Presentees />} />
          <Route path="absentees" element={<Absentees />} />
          <Route path="schedules">
            <Route index element={<Schedule />} />
            <Route path="new" element={<NewSchedule />} />
            <Route path=":id">
              <Route path="edit" element={<EditSchedule />} />
              <Route path="delete" element={<Scheduledelete />} />
            </Route>
          </Route>
          <Route path="scores">
            <Route index element={<ViewAllScores />} />
            <Route path="new" element={<CreateScore />} />
            <Route path=":id">
              <Route index element={<ViewSingleScore />} />
              <Route path="edit" element={<EditScore />} />
              <Route path="delete" element={<DeleteScore />} />
            </Route>
          </Route>
          <Route path="resources">
            <Route index element={<ResourceList />} />
            <Route path="new" element={<ResourceUpload />} />
            <Route path=":id">
              <Route path="delete" element={<ResourceDelete />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
