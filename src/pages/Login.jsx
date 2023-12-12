import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import { logIn } from "../../data";

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        STARLUMA
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignIn() {
  const [displayStateWrongCredentials, setDisplayStateWrongCredentials] = React.useState(localStorage.getItem("errorWrongCredentials") ? 'block' : 'none');
  const [displayStateFields, setDisplayStateFields] = React.useState('none');
  const navigate = useNavigate();

  const handleClick = () => {
    setDisplayStateWrongCredentials('none')
    localStorage.removeItem("errorWrongCredentials")
}

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const extractedData = {
      password: data.get('password').trim(),
      username: data.get('username').trim(),
  };
  const containsEmpty = Object.values(extractedData).some(x => x === null || x === '')

  if (containsEmpty) {
      setDisplayStateFields('block')
      return
  } else {
      setDisplayStateFields('none')
  }

  logIn(extractedData).then(
    (res) => {
      if (res[0]) {
        localStorage.setItem("userId", res[1])
        navigate("/")
        location.reload()
      } else {
        localStorage.setItem("errorWrongCredentials", "yes")
        location.reload()
      }
    }
  )

  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs" sx={{bgcolor: "#FFFFFF"}} onClick={handleClick}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
             <Typography variant="h5" gutterBottom sx={{ color: "#f20707", display: displayStateWrongCredentials }}>
                            Wrong credentials
                        </Typography>
                        <Typography variant="h5" gutterBottom sx={{ color: "#f20707", display: displayStateFields }}>
                            Not all fields are filled
                        </Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Register"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}