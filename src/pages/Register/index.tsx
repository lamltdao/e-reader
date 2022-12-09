import { Button, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthentication } from "../../context/authentication";

export const Register = () => {
  const navigate = useNavigate();
  const { doRegister } = useAuthentication();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const onSubmit = async () => {
    const { email, password } = formValues;

    try {
      setIsSubmitting(true);

      await doRegister(email, password);

      navigate("/");
    } catch (e) {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Grid
    container
    justifyContent="center"
    alignItems="center"
    flexDirection="column"
    >
      <Grid>
        <Typography variant="h2">Sign up</Typography>
      </Grid>
      <Grid>
        <form>
            <Grid
              container
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <Grid>
                <Typography>Email</Typography>
                <input
                  type="email"
                  required
                  id="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                  size={50}
                />
              </Grid>
              <br />
              <Grid>
                <Typography>Password</Typography>
                <input
                  type="password"
                  required
                  id="password"
                  name="password"
                  value={formValues.password}
                  onChange={handleChange}
                  size={50}
                />
              </Grid>
              <br />
              <Grid
                container
                flexDirection="column"
                alignItems="center"
              >
                <Grid>
                  <Button variant="contained" type="submit" disabled={isSubmitting} onClick={onSubmit}>
                    {isSubmitting ? "registering..." : "register"}
                  </Button>
                </Grid>
                <br />
                <Grid>
                  <Link to="/login">I already have an account</Link>
                </Grid>
              </Grid>
            </Grid>
        </form>
      </Grid>
    </Grid>
  );
};
