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
import User from "./pages/user";
import { Logs } from "./components/Logs";
import { Graph } from "./components/Graph";
import Batches from "./pages/batches";
import BatchesNew from "./modal/Batch/New";
import BatchesEdit from "./modal/Batch/Edit";
import BatchesDelete from "./modal/Batch/Delete";
import BatchSingle from "./pages/batches/single";
import UserNew from "./pages/user/new";
import UserEdit from "./pages/user/edit";
import UserDelete from "./pages/user/delete";
import UserData from "./pages/user/index";

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
          <Route path="faculty">
            <Route index element={<Faculty />} />
            <Route path="new" element={<UserNew />} />
            <Route path=":id">
            <Route index element={<UserData />} />
              <Route path="edit" element={<UserEdit />} />
              <Route path="delete" element={<UserDelete />} />
            </Route>
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
          <Route path="Batches">
            <Route path=":id" element={<BatchSingle />} />
            <Route element={<Batches />}>
              <Route index />
              <Route element={<Modal />}>
                <Route path="new" element={<BatchesNew />} />
                <Route path=":id">
                  <Route path="edit" element={<BatchesEdit />} />
                  <Route path="delete" element={<BatchesDelete />} />
                </Route>
              </Route>
            </Route>
          </Route>
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
