import React, { useState, useRef, useEffect, useMemo } from "react";
import { handleFetch } from "../utils/handleFetch";
import {
  Box,
  Checkbox,
  Fade,
  FormControl,
  Input,
  InputLabel,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Popper,
  Radio,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { grey } from "@mui/material/colors";
import { FileDownload } from "@mui/icons-material";

type Option = { type: string; label: string; value: string };
type Header = { type: "header"; label: string; typeFor: string };
type ItemAll = { type: "all" };
type Item = Option | Header | ItemAll;
type SelectionType = "all" | "userIds" | "batchIds";

export type TargetSelectorProps = {
  onSelectionChange?: (type: string, ids: string[]) => void;
  label?: string;
  selectOnly?: "userIds" | "batchIds";
  single?: boolean;
  defaultValue?: { type: SelectionType | null; ids: string[] };
  readOnly?: true;
  noPrompt?: boolean;
};

export function TargetSelector({
  onSelectionChange,
  label = "Filter Target",
  selectOnly,
  single,
  defaultValue = { type: null, ids: [] },
  readOnly,
  noPrompt,
}: TargetSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([
    ...defaultValue?.ids,
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectionType, setSelectionType] = useState<SelectionType | null>(
    defaultValue.type
  );

  useEffect(() => {
    if (selectOnly) setSelectionType(selectOnly);
  }, []);

  useEffect(() => {
    if (selectionType && onSelectionChange) {
      onSelectionChange(selectionType, selectedOptions);
    }
  }, [selectionType, selectedOptions]);

  const [items, setItems] = useState<Item[]>([]);

  const anchorRef = useRef<HTMLElement>(null);
  const toggleOption = (value: string) => {
    if (selectionType === "all") return;
    if (single) {
      setSelectedOptions([value]);
      return;
    }
    setSelectedOptions((prev) =>
      prev.includes(value)
        ? prev.filter((option) => option !== value)
        : [...prev, value]
    );
  };

  const handleSelectionTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (readOnly) return;
    event.preventDefault();
    setSelectionType(event.target.value as SelectionType);
    setSelectedOptions(event.target.value === "all" ? ["all"] : []);
    setSearchTerm("");
  };

  useEffect(() => {
    let items: Item[] = [];
    items.push({
      type: "all",
    });
    handleFetch(
      "/users?role=student",
      setLoading,
      (userIds: { users: any[] }) => {
        items.push({ type: "header", label: "Student", typeFor: "userIds" });
        userIds.users.map((item) => {
          items.push({
            type: "userIds",
            value: item._id as string,
            label: item.name as string,
          });
        });
      },
      console.log
    );
    handleFetch(
      "/users?role=faculty",
      setLoading,
      (userIds: { users: any[] }) => {
        items.push({ type: "header", label: "Faculty", typeFor: "userIds" });
        userIds.users.map((item) => {
          items.push({
            type: "userIds",
            value: item._id as string,
            label: item.name as string,
          });
        });
      },
      console.log
    );
    handleFetch(
      "/batches",
      setLoading,
      (batchIds: { batches: any[] }) => {
        items.push({ type: "header", label: "Batches", typeFor: "batchIds" });
        batchIds.batches.map((batch) => {
          items.push({
            type: "batchIds",
            value: batch._id as string,
            label: batch.name as string,
          });
        });
      },
      console.log
    );
    setItems(items);
  }, []);

  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    return items.filter((item) => {
      if (item.type === "all") return false;
      if (item.type === "header") return false;
      // @ts-ignore
      return item.label.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [items, searchTerm]);

  if (noPrompt)
    return (
      <Box
        sx={{
          border: 1,
          borderColor: grey[400],
          borderRadius: 2.5,
          py: 1,
          position: "relative",
        }}
      >
        {selectedOptions.map((option) => (
          <input type="hidden" name={selectionType || ""} value={option} />
        ))}
        <Typography
          variant="caption"
          sx={{ position: "absolute", top: "-.6rem", left: ".8rem", bgcolor: 'white', px:.5, opacity: '.8' }}
        >
          {label}
        </Typography>
        <Grid2 container>
          <Grid2 xs={12} sx={{ px: 2, py: 1 }}>
            <Input
              fullWidth
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid2>
          {filteredItems.map((item: any, index) => {
            switch (item.type) {
              case "header":
                return (
                  selectionType === item?.typeFor && (
                    <Grid2 xs={12}>
                      <Typography
                        key={index}
                        variant="caption"
                        sx={{ px: 2, py: 1 }}
                      >
                        {item.label}
                      </Typography>
                    </Grid2>
                  )
                );
              case "userIds":
              case "batchIds":
                return (
                  selectionType === item.type && (
                    <Grid2
                      component={ListItemButton}
                      xs={6}
                      key={item.value}
                      onClick={() => {
                        if (readOnly) return;
                        toggleOption(item.value);
                      }}
                      sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                        pl: 3,
                      }}
                    >
                      {single ? (
                        <Radio checked={selectedOptions.includes(item.value)} />
                      ) : (
                        <Checkbox
                          checked={selectedOptions.includes(item.value)}
                        />
                      )}
                      <Typography>{item.label}</Typography>
                    </Grid2>
                  )
                );
              default:
                return null;
            }
          })}
        </Grid2>
      </Box>
    );

  return (
    <Box>
      {selectedOptions.map((option) => (
        <input type="hidden" name={selectionType || ""} value={option} />
      ))}
      <TextField
        // @ts-ignore
        ref={anchorRef}
        fullWidth
        label={label}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        sx={{
          "& .MuiOutlinedInput-notchedOutline": { borderRadius: 2.5 },
          bgcolor: "white",
          "& input": {
            caretColor: "transparent",
            cursor: "pointer",
          },
        }}
        autoComplete="false"
        value={
          selectionType && selectedOptions.length
            ? single
              ? (items as any[]).find(
                  (item: any) => item.value === selectedOptions[0]
                )?.label
              : `${selectionType == "all" ? "All" : ""}${
                  selectionType == "batchIds"
                    ? `${selectedOptions.length} ${
                        selectedOptions.length > 1 ? "Batches" : "Batch"
                      }`
                    : ""
                }${
                  selectionType == "userIds"
                    ? `${selectedOptions.length} ${
                        selectedOptions.length > 1 ? "People" : "Person"
                      }`
                    : ""
                }`
            : ""
        }
        InputLabelProps={{
          shrink: Boolean(selectionType && selectedOptions.length),
        }}
        required
        // onMouseLeave={() => setIsOpen(false)}
      />
      <Popper
        open={isOpen}
        anchorEl={anchorRef.current}
        placement="top-end"
        sx={{ zIndex: 1300 }}
        transition
        onMouseLeave={() => setIsOpen(false)}
        // onMouseEnter={() => setIsOpen(true)}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper
              sx={{
                width: 400,
                maxHeight: "50vh",
                minHeight: "10vh",
                // borderRadius: 2.5,
                display: "flex",
                flexFlow: "column",
                my: 0.5,
              }}
              elevation={4}
            >
              <Box p={2}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={{ zIndex: 1500 }}
                >
                  <InputLabel>Select type</InputLabel>
                  <Select
                    value={selectionType || ""}
                    // @ts-ignore
                    onChange={handleSelectionTypeChange}
                    label="Select type"
                  >
                    <MenuItem value="" disabled>
                      <em>None</em>
                    </MenuItem>
                    {selectOnly === undefined && (
                      <MenuItem value="all">All</MenuItem>
                    )}
                    {(selectOnly === "batchIds" ||
                      selectOnly === undefined) && (
                      <MenuItem value="batchIds">Batches</MenuItem>
                    )}
                    {(selectOnly === "userIds" || selectOnly === undefined) && (
                      <MenuItem value="userIds">People</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ overflow: "auto", flex: 1 }}>
                {selectionType !== "all" && (
                  <Box p={2}>
                    <Input
                      fullWidth
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </Box>
                )}

                {selectionType && (
                  <Box>
                    {selectionType === "all" ? (
                      <MenuItem>
                        <Typography>All selected</Typography>
                      </MenuItem>
                    ) : (
                      filteredItems.map((item: any, index) => {
                        switch (item.type) {
                          case "header":
                            return (
                              selectionType === item?.typeFor && (
                                <Typography
                                  key={index}
                                  variant="caption"
                                  sx={{ px: 2, py: 1 }}
                                >
                                  {item.label}
                                </Typography>
                              )
                            );
                          case "userIds":
                          case "batchIds":
                            return (
                              selectionType === item.type && (
                                <MenuItem
                                  key={item.value}
                                  onClick={() => {
                                    if (readOnly) return;
                                    toggleOption(item.value);
                                  }}
                                  dense
                                >
                                  {single ? (
                                    <Radio
                                      checked={selectedOptions.includes(
                                        item.value
                                      )}
                                    />
                                  ) : (
                                    <Checkbox
                                      checked={selectedOptions.includes(
                                        item.value
                                      )}
                                    />
                                  )}
                                  <ListItemText primary={item.label} />
                                </MenuItem>
                              )
                            );
                          default:
                            return null;
                        }
                      })
                    )}
                  </Box>
                )}
              </Box>
            </Paper>
          </Fade>
        )}
      </Popper>
    </Box>
  );
}
