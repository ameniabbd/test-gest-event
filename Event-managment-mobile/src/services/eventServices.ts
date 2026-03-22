
import axiosInstance from "../config/axios";

export const getEvents = async () => {
  const { data } = await axiosInstance.get('/events');
  return data;
};

export const getEventById = async (id: string) => {
  const { data } = await axiosInstance.get(`/events/${id}`);
  return data;
};

export const registerToEvent = async (id: string) => {
  const { data } = await axiosInstance.post(`/events/${id}/register`);
  return data;
};