"use client";

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveRestaurant,
  setRestaurants,
  clearRestaurantState,
  createRestaurant,
  fetchRestaurants,
  fetchRestaurantById,
  updateRestaurant, // <- added
} from "@/store/slice/restaurantSlice";

export const useRestaurant = () => {
  const dispatch = useDispatch();

  const { activeRestaurant, activeRestaurantDetails, items, loading, error } =
    useSelector((state) => state.restaurant);

  const selectActiveRestaurant = useCallback(
    (restaurant) => {
      dispatch(setActiveRestaurant(restaurant));
    },
    [dispatch]
  );

  const loadRestaurants = useCallback(
    (list) => {
      dispatch(setRestaurants(list));
    },
    [dispatch]
  );

  const resetRestaurantState = useCallback(() => {
    dispatch(clearRestaurantState());
  }, [dispatch]);

  const createNewRestaurant = useCallback(
    (payload) => {
      // payload: { name, slug }
      return dispatch(createRestaurant(payload));
    },
    [dispatch]
  );

  const fetchAllRestaurants = useCallback(() => {
    return dispatch(fetchRestaurants());
  }, [dispatch]);

  const loadRestaurantDetails = useCallback(
    (resId) => {
      return dispatch(fetchRestaurantById(resId));
    },
    [dispatch]
  );

  // NEW: update restaurant helper
  // payload: { resId, data } where data is JSON object or FormData
  const updateRestaurantDetails = useCallback(
    (payload) => {
      return dispatch(updateRestaurant(payload));
    },
    [dispatch]
  );

  return {
    activeRestaurant,
    activeRestaurantDetails,
    restaurants: items,
    loading,
    error,
    // setters / actions
    setActiveRestaurant: selectActiveRestaurant,
    setRestaurants: loadRestaurants,
    clearRestaurantState: resetRestaurantState,
    createRestaurant: createNewRestaurant,
    fetchRestaurants: fetchAllRestaurants,
    fetchRestaurantById: loadRestaurantDetails,
    updateRestaurant: updateRestaurantDetails, // <- exposed to components
  };
};
