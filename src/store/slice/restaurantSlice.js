import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { addNotification } from "@/store/slice/notificationSlice";

/* Thunks */

// Create restaurant
export const createRestaurant = createAsyncThunk(
  "restaurant/createRestaurant",
  async ({ name, slug }, { rejectWithValue, dispatch }) => {
    dispatch(
      addNotification({
        type: "info",
        message: "Creating restaurant...",
        duration: 1500,
      })
    );

    try {
      const res = await axios.post("/api/restaurant", { name, slug });
      const restaurant = res.data?.data;

      dispatch(
        addNotification({
          type: "success",
          message: "Restaurant created successfully",
          duration: 3000,
        })
      );

      return restaurant;
    } catch (err) {
      const message =
        err?.response?.data?.error || "Failed to create restaurant";

      dispatch(
        addNotification({
          type: "error",
          message,
          duration: 4000,
        })
      );

      return rejectWithValue(message);
    }
  }
);

// Fetch all restaurants
export const fetchRestaurants = createAsyncThunk(
  "restaurant/fetchRestaurants",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/restaurant");
      const restaurants = res.data?.data || [];
      return restaurants;
    } catch (err) {
      const message =
        err?.response?.data?.error || "Failed to fetch restaurants";
      return rejectWithValue(message);
    }
  }
);

// Fetch single restaurant by ID
export const fetchRestaurantById = createAsyncThunk(
  "restaurant/fetchRestaurantById",
  async (resId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/restaurant/${resId}`);
      const restaurant = res.data?.data;
      return restaurant;
    } catch (err) {
      const message =
        err?.response?.data?.error || "Failed to fetch restaurant details";
      return rejectWithValue(message);
    }
  }
);

// Update restaurant (PUT /api/restaurant/:resId)
export const updateRestaurant = createAsyncThunk(
  "restaurant/updateRestaurant",
  // payload: { resId: string, data: object | FormData }
  async ({ resId, data }, { rejectWithValue, dispatch }) => {
    dispatch(
      addNotification({
        type: "info",
        message: "Updating restaurant...",
        duration: 1500,
      })
    );

    try {
      const isFormData =
        typeof FormData !== "undefined" && data instanceof FormData;

      const res = await axios.put(`/api/restaurant/${resId}`, data, {
        headers: isFormData
          ? { "Content-Type": "multipart/form-data" }
          : undefined,
      });

      const restaurant = res.data?.data;

      // Only show success if we actually received updated data
      if (restaurant) {
        dispatch(
          addNotification({
            type: "success",
            message: "Restaurant updated successfully",
            duration: 3000,
          })
        );
      }

      return restaurant;
    } catch (err) {
      const message =
        err?.response?.data?.error || "Failed to update restaurant";

      dispatch(
        addNotification({
          type: "error",
          message,
          duration: 4000,
        })
      );

      return rejectWithValue(message);
    }
  }
);

/* Slice */

const initialState = {
  activeRestaurant: null, // currently selected (from list)
  activeRestaurantDetails: null, // full details from /[resId]
  items: [],
  loading: false,
  error: null,
};

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    setActiveRestaurant(state, action) {
      state.activeRestaurant = action.payload;
      state.activeRestaurantDetails = null;
    },
    setRestaurants(state, action) {
      state.items = action.payload || [];
    },
    clearRestaurantState(state) {
      state.activeRestaurant = null;
      state.activeRestaurantDetails = null;
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // createRestaurant
      .addCase(createRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRestaurant.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload) return;

        state.activeRestaurant = action.payload;

        const exists = state.items.find((r) => r._id === action.payload._id);
        if (!exists) {
          state.items.push(action.payload);
        }
      })
      .addCase(createRestaurant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create restaurant";
      })

      // fetchRestaurants (list)
      .addCase(fetchRestaurants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];

        if (!state.activeRestaurant && state.items.length > 0) {
          state.activeRestaurant = state.items[0];
        }
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch restaurants";
      })

      // fetchRestaurantById (detail -> activeRestaurantDetails)
      .addCase(fetchRestaurantById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantById.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload) return;

        const detail = action.payload;

        // keep list in sync
        const idx = state.items.findIndex((r) => r._id === detail._id);
        if (idx !== -1) {
          state.items[idx] = detail;
        } else {
          state.items.push(detail);
        }

        state.activeRestaurantDetails = detail;
      })
      .addCase(fetchRestaurantById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch restaurant details";
        state.activeRestaurantDetails = null;
      })

      // updateRestaurant
      .addCase(updateRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRestaurant.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload) return;

        const updated = action.payload;

        // sync in list
        const idx = state.items.findIndex((r) => r._id === updated._id);
        if (idx !== -1) {
          state.items[idx] = updated;
        } else {
          state.items.push(updated);
        }

        // sync activeRestaurant
        if (
          state.activeRestaurant &&
          state.activeRestaurant._id === updated._id
        ) {
          state.activeRestaurant = updated;
        }

        // sync activeRestaurantDetails
        if (
          state.activeRestaurantDetails &&
          state.activeRestaurantDetails._id === updated._id
        ) {
          state.activeRestaurantDetails = updated;
        }
      })
      .addCase(updateRestaurant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update restaurant";
      });
  },
});

export const { setActiveRestaurant, setRestaurants, clearRestaurantState } =
  restaurantSlice.actions;

export default restaurantSlice.reducer;
