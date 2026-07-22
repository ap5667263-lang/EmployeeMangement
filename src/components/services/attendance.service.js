import api from "./api";

export const checkIn = async (data) => {
    // data: { employee, date, remarks }
    const response = await api.post("/attendance/check-in", data);
    return response.data;
};

export const checkOut = async (id, data) => {
    // id: attendance _id, data: { remarks }
    const response = await api.put(`/attendance/check-out/${id}`, data);
    return response.data;
};

export const getAllAttendance = async () => {
    const response = await api.get("/attendance/get");
    return response.data;
};

export const getMonthlyAttendanceReport = async (params) => {
    // params: { month, year }
    const response = await api.get("/attendance/monthly-report", { params });
    return response.data;
};

export const getAttendanceByEmployee = async (employeeId) => {
    const response = await api.get(`/attendance/${employeeId}`);
    return response.data;
};

export const updateAttendance = async (id, data) => {
    const response = await api.put(`/attendance/${id}`, data);
    return response.data;
};

export const deleteAttendance = async (id) => {
    const response = await api.delete(`/attendance/${id}`);
    return response.data;
};
