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
        alignItems: "center",
        minWidth: 500,
      }}
    >
      <Checkbox checked={isDone} onChange={handleChange} />
      <Typography variant="h6">Some random todo item</Typography>
      <Button type="button" sx={{ ml: "auto" }}>
        Delete
      </Button>
    </Paper>
  );
};

export default TodoCard;
