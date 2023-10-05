import { Button, Checkbox, Paper, Typography } from "@mui/material";
import React, { useState } from "react";

type Todo = {
  id: number;
  todo: string;
  isDone: boolean;
};

type Props = {
  todo: Todo;
};

const TodoCard = ({ todo }: Props) => {
  const [isDone, setIsDone] = useState(todo.isDone);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDone(event.target.checked);
  };

  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        alignItems: "center",
        minWidth: 500,
      }}
    >
      <Checkbox checked={isDone} onChange={handleChange} />
      <Typography variant="h6">{todo.todo}</Typography>
      <Button type="button" sx={{ ml: "auto" }}>
        Delete
      </Button>
    </Paper>
  );
};

export default TodoCard;
