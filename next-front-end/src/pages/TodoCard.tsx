import { Button, Checkbox, Paper, Typography } from "@mui/material";
import React, { useState } from "react";

type Todo = {
  id: number;
  todo: string;
  isDone: boolean;
};

type Props = {
  todo: Todo;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

const TodoCard = ({ todo, setTodos }: Props) => {
  const [isDone, setIsDone] = useState(todo.isDone);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDone(event.target.checked);
  };

  const handleDelete = () => {
    console.log("todo.id", todo.id);
    fetch(`http://localhost:8787/api/todos/${todo.id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((deletedTodoId) =>
        setTodos((prev) => prev.filter((todo) => todo.id !== deletedTodoId))
      );
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
      <Button type="button" sx={{ ml: "auto" }} onClick={handleDelete}>
        Delete
      </Button>
    </Paper>
  );
};

export default TodoCard;
