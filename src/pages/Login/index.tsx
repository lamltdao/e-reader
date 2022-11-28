import { Button, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthentication } from "../../context/authentication";

export const Login = () => {
  const navigate = useNavigate();
  const { doLogin } = useAuthentication();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const onSubmit = async () => {
    const { email, password } = formValues;

    try {
      setIsSubmitting(true);

      await doLogin(email, password);

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
        <Typography variant="h2">Login</Typography>
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
                    {isSubmitting ? "logging..." : "login"}
                  </Button>
                </Grid>
                <br />
                <Grid>
                  <Link to="/register">I don't have an account yet!</Link>
                </Grid>
              </Grid>
            </Grid>
        </form>
      </Grid>
    </Grid>
  );
};
