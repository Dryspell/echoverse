"use client";

import * as React from "react";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { TimePicker } from "@mui/x-date-pickers";
import { useForm } from "@tanstack/react-form";
import { valibotValidator } from "@tanstack/valibot-form-adapter";
import useDetailedMutation from "~/hooks/useDetailedMutation";
import { api } from "convex/_generated/api";
import useSnackbar from "~/hooks/useSnackbar";
import {
  any,
  customAsync,
  minLength,
  number,
  numberAsync,
  string,
  stringAsync,
} from "valibot";
import { Button, Stack, TextField } from "@mui/material";
import { humanReadable } from "~/lib/utils";
import { v } from "convex/values";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  gap: 2,
};

export default function CreateRoomModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { snack } = useSnackbar();
  const { mutate: createRoom, isLoading: isCreatingRoom } = useDetailedMutation(
    api.rooms.createRoom,
    {
      onSuccess: (result) => {
        snack({
          message: `Created Room: ${result.name}!`,
          severity: "success",
        });
        setOpen(false);
      },
      onError: (error) => {
        snack({
          message: `Failed to create room: ${error.message}`,
          severity: "error",
        });
      },
      onMutate: (params) => {
        snack({
          message: "Creating room...",
          severity: "info",
        });
      },
    },
  );

  const { Provider, Field, Subscribe, handleSubmit, state, useStore, reset } =
    useForm({
      defaultValues: {
        name: "",
        description: "",
        startTime: new Date(),
        endTime: new Date(),
      },
      onSubmit: ({ value }) => {
        console.log(value);
        createRoom({
          name: value.name,
          description: value.description,
          startTime: value.startTime.getTime(),
          endTime: value.endTime.getTime(),
        });
        reset();
      },
      validatorAdapter: valibotValidator,
    });

  return (
    <div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div>
          <Provider>
            <Box
              component={"form"}
              onSubmit={(e) => {
                console.log("submitting");
                e.preventDefault();
                e.stopPropagation();
                handleSubmit().catch((e) => console.error(e));
              }}
              sx={style}
            >
              <Stack direction={"column"} spacing={2}>
                <Typography variant="h6" color="primary">
                  Create New Room?
                </Typography>
                <Field
                  name="name"
                  validators={{
                    onChange: string([
                      minLength(3, "Room name must be at least 3 characters"),
                    ]),
                    onChangeAsyncDebounceMs: 500,
                    onChangeAsync: stringAsync([
                      customAsync(async (value) => {
                        await new Promise((resolve) =>
                          setTimeout(resolve, 1000),
                        );
                        return !value.includes("error");
                      }, "No 'error' allowed in name"),
                    ]),
                  }}
                  // eslint-disable-next-line react/no-children-prop
                  children={({ state, handleChange, handleBlur, name }) => {
                    // Avoid hasty abstractions. Render props are great!
                    return (
                      <TextField
                        error={state.meta.errors.length > 0}
                        id="outlined-error-helper-text"
                        label={humanReadable(name)}
                        value={state.value}
                        onChange={(e) => handleChange(e.target.value)}
                        onBlur={handleBlur}
                        helperText={state.meta.errors.join(", ")}
                      />
                    );
                  }}
                />
                <Field
                  name="description"
                  validators={{
                    onChange: string([
                      minLength(3, "Description must be at least 3 characters"),
                    ]),
                    onChangeAsyncDebounceMs: 500,
                    onChangeAsync: stringAsync([
                      customAsync(async (value) => {
                        await new Promise((resolve) =>
                          setTimeout(resolve, 1000),
                        );
                        return !value.includes("error");
                      }, "No 'error' allowed in description"),
                    ]),
                  }}
                  // eslint-disable-next-line react/no-children-prop
                  children={({ state, handleChange, handleBlur, name }) => {
                    // Avoid hasty abstractions. Render props are great!
                    return (
                      <TextField
                        error={state.meta.errors.length > 0}
                        id="outlined-error-helper-text"
                        label={humanReadable(name)}
                        value={state.value}
                        onChange={(e) => handleChange(e.target.value)}
                        onBlur={handleBlur}
                        helperText={state.meta.errors.join(", ")}
                      />
                    );
                  }}
                />
                <Field
                  name="startTime"
                  validators={
                    {
                      // onChange: number(),
                      // onChangeAsyncDebounceMs: 500,
                      // onChangeAsync: numberAsync(),
                    }
                  }
                  // eslint-disable-next-line react/no-children-prop
                  children={({ state, handleChange, name }) => {
                    // Avoid hasty abstractions. Render props are great!
                    return (
                      <TimePicker
                        label={humanReadable(name)}
                        value={state.value}
                        onChange={(e) => {
                          e && handleChange(e);
                        }}
                      />
                    );
                  }}
                />
                <Field
                  name="endTime"
                  validators={{
                    onChange: any(),
                    // onChange: number(),
                    // onChangeAsyncDebounceMs: 500,
                    // onChangeAsync: numberAsync(),
                  }}
                  // eslint-disable-next-line react/no-children-prop
                  children={({ state, handleChange, name }) => {
                    // Avoid hasty abstractions. Render props are great!
                    return (
                      <TimePicker
                        label={humanReadable(name)}
                        value={state.value}
                        onChange={(e) => {
                          e && handleChange(e);
                        }}
                      />
                    );
                  }}
                />
                <Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                >
                  {([canSubmit, isSubmitting]) => (
                    <Button
                      type="submit"
                      disabled={!canSubmit && !(isSubmitting ?? isCreatingRoom)}
                    >
                      {!canSubmit && !(isSubmitting ?? isCreatingRoom)
                        ? "Creating Room..."
                        : "Create Room"}
                    </Button>
                  )}
                </Subscribe>
              </Stack>
            </Box>
          </Provider>
        </div>
      </Modal>
    </div>
  );
}
