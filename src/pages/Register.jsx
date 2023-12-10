import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useNavigate } from "react-router-dom";
import { addNewUser, verifyExistingUser } from '../../data';

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

export default function Register() {
    const [gender, setGender] = React.useState('');
    const [displayStateFields, setDisplayStateFields] = React.useState('none');
    const [displayStatePassword, setDisplayStatePassword] = React.useState('none')
    const [displayStateExistingName, setDisplayExistingName] = React.useState(localStorage.getItem("errorExistingName") ? 'block' : 'none')
    const navigate = useNavigate();

    const handleChange = (event) => {
        setGender(event.target.value);
    };

    const handleClick = () => {
        setDisplayExistingName('none')
        localStorage.removeItem("errorExistingName")
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const extractedData = {
            email: data.get('email').trim(),
            password: data.get('password').trim(),
            confirmPassword: data.get('confirm-password').trim(),
            username: data.get('username').trim(),
            gender: gender
        };
        const containsEmpty = Object.values(extractedData).some(x => x === null || x === '')

        if (containsEmpty) {
            setDisplayStateFields('block')
            return
        } else {
            setDisplayStateFields('none')
        }

        if (extractedData.password.trim() != extractedData.confirmPassword.trim()) {
            setDisplayStatePassword('block')
            return
        } else {
            setDisplayStatePassword('none')
        }

        verifyExistingUser(extractedData.username).then(
            (res) => {
                if (res) {
                    localStorage.setItem("errorExistingName", "yes")
                    location.reload()
                }
            }
        )

        addNewUser(extractedData).then(
            (res) => {
                localStorage.setItem("userId", res[1])
                navigate("/")
                location.reload()
            }
        )
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs" sx={{ bgcolor: "#FFFFFF" }} onClick={handleClick}>
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
                        Register
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    name="username"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="confirm-password"
                                    label="Confirm Password"
                                    type="password"
                                    id="confirm-password"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="gender-label">Gender *</InputLabel>
                                    <Select
                                        fullWidth
                                        label="Gender"
                                        labelId="gender-label"
                                        id="gender-label"
                                        value={gender}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={"male"}>Male</MenuItem>
                                        <MenuItem value={"female"}>Female</MenuItem>
                                        <MenuItem value={"other"}>Other</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Typography variant="h5" gutterBottom sx={{ color: "#f20707", display: displayStateExistingName }}>
                            Username already existed
                        </Typography>
                        <Typography variant="h5" gutterBottom sx={{ color: "#f20707", display: displayStateFields }}>
                            Not all fields are filled
                        </Typography>
                        <Typography variant="h5" gutterBottom sx={{ color: "#f20707", display: displayStatePassword }}>
                            Passwords do not match each other
                        </Typography>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/login" variant="body2">
                                    Already have an account? Login
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </ThemeProvider>
    );
}

// export default Register;