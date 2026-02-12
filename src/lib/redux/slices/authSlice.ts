import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type {
    User,
    LoginDto,
    RegisterDto,
    LoginResponse,
    RegisterResponse,
    Permission,
    Role
} from '@/lib/types/auth.types';
import { toast } from 'sonner';
import { AuthAPI } from '@/lib/api/api';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    permissions: string[];
    roleIds: number[];
}

const initialState: AuthState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    permissions: [],
    roleIds: [],
};

// Async thunks
export const login = createAsyncThunk<LoginResponse, LoginDto>(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await AuthAPI.login(credentials.email, credentials.password);

            // Store tokens in localStorage
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);

            toast.success(response.message || 'Login successful!');
            return response;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Login failed. Please try again.';
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const register = createAsyncThunk<RegisterResponse, RegisterDto>(
    'auth/register',
    async (data, { rejectWithValue }) => {
        try {
            const response = await AuthAPI.register(data);
            toast.success(response.message || 'Registration successful!');
            return response;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const getCurrentUser = createAsyncThunk<User, void>(
    'auth/getCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await AuthAPI.getCurrentUser();
            return response;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to fetch user data';
            return rejectWithValue(message);
        }
    }
);

export const refreshAccessToken = createAsyncThunk<LoginResponse, string>(
    'auth/refreshToken',
    async (refreshToken, { rejectWithValue }) => {
        try {
            const response = await AuthAPI.refreshToken(refreshToken);

            // Update tokens in localStorage
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);

            return response;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Token refresh failed';
            return rejectWithValue(message);
        }
    }
);

// Helper function to extract permissions from roles
const extractPermissions = (user: User): string[] => {
    const permissionSet = new Set<string>();

    user.roles?.forEach((role: Role) => {
        role.permissions?.forEach((permission: Permission) => {
            permissionSet.add(permission.name);
        });
    });

    return Array.from(permissionSet);
};

// Helper function to extract role IDs
const extractRoleIds = (user: User): number[] => {
    return user.roles?.map((role: Role) => role.id) || [];
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.permissions = [];
            state.roleIds = [];
            state.error = null;

            // Clear localStorage
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');

            toast.info('You have been logged out');
        },

        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.permissions = extractPermissions(action.payload);
            state.roleIds = extractRoleIds(action.payload);
            state.isAuthenticated = true;
        },

        clearError: (state) => {
            state.error = null;
        },

        restoreAuth: (state) => {
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');

            if (accessToken && refreshToken) {
                state.accessToken = accessToken;
                state.refreshToken = refreshToken;
                state.isAuthenticated = true;
            }
        },
    },
    extraReducers: (builder) => {
        // Login
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isAuthenticated = true;
            state.permissions = extractPermissions(action.payload.user);
            state.roleIds = extractRoleIds(action.payload.user);
            state.error = null;
        });
        builder.addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
            state.isAuthenticated = false;
        });

        // Register
        builder.addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(register.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.error = null;
        });
        builder.addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Get Current User
        builder.addCase(getCurrentUser.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getCurrentUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.permissions = extractPermissions(action.payload);
            state.roleIds = extractRoleIds(action.payload);
            state.isAuthenticated = true;
        });
        builder.addCase(getCurrentUser.rejected, (state) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        });

        // Refresh Token
        builder.addCase(refreshAccessToken.fulfilled, (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.user = action.payload.user;
            state.permissions = extractPermissions(action.payload.user);
            state.roleIds = extractRoleIds(action.payload.user);
        });
        builder.addCase(refreshAccessToken.rejected, (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        });
    },
});

export const { logout, setUser, clearError, restoreAuth } = authSlice.actions;
export default authSlice.reducer;
