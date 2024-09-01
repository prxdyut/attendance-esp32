import React, { useEffect, useState } from "react";
import { TargetSelector, TargetSelectorProps } from "./SelectTarget";
import {
  TextField,
  Button,
  Grid,
  Box,
  Stack,
  FormControl,
  Typography,
  Collapse,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { parse, parseISO } from "date-fns";
import { useLocation } from "react-router-dom";
import { handleFetch } from "../utils/handleFetch";
import { grey } from "@mui/material/colors";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import FileUploader from "./../components/fileUpload";

type TargetSelector = {
  type: "targetSelector" | "targetSelectorWithStudentsInput";
  name: string;
  defaultValue: { type: string; ids: string[] };
} & TargetSelectorProps;
type TextField = {
  label: string;
  type: React.HTMLInputTypeAttribute;
  name: string;
  required?: boolean;
  defaultValue?: string | Date;
};
type FileSelector = {
  type: "fileSelector";
  defaultValue?: string;
  label: string;
  name: string;
};
type OptionsSelector = {
  type: "optionSelector";
  defaultValue?: string;
  label: string;
  name: string;
  required: boolean;
  readOnly: boolean;
  options: { value: string; name: string }[];
};

type Field = TargetSelector | TextField | FileSelector | OptionsSelector;
type Fields = Field[];

export const defaultDate = (date: string) => parseISO(date);
export const defaultTime = (time: string) => parse(time, "hh:mm a", new Date());

const DynamicForm = ({
  fields,
  users,
}: {
  fields: Fields;
  users?: { [x: string]: string };
}) => {
  const getValues = () => {
    let temp = new Map();
    for (const d of fields) {
      if (d.defaultValue) {
        if (d.type == "targetSelector") {
          temp.set("target", d.defaultValue);
        } else {
          temp.set(d.name, d.defaultValue);
        }
      }
    }
    if (users) temp.set("users", users);
    return Object.fromEntries(temp);
  };

  const [formData, setFormData] = useState<any>(getValues());
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [students, setStudents] = useState([]);

  const renderField = (field: Field) => {
    switch (field.type) {
      case "time":
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TimePicker
              label={field.label}
              name={field.name}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": { borderRadius: 2.5 },
                width: "100%",
              }}
              value={formData[field.name]}
              onChange={(newValue) =>
                setFormData((data: any) => ({
                  ...data,
                  [field.name]: newValue,
                }))
              }
            />
          </LocalizationProvider>
        );
      case "optionSelector":
        return (
          <FormControl fullWidth>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={formData[field.name]}
              label={field.label}
              name={field.name}
              onChange={(e) => {
                // @ts-ignore
                if (field.readOnly) return;
                setFormData((data: any) => ({
                  ...data,
                  [field.name]: e.target.value,
                }));
              }}
            >
              {
                // @ts-ignore
                field?.options?.map((option: any) => (
                  <MenuItem value={option.value}>{option.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        );

      case "date":
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={field.label}
              name={field.name}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": { borderRadius: 2.5 },
                width: "100%",
              }}
              value={formData[field.name]}
              onChange={(newValue) =>
                setFormData((data: any) => ({
                  ...data,
                  [field.name]: newValue,
                }))
              }
            />
          </LocalizationProvider>
        );
      case "number":
      case "text":
        return (
          <TextField
            fullWidth
            {...field}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": { borderRadius: 2.5 },
            }}
            value={formData[field.name] || ""}
            onChange={(e) =>
              setFormData((data: any) => ({
                ...data,
                [field.name]: e.target.value,
              }))
            }
          />
        );
      case "fileSelector":
        return <FileUploader {...field} />;
      case "targetSelectorWithStudentsInput":
        return (
          <React.Fragment>
            {
              // @ts-ignore
              <TargetSelector
                {...field}
                onSelectionChange={(type: string, ids: string[]) => {
                  setFormData((data: any) => ({
                    ...data,
                    target: {
                      type,
                      ids,
                    },
                  }));
                  if (ids.length) {
                    handleFetch(
                      "/batches/" + ids.join(",") + "/students?role=student",
                      setLoadingStudents,
                      setStudents,
                      console.error
                    );
                  }
                }}
              />
            }
            <Collapse in={Boolean(students.length)}>
              <Grid2
                container
                sx={{
                  border: 1,
                  borderRadius: 2.5,
                  borderColor: grey[400],
                  mt: 1,
                  mx: 0,
                }}
                spacing={2}
              >
                {students.map((student: any) => (
                  <Grid2 xs={6}>
                    <Box sx={{ display: "flex", alignItems: "center", pl: 1 }}>
                      <Typography sx={{ flex: 1 }}>{student.name}</Typography>
                      <TextField
                        size="small"
                        type="number"
                        name={`obtained`}
                        sx={{
                          flex: 1,
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderRadius: 2,
                          },
                        }}
                        value={formData["users"]?.[student._id] || ""}
                        onChange={(e) =>
                          setFormData((data: any) => ({
                            ...data,
                            users: {
                              ...data.users,
                              [student._id]: e.target.value,
                            },
                          }))
                        }
                      />
                    </Box>
                  </Grid2>
                ))}
              </Grid2>
            </Collapse>
          </React.Fragment>
        );
      case "targetSelector":
        return (
          // @ts-ignore
          <TargetSelector
            {...field}
            onSelectionChange={(type, ids) => {
              setFormData((data: any) => ({
                ...data,
                target: {
                  type,
                  ids,
                },
              }));
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Grid container spacing={2}>
      {fields.map((field: any, index: number) => (
        <Grid item xs={12} key={index}>
          {renderField(field)}
        </Grid>
      ))}
    </Grid>
  );
};

export default DynamicForm;
