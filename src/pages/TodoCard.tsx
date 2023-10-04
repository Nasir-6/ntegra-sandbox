import { Button, Checkbox, Paper, Typography } from "@mui/material";
import React, { useState } from "react";

type Props = {
  id: string;
};

const TodoCard = (props: Props) => {
  const [isDone, setIsDone] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDone(event.target.checked);
  };

  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        minWidth: 300,
      }}
    >
      <Checkbox checked={isDone} onChange={handleChange} />
      <Typography variant="h6">TODO</Typography>
      <Button type="button">Delete</Button>
    </Paper>
  );
};

export default TodoCard;
